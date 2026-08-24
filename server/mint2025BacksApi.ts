/**
 * PATCH backImageUrl for 2025 Topps Marvel Mint base #1-100 only (setId=3).
 * Never writes 2026-topps-marvel-mint (setId=90006) or any other set.
 *
 *   PATCH /api/v1/sets/3/cards/:cardNumber/back-image
 *   PATCH /api/v1/sets/3/card-backs
 *   Header: X-API-Key (cards:write)
 *
 * Body (single): { "backImageUrl": "/manus-storage/mint-topps-001_back.jpg", "verify": true }
 * Body (bulk):   { "items": [{ "cardNumber": "1", "backImageUrl": "/manus-storage/mint-topps-001_back.jpg" }], "verify": true }
 *
 * verify (default true) HEADs the public R2 object and refuses the row unless it is 200.
 */
import type { Express, NextFunction, Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards } from "../drizzle/schema";
import { logApiRequest, validateApiKey } from "./routers/apiKeys";

const MINT_2025_SET_ID = 3;
const FORBIDDEN_SET_ID = 90006;
const MANUS_BACK = /^\/manus-storage\/[A-Za-z0-9._-]+\.(jpe?g|webp|png)$/i;
const R2_PUBLIC_BASE =
  "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi";

interface AuthedRequest extends Request {
  apiKey?: { id: number; name: string; permissions: string[] };
}

function parseBaseNumber(raw: unknown): number | null {
  if (raw === undefined || raw === null) return null;
  const text = String(raw).trim();
  if (!/^\d{1,3}$/.test(text)) return null;
  const n = parseInt(text, 10);
  if (n < 1 || n > 100) return null;
  return n;
}

function normalizeBackUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const url = raw.trim();
  if (!MANUS_BACK.test(url)) return null;
  return url;
}

function publicObjectUrl(manusPath: string): string {
  return `${R2_PUBLIC_BASE}/${manusPath.replace(/^\/manus-storage\//, "")}`;
}

async function headOk(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
    return res.status === 200;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function requireCardsWrite(req: AuthedRequest, res: Response, next: NextFunction) {
  const rawKey = req.headers["x-api-key"];
  if (typeof rawKey !== "string" || !rawKey) {
    res.status(401).json({ error: "Missing X-API-Key header" });
    return;
  }
  validateApiKey(rawKey)
    .then((keyInfo) => {
      if (!keyInfo.permissions.includes("cards:write")) {
        res.status(403).json({
          error: "This key does not have the 'cards:write' permission",
          yourPermissions: keyInfo.permissions,
        });
        return;
      }
      req.apiKey = keyInfo;
      next();
    })
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : "Unauthorized";
      res.status(401).json({ error: message });
    });
}

function withLogging(
  handler: (req: AuthedRequest, res: Response) => Promise<void>
) {
  return async (req: AuthedRequest, res: Response) => {
    const start = Date.now();
    let statusCode = 200;
    const originalJson = res.json.bind(res);
    (res as Response).json = (body: unknown) => {
      statusCode = res.statusCode;
      return originalJson(body);
    };
    try {
      await handler(req, res);
    } catch (err) {
      statusCode = 500;
      console.error("[mint2025BacksApi]", err);
      if (!res.headersSent) res.status(500).json({ error: "Internal server error" });
    }
    if (req.apiKey) {
      logApiRequest({
        apiKeyId: req.apiKey.id,
        method: req.method,
        endpoint: req.path,
        statusCode,
        responseTimeMs: Date.now() - start,
      });
    }
  };
}

type UpdateItem = { cardNumber: string; backImageUrl: string };

async function applyBacks(
  items: UpdateItem[],
  verify: boolean
): Promise<{
  updated: Array<{ id: number; setId: number; cardNumber: string; backImageUrl: string }>;
  skipped: Array<{ cardNumber: string; reason: string }>;
}> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const updated: Array<{ id: number; setId: number; cardNumber: string; backImageUrl: string }> = [];
  const skipped: Array<{ cardNumber: string; reason: string }> = [];

  for (const item of items) {
    const n = parseBaseNumber(item.cardNumber);
    if (n === null) {
      skipped.push({ cardNumber: String(item.cardNumber), reason: "cardNumber must be 1-100" });
      continue;
    }
    const backImageUrl = normalizeBackUrl(item.backImageUrl);
    if (!backImageUrl) {
      skipped.push({
        cardNumber: String(n),
        reason: "backImageUrl must be /manus-storage/filename.jpg",
      });
      continue;
    }

    if (verify) {
      const ok = await headOk(publicObjectUrl(backImageUrl));
      if (!ok) {
        skipped.push({
          cardNumber: String(n),
          reason: `HEAD ${publicObjectUrl(backImageUrl)} was not 200`,
        });
        continue;
      }
    }

    const rows = await db
      .select({
        id: marvelCards.id,
        setId: marvelCards.setId,
        cardNumber: marvelCards.cardNumber,
      })
      .from(marvelCards)
      .where(and(eq(marvelCards.setId, MINT_2025_SET_ID), eq(marvelCards.cardNumber, String(n))));

    const allowed = rows.filter((row) => row.setId === MINT_2025_SET_ID && row.setId !== FORBIDDEN_SET_ID);
    if (!allowed.length) {
      skipped.push({ cardNumber: String(n), reason: "no setId=3 card with that number" });
      continue;
    }

    for (const row of allowed) {
      await db
        .update(marvelCards)
        .set({ backImageUrl } as { backImageUrl: string })
        .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, MINT_2025_SET_ID)));
      updated.push({ id: row.id, setId: MINT_2025_SET_ID, cardNumber: String(n), backImageUrl });
    }
  }

  return { updated, skipped };
}

export function registerMint2025BacksApi(app: Express) {
  const patchSingle = withLogging(async (req: AuthedRequest, res: Response) => {
    const n = parseBaseNumber(req.params.cardNumber);
    if (n === null) {
      res.status(400).json({ error: "cardNumber must be 1-100" });
      return;
    }
    const backImageUrl = normalizeBackUrl(req.body?.backImageUrl);
    if (!backImageUrl) {
      res.status(400).json({ error: "backImageUrl must be /manus-storage/filename.jpg" });
      return;
    }
    const verify = req.body?.verify !== false;
    try {
      const result = await applyBacks([{ cardNumber: String(n), backImageUrl }], verify);
      if (!result.updated.length) {
        res.status(result.skipped[0]?.reason?.includes("HEAD") ? 409 : 404).json({
          error: result.skipped[0]?.reason || "not updated",
          skipped: result.skipped,
        });
        return;
      }
      res.json({ data: result.updated[0], skipped: result.skipped });
    } catch (err) {
      const message = err instanceof Error ? err.message : "failed";
      if (message === "Database unavailable") {
        res.status(503).json({ error: message });
        return;
      }
      throw err;
    }
  });

  const patchBulk = withLogging(async (req: AuthedRequest, res: Response) => {
    const rawItems = req.body?.items;
    if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 100) {
      res.status(400).json({ error: "items must be an array of 1-100 { cardNumber, backImageUrl }" });
      return;
    }
    const items: UpdateItem[] = rawItems.map((item: { cardNumber?: unknown; backImageUrl?: unknown }) => ({
      cardNumber: String(item?.cardNumber ?? ""),
      backImageUrl: String(item?.backImageUrl ?? ""),
    }));
    const verify = req.body?.verify !== false;
    try {
      const result = await applyBacks(items, verify);
      res.json({
        updatedCount: result.updated.length,
        skippedCount: result.skipped.length,
        updated: result.updated,
        skipped: result.skipped,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "failed";
      if (message === "Database unavailable") {
        res.status(503).json({ error: message });
        return;
      }
      throw err;
    }
  });

  app.patch("/api/v1/sets/3/cards/:cardNumber/back-image", requireCardsWrite, patchSingle);
  app.patch("/api/v1/sets/3/card-backs", requireCardsWrite, patchBulk);
  console.log("[REST API] 2025 Mint backImageUrl PATCH mounted at /api/v1/sets/3/card-backs");
}
