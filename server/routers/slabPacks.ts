import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getAllSlabPacks, getSlabPackById, getSlabPackBySlug, createSlabPack, updateSlabPack, deleteSlabPack,
  getSlabPackCards, getSlabPackCardById, createSlabPackCard, updateSlabPackCard, deleteSlabPackCard,
  bulkCreateSlabPackCards, pullSlabPackCard, removeSlabPackCard, getSlabPackStats, getSlabPackChecklist,
} from "../db";
import { storagePut } from "../storage";

// ==================== ADMIN SLAB PACK ROUTES ====================

const slabPackInput = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  priceCents: z.number().min(50), // minimum $0.50
  slabsPerPack: z.number().min(1).default(1),
  totalPacks: z.number().optional(),
  tier: z.enum(["silver", "gold", "diamond", "infinity"]).default("silver"),
  status: z.enum(["draft", "coming_soon", "active", "soldout", "archived"]).default("draft"),
  launchDate: z.number().optional(),
  sortOrder: z.number().default(0),
});

const slabPackCardInput = z.object({
  slabPackId: z.number(),
  cardName: z.string().min(1),
  cardSet: z.string().optional(),
  cardYear: z.string().optional(),
  cardNumber: z.string().optional(),
  parallel: z.string().optional(),
  serialNumber: z.string().optional(),
  gradingCompany: z.string().optional(),
  grade: z.string().optional(),
  gradeNumeric: z.string().optional(),
  tier: z.enum(["grail", "chase", "lineup"]).default("lineup"),
  estimatedValueCents: z.number().optional(),
  frontImageUrl: z.string().optional(),
  backImageUrl: z.string().optional(),
  sortOrder: z.number().default(0),
});

export const slabPackAdminRouter = router({
  // ---- Pack Type Management ----
  packs: router({
    list: adminProcedure.query(async () => {
      return getAllSlabPacks();
    }),

    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getSlabPackById(input.id);
    }),

    create: adminProcedure.input(slabPackInput).mutation(async ({ input }) => {
      const id = await createSlabPack({
        ...input,
        description: input.description ?? null,
        imageUrl: input.imageUrl ?? null,
        totalPacks: input.totalPacks ?? null,
        launchDate: input.launchDate ?? null,
      });
      return { success: true, id };
    }),

    update: adminProcedure.input(z.object({ id: z.number() }).merge(slabPackInput.partial())).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateSlabPack(id, data as any);
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteSlabPack(input.id);
      return { success: true };
    }),

    stats: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getSlabPackStats(input.id);
    }),
  }),

  // ---- Card Management ----
  cards: router({
    list: adminProcedure.input(z.object({ slabPackId: z.number() })).query(async ({ input }) => {
      return getSlabPackCards(input.slabPackId);
    }),

    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getSlabPackCardById(input.id);
    }),

    create: adminProcedure.input(slabPackCardInput).mutation(async ({ input }) => {
      const id = await createSlabPackCard({
        ...input,
        cardSet: input.cardSet ?? null,
        cardYear: input.cardYear ?? null,
        cardNumber: input.cardNumber ?? null,
        parallel: input.parallel ?? null,
        serialNumber: input.serialNumber ?? null,
        gradingCompany: input.gradingCompany ?? null,
        grade: input.grade ?? null,
        gradeNumeric: input.gradeNumeric ?? null,
        estimatedValueCents: input.estimatedValueCents ?? null,
        frontImageUrl: input.frontImageUrl ?? null,
        backImageUrl: input.backImageUrl ?? null,
      });
      return { success: true, id };
    }),

    update: adminProcedure.input(z.object({ id: z.number() }).merge(slabPackCardInput.partial())).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateSlabPackCard(id, data as any);
      return { success: true };
    }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteSlabPackCard(input.id);
      return { success: true };
    }),

    /** Quick Pull — mark a card as claimed (digital or in-person) */
    pull: adminProcedure.input(z.object({
      cardId: z.number(),
      method: z.enum(["digital", "in_person"]),
      pulledBy: z.string().optional(),
    })).mutation(async ({ input }) => {
      const success = await pullSlabPackCard(input.cardId, input.method, input.pulledBy);
      if (!success) {
        throw new Error("Card not available for pull (may already be claimed)");
      }
      return { success: true };
    }),

    /** Remove card from pool (admin removes from inventory) */
    remove: adminProcedure.input(z.object({ cardId: z.number() })).mutation(async ({ input }) => {
      await removeSlabPackCard(input.cardId);
      return { success: true };
    }),

    /** Bulk create cards from CSV/form data */
    bulkCreate: adminProcedure.input(z.object({
      cards: z.array(slabPackCardInput),
    })).mutation(async ({ input }) => {
      const cardsData = input.cards.map(c => ({
        ...c,
        cardSet: c.cardSet ?? null,
        cardYear: c.cardYear ?? null,
        cardNumber: c.cardNumber ?? null,
        parallel: c.parallel ?? null,
        serialNumber: c.serialNumber ?? null,
        gradingCompany: c.gradingCompany ?? null,
        grade: c.grade ?? null,
        gradeNumeric: c.gradeNumeric ?? null,
        estimatedValueCents: c.estimatedValueCents ?? null,
        frontImageUrl: c.frontImageUrl ?? null,
        backImageUrl: c.backImageUrl ?? null,
      }));
      await bulkCreateSlabPackCards(cardsData);
      return { success: true, count: cardsData.length };
    }),

    /** Upload card image (front or back) */
    uploadImage: adminProcedure.input(z.object({
      cardId: z.number(),
      side: z.enum(["front", "back"]),
      base64: z.string(),
      mimeType: z.string().default("image/jpeg"),
    })).mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64, "base64");
      const ext = input.mimeType.includes("png") ? "png" : input.mimeType.includes("webp") ? "webp" : "jpg";
      const suffix = Math.random().toString(36).substring(2, 8);
      const key = `slab-packs/cards/${input.cardId}-${input.side}-${suffix}.${ext}`;
      const { url } = await storagePut(key, buffer, input.mimeType);
      
      const updateData = input.side === "front" 
        ? { frontImageUrl: url } 
        : { backImageUrl: url };
      await updateSlabPackCard(input.cardId, updateData);
      
      return { success: true, url };
    }),
  }),
});

// ==================== PUBLIC SLAB PACK ROUTES ====================

export const slabPackPublicRouter = router({
  /** List all visible slab packs (coming_soon + active + soldout) */
  list: publicProcedure.query(async () => {
    const packs = await getAllSlabPacks();
    return packs.filter(p => ["coming_soon", "active", "soldout"].includes(p.status));
  }),

  /** Get a single slab pack by slug */
  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    return getSlabPackBySlug(input.slug);
  }),

  /** Get the public checklist for a slab pack */
  checklist: publicProcedure.input(z.object({ slabPackId: z.number() })).query(async ({ input }) => {
    return getSlabPackChecklist(input.slabPackId);
  }),

  /** Get stats for a slab pack (public-safe: total, available, claimed) */
  stats: publicProcedure.input(z.object({ slabPackId: z.number() })).query(async ({ input }) => {
    const stats = await getSlabPackStats(input.slabPackId);
    return {
      total: stats.total,
      available: stats.available,
      claimed: stats.claimed,
      byTier: stats.byTier,
    };
  }),
});
