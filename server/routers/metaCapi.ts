import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  trackPageView,
  trackViewContent,
  trackLead,
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase,
  trackSearch,
  trackCustomEvent,
  extractTrackingContext,
} from "../meta-capi";

/**
 * Meta Conversions API Router
 * Receives events from the frontend and forwards them server-side to Meta
 * Each event includes an eventId for deduplication with the browser Pixel
 */
export const metaCapiRouter = router({
  /**
   * Track a server-side event — generic endpoint for all event types
   */
  trackEvent: publicProcedure
    .input(z.object({
      eventName: z.string(),
      eventId: z.string(),
      sourceUrl: z.string().optional(),
      email: z.string().optional(),
      firstName: z.string().optional(),
      customData: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const trackingCtx = {
        ...extractTrackingContext(ctx.req),
        email: input.email,
        firstName: input.firstName,
        userId: ctx.user?.id?.toString(),
        sourceUrl: input.sourceUrl,
        eventId: input.eventId,
      };

      const cd: Record<string, any> = input.customData || {};

      switch (input.eventName) {
        case "PageView":
          return trackPageView(trackingCtx);

        case "ViewContent":
          return trackViewContent(trackingCtx, {
            contentName: String(cd.content_name || ""),
            contentId: String(Array.isArray(cd.content_ids) ? cd.content_ids[0] : ""),
            contentType: cd.content_type ? String(cd.content_type) : undefined,
            value: cd.value ? Number(cd.value) : undefined,
            currency: cd.currency ? String(cd.currency) : undefined,
          });

        case "Lead":
          return trackLead(trackingCtx, {
            contentName: String(cd.content_name || ""),
            contentCategory: cd.content_category ? String(cd.content_category) : undefined,
          });

        case "AddToCart":
          return trackAddToCart(trackingCtx, {
            contentName: String(cd.content_name || ""),
            contentId: String(Array.isArray(cd.content_ids) ? cd.content_ids[0] : ""),
            value: Number(cd.value || 0),
            quantity: cd.num_items ? Number(cd.num_items) : undefined,
            currency: cd.currency ? String(cd.currency) : undefined,
          });

        case "InitiateCheckout":
          return trackInitiateCheckout(trackingCtx, {
            value: Number(cd.value || 0),
            numItems: Number(cd.num_items || 1),
            currency: cd.currency ? String(cd.currency) : undefined,
          });

        case "Purchase":
          return trackPurchase(trackingCtx, {
            value: Number(cd.value || 0),
            orderId: String(cd.order_id || ""),
            numItems: Number(cd.num_items || 1),
            currency: cd.currency ? String(cd.currency) : undefined,
            contentIds: Array.isArray(cd.content_ids) ? cd.content_ids.map(String) : undefined,
          });

        case "Search":
          return trackSearch(trackingCtx, {
            searchString: String(cd.search_string || ""),
          });

        default:
          return trackCustomEvent(trackingCtx, input.eventName, cd);
      }
    }),
});
