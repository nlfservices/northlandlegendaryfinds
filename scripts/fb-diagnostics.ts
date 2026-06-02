/**
 * Facebook API Diagnostics — Check token health, permissions, recent posts, and boost eligibility
 */

const API_VERSION = "v24.0";
const GRAPH_URL = `https://graph.facebook.com/${API_VERSION}`;

const token = process.env.FB_PAGE_ACCESS_TOKEN || "";
const pageId = process.env.FB_PAGE_ID || "";

async function run() {
  console.log("=== FACEBOOK API DIAGNOSTICS ===\n");

  // 1. Check if credentials exist
  console.log("1. CREDENTIALS CHECK:");
  console.log(`   FB_PAGE_ID: ${pageId ? `✅ Set (${pageId})` : "❌ MISSING"}`);
  console.log(`   FB_PAGE_ACCESS_TOKEN: ${token ? `✅ Set (${token.substring(0, 20)}...)` : "❌ MISSING"}`);
  console.log(`   IG_BUSINESS_ACCOUNT_ID: ${process.env.IG_BUSINESS_ACCOUNT_ID ? `✅ Set` : "⚠️ Not set"}`);
  console.log();

  if (!token || !pageId) {
    console.log("❌ Cannot proceed without credentials.");
    return;
  }

  // 2. Token debug/health
  console.log("2. TOKEN HEALTH:");
  try {
    const debugRes = await fetch(`${GRAPH_URL}/debug_token?input_token=${token}&access_token=${token}`);
    const debugData = await debugRes.json();

    if (debugData.data) {
      const d = debugData.data;
      console.log(`   Valid: ${d.is_valid ? "✅ Yes" : "❌ NO"}`);
      console.log(`   App ID: ${d.app_id || "N/A"}`);
      console.log(`   Type: ${d.type || "N/A"}`);
      console.log(`   Scopes: ${(d.scopes || []).join(", ")}`);
      
      if (d.expires_at === 0) {
        console.log(`   Expires: Never (long-lived)`);
      } else if (d.expires_at) {
        const expiresDate = new Date(d.expires_at * 1000);
        const daysLeft = Math.floor((d.expires_at - Date.now() / 1000) / 86400);
        console.log(`   Expires: ${expiresDate.toISOString()} (${daysLeft} days remaining)`);
        if (daysLeft < 7) console.log(`   ⚠️ TOKEN EXPIRING SOON!`);
        if (daysLeft < 0) console.log(`   ❌ TOKEN EXPIRED!`);
      }

      // Check for critical permissions
      const scopes = d.scopes || [];
      const needed = ["pages_manage_posts", "pages_read_engagement", "pages_show_list", "pages_read_user_content"];
      const adsNeeded = ["ads_management", "ads_read"];
      console.log("\n   Required permissions:");
      for (const s of needed) {
        console.log(`     ${scopes.includes(s) ? "✅" : "❌"} ${s}`);
      }
      console.log("\n   Ads/Boost permissions:");
      for (const s of adsNeeded) {
        console.log(`     ${scopes.includes(s) ? "✅" : "⚠️ Missing"} ${s}`);
      }
      
      // Check for publish permissions
      const publishPerms = ["publish_video", "pages_manage_metadata", "pages_manage_engagement"];
      console.log("\n   Additional permissions:");
      for (const s of publishPerms) {
        console.log(`     ${scopes.includes(s) ? "✅" : "⚠️"} ${s}`);
      }

      if (d.error) {
        console.log(`\n   ❌ Token Error: ${d.error.message}`);
      }
    } else {
      console.log(`   ❌ Debug failed: ${JSON.stringify(debugData)}`);
    }
  } catch (err: any) {
    console.log(`   ❌ Error checking token: ${err.message}`);
  }

  // 3. Page info
  console.log("\n3. PAGE INFO:");
  try {
    const pageRes = await fetch(`${GRAPH_URL}/${pageId}?fields=name,id,verification_status,is_published,fan_count,category&access_token=${token}`);
    const pageData = await pageRes.json();
    if (pageData.error) {
      console.log(`   ❌ Error: ${pageData.error.message}`);
    } else {
      console.log(`   Name: ${pageData.name}`);
      console.log(`   ID: ${pageData.id}`);
      console.log(`   Published: ${pageData.is_published ? "✅ Yes" : "❌ No"}`);
      console.log(`   Category: ${pageData.category || "N/A"}`);
      console.log(`   Fans: ${pageData.fan_count || 0}`);
      console.log(`   Verification: ${pageData.verification_status || "N/A"}`);
    }
  } catch (err: any) {
    console.log(`   ❌ Error: ${err.message}`);
  }

  // 4. Recent posts
  console.log("\n4. RECENT POSTS (last 5):");
  try {
    const postsRes = await fetch(
      `${GRAPH_URL}/${pageId}/feed?fields=id,message,created_time,full_picture,is_published,status_type,type,shares,likes.summary(true),comments.summary(true)&limit=5&access_token=${token}`
    );
    const postsData = await postsRes.json();

    if (postsData.error) {
      console.log(`   ❌ Error: ${postsData.error.message}`);
    } else if (postsData.data) {
      for (const post of postsData.data) {
        const msg = (post.message || "").substring(0, 80);
        const likes = post.likes?.summary?.total_count || 0;
        const comments = post.comments?.summary?.total_count || 0;
        const shares = post.shares?.count || 0;
        console.log(`\n   Post: ${post.id}`);
        console.log(`   Time: ${post.created_time}`);
        console.log(`   Type: ${post.type || "N/A"} / ${post.status_type || "N/A"}`);
        console.log(`   Published: ${post.is_published !== false ? "✅" : "❌ UNPUBLISHED"}`);
        console.log(`   Text: ${msg}...`);
        console.log(`   Engagement: ${likes} likes, ${comments} comments, ${shares} shares`);
        console.log(`   Image: ${post.full_picture ? "✅ Yes" : "No"}`);
      }
    }
  } catch (err: any) {
    console.log(`   ❌ Error: ${err.message}`);
  }

  // 5. Check if posts made via API have restrictions
  console.log("\n5. API POST VISIBILITY CHECK:");
  try {
    const postsRes = await fetch(
      `${GRAPH_URL}/${pageId}/published_posts?fields=id,message,created_time,is_published,promotion_status,is_eligible_for_promotion&limit=5&access_token=${token}`
    );
    const postsData = await postsRes.json();

    if (postsData.error) {
      console.log(`   ❌ Error: ${postsData.error.message}`);
      console.log(`   (This may indicate missing permissions for promotion status)`);
    } else if (postsData.data) {
      for (const post of postsData.data) {
        const msg = (post.message || "").substring(0, 60);
        console.log(`\n   Post: ${post.id} — "${msg}..."`);
        console.log(`   Published: ${post.is_published !== false ? "✅" : "❌"}`);
        console.log(`   Promotion eligible: ${post.is_eligible_for_promotion !== undefined ? (post.is_eligible_for_promotion ? "✅ Yes" : "❌ NO") : "Unknown"}`);
        if (post.promotion_status) {
          console.log(`   Promotion status: ${JSON.stringify(post.promotion_status)}`);
        }
      }
    }
  } catch (err: any) {
    console.log(`   ❌ Error: ${err.message}`);
  }

  // 6. Check App permissions
  console.log("\n6. APP PERMISSIONS CHECK:");
  try {
    const permRes = await fetch(`${GRAPH_URL}/me/permissions?access_token=${token}`);
    const permData = await permRes.json();
    if (permData.data) {
      const declined = permData.data.filter((p: any) => p.status !== "granted");
      const granted = permData.data.filter((p: any) => p.status === "granted");
      console.log(`   Granted: ${granted.length} permissions`);
      for (const p of granted) {
        console.log(`     ✅ ${p.permission}`);
      }
      if (declined.length > 0) {
        console.log(`\n   Declined/Expired: ${declined.length} permissions`);
        for (const p of declined) {
          console.log(`     ❌ ${p.permission} — ${p.status}`);
        }
      }
    }
  } catch (err: any) {
    console.log(`   ❌ Error: ${err.message}`);
  }

  console.log("\n=== DIAGNOSTICS COMPLETE ===");
}

run().catch(console.error);
