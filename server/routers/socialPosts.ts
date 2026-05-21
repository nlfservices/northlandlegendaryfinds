import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { getArticleById } from "../db";
import {
  isFacebookConfigured,
  isInstagramConfigured,
  publishPost,
  publishPhotoPost,
  publishInstagramPost,
  getRecentPosts,
  getRecentInstagramPosts,
  checkTokenHealth,
} from "../facebook-api";

/**
 * Social Post Generator Router
 * Generates ready-to-copy Facebook posts from published articles using AI
 * + Direct Facebook publishing when Page Access Token is configured
 */

export const socialPostRouter = router({
  /**
   * Check if Facebook auto-posting is configured
   */
  facebookStatus: adminProcedure.query(() => {
    return {
      configured: isFacebookConfigured(),
      pageId: process.env.FB_PAGE_ID || null,
    };
  }),

  /**
   * Check if Instagram posting is configured
   */
  instagramStatus: adminProcedure.query(() => {
    return {
      configured: isInstagramConfigured(),
      accountId: process.env.IG_BUSINESS_ACCOUNT_ID || null,
    };
  }),

  /**
   * Check token health - expiration, validity, scopes
   * Used by the admin dashboard to show persistent alerts
   */
  tokenHealth: adminProcedure.query(async () => {
    return await checkTokenHealth();
  }),

  /**
   * Publish a post to Instagram
   */
  publishToInstagram: adminProcedure
    .input(z.object({
      caption: z.string().min(1),
      imageUrl: z.string().url(),
    }))
    .mutation(async ({ input }) => {
      if (!isInstagramConfigured()) {
        return {
          success: false,
          error: "Instagram not configured. Add IG_BUSINESS_ACCOUNT_ID and FB_PAGE_ACCESS_TOKEN in Settings → Secrets.",
        };
      }
      return await publishInstagramPost(input);
    }),

  /**
   * Get recent Instagram posts
   */
  getRecentInstagramPosts: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(25).default(10) }))
    .query(async ({ input }) => {
      if (!isInstagramConfigured()) {
        return { configured: false, posts: [] };
      }
      const result = await getRecentInstagramPosts(input.limit);
      return {
        configured: true,
        posts: result.posts || [],
        error: result.error,
      };
    }),

  /**
   * Generate a Facebook post from an article
   */
  generateFromArticle: adminProcedure
    .input(z.object({
      articleId: z.number(),
      tone: z.enum(["hype", "mystery", "casual", "educational", "funny"]).default("hype"),
      includeHashtags: z.boolean().default(true),
      includeEmoji: z.boolean().default(true),
      includeLink: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const article = await getArticleById(input.articleId);
      if (!article) throw new Error("Article not found");

      const toneGuide: Record<string, string> = {
        hype: "Energetic, exciting, FOMO-inducing. Use caps for emphasis. Make people feel like they NEED to read this NOW.",
        mystery: "Mysterious, teasing, question-based. Build curiosity. Make people wonder what they don't know.",
        casual: "Conversational, friendly, like texting a buddy about something cool you found.",
        educational: "Informative, value-driven. Lead with the insight or data point that makes people smarter.",
        funny: "Humorous, self-deprecating, relatable. Make people laugh first, then click.",
      };

      const prompt = `You are a social media expert for Northland Legendary Finds (NLF), a Marvel trading card community and shop. Generate a killer Facebook post for this article.

ARTICLE TITLE: ${article.title}
ARTICLE EXCERPT: ${article.excerpt || ""}
ARTICLE CATEGORY: ${article.category}
ARTICLE TAGS: ${JSON.stringify(article.tags || [])}
CARD MARKET IMPACT: ${article.cardMarketImpact || "N/A"}
RELATED CHARACTERS: ${JSON.stringify(article.relatedCharacters || [])}

ARTICLE CONTENT (first 2000 chars):
${article.contentMarkdown?.substring(0, 2000) || ""}

TONE: ${input.tone} — ${toneGuide[input.tone]}

RULES:
1. The post should be 150-400 words (Facebook sweet spot for engagement)
2. Start with an attention-grabbing hook (first 2 lines are EVERYTHING on Facebook)
3. Use line breaks liberally — nobody reads walls of text on mobile
4. ${input.includeEmoji ? "Use emojis strategically (not every line, but for emphasis)" : "Do NOT use emojis"}
5. ${input.includeLink ? `End with the article link: https://northlandlegendaryfinds.com/mcu-news/${article.slug}` : "Do NOT include a link"}
6. ${input.includeHashtags ? "Include 15-20 relevant hashtags at the very end (after a line break)" : "Do NOT include hashtags"}
7. Include a call-to-action or engagement prompt (question, poll, "drop a fire emoji if...")
8. Reference specific details from the article to add credibility
9. If there's a card market angle, mention it — that's our unique value prop
10. Sign off with "Follow Northland Legendary Finds for daily MCU intel and Marvel card market updates."

HASHTAG GUIDELINES (if including):
- Mix high-volume (#Marvel #MCU #AvengersDoomsday) with niche (#MarvelCards #ToppsMarvelMint #CardCollector)
- Include character-specific tags for the article's characters
- Keep to 15-20 max

Generate ONLY the Facebook post text. No explanations, no "here's your post" intro. Just the raw post content ready to copy-paste.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are a viral social media copywriter specializing in Marvel content and trading card communities. You write posts that stop the scroll and drive engagement." },
          { role: "user", content: prompt },
        ],
      });

      const postContent = (response.choices?.[0]?.message?.content as string) || "";

      return {
        post: postContent,
        articleTitle: article.title,
        articleSlug: article.slug,
        articleUrl: `https://northlandlegendaryfinds.com/mcu-news/${article.slug}`,
        articleImage: article.featuredImageUrl || null,
        tone: input.tone,
        facebookConfigured: isFacebookConfigured(),
      };
    }),

  /**
   * Publish a post directly to Facebook Page
   */
  publishToFacebook: adminProcedure
    .input(z.object({
      message: z.string().min(1),
      link: z.string().url().optional(),
      photoUrl: z.string().url().optional(),
      scheduledTime: z.number().optional(), // Unix timestamp
    }))
    .mutation(async ({ input }) => {
      if (!isFacebookConfigured()) {
        return {
          success: false,
          error: "Facebook not configured. Add FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN in Settings → Secrets.",
        };
      }

      // If photo URL provided, publish as photo post
      if (input.photoUrl) {
        const result = await publishPhotoPost({
          message: input.message,
          photoUrl: input.photoUrl,
        });
        return result;
      }

      // Otherwise publish as text/link post
      const result = await publishPost({
        message: input.message,
        link: input.link,
        scheduledTime: input.scheduledTime,
      });
      return result;
    }),

  /**
   * Get recent Facebook posts (for preview/history)
   */
  getRecentFacebookPosts: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(25).default(10) }))
    .query(async ({ input }) => {
      if (!isFacebookConfigured()) {
        return { configured: false, posts: [] };
      }
      const result = await getRecentPosts(input.limit);
      return {
        configured: true,
        posts: result.posts || [],
        error: result.error,
      };
    }),

  /**
   * Generate multiple post variations for A/B testing
   */
  generateVariations: adminProcedure
    .input(z.object({
      articleId: z.number(),
      count: z.number().min(2).max(4).default(3),
    }))
    .mutation(async ({ input }) => {
      const article = await getArticleById(input.articleId);
      if (!article) throw new Error("Article not found");

      const tones = ["hype", "mystery", "casual", "funny"] as const;
      const selectedTones = tones.slice(0, input.count);

      const prompt = `You are a social media expert for Northland Legendary Finds (NLF), a Marvel trading card community. Generate ${input.count} DIFFERENT Facebook post variations for this article. Each should have a completely different angle/hook.

ARTICLE TITLE: ${article.title}
ARTICLE EXCERPT: ${article.excerpt || ""}
ARTICLE TAGS: ${JSON.stringify(article.tags || [])}
CARD MARKET IMPACT: ${article.cardMarketImpact || "N/A"}

ARTICLE CONTENT (first 1500 chars):
${article.contentMarkdown?.substring(0, 1500) || ""}

Generate ${input.count} variations with these tones: ${selectedTones.join(", ")}

Each variation should:
- Be 150-300 words
- Have a completely different opening hook
- Include emojis and hashtags
- End with the link: https://northlandlegendaryfinds.com/mcu-news/${article.slug}
- Include "Follow Northland Legendary Finds" sign-off

Return as JSON array with this exact format:
[{"tone": "hype", "post": "..."}, {"tone": "mystery", "post": "..."}, ...]

Return ONLY the JSON array. No markdown code blocks, no explanations.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are a viral social media copywriter. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
      });

      const content = (response.choices?.[0]?.message?.content as string) || "[]";
      let variations;
      try {
        // Strip markdown code blocks if present
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        variations = JSON.parse(cleaned);
      } catch {
        variations = [{ tone: "hype", post: content }];
      }

      return {
        articleTitle: article.title,
        articleUrl: `https://northlandlegendaryfinds.com/mcu-news/${article.slug}`,
        variations,
        facebookConfigured: isFacebookConfigured(),
      };
    }),
});
