/**
 * GoHighLevel API integration
 * Uses Private Integration Token for contact management
 */
import { ENV } from "./_core/env";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

export type GHLContactInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  tags?: string[];
  source?: string;
};

export type GHLContactResponse = {
  contact: {
    id: string;
    locationId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    tags?: string[];
    source?: string;
    dateAdded?: string;
  };
};

/**
 * Create a contact in GoHighLevel CRM
 * Handles duplicate detection — GHL returns 422 if contact with same email exists
 */
export async function createGHLContact(
  input: GHLContactInput
): Promise<{ success: boolean; contactId?: string; error?: string; isDuplicate?: boolean }> {
  if (!ENV.ghlApiKey) {
    console.warn("[GHL] API key not configured");
    return { success: false, error: "GHL API key not configured" };
  }

  if (!ENV.ghlLocationId) {
    console.warn("[GHL] Location ID not configured");
    return { success: false, error: "GHL Location ID not configured" };
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${ENV.ghlApiKey}`,
        Version: GHL_API_VERSION,
      },
      body: JSON.stringify({
        email: input.email,
        firstName: input.firstName || undefined,
        lastName: input.lastName || undefined,
        name: input.name || undefined,
        phone: input.phone || undefined,
        locationId: ENV.ghlLocationId,
        tags: input.tags || ["website-subscriber"],
        source: input.source || "NLF Website",
        country: "US",
      }),
    });

    if (response.status === 422) {
      // Contact already exists (duplicate email)
      console.log(`[GHL] Contact already exists for email: ${input.email}`);
      return { success: true, isDuplicate: true };
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `[GHL] Failed to create contact (${response.status}): ${errorText}`
      );
      return {
        success: false,
        error: `GHL API error: ${response.status} ${response.statusText}`,
      };
    }

    const data = (await response.json()) as GHLContactResponse;
    console.log(`[GHL] Contact created: ${data.contact?.id} for ${input.email}`);

    return {
      success: true,
      contactId: data.contact?.id,
    };
  } catch (error) {
    console.error("[GHL] Error creating contact:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get a contact by ID with full details
 */
export async function getGHLContact(
  contactId: string
): Promise<{ success: boolean; contact?: any; error?: string }> {
  if (!ENV.ghlApiKey) {
    return { success: false, error: "GHL credentials not configured" };
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
      return { success: false, error: `Get contact failed: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, contact: data.contact };
  } catch (error) {
    console.error("[GHL] Error getting contact:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Update a contact in GoHighLevel
 */
export async function updateGHLContact(
  contactId: string,
  updates: Partial<GHLContactInput> & { customFields?: Record<string, any> }
): Promise<{ success: boolean; error?: string }> {
  if (!ENV.ghlApiKey) {
    return { success: false, error: "GHL credentials not configured" };
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${ENV.ghlApiKey}`,
        Version: GHL_API_VERSION,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return { success: false, error: `Update failed: ${response.status} ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    console.error("[GHL] Error updating contact:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Add tags to a contact
 */
export async function addGHLContactTags(
  contactId: string,
  tags: string[]
): Promise<{ success: boolean; error?: string }> {
  if (!ENV.ghlApiKey) {
    return { success: false, error: "GHL credentials not configured" };
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${ENV.ghlApiKey}`,
        Version: GHL_API_VERSION,
      },
      body: JSON.stringify({ tags }),
    });

    if (!response.ok) {
      return { success: false, error: `Add tags failed: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error("[GHL] Error adding tags:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Remove tags from a contact
 */
export async function removeGHLContactTags(
  contactId: string,
  tags: string[]
): Promise<{ success: boolean; error?: string }> {
  if (!ENV.ghlApiKey) {
    return { success: false, error: "GHL credentials not configured" };
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${ENV.ghlApiKey}`,
        Version: GHL_API_VERSION,
      },
      body: JSON.stringify({ tags }),
    });

    if (!response.ok) {
      return { success: false, error: `Remove tags failed: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error("[GHL] Error removing tags:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Add a note to a contact
 */
export async function addGHLContactNote(
  contactId: string,
  body: string
): Promise<{ success: boolean; noteId?: string; error?: string }> {
  if (!ENV.ghlApiKey) {
    return { success: false, error: "GHL credentials not configured" };
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${ENV.ghlApiKey}`,
        Version: GHL_API_VERSION,
      },
      body: JSON.stringify({ body, userId: "system" }),
    });

    if (!response.ok) {
      return { success: false, error: `Add note failed: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, noteId: data.note?.id };
  } catch (error) {
    console.error("[GHL] Error adding note:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Get notes for a contact
 */
export async function getGHLContactNotes(
  contactId: string
): Promise<{ success: boolean; notes?: any[]; error?: string }> {
  if (!ENV.ghlApiKey) {
    return { success: false, error: "GHL credentials not configured" };
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ENV.ghlApiKey}`,
        Version: GHL_API_VERSION,
      },
    });

    if (!response.ok) {
      return { success: false, error: `Get notes failed: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, notes: data.notes || [] };
  } catch (error) {
    console.error("[GHL] Error getting notes:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * List contacts with optional filters
 */
export async function listGHLContacts(opts?: {
  limit?: number;
  offset?: number;
  query?: string;
  tag?: string;
}): Promise<{ success: boolean; contacts?: any[]; total?: number; error?: string }> {
  if (!ENV.ghlApiKey || !ENV.ghlLocationId) {
    return { success: false, error: "GHL credentials not configured" };
  }

  const params = new URLSearchParams({
    locationId: ENV.ghlLocationId,
  });
  if (opts?.limit) params.set("limit", opts.limit.toString());
  if (opts?.offset) params.set("skip", opts.offset.toString());
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
      return { success: false, error: `List contacts failed: ${response.status}` };
    }

    const data = await response.json();
    let contacts = data.contacts || [];

    // Client-side tag filtering if needed
    if (opts?.tag) {
      contacts = contacts.filter((c: any) => c.tags?.includes(opts.tag));
    }

    return { success: true, contacts, total: data.meta?.total || contacts.length };
  } catch (error) {
    console.error("[GHL] Error listing contacts:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Trigger a GHL workflow for a contact
 */
export async function triggerGHLWorkflow(
  workflowId: string,
  contactId: string
): Promise<{ success: boolean; error?: string }> {
  if (!ENV.ghlApiKey) {
    return { success: false, error: "GHL credentials not configured" };
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}/workflow/${workflowId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${ENV.ghlApiKey}`,
        Version: GHL_API_VERSION,
      },
      body: JSON.stringify({ eventStartTime: new Date().toISOString() }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return { success: false, error: `Trigger workflow failed: ${response.status} ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    console.error("[GHL] Error triggering workflow:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Search for an existing contact by email in GoHighLevel
 */
export async function searchGHLContact(
  email: string
): Promise<{ found: boolean; contactId?: string; error?: string }> {
  if (!ENV.ghlApiKey || !ENV.ghlLocationId) {
    return { found: false, error: "GHL credentials not configured" };
  }

  try {
    const params = new URLSearchParams({
      locationId: ENV.ghlLocationId,
      query: email,
    });

    const response = await fetch(
      `${GHL_API_BASE}/contacts/search/duplicate?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ENV.ghlApiKey}`,
          Version: GHL_API_VERSION,
        },
      }
    );

    if (!response.ok) {
      return { found: false, error: `Search failed: ${response.status}` };
    }

    const data = await response.json();
    const contact = data?.contact;

    if (contact?.id) {
      return { found: true, contactId: contact.id };
    }

    return { found: false };
  } catch (error) {
    console.error("[GHL] Error searching contact:", error);
    return {
      found: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
