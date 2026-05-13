/**
 * Facebook Graph API — Page Posting Module
 *
 * Publishes posts (text, links, photos) to the NLF Facebook Page
 * via the Graph API. Requires a long-lived Page Access Token.
 *
 * Required env vars:
 *   FB_PAGE_ACCESS_TOKEN — Long-lived Page Access Token
 *   FB_PAGE_ID — Facebook Page ID
 */

const API_VERSION = "v25.0";
const GRAPH_URL = `https://graph.facebook.com/${API_VERSION}`;

function getPageId(): string {
  return process.env.FB_PAGE_ID || "";
}

function getPageToken(): string {
  return process.env.FB_PAGE_ACCESS_TOKEN || "";
}

/**
 * Check if Facebook posting is configured
 */
export function isFacebookConfigured(): boolean {
  return !!(getPageId() && getPageToken());
}

/**
 * Publish a text post (with optional link) to the Facebook Page
 */
export async function publishPost(opts: {
  message: string;
  link?: string;
  scheduledTime?: number; // Unix timestamp for scheduled posts
}): Promise<{ success: boolean; postId?: string; error?: string }> {
  const pageId = getPageId();
  const token = getPageToken();

  if (!pageId || !token) {
    return {
      success: false,
      error: "Facebook Page not configured. Set FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN.",
    };
  }

  const body: Record<string, any> = {
    message: opts.message,
    access_token: token,
  };

  if (opts.link) {
    body.link = opts.link;
  }

  if (opts.scheduledTime) {
    body.published = false;
    body.scheduled_publish_time = opts.scheduledTime;
  }

  try {
    const response = await fetch(`${GRAPH_URL}/${pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[Facebook API] Post error:", JSON.stringify(result));
      return {
        success: false,
        error: result.error?.message || `HTTP ${response.status}`,
      };
    }

    console.log(`[Facebook API] Post published: ${result.id}`);
    return { success: true, postId: result.id };
  } catch (err: any) {
    console.error("[Facebook API] Network error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Publish a photo post to the Facebook Page
 */
export async function publishPhotoPost(opts: {
  message?: string;
  photoUrl: string;
}): Promise<{ success: boolean; postId?: string; photoId?: string; error?: string }> {
  const pageId = getPageId();
  const token = getPageToken();

  if (!pageId || !token) {
    return {
      success: false,
      error: "Facebook Page not configured. Set FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN.",
    };
  }

  const body: Record<string, any> = {
    url: opts.photoUrl,
    access_token: token,
  };

  if (opts.message) {
    body.message = opts.message;
  }

  try {
    const response = await fetch(`${GRAPH_URL}/${pageId}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[Facebook API] Photo post error:", JSON.stringify(result));
      return {
        success: false,
        error: result.error?.message || `HTTP ${response.status}`,
      };
    }

    console.log(`[Facebook API] Photo posted: ${result.id}, post: ${result.post_id}`);
    return {
      success: true,
      photoId: result.id,
      postId: result.post_id,
    };
  } catch (err: any) {
    console.error("[Facebook API] Network error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Get recent posts from the Facebook Page
 */
export async function getRecentPosts(limit: number = 10): Promise<{
  success: boolean;
  posts?: Array<{ id: string; message?: string; created_time: string }>;
  error?: string;
}> {
  const pageId = getPageId();
  const token = getPageToken();

  if (!pageId || !token) {
    return { success: false, error: "Facebook Page not configured." };
  }

  try {
    const response = await fetch(
      `${GRAPH_URL}/${pageId}/feed?limit=${limit}&access_token=${token}`,
      { method: "GET" }
    );

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error?.message || `HTTP ${response.status}` };
    }

    return { success: true, posts: result.data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
