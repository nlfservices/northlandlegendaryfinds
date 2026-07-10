import { describe, it, expect } from "vitest";

describe("GHL API Key Validation", () => {
  it("should authenticate with GoHighLevel API using the new key", async () => {
    const apiKey = process.env.GHL_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe("");

    // Test the key by fetching the location info
    const locationId = process.env.GHL_LOCATION_ID;
    const response = await fetch(
      `https://services.leadconnectorhq.com/locations/${locationId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: "2021-07-28",
          Accept: "application/json",
        },
      }
    );

    // Should get 200 OK, not 403 Forbidden
    expect(response.status).not.toBe(403);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.location).toBeDefined();
  });
});
