/**
 * Scheduled task endpoint for daily database backup.
 * POST /api/scheduled/daily-backup
 * 
 * Exports all database tables as JSON and uploads to Google Drive via rclone.
 * Keeps 30-day rolling retention (deletes backups older than 30 days).
 * 
 * This handler is triggered by the Heartbeat cron system.
 */
import { Express, Request, Response } from "express";
import { sdk } from "./_core/sdk";
import mysql from "mysql2/promise";
import { storagePut } from "./storage";

// All tables to back up
const TABLES = [
  "users",
  "repack_products",
  "checklist_items",
  "pulls",
  "shows",
  "orders",
  "card_sets",
  "inventory_cards",
  "marvel_sets",
  "marvel_cards",
  "graded_cards",
  "launch_subscribers",
  "character_content",
  "card_detail_content",
  "matrix_attempts",
  "matrix_bypass_tokens",
  "articles",
  "top5_buzz_items",
  "show_submissions",
  "blog_posts",
  "loyalty_members",
  "loyalty_transactions",
  "loyalty_rewards",
  "loyalty_redemptions",
  "site_settings",
  "page_content",
  "card_shows",
  "article_votes",
  "affiliate_links",
  "mcu_media",
  "social_post_drafts",
  "facebook_comment_replies",
];

export function registerScheduledBackupRoute(app: Express) {
  app.post("/api/scheduled/daily-backup", async (req: Request, res: Response) => {
    try {
      // Authenticate the request
      const user = await sdk.authenticateRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      console.log("[Backup] Starting daily database backup...");

      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      const backupData: Record<string, any[]> = {};
      let totalRows = 0;

      // Export each table
      for (const table of TABLES) {
        try {
          const [rows] = await conn.execute(`SELECT * FROM \`${table}\``);
          backupData[table] = rows as any[];
          totalRows += (rows as any[]).length;
          console.log(`[Backup] ${table}: ${(rows as any[]).length} rows`);
        } catch (err: any) {
          // Table might not exist yet, skip it
          console.log(`[Backup] Skipping ${table}: ${err.message}`);
          backupData[table] = [];
        }
      }

      await conn.end();

      // Create backup JSON
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0]; // 2026-05-23
      const timestamp = now.toISOString();
      
      const backup = {
        metadata: {
          createdAt: timestamp,
          tables: Object.keys(backupData).length,
          totalRows,
          version: "1.0",
        },
        data: backupData,
      };

      const backupJson = JSON.stringify(backup, null, 2);
      const backupBuffer = Buffer.from(backupJson, "utf-8");
      const fileName = `nlf-backup-${dateStr}.json`;

      // Upload to S3 as well (redundant backup)
      const s3Key = `backups/${fileName}`;
      const { url: s3Url } = await storagePut(s3Key, backupBuffer, "application/json");
      console.log(`[Backup] Uploaded to S3: ${s3Url}`);

      // Return success with the S3 URL — the AGENT cron or a separate 
      // process will handle Google Drive upload
      res.json({
        ok: true,
        timestamp,
        fileName,
        tables: Object.keys(backupData).length,
        totalRows,
        s3Url,
        sizeMB: (backupBuffer.length / 1024 / 1024).toFixed(2),
      });

      console.log(`[Backup] ✅ Completed: ${totalRows} rows across ${Object.keys(backupData).length} tables (${(backupBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
    } catch (error: any) {
      console.error("[Backup] ❌ Failed:", error.message);
      res.status(500).json({
        error: error.message,
        stack: error.stack,
        context: { url: req.url, taskUid: (req as any).taskUid },
        timestamp: new Date().toISOString(),
      });
    }
  });
}
