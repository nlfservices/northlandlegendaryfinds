/**
 * NLF Public REST API v1
 * Mounted at /api/v1/* — authenticated via X-API-Key header
 *
 * Endpoints:
 *   GET    /api/v1/ping                 - Health check (no auth required)
 *   GET    /api/v1/cards                - Search/list cards
 *   GET    /api/v1/cards/:id            - Get single card
 *   PATCH  /api/v1/cards/:id            - Update card (imageUrl, price, description)
 *   POST   /api/v1/cards/image          - Upload card image by characterName + cardType
 *   GET    /api/v1/sets                 - List card sets
 *   GET    /api/v1/sets/:slug           - Get set with cards
 *   POST   /api/v1/sets                 - Create a new card set
 *   PATCH  /api/v1/sets/:id             - Update set details
 *   GET    /api/v1/articles             - List articles
 *   GET    /api/v1/articles/:slug       - Get single article
 *   POST   /api/v1/articles             - Create article
 *   PATCH  /api/v1/articles/:id         - Update article
 *   POST   /api/v1/artists/image        - Upload artist portrait
 *   POST   /api/v1/social/draft         - Create social post draft (linked to article)
 *   GET    /api/v1/admin/stats          - Site stats
 */

import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { validateApiKey, logApiRequest } from "./routers/apiKeys";
import { getDb } from "./db";
import { storagePut } from "./storage";
import {
  marvelCards,
  cardSets,
  articles,
  socialPostDrafts,
  apiKeys,
} from "../drizzle/schema";
import { eq, like, and, desc, sql } from "drizzle-orm";
import { validateArticle, AnyTemplate } from "./article-pipeline";
import { notifyOwner } from "./_core/notification";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthedRequest extends Request {
  apiKey?: { id: number; name: string; permissions: string[] };
  file?: Express.Multer.File;
}

// ─── Multer (in-memory file uploads, max 10 MB) ───────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fileFilter: (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// ─── Auth Middleware ──────────────────────────────────────────────────────────

function requireScope(scope: string) {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    const rawKey = req.headers["x-api-key"] as string;
    if (!rawKey) {
      return res.status(401).json({ error: "Missing X-API-Key header" });
    }
    try {
      const keyInfo = await validateApiKey(rawKey);
      if (!keyInfo.permissions.includes(scope)) {
        return res.status(403).json({
          error: `This key does not have the '${scope}' permission`,
          yourPermissions: keyInfo.permissions,
        });
      }
      req.apiKey = keyInfo;
      next();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unauthorized";
      return res.status(401).json({ error: message });
    }
  };
}

// ─── Logging wrapper ─────────────────────────────────────────────────────────

function withLogging(
  handler: (req: AuthedRequest, res: Response) => Promise<void>
) {
  return async (req: AuthedRequest, res: Response) => {
    const start = Date.now();
    let statusCode = 200;
    const originalJson = res.json.bind(res);
    (res as Response).json = (body: unknown) => {
      statusCode = res.statusCode;
      return originalJson(body);
    };
    try {
      await handler(req, res);
    } catch (err) {
      statusCode = 500;
      res.status(500).json({ error: "Internal server error" });
    }
    if (req.apiKey) {
      logApiRequest({
        apiKeyId: req.apiKey.id,
        method: req.method,
        endpoint: req.path,
        statusCode,
        responseTimeMs: Date.now() - start,
      });
    }
  };
}

// ─── Router ──────────────────────────────────────────────────────────────────

export function registerRestApi(app: import("express").Express) {
  const api = Router();

  // ── Health check (no auth) ────────────────────────────────────────────────
  api.get("/ping", (_req, res) => {
    res.json({ status: "ok", version: "1.0", site: "northlandlegendaryfinds.com" });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // CARDS
  // ─────────────────────────────────────────────────────────────────────────

  /** GET /api/v1/cards?q=&setSlug=&cardType=&limit=&offset= */
  api.get(
    "/cards",
    requireScope("cards:read"),
    withLogging(async (req: AuthedRequest, res) => {
      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });

      const q = (req.query.q as string) || "";
      const setSlug = req.query.setSlug as string | undefined;
      const cardType = req.query.cardType as string | undefined;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      const offset = parseInt(req.query.offset as string) || 0;

      const conditions: ReturnType<typeof eq>[] = [];
      if (q) conditions.push(like(marvelCards.characterName, `%${q}%`) as ReturnType<typeof eq>);
      if (cardType) conditions.push(eq(marvelCards.cardType, cardType));
      if (setSlug) {
        const [set] = await db.select({ id: cardSets.id }).from(cardSets).where(eq(cardSets.slug, setSlug)).limit(1);
        if (set) conditions.push(eq(marvelCards.setId, set.id));
      }

      const baseQuery = db
        .select({
          id: marvelCards.id,
          cardNumber: marvelCards.cardNumber,
          characterName: marvelCards.characterName,
          cardType: marvelCards.cardType,
          imageUrl: marvelCards.imageUrl,
          setId: marvelCards.setId,
        })
        .from(marvelCards);

      const cards = conditions.length
        ? await baseQuery.where(and(...conditions)).limit(limit).offset(offset)
        : await baseQuery.limit(limit).offset(offset);

      res.json({ data: cards, limit, offset, count: cards.length });
    })
  );

  /** GET /api/v1/cards/:id */
  api.get(
    "/cards/:id",
    requireScope("cards:read"),
    withLogging(async (req: AuthedRequest, res) => {
      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });

      const [card] = await db
        .select()
        .from(marvelCards)
        .where(eq(marvelCards.id, parseInt(req.params.id)))
        .limit(1);

      if (!card) return void res.status(404).json({ error: "Card not found" });
      res.json({ data: card });
    })
  );

  /** PATCH /api/v1/cards/:id */
  api.patch(
    "/cards/:id",
    requireScope("cards:write"),
    withLogging(async (req: AuthedRequest, res) => {
      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });

      const updates: Record<string, unknown> = {};
      if (req.body.imageUrl !== undefined) updates.imageUrl = req.body.imageUrl;
      if (req.body.price !== undefined) updates.price = req.body.price;
      if (req.body.description !== undefined) updates.description = req.body.description;
      if (req.body.cardType !== undefined) updates.cardType = req.body.cardType;
      if (!Object.keys(updates).length) {
        return void res.status(400).json({ error: "No valid fields to update" });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.update(marvelCards).set(updates as any).where(eq(marvelCards.id, parseInt(req.params.id)));
      const [updated] = await db.select().from(marvelCards).where(eq(marvelCards.id, parseInt(req.params.id))).limit(1);
      res.json({ data: updated });
    })
  );

  /**
   * POST /api/v1/cards/image
   * Multipart form fields:
   *   image        — image file (required)
   *   characterName — exact or partial character name (required unless cardId given)
   *   cardId        — specific card ID (optional, overrides characterName)
   *   cardType      — narrow by card type (optional)
   *   setSlug       — narrow by set slug (optional)
   */
  api.post(
    "/cards/image",
    requireScope("cards:write"),
    upload.single("image"),
    withLogging(async (req: AuthedRequest, res) => {
      if (!req.file) return void res.status(400).json({ error: "No image file provided" });

      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });

      const characterName = req.body.characterName as string | undefined;
      const cardType = req.body.cardType as string | undefined;
      const setSlug = req.body.setSlug as string | undefined;
      const cardId = req.body.cardId ? parseInt(req.body.cardId) : undefined;

      if (!characterName && !cardId) {
        return void res.status(400).json({ error: "Provide either characterName or cardId" });
      }

      const conditions: ReturnType<typeof eq>[] = [];
      if (cardId) {
        conditions.push(eq(marvelCards.id, cardId));
      } else if (characterName) {
        conditions.push(like(marvelCards.characterName, characterName) as ReturnType<typeof eq>);
        if (cardType) conditions.push(eq(marvelCards.cardType, cardType));
        if (setSlug) {
          const [set] = await db.select({ id: cardSets.id }).from(cardSets).where(eq(cardSets.slug, setSlug)).limit(1);
          if (set) conditions.push(eq(marvelCards.setId, set.id));
        }
      }

      const matchingCards = await db
        .select({ id: marvelCards.id, characterName: marvelCards.characterName, cardType: marvelCards.cardType })
        .from(marvelCards)
        .where(and(...conditions))
        .limit(10);

      if (!matchingCards.length) {
        return void res.status(404).json({
          error: "No matching cards found",
          hint: "Check characterName spelling and cardType",
        });
      }

      // Upload to S3
      const ext = req.file.mimetype.split("/")[1] || "jpg";
      const safeName = (characterName || `card-${cardId}`).replace(/[^a-z0-9]/gi, "-").toLowerCase();
      const fileKey = `card-images/${safeName}-${Date.now()}.${ext}`;
      const { url } = await storagePut(fileKey, req.file.buffer, req.file.mimetype);

      // Update all matching cards
      await db.update(marvelCards).set({ imageUrl: url }).where(and(...conditions));

      res.json({
        success: true,
        imageUrl: url,
        updatedCards: matchingCards.map((c) => ({
          id: c.id,
          characterName: c.characterName,
          cardType: c.cardType,
        })),
      });
    })
  );

  // ─────────────────────────────────────────────────────────────────────────
  // CARD SETS
  // ─────────────────────────────────────────────────────────────────────────

  /** GET /api/v1/sets */
  api.get(
    "/sets",
    requireScope("sets:read"),
    withLogging(async (req: AuthedRequest, res) => {
      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });
      const sets = await db.select().from(cardSets).orderBy(desc(cardSets.createdAt)).limit(100);
      res.json({ data: sets });
    })
  );

  /** GET /api/v1/sets/:slug */
  api.get(
    "/sets/:slug",
    requireScope("sets:read"),
    withLogging(async (req: AuthedRequest, res) => {
      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });

      const [set] = await db.select().from(cardSets).where(eq(cardSets.slug, req.params.slug)).limit(1);
      if (!set) return void res.status(404).json({ error: "Set not found" });

      const cards = await db
        .select()
        .from(marvelCards)
        .where(eq(marvelCards.setId, set.id))
        .orderBy(marvelCards.cardNumber)
        .limit(500);

      res.json({ data: { ...set, cards } });
    })
  );

  /** POST /api/v1/sets */
  api.post(
    "/sets",
    requireScope("sets:write"),
    withLogging(async (req: AuthedRequest, res) => {
      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });

      const { name, slug, year, manufacturer, imageUrl, notes } = req.body;
      if (!name || !slug) return void res.status(400).json({ error: "name and slug are required" });

      await db.insert(cardSets).values({ name, slug, year, manufacturer, imageUrl, notes });
      const [created] = await db.select().from(cardSets).where(eq(cardSets.slug, slug)).limit(1);
      res.status(201).json({ data: created });
    })
  );

  /** PATCH /api/v1/sets/:id */
  api.patch(
    "/sets/:id",
    requireScope("sets:write"),
    withLogging(async (req: AuthedRequest, res) => {
      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });

      const updates: Record<string, unknown> = {};
      if (req.body.name !== undefined) updates.name = req.body.name;
      if (req.body.year !== undefined) updates.year = req.body.year;
      if (req.body.manufacturer !== undefined) updates.manufacturer = req.body.manufacturer;
      if (req.body.imageUrl !== undefined) updates.imageUrl = req.body.imageUrl;
      if (req.body.notes !== undefined) updates.notes = req.body.notes;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.update(cardSets).set(updates as any).where(eq(cardSets.id, parseInt(req.params.id)));
      const [updated] = await db.select().from(cardSets).where(eq(cardSets.id, parseInt(req.params.id))).limit(1);
      res.json({ data: updated });
    })
  );

  // ─────────────────────────────────────────────────────────────────────────
  // ARTICLES
  // ─────────────────────────────────────────────────────────────────────────

  /** GET /api/v1/articles?limit=&offset= */
  api.get(
    "/articles",
    requireScope("articles:read"),
    withLogging(async (req: AuthedRequest, res) => {
      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });

      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = parseInt(req.query.offset as string) || 0;

      const rows = await db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          isPublished: articles.isPublished,
          publishedAt: articles.publishedAt,
          createdAt: articles.createdAt,
        })
        .from(articles)
        .orderBy(desc(articles.createdAt))
        .limit(limit)
        .offset(offset);

      res.json({ data: rows, limit, offset, count: rows.length });
    })
  );

  /** GET /api/v1/articles/:slug */
  api.get(
    "/articles/:slug",
    requireScope("articles:read"),
    withLogging(async (req: AuthedRequest, res) => {
      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });

      const [article] = await db
        .select()
        .from(articles)
        .where(eq(articles.slug, req.params.slug))
        .limit(1);

      if (!article) return void res.status(404).json({ error: "Article not found" });
      res.json({ data: article });
    })
  );

  /** POST /api/v1/articles */
  api.post(
    "/articles",
    requireScope("articles:write"),
    withLogging(async (req: AuthedRequest, res) => {
      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });

      const {
        title, slug, contentMarkdown, excerpt, isPublished,
        featuredImageUrl, category, tags, templateLayout,
      } = req.body;

      if (!title || !slug || !contentMarkdown) {
        return void res.status(400).json({ error: "title, slug, and contentMarkdown are required" });
      }

      const publishing = isPublished === true || isPublished === "true";
      const tpl = templateLayout || "classic";

      // On-demand contract verification before publishing
      if (publishing) {
        const contractResult = validateArticle(
          { contentMarkdown, featuredImageUrl: featuredImageUrl || null },
          tpl as AnyTemplate
        );
        if (!contractResult.ok) {
          // Auto-quarantine: insert as unpublished
          await db.insert(articles).values({
            title, slug, contentMarkdown,
            excerpt: excerpt || "",
            isPublished: false,
            featuredImageUrl: featuredImageUrl || null,
            category: category || "movie_news",
            tags: tags || null,
            templateLayout: tpl,
            publishedAt: null,
          });
          await notifyOwner({
            title: `\u26a0\ufe0f Article Auto-Quarantined: ${title}`,
            content: `REST API tried to publish "${title}" (slug: ${slug}) but it failed contract.\n\nViolations:\n${contractResult.errors.map(e => `\u2022 ${e}`).join("\n")}\n\nTemplate: ${tpl}\nAction: Saved as unpublished draft. Review in admin.`,
          });
          const [created] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
          return void res.status(422).json({ data: created, quarantined: true, errors: contractResult.errors });
        }
      }

      await db.insert(articles).values({
        title,
        slug,
        contentMarkdown,
        excerpt: excerpt || "",
        isPublished: publishing,
        featuredImageUrl: featuredImageUrl || null,
        category: category || "movie_news",
        tags: tags || null,
        templateLayout: tpl,
        publishedAt: publishing ? Date.now() : null,
      });

      const [created] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
      res.status(201).json({ data: created });
    })
  );

  /** PATCH /api/v1/articles/:id */
  api.patch(
    "/articles/:id",
    requireScope("articles:write"),
    withLogging(async (req: AuthedRequest, res) => {
      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });

      const updates: Record<string, unknown> = {};
      if (req.body.title !== undefined) updates.title = req.body.title;
      if (req.body.contentMarkdown !== undefined) updates.contentMarkdown = req.body.contentMarkdown;
      if (req.body.excerpt !== undefined) updates.excerpt = req.body.excerpt;
      if (req.body.isPublished !== undefined) updates.isPublished = req.body.isPublished;
      if (req.body.featuredImageUrl !== undefined) updates.featuredImageUrl = req.body.featuredImageUrl;
      if (req.body.tags !== undefined) updates.tags = req.body.tags;
      if (req.body.templateLayout !== undefined) updates.templateLayout = req.body.templateLayout;
      if (req.body.isPublished === true || req.body.isPublished === "true") {
        updates.publishedAt = Date.now();
      }

      // On-demand contract verification when publishing via PATCH
      const isPublishing = req.body.isPublished === true || req.body.isPublished === "true";
      if (isPublishing) {
        // Fetch existing article to merge with updates for validation
        const [existing] = await db.select().from(articles).where(eq(articles.id, parseInt(req.params.id))).limit(1);
        if (existing) {
          const content = (updates.contentMarkdown as string) || existing.contentMarkdown || "";
          const featImg = (updates.featuredImageUrl as string) ?? existing.featuredImageUrl ?? null;
          const tpl = (updates.templateLayout as string) || existing.templateLayout || "classic";
          const contractResult = validateArticle({ contentMarkdown: content, featuredImageUrl: featImg }, tpl as AnyTemplate);
          if (!contractResult.ok) {
            // Don't publish — save as draft instead
            updates.isPublished = false;
            updates.publishedAt = null as any;
            await db.update(articles).set(updates as any).where(eq(articles.id, parseInt(req.params.id)));
            await notifyOwner({
              title: `\u26a0\ufe0f Article Auto-Quarantined: ${existing.title}`,
              content: `REST API PATCH tried to publish article ${existing.id} ("${existing.title}") but it failed contract.\n\nViolations:\n${contractResult.errors.map(e => `\u2022 ${e}`).join("\n")}\n\nTemplate: ${tpl}\nAction: Kept as unpublished. Review in admin.`,
            });
            const [updated] = await db.select().from(articles).where(eq(articles.id, parseInt(req.params.id))).limit(1);
            return void res.status(422).json({ data: updated, quarantined: true, errors: contractResult.errors });
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.update(articles).set(updates as any).where(eq(articles.id, parseInt(req.params.id)));
      const [updated] = await db.select().from(articles).where(eq(articles.id, parseInt(req.params.id))).limit(1);
      res.json({ data: updated });
    })
  );

  // ─────────────────────────────────────────────────────────────────────────
  // ARTISTS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * POST /api/v1/artists/image
   * Multipart: image file + artistSlug
   */
  api.post(
    "/artists/image",
    requireScope("artists:write"),
    upload.single("image"),
    withLogging(async (req: AuthedRequest, res) => {
      if (!req.file) return void res.status(400).json({ error: "No image file provided" });

      const artistSlug = req.body.artistSlug as string;
      if (!artistSlug) return void res.status(400).json({ error: "artistSlug is required" });

      const ext = req.file.mimetype.split("/")[1] || "jpg";
      const fileKey = `artist-portraits/${artistSlug}-${Date.now()}.${ext}`;
      const { url } = await storagePut(fileKey, req.file.buffer, req.file.mimetype);

      res.json({ success: true, imageUrl: url, artistSlug });
    })
  );

  // ─────────────────────────────────────────────────────────────────────────
  // SOCIAL DRAFTS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * POST /api/v1/social/draft
   * Body: { articleId, fbPostContent, igCaption, firstComment, generatedImageUrl, tone }
   */
  api.post(
    "/social/draft",
    requireScope("social:write"),
    withLogging(async (req: AuthedRequest, res) => {
      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });

      const { articleId, fbPostContent, igCaption, firstComment, generatedImageUrl, tone } = req.body;
      if (!articleId) return void res.status(400).json({ error: "articleId is required" });

      await db.insert(socialPostDrafts).values({
        articleId: parseInt(articleId),
        fbPostContent: fbPostContent || null,
        igCaption: igCaption || null,
        firstComment: firstComment || null,
        generatedImageUrl: generatedImageUrl || null,
        tone: tone || "hype",
        status: "draft",
      });

      res.status(201).json({ success: true, message: "Social draft created" });
    })
  );

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN STATS
  // ─────────────────────────────────────────────────────────────────────────

  /** GET /api/v1/admin/stats */
  api.get(
    "/admin/stats",
    requireScope("admin:read"),
    withLogging(async (req: AuthedRequest, res) => {
      const db = await getDb();
      if (!db) return void res.status(503).json({ error: "Database unavailable" });

      const [cardCount] = await db.select({ count: sql<number>`count(*)` }).from(marvelCards);
      const [setCount] = await db.select({ count: sql<number>`count(*)` }).from(cardSets);
      const [articleCount] = await db.select({ count: sql<number>`count(*)` }).from(articles);
      const [keyCount] = await db.select({ count: sql<number>`count(*)` }).from(apiKeys);

      res.json({
        data: {
          cards: Number(cardCount?.count ?? 0),
          sets: Number(setCount?.count ?? 0),
          articles: Number(articleCount?.count ?? 0),
          apiKeys: Number(keyCount?.count ?? 0),
          timestamp: new Date().toISOString(),
        },
      });
    })
  );

  // Mount at /api/v1
  app.use("/api/v1", api);
  console.log("[REST API] NLF Public API v1 mounted at /api/v1");
}
