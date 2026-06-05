/**
 * Facebook Webhook — Comment Notification Handler
 *
 * Receives real-time comment notifications from Facebook via the
 * Webhooks API. Two endpoints:
 *
 *   GET /api/facebook/webhook  — Verification challenge (one-time setup)
 *   POST /api/facebook/webhook — Incoming comment events
 *
 * Setup instructions (after deploy):
 * 1. Go to Facebook Developer Console → Your App → Webhooks
 * 2. Subscribe to the "page" object
 * 3. Set callback URL to: https://northlandlegendaryfinds.com/api/facebook/webhook
 * 4. Set verify token to the value of FACEBOOK_WEBHOOK_VERIFY_TOKEN env var
 * 5. Subscribe to the "comments" field
 *
 * The webhook will then fire for every new comment on any NLF page post.
 */

import type { Express, Request, Response } from "express";
import { processComment } from "./bot-reply-generator";
import { getDb } from "./db";
import { botSettings } from "../drizzle/schema";

/**
 * Get the webhook verify token from env.
 * Falls back to a default if not set (should be set in production).
 */
function getVerifyToken(): string {
  return process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN || "nlf_webhook_verify_2026";
}

/**
 * Get the page ID from env.
 */
function getPageId(): string {
  return process.env.FB_PAGE_ID || "";
}

export function registerFacebookWebhook(app: Express) {
  /**
   * GET /api/facebook/webhook
   * Facebook calls this once to verify the webhook endpoint.
   * Must respond with hub.challenge if the verify token matches.
   */
  app.get("/api/facebook/webhook", (req: Request, res: Response) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === getVerifyToken()) {
      console.log("[FB Webhook] Verification successful");
      return res.status(200).send(challenge);
    }

    console.warn("[FB Webhook] Verification failed — token mismatch");
    return res.status(403).json({ error: "Verification failed" });
  });

  /**
   * POST /api/facebook/webhook
   * Facebook sends comment events here in real time.
   * We process each comment asynchronously (fire and forget)
   * so we can return 200 quickly and avoid Facebook retries.
   */
  app.post("/api/facebook/webhook", async (req: Request, res: Response) => {
    // Always return 200 immediately to prevent Facebook from retrying
    res.status(200).json({ ok: true });

    try {
      const body = req.body;

      // Validate this is a page subscription
      if (body.object !== "page") {
        console.log("[FB Webhook] Ignoring non-page event:", body.object);
        return;
      }

      // Check if bot is enabled before processing
      const db = await getDb();
      if (db) {
        const settings = await db.select().from(botSettings).limit(1);
        if (settings.length > 0 && !settings[0].enabled) {
          console.log("[FB Webhook] Bot is disabled, ignoring comment event");
          return;
        }
      }

      // Process each entry in the webhook payload
      const entries: any[] = body.entry || [];
      for (const entry of entries) {
        const pageId = entry.id;

        // Only process events for our page
        if (getPageId() && pageId !== getPageId()) {
          console.log(`[FB Webhook] Ignoring event for page ${pageId} (not our page)`);
          continue;
        }

        const changes: any[] = entry.changes || [];
        for (const change of changes) {
          // We care about comment events
          if (change.field !== "feed") continue;

          const value = change.value;

          // Filter to comment events only
          if (value.item !== "comment") continue;

          // Skip our own page's comments (don't reply to ourselves)
          if (value.from?.id === pageId) {
            console.log("[FB Webhook] Skipping own page comment");
            continue;
          }

          // Skip comment deletions and edits (only process new comments)
          if (value.verb !== "add") {
            console.log(`[FB Webhook] Skipping ${value.verb} event`);
            continue;
          }

          const commentId = value.comment_id;
          const postId = value.post_id;
          const commenterName = value.from?.name || "Anonymous";
          const commentText = value.message || "";
          const commentedAt = value.created_time
            ? new Date(value.created_time * 1000)
            : new Date();

          if (!commentId || !commentText) {
            console.log("[FB Webhook] Skipping comment with missing data");
            continue;
          }

          console.log(
            `[FB Webhook] New comment from ${commenterName}: "${commentText.slice(0, 50)}..."`
          );

          // Process asynchronously — don't await (already sent 200)
          processComment({
            fbPostId: postId,
            fbCommentId: commentId,
            commenterName,
            commentText,
            commentedAt,
          }).then(result => {
            console.log(
              `[FB Webhook] Comment ${commentId} processed: ${result.action}`
            );
          }).catch(err => {
            console.error("[FB Webhook] Error processing comment:", err.message);
          });
        }
      }
    } catch (err: any) {
      console.error("[FB Webhook] Error handling webhook:", err.message);
    }
  });
}
