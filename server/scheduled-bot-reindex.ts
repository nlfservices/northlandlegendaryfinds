/**
 * Scheduled endpoint for the Facebook bot content re-indexer.
 * Called by Heartbeat cron every 2 hours to keep the knowledge base fresh.
 *
 * POST /api/scheduled/bot-reindex
 *
 * Auth: cron caller (isCron=true) OR admin
 */

import type { Express, Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { indexAllArticles } from "./bot-content-indexer";

export function registerBotReindexScheduledRoute(app: Express) {
  app.post("/api/scheduled/bot-reindex", async (req: Request, res: Response) => {
    try {
      // Authenticate: accept cron callers or admin users
      const user = await sdk.authenticateRequest(req);
      if (!(user as any).isCron && (user as any).role !== "admin") {
        return res.status(403).json({ error: "cron-or-admin-only" });
      }

      console.log("[BotReindex] Starting content re-index...");
      const result = await indexAllArticles();

      console.log(
        `[BotReindex] Complete: ${result.indexed} indexed, ${result.skipped} skipped`
      );

      res.json({
        ok: true,
        indexed: result.indexed,
        skipped: result.skipped,
        errors: result.errors,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("[BotReindex] Error:", err);
      res.status(500).json({
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        context: { url: req.url },
        timestamp: new Date().toISOString(),
      });
    }
  });
}
