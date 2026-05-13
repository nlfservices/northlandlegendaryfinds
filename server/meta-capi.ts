/**
 * Meta Conversions API (CAPI) — Server-Side Event Tracking
 *
 * Sends events directly from the server to Meta's Graph API,
 * complementing the browser-side Pixel (ID: 839598775754379).
 * This improves attribution, survives ad blockers, and is privacy-compliant.
 *
 * Events are deduplicated with the browser Pixel via event_id.
 */

import crypto from "crypto";

const API_VERSION = "v25.0";

function getPixelId(): string {
  return process.env.META_PIXEL_ID || "839598775754379";
}

function getAccessToken(): string {
  return process.env.META_CAPI_ACCESS_TOKEN || "";
}

function getGraphUrl(): string {
  return `https://graph.facebook.com/${API_VERSION}/${getPixelId()}/events`;
}

function getTestEventCode(): string {
  return process.env.META_TEST_EVENT_CODE || "";
}

/**
 * Hash user data for Meta's required SHA-256 format
 */
function hashUserData(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/**
 * Generate a unique event ID for deduplication with browser Pixel
 */
export function generateEventId(): string {
  return `nlf_${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;
}

/**
 * Core event sender — sends events to Meta's Conversions API
 */
async function sendEvent(eventData: MetaEvent): Promise<{ success: boolean; error?: string }> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    console.log("[Meta CAPI] No access token configured — skipping server-side event");
    return { success: false, error: "No META_CAPI_ACCESS_TOKEN configured" };
  }

  const payload: any = {
    data: [eventData],
  };

  // Add test event code if configured (for debugging in Meta Events Manager)
  const testCode = getTestEventCode();
  if (testCode) {
    payload.test_event_code = testCode;
  }

  try {
    const response = await fetch(getGraphUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        access_token: accessToken,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[Meta CAPI] Error:", JSON.stringify(result));
      return { success: false, error: result.error?.message || "Unknown error" };
    }

    console.log(`[Meta CAPI] Event sent: ${eventData.event_name} (ID: ${eventData.event_id})`);
    return { success: true };
  } catch (err: any) {
    console.error("[Meta CAPI] Network error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Meta event data structure
 */
interface MetaEvent {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url?: string;
  action_source: "website";
  user_data: {
    client_ip_address?: string;
    client_user_agent?: string;
    em?: string[];  // hashed email
    fn?: string[];  // hashed first name
    fbc?: string;   // Facebook click ID from _fbc cookie
    fbp?: string;   // Facebook browser ID from _fbp cookie
    external_id?: string[];
  };
  custom_data?: Record<string, any>;
}

/**
 * Build user data object from request context
 */
function buildUserData(opts: {
  ip?: string;
  userAgent?: string;
  email?: string;
  firstName?: string;
  userId?: string;
  fbc?: string;
  fbp?: string;
}): MetaEvent["user_data"] {
  const userData: MetaEvent["user_data"] = {};

  if (opts.ip) userData.client_ip_address = opts.ip;
  if (opts.userAgent) userData.client_user_agent = opts.userAgent;
  if (opts.email) userData.em = [hashUserData(opts.email)];
  if (opts.firstName) userData.fn = [hashUserData(opts.firstName)];
  if (opts.userId) userData.external_id = [hashUserData(opts.userId)];
  if (opts.fbc) userData.fbc = opts.fbc;
  if (opts.fbp) userData.fbp = opts.fbp;

  return userData;
}

// ============================================================
// PUBLIC API — Call these from tRPC procedures or Express routes
// ============================================================

interface TrackingContext {
  ip?: string;
  userAgent?: string;
  email?: string;
  firstName?: string;
  userId?: string;
  fbc?: string;
  fbp?: string;
  sourceUrl?: string;
  eventId?: string;
}

/**
 * Track PageView — fires on every page load (server-side complement to browser Pixel)
 */
export async function trackPageView(ctx: TrackingContext) {
  return sendEvent({
    event_name: "PageView",
    event_time: Math.floor(Date.now() / 1000),
    event_id: ctx.eventId || generateEventId(),
    event_source_url: ctx.sourceUrl,
    action_source: "website",
    user_data: buildUserData(ctx),
  });
}

/**
 * Track ViewContent — when a user views a product or article
 */
export async function trackViewContent(ctx: TrackingContext, data: {
  contentName: string;
  contentId: string;
  contentType?: string;
  value?: number;
  currency?: string;
}) {
  return sendEvent({
    event_name: "ViewContent",
    event_time: Math.floor(Date.now() / 1000),
    event_id: ctx.eventId || generateEventId(),
    event_source_url: ctx.sourceUrl,
    action_source: "website",
    user_data: buildUserData(ctx),
    custom_data: {
      content_name: data.contentName,
      content_ids: [data.contentId],
      content_type: data.contentType || "product",
      value: data.value || 0,
      currency: data.currency || "USD",
    },
  });
}

/**
 * Track Lead — when a user signs up for newsletter, giveaway, etc.
 */
export async function trackLead(ctx: TrackingContext, data: {
  contentName: string;
  contentCategory?: string;
}) {
  return sendEvent({
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    event_id: ctx.eventId || generateEventId(),
    event_source_url: ctx.sourceUrl,
    action_source: "website",
    user_data: buildUserData(ctx),
    custom_data: {
      content_name: data.contentName,
      content_category: data.contentCategory || "General",
    },
  });
}

/**
 * Track AddToCart — when a user adds a product to cart
 */
export async function trackAddToCart(ctx: TrackingContext, data: {
  contentName: string;
  contentId: string;
  value: number;
  quantity?: number;
  currency?: string;
}) {
  return sendEvent({
    event_name: "AddToCart",
    event_time: Math.floor(Date.now() / 1000),
    event_id: ctx.eventId || generateEventId(),
    event_source_url: ctx.sourceUrl,
    action_source: "website",
    user_data: buildUserData(ctx),
    custom_data: {
      content_name: data.contentName,
      content_ids: [data.contentId],
      content_type: "product",
      value: data.value,
      currency: data.currency || "USD",
      num_items: data.quantity || 1,
    },
  });
}

/**
 * Track InitiateCheckout — when a user starts checkout
 */
export async function trackInitiateCheckout(ctx: TrackingContext, data: {
  value: number;
  numItems: number;
  currency?: string;
}) {
  return sendEvent({
    event_name: "InitiateCheckout",
    event_time: Math.floor(Date.now() / 1000),
    event_id: ctx.eventId || generateEventId(),
    event_source_url: ctx.sourceUrl,
    action_source: "website",
    user_data: buildUserData(ctx),
    custom_data: {
      value: data.value,
      currency: data.currency || "USD",
      num_items: data.numItems,
    },
  });
}

/**
 * Track Purchase — when a payment is completed
 */
export async function trackPurchase(ctx: TrackingContext, data: {
  value: number;
  orderId: string;
  numItems: number;
  currency?: string;
  contentIds?: string[];
}) {
  return sendEvent({
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: ctx.eventId || generateEventId(),
    event_source_url: ctx.sourceUrl,
    action_source: "website",
    user_data: buildUserData(ctx),
    custom_data: {
      value: data.value,
      currency: data.currency || "USD",
      content_type: "product",
      num_items: data.numItems,
      content_ids: data.contentIds || [data.orderId],
      order_id: data.orderId,
    },
  });
}

/**
 * Track Search — when a user searches the card database
 */
export async function trackSearch(ctx: TrackingContext, data: {
  searchString: string;
}) {
  return sendEvent({
    event_name: "Search",
    event_time: Math.floor(Date.now() / 1000),
    event_id: ctx.eventId || generateEventId(),
    event_source_url: ctx.sourceUrl,
    action_source: "website",
    user_data: buildUserData(ctx),
    custom_data: {
      search_string: data.searchString,
    },
  });
}

/**
 * Track custom events (e.g., WhatnotReferralClick, GiveawayEntry)
 */
export async function trackCustomEvent(ctx: TrackingContext, eventName: string, customData?: Record<string, any>) {
  return sendEvent({
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: ctx.eventId || generateEventId(),
    event_source_url: ctx.sourceUrl,
    action_source: "website",
    user_data: buildUserData(ctx),
    custom_data: customData,
  });
}

/**
 * Express middleware to extract tracking context from request
 */
export function extractTrackingContext(req: any): TrackingContext {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || req.connection?.remoteAddress;
  const userAgent = req.headers["user-agent"] || "";

  // Extract Facebook cookies if present
  const cookies = req.headers.cookie || "";
  const fbcMatch = cookies.match(/_fbc=([^;]+)/);
  const fbpMatch = cookies.match(/_fbp=([^;]+)/);

  return {
    ip,
    userAgent,
    fbc: fbcMatch?.[1],
    fbp: fbpMatch?.[1],
  };
}
