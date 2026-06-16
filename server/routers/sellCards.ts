/**
 * Sell Cards Router
 * Handles submissions from collectors who want to sell their
 * Topps Marvel numbered / numbered autograph cards to NLF.
 *
 * Flow:
 *  1. Client uploads card photos as base64 strings
 *  2. Server stores each image in S3 via storagePut
 *  3. Server saves submission to DB
 *  4. Server notifies owner via notifyOwner()
 */

import { z } from "zod";
import { publicProcedure, router, adminProcedure } from "../_core/trpc";
import { createSellSubmission, getSellSubmissions, updateSellSubmissionStatus } from "../db";
import { storagePut } from "../storage";
import { notifyOwner } from "../_core/notification";
import { createGHLContact, searchGHLContact, addGHLContactNote, addGHLContactTags } from "../ghl";

// ─── Helpers ────────────────────────────────────────────────────────────────

function randomSuffix() {
  return Math.random().toString(36).substring(2, 10);
}

// ─── Router ─────────────────────────────────────────────────────────────────

export const sellCardsRouter = router({
  /**
   * Submit a card-selling inquiry.
   * Accepts up to 8 card photos as base64 strings, uploads them to S3,
   * saves the submission to the DB, and pings the owner.
   */
  submit: publicProcedure
    .input(
      z.object({
        // Contact info
        name: z.string().min(2).max(128),
        email: z.string().email(),
        phone: z.string().min(7).max(32),
        // Card details
        cardName: z.string().min(1).max(255),
        cardNumber: z.string().min(1).max(32),   // e.g. "/25", "1/1"
        cardYear: z.string().max(8).optional(),
        setName: z.string().max(255).optional(),
        condition: z.string().max(64).optional(), // Raw / PSA 10 / CGC 9 / etc.
        isAutograph: z.boolean().default(false),
        askingPrice: z.string().max(64).optional(),
        notes: z.string().max(1000).optional(),
        // Photos: array of { data: base64, contentType: "image/jpeg"|"image/png"|"image/webp" }
        photos: z
          .array(
            z.object({
              data: z.string(),          // base64-encoded bytes
              contentType: z.string(),   // mime type
            })
          )
          .max(8)
          .default([]),
      })
    )
    .mutation(async ({ input }) => {
      // 1. Upload each photo to S3
      const imageUrls: string[] = [];
      for (const photo of input.photos) {
        try {
          const ext = photo.contentType.includes("png")
            ? "png"
            : photo.contentType.includes("webp")
            ? "webp"
            : "jpg";
          const key = `sell-submissions/${randomSuffix()}.${ext}`;
          const buffer = Buffer.from(photo.data, "base64");
          const { url } = await storagePut(key, buffer, photo.contentType);
          imageUrls.push(url);
        } catch (err) {
          console.error("[sellCards.submit] Image upload failed:", err);
          // Continue — don't block the submission if one image fails
        }
      }

      // 2. Save to DB
      await createSellSubmission({
        name: input.name,
        email: input.email,
        phone: input.phone,
        cardName: input.cardName,
        cardNumber: input.cardNumber,
        cardYear: input.cardYear,
        setName: input.setName,
        condition: input.condition,
        isAutograph: input.isAutograph,
        askingPrice: input.askingPrice,
        notes: input.notes,
        imageUrls,
      });

      // 3. Push to GoHighLevel CRM
      try {
        const nameParts = input.name.trim().split(/\s+/);
        const firstName = nameParts[0] ?? input.name;
        const lastName = nameParts.slice(1).join(" ") || undefined;

        // Search for existing contact first
        const existing = await searchGHLContact(input.email);
        let ghlContactId: string | undefined;

        if (existing.found && existing.contactId) {
          ghlContactId = existing.contactId;
          console.log(`[sellCards] GHL contact already exists: ${ghlContactId}`);
        } else {
          const ghlResult = await createGHLContact({
            email: input.email,
            firstName,
            lastName,
            name: input.name,
            phone: input.phone,
            tags: ["sell-inquiry", "topps-marvel"],
            source: "NLF Sell Cards Form",
          });
          if (ghlResult.success && ghlResult.contactId) {
            ghlContactId = ghlResult.contactId;
            console.log(`[sellCards] GHL contact created: ${ghlContactId}`);
          }
        }

        // Add a note with all card details
        if (ghlContactId) {
          const autographLine = input.isAutograph ? " ✍️ AUTOGRAPH" : "";
          const noteLines = [
            `💰 SELL INQUIRY — ${input.cardName} ${input.cardNumber}${autographLine}`,
            `Card: ${input.cardName} — ${input.cardNumber}${autographLine}`,
            input.cardYear ? `Year: ${input.cardYear}` : "",
            input.setName ? `Set: ${input.setName}` : "",
            input.condition ? `Condition/Grade: ${input.condition}` : "",
            input.askingPrice ? `Asking Price: ${input.askingPrice}` : "",
            input.notes ? `Notes: ${input.notes}` : "",
            imageUrls.length ? `Photos: ${imageUrls.length} uploaded` : "",
            `Phone: ${input.phone}`,
            `Submitted via: northlandlegendaryfinds.com/sell-cards`,
          ].filter(Boolean).join("\n");

          await addGHLContactNote(ghlContactId, noteLines);
          // Tag as sell-inquiry so it's easy to filter in GHL
          await addGHLContactTags(ghlContactId, ["sell-inquiry", "topps-marvel"]);
          console.log(`[sellCards] GHL note + tags added for contact: ${ghlContactId}`);
        }
      } catch (ghlErr) {
        // GHL errors should never block the submission
        console.error("[sellCards] GHL sync failed (non-blocking):", ghlErr);
      }

      // 4. Notify owner
      const photoLine = imageUrls.length
        ? `\n📸 ${imageUrls.length} photo(s) attached`
        : "";
      const autographLine = input.isAutograph ? " ✍️ AUTOGRAPH" : "";
      await notifyOwner({
        title: `💰 New Card Sell Inquiry — ${input.cardName} ${input.cardNumber}${autographLine}`,
        content: [
          `**From:** ${input.name}`,
          `**Email:** ${input.email}`,
          `**Phone:** ${input.phone}`,
          `**Card:** ${input.cardName} — ${input.cardNumber}${autographLine}`,
          input.cardYear ? `**Year:** ${input.cardYear}` : "",
          input.setName ? `**Set:** ${input.setName}` : "",
          input.condition ? `**Condition:** ${input.condition}` : "",
          input.askingPrice ? `**Asking:** ${input.askingPrice}` : "",
          input.notes ? `**Notes:** ${input.notes}` : "",
          photoLine,
        ]
          .filter(Boolean)
          .join("\n"),
      });

      return { success: true };
    }),

  /** Admin: list all sell submissions */
  list: adminProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const rows = await getSellSubmissions(input.limit, input.offset);
      return rows.map((r) => ({
        ...r,
        imageUrls: (() => {
          try {
            return JSON.parse(r.imageUrls || "[]") as string[];
          } catch {
            return [] as string[];
          }
        })(),
      }));
    }),

  /** Admin: update submission status */
  updateStatus: adminProcedure
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input }) => {
      await updateSellSubmissionStatus(input.id, input.status);
      return { success: true };
    }),
});
