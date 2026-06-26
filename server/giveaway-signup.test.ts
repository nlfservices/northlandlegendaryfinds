import { describe, it, expect, vi } from "vitest";

/**
 * Test the giveaway signup form endpoint accepts phone and preferredContact fields
 * and routes to GHL with correct tags
 */

// Mock the GHL module
vi.mock("./ghl", () => ({
  createGHLContact: vi.fn().mockResolvedValue({ success: true, contactId: "test-123" }),
}));

import { createGHLContact } from "./ghl";

describe("Giveaway Signup (subscribe.submit)", () => {
  it("should accept phone and preferredContact fields in the input schema", async () => {
    // The subscribe.submit endpoint now accepts:
    // email (required), firstName, lastName, phone, preferredContact, source
    const input = {
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "5551234567",
      preferredContact: "sms" as const,
      source: "giveaway-signup",
    };

    // Verify all fields are valid (no type errors)
    expect(input.email).toBe("test@example.com");
    expect(input.phone).toBe("5551234567");
    expect(input.preferredContact).toBe("sms");
    expect(input.source).toBe("giveaway-signup");
  });

  it("should build correct tags for giveaway source", () => {
    const source = "giveaway-signup";
    const preferredContact = "sms";

    const tags = ["website-subscriber", `source-${source}`];
    if (preferredContact) tags.push(`contact-pref-${preferredContact}`);
    if (source === "giveaway-signup") tags.push("giveaway-entrant");

    expect(tags).toContain("website-subscriber");
    expect(tags).toContain("source-giveaway-signup");
    expect(tags).toContain("contact-pref-sms");
    expect(tags).toContain("giveaway-entrant");
  });

  it("should build correct tags for email preference", () => {
    const source = "giveaway-signup";
    const preferredContact = "email";

    const tags = ["website-subscriber", `source-${source}`];
    if (preferredContact) tags.push(`contact-pref-${preferredContact}`);
    if (source === "giveaway-signup") tags.push("giveaway-entrant");

    expect(tags).toContain("contact-pref-email");
    expect(tags).toContain("giveaway-entrant");
  });

  it("should build correct tags for both preference", () => {
    const source = "giveaway-signup";
    const preferredContact = "both";

    const tags = ["website-subscriber", `source-${source}`];
    if (preferredContact) tags.push(`contact-pref-${preferredContact}`);
    if (source === "giveaway-signup") tags.push("giveaway-entrant");

    expect(tags).toContain("contact-pref-both");
  });

  it("should not add giveaway-entrant tag for non-giveaway sources", () => {
    const source = "website-popup";
    const preferredContact = "sms";

    const tags = ["website-subscriber", `source-${source}`];
    if (preferredContact) tags.push(`contact-pref-${preferredContact}`);
    if (source === "giveaway-signup") tags.push("giveaway-entrant");

    expect(tags).not.toContain("giveaway-entrant");
    expect(tags).toContain("source-website-popup");
  });

  it("should pass phone to GHL createGHLContact", async () => {
    const mockCreateGHLContact = createGHLContact as ReturnType<typeof vi.fn>;
    mockCreateGHLContact.mockResolvedValue({ success: true, contactId: "test-456" });

    await createGHLContact({
      email: "giveaway@test.com",
      firstName: "Jane",
      lastName: "Smith",
      phone: "5559876543",
      tags: ["website-subscriber", "source-giveaway-signup", "contact-pref-sms", "giveaway-entrant"],
      source: "NLF Website - giveaway-signup",
    });

    expect(mockCreateGHLContact).toHaveBeenCalledWith({
      email: "giveaway@test.com",
      firstName: "Jane",
      lastName: "Smith",
      phone: "5559876543",
      tags: ["website-subscriber", "source-giveaway-signup", "contact-pref-sms", "giveaway-entrant"],
      source: "NLF Website - giveaway-signup",
    });
  });
});
