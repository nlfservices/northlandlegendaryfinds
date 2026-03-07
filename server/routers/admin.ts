import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { launchSubscribers } from "../../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";
import {
  getAllProducts, createProduct, updateProduct, deleteProduct, getProductById,
  getChecklistByProductId, createChecklistItem, createChecklistItems, updateChecklistItem, deleteChecklistItem, deleteChecklistByProductId,
  getPullsByProductId, createPull, deletePull, getRecentPulls, getPullsByShowId,
  getAllShows, getShowsByProductId, createShow, updateShow, deleteShow, getShowById,
  getProductStats, bulkCreatePulls, findChecklistItemByName,
  getAllCardSets, getCardSetById, createCardSet, updateCardSet, deleteCardSet,
  getAllInventoryCards, getInventoryCardById, createInventoryCard, bulkCreateInventoryCards,
  updateInventoryCard, deleteInventoryCard, allocateCardsToRepack, deallocateCardsFromRepack,
  getInventoryStats,
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
      imageUrl: z.string().optional(),
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
        imageUrl: row.imageUrl?.trim() || null,
        sortOrder: index,
      };
    });
    await createChecklistItems(items);
    return { success: true, count: items.length };
  }),

  /** CSV mark-as-pulled - matches cards by name+parallel and marks them as pulled */
  csvMarkPulled: adminProcedure.input(z.object({
    productId: z.number(),
    rows: z.array(z.object({
      cardName: z.string().min(1),
      parallel: z.string().optional(),
      cardNumber: z.string().optional(),
      pulled: z.string().optional(),
    })),
  })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    // Get all checklist items for this product
    const allItems = await getChecklistByProductId(input.productId);
    let markedCount = 0;
    let notFoundNames: string[] = [];

    for (const row of input.rows) {
      const pullValue = (row.pulled || "").toLowerCase().trim();
      // Only process rows marked as pulled
      if (!["yes", "y", "true", "1", "x", "pulled"].includes(pullValue)) continue;

      const cardName = row.cardName.trim().toLowerCase();
      const parallel = row.parallel?.trim().toLowerCase() || "";
      const cardNumber = row.cardNumber?.trim().toLowerCase() || "";

      // Find matching checklist item
      const match = allItems.find(item => {
        const nameMatch = item.cardName.toLowerCase() === cardName;
        if (!nameMatch) return false;
        // If parallel provided, must match
        if (parallel && item.parallel && item.parallel.toLowerCase() !== parallel) return false;
        // If card number provided, must match
        if (cardNumber && item.cardNumber && item.cardNumber.toLowerCase() !== cardNumber) return false;
        return true;
      });

      if (match && !match.isPulled) {
        await updateChecklistItem(match.id, { isPulled: true });
        markedCount++;
      } else if (!match) {
        notFoundNames.push(row.cardName);
      }
    }

    return {
      success: true,
      markedCount,
      notFound: notFoundNames.slice(0, 20), // Return first 20 not-found names
      totalNotFound: notFoundNames.length,
    };
  }),

  /** Export checklist as CSV-ready data */
  exportChecklist: adminProcedure.input(z.object({
    productId: z.number(),
  })).query(async ({ input }) => {
    const items = await getChecklistByProductId(input.productId);
    return items.map(item => ({
      cardName: item.cardName,
      cardSet: item.cardSet || "",
      cardYear: item.cardYear || "",
      cardNumber: item.cardNumber || "",
      parallel: item.parallel || "",
      tier: item.tier,
      estimatedValue: item.estimatedValue || "",
      imageUrl: item.imageUrl || "",
      isPulled: item.isPulled ? "YES" : "NO",
    }));
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

// ==================== ADMIN CARD SET ROUTES ====================

const cardSetInput = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  year: z.string().optional(),
  manufacturer: z.string().optional(),
  category: z.enum(["marvel", "starwars", "sports", "pokemon", "other"]).default("marvel"),
  totalBaseCards: z.number().optional(),
  imageUrl: z.string().optional(),
  notes: z.string().optional(),
});

const cardSetRouter = router({
  list: adminProcedure.query(async () => {
    return getAllCardSets();
  }),

  getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getCardSetById(input.id);
  }),

  create: adminProcedure.input(cardSetInput).mutation(async ({ input }) => {
    const data = {
      ...input,
      year: input.year ?? null,
      manufacturer: input.manufacturer ?? null,
      totalBaseCards: input.totalBaseCards ?? null,
      imageUrl: input.imageUrl ?? null,
      notes: input.notes ?? null,
    };
    await createCardSet(data);
    return { success: true };
  }),

  update: adminProcedure.input(z.object({
    id: z.number(),
    data: cardSetInput.partial(),
  })).mutation(async ({ input }) => {
    await updateCardSet(input.id, input.data);
    return { success: true };
  }),

  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await deleteCardSet(input.id);
    return { success: true };
  }),
});

// ==================== ADMIN INVENTORY ROUTES ====================

const inventoryCardInput = z.object({
  cardSetId: z.number(),
  cardName: z.string().min(1),
  cardNumber: z.string().optional(),
  parallel: z.string().optional(),
  serialNumber: z.string().optional(),
  condition: z.enum(["raw", "psa10", "psa9", "psa8", "psa7", "bgs10", "bgs9.5", "bgs9", "sgc10", "sgc9.5", "sgc9", "other"]).default("raw"),
  gradingCompany: z.string().optional(),
  gradeValue: z.string().optional(),
  quantity: z.number().default(1),
  purchasePriceCents: z.number().optional(),
  estimatedValueCents: z.number().optional(),
  source: z.string().optional(),
  imageUrl: z.string().optional(),
  notes: z.string().optional(),
});

const inventoryRouter = router({
  list: adminProcedure.input(z.object({
    cardSetId: z.number().optional(),
    status: z.string().optional(),
    search: z.string().optional(),
    allocatedToProductId: z.number().optional(),
  }).optional()).query(async ({ input }) => {
    return getAllInventoryCards(input ?? undefined);
  }),

  getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getInventoryCardById(input.id);
  }),

  stats: adminProcedure.query(async () => {
    return getInventoryStats();
  }),

  create: adminProcedure.input(inventoryCardInput).mutation(async ({ input }) => {
    const data = {
      ...input,
      cardNumber: input.cardNumber ?? null,
      parallel: input.parallel ?? null,
      serialNumber: input.serialNumber ?? null,
      gradingCompany: input.gradingCompany ?? null,
      gradeValue: input.gradeValue ?? null,
      purchasePriceCents: input.purchasePriceCents ?? null,
      estimatedValueCents: input.estimatedValueCents ?? null,
      source: input.source ?? null,
      imageUrl: input.imageUrl ?? null,
      notes: input.notes ?? null,
    };
    await createInventoryCard(data);
    return { success: true };
  }),

  /** CSV bulk import inventory cards */
  csvImport: adminProcedure.input(z.object({
    cardSetId: z.number(),
    rows: z.array(z.object({
      cardName: z.string().min(1),
      cardNumber: z.string().optional(),
      parallel: z.string().optional(),
      serialNumber: z.string().optional(),
      condition: z.string().optional(),
      quantity: z.number().optional(),
      purchasePrice: z.number().optional(),
      estimatedValue: z.number().optional(),
      source: z.string().optional(),
      notes: z.string().optional(),
    })),
  })).mutation(async ({ input }) => {
    const validConditions = ["raw", "psa10", "psa9", "psa8", "psa7", "bgs10", "bgs9.5", "bgs9", "sgc10", "sgc9.5", "sgc9", "other"];
    const cards = input.rows.map(row => {
      let condition = (row.condition || "raw").toLowerCase().trim();
      if (!validConditions.includes(condition)) condition = "raw";
      return {
        cardSetId: input.cardSetId,
        cardName: row.cardName.trim(),
        cardNumber: row.cardNumber?.trim() || null,
        parallel: row.parallel?.trim() || null,
        serialNumber: row.serialNumber?.trim() || null,
        condition: condition as any,
        quantity: row.quantity ?? 1,
        purchasePriceCents: row.purchasePrice ? Math.round(row.purchasePrice * 100) : null,
        estimatedValueCents: row.estimatedValue ? Math.round(row.estimatedValue * 100) : null,
        source: row.source?.trim() || null,
        notes: row.notes?.trim() || null,
      };
    });
    const result = await bulkCreateInventoryCards(cards);
    return { success: true, count: result.count };
  }),

  update: adminProcedure.input(z.object({
    id: z.number(),
    data: inventoryCardInput.partial(),
  })).mutation(async ({ input }) => {
    await updateInventoryCard(input.id, input.data);
    return { success: true };
  }),

  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await deleteInventoryCard(input.id);
    return { success: true };
  }),

  /** Allocate cards from inventory to a repack product */
  allocateToRepack: adminProcedure.input(z.object({
    cardIds: z.array(z.number()),
    productId: z.number(),
    tier: z.enum(["chase", "hit", "base", "bonus"]),
  })).mutation(async ({ input }) => {
    const results = await allocateCardsToRepack(input.cardIds, input.productId, input.tier);
    return { success: true, allocated: results.length };
  }),

  /** Deallocate cards from a repack (return to inventory) */
  deallocateFromRepack: adminProcedure.input(z.object({
    cardIds: z.array(z.number()),
  })).mutation(async ({ input }) => {
    await deallocateCardsFromRepack(input.cardIds);
    return { success: true };
  }),
});

/// ==================== ADMIN LAUNCH SUBSCRIBER ROUTES ====================

const launchSubscriberRouter = router({
  /** Get all launch subscribers with optional product filter */
  list: adminProcedure
    .input(
      z.object({
        productSlug: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      if (input?.productSlug) {
        return db
          .select()
          .from(launchSubscribers)
          .where(eq(launchSubscribers.productSlug, input.productSlug))
          .orderBy(desc(launchSubscribers.createdAt));
      }

      return db
        .select()
        .from(launchSubscribers)
        .orderBy(desc(launchSubscribers.createdAt));
    }),

  /** Get subscriber count per product */
  stats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select({
        productSlug: launchSubscribers.productSlug,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(launchSubscribers)
      .groupBy(launchSubscribers.productSlug);
  }),

  /** Delete a subscriber */
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(launchSubscribers).where(eq(launchSubscribers.id, input.id));
      return { success: true };
    }),
});

// ==================== COMBINED ADMIN ROUTER ====================
export const adminRouter = router({
  products: productRouter,
  checklist: checklistRouter,
  pulls: pullRouter,
  shows: showRouter,
  cardSets: cardSetRouter,
  inventory: inventoryRouter,
  launchSubscribers: launchSubscriberRouter,
});
