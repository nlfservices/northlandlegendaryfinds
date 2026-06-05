/**
 * Facebook Bot — Post Monitor
 *
 * Two responsibilities:
 * 1. registerPostForMonitoring() — called immediately after any post goes live on Facebook.
 *    Inserts a row into fb_monitored_posts so the polling job knows to watch it.
 *
 * 2. pollAllMonitoredPosts() — called by the Heartbeat cron every 5 minutes.
 *    Fetches comments on every active monitored post and passes new ones to processComment().
 *
 * This approach is simpler and more reliable than the Facebook Webhook:
 * - No webhook setup required
 * - Works immediately after deploy
 * - Handles posts published from any source (Social Drafts, Post Generator, etc.)
 */

import { getDb } from "./db";
import { fbMonitoredPosts, botSettings } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { getPostComments } from "./facebook-api";
import { processComment } from "./bot-reply-generator";

/**
 * Register a Facebook post for comment monitoring.
 * Call this immediately after publishPost() or publishPhotoPost() succeeds.
 *
 * @param fbPostId - The Facebook post ID returned by the Graph API
 * @param articleSlug - Optional: the article slug this post was generated from
 * @param postSummary - Optional: short description for the admin UI
 */
export async function registerPostForMonitoring(opts: {
  fbPostId: string;
  articleSlug?: string;
  postSummary?: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[BotMonitor] DB unavailable — could not register post:", opts.fbPostId);
    return;
  }

  try {
    await db
      .insert(fbMonitoredPosts)
      .values({
        fbPostId: opts.fbPostId,
        articleSlug: opts.articleSlug || null,
        postSummary: opts.postSummary?.slice(0, 500) || null,
        active: true,
        publishedAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          // If somehow registered twice, just keep it active
          active: true,
        },
      });

    console.log(`[BotMonitor] Registered post for monitoring: ${opts.fbPostId}`);
  } catch (err: any) {
    console.error("[BotMonitor] Failed to register post:", err.message);
  }
}

/**
 * Poll all active monitored posts for new comments.
 * Called by the Heartbeat cron every 5 minutes.
 *
 * Returns a summary of what was processed.
 */
export async function pollAllMonitoredPosts(): Promise<{
  postsChecked: number;
  newComments: number;
  repliesSent: number;
  repliesQueued: number;
  errors: string[];
}> {
  const db = await getDb();
  if (!db) {
    return { postsChecked: 0, newComments: 0, repliesSent: 0, repliesQueued: 0, errors: ["DB unavailable"] };
  }

  // Check if bot is enabled
  const settingsRows = await db.select().from(botSettings).limit(1);
  const settings = settingsRows[0];
  if (!settings?.enabled) {
    console.log("[BotMonitor] Bot is disabled, skipping poll");
    return { postsChecked: 0, newComments: 0, repliesSent: 0, repliesQueued: 0, errors: [] };
  }

  // Get all active monitored posts
  const posts = await db
    .select()
    .from(fbMonitoredPosts)
    .where(eq(fbMonitoredPosts.active, true));

  if (posts.length === 0) {
    console.log("[BotMonitor] No monitored posts, nothing to poll");
    return { postsChecked: 0, newComments: 0, repliesSent: 0, repliesQueued: 0, errors: [] };
  }

  let newComments = 0;
  let repliesSent = 0;
  let repliesQueued = 0;
  const errors: string[] = [];

  for (const post of posts) {
    try {
      // Fetch comments from Facebook Graph API
      const commentsResult = await getPostComments(post.fbPostId, 100);

      if (!commentsResult.success) {
        // If we get a "does not exist" error, deactivate the post
        if (commentsResult.error?.includes("does not exist") ||
            commentsResult.error?.includes("OAuthException")) {
          await db
            .update(fbMonitoredPosts)
            .set({ active: false })
            .where(eq(fbMonitoredPosts.id, post.id));
          console.log(`[BotMonitor] Deactivated post ${post.fbPostId}: ${commentsResult.error}`);
        } else {
          errors.push(`Post ${post.fbPostId}: ${commentsResult.error}`);
        }
        continue;
      }

      const comments = commentsResult.comments || [];
      let postNewComments = 0;
      let postRepliesSent = 0;
      let postRepliesQueued = 0;

      // Process each comment
      for (const comment of comments) {
        const commentedAt = new Date(comment.created_time);

        const result = await processComment({
          fbPostId: post.fbPostId,
          fbCommentId: comment.id,
          commenterName: comment.from?.name || "Anonymous",
          commentText: comment.message,
          commentedAt,
          postContext: post.postSummary || undefined,
        });

        if (result.action === "replied") {
          postNewComments++;
          postRepliesSent++;
        } else if (result.action === "queued") {
          postNewComments++;
          postRepliesQueued++;
        } else if (result.action === "skipped") {
          // Only count as "new" if it wasn't already_processed
          postNewComments++;
        }
        // "already_processed" doesn't count as new
      }

      newComments += postNewComments;
      repliesSent += postRepliesSent;
      repliesQueued += postRepliesQueued;

      // Update the monitored post with latest stats
      await db
        .update(fbMonitoredPosts)
        .set({
          lastPolledAt: new Date(),
          commentCount: comments.length,
          replyCount: (post.replyCount || 0) + postRepliesSent,
        })
        .where(eq(fbMonitoredPosts.id, post.id));

      console.log(
        `[BotMonitor] Post ${post.fbPostId}: ${comments.length} comments, ` +
        `${postRepliesSent} replied, ${postRepliesQueued} queued`
      );
    } catch (err: any) {
      errors.push(`Post ${post.fbPostId}: ${err.message}`);
      console.error(`[BotMonitor] Error polling post ${post.fbPostId}:`, err.message);
    }
  }

  console.log(
    `[BotMonitor] Poll complete: ${posts.length} posts, ${newComments} new comments, ` +
    `${repliesSent} replied, ${repliesQueued} queued`
  );

  return {
    postsChecked: posts.length,
    newComments,
    repliesSent,
    repliesQueued,
    errors,
  };
}
