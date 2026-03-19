/**
 * Matrix Router - Hidden admin portal access code verification
 * 
 * Security layers:
 * 1. Hidden URL (obscurity) - /matrix is not linked anywhere
 * 2. Access code gate - must enter correct PIN before login appears
 * 3. IP-based lockout - 5 failed attempts = 30 min lockout
 * 4. OAuth + admin role check - standard auth after gate
 * 
 * Forgot PIN: Sends a one-time bypass link to admin email (15 min expiry)
 */

import { publicProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";
import { notifyOwner } from "../_core/notification";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

// ==================== FAILED ATTEMPTS TRACKING ====================

interface AttemptRecord {
  count: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

const failedAttempts = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // Clean up old records every 10 min

// Periodic cleanup of expired lockouts and bypass tokens
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of Array.from(failedAttempts.entries())) {
    if (!record.lockedUntil && now - record.lastAttempt > 60 * 60 * 1000) {
      failedAttempts.delete(ip);
    }
    if (record.lockedUntil && now > record.lockedUntil) {
      failedAttempts.delete(ip);
    }
  }
  // Clean expired bypass tokens
  for (const [token, record] of Array.from(bypassTokens.entries())) {
    if (now > record.expiresAt) {
      bypassTokens.delete(token);
    }
  }
}, CLEANUP_INTERVAL_MS);

function getClientIp(req: any): string {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

// ==================== BYPASS TOKEN SYSTEM ====================

interface BypassToken {
  token: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
  requestIp: string;
}

const bypassTokens = new Map<string, BypassToken>();

// Rate limit: only allow one bypass request per 2 minutes per IP
const bypassRequestCooldowns = new Map<string, number>();
const BYPASS_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes
const BYPASS_TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

function generateBypassToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ==================== ROUTER ====================

export const matrixRouter = router({
  /**
   * Verify the access code
   */
  verify: publicProcedure
    .input(z.object({ code: z.string().min(1) }))
    .mutation(({ input, ctx }) => {
      const ip = getClientIp(ctx.req);
      const now = Date.now();

      // Check if IP is locked out
      const record = failedAttempts.get(ip);
      if (record?.lockedUntil && now < record.lockedUntil) {
        const remainingMs = record.lockedUntil - now;
        const remainingMin = Math.ceil(remainingMs / 60000);
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Access locked. Try again in ${remainingMin} minute${remainingMin !== 1 ? "s" : ""}.`,
        });
      }

      const correctCode = ENV.adminAccessCode;
      if (!correctCode) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Admin access code not configured.",
        });
      }

      if (input.code === correctCode) {
        failedAttempts.delete(ip);
        console.log(`[Matrix] Access granted from IP: ${ip} at ${new Date().toISOString()}`);
        return { granted: true } as const;
      }

      // Wrong code — track the failure
      const existing = failedAttempts.get(ip) || { count: 0, lastAttempt: 0, lockedUntil: null };
      existing.count += 1;
      existing.lastAttempt = now;

      if (existing.count >= MAX_ATTEMPTS) {
        existing.lockedUntil = now + LOCKOUT_DURATION_MS;
        failedAttempts.set(ip, existing);
        console.warn(`[Matrix] IP LOCKED OUT: ${ip} after ${existing.count} failed attempts at ${new Date().toISOString()}`);
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many failed attempts. Access locked for 30 minutes.",
        });
      }

      failedAttempts.set(ip, existing);
      const remaining = MAX_ATTEMPTS - existing.count;
      console.warn(`[Matrix] Failed attempt from IP: ${ip} (${existing.count}/${MAX_ATTEMPTS}) at ${new Date().toISOString()}`);

      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Invalid access code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
      });
    }),

  /**
   * Check lockout status for the current IP
   */
  status: publicProcedure.query(({ ctx }) => {
    const ip = getClientIp(ctx.req);
    const now = Date.now();
    const record = failedAttempts.get(ip);

    if (record?.lockedUntil && now < record.lockedUntil) {
      const remainingMs = record.lockedUntil - now;
      const remainingMin = Math.ceil(remainingMs / 60000);
      return {
        locked: true,
        remainingMinutes: remainingMin,
        attempts: record.count,
      } as const;
    }

    return {
      locked: false,
      remainingMinutes: 0,
      attempts: record?.count ?? 0,
    } as const;
  }),

  /**
   * Request a bypass link (Forgot PIN)
   * Generates a one-time token and sends it to the admin email via notification
   */
  requestBypass: publicProcedure
    .input(z.object({ origin: z.string().url() }))
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIp(ctx.req);
      const now = Date.now();

      // Rate limit: one request per 2 minutes per IP
      const lastRequest = bypassRequestCooldowns.get(ip);
      if (lastRequest && now - lastRequest < BYPASS_COOLDOWN_MS) {
        const waitSec = Math.ceil((BYPASS_COOLDOWN_MS - (now - lastRequest)) / 1000);
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Please wait ${waitSec} seconds before requesting another bypass link.`,
        });
      }

      // Generate the token
      const token = generateBypassToken();
      const expiresAt = now + BYPASS_TOKEN_EXPIRY_MS;

      bypassTokens.set(token, {
        token,
        createdAt: now,
        expiresAt,
        used: false,
        requestIp: ip,
      });

      bypassRequestCooldowns.set(ip, now);

      // Build the bypass URL
      const bypassUrl = `${input.origin}/matrix?bypass=${token}`;

      // Send notification to admin
      const emailContent = [
        `A temporary access link has been requested for the NLF admin portal.`,
        ``,
        `Bypass Link: ${bypassUrl}`,
        ``,
        `This link is single-use and expires in 15 minutes.`,
        `Requested from IP: ${ip}`,
        `Time: ${new Date().toISOString()}`,
        ``,
        `If you did not request this, someone may be trying to access your admin panel.`,
      ].join("\n");

      try {
        const sent = await notifyOwner({
          title: "🔐 NLF Admin Portal - Temporary Access Link",
          content: emailContent,
        });

        if (!sent) {
          console.warn(`[Matrix] Failed to send bypass notification for IP: ${ip}`);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send the bypass link. Please try again.",
          });
        }

        console.log(`[Matrix] Bypass link sent to admin for IP: ${ip} at ${new Date().toISOString()}`);
      } catch (err: any) {
        // If it's already a TRPCError, rethrow
        if (err instanceof TRPCError) throw err;
        console.error(`[Matrix] Error sending bypass notification:`, err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send the bypass link. Please try again.",
        });
      }

      return {
        sent: true,
        expiresInMinutes: 15,
      } as const;
    }),

  /**
   * Verify a bypass token from the URL
   * Single-use: once verified, the token is marked as used
   */
  verifyBypass: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(({ input, ctx }) => {
      const ip = getClientIp(ctx.req);
      const now = Date.now();

      const record = bypassTokens.get(input.token);

      if (!record) {
        console.warn(`[Matrix] Invalid bypass token attempt from IP: ${ip}`);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid or expired bypass link.",
        });
      }

      if (record.used) {
        console.warn(`[Matrix] Reused bypass token attempt from IP: ${ip}`);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "This bypass link has already been used.",
        });
      }

      if (now > record.expiresAt) {
        bypassTokens.delete(input.token);
        console.warn(`[Matrix] Expired bypass token attempt from IP: ${ip}`);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "This bypass link has expired. Please request a new one.",
        });
      }

      // Mark as used and grant access
      record.used = true;
      bypassTokens.set(input.token, record);

      // Also clear any lockout for this IP since they've proven identity via email
      failedAttempts.delete(ip);

      console.log(`[Matrix] Bypass access granted from IP: ${ip} at ${new Date().toISOString()}`);

      return { granted: true } as const;
    }),
});
