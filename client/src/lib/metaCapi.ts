/**
 * Meta Conversions API — Frontend Hook
 *
 * Fires BOTH the browser-side Pixel event AND sends a server-side event
 * via the tRPC endpoint. Events are deduplicated using a shared event_id.
 *
 * Usage:
 *   import { useMetaTracking } from "@/lib/metaCapi";
 *   const { trackEvent } = useMetaTracking();
 *   trackEvent("ViewContent", { content_name: "...", content_ids: ["..."] });
 */

import { trpc } from "@/lib/trpc";

declare global {
  interface Window {
    fbq: any;
  }
}

/**
 * Generate a unique event ID for deduplication between browser Pixel and server CAPI
 */
function generateEventId(): string {
  return `nlf_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * Check if browser Pixel is loaded
 */
function isFBPixelLoaded(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

/**
 * Fire browser-side Pixel event with event_id for deduplication
 */
function fireBrowserEvent(eventName: string, customData?: Record<string, any>, eventId?: string) {
  if (!isFBPixelLoaded()) return;

  const options = eventId ? { eventID: eventId } : undefined;

  // Standard events use 'track', custom events use 'trackCustom'
  const standardEvents = [
    "PageView", "ViewContent", "AddToCart", "InitiateCheckout",
    "AddPaymentInfo", "Purchase", "Lead", "Search", "Contact",
    "CompleteRegistration", "Subscribe",
  ];

  if (standardEvents.includes(eventName)) {
    if (customData) {
      window.fbq("track", eventName, customData, options);
    } else {
      window.fbq("track", eventName, {}, options);
    }
  } else {
    if (customData) {
      window.fbq("trackCustom", eventName, customData, options);
    } else {
      window.fbq("trackCustom", eventName, {}, options);
    }
  }
}

/**
 * Hook for Meta tracking — fires both browser Pixel and server-side CAPI
 */
export function useMetaTracking() {
  const trackMutation = trpc.metaCapi.trackEvent.useMutation();

  const trackEvent = (
    eventName: string,
    customData?: Record<string, any>,
    opts?: { email?: string; firstName?: string }
  ) => {
    const eventId = generateEventId();
    const sourceUrl = typeof window !== "undefined" ? window.location.href : undefined;

    // 1. Fire browser-side Pixel (immediate, no network delay)
    fireBrowserEvent(eventName, customData, eventId);

    // 2. Fire server-side CAPI (async, non-blocking)
    trackMutation.mutate({
      eventName,
      eventId,
      sourceUrl,
      email: opts?.email,
      firstName: opts?.firstName,
      customData,
    });
  };

  return { trackEvent };
}

/**
 * Non-hook version for use outside React components (e.g., in event handlers)
 * Only fires the browser Pixel — server-side requires the tRPC mutation
 */
export function trackBrowserOnly(eventName: string, customData?: Record<string, any>) {
  const eventId = generateEventId();
  fireBrowserEvent(eventName, customData, eventId);
  return eventId;
}
