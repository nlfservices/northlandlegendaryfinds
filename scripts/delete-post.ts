/**
 * Delete the duplicate Fallen Son post (generic /mcu-news link)
 */

const API_VERSION = "v24.0";
const GRAPH_URL = `https://graph.facebook.com/${API_VERSION}`;
const token = process.env.FB_PAGE_ACCESS_TOKEN;

// The first Fallen Son post with generic /mcu-news link
const postId = "951323751392043_122125997157174463";

async function main() {
  if (!token) {
    console.error("No FB_PAGE_ACCESS_TOKEN found");
    process.exit(1);
  }

  console.log(`Deleting post ${postId}...`);

  const response = await fetch(`${GRAPH_URL}/${postId}?access_token=${token}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("❌ Failed to delete:", JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log("✅ Post deleted successfully!", result);
}

main();
