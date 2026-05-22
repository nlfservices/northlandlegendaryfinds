import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { mcuMedia } from "../../drizzle/schema";
import { eq, desc, asc, and, sql } from "drizzle-orm";

const mcuMediaInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  mediaType: z.enum(["movie", "series"]),
  phase: z.number().optional(),
  releaseOrder: z.number().optional(),
  releaseDate: z.string().optional(),
  director: z.string().optional(),
  cast: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  youtubeTrailerId: z.string().optional(),
  budgetMillions: z.number().optional(),
  worldwideGrossMillions: z.number().optional(),
  domesticGrossMillions: z.number().optional(),
  openingWeekendMillions: z.number().optional(),
  episodeCount: z.number().optional(),
  seasonCount: z.number().optional(),
  platform: z.string().optional(),
  rtCriticsScore: z.number().optional(),
  rtAudienceScore: z.number().optional(),
  verdict: z.enum(["hit", "miss", "mixed"]).optional(),
  cardMarketContent: z.string().optional(),
  keyCards: z.string().optional(),
  content: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  relatedCharacters: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  isFeatured: z.boolean().default(false),
});

// ==================== ADMIN MCU MEDIA ROUTES ====================

export const mcuMediaAdminRouter = router({
  list: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(mcuMedia).orderBy(asc(mcuMedia.releaseOrder));
  }),

  getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return null;
    const [item] = await db.select().from(mcuMedia).where(eq(mcuMedia.id, input.id));
    return item ?? null;
  }),

  create: adminProcedure.input(mcuMediaInput).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const [result] = await db.insert(mcuMedia).values({
      ...input,
      phase: input.phase ?? null,
      releaseOrder: input.releaseOrder ?? null,
      releaseDate: input.releaseDate ?? null,
      director: input.director ?? null,
      cast: input.cast ?? null,
      tagline: input.tagline ?? null,
      description: input.description ?? null,
      imageUrl: input.imageUrl ?? null,
      youtubeTrailerId: input.youtubeTrailerId ?? null,
      budgetMillions: input.budgetMillions ?? null,
      worldwideGrossMillions: input.worldwideGrossMillions ?? null,
      domesticGrossMillions: input.domesticGrossMillions ?? null,
      openingWeekendMillions: input.openingWeekendMillions ?? null,
      episodeCount: input.episodeCount ?? null,
      seasonCount: input.seasonCount ?? null,
      platform: input.platform ?? null,
      rtCriticsScore: input.rtCriticsScore ?? null,
      rtAudienceScore: input.rtAudienceScore ?? null,
      verdict: input.verdict ?? null,
      cardMarketContent: input.cardMarketContent ?? null,
      keyCards: input.keyCards ?? null,
      content: input.content ?? null,
      metaDescription: input.metaDescription ?? null,
      keywords: input.keywords ?? null,
      relatedCharacters: input.relatedCharacters ?? null,
    });
    return { id: result.insertId };
  }),

  update: adminProcedure.input(z.object({ id: z.number() }).merge(mcuMediaInput.partial())).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    await db.update(mcuMedia).set(data).where(eq(mcuMedia.id, id));
    return { success: true };
  }),

  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    await db.delete(mcuMedia).where(eq(mcuMedia.id, input.id));
    return { success: true };
  }),
});

// ==================== PUBLIC MCU MEDIA ROUTES ====================

export const mcuMediaPublicRouter = router({
  /** Get all published movies & series, ordered by release order (newest first) */
  list: publicProcedure.input(z.object({
    type: z.enum(["movie", "series", "all"]).default("all"),
  }).optional()).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    const type = input?.type ?? "all";
    if (type === "all") {
      return db.select().from(mcuMedia)
        .where(eq(mcuMedia.status, "published"))
        .orderBy(desc(mcuMedia.releaseOrder));
    }
    return db.select().from(mcuMedia)
      .where(and(eq(mcuMedia.status, "published"), eq(mcuMedia.mediaType, type)))
      .orderBy(desc(mcuMedia.releaseOrder));
  }),

  /** Get a single movie/series by slug */
  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return null;
    const [item] = await db.select().from(mcuMedia)
      .where(and(eq(mcuMedia.slug, input.slug), eq(mcuMedia.status, "published")));
    return item ?? null;
  }),

  /** Get featured items for homepage/nav showcase */
  featured: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(mcuMedia)
      .where(and(eq(mcuMedia.status, "published"), eq(mcuMedia.isFeatured, true)))
      .orderBy(asc(mcuMedia.releaseOrder));
  }),

  /** Get count of published movies and series */
  stats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { movies: 0, series: 0 };
    const movies = await db.select({ count: sql<number>`count(*)` }).from(mcuMedia)
      .where(and(eq(mcuMedia.status, "published"), eq(mcuMedia.mediaType, "movie")));
    const series = await db.select({ count: sql<number>`count(*)` }).from(mcuMedia)
      .where(and(eq(mcuMedia.status, "published"), eq(mcuMedia.mediaType, "series")));
    return { movies: Number(movies[0].count), series: Number(series[0].count) };
  }),
});
