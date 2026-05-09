/**
 * Scheduled endpoint for card shows weekly update.
 * Called by AGENT cron to:
 * 1. Mark past shows as "past"
 * 2. Add new shows discovered by the agent
 */
import type { Express, Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { getDb } from "./db";
import { cardShows } from "../drizzle/schema";
import { eq, lt, and } from "drizzle-orm";

export function registerCardShowsScheduledRoute(app: Express) {
  app.post("/api/scheduled/card-shows-update", async (req: Request, res: Response) => {
    try {
      // Authenticate the cron caller
      const user = await sdk.authenticateRequest(req);
      if (!(user as any).isCron && (user as any).role !== "admin") {
        return res.status(403).json({ error: "cron-or-admin-only" });
      }

      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database not available" });
      const { action, shows } = req.body;

      // Action 1: Mark past shows
      if (action === "mark-past" || action === "full-update") {
        const today = new Date().toISOString().split("T")[0];
        const result = await db
          .update(cardShows)
          .set({ status: "past" })
          .where(
            and(
              lt(cardShows.endDate, today),
              eq(cardShows.status, "upcoming")
            )
          );
        console.log(`[Card Shows Cron] Marked past shows (endDate < ${today})`);
      }

      // Action 2: Add new shows
      if ((action === "add-shows" || action === "full-update") && Array.isArray(shows) && shows.length > 0) {
        let inserted = 0;
        for (const show of shows) {
          try {
            // Generate slug from city-state-name
            const slug = [show.city, show.state, show.name]
              .join("-")
              .toLowerCase()
              .replace(/[^a-z0-9-]/g, "-")
              .replace(/-+/g, "-")
              .replace(/^-|-$/g, "")
              .slice(0, 490);

            await db.insert(cardShows).values({
              name: show.name,
              slug: slug + "-" + Date.now().toString(36),
              dateDisplay: show.dateDisplay,
              startDate: show.startDate,
              endDate: show.endDate,
              month: show.month,
              venue: show.venue || null,
              address: show.address || null,
              city: show.city,
              state: show.state,
              stateName: show.stateName,
              hours: show.hours || null,
              tableCount: show.tableCount || null,
              admission: show.admission || null,
              isFree: show.isFree || false,
              email: show.email || null,
              phone: show.phone || null,
              website: show.website || null,
              featured: show.featured || false,
              status: "upcoming",
              source: show.source || "agent-cron",
            });
            inserted++;
          } catch (err: any) {
            // Skip duplicates (unique slug constraint)
            if (err.code === "ER_DUP_ENTRY") {
              console.log(`[Card Shows Cron] Skipped duplicate: ${show.name}`);
            } else {
              console.error(`[Card Shows Cron] Error inserting show:`, err.message);
            }
          }
        }
        console.log(`[Card Shows Cron] Inserted ${inserted} new shows`);
      }

      res.json({ ok: true, timestamp: new Date().toISOString() });
    } catch (err: any) {
      console.error("[Card Shows Cron] Error:", err);
      res.status(500).json({
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        context: { url: req.url },
        timestamp: new Date().toISOString(),
      });
    }
  });
}
