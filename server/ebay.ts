/**
 * eBay API Helper
 * - OAuth 2.0 Client Credentials token management
 * - Browse API search for active listing price comps
 * - Account deletion notification endpoint handlers
 */

import { ENV } from "./_core/env";
import crypto from "crypto";

// ==================== TOKEN MANAGEMENT ====================

interface EbayToken {
  accessToken: string;
  expiresAt: number; // Unix timestamp in ms
}

let cachedToken: EbayToken | null = null;

/**
 * Determine if we should use sandbox or production credentials.
 * Falls back to sandbox if production secret is not configured.
 */
function getEbayCredentials() {
  const useSandbox =
    !ENV.ebayClientSecret ||
    ENV.ebayClientSecret === "PENDING_PRODUCTION_UNLOCK";

  if (useSandbox) {
    return {
      clientId: ENV.ebaySandboxClientId,
      clientSecret: ENV.ebaySandboxClientSecret,
      baseUrl: "https://api.sandbox.ebay.com",
      tokenUrl: "https://api.sandbox.ebay.com/identity/v1/oauth2/token",
      isSandbox: true,
    };
  }

  return {
    clientId: ENV.ebayClientId,
    clientSecret: ENV.ebayClientSecret,
    baseUrl: "https://api.ebay.com",
    tokenUrl: "https://api.ebay.com/identity/v1/oauth2/token",
    isSandbox: false,
  };
}

/**
 * Get a valid OAuth 2.0 access token, refreshing if expired.
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  const creds = getEbayCredentials();
  const basicAuth = Buffer.from(
    `${creds.clientId}:${creds.clientSecret}`
  ).toString("base64");

  console.log(
    `[eBay] Requesting OAuth token (${creds.isSandbox ? "sandbox" : "production"})...`
  );

  const response = await fetch(creds.tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[eBay] Token request failed: ${response.status}`, errorText);
    throw new Error(`eBay OAuth failed: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
    token_type: string;
  };

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  console.log(
    `[eBay] Token obtained, expires in ${data.expires_in}s`
  );

  return cachedToken.accessToken;
}

// ==================== BROWSE API SEARCH ====================

export interface EbaySearchParams {
  query: string;
  grade?: string;
  category?: string; // default: trading card singles
  limit?: number;
  offset?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface EbayListingItem {
  itemId: string;
  title: string;
  price: number;
  currency: string;
  condition: string;
  imageUrl: string;
  itemUrl: string;
  seller: string;
  sellerFeedback: string;
  buyingOptions: string[];
  listingDate?: string;
}

export interface EbaySearchResult {
  items: EbayListingItem[];
  total: number;
  offset: number;
  limit: number;
  priceSummary: {
    low: number;
    high: number;
    average: number;
    median: number;
    count: number;
  } | null;
  isSandbox: boolean;
  source: "browse_api";
}

/**
 * Search eBay Browse API for active listings matching the query.
 * Returns items with price summary statistics.
 */
export async function searchEbayListings(
  params: EbaySearchParams
): Promise<EbaySearchResult> {
  const token = await getAccessToken();
  const creds = getEbayCredentials();

  // Build search query - append grade if specified
  let searchQuery = params.query;
  if (params.grade) {
    searchQuery += ` ${params.grade}`;
  }

  // Trading Card Singles category ID
  const categoryId = params.category || "183050";

  // Build filter string
  const filters: string[] = [];
  filters.push("buyingOptions:{FIXED_PRICE|BEST_OFFER|AUCTION}");

  if (params.minPrice !== undefined) {
    filters.push(`price:[${params.minPrice}..${params.maxPrice || ""}],priceCurrency:USD`);
  } else if (params.maxPrice !== undefined) {
    filters.push(`price:[..${params.maxPrice}],priceCurrency:USD`);
  }

  const queryParams = new URLSearchParams({
    q: searchQuery,
    category_ids: categoryId,
    limit: String(params.limit || 50),
    offset: String(params.offset || 0),
    sort: params.sort || "price",
    filter: filters.join(","),
  });

  const url = `${creds.baseUrl}/buy/browse/v1/item_summary/search?${queryParams}`;

  console.log(`[eBay] Searching: ${searchQuery} (${creds.isSandbox ? "sandbox" : "production"})`);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[eBay] Search failed: ${response.status}`, errorText);
    throw new Error(`eBay search failed: ${response.status}`);
  }

  const data = (await response.json()) as any;

  // Parse items from response
  const items: EbayListingItem[] = (data.itemSummaries || []).map(
    (item: any) => ({
      itemId: item.itemId || "",
      title: item.title || "",
      price: parseFloat(item.price?.value || "0"),
      currency: item.price?.currency || "USD",
      condition: item.condition || "Not Specified",
      imageUrl: item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl || "",
      itemUrl: item.itemWebUrl || item.itemAffiliateWebUrl || "",
      seller: item.seller?.username || "Unknown",
      sellerFeedback: item.seller?.feedbackPercentage || "N/A",
      buyingOptions: item.buyingOptions || [],
      listingDate: item.itemCreationDate || undefined,
    })
  );

  // Calculate price summary
  let priceSummary = null;
  if (items.length > 0) {
    const prices = items.map((i) => i.price).filter((p) => p > 0).sort((a, b) => a - b);
    if (prices.length > 0) {
      const sum = prices.reduce((acc, p) => acc + p, 0);
      const mid = Math.floor(prices.length / 2);
      const median =
        prices.length % 2 === 0
          ? (prices[mid - 1] + prices[mid]) / 2
          : prices[mid];

      priceSummary = {
        low: prices[0],
        high: prices[prices.length - 1],
        average: Math.round((sum / prices.length) * 100) / 100,
        median: Math.round(median * 100) / 100,
        count: prices.length,
      };
    }
  }

  return {
    items,
    total: data.total || items.length,
    offset: data.offset || 0,
    limit: data.limit || params.limit || 50,
    priceSummary,
    isSandbox: creds.isSandbox,
    source: "browse_api",
  };
}

// ==================== ACCOUNT DELETION HANDLERS ====================

/**
 * Handle eBay GET challenge for account deletion endpoint verification.
 * eBay sends: GET /api/ebay/account-deletion?challenge_code=xxx
 * We must respond with: { challengeResponse: sha256(challenge_code + verification_token + endpoint_url) }
 */
export function handleDeletionChallenge(challengeCode: string): {
  challengeResponse: string;
} {
  const verificationToken = ENV.ebayVerificationToken;
  const endpointUrl = ENV.ebayDeletionEndpointUrl;

  if (!verificationToken || !endpointUrl) {
    console.error("[eBay] Missing verification token or endpoint URL for challenge");
    throw new Error("eBay verification not configured");
  }

  // Per eBay docs: SHA-256 hash of challengeCode + verificationToken + endpoint URL
  const hash = crypto
    .createHash("sha256")
    .update(challengeCode + verificationToken + endpointUrl)
    .digest("hex");

  console.log(`[eBay] Challenge response generated for code: ${challengeCode.substring(0, 8)}...`);

  return { challengeResponse: hash };
}

/**
 * Handle eBay POST notification for marketplace account deletion.
 * Logs the notification and acknowledges receipt.
 */
export function handleDeletionNotification(body: any): { success: boolean } {
  console.log("[eBay] Account deletion notification received:", JSON.stringify(body, null, 2));

  // Extract notification details
  const metadata = body?.metadata || {};
  const notification = body?.notification || {};

  console.log(`[eBay] Deletion notification - Topic: ${metadata?.topic}, EventDate: ${notification?.eventDate}`);

  // Since we don't store eBay user data beyond API calls,
  // we just acknowledge the notification
  return { success: true };
}

// ==================== UTILITY ====================

/**
 * Test the eBay API connection by requesting a token.
 */
export async function testEbayConnection(): Promise<{
  success: boolean;
  environment: string;
  message: string;
}> {
  try {
    const token = await getAccessToken();
    const creds = getEbayCredentials();
    return {
      success: true,
      environment: creds.isSandbox ? "sandbox" : "production",
      message: `Connected to eBay ${creds.isSandbox ? "Sandbox" : "Production"} API`,
    };
  } catch (error: any) {
    return {
      success: false,
      environment: "unknown",
      message: `Connection failed: ${error.message}`,
    };
  }
}
