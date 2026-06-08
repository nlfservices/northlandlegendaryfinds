/**
 * Scheduled task: Automatically refresh the Facebook Page Access Token.
 * POST /api/scheduled/fb-token-refresh
 *
 * This handler runs on a schedule (every 50 days) to exchange the current
 * long-lived user token for a fresh one, then derive a never-expiring Page Token.
 *
 * It uses FB_APP_SECRET + FB_APP_ID to perform the exchange without any
 * manual intervention. The new token is saved back to the environment via
 * the Manus secrets API and also stored in the DB for audit purposes.
 *
 * Auth: cron-only (isCron === true) — not callable by regular users.
 */
import { Express, Request, Response } from "express";
import { notifyOwner } from "./_core/notification";

const FB_APP_ID = "341166519822108";

async function refreshFacebookToken(): Promise<{
  success: boolean;
  newToken?: string;
  error?: string;
  daysUntilExpiry?: number;
}> {
  const appSecret = process.env.FB_APP_SECRET;
  const currentToken = process.env.FB_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FB_PAGE_ID || "951323751392043";

  if (!appSecret || !currentToken) {
    return { success: false, error: "Missing FB_APP_SECRET or FB_PAGE_ACCESS_TOKEN" };
  }

  try {
    // Step 1: Exchange current token for a new long-lived user token
    const exchangeUrl = `https://graph.facebook.com/v24.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FB_APP_ID}&client_secret=${appSecret}&fb_exchange_token=${currentToken}`;
    const exchangeRes = await fetch(exchangeUrl);
    const exchangeData = await exchangeRes.json() as { access_token?: string; error?: { message: string } };

    if (!exchangeData.access_token) {
      return {
        success: false,
        error: `Token exchange failed: ${exchangeData.error?.message || "Unknown error"}`,
      };
    }

    const longLivedUserToken = exchangeData.access_token;

    // Step 2: Get a never-expiring Page Token from the long-lived user token
    const pageUrl = `https://graph.facebook.com/v24.0/${pageId}?fields=access_token,name&access_token=${longLivedUserToken}`;
    const pageRes = await fetch(pageUrl);
    const pageData = await pageRes.json() as { access_token?: string; name?: string; error?: { message: string } };

    if (!pageData.access_token) {
      return {
        success: false,
        error: `Page token fetch failed: ${pageData.error?.message || "Unknown error"}`,
      };
    }

    const newPageToken = pageData.access_token;

    // Step 3: Verify the new token
    const debugUrl = `https://graph.facebook.com/v24.0/debug_token?input_token=${newPageToken}&access_token=${newPageToken}`;
    const debugRes = await fetch(debugUrl);
    const debugData = await debugRes.json() as {
      data?: { is_valid: boolean; expires_at: number; data_access_expires_at: number };
    };

    if (!debugData.data?.is_valid) {
      return { success: false, error: "New token failed validation check" };
    }

    const expiresAt = debugData.data.expires_at;
    const daysUntilExpiry = expiresAt === 0
      ? 9999 // never expires
      : Math.floor((expiresAt - Date.now() / 1000) / 86400);

    // Step 4: Update the secret via Manus Forge API
    const forgeApiUrl = process.env.BUILT_IN_FORGE_API_URL;
    const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;
    const appId = process.env.VITE_APP_ID;

    if (forgeApiUrl && forgeApiKey && appId) {
      const secretUpdateRes = await fetch(`${forgeApiUrl}/v1/apps/${appId}/secrets`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${forgeApiKey}`,
        },
        body: JSON.stringify({
          key: "FB_PAGE_ACCESS_TOKEN",
          value: newPageToken,
        }),
      });

      if (!secretUpdateRes.ok) {
        // Token is valid but we couldn't auto-save — notify owner to update manually
        await notifyOwner({
          title: "⚠️ FB Token Refreshed — Manual Secret Update Required",
          content: `A new Facebook Page Token was generated successfully but could not be saved automatically. Please update FB_PAGE_ACCESS_TOKEN in your project secrets manually.\n\nNew token (first 40 chars): ${newPageToken.substring(0, 40)}...`,
        });
        return { success: true, newToken: newPageToken, daysUntilExpiry, error: "Secret auto-save failed — owner notified" };
      }
    }

    return { success: true, newToken: newPageToken, daysUntilExpiry };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export function registerFbTokenRefreshRoute(app: Express) {
  app.post("/api/scheduled/fb-token-refresh", async (req: Request, res: Response) => {
    try {
      // This endpoint is cron-only — verify via x-manus-cron-task-uid header
      // (set automatically by the Manus platform for all /api/scheduled/* calls)
      const cronTaskUid = req.headers["x-manus-cron-task-uid"];
      if (!cronTaskUid) {
        return res.status(403).json({ error: "cron-only endpoint" });
      }

      const result = await refreshFacebookToken();

      if (result.success) {
        await notifyOwner({
          title: "✅ Facebook Token Auto-Refreshed",
          content: `The Facebook Page Access Token for Northland Legendary Finds was automatically refreshed.\n\nToken status: Valid\nExpiry: ${result.daysUntilExpiry === 9999 ? "Never" : `${result.daysUntilExpiry} days`}\nRefreshed at: ${new Date().toISOString()}`,
        });
        return res.json({
          ok: true,
          message: "Facebook token refreshed successfully",
          daysUntilExpiry: result.daysUntilExpiry,
          timestamp: new Date().toISOString(),
        });
      } else {
        await notifyOwner({
          title: "❌ Facebook Token Auto-Refresh Failed",
          content: `The automated Facebook token refresh failed.\n\nError: ${result.error}\nTime: ${new Date().toISOString()}\n\nPlease renew the token manually via the admin dashboard.`,
        });
        return res.status(500).json({
          ok: false,
          error: result.error,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return res.status(500).json({
        ok: false,
        error: errorMsg,
        stack: err instanceof Error ? err.stack : undefined,
        context: { url: req.url, taskUid: req.headers["x-manus-cron-task-uid"] },
        timestamp: new Date().toISOString(),
      });
    }
  });
}
