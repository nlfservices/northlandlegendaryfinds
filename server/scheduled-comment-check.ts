/**
 * Scheduled task endpoint for checking Facebook comments every 4 hours.
 * POST /api/scheduled/check-comments
 * 
 * Fetches new comments from posts in the last 7 days,
 * saves them to the database, and auto-generates AI replies.
 * 
 * Replies are NOT auto-sent — they go to the admin dashboard
 * for review/approval before being posted.
 */
import { Express, Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { invokeLLM } from "./_core/llm";
import {
  getCommentReplyByCommentId,
  createCommentReply,
  getCommentReplies,
  updateCommentReply,
} from "./db";
import {
  isFacebookConfigured,
  getRecentPosts,
  getPostComments,
} from "./facebook-api";

const PAGE_ID = process.env.FB_PAGE_ID || "";

/**
 * Check if a comment should be skipped
 */
function shouldSkipComment(comment: { from: { id: string; name: string }; message: string }): { skip: boolean; reason?: string } {
  if (comment.from.id === PAGE_ID) {
    return { skip: true, reason: "Page's own comment" };
  }

  const msg = comment.message.trim();

  if (!msg) {
    return { skip: true, reason: "Empty comment" };
  }

  const words = msg.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 2) {
    return { skip: true, reason: "Single word comment" };
  }

  if (!/[a-zA-Z0-9]/.test(msg)) {
    return { skip: true, reason: "Emoji-only comment" };
  }

  const spamPatterns = [
    /\b(buy|sell|discount|promo|click here|check my|dm me|inbox me)\b/i,
    /https?:\/\/[^\s]+\.(ru|cn|tk|xyz|buzz)/i,
    /\b(crypto|bitcoin|forex|investment opportunity)\b/i,
  ];
  for (const pattern of spamPatterns) {
    if (pattern.test(msg)) {
      return { skip: true, reason: "Spam detected" };
    }
  }

  return { skip: false };
}

/**
 * Generate an on-brand NLF reply using AI
 */
async function generateAIReply(commenterName: string, commentText: string): Promise<string> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are the social media voice for Northland Legendary Finds (NLF), a Marvel collector community and content hub. You reply to Facebook comments on your page's posts.

BRAND VOICE RULES:
- Casual, knowledgeable, community-focused — NEVER corporate or salesy
- NLF is NOT a card shop — it's a collector community and content hub
- NEVER push products or mention selling/buying cards
- NEVER link to /cards page
- Match the energy of the comment (funny→funny, thoughtful→thoughtful, excited→excited)
- Keep replies concise (1-3 sentences max)
- Use first names when addressing people
- Ask a follow-up question in about 1 out of 3 replies to drive engagement
- In about 1 out of 4 replies, naturally mention relevant NLF content with a link (use ONLY these paths):
  • northlandlegendaryfinds.com/mcu-news — for MCU/Marvel news discussion
  • northlandlegendaryfinds.com/movies-series — for movie/show discussion
  • northlandlegendaryfinds.com/marvel-characters — for character discussions
  • northlandlegendaryfinds.com/about — for learning about the community
- NEVER use /cards, /shop, /checklists, or any product-related links
- Use emojis sparingly (0-2 per reply, only when natural)
- Sound like a real person, not a bot
- Reference Marvel knowledge naturally when relevant`,
      },
      {
        role: "user",
        content: `Reply to this Facebook comment on our page's post:

Commenter: ${commenterName}
Comment: "${commentText}"

Write a single reply (1-3 sentences). Be natural and on-brand.`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Failed to generate reply from LLM");
  }

  return content.replace(/^["']|["']$/g, "").trim();
}

export function registerCommentCheckRoute(app: Express) {
  app.post("/api/scheduled/check-comments", async (req: Request, res: Response) => {
    try {
      // Authenticate the request
      const user = await sdk.authenticateRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Allow user role (scheduled tasks get user role) and admin
      if (user.role !== "user" && user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }

      if (!isFacebookConfigured()) {
        return res.json({ ok: true, skipped: "Facebook not configured" });
      }

      console.log("[Comment Check] Starting scheduled comment check...");

      // Get recent posts (last 7 days)
      const postsResult = await getRecentPosts(25);
      if (!postsResult.success || !postsResult.posts) {
        console.error("[Comment Check] Failed to fetch posts:", postsResult.error);
        return res.status(500).json({
          error: postsResult.error || "Failed to fetch posts",
          timestamp: new Date().toISOString(),
        });
      }

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentPosts = postsResult.posts.filter(post => {
        const postDate = new Date(post.created_time);
        return postDate >= sevenDaysAgo;
      });

      let newComments = 0;
      let skipped = 0;
      let generated = 0;
      let generationFailed = 0;

      for (const post of recentPosts) {
        try {
          const commentsResult = await getPostComments(post.id);
          if (!commentsResult.success || !commentsResult.comments) continue;

          for (const comment of commentsResult.comments) {
            // Check if we already have this comment
            const existing = await getCommentReplyByCommentId(comment.id);
            if (existing) continue;

            // Check if comment is from last 7 days
            const commentDate = new Date(comment.created_time);
            if (commentDate < sevenDaysAgo) continue;

            // Check if should skip
            const skipCheck = shouldSkipComment(comment);
            if (skipCheck.skip) {
              await createCommentReply({
                postId: post.id,
                commentId: comment.id,
                commenterName: comment.from.name,
                commentText: comment.message,
                commentedAt: commentDate,
                status: "skipped",
                note: skipCheck.reason,
              });
              skipped++;
              continue;
            }

            // Save the comment
            const replyId = await createCommentReply({
              postId: post.id,
              commentId: comment.id,
              commenterName: comment.from.name,
              commentText: comment.message,
              commentedAt: commentDate,
              status: "pending",
            });
            newComments++;

            // Auto-generate a reply
            try {
              const reply = await generateAIReply(comment.from.name, comment.message);
              await updateCommentReply(replyId, { generatedReply: reply });
              generated++;
              // Small delay between LLM calls
              await new Promise(resolve => setTimeout(resolve, 1500));
            } catch (err) {
              console.error(`[Comment Check] Failed to generate reply for comment ${comment.id}:`, err);
              generationFailed++;
            }
          }
        } catch (err: any) {
          console.error(`[Comment Check] Error processing post ${post.id}:`, err.message);
        }
      }

      const summary = {
        ok: true,
        postsChecked: recentPosts.length,
        newComments,
        skipped,
        repliesGenerated: generated,
        generationFailed,
        timestamp: new Date().toISOString(),
      };

      console.log("[Comment Check] Complete:", JSON.stringify(summary));
      return res.json(summary);
    } catch (error: any) {
      console.error("[Comment Check] Error:", error.message);
      return res.status(500).json({
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        context: { url: req.url },
        timestamp: new Date().toISOString(),
      });
    }
  });
}
