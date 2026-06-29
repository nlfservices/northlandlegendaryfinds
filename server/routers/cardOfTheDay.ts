/**
 * Card of the Day — tRPC Router
 * Public: getTodaysCard, getCardForDate
 * Admin: upsertCard, listCards
 */

import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { cardOfTheDayEntries } from "../../drizzle/schema";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getRotationForDate, getTodayRotation, SET_LABELS, PLATINUM_CHARACTERS } from "../cardOfTheDayRotation";

// ── Admin guard ──────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = (ctx.user as any).role;
  if (!["owner", "super_admin", "admin"].includes(role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ── Helpers ──────────────────────────────────────────────────────────────────
async function getEntryForDate(dateISO: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(cardOfTheDayEntries)
    .where(eq(cardOfTheDayEntries.date, dateISO))
    .limit(1);
  return rows[0] ?? null;
}

function parseCharacterFacts(raw: string | null | undefined) {
  if (!raw) return undefined;
  try { return JSON.parse(raw); } catch { return undefined; }
}

/**
 * Merge rotation defaults with any admin overrides stored in DB.
 * DB values take precedence over rotation defaults.
 */
function mergeWithRotation(dateISO: string, dbEntry: typeof cardOfTheDayEntries.$inferSelect | null) {
  const rotation = getRotationForDate(dateISO);
  const char = rotation.character;

  return {
    dateISO: rotation.dateISO,
    dateLabel: rotation.dateLabel,
    characterIndex: rotation.characterIndex,
    // Character info — DB overrides rotation defaults
    characterName: dbEntry?.characterName ?? char.characterName,
    characterRealName: dbEntry?.characterRealName ?? char.characterRealName,
    characterTagline: dbEntry?.characterTagline ?? char.characterTagline,
    characterBio: dbEntry?.characterBio ?? char.characterBio,
    characterFacts: dbEntry?.characterFacts
      ? parseCharacterFacts(dbEntry.characterFacts)
      : char.characterFacts,
    characterImageUrl: dbEntry?.characterImageUrl ?? null,
    // Card info
    cardNumber: dbEntry?.cardNumber ?? rotation.cardNumber,
    setName: dbEntry?.setName ?? rotation.setKey,
    setLabel: dbEntry?.setLabel ?? rotation.setLabel,
    frontImageUrl: dbEntry?.frontImageUrl ?? null,
    backImageUrl: dbEntry?.backImageUrl ?? null,
    youtubeId: dbEntry?.youtubeId ?? null,
    estimatedPrice: dbEntry?.estimatedPrice ?? null,
    buzzNote: dbEntry?.buzzNote ?? char.buzzNote,
    isActive: dbEntry?.isActive ?? true,
    // Parallel / grading info
    parallelType: dbEntry?.parallelType ?? null,
    printRun: dbEntry?.printRun ?? null,
    serialNumber: dbEntry?.serialNumber ?? null,
    cgcGrade: dbEntry?.cgcGrade ?? null,
    gradingCompany: dbEntry?.gradingCompany ?? null,
    // DB metadata
    dbId: dbEntry?.id ?? null,
    hasDbEntry: dbEntry !== null,
  };
}

// ── Router ───────────────────────────────────────────────────────────────────
export const cardOfTheDayRouter = router({
  /**
   * Get today's card (public).
   * Returns rotation defaults merged with any admin overrides.
   */
  getTodaysCard: publicProcedure.query(async () => {
    const rotation = getTodayRotation();
    const dbEntry = await getEntryForDate(rotation.dateISO);
    return mergeWithRotation(rotation.dateISO, dbEntry ?? null);
  }),

  /**
   * Get card for a specific date (public).
   */
  getCardForDate: publicProcedure
    .input(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }))
    .query(async ({ input }) => {
      const dbEntry = await getEntryForDate(input.date);
      return mergeWithRotation(input.date, dbEntry ?? null);
    }),

  /**
   * Get the full rotation schedule for the next N days (admin).
   */
  getRotationSchedule: adminProcedure
    .input(z.object({ days: z.number().min(1).max(60).default(30) }))
    .query(async ({ input }) => {
      const today = getTodayRotation();
      const schedule = [];
      const todayDate = new Date(today.dateISO + "T00:00:00Z");

      for (let i = 0; i < input.days; i++) {
        const d = new Date(todayDate);
        d.setUTCDate(d.getUTCDate() + i);
        const dateISO = d.toISOString().slice(0, 10);
        const dbEntry = await getEntryForDate(dateISO);
        schedule.push({
          ...mergeWithRotation(dateISO, dbEntry ?? null),
          isToday: i === 0,
        });
      }
      return schedule;
    }),

  /**
   * Upsert a card entry for a specific date (admin).
   * Creates or updates the DB override for that date.
   */
  upsertCard: adminProcedure
    .input(
      z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        characterName: z.string().min(1).max(128).optional(),
        characterRealName: z.string().max(128).optional().nullable(),
        characterTagline: z.string().max(255).optional().nullable(),
        characterBio: z.string().optional().nullable(),
        characterFacts: z.string().optional().nullable(), // JSON string
        characterImageUrl: z.string().url().optional().nullable(),
        cardNumber: z.string().max(20).optional().nullable(),
        setName: z.enum(["mint", "comic_book_heroes", "marvel_studios"]).optional(),
        setLabel: z.string().max(128).optional().nullable(),
        parallelType: z.string().max(128).optional().nullable(),
        printRun: z.number().int().positive().optional().nullable(),
        serialNumber: z.number().int().positive().optional().nullable(),
        cgcGrade: z.string().max(16).optional().nullable(),
        gradingCompany: z.string().max(32).optional().nullable(),
        frontImageUrl: z.string().optional().nullable(),
        backImageUrl: z.string().optional().nullable(),
        youtubeId: z.string().max(32).optional().nullable(),
        estimatedPrice: z.string().max(64).optional().nullable(),
        buzzNote: z.string().optional().nullable(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { date, ...fields } = input;
      const existing = await getEntryForDate(date);

      // Get rotation defaults for this date to fill required fields
      const rotation = getRotationForDate(date);

      if (existing) {
        const db2 = await getDb();
      if (!db2) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db2
          .update(cardOfTheDayEntries)
          .set({ ...fields, updatedAt: new Date() })
          .where(eq(cardOfTheDayEntries.date, date));
      } else {
        const db2 = await getDb();
        if (!db2) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
        await db2.insert(cardOfTheDayEntries).values({
          date,
          characterName: fields.characterName ?? rotation.character.characterName,
          characterRealName: fields.characterRealName ?? rotation.character.characterRealName,
          characterTagline: fields.characterTagline ?? rotation.character.characterTagline,
          characterBio: fields.characterBio ?? rotation.character.characterBio,
          characterFacts: fields.characterFacts ?? JSON.stringify(rotation.character.characterFacts),
          characterImageUrl: fields.characterImageUrl ?? null,
          cardNumber: fields.cardNumber ?? rotation.cardNumber,
          setName: fields.setName ?? rotation.setKey,
          setLabel: fields.setLabel ?? rotation.setLabel,
          parallelType: fields.parallelType ?? null,
          printRun: fields.printRun ?? null,
          serialNumber: fields.serialNumber ?? null,
          cgcGrade: fields.cgcGrade ?? null,
          gradingCompany: fields.gradingCompany ?? null,
          frontImageUrl: fields.frontImageUrl ?? null,
          backImageUrl: fields.backImageUrl ?? null,
          youtubeId: fields.youtubeId ?? null,
          estimatedPrice: fields.estimatedPrice ?? null,
          buzzNote: fields.buzzNote ?? rotation.character.buzzNote,
          isActive: fields.isActive ?? true,
        });
      }

      const updated = await getEntryForDate(date);
      return mergeWithRotation(date, updated);
    }),

  /**
   * Get all stored DB entries (admin).
   */
  listCards: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const entries = await db
      .select()
      .from(cardOfTheDayEntries)
      .orderBy(cardOfTheDayEntries.date);
    return entries;
  }),

  /**
   * Get the full character roster (public — for the admin schedule display).
   */
  getCharacterRoster: publicProcedure.query(() => {
    return PLATINUM_CHARACTERS.map((c) => ({
      cardNumber: c.cardNumber,
      characterName: c.characterName,
      characterRealName: c.characterRealName,
    }));
  }),

  /**
   * Get set labels (public).
   */
  getSetLabels: publicProcedure.query(() => SET_LABELS),

  /**
   * Update front/back image for all DB entries matching a card number (admin).
   * Used to bulk-assign images to a character across all their rotation days.
   */
  updateImageByCardNumber: adminProcedure
    .input(
      z.object({
        cardNumber: z.string().min(1).max(20),
        frontImageUrl: z.string().optional().nullable(),
        backImageUrl: z.string().optional().nullable(),
        estimatedPrice: z.string().max(64).optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const result = await db
        .update(cardOfTheDayEntries)
        .set({
          frontImageUrl: input.frontImageUrl,
          backImageUrl: input.backImageUrl,
          estimatedPrice: input.estimatedPrice,
          updatedAt: new Date(),
        })
        .where(eq(cardOfTheDayEntries.cardNumber, input.cardNumber));
      return { affectedRows: (result[0] as any)?.affectedRows ?? 0 };
    }),

  /**
   * Delete a card entry by ID (admin).
   */
  deleteCard: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.delete(cardOfTheDayEntries).where(eq(cardOfTheDayEntries.id, input.id));
      return { success: true };
    }),
});
