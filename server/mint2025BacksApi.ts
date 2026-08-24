/**
 * Attach + upload back images for 2025 Topps Marvel Mint base #1-100 only (setId=3).
 * Never writes 2026-topps-marvel-mint (setId=90006) or any other set.
 * Never writes imageUrl / fronts.
 *
 *   PATCH /api/v1/sets/3/cards/:cardNumber/back-image
 *   PATCH /api/v1/sets/3/card-backs
 *   POST  /api/v1/sets/3/card-backs/upload
 *
 * Auth: X-API-Key with cards:write, OR an existing admin/super_admin/owner session cookie.
 *
 * PATCH body (single): { "backImageUrl": "/manus-storage/mint-topps-001_back.jpg", "verify": true }
 * PATCH body (bulk):   { "items": [{ "cardNumber": "1", "backImageUrl": "/manus-storage/mint-topps-001_back.jpg" }], "verify": true }
 * POST  body:          { "items": [{ "cardNumber": "1", "imageBase64": "<jpeg base64>" }] }  // max 10, ~2MB jpeg each
 *
 * PATCH verify (default true) HEADs the public R2 object and refuses the row unless it is 200.
 * POST uploads via storagePut then sets backImageUrl only after the put succeeds.
 */
import type { Express, NextFunction, Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { marvelCards } from "../drizzle/schema";
import { logApiRequest, validateApiKey } from "./routers/apiKeys";
import { storagePut } from "./storage";
import { sdk } from "./_core/sdk";
import { hasMinRole } from "./_core/trpc";

const MINT_2025_SET_ID = 3;
const FORBIDDEN_SET_ID = 90006;
const MANUS_BACK = /^\/manus-storage\/[A-Za-z0-9._-]+\.(jpe?g|webp|png)$/i;
const R2_PUBLIC_BASE =
  "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi";
const MAX_UPLOAD_ITEMS = 10;
const MAX_JPEG_BYTES = 2 * 1024 * 1024;

interface AuthedRequest extends Request {
  apiKey?: { id: number; name: string; permissions: string[] };
  adminUser?: { id: number; role: string; name: string | null };
}

function parseBaseNumber(raw: unknown): number | null {
  if (raw === undefined || raw === null) return null;
  const text = String(raw).trim();
  if (!/^\d{1,3}$/.test(text)) return null;
  const n = parseInt(text, 10);
  if (n < 1 || n > 100) return null;
  return n;
}

function paddedCard(n: number): string {
  return String(n).padStart(3, "0");
}

function backObjectKey(n: number): string {
  return `mint-topps-${paddedCard(n)}_back.jpg`;
}

function backManusUrl(n: number): string {
  return `/manus-storage/${backObjectKey(n)}`;
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

function isJpegBuffer(buf: Buffer): boolean {
  return buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}

function decodeJpegBase64(raw: unknown): { buffer: Buffer } | { error: string } {
  if (typeof raw !== "string" || !raw.trim()) {
    return { error: "imageBase64 is required" };
  }
  let text = raw.trim();
  const comma = text.indexOf(",");
  if (text.startsWith("data:") && comma !== -1) {
    const header = text.slice(0, comma).toLowerCase();
    if (!header.includes("image/jpeg") && !header.includes("image/jpg")) {
      return { error: "jpeg only" };
    }
    text = text.slice(comma + 1);
  }
  text = text.replace(/\s+/g, "");
  let buffer: Buffer;
  try {
    buffer = Buffer.from(text, "base64");
  } catch {
    return { error: "imageBase64 is not valid base64" };
  }
  if (!buffer.length) return { error: "imageBase64 decoded empty" };
  if (buffer.length > MAX_JPEG_BYTES) return { error: `jpeg exceeds ${MAX_JPEG_BYTES} bytes` };
  if (!isJpegBuffer(buffer)) return { error: "jpeg only (missing SOI marker)" };
  return { buffer };
}

function requireCardsWriteOrAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const rawKey = req.headers["x-api-key"];
  if (typeof rawKey === "string" && rawKey) {
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
    return;
  }

  sdk
    .authenticateRequest(req)
    .then((user) => {
      if (!user || !hasMinRole(user.role, "admin")) {
        res.status(403).json({ error: "Admin session required" });
        return;
      }
      req.adminUser = { id: user.id, role: user.role, name: user.name ?? null };
      next();
    })
    .catch(() => {
      res.status(401).json({ error: "Missing X-API-Key header or admin session" });
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
      if (row.setId !== MINT_2025_SET_ID || row.setId === FORBIDDEN_SET_ID) continue;
      await db
        .update(marvelCards)
        .set({ backImageUrl } as { backImageUrl: string })
        .where(and(eq(marvelCards.id, row.id), eq(marvelCards.setId, MINT_2025_SET_ID)));
      updated.push({ id: row.id, setId: MINT_2025_SET_ID, cardNumber: String(n), backImageUrl });
    }
  }

  return { updated, skipped };
}

async function uploadAndAttach(items: Array<{ cardNumber: unknown; imageBase64: unknown }>): Promise<{
  results: Array<{
    cardNumber: string;
    uploaded?: boolean;
    attached?: boolean;
    key?: string;
    backImageUrl?: string;
    error?: string;
  }>;
}> {
  const results: Array<{
    cardNumber: string;
    uploaded?: boolean;
    attached?: boolean;
    key?: string;
    backImageUrl?: string;
    error?: string;
  }> = [];

  for (const item of items) {
    const n = parseBaseNumber(item.cardNumber);
    if (n === null) {
      results.push({ cardNumber: String(item.cardNumber ?? ""), error: "cardNumber must be 1-100" });
      continue;
    }

    const decoded = decodeJpegBase64(item.imageBase64);
    if ("error" in decoded) {
      results.push({ cardNumber: String(n), error: decoded.error });
      continue;
    }

    const key = backObjectKey(n);
    const backImageUrl = backManusUrl(n);

    try {
      await storagePut(key, decoded.buffer, "image/jpeg");
    } catch (err) {
      const message = err instanceof Error ? err.message : "storagePut failed";
      results.push({ cardNumber: String(n), uploaded: false, attached: false, key, error: message });
      continue;
    }

    try {
      const applied = await applyBacks([{ cardNumber: String(n), backImageUrl }], false);
      if (!applied.updated.length) {
        results.push({
          cardNumber: String(n),
          uploaded: true,
          attached: false,
          key,
          backImageUrl,
          error: applied.skipped[0]?.reason || "uploaded but not attached",
        });
        continue;
      }
      results.push({
        cardNumber: String(n),
        uploaded: true,
        attached: true,
        key,
        backImageUrl,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "attach failed";
      results.push({
        cardNumber: String(n),
        uploaded: true,
        attached: false,
        key,
        backImageUrl,
        error: message,
      });
    }
  }

  return { results };
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

  const postUpload = withLogging(async (req: AuthedRequest, res: Response) => {
    const rawItems = req.body?.items;
    if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > MAX_UPLOAD_ITEMS) {
      res.status(400).json({
        error: `items must be an array of 1-${MAX_UPLOAD_ITEMS} { cardNumber, imageBase64 }`,
      });
      return;
    }

    const items = rawItems.map((item: { cardNumber?: unknown; imageBase64?: unknown }) => ({
      cardNumber: item?.cardNumber,
      imageBase64: item?.imageBase64,
    }));

    try {
      const { results } = await uploadAndAttach(items);
      const uploaded = results.filter((r) => r.uploaded).length;
      const attached = results.filter((r) => r.attached).length;
      const failed = results.filter((r) => r.error).length;
      res.status(failed && !attached ? 422 : 200).json({
        setId: MINT_2025_SET_ID,
        uploadedCount: uploaded,
        attachedCount: attached,
        errorCount: failed,
        results,
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

  app.patch("/api/v1/sets/3/cards/:cardNumber/back-image", requireCardsWriteOrAdmin, patchSingle);
  app.patch("/api/v1/sets/3/card-backs", requireCardsWriteOrAdmin, patchBulk);
  app.post("/api/v1/sets/3/card-backs/upload", requireCardsWriteOrAdmin, postUpload);
  console.log("[REST API] 2025 Mint backImageUrl PATCH+POST mounted at /api/v1/sets/3/card-backs");
}
