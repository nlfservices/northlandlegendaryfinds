import { describe, it, expect, vi } from "vitest";

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          topLeftX: 25,
          topLeftY: 8,
          topRightX: 75,
          topRightY: 8,
          bottomRightX: 75,
          bottomRightY: 72,
          bottomLeftX: 25,
          bottomLeftY: 72,
        }),
      },
    }],
  }),
}));

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "temp/test.jpg", url: "https://example.com/test.jpg" }),
}));

import { processCardImage } from "./cardImageProcessor";
import sharp from "sharp";

describe("Card Image Processor", () => {
  it("should process a card image and return a buffer", async () => {
    // Create a test image (800x1200 gray background with a colored rectangle)
    const testImage = await sharp({
      create: {
        width: 800,
        height: 1200,
        channels: 3,
        background: { r: 180, g: 180, b: 180 }, // gray background
      },
    })
      .composite([{
        input: await sharp({
          create: {
            width: 400,
            height: 600,
            channels: 3,
            background: { r: 50, g: 100, b: 200 }, // "card" area
          },
        }).png().toBuffer(),
        left: 200,
        top: 100,
      }])
      .jpeg()
      .toBuffer();

    const result = await processCardImage(testImage, {
      outputWidth: 800,
      outputHeight: 1100,
      backgroundColor: "#0a0f1a",
      paddingPercent: 4,
      imageUrl: "https://example.com/test-card.jpg", // skip temp upload
    });

    expect(result).toBeDefined();
    expect(result.processedBuffer).toBeInstanceOf(Buffer);
    expect(result.contentType).toBe("image/jpeg");

    // Verify output dimensions
    const metadata = await sharp(result.processedBuffer).metadata();
    expect(metadata.width).toBe(800);
    expect(metadata.height).toBe(1100);
  });

  it("should handle different output sizes", async () => {
    const testImage = await sharp({
      create: {
        width: 600,
        height: 900,
        channels: 3,
        background: { r: 180, g: 180, b: 180 },
      },
    }).jpeg().toBuffer();

    const result = await processCardImage(testImage, {
      outputWidth: 400,
      outputHeight: 550,
      backgroundColor: "#1a1a2e",
      paddingPercent: 5,
      imageUrl: "https://example.com/test-card2.jpg",
    });

    const metadata = await sharp(result.processedBuffer).metadata();
    expect(metadata.width).toBe(400);
    expect(metadata.height).toBe(550);
  });

  it("should use default options when none provided", async () => {
    const testImage = await sharp({
      create: {
        width: 800,
        height: 1200,
        channels: 3,
        background: { r: 180, g: 180, b: 180 },
      },
    }).jpeg().toBuffer();

    const result = await processCardImage(testImage, {
      imageUrl: "https://example.com/test-card3.jpg",
    });

    expect(result).toBeDefined();
    const metadata = await sharp(result.processedBuffer).metadata();
    expect(metadata.width).toBe(800);
    expect(metadata.height).toBe(1100);
  });
});
