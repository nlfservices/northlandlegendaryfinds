import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests for the Facebook/Instagram social media integration
 * Part 1: Validate live credentials against the Graph API
 * Part 2: Unit tests for the facebook-api module functions
 */

describe("Social Media API Credentials", () => {
  it("should have FB_PAGE_ACCESS_TOKEN set", () => {
    expect(process.env.FB_PAGE_ACCESS_TOKEN).toBeDefined();
    expect(process.env.FB_PAGE_ACCESS_TOKEN!.length).toBeGreaterThan(10);
  });

  it("should have FB_PAGE_ID set", () => {
    expect(process.env.FB_PAGE_ID).toBeDefined();
    expect(process.env.FB_PAGE_ID).toBe("951323751392043");
  });

  it("should have IG_BUSINESS_ACCOUNT_ID set", () => {
    expect(process.env.IG_BUSINESS_ACCOUNT_ID).toBeDefined();
    expect(process.env.IG_BUSINESS_ACCOUNT_ID).toBe("17841447678496145");
  });

  it("should have FB_APP_ID set", () => {
    expect(process.env.FB_APP_ID).toBeDefined();
    expect(process.env.FB_APP_ID).toBe("341166519822108");
  });

  it("should validate FB_PAGE_ACCESS_TOKEN against Facebook Graph API", async () => {
    const token = process.env.FB_PAGE_ACCESS_TOKEN;
    const pageId = process.env.FB_PAGE_ID;
    
    const response = await fetch(
      `https://graph.facebook.com/v24.0/${pageId}?fields=name,id&access_token=${token}`
    );
    const data = await response.json();
    
    expect(response.ok).toBe(true);
    expect(data.id).toBe("951323751392043");
    expect(data.name).toBe("Northland Legendary Finds");
  });

  it("should validate Instagram Business Account ID", async () => {
    const token = process.env.FB_PAGE_ACCESS_TOKEN;
    const igId = process.env.IG_BUSINESS_ACCOUNT_ID;
    
    const response = await fetch(
      `https://graph.facebook.com/v24.0/${igId}?fields=id,username&access_token=${token}`
    );
    const data = await response.json();
    
    expect(response.ok).toBe(true);
    expect(data.id).toBe("17841447678496145");
    expect(data.username).toBe("northlandlegendaryfinds");
  });
});

describe("Token Health Check", () => {
  it("should return valid token with correct scopes and expiration", async () => {
    const token = process.env.FB_PAGE_ACCESS_TOKEN;
    
    const response = await fetch(
      `https://graph.facebook.com/v24.0/debug_token?input_token=${token}&access_token=${token}`
    );
    const result = await response.json();
    
    expect(response.ok).toBe(true);
    expect(result.data.is_valid).toBe(true);
    expect(result.data.scopes).toContain("pages_manage_posts");
  });

  it("checkTokenHealth function returns correct structure", async () => {
    const { checkTokenHealth } = await import("./facebook-api");
    const result = await checkTokenHealth();
    
    expect(result.valid).toBe(true);
    expect(result.daysRemaining).not.toBeNull();
    expect(result.daysRemaining!).toBeGreaterThan(0);
    expect(result.scopes.length).toBeGreaterThan(0);
    expect(result.scopes).toContain("pages_manage_posts");
  });
});

describe("Facebook API Configuration", () => {
  it("isFacebookConfigured returns true when env vars are set", async () => {
    const { isFacebookConfigured } = await import("./facebook-api");
    expect(isFacebookConfigured()).toBe(true);
  });

  it("isInstagramConfigured returns true when env vars are set", async () => {
    const { isInstagramConfigured } = await import("./facebook-api");
    expect(isInstagramConfigured()).toBe(true);
  });
});
