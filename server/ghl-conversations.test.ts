/**
 * Tests for GHL Conversations API integration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock ENV
vi.mock("./_core/env", () => ({
  ENV: {
    ghlApiKey: "test-api-key",
    ghlLocationId: "test-location-id",
  },
}));

import {
  isGHLConfigured,
  searchConversations,
  getConversation,
  getConversationMessages,
  getRecentContacts,
  getContact,
} from "./ghl-conversations";

describe("GHL Conversations API", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe("isGHLConfigured", () => {
    it("should return true when both API key and location ID are set", () => {
      expect(isGHLConfigured()).toBe(true);
    });
  });

  describe("searchConversations", () => {
    it("should search conversations successfully", async () => {
      const mockConversations = [
        {
          id: "conv-1",
          contactId: "contact-1",
          locationId: "test-location-id",
          fullName: "John Doe",
          lastMessageBody: "Great cards!",
          lastMessageDate: "2026-05-22T10:00:00Z",
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ conversations: mockConversations, total: 1 }),
      });

      const result = await searchConversations({ limit: 20 });

      expect(result.success).toBe(true);
      expect(result.conversations).toHaveLength(1);
      expect(result.conversations![0].fullName).toBe("John Doe");
      expect(result.total).toBe(1);

      // Verify correct URL was called
      const fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toContain("/conversations/search");
      expect(fetchCall[0]).toContain("locationId=test-location-id");
    });

    it("should handle API errors gracefully", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => "Unauthorized",
      });

      const result = await searchConversations();

      expect(result.success).toBe(false);
      expect(result.error).toContain("401");
    });

    it("should handle network errors", async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error("Network timeout"));

      const result = await searchConversations();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network timeout");
    });
  });

  describe("getConversation", () => {
    it("should get a conversation by ID", async () => {
      const mockConversation = {
        id: "conv-123",
        contactId: "contact-456",
        locationId: "test-location-id",
        fullName: "Jane Smith",
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ conversation: mockConversation }),
      });

      const result = await getConversation("conv-123");

      expect(result.success).toBe(true);
      expect(result.conversation?.id).toBe("conv-123");
      expect(result.conversation?.fullName).toBe("Jane Smith");
    });

    it("should handle not found", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getConversation("nonexistent");

      expect(result.success).toBe(false);
      expect(result.error).toContain("404");
    });
  });

  describe("getConversationMessages", () => {
    it("should get messages for a conversation", async () => {
      const mockMessages = [
        {
          id: "msg-1",
          type: 1,
          direction: "inbound",
          body: "Love the Marvel cards!",
          dateAdded: "2026-05-22T09:00:00Z",
        },
        {
          id: "msg-2",
          type: 1,
          direction: "outbound",
          body: "Thanks for the comment!",
          dateAdded: "2026-05-22T09:01:00Z",
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ messages: mockMessages }),
      });

      const result = await getConversationMessages("conv-123", { limit: 50 });

      expect(result.success).toBe(true);
      expect(result.messages).toHaveLength(2);
      expect(result.messages![0].body).toBe("Love the Marvel cards!");
    });
  });

  describe("getRecentContacts", () => {
    it("should get recent contacts", async () => {
      const mockContacts = [
        {
          id: "contact-1",
          locationId: "test-location-id",
          firstName: "Tony",
          lastName: "Stark",
          email: "tony@example.com",
          tags: ["facebook-commenter"],
          source: "Facebook",
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contacts: mockContacts, meta: { total: 1 } }),
      });

      const result = await getRecentContacts({ limit: 20 });

      expect(result.success).toBe(true);
      expect(result.contacts).toHaveLength(1);
      expect(result.contacts![0].firstName).toBe("Tony");
      expect(result.total).toBe(1);
    });

    it("should support search query", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contacts: [], meta: { total: 0 } }),
      });

      await getRecentContacts({ query: "tony", limit: 10 });

      const fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toContain("query=tony");
    });
  });

  describe("getContact", () => {
    it("should get a specific contact", async () => {
      const mockContact = {
        id: "contact-1",
        locationId: "test-location-id",
        firstName: "Peter",
        lastName: "Parker",
        email: "peter@example.com",
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contact: mockContact }),
      });

      const result = await getContact("contact-1");

      expect(result.success).toBe(true);
      expect(result.contact?.firstName).toBe("Peter");
    });
  });
});
