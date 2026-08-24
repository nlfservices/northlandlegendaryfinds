import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { siteSettings, users, type User } from "../../drizzle/schema";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { sdk } from "./sdk";

const ADMIN_EMAILS = ["patrick@nlfservices.com", "admin@nlfservices.com"] as const;
export const MATRIX_COOKIE_NAME = "matrix_admin_session";
const MATRIX_SESSION_MS = 24 * 60 * 60 * 1000;

export function readMatrixSessionToken(req: Request): string | null {
  const cookieHeader = req.headers.cookie || "";
  const match = cookieHeader.match(new RegExp(`${MATRIX_COOKIE_NAME}=([^;]+)`));
  return match?.[1] ?? null;
}

export async function findOrCreateAdminUser(): Promise<User | null> {
  const database = await db.getDb();
  if (!database) return null;

  if (ENV.ownerOpenId) {
    const byOpenId = await database
      .select()
      .from(users)
      .where(eq(users.openId, ENV.ownerOpenId))
      .limit(1);
    if (byOpenId[0]) return byOpenId[0];
  }

  for (const email of ADMIN_EMAILS) {
    const found = await database.select().from(users).where(eq(users.email, email)).limit(1);
    if (found[0]) return found[0];
  }

  const openId = ENV.ownerOpenId || "local:nlf-admin";
  await db.upsertUser({
    openId,
    name: "NLF Admin",
    email: "patrick@nlfservices.com",
    loginMethod: "matrix-pin",
    lastSignedIn: new Date(),
    role: "admin",
  });

  const created = await database.select().from(users).where(eq(users.openId, openId)).limit(1);
  return created[0] ?? null;
}

export async function issueAdminSessions(
  req: Request,
  res: Response,
  user: User
): Promise<void> {
  const sessionToken = await sdk.createSessionToken(user.openId, {
    name: user.name || "NLF Admin",
    expiresInMs: ONE_YEAR_MS,
  });
  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

  const matrixToken = randomUUID();
  const expires = new Date(Date.now() + MATRIX_SESSION_MS);
  const database = await db.getDb();
  if (database) {
    await database
      .insert(siteSettings)
      .values({
        key: `matrix_session_${matrixToken}`,
        value: String(expires.getTime()),
        label: "Matrix admin session",
      })
      .onDuplicateKeyUpdate({ set: { value: String(expires.getTime()) } });
  }

  res.cookie(MATRIX_COOKIE_NAME, matrixToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    expires,
    secure: Boolean(cookieOptions.secure),
  });
}

export async function userFromMatrixCookie(req: Request): Promise<User | null> {
  const token = readMatrixSessionToken(req);
  if (!token) return null;

  const database = await db.getDb();
  if (!database) return null;

  const rows = await database
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, `matrix_session_${token}`))
    .limit(1);
  if (!rows[0]) return null;

  const expiresAt = Number(rows[0].value);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return null;

  return findOrCreateAdminUser();
}

export function clearAdminSessions(req: Request, res: Response) {
  const cookieOptions = getSessionCookieOptions(req);
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
  res.clearCookie(MATRIX_COOKIE_NAME, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
}
