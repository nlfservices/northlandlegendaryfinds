/**
 * Post "Build Your Repack" community engagement post to Facebook
 * Run from project root: node post-build-your-repack-fb.mjs
 */
import 'dotenv/config';

const PAGE_ID = process.env.FB_PAGE_ID;
const TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const GRAPH_URL = "https://graph.facebook.com/v21.0";

if (!PAGE_ID || !TOKEN) {
  console.error("FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN not set");
  process.exit(1);
}

const message = `We're building something — and we need YOUR help.

We're designing our next repack series from scratch, and instead of guessing what you want inside... we're asking.

Single graded slab? Slab + sealed packs? Mystery tiers? What characters are you chasing? What sets do you want to rip?

We built a quick page where you can vote on exactly what goes inside. Takes less than a minute, no account needed.

Tell us what you actually want:
https://northlandlegendaryfinds.com/build-your-repack

Your vote directly shapes what we build. This isn't a poll that gets ignored — we're using the results to design the product.

Drop a comment below too if you've got ideas we didn't think of.

#Marvel #MarvelCards #TradingCards #Topps #ToppsChrome #MarvelCollector #CardCollector #Repacks #NorthlandLegendaryFinds #MCU #DoctorDoom #SpiderMan #Wolverine`;

const link = "https://northlandlegendaryfinds.com/build-your-repack";

async function main() {
  console.log("Publishing Facebook post...");
  console.log("---");
  console.log(message);
  console.log("---");

  const body = {
    message,
    link,
    access_token: TOKEN,
  };

  const response = await fetch(`${GRAPH_URL}/${PAGE_ID}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("❌ Post failed:", JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log(`✅ Post published! ID: ${result.id}`);
  console.log(`   View: https://facebook.com/${result.id}`);

  // Now post a follow-up comment with the direct link
  const postId = result.id;
  const commentMessage = `Vote here → https://northlandlegendaryfinds.com/build-your-repack\n\nNo account needed. Takes 30 seconds. We'll build what you vote for.`;

  const commentResponse = await fetch(`${GRAPH_URL}/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: commentMessage,
      access_token: TOKEN,
    }),
  });

  const commentResult = await commentResponse.json();
  if (commentResponse.ok) {
    console.log(`✅ Follow-up comment posted! ID: ${commentResult.id}`);
  } else {
    console.error("⚠️ Comment failed:", JSON.stringify(commentResult, null, 2));
  }
}

main().catch(console.error);
