import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import crypto from "crypto";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { logLogin } from "../activityLogger";
import { syncUserToGHL } from "../ghlSync";

/** 15 minutes for standard sessions, 7 days for "remember me" */
const STANDARD_SESSION_MS = 15 * 60 * 1000;
const REMEMBER_ME_SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      // Check if this is a new user (for GHL sync)
      const existingUser = await db.getUserByOpenId(userInfo.openId);
      const isNewUser = !existingUser;

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      // Get the user after upsert
      const user = await db.getUserByOpenId(userInfo.openId);

      // Check if account is active
      if (user && !user.isActive) {
        res.redirect(302, "/?error=account_deactivated");
        return;
      }

      // Generate a unique session ID for single-session enforcement
      const sessionId = crypto.randomBytes(32).toString("hex");

      // Store session token in user record
      if (user) {
        await db.updateUserSessionToken(userInfo.openId, sessionId);
      }

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // Set the session ID cookie for single-session enforcement
      res.cookie("nlf_session_id", sessionId, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      // Log the login activity
      if (user) {
        logLogin(user, req).catch(() => {}); // Non-blocking
      }

      // Sync new users to GoHighLevel CRM
      if (isNewUser && user) {
        syncUserToGHL(user).catch((err) => {
          console.error("[GHL] Failed to sync new user:", err);
        });
      }

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
