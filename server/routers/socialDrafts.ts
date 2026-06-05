import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { generateImage } from "../_core/imageGeneration";
import {
  getArticleById,
  getSocialPostDrafts,
  getSocialPostDraftByArticleId,
  getArticlesWithoutSocialPosts,
  createSocialPostDraft,
  updateSocialPostDraft,
  deleteSocialPostDraft,
  getPublishedSocialPosts,
} from "../db";
import {
  isFacebookConfigured,
  isInstagramConfigured,
  publishPhotoPost,
  publishInstagramPost,
} from "../facebook-api";
import { registerPostForMonitoring } from "../bot-post-monitor";

/**
 * Social Drafts Router
 * Full pipeline: Generate content + image → Preview → Publish to FB/IG
 */
export const socialDraftsRouter = router({
  /**
   * Get all articles that haven't been posted to social media yet
   */
  unpostedArticles: adminProcedure.query(async () => {
    const articles = await getArticlesWithoutSocialPosts();
    return articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      category: a.category,
      featuredImageUrl: a.featuredImageUrl,
      excerpt: a.excerpt,
      publishedAt: a.publishedAt,
      tags: a.tags,
      relatedCharacters: a.relatedCharacters,
    }));
  }),

  /**
   * Get all drafts (pending + published)
   */
  listDrafts: adminProcedure
    .input(z.object({ status: z.enum(["all", "draft", "ready", "approved", "published", "failed"]).default("all") }))
    .query(async ({ input }) => {
      const drafts = await getSocialPostDrafts();
      // Enrich drafts with article titles
      const enrichedDrafts = await Promise.all(
        drafts.map(async (d) => {
          const article = await getArticleById(d.articleId);
          return {
            ...d,
            articleTitle: article?.title || `Article #${d.articleId}`,
            articleSlug: article?.slug || "",
            articleFeaturedImage: article?.featuredImageUrl || "",
          };
        })
      );
      if (input.status === "all") return enrichedDrafts;
      return enrichedDrafts.filter((d) => d.status === input.status);
    }),

  /**
   * Generate AI content + image for an article's social post
   */
  generateDraft: adminProcedure
    .input(z.object({
      articleId: z.number(),
      tone: z.enum(["hype", "mystery", "casual", "educational", "funny"]).default("hype"),
    }))
    .mutation(async ({ input }) => {
      const article = await getArticleById(input.articleId);
      if (!article) throw new Error("Article not found");

      // Check if draft already exists
      const existing = await getSocialPostDraftByArticleId(input.articleId);
      if (existing) {
        throw new Error("A draft already exists for this article. Delete it first or use regenerate.");
      }

      const toneGuide: Record<string, string> = {
        hype: "Energetic, exciting, FOMO-inducing. Use caps for emphasis. Make people feel like they NEED to read this NOW.",
        mystery: "Mysterious, teasing, question-based. Build curiosity.",
        casual: "Conversational, friendly, like texting a buddy about something cool.",
        educational: "Informative, value-driven. Lead with the insight that makes people smarter.",
        funny: "Humorous, self-deprecating, relatable. Make people laugh first, then click.",
      };

      // Generate FB post, IG caption, and first comment in one call
      const contentPrompt = `You are a social media expert for Northland Legendary Finds (NLF), a Marvel trading card community. Generate social media content for this article.

ARTICLE TITLE: ${article.title}
ARTICLE EXCERPT: ${article.excerpt || ""}
ARTICLE CATEGORY: ${article.category}
ARTICLE TAGS: ${JSON.stringify(article.tags || [])}
CARD MARKET IMPACT: ${article.cardMarketImpact || "N/A"}
RELATED CHARACTERS: ${JSON.stringify(article.relatedCharacters || [])}

ARTICLE CONTENT (first 2000 chars):
${article.contentMarkdown?.substring(0, 2000) || ""}

TONE: ${input.tone} — ${toneGuide[input.tone]}

Generate THREE pieces of content:

1. FACEBOOK POST (150-350 words):
- Attention-grabbing hook in first 2 lines
- Use line breaks liberally
- Use emojis strategically
- Include engagement prompt (question, poll)
- End with link: https://northlandlegendaryfinds.com/mcu-news/${article.slug}
- Include 15-20 hashtags at the end
- Sign off: "Follow Northland Legendary Finds for daily MCU intel 🃏"

2. INSTAGRAM CAPTION (100-200 words):
- Shorter, punchier version
- Include "Follow @northlandlegendaryfinds for daily MCU intel 🃏"
- Include 20-25 hashtags
- No link (IG doesn't support clickable links in captions)

3. FIRST COMMENT (1-2 sentences):
- Card market angle or call-to-action
- Reference northlandlegendaryfinds.com
- Include a card emoji 🃏

Return as JSON with this exact format:
{"fbPost": "...", "igCaption": "...", "firstComment": "..."}

Return ONLY the JSON. No markdown code blocks.`;

      const contentResponse = await invokeLLM({
        messages: [
          { role: "system", content: "You are a viral social media copywriter for Marvel content. Return only valid JSON." },
          { role: "user", content: contentPrompt },
        ],
      });

      let content: { fbPost: string; igCaption: string; firstComment: string };
      try {
        const raw = (contentResponse.choices?.[0]?.message?.content as string) || "{}";
        const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        content = JSON.parse(cleaned);
      } catch {
        throw new Error("Failed to parse AI-generated content. Please try again.");
      }

      // Generate image prompt
      const imagePromptResponse = await invokeLLM({
        messages: [
          { role: "system", content: "You create image generation prompts for Marvel social media posts. Return ONLY the prompt text, nothing else. Never include text/words/letters in the image. Use specific Marvel character names (Wolverine, Spider-Man, Doctor Doom, etc). Never use DC characters." },
          { role: "user", content: `Create a vivid, eye-catching image prompt for a social media post about: "${article.title}". The image should be dramatic, colorful, and suitable for Facebook/Instagram. Characters: ${JSON.stringify(article.relatedCharacters || [])}. Category: ${article.category}. Make it look like a premium Marvel trading card community post with vibrant colors and dynamic composition. No text, no letters, no words in the image.` },
        ],
      });

      const imagePrompt = (imagePromptResponse.choices?.[0]?.message?.content as string) || "";

      // Generate the image
      let generatedImageUrl: string | null = null;
      try {
        const imgResult = await generateImage({ prompt: imagePrompt });
        generatedImageUrl = imgResult.url || null;
      } catch (err) {
        console.error("[Social Draft] Image generation failed:", err);
        // Fall back to article's featured image
        generatedImageUrl = article.featuredImageUrl || null;
      }

      // Save the draft
      const draftId = await createSocialPostDraft({
        articleId: input.articleId,
        fbPostContent: content.fbPost,
        igCaption: content.igCaption,
        firstComment: content.firstComment,
        generatedImageUrl,
        imagePrompt,
        tone: input.tone,
        status: "ready",
      });

      return {
        id: draftId,
        articleTitle: article.title,
        fbPostContent: content.fbPost,
        igCaption: content.igCaption,
        firstComment: content.firstComment,
        generatedImageUrl,
        imagePrompt,
        status: "ready",
      };
    }),

  /**
   * Regenerate just the image for a draft
   */
  regenerateImage: adminProcedure
    .input(z.object({ draftId: z.number() }))
    .mutation(async ({ input }) => {
      const drafts = await getSocialPostDrafts();
      const draft = drafts.find((d) => d.id === input.draftId);
      if (!draft) throw new Error("Draft not found");

      const article = await getArticleById(draft.articleId);
      if (!article) throw new Error("Article not found");

      // Generate new image prompt
      const imagePromptResponse = await invokeLLM({
        messages: [
          { role: "system", content: "You create image generation prompts for Marvel social media posts. Return ONLY the prompt text. Never include text/words/letters. Use specific Marvel character names. Never use DC characters." },
          { role: "user", content: `Create a NEW, DIFFERENT vivid image prompt for a social media post about: "${article.title}". Make it dramatically different from: "${draft.imagePrompt || ''}". Characters: ${JSON.stringify(article.relatedCharacters || [])}. Dynamic composition, vibrant colors, premium Marvel feel. No text, no letters, no words.` },
        ],
      });

      const newPrompt = (imagePromptResponse.choices?.[0]?.message?.content as string) || "";

      let newImageUrl: string | null = null;
      try {
        const imgResult = await generateImage({ prompt: newPrompt });
        newImageUrl = imgResult.url || null;
      } catch (err) {
        console.error("[Social Draft] Image regeneration failed:", err);
        throw new Error("Image generation failed. Please try again.");
      }

      await updateSocialPostDraft(input.draftId, {
        generatedImageUrl: newImageUrl,
        imagePrompt: newPrompt,
      });

      return { generatedImageUrl: newImageUrl, imagePrompt: newPrompt };
    }),

  /**
   * Regenerate content for a draft
   */
  regenerateContent: adminProcedure
    .input(z.object({
      draftId: z.number(),
      tone: z.enum(["hype", "mystery", "casual", "educational", "funny"]).default("hype"),
    }))
    .mutation(async ({ input }) => {
      const drafts = await getSocialPostDrafts();
      const draft = drafts.find((d) => d.id === input.draftId);
      if (!draft) throw new Error("Draft not found");

      const article = await getArticleById(draft.articleId);
      if (!article) throw new Error("Article not found");

      const toneGuide: Record<string, string> = {
        hype: "Energetic, exciting, FOMO-inducing. Use caps for emphasis.",
        mystery: "Mysterious, teasing, question-based. Build curiosity.",
        casual: "Conversational, friendly, like texting a buddy.",
        educational: "Informative, value-driven. Lead with insight.",
        funny: "Humorous, relatable. Make people laugh first.",
      };

      const contentPrompt = `You are a social media expert for Northland Legendary Finds (NLF). Generate NEW social media content (completely different from before) for this article.

ARTICLE TITLE: ${article.title}
ARTICLE EXCERPT: ${article.excerpt || ""}
ARTICLE CATEGORY: ${article.category}
RELATED CHARACTERS: ${JSON.stringify(article.relatedCharacters || [])}
CONTENT: ${article.contentMarkdown?.substring(0, 1500) || ""}

TONE: ${input.tone} — ${toneGuide[input.tone]}

PREVIOUS POST (make this one DIFFERENT): ${draft.fbPostContent?.substring(0, 300) || ""}

Generate:
1. FACEBOOK POST (150-350 words) with hook, emojis, hashtags, link: https://northlandlegendaryfinds.com/mcu-news/${article.slug}
2. INSTAGRAM CAPTION (100-200 words) with @northlandlegendaryfinds mention and hashtags
3. FIRST COMMENT (1-2 sentences) with card market angle

Return as JSON: {"fbPost": "...", "igCaption": "...", "firstComment": "..."}
Return ONLY the JSON.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are a viral social media copywriter for Marvel content. Return only valid JSON." },
          { role: "user", content: contentPrompt },
        ],
      });

      let content: { fbPost: string; igCaption: string; firstComment: string };
      try {
        const raw = (response.choices?.[0]?.message?.content as string) || "{}";
        const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        content = JSON.parse(cleaned);
      } catch {
        throw new Error("Failed to parse AI-generated content. Please try again.");
      }

      await updateSocialPostDraft(input.draftId, {
        fbPostContent: content.fbPost,
        igCaption: content.igCaption,
        firstComment: content.firstComment,
        tone: input.tone,
      });

      return content;
    }),

  /**
   * Update draft content manually (edit before publishing)
   */
  updateDraft: adminProcedure
    .input(z.object({
      draftId: z.number(),
      fbPostContent: z.string().optional(),
      igCaption: z.string().optional(),
      firstComment: z.string().optional(),
      status: z.enum(["draft", "ready", "approved", "published", "failed"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const { draftId, ...data } = input;
      await updateSocialPostDraft(draftId, data);
      return { success: true };
    }),

  /**
   * Publish a draft to Facebook and Instagram
   */
  publishDraft: adminProcedure
    .input(z.object({
      draftId: z.number(),
      publishFb: z.boolean().default(true),
      publishIg: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const drafts = await getSocialPostDrafts();
      const draft = drafts.find((d) => d.id === input.draftId);
      if (!draft) throw new Error("Draft not found");

      if (!draft.generatedImageUrl) throw new Error("No image available. Generate an image first.");
      if (!draft.fbPostContent && input.publishFb) throw new Error("No Facebook post content.");
      if (!draft.igCaption && input.publishIg) throw new Error("No Instagram caption.");

      let fbPostId: string | null = null;
      let fbCommentId: string | null = null;
      let igMediaId: string | null = null;
      let errors: string[] = [];

      // Publish to Facebook
      if (input.publishFb && isFacebookConfigured() && draft.fbPostContent) {
        try {
          const fbResult = await publishPhotoPost({
            message: draft.fbPostContent,
            photoUrl: draft.generatedImageUrl,
          });
          if (fbResult.success) {
            fbPostId = fbResult.postId || null;

            // Auto-register post for comment bot monitoring
            if (fbPostId) {
              const article = await getArticleById(draft.articleId).catch(() => null);
              registerPostForMonitoring({
                fbPostId,
                articleSlug: article?.slug || undefined,
                postSummary: draft.fbPostContent?.slice(0, 200) || undefined,
              }).catch((e: any) => console.error("[SocialDraft] Monitor register failed:", e.message));
            }

            // Post first comment
            if (draft.firstComment && fbPostId) {
              try {
                const API_VERSION = "v21.0";
                const GRAPH_URL = `https://graph.facebook.com/${API_VERSION}`;
                const PAGE_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
                
                const commentResponse = await fetch(`${GRAPH_URL}/${fbPostId}/comments`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ message: draft.firstComment, access_token: PAGE_TOKEN }),
                });
                const commentResult = await commentResponse.json() as any;
                if (commentResult.id) {
                  fbCommentId = commentResult.id;
                }
              } catch (err) {
                console.error("[Social Draft] Comment failed:", err);
              }
            }
          } else {
            errors.push(`Facebook: ${fbResult.error || "Unknown error"}`);
          }
        } catch (err: any) {
          errors.push(`Facebook: ${err.message}`);
        }
      }

      // Publish to Instagram
      if (input.publishIg && isInstagramConfigured() && draft.igCaption) {
        try {
          const igResult = await publishInstagramPost({
            caption: draft.igCaption,
            imageUrl: draft.generatedImageUrl,
          });
          if (igResult.success) {
            igMediaId = igResult.mediaId || null;
          } else {
            errors.push(`Instagram: ${igResult.error || "Unknown error"}`);
          }
        } catch (err: any) {
          errors.push(`Instagram: ${err.message}`);
        }
      }

      // Update draft status
      const published = (fbPostId || !input.publishFb) && (igMediaId || !input.publishIg);
      await updateSocialPostDraft(input.draftId, {
        status: published ? "published" : errors.length > 0 ? "failed" : "ready",
        fbPostId: fbPostId || draft.fbPostId,
        igMediaId: igMediaId || draft.igMediaId,
        fbCommentId: fbCommentId || draft.fbCommentId,
        publishedAt: published ? new Date() : undefined,
      });

      return {
        success: published,
        fbPostId,
        igMediaId,
        fbCommentId,
        errors: errors.length > 0 ? errors : undefined,
      };
    }),

  /**
   * Delete a draft
   */
  deleteDraft: adminProcedure
    .input(z.object({ draftId: z.number() }))
    .mutation(async ({ input }) => {
      await deleteSocialPostDraft(input.draftId);
      return { success: true };
    }),

  /**
   * Get published post history
   */
  publishedHistory: adminProcedure.query(async () => {
    const published = await getPublishedSocialPosts();
    // Enrich with article titles
    const enriched = await Promise.all(
      published.map(async (d) => {
        const article = await getArticleById(d.articleId);
        return {
          ...d,
          articleTitle: article?.title || `Article #${d.articleId}`,
          articleSlug: article?.slug || "",
        };
      })
    );
    return enriched;
  }),
});
