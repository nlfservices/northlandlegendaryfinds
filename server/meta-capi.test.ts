import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("Meta Conversions API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set env vars for testing
    process.env.META_CAPI_ACCESS_TOKEN = "test_token_123";
    process.env.META_PIXEL_ID = "839598775754379";
  });

  it("generateEventId returns unique IDs", async () => {
    const { generateEventId } = await import("./meta-capi");
    const id1 = generateEventId();
    const id2 = generateEventId();
    expect(id1).toMatch(/^nlf_\d+_/);
    expect(id2).toMatch(/^nlf_\d+_/);
    expect(id1).not.toBe(id2);
  });

  it("trackPageView sends correct event to Meta", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events_received: 1 }),
    });

    const { trackPageView } = await import("./meta-capi");
    const result = await trackPageView({
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0",
      sourceUrl: "https://northlandlegendaryfinds.com/",
      eventId: "test_event_1",
    });

    expect(result.success).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain("839598775754379/events");
    expect(url).toContain("v25.0");

    const body = JSON.parse(options.body);
    expect(body.data[0].event_name).toBe("PageView");
    expect(body.data[0].event_id).toBe("test_event_1");
    expect(body.data[0].action_source).toBe("website");
    expect(body.data[0].user_data.client_ip_address).toBe("192.168.1.1");
  });

  it("trackLead sends Lead event with content data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events_received: 1 }),
    });

    const { trackLead } = await import("./meta-capi");
    const result = await trackLead(
      {
        ip: "10.0.0.1",
        userAgent: "TestAgent",
        email: "test@example.com",
        eventId: "lead_test_1",
      },
      {
        contentName: "Newsletter Signup",
        contentCategory: "Email",
      }
    );

    expect(result.success).toBe(true);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.data[0].event_name).toBe("Lead");
    expect(body.data[0].custom_data.content_name).toBe("Newsletter Signup");
    // Email should be hashed
    expect(body.data[0].user_data.em[0]).toHaveLength(64); // SHA-256 hex
  });

  it("trackPurchase sends Purchase event with order data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events_received: 1 }),
    });

    const { trackPurchase } = await import("./meta-capi");
    const result = await trackPurchase(
      { ip: "10.0.0.1", userAgent: "TestAgent", eventId: "purchase_1" },
      {
        value: 49.99,
        orderId: "order_123",
        numItems: 2,
        currency: "USD",
      }
    );

    expect(result.success).toBe(true);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.data[0].event_name).toBe("Purchase");
    expect(body.data[0].custom_data.value).toBe(49.99);
    expect(body.data[0].custom_data.order_id).toBe("order_123");
  });

  it("returns error when no access token is set", async () => {
    // The module reads env at call time, so just clear the token
    const origToken = process.env.META_CAPI_ACCESS_TOKEN;
    process.env.META_CAPI_ACCESS_TOKEN = "";
    const { trackPageView } = await import("./meta-capi");
    const result = await trackPageView({ eventId: "no_token_test" });
    expect(result.success).toBe(false);
    expect(result.error).toContain("META_CAPI_ACCESS_TOKEN");
    process.env.META_CAPI_ACCESS_TOKEN = origToken;
  });

  it("handles network errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network timeout"));

    const { trackPageView } = await import("./meta-capi");
    const result = await trackPageView({
      ip: "10.0.0.1",
      eventId: "network_error_test",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Network timeout");
  });

  it("extractTrackingContext extracts IP and user agent", async () => {
    const { extractTrackingContext } = await import("./meta-capi");
    const ctx = extractTrackingContext({
      headers: {
        "x-forwarded-for": "203.0.113.50, 70.41.3.18",
        "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)",
        cookie: "_fbc=fb.1.1234567890.abc; _fbp=fb.1.9876543210.xyz",
      },
      ip: "127.0.0.1",
    });

    expect(ctx.ip).toBe("203.0.113.50");
    expect(ctx.userAgent).toBe("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)");
    expect(ctx.fbc).toBe("fb.1.1234567890.abc");
    expect(ctx.fbp).toBe("fb.1.9876543210.xyz");
  });
});

describe("Facebook API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("isFacebookConfigured returns false when not configured", async () => {
    const origId = process.env.FB_PAGE_ID;
    const origToken = process.env.FB_PAGE_ACCESS_TOKEN;
    process.env.FB_PAGE_ID = "";
    process.env.FB_PAGE_ACCESS_TOKEN = "";
    const { isFacebookConfigured } = await import("./facebook-api");
    expect(isFacebookConfigured()).toBe(false);
    process.env.FB_PAGE_ID = origId;
    process.env.FB_PAGE_ACCESS_TOKEN = origToken;
  });

  it("isFacebookConfigured returns true when configured", async () => {
    process.env.FB_PAGE_ID = "123456789";
    process.env.FB_PAGE_ACCESS_TOKEN = "test_page_token";
    const { isFacebookConfigured } = await import("./facebook-api");
    expect(isFacebookConfigured()).toBe(true);
  });

  it("publishPost sends correct request to Graph API", async () => {
    process.env.FB_PAGE_ID = "123456789";
    process.env.FB_PAGE_ACCESS_TOKEN = "test_page_token";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "123456789_987654321" }),
    });

    const { publishPost } = await import("./facebook-api");
    const result = await publishPost({
      message: "Test post from NLF!",
      link: "https://northlandlegendaryfinds.com",
    });

    expect(result.success).toBe(true);
    expect(result.postId).toBe("123456789_987654321");

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain("123456789/feed");
    const body = JSON.parse(options.body);
    expect(body.message).toBe("Test post from NLF!");
    expect(body.link).toBe("https://northlandlegendaryfinds.com");
  });

  it("publishPost returns error when not configured", async () => {
    process.env.FB_PAGE_ID = "";
    process.env.FB_PAGE_ACCESS_TOKEN = "";

    const { publishPost } = await import("./facebook-api");
    const result = await publishPost({ message: "Test" });
    expect(result.success).toBe(false);
    expect(result.error).toContain("not configured");
  });
});
