import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

/**
 * Decode the state parameter to extract the return path.
 * New format: base64( JSON.stringify({ redirectUri, returnTo }) )
 * Legacy format: base64( redirectUri ) — returns "/" as fallback
 */
function parseReturnTo(state: string): string {
  try {
    const decoded = atob(state);
    try {
      const parsed = JSON.parse(decoded) as { redirectUri?: string; returnTo?: string };
      if (parsed.returnTo) {
        const path = parsed.returnTo;
        // Only allow relative paths to prevent open redirect attacks
        if (path.startsWith("/") && !path.startsWith("//")) {
          return path;
        }
      }
    } catch {
      // Legacy format — state is just the redirectUri string, fall through to "/"
    }
  } catch {
    // Ignore base64 decode errors
  }
  return "/";
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

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // Redirect to returnTo path if encoded in state, otherwise homepage
      const returnTo = parseReturnTo(state);
      res.redirect(302, returnTo);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
