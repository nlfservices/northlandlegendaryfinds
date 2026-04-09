import { describe, expect, it } from "vitest";

/**
 * Tests for the NLF Loyalty/Rewards Program
 *
 * Validates:
 * 1. Loyalty router exports and registration
 * 2. Tier configuration and business logic
 * 3. Page component and route registration
 * 4. GHL dual-capture integration
 * 5. Database schema tables
 * 6. SEO and sitemap inclusion
 */

describe("Loyalty Program — Router & Configuration", () => {
  it("loyalty router exports public, protected, and admin routers", async () => {
    const mod = await import("./routers/loyalty");
    expect(mod.loyaltyPublicRouter).toBeDefined();
    expect(mod.loyaltyProtectedRouter).toBeDefined();
    expect(mod.loyaltyAdminRouter).toBeDefined();
  }, 15000);

  it("loyalty routers are registered in main appRouter", async () => {
    const fs = await import("fs");
    const routerContent = fs.readFileSync("server/routers.ts", "utf-8");
    expect(routerContent).toContain("loyaltyPublicRouter");
    expect(routerContent).toContain("loyaltyProtectedRouter");
    expect(routerContent).toContain("loyaltyAdminRouter");
    expect(routerContent).toContain("loyalty: loyaltyPublicRouter");
    expect(routerContent).toContain("loyaltyMember: loyaltyProtectedRouter");
    expect(routerContent).toContain("adminLoyalty: loyaltyAdminRouter");
  });

  it("TIER_CONFIG has correct tier definitions", async () => {
    const { TIER_CONFIG } = await import("./routers/loyalty");
    expect(TIER_CONFIG.collector.minPoints).toBe(0);
    expect(TIER_CONFIG.silver.minPoints).toBe(500);
    expect(TIER_CONFIG.gold.minPoints).toBe(2000);
    expect(TIER_CONFIG.legendary.minPoints).toBe(5000);
    expect(TIER_CONFIG.collector.name).toBe("Collector");
    expect(TIER_CONFIG.silver.name).toBe("Silver");
    expect(TIER_CONFIG.gold.name).toBe("Gold");
    expect(TIER_CONFIG.legendary.name).toBe("Legendary");
  });

  it("TIER_ORDER has exactly 4 tiers in ascending order", async () => {
    const { TIER_ORDER } = await import("./routers/loyalty");
    expect(TIER_ORDER).toEqual(["collector", "silver", "gold", "legendary"]);
    expect(TIER_ORDER).toHaveLength(4);
  });

  it("POINTS_CONFIG has correct point values", async () => {
    const { POINTS_CONFIG } = await import("./routers/loyalty");
    expect(POINTS_CONFIG.perDollar).toBe(10);
    expect(POINTS_CONFIG.signupBonus).toBe(50);
    expect(POINTS_CONFIG.newsletterBonus).toBe(50);
    expect(POINTS_CONFIG.referralBonus).toBe(100);
    expect(POINTS_CONFIG.socialFollowBonus).toBe(25);
    expect(POINTS_CONFIG.birthdayBonus).toBe(200);
    expect(POINTS_CONFIG.referrerBonus).toBe(75);
  });

  it("TIER_PERKS has perks for all four tiers", async () => {
    const { TIER_PERKS, TIER_ORDER } = await import("./routers/loyalty");
    for (const tier of TIER_ORDER) {
      expect(TIER_PERKS[tier]).toBeDefined();
      expect(Array.isArray(TIER_PERKS[tier])).toBe(true);
      expect(TIER_PERKS[tier].length).toBeGreaterThan(0);
    }
  });

  it("higher tiers have more perks than lower tiers", async () => {
    const { TIER_PERKS } = await import("./routers/loyalty");
    expect(TIER_PERKS.silver.length).toBeGreaterThan(TIER_PERKS.collector.length);
    expect(TIER_PERKS.gold.length).toBeGreaterThan(TIER_PERKS.silver.length);
    expect(TIER_PERKS.legendary.length).toBeGreaterThan(TIER_PERKS.gold.length);
  });

  it("legendary tier includes 2x multiplier perk", async () => {
    const { TIER_PERKS } = await import("./routers/loyalty");
    const has2x = TIER_PERKS.legendary.some((p) => p.includes("2x"));
    expect(has2x).toBe(true);
  });
});

describe("Loyalty Program — Database Schema", () => {
  it("loyalty_members table is defined in schema", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.loyaltyMembers).toBeDefined();
  });

  it("loyalty_transactions table is defined in schema", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.loyaltyTransactions).toBeDefined();
  });

  it("loyalty_rewards table is defined in schema", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.loyaltyRewards).toBeDefined();
  });

  it("loyalty_redemptions table is defined in schema", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.loyaltyRedemptions).toBeDefined();
  });
});

describe("Loyalty Program — Frontend Page", () => {
  it("Rewards page component file exists and has correct structure", async () => {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("client/src/pages/Rewards.tsx", "utf-8");
    expect(pageContent).toContain("export default function Rewards");
    expect(pageContent.length).toBeGreaterThan(1000);
  });

  it("App.tsx contains the /rewards route", async () => {
    const fs = await import("fs");
    const appContent = fs.readFileSync("client/src/App.tsx", "utf-8");
    expect(appContent).toContain('/rewards');
    expect(appContent).toContain('Rewards');
  });

  it("/rewards route is NOT in the standalone routes array", async () => {
    const fs = await import("fs");
    const appContent = fs.readFileSync("client/src/App.tsx", "utf-8");
    // Standalone routes should NOT include /rewards — it uses standard nav/footer layout
    const standaloneMatch = appContent.match(/STANDALONE_ROUTES\s*=\s*\[([^\]]+)\]/);
    expect(standaloneMatch).toBeTruthy();
    expect(standaloneMatch![1]).not.toContain("/rewards");
  });

  it("/rewards is NOT linked in the main navigation", async () => {
    const fs = await import("fs");
    const navContent = fs.readFileSync("client/src/components/Navigation.tsx", "utf-8");
    // The rewards page should be hidden from navigation
    expect(navContent).not.toContain("/rewards");
  });

  it("sitemap includes /rewards page", async () => {
    const fs = await import("fs");
    const sitemapContent = fs.readFileSync("server/sitemap.ts", "utf-8");
    expect(sitemapContent).toContain("/rewards");
  });

  it("Rewards page has SEO meta tags", async () => {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("client/src/pages/Rewards.tsx", "utf-8");
    expect(pageContent).toContain("<SEO");
    expect(pageContent).toContain("breadcrumbJsonLd");
    expect(pageContent).toContain('path="/rewards"');
  });

  it("Rewards page has GHL dual-capture integration", async () => {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("client/src/pages/Rewards.tsx", "utf-8");
    // GHL form URL
    expect(pageContent).toContain("leadconnectorhq.com/widget/form/5SL68SbkAFgq85FPiJw6");
    // Hidden iframe for backup capture
    expect(pageContent).toContain("ghl-loyalty-iframe");
    // Uses loyalty.enroll mutation
    expect(pageContent).toContain("trpc.loyalty.enroll.useMutation");
  });

  it("Rewards page has Facebook Pixel Lead event", async () => {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("client/src/pages/Rewards.tsx", "utf-8");
    expect(pageContent).toContain("fbq");
    expect(pageContent).toContain('"Lead"');
    expect(pageContent).toContain("Loyalty VIP Signup");
  });

  it("Rewards page has all required sections", async () => {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("client/src/pages/Rewards.tsx", "utf-8");
    // Hero with Coming Soon
    expect(pageContent).toContain("Coming Soon");
    // Tier system section
    expect(pageContent).toContain("TIER SYSTEM");
    // Earn points section
    expect(pageContent).toContain("EARN POINTS");
    // Rewards preview section
    expect(pageContent).toContain("REDEEM REWARDS");
    // VIP signup form
    expect(pageContent).toContain("EARLY ACCESS");
    // FAQ section
    expect(pageContent).toContain("FAQ");
  });

  it("Rewards page has all four tier names displayed", async () => {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("client/src/pages/Rewards.tsx", "utf-8");
    expect(pageContent).toContain("Collector");
    expect(pageContent).toContain("Silver");
    expect(pageContent).toContain("Gold");
    expect(pageContent).toContain("Legendary");
  });

  it("Rewards page has FAQ items", async () => {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("client/src/pages/Rewards.tsx", "utf-8");
    expect(pageContent).toContain("When does the NLF Rewards program launch?");
    expect(pageContent).toContain("How do I earn points?");
    expect(pageContent).toContain("What are the tier levels?");
    expect(pageContent).toContain("Do my points expire?");
    expect(pageContent).toContain("What can I redeem points for?");
  });
});

describe("Loyalty Program — Router Logic", () => {
  it("getTierInfo procedure returns tier data without auth", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    });

    const result = await caller.loyalty.getTierInfo();
    expect(result.tiers).toHaveLength(4);
    expect(result.tiers[0].id).toBe("collector");
    expect(result.tiers[3].id).toBe("legendary");
    expect(result.pointsConfig.perDollar).toBe(10);
    expect(result.pointsConfig.signupBonus).toBe(50);
  });

  it("enroll procedure requires email input", async () => {
    const fs = await import("fs");
    const routerContent = fs.readFileSync("server/routers/loyalty.ts", "utf-8");
    expect(routerContent).toContain("email: z.string().email()");
    expect(routerContent).toContain("firstName: z.string().min(1).max(100).optional()");
    expect(routerContent).toContain("birthday:");
    expect(routerContent).toContain("referralCode:");
  });

  it("loyalty router uses getDb pattern (not direct db import)", async () => {
    const fs = await import("fs");
    const routerContent = fs.readFileSync("server/routers/loyalty.ts", "utf-8");
    expect(routerContent).toContain('import { getDb } from "../db"');
    expect(routerContent).not.toContain('import { db } from "../db"');
  });

  it("loyalty router imports GHL contact creation", async () => {
    const fs = await import("fs");
    const routerContent = fs.readFileSync("server/routers/loyalty.ts", "utf-8");
    expect(routerContent).toContain("createGHLContact");
    expect(routerContent).toContain("loyalty-member");
  });
});
