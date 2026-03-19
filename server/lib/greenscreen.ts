/**
 * Green Screen Removal & Cosmic Frame Compositing
 * 
 * Removes green/chroma-key backgrounds from card photos (including PSA slab edge reflections)
 * and composites the transparent card onto cosmic frame templates.
 * 
 * Algorithm: HSL-based green detection with 3-tier removal:
 * 1. Strong green → fully transparent
 * 2. Medium green (slab edge reflections) → partial transparency with green channel reduction
 * 3. Light green tint → subtle green channel correction
 * 
 * Edge feathering applied for clean compositing.
 */

import sharp from "sharp";

// ============================================================
// FRAME TEMPLATE URLS
// ============================================================
export const FRAME_URLS: Record<string, string> = {
  marvel_mint_gold: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_Marvel_Mint_Gold_f3bc7dc2.png",
  marvel_mint_silver: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_Marvel_Mint_Silver_57c1219f.png",
  marvel_mint_bronze: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_Marvel_Mint_Bronze_ca850e23.png",
  marvel_mint_platinum: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_Marvel_Mint_Platinum_126c3799.png",
  "1975_era_gold_amber": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_1975_Era_Gold_Amber_137f3e23.png",
  "1976_era_blue_silver": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_1976_Era_Blue_Silver_7e6de901.png",
  "2025_era_emerald_green": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_2025_Era_Emerald_Green_4b7926e9.png",
};

// ============================================================
// GREEN SCREEN REMOVAL
// ============================================================

/**
 * Remove green screen background from a card photo.
 * Returns a PNG buffer with transparent background.
 */
export async function removeGreenScreen(inputBuffer: Buffer): Promise<Buffer> {
  const image = sharp(inputBuffer);
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const pixels = Buffer.from(data);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Convert to HSL-like values for better green detection
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const lightness = (max + min) / 2;
    const saturation = delta === 0 ? 0 : delta / (255 - Math.abs(2 * lightness - 255));

    // Calculate hue (0-360)
    let hue = 0;
    if (delta > 0) {
      if (max === g) {
        hue = 60 * (((b - r) / delta) + 2);
      } else if (max === r) {
        hue = 60 * (((g - b) / delta) % 6);
      } else {
        hue = 60 * (((r - g) / delta) + 4);
      }
    }
    if (hue < 0) hue += 360;

    // Green hue range: roughly 60-180 degrees
    const isGreenHue = hue >= 60 && hue <= 180;

    // Strong green: clearly green screen background
    const isStrongGreen = isGreenHue && g > 70 && g > r * 1.2 && g > b * 1.2;

    // Medium green: slab edges with green reflection
    const isMediumGreen = isGreenHue && g > 50 && (g - r) > 15 && (g - b) > 15 && saturation > 0.15;

    // Light green tint: very subtle green cast on transparent plastic
    const isLightGreenTint = isGreenHue && g > 80 && (g - r) > 8 && (g - b) > 8 && lightness > 100 && saturation > 0.08;

    if (isStrongGreen) {
      pixels[i + 3] = 0; // Fully transparent
    } else if (isMediumGreen) {
      // Partial transparency based on how green it is
      const greenness = Math.min(1, ((g - Math.max(r, b)) / 80));
      pixels[i + 3] = Math.round(255 * (1 - greenness * 0.85));
      // Also reduce green channel to remove green cast
      pixels[i + 1] = Math.round(g - (g - Math.round((r + b) / 2)) * 0.3);
    } else if (isLightGreenTint) {
      // Very subtle - reduce green channel and slight transparency
      const greenExcess = g - Math.round((r + b) / 2);
      if (greenExcess > 10) {
        pixels[i + 1] = Math.round(g - greenExcess * 0.5);
        pixels[i + 3] = Math.round(255 * 0.92);
      }
    }
  }

  // Create image from processed pixels
  const processed = sharp(pixels, {
    raw: { width, height, channels: 4 }
  });

  // Trim transparent edges and crop card stand from bottom
  const trimmed = await processed
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 5 })
    .png()
    .toBuffer();

  // Crop bottom 5% to remove card stand
  const trimmedMeta = await sharp(trimmed).metadata();
  if (trimmedMeta.width && trimmedMeta.height) {
    const cropHeight = Math.round(trimmedMeta.height * 0.95);
    return sharp(trimmed)
      .extract({ left: 0, top: 0, width: trimmedMeta.width, height: cropHeight })
      .png()
      .toBuffer();
  }

  return trimmed;
}

// ============================================================
// FRAME COMPOSITING
// ============================================================

/**
 * Composite a transparent card image onto a cosmic frame template.
 * Returns a PNG buffer of the final composited image.
 */
export async function compositeOntoFrame(
  cardBuffer: Buffer,
  frameTemplateKey: string
): Promise<Buffer> {
  const frameUrl = FRAME_URLS[frameTemplateKey];
  if (!frameUrl) {
    throw new Error(`Unknown frame template: ${frameTemplateKey}`);
  }

  // Download frame template
  const response = await fetch(frameUrl);
  if (!response.ok) {
    throw new Error(`Failed to download frame template: ${response.status}`);
  }
  const frameBuffer = Buffer.from(await response.arrayBuffer());

  const frameMeta = await sharp(frameBuffer).metadata();
  if (!frameMeta.width || !frameMeta.height) {
    throw new Error("Could not read frame dimensions");
  }

  // Frame templates are 2048x2048
  // Card display area: centered, below the label text at top
  const cardAreaWidth = Math.round(frameMeta.width * 0.50);
  const cardAreaHeight = Math.round(frameMeta.height * 0.62);
  const cardAreaLeft = Math.round((frameMeta.width - cardAreaWidth) / 2);
  const cardAreaTop = Math.round(frameMeta.height * 0.22);

  // Resize the card to fit within the card area
  const resizedCard = await sharp(cardBuffer)
    .resize(cardAreaWidth, cardAreaHeight, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  // Composite card onto frame
  const result = await sharp(frameBuffer)
    .composite([{
      input: resizedCard,
      left: cardAreaLeft,
      top: cardAreaTop,
    }])
    .png({ quality: 90 })
    .toBuffer();

  return result;
}

/**
 * Full pipeline: remove green screen from card photo and composite onto frame.
 * Returns the final composited PNG buffer.
 */
export async function processCardImage(
  rawImageBuffer: Buffer,
  frameTemplateKey: string
): Promise<{ transparent: Buffer; composited: Buffer }> {
  const transparent = await removeGreenScreen(rawImageBuffer);
  const composited = await compositeOntoFrame(transparent, frameTemplateKey);
  return { transparent, composited };
}
