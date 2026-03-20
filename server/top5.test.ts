import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: { origin: "https://test.example.com" },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// ============================================================
// PUBLIC TOP 5 ROUTES
// ============================================================

describe("top5.list (public)", () => {
  it("returns a list (may be empty if no items seeded)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.top5.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ============================================================
// ADMIN TOP 5 ROUTES
// ============================================================

describe("adminTop5 (admin-only)", () => {
  const testItem = {
    rank: 1,
    title: "Test Character: Rising Star",
    character: "Test Hero",
    tagline: "The hype is real",
    backstory: "This character is trending because of a new movie announcement.",
    cardImage: "https://example.com/card.jpg",
    frontImage: null,
    backImage: null,
    frameTemplate: "marvel_mint_gold",
    cardLabel: "2025 Topps Chrome #101",
    cardLink: "/cards/chrome/101",
    sources: [{ title: "Marvel News", url: "https://marvel.com/news" }],
    heatLevel: "blazing" as const,
    category: "Movie",
    isActive: true,
  };

  it("rejects non-admin users from listing items", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.adminTop5.list()).rejects.toThrow();
  });

  it("rejects unauthenticated users from listing items", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.adminTop5.list()).rejects.toThrow();
  });

  it("admin can list items", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.adminTop5.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("admin can create a top 5 item", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.adminTop5.create(testItem);
    expect(result.success).toBe(true);
    expect(typeof result.id).toBe("number");
  });

  it("admin can update a top 5 item", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create first
    const created = await caller.adminTop5.create({
      ...testItem,
      rank: 2,
      character: "Update Test Hero",
    });

    // Update
    const result = await caller.adminTop5.update({
      id: created.id,
      data: { title: "Updated Title" },
    });
    expect(result.success).toBe(true);
  });

  it("admin can delete a top 5 item", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create first
    const created = await caller.adminTop5.create({
      ...testItem,
      rank: 3,
      character: "Delete Test Hero",
    });

    // Delete
    const result = await caller.adminTop5.delete({ id: created.id });
    expect(result.success).toBe(true);
  });

  it("validates required fields on create", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.adminTop5.create({
        ...testItem,
        character: "", // empty required field
      })
    ).rejects.toThrow();
  });

  it("validates rank range", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.adminTop5.create({
        ...testItem,
        rank: 0, // below minimum
      })
    ).rejects.toThrow();
  });
});

// ============================================================
// GREEN SCREEN PROCESSING (unit test for the algorithm)
// ============================================================

describe("greenscreen module", () => {
  it("exports removeGreenScreen function", async () => {
    const { removeGreenScreen } = await import("./lib/greenscreen");
    expect(typeof removeGreenScreen).toBe("function");
  });

  it("exports compositeOntoFrame function", async () => {
    const { compositeOntoFrame } = await import("./lib/greenscreen");
    expect(typeof compositeOntoFrame).toBe("function");
  });

  it("exports processCardImage function", async () => {
    const { processCardImage } = await import("./lib/greenscreen");
    expect(typeof processCardImage).toBe("function");
  });

  it("exports FRAME_URLS with all 7 templates", async () => {
    const { FRAME_URLS } = await import("./lib/greenscreen");
    expect(Object.keys(FRAME_URLS).length).toBe(7);
    expect(FRAME_URLS["marvel_mint_gold"]).toBeDefined();
    expect(FRAME_URLS["marvel_mint_silver"]).toBeDefined();
    expect(FRAME_URLS["marvel_mint_bronze"]).toBeDefined();
    expect(FRAME_URLS["marvel_mint_platinum"]).toBeDefined();
    expect(FRAME_URLS["1975_era_gold_amber"]).toBeDefined();
    expect(FRAME_URLS["1976_era_blue_silver"]).toBeDefined();
    expect(FRAME_URLS["2025_era_emerald_green"]).toBeDefined();
  });

  it("removeGreenScreen processes a simple green image", async () => {
    const sharp = (await import("sharp")).default;
    const { removeGreenScreen } = await import("./lib/greenscreen");

    // Create a 10x10 solid green image
    const greenPixels = Buffer.alloc(10 * 10 * 3);
    for (let i = 0; i < greenPixels.length; i += 3) {
      greenPixels[i] = 0;     // R
      greenPixels[i + 1] = 200; // G
      greenPixels[i + 2] = 0;   // B
    }
    const greenImage = await sharp(greenPixels, {
      raw: { width: 10, height: 10, channels: 3 },
    }).png().toBuffer();

    const result = await removeGreenScreen(greenImage);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(0);

    // Verify the result is a valid PNG
    const meta = await sharp(result).metadata();
    expect(meta.format).toBe("png");
    expect(meta.channels).toBe(4); // Should have alpha channel
  });

  it("compositeOntoFrame throws for unknown template", async () => {
    const { compositeOntoFrame } = await import("./lib/greenscreen");
    const sharp = (await import("sharp")).default;

    const testImage = await sharp({
      create: { width: 10, height: 10, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 255 } },
    }).png().toBuffer();

    await expect(
      compositeOntoFrame(testImage, "nonexistent_template")
    ).rejects.toThrow("Unknown frame template");
  });
});
