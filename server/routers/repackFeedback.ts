/**
 * Repack Feedback Router — "Build Your Repack" survey submissions
 * Public endpoint for submitting feedback, admin endpoint for viewing results
 */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { repackFeedback } from "../../drizzle/schema";
import { desc, sql } from "drizzle-orm";

export const repackFeedbackRouter = router({
  /** Submit repack feedback (public, no auth required) */
  submit: publicProcedure
    .input(
      z.object({
        format: z.enum(["single_slab", "slab_and_packs", "mystery_tier", "other"]),
        priceRange: z.enum(["under_25", "25_50", "50_100", "100_plus"]),
        characters: z.array(z.string()).optional(),
        sets: z.array(z.string()).optional(),
        gradedPreference: z.enum(["graded", "raw", "both", "no_preference"]).optional(),
        suggestion: z.string().max(1000).optional(),
        email: z.string().email().optional().or(z.literal("")),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      // Simple fingerprint from IP to prevent spam
      const ip = ctx.req?.headers?.["x-forwarded-for"] || ctx.req?.socket?.remoteAddress || "unknown";
      const fingerprint = typeof ip === "string" ? ip.slice(0, 64) : "unknown";

      await db.insert(repackFeedback).values({
        format: input.format,
        priceRange: input.priceRange,
        characters: input.characters ? JSON.stringify(input.characters) : null,
        sets: input.sets ? JSON.stringify(input.sets) : null,
        gradedPreference: input.gradedPreference || null,
        suggestion: input.suggestion || null,
        email: input.email || null,
        fingerprint,
      });

      return { success: true };
    }),

  /** Get aggregated results (admin only) */
  results: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get total count
    const [countRow] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(repackFeedback);
    const total = countRow?.count || 0;

    // Get format breakdown
    const formatBreakdown = await db
      .select({
        format: repackFeedback.format,
        count: sql<number>`COUNT(*)`,
      })
      .from(repackFeedback)
      .groupBy(repackFeedback.format);

    // Get price range breakdown
    const priceBreakdown = await db
      .select({
        priceRange: repackFeedback.priceRange,
        count: sql<number>`COUNT(*)`,
      })
      .from(repackFeedback)
      .groupBy(repackFeedback.priceRange);

    // Get graded preference breakdown
    const gradedBreakdown = await db
      .select({
        gradedPreference: repackFeedback.gradedPreference,
        count: sql<number>`COUNT(*)`,
      })
      .from(repackFeedback)
      .groupBy(repackFeedback.gradedPreference);

    // Get recent submissions
    const recent = await db
      .select()
      .from(repackFeedback)
      .orderBy(desc(repackFeedback.createdAt))
      .limit(50);

    // Get emails for launch notification
    const emails = await db
      .select({ email: repackFeedback.email })
      .from(repackFeedback)
      .where(sql`${repackFeedback.email} IS NOT NULL AND ${repackFeedback.email} != ''`);

    return {
      total,
      formatBreakdown,
      priceBreakdown,
      gradedBreakdown,
      recent,
      emails: emails.map((e) => e.email).filter(Boolean),
    };
  }),
});
