import { describe, expect, it, vi } from "vitest";

/**
 * Tests for the Whatnot Deal / Free Credit landing page
 * 
 * Validates:
 * 1. The subscribe mutation (used by the lead capture form) accepts the expected inputs
 * 2. The page route is registered in App.tsx
 * 3. The sitemap includes the /free-credit page
 */

describe("Whatnot Deal Landing Page", () => {
  it("WhatnotDeal page component exists and exports default", async () => {
    // Verify the page module can be imported
    const mod = await import("../client/src/pages/WhatnotDeal");
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe("function");
  });

  it("App.tsx contains the /free-credit route", async () => {
    const fs = await import("fs");
    const appContent = fs.readFileSync("client/src/App.tsx", "utf-8");
    expect(appContent).toContain('/free-credit');
    expect(appContent).toContain('WhatnotDeal');
  });

  it("sitemap includes /free-credit page", async () => {
    const fs = await import("fs");
    const sitemapContent = fs.readFileSync("server/sitemap.ts", "utf-8");
    expect(sitemapContent).toContain("/free-credit");
  });

  it("WhatnotDeal page contains the Whatnot referral link", async () => {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("client/src/pages/WhatnotDeal.tsx", "utf-8");
    expect(pageContent).toContain("whatnot.com/invite/northlandfinds");
  });

  it("WhatnotDeal page has Facebook Pixel tracking events", async () => {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("client/src/pages/WhatnotDeal.tsx", "utf-8");
    // ViewContent on page load
    expect(pageContent).toContain("ViewContent");
    // Lead event on form submit
    expect(pageContent).toContain('"Lead"');
    // Custom event for Whatnot referral clicks
    expect(pageContent).toContain("WhatnotReferralClick");
  });

  it("WhatnotDeal page uses GHL subscribe mutation", async () => {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("client/src/pages/WhatnotDeal.tsx", "utf-8");
    // Uses the existing subscribe mutation that connects to GHL
    expect(pageContent).toContain("trpc.public.subscribe.submit.useMutation");
  });

  it("WhatnotDeal page has SEO meta tags", async () => {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("client/src/pages/WhatnotDeal.tsx", "utf-8");
    expect(pageContent).toContain("<SEO");
    expect(pageContent).toContain("breadcrumbJsonLd");
    expect(pageContent).toContain('path="/free-credit"');
  });

  it("WhatnotDeal page has all required sections", async () => {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("client/src/pages/WhatnotDeal.tsx", "utf-8");
    // Hero section
    expect(pageContent).toContain("$15 FREE");
    // How it works
    expect(pageContent).toContain("HOW TO GET YOUR");
    // What you'll find
    expect(pageContent).toContain("WHAT YOU'LL FIND ON");
    // Why Whatnot
    expect(pageContent).toContain("WHY");
    // Lead capture
    expect(pageContent).toContain("STAY IN THE");
    // FAQ
    expect(pageContent).toContain("COMMON");
    // Final CTA
    expect(pageContent).toContain("IS WAITING FOR YOU");
  });

  it("subscribe router accepts firstName and source fields", async () => {
    const fs = await import("fs");
    const routerContent = fs.readFileSync("server/routers/public.ts", "utf-8");
    // The subscribe.submit mutation should accept firstName and source
    expect(routerContent).toContain("firstName: z.string().optional()");
    expect(routerContent).toContain("source: z.string().optional()");
  });
});
