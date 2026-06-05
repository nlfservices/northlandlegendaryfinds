/**
 * Article Polls Router
 * Handles community polls embedded in articles.
 * One vote per visitor per poll (tracked by visitorId cookie).
 */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { articlePolls, articlePollVotes } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

export const pollsRouter = router({
  /** Get the active poll for an article slug, with vote counts */
  getByArticle: publicProcedure
    .input(z.object({ articleSlug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [poll] = await db
        .select()
        .from(articlePolls)
        .where(and(eq(articlePolls.articleSlug, input.articleSlug), eq(articlePolls.isActive, true)))
        .limit(1);

      if (!poll) return null;

      // Get vote counts per option
      const voteCounts = await db
        .select({
          optionIndex: articlePollVotes.optionIndex,
          count: sql<number>`count(*)`.as("count"),
        })
        .from(articlePollVotes)
        .where(eq(articlePollVotes.pollId, poll.id))
        .groupBy(articlePollVotes.optionIndex);

      const totalVotes = voteCounts.reduce((sum, r) => sum + Number(r.count), 0);
      const counts: number[] = poll.options.map((_, i) => {
        const found = voteCounts.find((v) => v.optionIndex === i);
        return found ? Number(found.count) : 0;
      });

      return { ...poll, counts, totalVotes };
    }),

  /** Cast a vote — one per visitorId per poll */
  vote: publicProcedure
    .input(
      z.object({
        pollId: z.number(),
        optionIndex: z.number(),
        visitorId: z.string().min(1).max(128),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, alreadyVoted: false, counts: [], totalVotes: 0 };

      // Check if already voted
      const [existing] = await db
        .select({ id: articlePollVotes.id })
        .from(articlePollVotes)
        .where(
          and(
            eq(articlePollVotes.pollId, input.pollId),
            eq(articlePollVotes.visitorId, input.visitorId)
          )
        )
        .limit(1);

      if (existing) {
        return { success: false, alreadyVoted: true, counts: [], totalVotes: 0 };
      }

      await db.insert(articlePollVotes).values({
        pollId: input.pollId,
        optionIndex: input.optionIndex,
        visitorId: input.visitorId,
      });

      // Return updated counts
      const [poll] = await db
        .select()
        .from(articlePolls)
        .where(eq(articlePolls.id, input.pollId))
        .limit(1);

      const voteCounts = await db
        .select({
          optionIndex: articlePollVotes.optionIndex,
          count: sql<number>`count(*)`.as("count"),
        })
        .from(articlePollVotes)
        .where(eq(articlePollVotes.pollId, input.pollId))
        .groupBy(articlePollVotes.optionIndex);

      const totalVotes = voteCounts.reduce((sum, r) => sum + Number(r.count), 0);
      const counts: number[] = poll.options.map((_, i) => {
        const found = voteCounts.find((v) => v.optionIndex === i);
        return found ? Number(found.count) : 0;
      });

      return { success: true, alreadyVoted: false, counts, totalVotes };
    }),

  /** Check if a visitor has already voted on a poll */
  hasVoted: publicProcedure
    .input(z.object({ pollId: z.number(), visitorId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { voted: false, optionIndex: null };

      const [existing] = await db
        .select({ optionIndex: articlePollVotes.optionIndex })
        .from(articlePollVotes)
        .where(
          and(
            eq(articlePollVotes.pollId, input.pollId),
            eq(articlePollVotes.visitorId, input.visitorId)
          )
        )
        .limit(1);
      return { voted: !!existing, optionIndex: existing?.optionIndex ?? null };
    }),
});
