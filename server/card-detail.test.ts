import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("public.marvel.getCardBySlug", () => {
  it("returns card detail for a valid set slug + card slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.public.marvel.getCardBySlug({
      setSlug: "2025-topps-chrome",
      cardSlug: "iron-man-1",
    });

    expect(result).not.toBeNull();
    expect(result!.card).toBeDefined();
    expect(result!.card.characterName).toBe("Iron Man");
    expect(result!.card.cardNumber).toBe("1");
    expect(result!.card.setName).toBe("2025 Topps Chrome");
    expect(result!.card.setSlug).toBe("2025-topps-chrome");
    expect(result!.related).toBeDefined();
    expect(Array.isArray(result!.related)).toBe(true);
    expect(result!.adjacent).toBeDefined();
    expect(result!.adjacent.next).toBeDefined();
  });

  it("returns null for a non-existent card slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.public.marvel.getCardBySlug({
      setSlug: "2025-topps-chrome",
      cardSlug: "nonexistent-card-xyz",
    });

    expect(result).toBeNull();
  });

  it("returns null for a non-existent set slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.public.marvel.getCardBySlug({
      setSlug: "fake-set-2099",
      cardSlug: "iron-man-1",
    });

    expect(result).toBeNull();
  });

  it("returns related cards for Iron Man (same character, different cards)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.public.marvel.getCardBySlug({
      setSlug: "2025-topps-chrome",
      cardSlug: "iron-man-1",
    });

    expect(result).not.toBeNull();
    // Iron Man has many cards across Chrome (Iron Man Gold, Avengers, Icons) and other sets
    expect(result!.related.length).toBeGreaterThan(0);
    // All related cards should be for Iron Man
    result!.related.forEach((r: any) => {
      expect(r.characterName).toBe("Iron Man");
    });
    // The current card (id=1) should not be in the related list
    const selfIncluded = result!.related.find((r: any) => r.id === result!.card.id);
    expect(selfIncluded).toBeUndefined();
  });

  it("returns adjacent cards for navigation", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Card #10 is Layla El-Faouly in Chrome
    const result = await caller.public.marvel.getCardBySlug({
      setSlug: "2025-topps-chrome",
      cardSlug: "layla-el-faouly-10",
    });

    expect(result).not.toBeNull();
    expect(result!.card.characterName).toBe("Layla El-Faouly");
    // Card #10 should have a previous card (Iron Man #1) and a next card
    expect(result!.adjacent.prev).not.toBeNull();
    expect(result!.adjacent.next).not.toBeNull();
  });
});

describe("public.marvel.sets", () => {
  it("returns all marvel sets", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const sets = await caller.public.marvel.sets();
    expect(Array.isArray(sets)).toBe(true);
    expect(sets.length).toBeGreaterThan(0);

    const chrome = sets.find((s: any) => s.slug === "2025-topps-chrome");
    expect(chrome).toBeDefined();
    expect(chrome!.name).toBe("2025 Topps Chrome");
  });
});
