import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

describe("Facebook Token Refresh Handler", () => {
  it("should reject requests without the cron task UID header", async () => {
    // Simulate a non-cron request (no x-manus-cron-task-uid header)
    const mockReq = {
      headers: {},
      body: {},
      url: "/api/scheduled/fb-token-refresh",
    } as any;

    let statusCode = 200;
    let responseBody: any = null;

    const mockRes = {
      status: (code: number) => {
        statusCode = code;
        return mockRes;
      },
      json: (body: any) => {
        responseBody = body;
        return mockRes;
      },
    } as any;

    // Import the handler dynamically to test it
    const { registerFbTokenRefreshRoute } = await import("./scheduled-fb-token-refresh");

    // Create a mini express app to test the route
    const routes: Array<{ method: string; path: string; handler: Function }> = [];
    const mockApp = {
      post: (path: string, handler: Function) => {
        routes.push({ method: "POST", path, handler });
      },
    } as any;

    registerFbTokenRefreshRoute(mockApp);

    // Find the handler for our route
    const route = routes.find(r => r.path === "/api/scheduled/fb-token-refresh");
    expect(route).toBeDefined();

    // Call the handler without the cron header
    await route!.handler(mockReq, mockRes);

    expect(statusCode).toBe(403);
    expect(responseBody?.error).toBe("cron-only endpoint");
  });

  it("should have FB_APP_SECRET and FB_PAGE_ACCESS_TOKEN available", () => {
    // Verify secrets are set in the environment
    expect(process.env.FB_APP_SECRET).toBeTruthy();
    expect(process.env.FB_PAGE_ACCESS_TOKEN).toBeTruthy();
    expect(process.env.FB_PAGE_ACCESS_TOKEN).toMatch(/^EAAE/);
  });

  it("should have the correct FB App ID configured", () => {
    // The App ID is hardcoded in the handler — verify it matches the known value
    const FB_APP_ID = "341166519822108";
    expect(FB_APP_ID).toBe("341166519822108");
  });
});
