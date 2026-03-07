import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  getActiveProducts, getWhatnotProducts, getProductBySlug, getProductById,
  getChecklistByProductId,
  getPullsByProductId, getRecentPulls, getPullsByShowId,
  getAllShows, getUpcomingShows, getShowsByProductId, getShowById,
  getProductStats,
  getAllMarvelSets, getMarvelSetBySlug, getMarvelCardsBySetId, searchMarvelCards,
  getAllGradedCards, getGradedCardStats, getGradedCardGradeDistribution, getGradedCardSets,
} from "../db";

// ==================== PUBLIC PRODUCT ROUTES ====================

const publicProductRouter = router({
  /** Get all active (published) products */
  list: publicProcedure.query(async () => {
    return getActiveProducts();
  }),

  /** Get a single product by slug */
  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    return getProductBySlug(input.slug);
  }),

  /** Get product stats (pulls, remaining packs) */
  stats: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getProductStats(input.id);
  }),

  /** Get Whatnot exclusive products */
  whatnot: publicProcedure.query(async () => {
    return getWhatnotProducts();
  }),
});

// ==================== PUBLIC CHECKLIST ROUTES ====================

const publicChecklistRouter = router({
  /** Get the full checklist for a product */
  getByProduct: publicProcedure.input(z.object({ productId: z.number() })).query(async ({ input }) => {
    return getChecklistByProductId(input.productId);
  }),
});

// ==================== PUBLIC PULL ROUTES ====================

const publicPullRouter = router({
  /** Get all pulls for a product */
  getByProduct: publicProcedure.input(z.object({ productId: z.number() })).query(async ({ input }) => {
    return getPullsByProductId(input.productId);
  }),

  /** Get recent pulls across all products */
  recent: publicProcedure.input(z.object({ limit: z.number().default(20) }).optional()).query(async ({ input }) => {
    return getRecentPulls(input?.limit ?? 20);
  }),

  /** Get pulls for a specific show */
  getByShow: publicProcedure.input(z.object({ showId: z.number() })).query(async ({ input }) => {
    return getPullsByShowId(input.showId);
  }),
});

// ==================== PUBLIC SHOW ROUTES ====================

const publicShowRouter = router({
  /** Get all shows */
  list: publicProcedure.query(async () => {
    return getAllShows();
  }),

  /** Get upcoming shows */
  upcoming: publicProcedure.query(async () => {
    return getUpcomingShows();
  }),

  /** Get shows for a specific product */
  getByProduct: publicProcedure.input(z.object({ productId: z.number() })).query(async ({ input }) => {
    return getShowsByProductId(input.productId);
  }),

  /** Get a single show by ID */
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getShowById(input.id);
  }),
});

// ==================== PUBLIC MARVEL ENCYCLOPEDIA ROUTES ====================

const publicMarvelRouter = router({
  /** Get all marvel sets */
  sets: publicProcedure.query(async () => {
    return getAllMarvelSets();
  }),

  /** Get a single set by slug with its cards */
  getSetBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const set = await getMarvelSetBySlug(input.slug);
    if (!set) return null;
    const cards = await getMarvelCardsBySetId(set.id);
    return { set, cards };
  }),

  /** Get cards for a set by ID */
  getCardsBySet: publicProcedure.input(z.object({ setId: z.number() })).query(async ({ input }) => {
    return getMarvelCardsBySetId(input.setId);
  }),

  /** Search cards across all sets */
  search: publicProcedure.input(z.object({ query: z.string(), limit: z.number().default(50) })).query(async ({ input }) => {
    return searchMarvelCards(input.query, input.limit);
  }),
});

// ==================== PUBLIC GRADED CARDS ROUTES ====================

const publicGradedRouter = router({
  /** Get graded cards with filters */
  list: publicProcedure.input(z.object({
    gradingCompany: z.string().optional(),
    grade: z.string().optional(),
    cardSet: z.string().optional(),
    search: z.string().optional(),
    batchId: z.string().optional(),
    limit: z.number().default(100),
    offset: z.number().default(0),
  }).optional()).query(async ({ input }) => {
    return getAllGradedCards(input ?? {});
  }),

  /** Get graded card stats */
  stats: publicProcedure.query(async () => {
    return getGradedCardStats();
  }),

  /** Get grade distribution */
  gradeDistribution: publicProcedure.query(async () => {
    return getGradedCardGradeDistribution();
  }),

  /** Get unique sets in graded inventory */
  sets: publicProcedure.query(async () => {
    return getGradedCardSets();
  }),
});

// ==================== COMBINED PUBLIC ROUTER ====================

export const publicRouter = router({
  products: publicProductRouter,
  checklist: publicChecklistRouter,
  pulls: publicPullRouter,
  shows: publicShowRouter,
  marvel: publicMarvelRouter,
  graded: publicGradedRouter,
});
