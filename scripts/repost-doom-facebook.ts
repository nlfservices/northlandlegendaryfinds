/**
 * Delete old Doom post and repost as a photo post (boostable)
 */
import { storagePut } from '../server/storage';
import fs from 'fs';

const API_VERSION = "v24.0";
const GRAPH_URL = `https://graph.facebook.com/${API_VERSION}`;

async function main() {
  const pageId = process.env.FB_PAGE_ID;
  const token = process.env.FB_PAGE_ACCESS_TOKEN;

  if (!pageId || !token) {
    console.error("Missing FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN");
    process.exit(1);
  }

  // Step 1: Delete the old post (ID from the Ads Manager screenshot)
  const oldPostId = "122126689179174463";
  console.log(`Deleting old post: ${oldPostId}...`);
  
  try {
    const deleteRes = await fetch(`${GRAPH_URL}/${oldPostId}?access_token=${token}`, {
      method: "DELETE",
    });
    const deleteResult = await deleteRes.json();
    if (deleteResult.success) {
      console.log("✅ Old post deleted");
    } else {
      console.log("⚠️ Could not delete old post (may already be deleted):", JSON.stringify(deleteResult));
    }
  } catch (err: any) {
    console.log("⚠️ Delete error (continuing anyway):", err.message);
  }

  // Step 2: Upload DoomCards7 image to S3 for a public URL
  const imageBuffer = fs.readFileSync('/home/ubuntu/upload/DoomCards7.jpg');
  const { url: imageUrl } = await storagePut('social/doom-cards-7-fb.jpg', imageBuffer, 'image/jpeg');
  console.log(`Image uploaded to: ${imageUrl}`);

  // Step 3: Create new photo post
  const message = `🚨 OVER $100K IN DOCTOR DOOM CARDS SOLD ON EBAY THIS WEEK. 🚨

Read that again. One hundred thousand dollars. In one week. On one character.

The Russo Brothers just dropped a cryptic green image tagging RDJ and Marvel Studios. SXSW London is Monday. Insiders are saying "He Who Remains already won." And the card market is responding VIOLENTLY.

Orange Refractors. Gold Parallels. 1/1 Sketch Cards. Numbered SSPs. ALL moving. ALL climbing. Supply is vanishing fast.

Here's the reality: there simply aren't enough Doctor Doom cards for everyone who's going to want one. Doomsday hits theaters in 7 months. Secret Wars follows in December 2027. That's 18 months of Doctor Doom dominating the MCU — and the supply is already drying up.

Full breakdown with real data and analysis 👇

https://northlandlegendaryfinds.com/mcu-news/avengers-doomsday-weekly-russo-brothers-sxsw-doom-card-market-may-2026

#DoctorDoom #AvengersDoomsday #SecretWars #MarvelCards #ToppsMarvel #TradingCards #CardMarket #RDJ #RussoBrothers`;

  console.log("Publishing new photo post...");
  
  const postRes = await fetch(`${GRAPH_URL}/${pageId}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: imageUrl,
      message: message,
      access_token: token,
    }),
  });

  const postResult = await postRes.json();

  if (postResult.id) {
    console.log(`✅ New photo post published!`);
    console.log(`   Photo ID: ${postResult.id}`);
    console.log(`   Post ID: ${postResult.post_id || 'check page'}`);
    
    // Step 4: Add follow-up comment
    const postId = postResult.post_id || postResult.id;
    
    // Wait a moment for the post to propagate
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const comment = `The craziest part? This is just eBay Buy It Now sales. This doesn't include auction sales, private sales, or what's moving on platforms like Whatnot and MySlabs. The real number is probably 2-3x this.

And here's something to think about — with PSA's turnaround times stretching out right now, having cards sit in grading for a while might actually work in your favor. By the time your Doom cards come back slabbed, we could be right in the middle of trailer season or even closer to the movie. Timing might accidentally be perfect.

There just aren't enough cards for everyone. Enjoy those base refractors while you can still find them. Once the mainstream catches on, the supply that's left is going to get eaten alive.

We're tracking this weekly. Our Hot Picks series drops soon — follow this page so you don't miss it. We're also doing killer card giveaways for our community. 🔥

👉 https://northlandlegendaryfinds.com/mcu-news

Who's already holding Doom cards? Drop it below 👇

#DoctorDoom #MarvelCollector #ToppsChrome #PSA #CardInvesting #AvengersDoomsday2026 #SecretWars2027 #MCU #NorthlandLegendaryFinds #TradingCardMarket #MarvelMint`;

    const commentRes = await fetch(`${GRAPH_URL}/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: comment,
        access_token: token,
      }),
    });

    const commentResult = await commentRes.json();
    if (commentResult.id) {
      console.log(`✅ Follow-up comment posted! ID: ${commentResult.id}`);
    } else {
      console.log("⚠️ Comment issue:", JSON.stringify(commentResult));
    }
  } else {
    console.error("❌ Post failed:", JSON.stringify(postResult));
  }
}

main().then(() => process.exit(0));
