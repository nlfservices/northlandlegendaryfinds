/**
 * GoHighLevel Conversations API integration
 * Fetches conversations (including Facebook comment threads) from GHL CRM
 * Uses Private Integration Token (GHL_API_KEY) for authentication
 */
import { ENV } from "./_core/env";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

export type GHLConversation = {
  id: string;
  contactId: string;
  locationId: string;
  lastMessageBody?: string;
  lastMessageDate?: string;
  lastMessageType?: string;
  type?: string;
  unreadCount?: number;
  fullName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  dateAdded?: string;
  dateUpdated?: string;
};

export type GHLMessage = {
  id: string;
  type: number;
  messageType?: string;
  direction: string;
  status?: string;
  body?: string;
  contentType?: string;
  dateAdded: string;
  contactId?: string;
  conversationId?: string;
  source?: string;
};

export type GHLContact = {
  id: string;
  locationId: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  source?: string;
  dateAdded?: string;
  lastActivity?: string;
  customFields?: Record<string, any>[];
};

/**
 * Check if GHL API is configured
 */
export function isGHLConfigured(): boolean {
  return !!(ENV.ghlApiKey && ENV.ghlLocationId);
}

/**
 * Search conversations in GHL (supports filtering by type, status, etc.)
 */
export async function searchConversations(opts?: {
  locationId?: string;
  query?: string;
  limit?: number;
}): Promise<{ success: boolean; conversations?: GHLConversation[]; total?: number; error?: string }> {
  if (!ENV.ghlApiKey || !ENV.ghlLocationId) {
    return { success: false, error: "GHL credentials not configured" };
  }

  const locationId = opts?.locationId || ENV.ghlLocationId;
  const params = new URLSearchParams({
    locationId,
  });
  if (opts?.query) params.set("q", opts.query);
  if (opts?.limit) params.set("limit", opts.limit.toString());

  try {
    const response = await fetch(`${GHL_API_BASE}/conversations/search?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ENV.ghlApiKey}`,
        Version: GHL_API_VERSION,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[GHL Conversations] Search failed (${response.status}): ${errorText}`);
      return { success: false, error: `GHL API error: ${response.status}` };
    }

    const data = await response.json();
    return {
      success: true,
      conversations: data.conversations || [],
      total: data.total || 0,
    };
  } catch (error) {
    console.error("[GHL Conversations] Search error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Get a specific conversation by ID
 */
export async function getConversation(conversationId: string): Promise<{
  success: boolean;
  conversation?: GHLConversation;
  error?: string;
}> {
  if (!ENV.ghlApiKey) {
    return { success: false, error: "GHL API key not configured" };
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/conversations/${conversationId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ENV.ghlApiKey}`,
        Version: GHL_API_VERSION,
      },
    });

    if (!response.ok) {
      return { success: false, error: `GHL API error: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, conversation: data.conversation || data };
  } catch (error) {
    console.error("[GHL Conversations] Get error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Get messages for a conversation
 */
export async function getConversationMessages(conversationId: string, opts?: {
  limit?: number;
  lastMessageId?: string;
}): Promise<{
  success: boolean;
  messages?: GHLMessage[];
  error?: string;
}> {
  if (!ENV.ghlApiKey) {
    return { success: false, error: "GHL API key not configured" };
  }

  const params = new URLSearchParams();
  if (opts?.limit) params.set("limit", opts.limit.toString());
  if (opts?.lastMessageId) params.set("lastMessageId", opts.lastMessageId);

  try {
    const url = `${GHL_API_BASE}/conversations/${conversationId}/messages${params.toString() ? "?" + params.toString() : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ENV.ghlApiKey}`,
        Version: GHL_API_VERSION,
      },
    });

    if (!response.ok) {
      return { success: false, error: `GHL API error: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, messages: data.messages || data.data || [] };
  } catch (error) {
    console.error("[GHL Conversations] Messages error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Get recent contacts from GHL (for seeing who commented)
 */
export async function getRecentContacts(opts?: {
  limit?: number;
  query?: string;
}): Promise<{
  success: boolean;
  contacts?: GHLContact[];
  total?: number;
  error?: string;
}> {
  if (!ENV.ghlApiKey || !ENV.ghlLocationId) {
    return { success: false, error: "GHL credentials not configured" };
  }

  const params = new URLSearchParams({
    locationId: ENV.ghlLocationId,
    limit: (opts?.limit || 20).toString(),
  });
  if (opts?.query) params.set("query", opts.query);

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ENV.ghlApiKey}`,
        Version: GHL_API_VERSION,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[GHL Contacts] Fetch failed (${response.status}): ${errorText}`);
      return { success: false, error: `GHL API error: ${response.status}` };
    }

    const data = await response.json();
    return {
      success: true,
      contacts: data.contacts || [],
      total: data.meta?.total || data.total || 0,
    };
  } catch (error) {
    console.error("[GHL Contacts] Fetch error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Get a specific contact by ID
 */
export async function getContact(contactId: string): Promise<{
  success: boolean;
  contact?: GHLContact;
  error?: string;
}> {
  if (!ENV.ghlApiKey) {
    return { success: false, error: "GHL API key not configured" };
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ENV.ghlApiKey}`,
        Version: GHL_API_VERSION,
      },
    });

    if (!response.ok) {
      return { success: false, error: `GHL API error: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, contact: data.contact || data };
  } catch (error) {
    console.error("[GHL Contacts] Get error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
