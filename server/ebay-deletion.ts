/**
 * eBay Marketplace Account Deletion/Closure Notification Endpoint
 *
 * Required by eBay to enable production API keys.
 * Handles:
 * - GET /api/ebay/account-deletion?challenge_code=xxx  (verification challenge)
 * - POST /api/ebay/account-deletion                     (deletion notifications)
 *
 * See: https://developer.ebay.com/marketplace-account-deletion
 */

import type { Express, Request, Response } from "express";
import { handleDeletionChallenge, handleDeletionNotification } from "./ebay";

export function registerEbayDeletionEndpoint(app: Express) {
  // GET handler: eBay sends a challenge to verify the endpoint
  app.get(
    "/api/ebay/account-deletion",
    (req: Request, res: Response) => {
      const challengeCode = req.query.challenge_code as string;

      if (!challengeCode) {
        console.warn("[eBay Deletion] GET request without challenge_code");
        return res.status(400).json({ error: "Missing challenge_code parameter" });
      }

      try {
        const response = handleDeletionChallenge(challengeCode);
        console.log("[eBay Deletion] Challenge verified successfully");
        // Must return 200 with JSON body containing challengeResponse
        return res.status(200).json(response);
      } catch (error: any) {
        console.error("[eBay Deletion] Challenge verification failed:", error.message);
        return res.status(500).json({ error: "Challenge verification failed" });
      }
    }
  );

  // POST handler: eBay sends account deletion/closure notifications
  app.post(
    "/api/ebay/account-deletion",
    (req: Request, res: Response) => {
      try {
        console.log("[eBay Deletion] Received POST notification");
        const result = handleDeletionNotification(req.body);

        if (result.success) {
          // Must return 200 to acknowledge receipt
          return res.status(200).json({ status: "acknowledged" });
        } else {
          return res.status(500).json({ error: "Failed to process notification" });
        }
      } catch (error: any) {
        console.error("[eBay Deletion] Error processing notification:", error.message);
        // Still return 200 to prevent eBay from retrying endlessly
        return res.status(200).json({ status: "acknowledged_with_error" });
      }
    }
  );

  console.log("[eBay] Account deletion endpoint registered at /api/ebay/account-deletion");
}
