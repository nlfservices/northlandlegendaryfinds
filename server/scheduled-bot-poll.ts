/**
 * Scheduled endpoint for the Facebook comment bot polling job.
 * Called by Heartbeat cron every 5 minutes to check for new comments
 * on all monitored Facebook posts and trigger auto-replies.
 *
 * POST /api/scheduled/bot-poll-comments
 *
 * Auth: cron caller (isCron=true) OR admin
 *
 * This is the heart of the fully-automated comment bot:
 * 1. Fetch comments on all registered FB posts
 * 2. For each new comment, generate an AI reply
 * 3. In 'auto' mode: post reply immediately
 *    In 'review' mode: queue for admin approval
 */

import type { Express, Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { pollAllMonitoredPosts } from "./bot-post-monitor";

export function registerBotPollScheduledRoute(app: Express) {
  app.post("/api/scheduled/bot-poll-comments", async (req: Request, res: Response) => {
    try {
      // Authenticate: accept cron callers or admin users
      const user = await sdk.authenticateRequest(req);
      if (!(user as any).isCron && (user as any).role !== "admin") {
        return res.status(403).json({ error: "cron-or-admin-only" });
      }

      console.log("[BotPoll] Starting comment poll...");
      const result = await pollAllMonitoredPosts();

      console.log(
        `[BotPoll] Complete: ${result.postsChecked} posts, ` +
        `${result.newComments} new comments, ` +
        `${result.repliesSent} replied, ${result.repliesQueued} queued`
      );

      res.json({
        ok: true,
        postsChecked: result.postsChecked,
        newComments: result.newComments,
        repliesSent: result.repliesSent,
        repliesQueued: result.repliesQueued,
        errors: result.errors.length > 0 ? result.errors : undefined,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("[BotPoll] Error:", err);
      res.status(500).json({
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        context: { url: req.url },
        timestamp: new Date().toISOString(),
      });
    }
  });
}
