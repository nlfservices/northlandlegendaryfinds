/**
 * Card Image Processor
 * 
 * Automatically detects trading cards in photos, crops to just the card,
 * and places them on a clean dark background matching the NLF site theme.
 * 
 * Uses LLM vision to detect card boundaries, then sharp for image processing.
 */

import sharp from "sharp";
import { invokeLLM } from "./_core/llm";

interface CardBounds {
  topLeftX: number;
  topLeftY: number;
  topRightX: number;
  topRightY: number;
  bottomRightX: number;
  bottomRightY: number;
  bottomLeftX: number;
  bottomLeftY: number;
}

interface ProcessResult {
  processedBuffer: Buffer;
  contentType: string;
}

/**
 * Use LLM vision to detect the card/one-touch holder boundaries in the image.
 * Returns normalized coordinates (0-1 range) of the card corners.
 */
async function detectCardBounds(imageUrl: string): Promise<CardBounds> {
  const result = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a precise image analysis tool. You detect trading card boundaries in photos.
The photos typically show a trading card in a clear plastic one-touch holder or top-loader, 
sitting on a clear plastic stand/easel against a gray or dark background.

Your job: identify the bounding rectangle of the PRINTED CARD FACE only.
Return the coordinates as percentages (0-100) of the image dimensions.

CRITICAL RULES:
- Detect ONLY the printed card area (the artwork/text area of the trading card)
- Do NOT include the clear plastic holder/case edges
- Do NOT include the Topps tab at the top
- Do NOT include the clear plastic stand/easel at the bottom
- Do NOT include the gray/dark background
- For cards in one-touch holders: detect the inner card, not the outer holder
- For flat scans with dark borders: detect the card edges inside any border
- Be very precise with the edges of the actual printed card`,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: imageUrl, detail: "high" },
          },
          {
            type: "text",
            text: "Detect the trading card boundaries. Return ONLY the bounding box coordinates as percentages of image width/height (0-100).",
          },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "card_bounds",
        strict: true,
        schema: {
          type: "object",
          properties: {
            topLeftX: { type: "number", description: "Top-left X as percentage (0-100) of image width" },
            topLeftY: { type: "number", description: "Top-left Y as percentage (0-100) of image height" },
            topRightX: { type: "number", description: "Top-right X as percentage (0-100) of image width" },
            topRightY: { type: "number", description: "Top-right Y as percentage (0-100) of image height" },
            bottomRightX: { type: "number", description: "Bottom-right X as percentage (0-100) of image width" },
            bottomRightY: { type: "number", description: "Bottom-right Y as percentage (0-100) of image height" },
            bottomLeftX: { type: "number", description: "Bottom-left X as percentage (0-100) of image width" },
            bottomLeftY: { type: "number", description: "Bottom-left Y as percentage (0-100) of image height" },
          },
          required: ["topLeftX", "topLeftY", "topRightX", "topRightY", "bottomRightX", "bottomRightY", "bottomLeftX", "bottomLeftY"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = result.choices[0]?.message?.content;
  const text = typeof content === "string" ? content : "";
  const bounds = JSON.parse(text) as CardBounds;
  
  // Validate bounds are reasonable
  if (bounds.topLeftX < 0 || bounds.topLeftX > 100 ||
      bounds.topLeftY < 0 || bounds.topLeftY > 100) {
    throw new Error("Invalid card bounds detected");
  }
  
  return bounds;
}

/**
 * Process a card image: detect card, crop, and place on dark background.
 * 
 * @param imageBuffer - The raw image buffer (JPEG, PNG, etc.)
 * @param options - Processing options
 * @returns Processed image buffer
 */
export async function processCardImage(
  imageBuffer: Buffer,
  options: {
    /** Target output width */
    outputWidth?: number;
    /** Target output height */
    outputHeight?: number;
    /** Background color (hex) */
    backgroundColor?: string;
    /** Padding around the card (percentage of output size) */
    paddingPercent?: number;
    /** Image URL if already uploaded (avoids re-upload for detection) */
    imageUrl?: string;
  } = {}
): Promise<ProcessResult> {
  const {
    outputWidth = 800,
    outputHeight = 1100,
    backgroundColor = "#0a0f1a",
    paddingPercent = 4,
  } = options;

  // Get image metadata
  const metadata = await sharp(imageBuffer).metadata();
  const imgWidth = metadata.width!;
  const imgHeight = metadata.height!;

  let imageUrl = options.imageUrl;
  
  // If no URL provided, we need to upload temporarily for vision API
  if (!imageUrl) {
    const { storagePut } = await import("./storage");
    const tempKey = `temp/card-detect-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.jpg`;
    const result = await storagePut(tempKey, imageBuffer, "image/jpeg");
    imageUrl = result.url;
  }

  // Detect card bounds using LLM vision
  const bounds = await detectCardBounds(imageUrl);

  // Convert percentage bounds to pixel coordinates
  const left = Math.round(Math.min(bounds.topLeftX, bounds.bottomLeftX) / 100 * imgWidth);
  const top = Math.round(Math.min(bounds.topLeftY, bounds.topRightY) / 100 * imgHeight);
  const right = Math.round(Math.max(bounds.topRightX, bounds.bottomRightX) / 100 * imgWidth);
  const bottom = Math.round(Math.max(bounds.bottomLeftY, bounds.bottomRightY) / 100 * imgHeight);

  // Add margin (5%) to include a bit of the holder around the card face
  const marginX = Math.round((right - left) * 0.05);
  const marginY = Math.round((bottom - top) * 0.05);
  
  const cropLeft = Math.max(0, left - marginX);
  const cropTop = Math.max(0, top - marginY);
  const cropWidth = Math.min(imgWidth - cropLeft, (right - left) + marginX * 2);
  const cropHeight = Math.min(imgHeight - cropTop, (bottom - top) + marginY * 2);

  // Crop the card from the original image
  const croppedCard = await sharp(imageBuffer)
    .extract({
      left: cropLeft,
      top: cropTop,
      width: cropWidth,
      height: cropHeight,
    })
    .toBuffer();

  // Calculate the card size within the output canvas (with padding)
  const padding = Math.round(Math.min(outputWidth, outputHeight) * paddingPercent / 100);
  const availableWidth = outputWidth - padding * 2;
  const availableHeight = outputHeight - padding * 2;

  // Resize the cropped card to fit within the available space
  const resizedCard = await sharp(croppedCard)
    .resize(availableWidth, availableHeight, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .toBuffer();

  const resizedMeta = await sharp(resizedCard).metadata();
  const cardW = resizedMeta.width!;
  const cardH = resizedMeta.height!;

  // Parse background color
  const bgR = parseInt(backgroundColor.slice(1, 3), 16);
  const bgG = parseInt(backgroundColor.slice(3, 5), 16);
  const bgB = parseInt(backgroundColor.slice(5, 7), 16);

  // Create the output canvas with dark background and composite the card centered
  const processedBuffer = await sharp({
    create: {
      width: outputWidth,
      height: outputHeight,
      channels: 3,
      background: { r: bgR, g: bgG, b: bgB },
    },
  })
    .composite([
      {
        input: resizedCard,
        left: Math.round((outputWidth - cardW) / 2),
        top: Math.round((outputHeight - cardH) / 2),
      },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();

  return {
    processedBuffer,
    contentType: "image/jpeg",
  };
}

/**
 * Process a card image from a URL (fetches, processes, returns buffer).
 */
export async function processCardImageFromUrl(
  imageUrl: string,
  options?: Parameters<typeof processCardImage>[1]
): Promise<ProcessResult> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return processCardImage(buffer, { ...options, imageUrl });
}
