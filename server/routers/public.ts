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
  getMarvelCardBySetAndSlug, getRelatedCards, getAdjacentCards,
} from "../db";
import { launchSubscribers } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";
import { createGHLContact } from "../ghl";
import { notifyOwner } from "../_core/notification";

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

  /** Get a single card by set slug + card slug (for detail page) */
  getCardBySlug: publicProcedure.input(z.object({
    setSlug: z.string(),
    cardSlug: z.string(),
  })).query(async ({ input }) => {
    const card = await getMarvelCardBySetAndSlug(input.setSlug, input.cardSlug);
    if (!card) return null;

    // Fetch related cards (same character in other sets) and adjacent cards
    const [related, adjacent] = await Promise.all([
      getRelatedCards(card.characterName, card.id),
      getAdjacentCards(card.setId, card.sortOrder),
    ]);

    return { card, related, adjacent };
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

// ==================== PUBLIC LAUNCH SUBSCRIBER ROUTES ====================

const publicLaunchRouter = router({
  /** Subscribe an email for product launch notification */
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
        productSlug: z.string().min(1),
        source: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check for duplicate subscription
      const existing = await db
        .select({ id: launchSubscribers.id })
        .from(launchSubscribers)
        .where(
          and(
            eq(launchSubscribers.email, input.email.toLowerCase().trim()),
            eq(launchSubscribers.productSlug, input.productSlug)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return { success: true, alreadySubscribed: true };
      }

      await db.insert(launchSubscribers).values({
        email: input.email.toLowerCase().trim(),
        productSlug: input.productSlug,
        userId: ctx.user?.id ?? null,
        source: input.source ?? "product-page",
      });

      return { success: true, alreadySubscribed: false };
    }),

  /** Check if an email is already subscribed for a product */
  checkSubscription: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        productSlug: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { subscribed: false };

      const existing = await db
        .select({ id: launchSubscribers.id })
        .from(launchSubscribers)
        .where(
          and(
            eq(launchSubscribers.email, input.email.toLowerCase().trim()),
            eq(launchSubscribers.productSlug, input.productSlug)
          )
        )
        .limit(1);

      return { subscribed: existing.length > 0 };
    }),
});

// ==================== EMAIL SUBSCRIBER / GHL ROUTES ====================

const publicSubscribeRouter = router({
  /** Subscribe email via popup or subscribe page — creates GHL contact + notifies admin */
  submit: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        source: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const email = input.email.toLowerCase().trim();
      const source = input.source || "website-popup";

      // 1. Create contact in GoHighLevel
      const ghlResult = await createGHLContact({
        email,
        firstName: input.firstName,
        lastName: input.lastName,
        tags: ["website-subscriber", `source-${source}`],
        source: `NLF Website - ${source}`,
      });

      if (!ghlResult.success && !ghlResult.isDuplicate) {
        console.error("[Subscribe] GHL contact creation failed:", ghlResult.error);
        // Don't fail the request — still notify owner
      }

      // 2. Send notification to admin
      try {
        await notifyOwner({
          title: `New Email Subscriber: ${email}`,
          content: [
            `**New subscriber from ${source}**`,
            ``,
            `- **Email:** ${email}`,
            input.firstName ? `- **First Name:** ${input.firstName}` : "",
            input.lastName ? `- **Last Name:** ${input.lastName}` : "",
            `- **Source:** ${source}`,
            `- **GHL Status:** ${ghlResult.isDuplicate ? "Already exists" : ghlResult.success ? "Contact created" : "Failed — " + (ghlResult.error || "unknown")}`,
            ghlResult.contactId ? `- **GHL Contact ID:** ${ghlResult.contactId}` : "",
            `- **Time:** ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}`,
          ]
            .filter(Boolean)
            .join("\n"),
        });
      } catch (notifyErr) {
        console.warn("[Subscribe] Owner notification failed:", notifyErr);
      }

      return {
        success: true,
        isDuplicate: ghlResult.isDuplicate || false,
        message: ghlResult.isDuplicate
          ? "You're already on our list! We'll keep you updated."
          : "Welcome to the NLF community! Check your email for your 10% discount code.",
      };
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
  launch: publicLaunchRouter,
  subscribe: publicSubscribeRouter,
});
