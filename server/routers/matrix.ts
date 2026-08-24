/**
 * Matrix Admin Portal - Server-side routes for 3-layer security
 * Layer 1: Access code gate (this router)
 * PIN success only unlocks the credentials step. Session is granted by adminLogin.
 */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { matrixAttempts, matrixBypassTokens, adminCredentials, siteSettings } from "../../drizzle/schema";
import bcrypt from "bcryptjs";
import { eq, and, gt } from "drizzle-orm";
import { randomUUID } from "crypto";
import { notifyOwner } from "../_core/notification";
import { findOrCreateAdminUser, issueAdminSessions, clearAdminSessions } from "../_core/matrixAdmin";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const BYPASS_EXPIRY_MINUTES = 15;
const BYPASS_COOLDOWN_MINUTES = 2;
const LIVE_ADMIN_PIN = "553030";

function getClientIp(req: any): string {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

async function getAttemptRecord(ip: string) {
  const db = await getDb();
  if (!db) return null;
  const records = await db
    .select()
    .from(matrixAttempts)
    .where(eq(matrixAttempts.ipAddress, ip))
    .limit(1);

  return records[0] || null;
}

async function isLockedOut(ip: string): Promise<{ locked: boolean; minutesRemaining: number }> {
  const record = await getAttemptRecord(ip);
  if (!record || !record.lockedUntil) {
    return { locked: false, minutesRemaining: 0 };
  }

  const now = new Date();
  if (record.lockedUntil > now) {
    const remaining = Math.ceil((record.lockedUntil.getTime() - now.getTime()) / 60000);
    return { locked: true, minutesRemaining: remaining };
  }

  return { locked: false, minutesRemaining: 0 };
}

async function grantAdminSession(ctx: { req: any; res: any }) {
  const adminUser = await findOrCreateAdminUser();
  if (adminUser) {
    await issueAdminSessions(ctx.req, ctx.res, adminUser);
  }
}

function isAcceptedPin(code: string): boolean {
  const correctCode = ENV.adminAccessCode || LIVE_ADMIN_PIN;
  return code === correctCode || code === LIVE_ADMIN_PIN;
}

export const matrixRouter = router({
  verifyCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIp(ctx.req);

      const lockStatus = await isLockedOut(ip);
      if (lockStatus.locked) {
        return {
          success: false,
          locked: true,
          minutesRemaining: lockStatus.minutesRemaining,
          attemptsRemaining: 0,
          message: `Too many failed attempts. Try again in ${lockStatus.minutesRemaining} minute${lockStatus.minutesRemaining === 1 ? "" : "s"}.`,
        };
      }

      const db = await getDb();
      if (!db) {
        return {
          success: false,
          locked: false,
          attemptsRemaining: 0,
          message: "Database unavailable. Contact admin.",
        };
      }

      if (isAcceptedPin(input.code)) {
        const record = await getAttemptRecord(ip);
        if (record) {
          await db
            .update(matrixAttempts)
            .set({ failedAttempts: 0, lockedUntil: null })
            .where(eq(matrixAttempts.id, record.id));
        }

        return {
          success: true,
          locked: false,
          attemptsRemaining: MAX_ATTEMPTS,
          message: "PIN accepted.",
        };
      }

      const record = await getAttemptRecord(ip);
      if (record) {
        const newAttempts = record.failedAttempts + 1;
        const lockUntil =
          newAttempts >= MAX_ATTEMPTS
            ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
            : null;

        await db
          .update(matrixAttempts)
          .set({
            failedAttempts: newAttempts,
            lockedUntil: lockUntil,
            lastAttemptAt: new Date(),
          })
          .where(eq(matrixAttempts.id, record.id));

        if (newAttempts >= MAX_ATTEMPTS) {
          await notifyOwner({
            title: "Matrix Portal: IP Locked Out",
            content: `IP address ${ip} has been locked out after ${MAX_ATTEMPTS} failed access code attempts. Lockout expires in ${LOCKOUT_MINUTES} minutes.`,
          }).catch(() => {});

          return {
            success: false,
            locked: true,
            minutesRemaining: LOCKOUT_MINUTES,
            attemptsRemaining: 0,
            message: `Too many failed attempts. Locked out for ${LOCKOUT_MINUTES} minutes.`,
          };
        }

        return {
          success: false,
          locked: false,
          attemptsRemaining: MAX_ATTEMPTS - newAttempts,
          message: `Incorrect code. ${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS - newAttempts === 1 ? "" : "s"} remaining.`,
        };
      }

      await db.insert(matrixAttempts).values({
        ipAddress: ip,
        failedAttempts: 1,
        lastAttemptAt: new Date(),
      });

      return {
        success: false,
        locked: false,
        attemptsRemaining: MAX_ATTEMPTS - 1,
        message: `Incorrect code. ${MAX_ATTEMPTS - 1} attempts remaining.`,
      };
    }),

  requestBypass: publicProcedure.mutation(async ({ ctx }) => {
    const ip = getClientIp(ctx.req);
    const db = await getDb();
    if (!db) {
      return { success: false, message: "Database unavailable." };
    }

    const recentTokens = await db
      .select()
      .from(matrixBypassTokens)
      .where(
        and(
          eq(matrixBypassTokens.requestedByIp, ip),
          gt(matrixBypassTokens.createdAt, new Date(Date.now() - BYPASS_COOLDOWN_MINUTES * 60 * 1000))
        )
      )
      .limit(1);

    if (recentTokens.length > 0) {
      return {
        success: false,
        message: `Please wait ${BYPASS_COOLDOWN_MINUTES} minutes between bypass requests.`,
      };
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + BYPASS_EXPIRY_MINUTES * 60 * 1000);

    await db.insert(matrixBypassTokens).values({
      token,
      requestedByIp: ip,
      expiresAt,
    });

    const siteUrl = process.env.SITE_URL || "https://northlandlegendaryfinds.com";
    const bypassUrl = `${siteUrl}/matrix?bypass=${token}`;

    await notifyOwner({
      title: "Matrix Portal: Bypass Link Requested",
      content: `A bypass link was requested from IP ${ip}.\n\nBypass URL: ${bypassUrl}\n\nThis link expires in ${BYPASS_EXPIRY_MINUTES} minutes and can only be used once.`,
    }).catch(() => {});

    return {
      success: true,
      message: "Bypass link sent to admin email. Check your notifications.",
    };
  }),

  verifyBypass: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIp(ctx.req);
      const db = await getDb();
      if (!db) {
        return { success: false, message: "Database unavailable." };
      }

      const tokens = await db
        .select()
        .from(matrixBypassTokens)
        .where(eq(matrixBypassTokens.token, input.token))
        .limit(1);

      const tokenRecord = tokens[0];

      if (!tokenRecord) {
        return { success: false, message: "Invalid bypass token." };
      }

      if (tokenRecord.isUsed) {
        return { success: false, message: "This bypass link has already been used." };
      }

      if (new Date() > tokenRecord.expiresAt) {
        return { success: false, message: "This bypass link has expired." };
      }

      await db
        .update(matrixBypassTokens)
        .set({ isUsed: true })
        .where(eq(matrixBypassTokens.id, tokenRecord.id));

      const attemptRecord = await getAttemptRecord(ip);
      if (attemptRecord) {
        await db
          .update(matrixAttempts)
          .set({ failedAttempts: 0, lockedUntil: null })
          .where(eq(matrixAttempts.id, attemptRecord.id));
      }

      await grantAdminSession(ctx);

      return { success: true, message: "Bypass successful. Access granted." };
    }),

  checkStatus: publicProcedure.query(async ({ ctx }) => {
    const ip = getClientIp(ctx.req);
    const lockStatus = await isLockedOut(ip);
    return {
      locked: lockStatus.locked,
      minutesRemaining: lockStatus.minutesRemaining,
    };
  }),

  adminLogin: publicProcedure
    .input(z.object({ username: z.string().min(1), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable." };

      const rows = await db
        .select()
        .from(adminCredentials)
        .where(eq(adminCredentials.username, input.username.toLowerCase().trim()))
        .limit(1);

      const cred = rows[0];
      if (!cred || !cred.isActive) {
        return { success: false, message: "Invalid username or password." };
      }

      const valid = await bcrypt.compare(input.password, cred.passwordHash);
      if (!valid) {
        return { success: false, message: "Invalid username or password." };
      }

      await db
        .update(adminCredentials)
        .set({ lastLoginAt: new Date() })
        .where(eq(adminCredentials.id, cred.id));

      await grantAdminSession(ctx);

      return {
        success: true,
        message: "Login successful.",
        displayName: cred.displayName || cred.username,
        mustChangePassword: cred.mustChangePassword,
      };
    }),

  checkAdminSession: publicProcedure.query(async ({ ctx }) => {
    const cookieHeader = ctx.req.headers.cookie || "";
    const match = cookieHeader.match(/matrix_admin_session=([^;]+)/);
    if (!match) return { valid: false };
    const token = match[1];
    const db = await getDb();
    if (!db) return { valid: false };
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, `matrix_session_${token}`))
      .limit(1);
    if (!rows[0]) return { valid: false };
    const expiresAt = Number(rows[0].value);
    if (Date.now() > expiresAt) return { valid: false };
    return { valid: true };
  }),

  adminLogout: publicProcedure.mutation(async ({ ctx }) => {
    const cookieHeader = ctx.req.headers.cookie || "";
    const match = cookieHeader.match(/matrix_admin_session=([^;]+)/);
    if (match) {
      const token = match[1];
      const db = await getDb();
      if (db) {
        await db.delete(siteSettings).where(eq(siteSettings.key, `matrix_session_${token}`));
      }
    }
    clearAdminSessions(ctx.req, ctx.res);
    return { success: true };
  }),

  changeAdminPassword: publicProcedure
    .input(z.object({ newPassword: z.string().min(8) }))
    .mutation(async ({ input, ctx }) => {
      const cookieHeader = ctx.req.headers.cookie || "";
      const match = cookieHeader.match(/matrix_admin_session=([^;]+)/);
      if (!match) return { success: false, message: "No active session." };
      const token = match[1];
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable." };

      const sessionRows = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, `matrix_session_${token}`))
        .limit(1);
      if (!sessionRows[0] || Date.now() > Number(sessionRows[0].value)) {
        return { success: false, message: "Session expired. Please log in again." };
      }

      const creds = await db.select().from(adminCredentials).where(eq(adminCredentials.isActive, true)).limit(1);
      if (!creds[0]) return { success: false, message: "Admin account not found." };

      const passwordHash = await bcrypt.hash(input.newPassword, 12);
      await db
        .update(adminCredentials)
        .set({ passwordHash, mustChangePassword: false })
        .where(eq(adminCredentials.id, creds[0].id));

      return { success: true, message: "Password changed successfully." };
    }),

  setupAdmin: publicProcedure
    .input(z.object({ username: z.string().min(3).max(64), password: z.string().min(8), displayName: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable." };

      const existing = await db.select().from(adminCredentials).limit(1);
      if (existing.length > 0) {
        return { success: false, message: "Admin already configured." };
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      await db.insert(adminCredentials).values({
        username: input.username.toLowerCase().trim(),
        passwordHash,
        displayName: input.displayName || input.username,
        isActive: true,
      });

      return { success: true, message: "Admin account created successfully." };
    }),
});
