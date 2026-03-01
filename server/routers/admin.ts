import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import {
  getAllProducts, createProduct, updateProduct, deleteProduct, getProductById,
  getChecklistByProductId, createChecklistItem, createChecklistItems, updateChecklistItem, deleteChecklistItem, deleteChecklistByProductId,
  getPullsByProductId, createPull, deletePull, getRecentPulls, getPullsByShowId,
  getAllShows, getShowsByProductId, createShow, updateShow, deleteShow, getShowById,
  getProductStats, bulkCreatePulls, findChecklistItemByName,
} from "../db";

// ==================== ADMIN PRODUCT ROUTES ====================

const productInput = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.number().optional(),
  totalPacks: z.number().default(500),
  packsRemaining: z.number().optional(),
  category: z.enum(["marvel", "starwars", "sports", "pokemon", "other"]).default("marvel"),
  status: z.enum(["draft", "active", "soldout", "archived"]).default("draft"),
  isWhatnotExclusive: z.boolean().default(false),
  whatnotSeriesName: z.string().optional(),
  packsPerShow: z.number().optional(),
  shopifyUrl: z.string().optional(),
  sortOrder: z.number().default(0),
});

const productRouter = router({
  list: adminProcedure.query(async () => {
    return getAllProducts();
  }),

  getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getProductById(input.id);
  }),

  create: adminProcedure.input(productInput).mutation(async ({ input }) => {
    const data = {
      ...input,
      packsRemaining: input.packsRemaining ?? input.totalPacks,
      description: input.description ?? null,
      imageUrl: input.imageUrl ?? null,
      price: input.price ?? null,
      whatnotSeriesName: input.whatnotSeriesName ?? null,
      packsPerShow: input.packsPerShow ?? null,
      shopifyUrl: input.shopifyUrl ?? null,
    };
    await createProduct(data);
    return { success: true };
  }),

  update: adminProcedure.input(z.object({
    id: z.number(),
    data: productInput.partial(),
  })).mutation(async ({ input }) => {
    await updateProduct(input.id, input.data);
    return { success: true };
  }),

  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await deleteProduct(input.id);
    return { success: true };
  }),

  stats: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getProductStats(input.id);
  }),
});

// ==================== ADMIN CHECKLIST ROUTES ====================

const checklistItemInput = z.object({
  productId: z.number(),
  cardName: z.string().min(1),
  cardSet: z.string().optional(),
  cardYear: z.string().optional(),
  cardNumber: z.string().optional(),
  parallel: z.string().optional(),
  tier: z.enum(["chase", "hit", "base", "bonus"]).default("base"),
  estimatedValue: z.string().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().default(0),
});

const checklistRouter = router({
  getByProduct: adminProcedure.input(z.object({ productId: z.number() })).query(async ({ input }) => {
    return getChecklistByProductId(input.productId);
  }),

  create: adminProcedure.input(checklistItemInput).mutation(async ({ input }) => {
    const data = {
      ...input,
      cardSet: input.cardSet ?? null,
      cardYear: input.cardYear ?? null,
      cardNumber: input.cardNumber ?? null,
      parallel: input.parallel ?? null,
      estimatedValue: input.estimatedValue ?? null,
      imageUrl: input.imageUrl ?? null,
    };
    await createChecklistItem(data);
    return { success: true };
  }),

  bulkCreate: adminProcedure.input(z.object({
    productId: z.number(),
    items: z.array(z.object({
      cardName: z.string().min(1),
      cardSet: z.string().optional(),
      cardYear: z.string().optional(),
      cardNumber: z.string().optional(),
      parallel: z.string().optional(),
      tier: z.enum(["chase", "hit", "base", "bonus"]).default("base"),
      estimatedValue: z.string().optional(),
      sortOrder: z.number().default(0),
    })),
  })).mutation(async ({ input }) => {
    const items = input.items.map((item, index) => ({
      ...item,
      productId: input.productId,
      cardSet: item.cardSet ?? null,
      cardYear: item.cardYear ?? null,
      cardNumber: item.cardNumber ?? null,
      parallel: item.parallel ?? null,
      estimatedValue: item.estimatedValue ?? null,
      imageUrl: null,
      sortOrder: item.sortOrder || index,
    }));
    await createChecklistItems(items);
    return { success: true, count: items.length };
  }),

  update: adminProcedure.input(z.object({
    id: z.number(),
    data: checklistItemInput.partial(),
  })).mutation(async ({ input }) => {
    await updateChecklistItem(input.id, input.data);
    return { success: true };
  }),

  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await deleteChecklistItem(input.id);
    return { success: true };
  }),

  deleteAllForProduct: adminProcedure.input(z.object({ productId: z.number() })).mutation(async ({ input }) => {
    await deleteChecklistByProductId(input.productId);
    return { success: true };
  }),

  /** CSV bulk import - accepts parsed CSV rows */
  csvImport: adminProcedure.input(z.object({
    productId: z.number(),
    rows: z.array(z.object({
      cardName: z.string().min(1),
      cardSet: z.string().optional(),
      cardYear: z.string().optional(),
      cardNumber: z.string().optional(),
      parallel: z.string().optional(),
      tier: z.string().optional(),
      estimatedValue: z.string().optional(),
    })),
  })).mutation(async ({ input }) => {
    const validTiers = ["chase", "hit", "base", "bonus"];
    const items = input.rows.map((row, index) => {
      // Map tier aliases: "top hits" -> chase, "middle of pack" -> hit, "low floor" -> base
      let tier = (row.tier || "base").toLowerCase().trim();
      if (tier === "top hits" || tier === "top" || tier === "top hit") tier = "chase";
      if (tier === "middle" || tier === "middle of pack" || tier === "mid") tier = "hit";
      if (tier === "low" || tier === "low floor" || tier === "floor") tier = "base";
      if (!validTiers.includes(tier)) tier = "base";

      return {
        productId: input.productId,
        cardName: row.cardName.trim(),
        cardSet: row.cardSet?.trim() || null,
        cardYear: row.cardYear?.trim() || null,
        cardNumber: row.cardNumber?.trim() || null,
        parallel: row.parallel?.trim() || null,
        tier: tier as "chase" | "hit" | "base" | "bonus",
        estimatedValue: row.estimatedValue?.trim() || null,
        imageUrl: null,
        sortOrder: index,
      };
    });
    await createChecklistItems(items);
    return { success: true, count: items.length };
  }),
});

// ==================== ADMIN PULL ROUTES ====================

const pullInput = z.object({
  checklistItemId: z.number(),
  productId: z.number(),
  showId: z.number().optional(),
  packNumber: z.number().optional(),
  pulledBy: z.string().optional(),
  notes: z.string().optional(),
});

const pullRouter = router({
  getByProduct: adminProcedure.input(z.object({ productId: z.number() })).query(async ({ input }) => {
    return getPullsByProductId(input.productId);
  }),

  getByShow: adminProcedure.input(z.object({ showId: z.number() })).query(async ({ input }) => {
    return getPullsByShowId(input.showId);
  }),

  recent: adminProcedure.input(z.object({ limit: z.number().default(20) }).optional()).query(async ({ input }) => {
    return getRecentPulls(input?.limit ?? 20);
  }),

  create: adminProcedure.input(pullInput).mutation(async ({ input }) => {
    const data = {
      ...input,
      showId: input.showId ?? null,
      packNumber: input.packNumber ?? null,
      pulledBy: input.pulledBy ?? null,
      notes: input.notes ?? null,
    };
    await createPull(data);
    return { success: true };
  }),

  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await deletePull(input.id);
    return { success: true };
  }),

  /** CSV bulk import pulls - matches card names to checklist items */
  csvImport: adminProcedure.input(z.object({
    productId: z.number(),
    showId: z.number().optional(),
    rows: z.array(z.object({
      cardName: z.string().min(1),
      packNumber: z.number().optional(),
      pulledBy: z.string().optional(),
      notes: z.string().optional(),
    })),
  })).mutation(async ({ input }) => {
    const results = { matched: 0, unmatched: 0, unmatchedCards: [] as string[] };
    const pullsToCreate = [];

    for (const row of input.rows) {
      const item = await findChecklistItemByName(input.productId, row.cardName.trim());
      if (item && !item.isPulled) {
        pullsToCreate.push({
          checklistItemId: item.id,
          productId: input.productId,
          showId: input.showId ?? null,
          packNumber: row.packNumber ?? null,
          pulledBy: row.pulledBy?.trim() ?? null,
          notes: row.notes?.trim() ?? null,
        });
        results.matched++;
      } else {
        results.unmatched++;
        results.unmatchedCards.push(row.cardName);
      }
    }

    if (pullsToCreate.length > 0) {
      await bulkCreatePulls(pullsToCreate);
    }

    return results;
  }),
});

// ==================== ADMIN SHOW ROUTES ====================

const showInput = z.object({
  title: z.string().min(1),
  productId: z.number(),
  showDate: z.number(), // UTC timestamp in ms
  whatnotUrl: z.string().optional(),
  status: z.enum(["scheduled", "live", "completed", "cancelled"]).default("scheduled"),
  packsOpened: z.number().default(0),
  startingPackNumber: z.number().optional(),
  notes: z.string().optional(),
});

const showRouter = router({
  list: adminProcedure.query(async () => {
    return getAllShows();
  }),

  getByProduct: adminProcedure.input(z.object({ productId: z.number() })).query(async ({ input }) => {
    return getShowsByProductId(input.productId);
  }),

  getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getShowById(input.id);
  }),

  create: adminProcedure.input(showInput).mutation(async ({ input }) => {
    const data = {
      ...input,
      whatnotUrl: input.whatnotUrl ?? null,
      startingPackNumber: input.startingPackNumber ?? null,
      notes: input.notes ?? null,
    };
    await createShow(data);
    return { success: true };
  }),

  update: adminProcedure.input(z.object({
    id: z.number(),
    data: showInput.partial(),
  })).mutation(async ({ input }) => {
    await updateShow(input.id, input.data);
    return { success: true };
  }),

  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await deleteShow(input.id);
    return { success: true };
  }),
});

// ==================== COMBINED ADMIN ROUTER ====================

export const adminRouter = router({
  products: productRouter,
  checklist: checklistRouter,
  pulls: pullRouter,
  shows: showRouter,
});
