import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Tests for the card show submission procedure.
 * We mock the database layer so tests run without a real DB connection.
 */

// Mock the db module to avoid real database calls
vi.mock("./db", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    insertShowSubmission: vi.fn().mockResolvedValue(42),
  };
});

// Mock notification to avoid real calls
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

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

describe("cardShows.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully submits a valid card show", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.public.cardShows.submit({
      showName: "Test Card Show",
      promoterName: "John Doe",
      email: "john@example.com",
      city: "Minneapolis",
      state: "MN",
      startDate: Date.now(),
      endDate: Date.now() + 86400000,
    });

    expect(result).toEqual({ success: true, id: 42 });
  });

  it("submits a card show with all optional fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.public.cardShows.submit({
      showName: "Full Details Card Show",
      promoterName: "Jane Smith",
      email: "jane@example.com",
      phone: "555-123-4567",
      website: "https://fulldetailsshow.com",
      venue: "Convention Center",
      address: "123 Main St",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
      startDate: Date.now(),
      endDate: Date.now() + 172800000,
      hours: "Sat 9am-5pm; Sun 10am-3pm",
      tableCount: 200,
      admission: "$5",
      description: "A great card show with 200 tables",
      isRecurring: true,
      recurrenceNote: "Monthly on the first Saturday",
    });

    expect(result).toEqual({ success: true, id: 42 });
  });

  it("rejects submission with missing required show name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.public.cardShows.submit({
        showName: "", // too short
        promoterName: "John Doe",
        email: "john@example.com",
        city: "Minneapolis",
        state: "MN",
        startDate: Date.now(),
        endDate: Date.now(),
      })
    ).rejects.toThrow();
  });

  it("rejects submission with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.public.cardShows.submit({
        showName: "Test Show",
        promoterName: "John Doe",
        email: "not-an-email",
        city: "Minneapolis",
        state: "MN",
        startDate: Date.now(),
        endDate: Date.now(),
      })
    ).rejects.toThrow();
  });

  it("rejects submission with invalid state code", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.public.cardShows.submit({
        showName: "Test Show",
        promoterName: "John Doe",
        email: "john@example.com",
        city: "Minneapolis",
        state: "MINNESOTA", // should be 2-char code
        startDate: Date.now(),
        endDate: Date.now(),
      })
    ).rejects.toThrow();
  });

  it("accepts submission with empty website string", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.public.cardShows.submit({
      showName: "No Website Show",
      promoterName: "John Doe",
      email: "john@example.com",
      city: "Minneapolis",
      state: "MN",
      startDate: Date.now(),
      endDate: Date.now(),
      website: "",
    });

    expect(result).toEqual({ success: true, id: 42 });
  });
});
