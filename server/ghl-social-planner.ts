/**
 * GoHighLevel Social Planner API integration
 * Post and schedule content to Facebook/Instagram via GHL Social Planner
 * Uses Private Integration Token (GHL_API_KEY) for authentication
 */
import { ENV } from "./_core/env";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

// ==================== TYPES ====================

export type GHLSocialAccount = {
  id: string;
  name: string;
  avatar?: string;
  type: string; // facebook, instagram, google, etc.
  platform?: string;
  locationId?: string;
  meta?: {
    pageId?: string;
    pageName?: string;
    instagramId?: string;
  };
};

export type GHLSocialAccountGroup = {
  id: string;
  name: string;
  accounts: GHLSocialAccount[];
};

export type GHLSocialPost = {
  id: string;
  accountIds: string[];
  summary?: string;
  status: string;
  type: string;
  scheduleDate?: string;
  media?: { url: string; type: string }[];
  followUpComment?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  errors?: string[];
};

export type CreatePostInput = {
  accountIds: string[];
  summary: string;
  media?: { url: string; type: "image" | "video" }[];
  status: "draft" | "scheduled" | "published";
  scheduleDate?: string;
  type?: "post" | "story" | "reel";
  followUpComment?: string;
  userId?: string;
};

// ==================== API FUNCTIONS ====================

/**
 * Check if GHL Social Planner is configured
 */
export function isSocialPlannerConfigured(): boolean {
  return !!(ENV.ghlApiKey && ENV.ghlLocationId);
}

/**
 * Get connected social media accounts for the location
 */
export async function getSocialAccounts(): Promise<{
  success: boolean;
  accounts?: GHLSocialAccount[];
  groups?: GHLSocialAccountGroup[];
  error?: string;
}> {
  if (!ENV.ghlApiKey || !ENV.ghlLocationId) {
    return { success: false, error: "GHL credentials not configured" };
  }

  try {
    const response = await fetch(
      `${GHL_API_BASE}/social-media-posting/${ENV.ghlLocationId}/accounts`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ENV.ghlApiKey}`,
          Version: GHL_API_VERSION,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[GHL Social] Get accounts failed (${response.status}): ${errorText}`);
      return { success: false, error: `GHL API error: ${response.status}` };
    }

    const data = await response.json();
    return {
      success: true,
      accounts: data.accounts || [],
      groups: data.groups || [],
    };
  } catch (error) {
    console.error("[GHL Social] Get accounts error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Create a social media post (publish immediately or schedule)
 */
export async function createSocialPost(input: CreatePostInput): Promise<{
  success: boolean;
  postId?: string;
  post?: GHLSocialPost;
  error?: string;
}> {
  if (!ENV.ghlApiKey || !ENV.ghlLocationId) {
    return { success: false, error: "GHL credentials not configured" };
  }

  try {
    const body: Record<string, any> = {
      accountIds: input.accountIds,
      summary: input.summary,
      status: input.status,
      type: input.type || "post",
    };

    if (input.media && input.media.length > 0) {
      body.media = input.media.map((m) => ({
        url: m.url,
        type: m.type,
      }));
    }

    if (input.scheduleDate) {
      body.scheduleDate = input.scheduleDate;
    }

    if (input.followUpComment) {
      body.followUpComment = input.followUpComment;
    }

    if (input.userId) {
      body.userId = input.userId;
    }

    const response = await fetch(
      `${GHL_API_BASE}/social-media-posting/${ENV.ghlLocationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${ENV.ghlApiKey}`,
          Version: GHL_API_VERSION,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[GHL Social] Create post failed (${response.status}): ${errorText}`);
      return { success: false, error: `GHL API error: ${response.status} - ${errorText}` };
    }

    const data = await response.json();
    return {
      success: true,
      postId: data.id || data.post?.id,
      post: data.post || data,
    };
  } catch (error) {
    console.error("[GHL Social] Create post error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Get posts from the social planner
 */
export async function getSocialPosts(opts?: {
  limit?: number;
  offset?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<{
  success: boolean;
  posts?: GHLSocialPost[];
  total?: number;
  error?: string;
}> {
  if (!ENV.ghlApiKey || !ENV.ghlLocationId) {
    return { success: false, error: "GHL credentials not configured" };
  }

  const params = new URLSearchParams();
  if (opts?.limit) params.set("limit", opts.limit.toString());
  if (opts?.offset) params.set("offset", opts.offset.toString());
  if (opts?.status) params.set("status", opts.status);
  if (opts?.fromDate) params.set("fromDate", opts.fromDate);
  if (opts?.toDate) params.set("toDate", opts.toDate);

  try {
    const url = `${GHL_API_BASE}/social-media-posting/${ENV.ghlLocationId}/posts${params.toString() ? "?" + params.toString() : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ENV.ghlApiKey}`,
        Version: GHL_API_VERSION,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[GHL Social] Get posts failed (${response.status}): ${errorText}`);
      return { success: false, error: `GHL API error: ${response.status}` };
    }

    const data = await response.json();
    return {
      success: true,
      posts: data.posts || [],
      total: data.total || 0,
    };
  } catch (error) {
    console.error("[GHL Social] Get posts error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Delete a social post
 */
export async function deleteSocialPost(postId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!ENV.ghlApiKey || !ENV.ghlLocationId) {
    return { success: false, error: "GHL credentials not configured" };
  }

  try {
    const response = await fetch(
      `${GHL_API_BASE}/social-media-posting/${ENV.ghlLocationId}/post/${postId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ENV.ghlApiKey}`,
          Version: GHL_API_VERSION,
        },
      }
    );

    if (!response.ok) {
      return { success: false, error: `GHL API error: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error("[GHL Social] Delete post error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
