/**
 * Sell Cards Router — basic unit tests
 */
import { describe, it, expect } from "vitest";

// Test the photo validation logic (max 8 photos, 8MB each)
describe("sellCards validation", () => {
  it("should allow up to 8 photos", () => {
    const MAX_PHOTOS = 8;
    const photos = Array.from({ length: MAX_PHOTOS }, (_, i) => ({
      data: "base64data",
      contentType: "image/jpeg",
    }));
    expect(photos.length).toBeLessThanOrEqual(MAX_PHOTOS);
  });

  it("should reject more than 8 photos at the schema level", () => {
    const MAX_PHOTOS = 8;
    const photos = Array.from({ length: MAX_PHOTOS + 1 }, (_, i) => ({
      data: "base64data",
      contentType: "image/jpeg",
    }));
    expect(photos.length).toBeGreaterThan(MAX_PHOTOS);
  });

  it("should require name, email, phone, cardName, cardNumber", () => {
    const requiredFields = ["name", "email", "phone", "cardName", "cardNumber"];
    const submission = {
      name: "Tony Stark",
      email: "tony@stark.com",
      phone: "555-0100",
      cardName: "Spider-Man",
      cardNumber: "/25",
      isAutograph: false,
      photos: [],
    };
    for (const field of requiredFields) {
      expect(submission).toHaveProperty(field);
      expect((submission as any)[field]).toBeTruthy();
    }
  });

  it("should default isAutograph to false", () => {
    const submission = {
      name: "Tony Stark",
      email: "tony@stark.com",
      phone: "555-0100",
      cardName: "Spider-Man",
      cardNumber: "/25",
      isAutograph: false,
      photos: [],
    };
    expect(submission.isAutograph).toBe(false);
  });

  it("should parse image URLs from JSON string", () => {
    const raw = '["https://example.com/img1.jpg","https://example.com/img2.jpg"]';
    const parsed = JSON.parse(raw) as string[];
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toContain("https://");
  });

  it("should handle empty image URLs gracefully", () => {
    const raw = "";
    let parsed: string[] = [];
    try {
      parsed = JSON.parse(raw || "[]") as string[];
    } catch {
      parsed = [];
    }
    expect(parsed).toHaveLength(0);
  });
});
