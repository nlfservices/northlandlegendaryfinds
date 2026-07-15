/**
 * Scheduled Daily Article Endpoint
 * POST /api/scheduled/daily-article
 *
 * Called by the AGENT cron after it has researched and written a new MCU article.
 * The AGENT passes the full article payload + pipeline metadata.
 * This handler:
 *  1. Authenticates the cron caller via x-nlf-cron-secret header
 *  2. Checks topic deduplication (topicKey must be unique)
 *  3. Inserts the article into the DB as a draft for admin review
 *  4. Records the topic in article_pipeline_topics (dedup + art style tracking)
 *  5. Creates a social_post_draft with Facebook + Reddit copy
 *  6. Returns the new article ID and slug
 *
 * GET /api/scheduled/daily-article/status
 *  Returns the current art style rotation state and recent topics
 */
import { Express, Request, Response } from "express";
import mysql from "mysql2/promise";
import { validateArticle, AnyTemplate } from "./article-pipeline";
import { notifyOwner } from "./_core/notification";

// Art style rotation — 7 styles, cycles through in order, never same two days in a row
const ART_STYLES = [
  "oil_painting",
  "watercolor",
  "comic_halftone",
  "charcoal_sketch",
  "neon_noir",
  "golden_age_comic",
  "concept_art",
] as const;

type ArtStyle = typeof ART_STYLES[number];

// Template layout rotation — 8 templates, matches schema enum
const TEMPLATE_LAYOUTS = [
  "classic",
  "magazine",
  "spotlight",
  "timeline",
  "listicle",
  "patriotic",
  "cinematic",
  "dossier",
] as const;

type TemplateLayout = typeof TEMPLATE_LAYOUTS[number];

function getNextArtStyle(lastIndex: number): { style: ArtStyle; index: number } {
  const nextIndex = (lastIndex + 1) % ART_STYLES.length;
  return { style: ART_STYLES[nextIndex], index: nextIndex };
}

function getTemplateForArtStyle(artStyleIndex: number): TemplateLayout {
  return TEMPLATE_LAYOUTS[artStyleIndex % TEMPLATE_LAYOUTS.length];
}

export function registerDailyArticleRoute(app: Express) {
  /**
   * POST /api/scheduled/daily-article
   * Called by AGENT cron with full article payload
   */
  app.post("/api/scheduled/daily-article", async (req: Request, res: Response) => {
    try {
      // Verify cron secret
      const cronSecret = req.headers["x-nlf-cron-secret"];
      if (!cronSecret || cronSecret !== process.env.NLF_CRON_SECRET) {
        return res.status(403).json({ error: "Forbidden — invalid cron secret" });
      }

      const {
        topicKey,
        topicTitle,
        bucket = "general_mcu",
        title,
        slug,
        excerpt,
        contentMarkdown,
        featuredImageUrl,
        category = "movie_news",
        tags = [],
        relatedCharacters = [],
        sources = [],
        metaDescription,
        authorName = "NLF Team",
        cardMarketImpact,
        fbPostContent,
        igCaption,
        firstComment,
        redditPostCopy,
        artStyleOverride,
        templateLayoutOverride,
        publishImmediately = false,
      } = req.body;

      // Validate required fields
      if (!topicKey || !title || !slug || !contentMarkdown) {
        return res.status(400).json({
          error: "Missing required fields: topicKey, title, slug, contentMarkdown",
        });
      }

      const conn = await mysql.createConnection(process.env.DATABASE_URL!);

      try {
        // 1. Check topic deduplication
        const [existing] = await conn.execute(
          "SELECT id FROM article_pipeline_topics WHERE topic_key = ?",
          [topicKey]
        ) as any[];
        if ((existing as any[]).length > 0) {
          await conn.end();
          return res.status(409).json({
            error: "Topic already published — choose a different angle",
            topicKey,
          });
        }

        // 2. Also check slug uniqueness in articles table
        const [existingSlug] = await conn.execute(
          "SELECT id FROM articles WHERE slug = ?",
          [slug]
        ) as any[];
        if ((existingSlug as any[]).length > 0) {
          await conn.end();
          return res.status(409).json({
            error: "Slug already exists — use a unique slug",
            slug,
          });
        }

        // 3. Get last art style index for rotation
        const [lastEntry] = await conn.execute(
          "SELECT art_style_index FROM article_pipeline_topics ORDER BY id DESC LIMIT 1"
        ) as any[];
        const lastIndex = (lastEntry as any[]).length > 0
          ? ((lastEntry as any[])[0].art_style_index ?? -1)
          : -1;

        const { style: artStyle, index: artStyleIndex } = artStyleOverride
          ? {
              style: artStyleOverride as ArtStyle,
              index: ART_STYLES.indexOf(artStyleOverride as ArtStyle),
            }
          : getNextArtStyle(lastIndex);

        // 4. Determine template layout (rotates with art style)
        const templateLayout: TemplateLayout = templateLayoutOverride
          ? (templateLayoutOverride as TemplateLayout)
          : getTemplateForArtStyle(artStyleIndex);

        // 5. Insert article (as draft by default, published if publishImmediately=true)
        const publishedAt = publishImmediately ? Date.now() : null;
        const [articleResult] = await conn.execute(
          `INSERT INTO articles (
            title, slug, excerpt, contentMarkdown, featuredImageUrl,
            category, tags, relatedCharacters, sources, metaDescription,
            authorName, cardMarketImpact, isPublished, isFeatured,
            publishedAt, templateLayout, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, NOW(), NOW())`,
          [
            title,
            slug,
            excerpt ?? null,
            contentMarkdown,
            featuredImageUrl ?? null,
            category,
            JSON.stringify(tags),
            JSON.stringify(relatedCharacters),
            JSON.stringify(sources),
            metaDescription ?? null,
            authorName,
            cardMarketImpact ?? null,
            publishImmediately ? 1 : 0,
            publishedAt,
            templateLayout,
          ]
        ) as any;
        const articleId = (articleResult as any).insertId;

        // 6. Record topic in pipeline tracker
        await conn.execute(
          `INSERT INTO article_pipeline_topics (
            topic_key, topic_title, bucket, art_style, art_style_index,
            article_id, reddit_post_copy, published, createdAt, published_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
          [
            topicKey,
            topicTitle ?? title,
            bucket,
            artStyle,
            artStyleIndex,
            articleId,
            redditPostCopy ?? null,
            publishImmediately ? 1 : 0,
            publishImmediately ? new Date() : null,
          ]
        );

        // 7. Create social post draft
        if (fbPostContent || igCaption || redditPostCopy) {
          await conn.execute(
            `INSERT INTO social_post_drafts (
              articleId, fbPostContent, igCaption, firstComment,
              tone, socialPostStatus, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, 'hype', 'draft', NOW(), NOW())`,
            [
              articleId,
              fbPostContent ?? null,
              igCaption ?? null,
              firstComment ?? null,
            ]
          );
        }

        await conn.end();

        // 8. On-demand contract verification for publishImmediately articles
        if (publishImmediately) {
          const contractResult = validateArticle(
            { contentMarkdown, featuredImageUrl: featuredImageUrl ?? null },
            templateLayout as AnyTemplate
          );
          if (!contractResult.ok) {
            // Auto-quarantine: unpublish the article immediately
            const quarantineConn = await mysql.createConnection(process.env.DATABASE_URL!);
            await quarantineConn.execute(
              `UPDATE articles SET isPublished = 0 WHERE id = ?`,
              [articleId]
            );
            await quarantineConn.end();
            console.error(
              `[DailyArticle] ⚠️ QUARANTINED article ${articleId} ("${title}"): ${contractResult.errors.join("; ")}`
            );
            await notifyOwner({
              title: `⚠️ Article Auto-Quarantined: ${title}`,
              content: `Article "${title}" (slug: ${slug}) was auto-quarantined immediately after publish.\n\nContract violations:\n${contractResult.errors.map(e => `• ${e}`).join("\n")}\n\nTemplate: ${templateLayout}\nAction: Unpublished automatically. Review in admin dashboard.`,
            });
            return res.json({
              success: false,
              articleId,
              slug,
              quarantined: true,
              errors: contractResult.errors,
              message: `Article quarantined — failed ${templateLayout} contract: ${contractResult.errors.join("; ")}`,
            });
          }
        }

        console.log(
          `[DailyArticle] ${publishImmediately ? "Published" : "Draft saved"}: "${title}" | ` +
          `slug: ${slug} | art: ${artStyle} | template: ${templateLayout} | topic: ${topicKey}`
        );

        return res.json({
          success: true,
          articleId,
          slug,
          artStyle,
          artStyleIndex,
          templateLayout,
          topicKey,
          published: publishImmediately,
          articleUrl: `${process.env.SITE_URL ?? "https://northlandlegendaryfinds.com"}/mcu-news/${slug}`,
          message: publishImmediately
            ? `Article published live at /mcu-news/${slug}`
            : `Article saved as draft. Review in admin dashboard → Articles tab.`,
        });
      } catch (dbErr: any) {
        await conn.end();
        throw dbErr;
      }
    } catch (error: any) {
      console.error("[DailyArticle] Error:", error.message);
      return res.status(500).json({
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        context: { url: req.url },
        timestamp: new Date().toISOString(),
      });
    }
  });

  /**
   * GET /api/scheduled/daily-article/status
   * Returns current rotation state and recent topics (for AGENT cron to check before writing)
   */
  app.get("/api/scheduled/daily-article/status", async (req: Request, res: Response) => {
    try {
      const cronSecret = req.headers["x-nlf-cron-secret"];
      if (!cronSecret || cronSecret !== process.env.NLF_CRON_SECRET) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      const [topics] = await conn.execute(
        "SELECT topic_key, topic_title, bucket, art_style, art_style_index, published, article_id, createdAt FROM article_pipeline_topics ORDER BY id DESC LIMIT 30"
      ) as any[];
      const [lastEntry] = await conn.execute(
        "SELECT art_style_index FROM article_pipeline_topics ORDER BY id DESC LIMIT 1"
      ) as any[];
      await conn.end();

      const lastIndex = (lastEntry as any[]).length > 0
        ? ((lastEntry as any[])[0].art_style_index ?? -1)
        : -1;
      const { style: nextArtStyle, index: nextIndex } = getNextArtStyle(lastIndex);
      const nextTemplate = getTemplateForArtStyle(nextIndex);

      return res.json({
        nextArtStyle,
        nextArtStyleIndex: nextIndex,
        nextTemplateLayout: nextTemplate,
        artStyleRotation: ART_STYLES,
        templateRotation: TEMPLATE_LAYOUTS,
        recentTopics: (topics as any[]).map((t: any) => ({
          topicKey: t.topic_key,
          topicTitle: t.topic_title,
          bucket: t.bucket,
          artStyle: t.art_style,
          published: Boolean(t.published),
          articleId: t.article_id,
          createdAt: t.createdAt,
        })),
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });
}
