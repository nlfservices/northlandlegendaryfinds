/**
 * Facebook & Instagram Graph API — Social Posting Module
 *
 * Publishes posts (text, links, photos) to the NLF Facebook Page
 * and Instagram Business Account via the Graph API.
 *
 * Required env vars:
 *   FB_PAGE_ACCESS_TOKEN — Long-lived Page Access Token
 *   FB_PAGE_ID — Facebook Page ID
 *   IG_BUSINESS_ACCOUNT_ID — Instagram Business Account ID
 */

const API_VERSION = "v24.0";
const GRAPH_URL = `https://graph.facebook.com/${API_VERSION}`;

function getPageId(): string {
  return process.env.FB_PAGE_ID || "";
}

function getPageToken(): string {
  return process.env.FB_PAGE_ACCESS_TOKEN || "";
}

function getInstagramId(): string {
  return process.env.IG_BUSINESS_ACCOUNT_ID || "";
}

/**
 * Check if Facebook posting is configured
 */
export function isFacebookConfigured(): boolean {
  return !!(getPageId() && getPageToken());
}

/**
 * Check if Instagram posting is configured
 */
export function isInstagramConfigured(): boolean {
  return !!(getInstagramId() && getPageToken());
}

/**
 * Check token health — returns expiration info and validity
 */
export async function checkTokenHealth(): Promise<{
  valid: boolean;
  expiresAt: number | null;
  daysRemaining: number | null;
  scopes: string[];
  error?: string;
}> {
  const token = getPageToken();
  if (!token) {
    return { valid: false, expiresAt: null, daysRemaining: null, scopes: [], error: "No token configured" };
  }

  try {
    const response = await fetch(
      `${GRAPH_URL}/debug_token?input_token=${token}&access_token=${token}`
    );
    const result = await response.json();

    if (!response.ok || result.data?.error) {
      return {
        valid: false,
        expiresAt: null,
        daysRemaining: null,
        scopes: [],
        error: result.data?.error?.message || result.error?.message || "Token validation failed",
      };
    }

    const data = result.data;
    const expiresAt = data.expires_at || 0;
    const isValid = data.is_valid === true;
    const scopes = data.scopes || [];

    let daysRemaining: number | null = null;
    if (expiresAt === 0) {
      daysRemaining = 9999; // Never expires
    } else {
      const now = Math.floor(Date.now() / 1000);
      daysRemaining = Math.floor((expiresAt - now) / 86400);
    }

    return {
      valid: isValid,
      expiresAt,
      daysRemaining,
      scopes,
    };
  } catch (err: any) {
    return {
      valid: false,
      expiresAt: null,
      daysRemaining: null,
      scopes: [],
      error: err.message,
    };
  }
}

/**
 * Publish a text post (with optional link) to the Facebook Page
 */
export async function publishPost(opts: {
  message: string;
  link?: string;
  scheduledTime?: number;
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
 * Publish a photo post to Instagram Business Account
 * Instagram Content Publishing API requires a 2-step process:
 * 1. Create a media container
 * 2. Publish the container
 */
export async function publishInstagramPost(opts: {
  caption: string;
  imageUrl: string; // Must be a publicly accessible URL
}): Promise<{ success: boolean; mediaId?: string; error?: string }> {
  const igId = getInstagramId();
  const token = getPageToken();

  if (!igId || !token) {
    return {
      success: false,
      error: "Instagram not configured. Set IG_BUSINESS_ACCOUNT_ID and FB_PAGE_ACCESS_TOKEN.",
    };
  }

  try {
    // Step 1: Create media container
    const containerResponse = await fetch(`${GRAPH_URL}/${igId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: opts.imageUrl,
        caption: opts.caption,
        access_token: token,
      }),
    });
    const containerResult = await containerResponse.json();

    if (!containerResponse.ok) {
      console.error("[Instagram API] Container error:", JSON.stringify(containerResult));
      return {
        success: false,
        error: containerResult.error?.message || `HTTP ${containerResponse.status}`,
      };
    }

    const containerId = containerResult.id;
    console.log(`[Instagram API] Media container created: ${containerId}`);

    // Step 2: Wait for processing, then check status
    await new Promise(resolve => setTimeout(resolve, 5000));

    let retries = 0;
    while (retries < 10) {
      const statusResponse = await fetch(
        `${GRAPH_URL}/${containerId}?fields=status_code&access_token=${token}`
      );
      const statusResult = await statusResponse.json();
      if (statusResult.status_code === "FINISHED") break;
      if (statusResult.status_code === "ERROR") {
        return { success: false, error: "Instagram media processing failed" };
      }
      retries++;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Step 3: Publish the container
    const publishResponse = await fetch(`${GRAPH_URL}/${igId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: token,
      }),
    });
    const publishResult = await publishResponse.json();

    if (!publishResponse.ok) {
      console.error("[Instagram API] Publish error:", JSON.stringify(publishResult));
      return {
        success: false,
        error: publishResult.error?.message || `HTTP ${publishResponse.status}`,
      };
    }

    console.log(`[Instagram API] Post published: ${publishResult.id}`);
    return { success: true, mediaId: publishResult.id };
  } catch (err: any) {
    console.error("[Instagram API] Network error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Get recent posts from the Facebook Page
 */
export async function getRecentPosts(limit: number = 10): Promise<{
  success: boolean;
  posts?: Array<{ id: string; message?: string; created_time: string; full_picture?: string }>;
  error?: string;
}> {
  const pageId = getPageId();
  const token = getPageToken();

  if (!pageId || !token) {
    return { success: false, error: "Facebook Page not configured." };
  }

  try {
    const response = await fetch(
      `${GRAPH_URL}/${pageId}/feed?fields=id,message,created_time,full_picture&limit=${limit}&access_token=${token}`,
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

/**
 * Get comments on a specific Facebook post
 * Returns comments with commenter info and timestamps
 */
export async function getPostComments(postId: string, limit: number = 100): Promise<{
  success: boolean;
  comments?: Array<{
    id: string;
    from: { name: string; id: string };
    message: string;
    created_time: string;
  }>;
  error?: string;
}> {
  const token = getPageToken();
  if (!token) {
    return { success: false, error: "No page token configured" };
  }

  try {
    const response = await fetch(
      `${GRAPH_URL}/${postId}/comments?fields=id,from,message,created_time&limit=${limit}&access_token=${token}`,
      { method: "GET" }
    );

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error?.message || `HTTP ${response.status}` };
    }

    return { success: true, comments: result.data || [] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Reply to a comment on a Facebook post (as the Page)
 */
export async function replyToComment(commentId: string, message: string): Promise<{
  success: boolean;
  replyId?: string;
  error?: string;
}> {
  const token = getPageToken();
  if (!token) {
    return { success: false, error: "No page token configured" };
  }

  try {
    const response = await fetch(
      `${GRAPH_URL}/${commentId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          access_token: token,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("[Facebook API] Reply error:", JSON.stringify(result));
      return { success: false, error: result.error?.message || `HTTP ${response.status}` };
    }

    console.log(`[Facebook API] Reply posted: ${result.id}`);
    return { success: true, replyId: result.id };
  } catch (err: any) {
    console.error("[Facebook API] Reply network error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Get recent Instagram posts
 */
export async function getRecentInstagramPosts(limit: number = 10): Promise<{
  success: boolean;
  posts?: Array<{ id: string; caption?: string; timestamp: string; media_url?: string; permalink?: string }>;
  error?: string;
}> {
  const igId = getInstagramId();
  const token = getPageToken();

  if (!igId || !token) {
    return { success: false, error: "Instagram not configured." };
  }

  try {
    const response = await fetch(
      `${GRAPH_URL}/${igId}/media?fields=id,caption,timestamp,media_url,permalink&limit=${limit}&access_token=${token}`,
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
