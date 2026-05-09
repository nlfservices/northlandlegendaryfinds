/**
 * Card Shows Router - Public and Admin endpoints for the card shows directory
 * Public: list/search/filter shows
 * Admin: add, edit, delete, mark as past, bulk update
 */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { cardShows } from "../../drizzle/schema";
import { eq, like, and, or, desc, asc, sql, lte, gte } from "drizzle-orm";

// ===== PUBLIC ROUTER =====
export const cardShowsPublicRouter = router({
  /** Get all shows with optional filtering */
  list: publicProcedure
    .input(
      z.object({
        state: z.string().default(""),
        month: z.number().default(0),
        status: z.enum(["upcoming", "past", "cancelled", "all"]).default("all"),
        search: z.string().default(""),
        limit: z.number().min(1).max(500).default(500),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const { state, month, status, search, limit, offset } = input;
      const conditions: any[] = [];

      if (state) {
        conditions.push(eq(cardShows.state, state));
      }
      if (month) {
        conditions.push(eq(cardShows.month, month));
      }
      if (status && status !== "all") {
        conditions.push(eq(cardShows.status, status));
      }
      if (search) {
        const searchTerm = `%${search}%`;
        conditions.push(
          or(
            like(cardShows.name, searchTerm),
            like(cardShows.city, searchTerm),
            like(cardShows.stateName, searchTerm),
            like(cardShows.venue, searchTerm)
          )
        );
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const shows = await db
        .select()
        .from(cardShows)
        .where(where)
        .orderBy(asc(cardShows.startDate))
        .limit(limit)
        .offset(offset);

      return shows;
    }),

  /** Get stats for the directory */
  stats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const [totalResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(cardShows);
    
    const [upcomingResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(cardShows)
      .where(eq(cardShows.status, "upcoming"));

    const [pastResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(cardShows)
      .where(eq(cardShows.status, "past"));

    const [freeResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(cardShows)
      .where(eq(cardShows.isFree, true));

    const statesResult = await db
      .select({ state: cardShows.state })
      .from(cardShows)
      .groupBy(cardShows.state);

    return {
      totalShows: totalResult.count,
      upcomingShows: upcomingResult.count,
      pastShows: pastResult.count,
      freeAdmission: freeResult.count,
      totalStates: statesResult.length,
    };
  }),

  /** Get a single show by slug */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [show] = await db
        .select()
        .from(cardShows)
        .where(eq(cardShows.slug, input.slug))
        .limit(1);
      
      if (!show) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Show not found" });
      }
      return show;
    }),
});

// ===== ADMIN ROUTER =====
export const cardShowsAdminRouter = router({
  /** List all shows for admin (includes all statuses) */
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(["upcoming", "past", "cancelled", "all"]).default("all"),
        search: z.string().default(""),
        limit: z.number().min(1).max(500).default(100),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { status, search, limit, offset } = input;
      const conditions: any[] = [];

      if (status && status !== "all") {
        conditions.push(eq(cardShows.status, status));
      }
      if (search) {
        const searchTerm = `%${search}%`;
        conditions.push(
          or(
            like(cardShows.name, searchTerm),
            like(cardShows.city, searchTerm),
            like(cardShows.stateName, searchTerm)
          )
        );
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const shows = await db
        .select()
        .from(cardShows)
        .where(where)
        .orderBy(desc(cardShows.startDate))
        .limit(limit)
        .offset(offset);

      return shows;
    }),

  /** Add a new show */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        dateDisplay: z.string().min(1),
        startDate: z.string().min(1),
        endDate: z.string().min(1),
        month: z.number().min(1).max(12),
        venue: z.string().optional(),
        address: z.string().optional(),
        city: z.string().min(1),
        state: z.string().min(1).max(5),
        stateName: z.string().min(1),
        hours: z.string().optional(),
        tableCount: z.number().optional(),
        admission: z.string().optional(),
        isFree: z.boolean().optional().default(false),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        featured: z.boolean().optional().default(false),
        source: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Generate SEO-friendly slug with city and state
      const slug = `${input.city}-${input.state}-${input.name}`
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 490);

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [result] = await db.insert(cardShows).values({
        ...input,
        slug,
        venue: input.venue || null,
        address: input.address || null,
        hours: input.hours || null,
        tableCount: input.tableCount || null,
        admission: input.admission || null,
        email: input.email || null,
        phone: input.phone || null,
        website: input.website || null,
        source: input.source || null,
      });

      return { id: result.insertId, slug };
    }),

  /** Update a show */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        dateDisplay: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        month: z.number().optional(),
        venue: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        stateName: z.string().optional(),
        hours: z.string().optional(),
        tableCount: z.number().optional(),
        admission: z.string().optional(),
        isFree: z.boolean().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        featured: z.boolean().optional(),
        status: z.enum(["upcoming", "past", "cancelled"]).optional(),
        source: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { id, ...updates } = input;
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db.update(cardShows).set(updates).where(eq(cardShows.id, id));
      return { success: true };
    }),

  /** Delete a show */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db.delete(cardShows).where(eq(cardShows.id, input.id));
      return { success: true };
    }),

  /** Bulk mark past shows (run after each weekly update) */
  markPastShows: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const today = new Date().toISOString().split("T")[0];
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const result = await db
        .update(cardShows)
        .set({ status: "past" })
        .where(and(
          eq(cardShows.status, "upcoming"),
          lte(cardShows.endDate, today)
        ));
      return { success: true };
    }),
});
