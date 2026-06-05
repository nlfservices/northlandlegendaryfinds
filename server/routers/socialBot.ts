/**
 * Social Bot tRPC Router — Admin control for the Facebook comment bot.
 *
 * Procedures:
 *   getSettings         — Get current bot settings
 *   updateSettings      — Update bot settings (enable/disable, mode, prompt)
 *   indexContent        — Manually trigger content re-index
 *   getReplyLog         — Get paginated reply log
 *   approveReply        — Approve and send a queued reply (review mode)
 *   rejectReply         — Reject a queued reply
 *   getContentIndex     — Get list of indexed articles
 *   deleteLogEntry      — Delete a log entry
 */

import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  botSettings,
  botReplyLog,
  siteContentIndex,
  fbMonitoredPosts,
} from "../../drizzle/schema";
import { indexAllArticles } from "../bot-content-indexer";
import { replyToComment } from "../facebook-api";

export const socialBotRouter = router({
  /**
   * Get current bot settings.
   */
  getSettings: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

    const rows = await db.select().from(botSettings).limit(1);

    if (rows.length === 0) {
      // Return defaults if not yet configured
      return {
        id: null,
        enabled: false,
        replyMode: "review" as const,
        replyDelayMs: 30000,
        personalityPrompt: null,
        maxReplyLength: 280,
        replyWindowDays: 7,
        lastIndexedAt: null,
        indexerTaskUid: null,
      };
    }

    return rows[0];
  }),

  /**
   * Update bot settings.
   */
  updateSettings: adminProcedure
    .input(
      z.object({
        enabled: z.boolean().optional(),
        replyMode: z.enum(["auto", "review"]).optional(),
        replyDelayMs: z.number().min(0).max(300000).optional(),
        personalityPrompt: z.string().max(2000).nullable().optional(),
        maxReplyLength: z.number().min(50).max(1000).optional(),
        replyWindowDays: z.number().min(1).max(30).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const existing = await db.select().from(botSettings).limit(1);

      if (existing.length === 0) {
        // Create settings row
        await db.insert(botSettings).values({
          enabled: input.enabled ?? false,
          replyMode: input.replyMode ?? "review",
          replyDelayMs: input.replyDelayMs ?? 30000,
          personalityPrompt: input.personalityPrompt ?? null,
          maxReplyLength: input.maxReplyLength ?? 280,
          replyWindowDays: input.replyWindowDays ?? 7,
        });
      } else {
        // Update existing row
        const updateData: Record<string, any> = {};
        if (input.enabled !== undefined) updateData.enabled = input.enabled;
        if (input.replyMode !== undefined) updateData.replyMode = input.replyMode;
        if (input.replyDelayMs !== undefined) updateData.replyDelayMs = input.replyDelayMs;
        if (input.personalityPrompt !== undefined) updateData.personalityPrompt = input.personalityPrompt;
        if (input.maxReplyLength !== undefined) updateData.maxReplyLength = input.maxReplyLength;
        if (input.replyWindowDays !== undefined) updateData.replyWindowDays = input.replyWindowDays;

        await db
          .update(botSettings)
          .set(updateData)
          .where(eq(botSettings.id, existing[0].id));
      }

      return { success: true };
    }),

  /**
   * Manually trigger a content re-index.
   * Syncs all published articles into the knowledge base.
   */
  indexContent: adminProcedure.mutation(async () => {
    const result = await indexAllArticles();
    return result;
  }),

  /**
   * Get paginated reply log.
   */
  getReplyLog: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        filter: z.enum(["all", "sent", "queued", "skipped"]).default("all"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      let query = db
        .select()
        .from(botReplyLog)
        .orderBy(desc(botReplyLog.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const rows = await query;

      // Apply filter in JS (simpler than dynamic where clauses)
      const filtered = rows.filter(row => {
        if (input.filter === "sent") return row.sent === true;
        if (input.filter === "queued") return row.sent === false && row.botReply !== null && !row.skipReason;
        if (input.filter === "skipped") return row.skipReason !== null;
        return true;
      });

      return filtered;
    }),

  /**
   * Approve and send a queued reply.
   * Used in 'review' mode to manually approve bot-generated replies.
   */
  approveReply: adminProcedure
    .input(z.object({ logId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const rows = await db
        .select()
        .from(botReplyLog)
        .where(eq(botReplyLog.id, input.logId))
        .limit(1);

      if (rows.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Log entry not found" });
      }

      const logEntry = rows[0];

      if (logEntry.sent) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Reply already sent" });
      }

      if (!logEntry.botReply) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No reply to send" });
      }

      // Post the reply to Facebook
      const fbResult = await replyToComment(logEntry.fbCommentId, logEntry.botReply);

      if (!fbResult.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Facebook API error: ${fbResult.error}`,
        });
      }

      // Update log entry
      await db
        .update(botReplyLog)
        .set({
          sent: true,
          replyCommentId: fbResult.replyId,
          repliedAt: new Date(),
          skipReason: null,
        })
        .where(eq(botReplyLog.id, input.logId));

      return { success: true, replyId: fbResult.replyId };
    }),

  /**
   * Reject a queued reply (mark as skipped).
   */
  rejectReply: adminProcedure
    .input(
      z.object({
        logId: z.number(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      await db
        .update(botReplyLog)
        .set({
          skipReason: input.reason || "Rejected by admin",
          botReply: null,
        })
        .where(eq(botReplyLog.id, input.logId));

      return { success: true };
    }),

  /**
   * Get the content index (list of indexed articles).
   */
  getContentIndex: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const rows = await db
        .select({
          id: siteContentIndex.id,
          articleSlug: siteContentIndex.articleSlug,
          title: siteContentIndex.title,
          summary: siteContentIndex.summary,
          category: siteContentIndex.category,
          tags: siteContentIndex.tags,
          indexedAt: siteContentIndex.indexedAt,
          publishedAt: siteContentIndex.publishedAt,
        })
        .from(siteContentIndex)
        .orderBy(desc(siteContentIndex.indexedAt))
        .limit(input.limit)
        .offset(input.offset);

      return rows;
    }),

  /**
   * Delete a log entry.
   */
  deleteLogEntry: adminProcedure
    .input(z.object({ logId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      await db.delete(botReplyLog).where(eq(botReplyLog.id, input.logId));
      return { success: true };
    }),

  /**
   * Get all monitored Facebook posts.
   * These are auto-registered whenever a post is published from the admin.
   */
  getMonitoredPosts: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const rows = await db
        .select()
        .from(fbMonitoredPosts)
        .orderBy(desc(fbMonitoredPosts.publishedAt))
        .limit(input.limit);

      return rows;
    }),

  /**
   * Toggle monitoring on/off for a specific post.
   */
  togglePostMonitoring: adminProcedure
    .input(z.object({ postId: z.number(), active: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      await db
        .update(fbMonitoredPosts)
        .set({ active: input.active })
        .where(eq(fbMonitoredPosts.id, input.postId));

      return { success: true };
    }),

  /**
   * Manually trigger a comment poll right now.
   * Useful for testing or when you want immediate results.
   */
  pollNow: adminProcedure.mutation(async () => {
    const { pollAllMonitoredPosts } = await import("../bot-post-monitor");
    const result = await pollAllMonitoredPosts();
    return result;
  }),
});
