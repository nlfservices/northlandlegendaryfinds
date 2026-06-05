import dotenv from 'dotenv';
dotenv.config();

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const PAGE_ID = process.env.FB_PAGE_ID;

// Get the most recent post from the page to find the Starkbucks post
async function getRecentPosts() {
  const url = `https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=id,message,created_time&limit=5&access_token=${PAGE_ACCESS_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function postComment(postId, message) {
  const url = `https://graph.facebook.com/v19.0/${postId}/comments`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, access_token: PAGE_ACCESS_TOKEN }),
  });
  const data = await res.json();
  return data;
}

const posts = await getRecentPosts();
console.log('Recent posts:', JSON.stringify(posts, null, 2));

if (posts.data && posts.data.length > 0) {
  // Find the Starkbucks/trailer post (most recent should be it)
  const targetPost = posts.data[0];
  console.log('Posting comment on:', targetPost.id, '-', targetPost.message?.slice(0, 80));

  const comment = "Fans are already weighing in — don't let them decide for you. 🗳️ VOTE in the poll and let the NLF community know what YOU think!";
  const result = await postComment(targetPost.id, comment);
  console.log('Comment result:', JSON.stringify(result, null, 2));
} else {
  console.log('No posts found');
}
