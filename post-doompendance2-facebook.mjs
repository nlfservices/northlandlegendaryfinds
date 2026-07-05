/**
 * Post Doompendance Day Part 2 to Facebook with image + follow-up comment
 * Run from project root: node post-doompendance2-facebook.mjs
 */
import 'dotenv/config';

const API_VERSION = "v24.0";
const GRAPH_URL = `https://graph.facebook.com/${API_VERSION}`;
const PAGE_ID = process.env.FB_PAGE_ID;
const TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

if (!PAGE_ID || !TOKEN) {
  console.error("❌ FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN not set");
  process.exit(1);
}

const IMAGE_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/gmhLWldqkVBTRvmk.jpg";

const POST_MESSAGE = `Freedom vs. control ♟️

Marvel just made the Doom vs. Captain America rivalry official canon — and it started with Cap infiltrating Doom's castle the moment he woke up from the ice.

Now they're trapped in Hell together 🗡️

Who wins in a 1v1? Drop it below ⚔️`;

const COMMENT_MESSAGE = `We broke down the full rivalry — from their first fight to being stuck in Hell together 🗡️
https://northlandlegendaryfinds.com/mcu-news/doompendance-day-doom-vs-captain-america

Follow us for daily Marvel card content ♟️`;

async function main() {
  // Step 1: Publish photo post
  console.log("📸 Publishing photo post...");
  const photoResponse = await fetch(`${GRAPH_URL}/${PAGE_ID}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: IMAGE_URL,
      message: POST_MESSAGE,
      access_token: TOKEN,
    }),
  });
  const photoResult = await photoResponse.json();

  if (!photoResponse.ok) {
    console.error("❌ Photo post failed:", JSON.stringify(photoResult, null, 2));
    process.exit(1);
  }

  const postId = photoResult.post_id || photoResult.id;
  console.log(`✅ Photo posted! Post ID: ${postId}`);

  // Step 2: Wait a moment then add follow-up comment
  console.log("⏳ Waiting 10 seconds before commenting...");
  await new Promise(r => setTimeout(r, 10000));

  console.log("💬 Adding follow-up comment...");
  const commentResponse = await fetch(`${GRAPH_URL}/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: COMMENT_MESSAGE,
      access_token: TOKEN,
    }),
  });
  const commentResult = await commentResponse.json();

  if (!commentResponse.ok) {
    console.error("❌ Comment failed:", JSON.stringify(commentResult, null, 2));
    console.log("ℹ️ Post was published successfully, but comment failed. You may need to add it manually.");
    process.exit(1);
  }

  console.log(`✅ Comment posted! Comment ID: ${commentResult.id}`);
  console.log("\n🎉 Done! Post + comment are live on your Facebook page.");
}

main().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
