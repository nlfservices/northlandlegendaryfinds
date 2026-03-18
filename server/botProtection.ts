/**
 * Bot Protection Service
 * - Honeypot field validation (invisible fields that bots fill in)
 * - Rate limiting per IP (sliding window)
 * - Timing validation (forms submitted too fast = bot)
 * No CAPTCHAs — frictionless for real users
 */
import type { Request, Response, NextFunction } from "express";

// ==================== RATE LIMITER ====================

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.windowStart > 600_000) { // 10 min stale
      rateLimitStore.delete(key);
    }
  }
}, 300_000);

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress ?? "unknown";
}

/**
 * Rate limiter middleware factory
 * @param maxRequests - Max requests per window
 * @param windowMs - Window duration in milliseconds
 * @param prefix - Key prefix for different endpoints
 */
export function rateLimit(maxRequests: number, windowMs: number, prefix: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = getClientIp(req);
    const key = `${prefix}:${ip}`;
    const now = Date.now();

    const entry = rateLimitStore.get(key);

    if (!entry || now - entry.windowStart > windowMs) {
      // New window
      rateLimitStore.set(key, { count: 1, windowStart: now });
      next();
      return;
    }

    if (entry.count >= maxRequests) {
      console.warn(`[BotProtection] Rate limit exceeded for ${ip} on ${prefix}`);
      res.status(429).json({
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((entry.windowStart + windowMs - now) / 1000),
      });
      return;
    }

    entry.count++;
    next();
  };
}

// ==================== HONEYPOT VALIDATION ====================

/**
 * Honeypot field names — these are invisible fields that should remain empty.
 * Bots auto-fill them, real users never see them.
 */
export const HONEYPOT_FIELD = "_website_url"; // Looks like a legit field to bots
export const HONEYPOT_FIELD_2 = "_phone_ext"; // Secondary trap

/**
 * Validate that honeypot fields are empty.
 * Returns true if the submission looks human, false if bot-like.
 */
export function validateHoneypot(body: Record<string, unknown>): boolean {
  const hp1 = body[HONEYPOT_FIELD];
  const hp2 = body[HONEYPOT_FIELD_2];

  // If either honeypot field has a value, it's a bot
  if (hp1 && typeof hp1 === "string" && hp1.trim().length > 0) {
    console.warn("[BotProtection] Honeypot field 1 filled — likely bot");
    return false;
  }
  if (hp2 && typeof hp2 === "string" && hp2.trim().length > 0) {
    console.warn("[BotProtection] Honeypot field 2 filled — likely bot");
    return false;
  }

  return true;
}

// ==================== TIMING VALIDATION ====================

/**
 * Validate form submission timing.
 * Forms submitted in under 2 seconds are likely bots.
 * @param formLoadedAt - Timestamp (ms) when the form was loaded
 * @param minSeconds - Minimum seconds before submission is valid (default: 2)
 */
export function validateTiming(formLoadedAt: number | undefined, minSeconds = 2): boolean {
  if (!formLoadedAt || typeof formLoadedAt !== "number") {
    // If no timing info, allow but log
    return true;
  }

  const elapsed = (Date.now() - formLoadedAt) / 1000;
  if (elapsed < minSeconds) {
    console.warn(`[BotProtection] Form submitted too fast (${elapsed.toFixed(1)}s) — likely bot`);
    return false;
  }

  return true;
}

// ==================== COMBINED VALIDATION ====================

/**
 * Combined bot check — validates honeypot + timing.
 * Use in tRPC procedures for form submissions.
 * Returns { isBot: boolean, reason?: string }
 */
export function checkForBot(input: {
  _website_url?: string;
  _phone_ext?: string;
  _formLoadedAt?: number;
}): { isBot: boolean; reason?: string } {
  // Check honeypot fields
  if (input._website_url && input._website_url.trim().length > 0) {
    return { isBot: true, reason: "honeypot_field_1" };
  }
  if (input._phone_ext && input._phone_ext.trim().length > 0) {
    return { isBot: true, reason: "honeypot_field_2" };
  }

  // Check timing
  if (input._formLoadedAt && typeof input._formLoadedAt === "number") {
    const elapsed = (Date.now() - input._formLoadedAt) / 1000;
    if (elapsed < 2) {
      return { isBot: true, reason: "too_fast" };
    }
  }

  return { isBot: false };
}

// ==================== PRE-CONFIGURED LIMITERS ====================

/** 5 form submissions per 15 minutes per IP */
export const formSubmitLimiter = rateLimit(5, 15 * 60 * 1000, "form");

/** 10 login attempts per 15 minutes per IP */
export const loginLimiter = rateLimit(10, 15 * 60 * 1000, "login");

/** 3 password reset requests per hour per IP */
export const passwordResetLimiter = rateLimit(3, 60 * 60 * 1000, "pwreset");

/** 20 API calls per minute per IP (general) */
export const apiLimiter = rateLimit(20, 60 * 1000, "api");
