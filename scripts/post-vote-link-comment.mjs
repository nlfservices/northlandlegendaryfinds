import dotenv from 'dotenv';
dotenv.config();

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const PAGE_ID = process.env.FB_PAGE_ID;

// Get the most recent post (the Starkbucks post)
const postsRes = await fetch(
  `https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=id,message,created_time&limit=3&access_token=${PAGE_ACCESS_TOKEN}`
);
const posts = await postsRes.json();

if (!posts.data || posts.data.length === 0) {
  console.log('No posts found');
  process.exit(1);
}

const targetPost = posts.data[0];
console.log('Posting comment on:', targetPost.id);
console.log('Post preview:', targetPost.message?.slice(0, 80));

const comment = `Fans are already weighing in — don't let them decide for you. 🗳️ VOTE now and let the NLF community know what YOU think!\n\n👉 https://northlandlegendaryfinds.com/mcu-news/doomsday-trailer-prediction-why-everyone-is-wrong-june-2026`;

const commentRes = await fetch(
  `https://graph.facebook.com/v19.0/${targetPost.id}/comments`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: comment, access_token: PAGE_ACCESS_TOKEN }),
  }
);
const result = await commentRes.json();
console.log('Comment result:', JSON.stringify(result, null, 2));
