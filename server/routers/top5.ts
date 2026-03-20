import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getActiveTop5Items, getAllTop5Items, getTop5ItemById,
  createTop5Item, updateTop5Item, deleteTop5Item,
} from "../db";
import { storagePut } from "../storage";
import { processCardImage, removeGreenScreen, compositeOntoFrame, FRAME_URLS } from "../lib/greenscreen";

const sourceSchema = z.object({ title: z.string(), url: z.string() });

const top5Input = z.object({
  rank: z.number().min(1).max(10),
  title: z.string().min(1),
  character: z.string().min(1),
  tagline: z.string().min(1),
  backstory: z.string().min(1),
  cardImage: z.string().min(1),
  frontImage: z.string().nullable().optional(),
  backImage: z.string().nullable().optional(),
  frameTemplate: z.string().default("marvel_mint_gold"),
  cardLabel: z.string().min(1),
  cardLink: z.string().min(1),
  sources: z.array(sourceSchema),
  heatLevel: z.enum(["blazing", "hot", "rising"]).default("rising"),
  category: z.string().default("Movie"),
  isActive: z.boolean().default(true),
});

// ==================== ADMIN TOP 5 ROUTES ====================

export const top5AdminRouter = router({
  list: adminProcedure.query(async () => {
    return getAllTop5Items();
  }),

  getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getTop5ItemById(input.id);
  }),

  create: adminProcedure.input(top5Input).mutation(async ({ input }) => {
    const id = await createTop5Item({
      ...input,
      frontImage: input.frontImage ?? null,
      backImage: input.backImage ?? null,
      sources: input.sources,
    });
    return { success: true, id };
  }),

  update: adminProcedure.input(z.object({
    id: z.number(),
    data: top5Input.partial(),
  })).mutation(async ({ input }) => {
    await updateTop5Item(input.id, input.data as any);
    return { success: true };
  }),

  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await deleteTop5Item(input.id);
    return { success: true };
  }),

  /** Upload a card image (front or back) to S3 */
  uploadCardImage: adminProcedure.input(z.object({
    fileName: z.string(),
    fileData: z.string(), // base64 encoded
    contentType: z.string().default("image/png"),
    side: z.enum(["front", "back"]),
  })).mutation(async ({ input }) => {
    const buffer = Buffer.from(input.fileData, "base64");
    const suffix = Math.random().toString(36).substring(2, 10);
    const fileKey = `top5-cards/${input.side}-${suffix}-${input.fileName}`;
    const { url } = await storagePut(fileKey, buffer, input.contentType);
    return { url };
  }),

  /** Upload card image with green screen removal and frame compositing */
  processAndUpload: adminProcedure.input(z.object({
    fileName: z.string(),
    fileData: z.string(), // base64 encoded
    contentType: z.string().default("image/png"),
    side: z.enum(["front", "back"]),
    frameTemplate: z.string().default("marvel_mint_gold"),
    removeGreen: z.boolean().default(true),
  })).mutation(async ({ input }) => {
    const rawBuffer = Buffer.from(input.fileData, "base64");
    const suffix = Math.random().toString(36).substring(2, 10);

    let transparentUrl: string | null = null;
    let compositedUrl: string | null = null;
    let rawUrl: string;

    // Always upload the raw image
    const rawKey = `top5-cards/${input.side}-raw-${suffix}-${input.fileName}`;
    const rawResult = await storagePut(rawKey, rawBuffer, input.contentType);
    rawUrl = rawResult.url;

    if (input.removeGreen) {
      try {
        const { transparent, composited } = await processCardImage(rawBuffer, input.frameTemplate);

        // Upload transparent version
        const transKey = `top5-cards/${input.side}-transparent-${suffix}.png`;
        const transResult = await storagePut(transKey, transparent, "image/png");
        transparentUrl = transResult.url;

        // Upload composited version
        const compKey = `top5-cards/${input.side}-composited-${suffix}.png`;
        const compResult = await storagePut(compKey, composited, "image/png");
        compositedUrl = compResult.url;
      } catch (err: any) {
        console.error("Green screen processing failed:", err.message);
        // Fall back to raw image if processing fails
      }
    }

    return {
      rawUrl,
      transparentUrl,
      compositedUrl,
      // The final URL to use: composited > transparent > raw
      url: compositedUrl || transparentUrl || rawUrl,
    };
  }),

  /** Re-composite an existing transparent card image onto a different frame */
  recomposite: adminProcedure.input(z.object({
    imageUrl: z.string(), // URL of the transparent card image
    frameTemplate: z.string(),
  })).mutation(async ({ input }) => {
    // Download the transparent image
    const response = await fetch(input.imageUrl);
    if (!response.ok) throw new Error("Failed to download card image");
    const cardBuffer = Buffer.from(await response.arrayBuffer());

    // Composite onto new frame
    const composited = await compositeOntoFrame(cardBuffer, input.frameTemplate);

    const suffix = Math.random().toString(36).substring(2, 10);
    const compKey = `top5-cards/recomposited-${suffix}.png`;
    const { url } = await storagePut(compKey, composited, "image/png");
    return { url };
  }),
});

// ==================== PUBLIC TOP 5 ROUTES ====================

export const top5PublicRouter = router({
  list: publicProcedure.query(async () => {
    return getActiveTop5Items();
  }),
});
