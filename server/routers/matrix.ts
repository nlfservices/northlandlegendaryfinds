/**
 * Matrix Router - Hidden admin portal access code verification
 * 
 * Security layers:
 * 1. Hidden URL (obscurity) - /matrix is not linked anywhere
 * 2. Access code gate - must enter correct PIN before login appears
 * 3. IP-based lockout - 5 failed attempts = 30 min lockout
 * 4. OAuth + admin role check - standard auth after gate
 */

import { publicProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// In-memory store for failed attempts (per IP)
// In production, this could be moved to Redis or database
interface AttemptRecord {
  count: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

const failedAttempts = new Map<string, AttemptRecord>();

// Constants
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // Clean up old records every 10 min

// Periodic cleanup of expired lockouts
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of Array.from(failedAttempts.entries())) {
    // Remove records that are unlocked and haven't had attempts in 1 hour
    if (!record.lockedUntil && now - record.lastAttempt > 60 * 60 * 1000) {
      failedAttempts.delete(ip);
    }
    // Remove expired lockouts
    if (record.lockedUntil && now > record.lockedUntil) {
      failedAttempts.delete(ip);
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

export const matrixRouter = router({
  /**
   * Verify the access code
   * Returns { granted: true } if correct, throws error if wrong or locked out
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

      // Verify the code
      const correctCode = ENV.adminAccessCode;
      if (!correctCode) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Admin access code not configured.",
        });
      }

      if (input.code === correctCode) {
        // Success — clear any failed attempts for this IP
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
   * Check lockout status for the current IP (no code needed)
   * Used to show lockout message on page load
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
});
