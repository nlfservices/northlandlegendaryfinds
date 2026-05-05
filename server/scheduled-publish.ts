/**
 * Scheduled task endpoint for publishing articles at a specific time.
 * POST /api/scheduled/publish-article
 * Body: { slug: string, setFeatured?: boolean }
 * Auth: requires valid session cookie (user role allowed for scheduled tasks)
 */
import { Express, Request, Response } from "express";
import { sdk } from "./_core/sdk";
import * as db from "./db";

export function registerScheduledPublishRoute(app: Express) {
  app.post("/api/scheduled/publish-article", async (req: Request, res: Response) => {
    try {
      // Authenticate the request
      const user = await sdk.authenticateRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Allow user role (scheduled tasks get user role)
      if (user.role !== "user" && user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }

      const { slug, setFeatured } = req.body;
      if (!slug) {
        return res.status(400).json({ error: "slug is required" });
      }

      // Publish the article
      const { getDb } = await import("./db");
      const mysql = await import("mysql2/promise");
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);

      // If setFeatured, clear other featured articles first
      if (setFeatured) {
        await conn.execute("UPDATE articles SET isFeatured = 0 WHERE isFeatured = 1");
      }

      // Publish the article and optionally set as featured
      const [result] = await conn.execute(
        `UPDATE articles SET isPublished = 1, isFeatured = ?, publishedAt = ? WHERE slug = ?`,
        [setFeatured ? 1 : 0, Date.now(), slug]
      );

      await conn.end();

      console.log(`[Scheduled] Published article: ${slug}, featured: ${setFeatured}`);
      return res.json({ success: true, slug, setFeatured });
    } catch (error: any) {
      console.error("[Scheduled] Error publishing article:", error.message);
      return res.status(500).json({ error: error.message });
    }
  });
}
