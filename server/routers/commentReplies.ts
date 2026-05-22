import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import {
  getCommentReplies,
  getCommentReplyByCommentId,
  createCommentReply,
  updateCommentReply,
  getPendingCommentReplies,
  getSentCommentReplies,
} from "../db";
import {
  isFacebookConfigured,
  getRecentPosts,
  getPostComments,
  replyToComment,
} from "../facebook-api";

/**
 * Comment Replies Router
 * Manages the automated Facebook comment reply pipeline:
 * Fetch comments → Generate AI replies → Approve → Send
 */

const PAGE_ID = process.env.FB_PAGE_ID || "";

/**
 * Determine if a comment should be skipped (spam, emoji-only, single word, page's own comment)
 */
function shouldSkipComment(comment: { from: { id: string; name: string }; message: string }): { skip: boolean; reason?: string } {
  // Skip page's own comments
  if (comment.from.id === PAGE_ID) {
    return { skip: true, reason: "Page's own comment" };
  }

  const msg = comment.message.trim();

  // Skip empty
  if (!msg) {
    return { skip: true, reason: "Empty comment" };
  }

  // Skip single word (less than 2 words)
  const words = msg.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 2) {
    return { skip: true, reason: "Single word comment" };
  }

  // Skip emoji-only (no letters or numbers)
  if (!/[a-zA-Z0-9]/.test(msg)) {
    return { skip: true, reason: "Emoji-only comment" };
  }

  // Skip obvious spam patterns
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
async function generateAIReply(commenterName: string, commentText: string, postContext?: string): Promise<string> {
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
- Reference Marvel knowledge naturally when relevant

EXAMPLES OF GOOD REPLIES:
- "Right?! That reveal blew my mind too. The way they're building up to Secret Wars is insane 🔥"
- "Hey Marcus! Totally agree — Doom's arc has been the most compelling villain story in the MCU. Who do you think should direct his solo film?"
- "That's such a great point about the multiverse implications. We actually broke down all the timeline connections over at northlandlegendaryfinds.com/mcu-news if you want to dive deeper!"
- "Haha honestly same. My wallet is NOT ready for this wave of releases 😅"`,
      },
      {
        role: "user",
        content: `Reply to this Facebook comment on our page's post${postContext ? ` (post was about: ${postContext})` : ""}:

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

  // Clean up any quotes the LLM might wrap the reply in
  return content.replace(/^["']|["']$/g, "").trim();
}

export const commentRepliesRouter = router({
  /**
   * Fetch new comments from recent Facebook posts (last 7 days)
   * Saves new comments to the database and auto-generates replies
   */
  fetchNewComments: adminProcedure.mutation(async () => {
    if (!isFacebookConfigured()) {
      return { success: false, error: "Facebook not configured", newComments: 0, skipped: 0 };
    }

    // Get recent posts (last 7 days worth — fetch more to ensure coverage)
    const postsResult = await getRecentPosts(25);
    if (!postsResult.success || !postsResult.posts) {
      return { success: false, error: postsResult.error || "Failed to fetch posts", newComments: 0, skipped: 0 };
    }

    // Filter to posts from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentPosts = postsResult.posts.filter(post => {
      const postDate = new Date(post.created_time);
      return postDate >= sevenDaysAgo;
    });

    let newComments = 0;
    let skipped = 0;
    const errors: string[] = [];

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
            // Save as skipped so we don't re-process
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

          // Save the comment as pending (reply will be generated separately)
          await createCommentReply({
            postId: post.id,
            commentId: comment.id,
            commenterName: comment.from.name,
            commentText: comment.message,
            commentedAt: commentDate,
            status: "pending",
          });
          newComments++;
        }
      } catch (err: any) {
        errors.push(`Post ${post.id}: ${err.message}`);
      }
    }

    return {
      success: true,
      newComments,
      skipped,
      postsChecked: recentPosts.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  }),

  /**
   * Generate AI reply for a specific pending comment
   */
  generateReply: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const replies = await getCommentReplies("pending");
      const comment = replies.find(r => r.id === input.id);
      if (!comment) {
        return { success: false, error: "Comment not found or not pending" };
      }

      try {
        const reply = await generateAIReply(comment.commenterName, comment.commentText);
        await updateCommentReply(input.id, { generatedReply: reply });
        return { success: true, reply };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }),

  /**
   * Bulk generate replies for all pending comments without replies
   */
  generateAllReplies: adminProcedure.mutation(async () => {
    const pending = await getCommentReplies("pending");
    const needsReply = pending.filter(c => !c.generatedReply);

    let generated = 0;
    let failed = 0;

    for (const comment of needsReply) {
      try {
        const reply = await generateAIReply(comment.commenterName, comment.commentText);
        await updateCommentReply(comment.id, { generatedReply: reply });
        generated++;
        // Small delay between LLM calls
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        failed++;
      }
    }

    return { success: true, generated, failed, total: needsReply.length };
  }),

  /**
   * List comment replies by status
   */
  list: adminProcedure
    .input(z.object({ status: z.enum(["all", "pending", "approved", "rejected", "sent", "skipped"]).default("all") }))
    .query(async ({ input }) => {
      const replies = await getCommentReplies(input.status);
      return replies;
    }),

  /**
   * Update the generated reply text (edit before approving)
   */
  editReply: adminProcedure
    .input(z.object({ id: z.number(), reply: z.string().min(1) }))
    .mutation(async ({ input }) => {
      await updateCommentReply(input.id, { generatedReply: input.reply });
      return { success: true };
    }),

  /**
   * Approve a reply for sending
   */
  approve: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await updateCommentReply(input.id, { status: "approved" });
      return { success: true };
    }),

  /**
   * Reject a reply (won't be sent)
   */
  reject: adminProcedure
    .input(z.object({ id: z.number(), reason: z.string().optional() }))
    .mutation(async ({ input }) => {
      await updateCommentReply(input.id, {
        status: "rejected",
        note: input.reason || "Manually rejected",
      });
      return { success: true };
    }),

  /**
   * Send an approved reply to Facebook
   */
  sendReply: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const replies = await getCommentReplies("approved");
      const comment = replies.find(r => r.id === input.id);
      if (!comment) {
        return { success: false, error: "Comment not found or not approved" };
      }
      if (!comment.generatedReply) {
        return { success: false, error: "No reply text to send" };
      }

      const result = await replyToComment(comment.commentId, comment.generatedReply);
      if (!result.success) {
        return { success: false, error: result.error };
      }

      await updateCommentReply(input.id, {
        status: "sent",
        repliedAt: new Date(),
        replyCommentId: result.replyId,
      });

      return { success: true, replyId: result.replyId };
    }),

  /**
   * Send all approved replies
   */
  sendAllApproved: adminProcedure.mutation(async () => {
    const approved = await getCommentReplies("approved");
    const toSend = approved.filter(c => c.generatedReply);

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const comment of toSend) {
      try {
        const result = await replyToComment(comment.commentId, comment.generatedReply!);
        if (result.success) {
          await updateCommentReply(comment.id, {
            status: "sent",
            repliedAt: new Date(),
            replyCommentId: result.replyId,
          });
          sent++;
        } else {
          errors.push(`${comment.commenterName}: ${result.error}`);
          failed++;
        }
        // Rate limit: wait between sends
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err: any) {
        errors.push(`${comment.commenterName}: ${err.message}`);
        failed++;
      }
    }

    return { success: true, sent, failed, errors: errors.length > 0 ? errors : undefined };
  }),

  /**
   * Get sent replies history
   */
  sentHistory: adminProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return getSentCommentReplies(input.limit);
    }),

  /**
   * Regenerate a reply for a comment
   */
  regenerateReply: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const allReplies = await getCommentReplies("all");
      const comment = allReplies.find(r => r.id === input.id);
      if (!comment) {
        return { success: false, error: "Comment not found" };
      }

      try {
        const reply = await generateAIReply(comment.commenterName, comment.commentText);
        await updateCommentReply(input.id, { generatedReply: reply, status: "pending" });
        return { success: true, reply };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }),
});
