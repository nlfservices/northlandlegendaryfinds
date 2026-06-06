import { config } from 'dotenv';
config();

const PAGE_ID = process.env.FB_PAGE_ID;
const TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

const IMAGE_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/TYpZJDfEJGjNSkpr.png';

const POST_TEXT = `IGN said SXSW London. Wrong. ❌

Now every hype account on the internet is screaming SDCC. 🤔

But what if they're ALL missing the point?

Joe Russo once said he wanted to release ZERO marketing for Endgame — no trailer, no footage, just walk in blind. He's making Doomsday now.

What do YOU think is really going on? 👇

Check out what the Russo Brothers actually said — it changes everything 👇

🔗 https://northlandlegendaryfinds.com/mcu-news/doomsday-trailer-prediction-why-everyone-is-wrong-june-2026`;

const COMMENT_TEXT = `Fans are already weighing in — don't let the hype accounts decide for you. 🗳️

VOTE below and let the NLF community know what YOU think:

👍 = Trailer drops at SDCC
❤️ = Radio silence all the way to opening night

The Russos wanted to do this with Endgame. They compromised. This time? We're not so sure they will. 🎬

Drop your vote and read the full breakdown 👇

👉 https://northlandlegendaryfinds.com/mcu-news/doomsday-trailer-prediction-why-everyone-is-wrong-june-2026`;

// Step 1: Upload the image as unpublished photo
console.log('Uploading image...');
const photoRes = await fetch(
  `https://graph.facebook.com/v19.0/${PAGE_ID}/photos?access_token=${TOKEN}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: IMAGE_URL,
      published: false,
    }),
  }
);
const photoData = await photoRes.json();
console.log('Photo upload:', JSON.stringify(photoData));

if (!photoData.id) {
  console.error('Failed to upload photo');
  process.exit(1);
}

// Step 2: Create the post with the photo attached — no call_to_action
console.log('Creating post...');
const postRes = await fetch(
  `https://graph.facebook.com/v19.0/${PAGE_ID}/feed?access_token=${TOKEN}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: POST_TEXT,
      attached_media: [{ media_fbid: photoData.id }],
      // No call_to_action field = no button
    }),
  }
);
const postData = await postRes.json();
console.log('Post result:', JSON.stringify(postData));

if (!postData.id) {
  console.error('Failed to create post');
  process.exit(1);
}

// Step 3: Post the follow-up comment
console.log('Posting comment...');
const commentRes = await fetch(
  `https://graph.facebook.com/v19.0/${postData.id}/comments?access_token=${TOKEN}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: COMMENT_TEXT }),
  }
);
const commentData = await commentRes.json();
console.log('Comment result:', JSON.stringify(commentData));

console.log('\n✅ Done!');
console.log('Post ID:', postData.id);
console.log('Comment ID:', commentData.id);
