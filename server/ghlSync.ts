/**
 * GoHighLevel CRM Sync Service
 * Syncs new users to GHL as contacts when they register
 * Non-blocking — failures are logged but never throw to callers
 */
import type { User } from "../drizzle/schema";
import { ENV } from "./_core/env";

const GHL_API_BASE = "https://services.leadconnectorhq.com";

interface GHLContactPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  source?: string;
  tags?: string[];
  customField?: Record<string, string>;
}

/**
 * Create or update a contact in GoHighLevel CRM
 */
async function createOrUpdateContact(payload: GHLContactPayload): Promise<{ id: string } | null> {
  if (!ENV.ghlApiKey || !ENV.ghlLocationId) {
    console.warn("[GHL] API key or location ID not configured — skipping sync");
    return null;
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ENV.ghlApiKey}`,
        "Content-Type": "application/json",
        "Version": "2021-07-28",
      },
      body: JSON.stringify({
        ...payload,
        locationId: ENV.ghlLocationId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[GHL] Failed to create contact (${response.status}): ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log(`[GHL] Contact synced successfully: ${data.contact?.id ?? "unknown"}`);
    return { id: data.contact?.id ?? "" };
  } catch (error) {
    console.error("[GHL] Error syncing contact:", error);
    return null;
  }
}

/**
 * Sync a new user to GoHighLevel CRM
 * Called after successful OAuth registration
 */
export async function syncUserToGHL(user: User): Promise<void> {
  const nameParts = (user.name ?? "").split(" ");
  const firstName = nameParts[0] || "Unknown";
  const lastName = nameParts.slice(1).join(" ") || "";

  await createOrUpdateContact({
    firstName,
    lastName,
    email: user.email ?? undefined,
    source: "Northland Legendary Finds Website",
    tags: ["website_signup", user.role ?? "free"],
    customField: {
      login_method: user.loginMethod ?? "unknown",
      signup_date: new Date().toISOString(),
      user_id: String(user.id),
    },
  });
}

/**
 * Update a contact's tags when their role changes
 */
export async function updateGHLContactRole(user: User, newRole: string): Promise<void> {
  if (!ENV.ghlApiKey || !ENV.ghlLocationId) return;

  // First search for the contact by email
  if (!user.email) return;

  try {
    const searchResponse = await fetch(
      `${GHL_API_BASE}/contacts/search/duplicate?locationId=${ENV.ghlLocationId}&email=${encodeURIComponent(user.email)}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${ENV.ghlApiKey}`,
          "Version": "2021-07-28",
        },
      }
    );

    if (!searchResponse.ok) return;

    const searchData = await searchResponse.json();
    const contactId = searchData.contact?.id;
    if (!contactId) return;

    // Update the contact's tags
    await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${ENV.ghlApiKey}`,
        "Content-Type": "application/json",
        "Version": "2021-07-28",
      },
      body: JSON.stringify({
        tags: ["website_signup", newRole],
      }),
    });

    console.log(`[GHL] Contact role updated to ${newRole} for ${user.email}`);
  } catch (error) {
    console.error("[GHL] Error updating contact role:", error);
  }
}
