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
