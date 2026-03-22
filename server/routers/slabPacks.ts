import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getAllSlabPacks, getSlabPackById, getSlabPackBySlug, createSlabPack, updateSlabPack, deleteSlabPack,
  getSlabPackCards, createSlabPackCard, updateSlabPackCard, deleteSlabPackCard, pullSlabPackCard,
  getAvailableCardForPack, createSlabPackOrder, getSlabPackOrderById, updateSlabPackOrder,
  getSlabPackOrderCards, createSlabPackOrderCard, getActiveSlabPacks,
} from "../db";
import { storagePut } from "../storage";

// ==================== ADMIN ROUTER ====================
export const slabPackAdminRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return getAllSlabPacks();
  }),

  get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const pack = await getSlabPackById(input.id);
    if (!pack) throw new TRPCError({ code: "NOT_FOUND" });
    const cards = await getSlabPackCards(input.id);
    return { pack, cards };
  }),

  create: protectedProcedure.input(z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    tier: z.enum(["silver", "gold", "diamond", "infinity"]),
    priceCents: z.number().min(0),
    description: z.string().optional(),
    slabsPerPack: z.number().min(1).default(1),
    totalPacks: z.number().min(1).optional(),
    status: z.enum(["draft", "coming_soon", "active", "soldout", "archived"]).default("draft"),
    launchDate: z.number().optional(),
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const id = await createSlabPack(input);
    return { id };
  }),

  update: protectedProcedure.input(z.object({
    id: z.number(),
    name: z.string().optional(),
    slug: z.string().optional(),
    tier: z.enum(["silver", "gold", "diamond", "infinity"]).optional(),
    priceCents: z.number().optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    slabsPerPack: z.number().optional(),
    totalPacks: z.number().nullable().optional(),
    status: z.enum(["draft", "coming_soon", "active", "soldout", "archived"]).optional(),
    launchDate: z.number().nullable().optional(),
    sortOrder: z.number().optional(),
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const { id, ...data } = input;
    return updateSlabPack(id, data);
  }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return deleteSlabPack(input.id);
  }),

  uploadImage: protectedProcedure.input(z.object({
    packId: z.number(),
    base64: z.string(),
    filename: z.string(),
    contentType: z.string(),
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const buffer = Buffer.from(input.base64, "base64");
    const suffix = Math.random().toString(36).slice(2, 10);
    const key = `slab-packs/${input.packId}/pack-${suffix}-${input.filename}`;
    const { url } = await storagePut(key, buffer, input.contentType);
    await updateSlabPack(input.packId, { imageUrl: url });
    return { url };
  }),

  addCard: protectedProcedure.input(z.object({
    slabPackId: z.number(),
    cardName: z.string().min(1),
    cardSet: z.string().optional(),
    cardYear: z.string().optional(),
    cardNumber: z.string().optional(),
    parallel: z.string().optional(),
    gradingCompany: z.string().optional(),
    grade: z.string().optional(),
    gradeNumeric: z.string().optional(), // decimal as string
    serialNumber: z.string().optional(),
    tier: z.enum(["grail", "chase", "lineup"]).default("lineup"),
    estimatedValueCents: z.number().optional(),
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const id = await createSlabPackCard(input);
    return { id };
  }),

  updateCard: protectedProcedure.input(z.object({
    id: z.number(),
    cardName: z.string().optional(),
    cardSet: z.string().optional(),
    cardYear: z.string().optional(),
    cardNumber: z.string().optional(),
    parallel: z.string().optional(),
    gradingCompany: z.string().optional(),
    grade: z.string().optional(),
    gradeNumeric: z.string().optional(),
    serialNumber: z.string().optional(),
    tier: z.enum(["grail", "chase", "lineup"]).optional(),
    estimatedValueCents: z.number().optional(),
    status: z.enum(["available", "claimed", "removed"]).optional(),
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const { id, ...data } = input;
    return updateSlabPackCard(id, data);
  }),

  deleteCard: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return deleteSlabPackCard(input.id);
  }),

  uploadCardImage: protectedProcedure.input(z.object({
    cardId: z.number(),
    side: z.enum(["front", "back"]),
    base64: z.string(),
    filename: z.string(),
    contentType: z.string(),
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const buffer = Buffer.from(input.base64, "base64");
    const suffix = Math.random().toString(36).slice(2, 10);
    const key = `slab-packs/cards/${input.cardId}/${input.side}-${suffix}-${input.filename}`;
    const { url } = await storagePut(key, buffer, input.contentType);
    if (input.side === "front") {
      await updateSlabPackCard(input.cardId, { frontImageUrl: url });
    } else {
      await updateSlabPackCard(input.cardId, { backImageUrl: url });
    }
    return { url };
  }),

  quickPull: protectedProcedure.input(z.object({
    cardId: z.number(),
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return pullSlabPackCard(input.cardId, "in_person");
  }),
});

// ==================== PUBLIC ROUTER ====================
export const slabPackPublicRouter = router({
  activePacks: publicProcedure.query(async () => {
    return getActiveSlabPacks();
  }),

  checklist: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const pack = await getSlabPackBySlug(input.slug);
    if (!pack) throw new TRPCError({ code: "NOT_FOUND" });
    const cards = await getSlabPackCards(pack.id);
    return {
      pack,
      cards: cards.map(c => ({
        ...c,
        // Only show images for claimed cards (revealed)
        frontImageUrl: c.status === "claimed" ? c.frontImageUrl : null,
        backImageUrl: c.status === "claimed" ? c.backImageUrl : null,
      })),
      stats: {
        total: cards.length,
        available: cards.filter(c => c.status === "available").length,
        claimed: cards.filter(c => c.status === "claimed").length,
        grails: cards.filter(c => c.tier === "grail").length,
        chases: cards.filter(c => c.tier === "chase").length,
        lineups: cards.filter(c => c.tier === "lineup").length,
      },
    };
  }),

  getReveal: publicProcedure.input(z.object({ orderId: z.number() })).query(async ({ input }) => {
    const order = await getSlabPackOrderById(input.orderId);
    if (!order) throw new TRPCError({ code: "NOT_FOUND" });
    const pack = await getSlabPackById(order.packId);
    const orderCards = await getSlabPackOrderCards(input.orderId);
    return { order, pack, cards: orderCards };
  }),

  testReveal: protectedProcedure.input(z.object({ packId: z.number() })).mutation(async ({ ctx, input }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const pack = await getSlabPackById(input.packId);
    if (!pack) throw new TRPCError({ code: "NOT_FOUND" });

    const cards: number[] = [];
    for (let i = 0; i < pack.slabsPerPack; i++) {
      const card = await getAvailableCardForPack(input.packId);
      if (card && !cards.includes(card.id)) {
        cards.push(card.id);
      }
    }

    if (cards.length === 0) throw new TRPCError({ code: "BAD_REQUEST", message: "No available cards in this pack" });

    const orderId = await createSlabPackOrder({
      packId: input.packId,
      userId: ctx.user.id,
      orderStatus: "paid",
    });

    if (!orderId) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    for (let i = 0; i < cards.length; i++) {
      await createSlabPackOrderCard({
        orderId,
        cardId: cards[i],
        revealOrder: i + 1,
      });
    }

    return { orderId };
  }),

  markRevealed: publicProcedure.input(z.object({
    orderId: z.number(),
    cardId: z.number(),
  })).mutation(async ({ input }) => {
    await pullSlabPackCard(input.cardId, "digital");
    await updateSlabPackOrder(input.orderId, {
      orderStatus: "revealed",
      revealedAt: Date.now(),
    });
    return { success: true };
  }),
});
