import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { affiliateLinks } from "../../drizzle/schema";
import { eq, asc, desc } from "drizzle-orm";

const affiliateLinkInput = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
  imageUrl: z.string().optional(),
  category: z.enum(["cards", "toys", "clothing", "collectibles", "comics", "other"]).default("cards"),
  characterTags: z.array(z.string()).optional(),
  pinnedArticleIds: z.array(z.number()).optional(),
  active: z.boolean().default(true),
  position: z.number().default(0),
  priceDisplay: z.string().optional(),
  retailer: z.string().optional(),
  isAffiliate: z.boolean().default(false),
});

// ==================== ADMIN ROUTES ====================

export const affiliateAdminRouter = router({
  list: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    return db.select().from(affiliateLinks).orderBy(asc(affiliateLinks.position), desc(affiliateLinks.createdAt));
  }),

  create: adminProcedure.input(affiliateLinkInput).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const [result] = await db.insert(affiliateLinks).values({
      name: input.name,
      url: input.url,
      imageUrl: input.imageUrl ?? null,
      category: input.category,
      characterTags: input.characterTags ?? null,
      pinnedArticleIds: input.pinnedArticleIds ?? null,
      active: input.active,
      position: input.position,
      priceDisplay: input.priceDisplay ?? null,
      retailer: input.retailer ?? null,
      isAffiliate: input.isAffiliate,
    });
    return { id: result.insertId };
  }),

  update: adminProcedure
    .input(z.object({ id: z.number() }).merge(affiliateLinkInput.partial()))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const { id, ...data } = input;
      await db.update(affiliateLinks).set({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl ?? null }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.characterTags !== undefined && { characterTags: data.characterTags ?? null }),
        ...(data.pinnedArticleIds !== undefined && { pinnedArticleIds: data.pinnedArticleIds ?? null }),
        ...(data.active !== undefined && { active: data.active }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.priceDisplay !== undefined && { priceDisplay: data.priceDisplay ?? null }),
        ...(data.retailer !== undefined && { retailer: data.retailer ?? null }),
        ...(data.isAffiliate !== undefined && { isAffiliate: data.isAffiliate }),
      }).where(eq(affiliateLinks.id, id));
      return { success: true };
    }),

  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    await db.delete(affiliateLinks).where(eq(affiliateLinks.id, input.id));
    return { success: true };
  }),

  toggleActive: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const [link] = await db.select().from(affiliateLinks).where(eq(affiliateLinks.id, input.id));
    if (!link) throw new TRPCError({ code: "NOT_FOUND", message: "Link not found" });
    await db.update(affiliateLinks).set({ active: !link.active }).where(eq(affiliateLinks.id, input.id));
    return { success: true, active: !link.active };
  }),
});

// ==================== PUBLIC ROUTES ====================

export const affiliatePublicRouter = router({
  /** Get active affiliate links matching an article's tags/characters or pinned to it */
  getForArticle: publicProcedure
    .input(z.object({
      articleId: z.number(),
      tags: z.array(z.string()).optional(),
      relatedCharacters: z.array(z.string()).optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      
      // Get all active links
      const allLinks = await db.select().from(affiliateLinks)
        .where(eq(affiliateLinks.active, true))
        .orderBy(asc(affiliateLinks.position));

      // Filter: pinned to this article OR matching character tags
      const articleTags = [...(input.tags || []), ...(input.relatedCharacters || [])].map(t => t.toLowerCase());

      const matched = allLinks.filter((link: typeof affiliateLinks.$inferSelect) => {
        // Check if pinned to this article
        if (link.pinnedArticleIds && link.pinnedArticleIds.includes(input.articleId)) {
          return true;
        }
        // Check character tag overlap
        if (link.characterTags && link.characterTags.length > 0 && articleTags.length > 0) {
          return link.characterTags.some((ct: string) => articleTags.includes(ct.toLowerCase()));
        }
        // If no tags on the link, it's a "global" recommendation (shows everywhere)
        if (!link.characterTags || link.characterTags.length === 0) {
          return true;
        }
        return false;
      });

      // Return max 6 links
      return matched.slice(0, 6);
    }),
});
