/**
 * API Key Management Router
 * Admin-only tRPC procedures for managing NLF Public API keys
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { apiKeys, apiUsageLogs } from "../../drizzle/schema";
import { eq, desc, and, gte } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";

// ─── Permission Scopes ───────────────────────────────────────────────────────

export const ALL_SCOPES = [
  "cards:read",
  "cards:write",
  "sets:read",
  "sets:write",
  "articles:read",
  "articles:write",
  "artists:write",
  "social:write",
  "admin:read",
] as const;

export type ApiScope = (typeof ALL_SCOPES)[number];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateApiKey(): { raw: string; hash: string; prefix: string } {
  const raw = `nlf_${randomBytes(24).toString("hex")}`;
  const hash = createHash("sha256").update(raw).digest("hex");
  const prefix = raw.substring(0, 12); // "nlf_" + 8 chars
  return { raw, hash, prefix };
}

function hashKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

// ─── Admin guard ─────────────────────────────────────────────────────────────

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ─── Router ──────────────────────────────────────────────────────────────────

export const apiKeysRouter = router({
  /** List all API keys (admin only) */
  list: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        permissions: apiKeys.permissions,
        active: apiKeys.active,
        expiresAt: apiKeys.expiresAt,
        requestCount: apiKeys.requestCount,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .orderBy(desc(apiKeys.createdAt));
  }),

  /** Create a new API key — returns the raw key ONCE */
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        permissions: z.array(z.enum(ALL_SCOPES)).min(1),
        expiresAt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const { raw, hash, prefix } = generateApiKey();
      const permissionsStr = input.permissions.join(",");
      const expiresAt = input.expiresAt ? new Date(input.expiresAt) : undefined;

      await db.insert(apiKeys).values({
        name: input.name,
        keyHash: hash,
        keyPrefix: prefix,
        permissions: permissionsStr,
        active: true,
        expiresAt,
        requestCount: 0,
      });

      return {
        rawKey: raw, // shown ONCE — never stored
        prefix,
        name: input.name,
        permissions: input.permissions,
      };
    }),

  /** Revoke (deactivate) an API key */
  revoke: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db
        .update(apiKeys)
        .set({ active: false, updatedAt: new Date() })
        .where(eq(apiKeys.id, input.id));
      return { success: true };
    }),

  /** Re-activate a revoked key */
  activate: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db
        .update(apiKeys)
        .set({ active: true, updatedAt: new Date() })
        .where(eq(apiKeys.id, input.id));
      return { success: true };
    }),

  /** Delete a key permanently */
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db.delete(apiUsageLogs).where(eq(apiUsageLogs.apiKeyId, input.id));
      await db.delete(apiKeys).where(eq(apiKeys.id, input.id));
      return { success: true };
    }),

  /** Get usage logs for a specific key */
  usageLogs: adminProcedure
    .input(
      z.object({
        keyId: z.number(),
        limit: z.number().min(1).max(200).default(50),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(apiUsageLogs)
        .where(eq(apiUsageLogs.apiKeyId, input.keyId))
        .orderBy(desc(apiUsageLogs.createdAt))
        .limit(input.limit);
    }),

  /** Get aggregate usage stats for all keys */
  stats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { keys: [], recentActivity: [] };

    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        active: apiKeys.active,
        requestCount: apiKeys.requestCount,
        lastUsedAt: apiKeys.lastUsedAt,
      })
      .from(apiKeys)
      .orderBy(desc(apiKeys.requestCount));

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogs = await db
      .select()
      .from(apiUsageLogs)
      .where(gte(apiUsageLogs.createdAt, yesterday))
      .orderBy(desc(apiUsageLogs.createdAt))
      .limit(100);

    return { keys, recentActivity: recentLogs };
  }),
});

// ─── Exported helpers for REST API middleware ─────────────────────────────────

/**
 * Validate an API key from the X-API-Key header.
 * Returns the key record if valid, throws otherwise.
 */
export async function validateApiKey(rawKey: string): Promise<{
  id: number;
  name: string;
  permissions: string[];
}> {
  if (!rawKey || !rawKey.startsWith("nlf_")) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid API key format" });
  }

  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

  const hash = hashKey(rawKey);
  const [key] = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.keyHash, hash), eq(apiKeys.active, true)))
    .limit(1);

  if (!key) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "API key not found or revoked" });
  }

  if (key.expiresAt && key.expiresAt < new Date()) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "API key has expired" });
  }

  // Update last used + increment count (fire and forget)
  getDb().then((d) =>
    d?.update(apiKeys)
      .set({
        lastUsedAt: new Date(),
        requestCount: (key.requestCount ?? 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(apiKeys.id, key.id))
      .catch(() => {})
  );

  return {
    id: key.id,
    name: key.name,
    permissions: key.permissions.split(",").map((s: string) => s.trim()),
  };
}

/**
 * Log an API request to the usage log table.
 */
export async function logApiRequest(opts: {
  apiKeyId: number;
  method: string;
  endpoint: string;
  statusCode: number;
  responseTimeMs?: number;
  resourceId?: string;
  note?: string;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(apiUsageLogs).values({
    apiKeyId: opts.apiKeyId,
    method: opts.method,
    endpoint: opts.endpoint,
    statusCode: opts.statusCode,
    responseTimeMs: opts.responseTimeMs,
    resourceId: opts.resourceId,
    note: opts.note,
  }).catch(() => {});
}
