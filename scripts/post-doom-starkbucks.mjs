import { config } from 'dotenv';
config();

const PAGE_ID = process.env.FB_PAGE_ID;
const TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

const POST_TEXT = `In 1980, nobody knew Darth Vader was Luke's father before they sat down in that theater.

Joe Russo said that's exactly what he wanted for Endgame — walk in blind, know nothing. He's now making Avengers: Doomsday.

Everyone's predicting when the trailer drops. We think they're all missing the bigger question 👇

🔗 https://northlandlegendaryfinds.com/mcu-news/doomsday-trailer-prediction-why-everyone-is-wrong-june-2026`;

const FIRST_COMMENT = `Joe Russo's exact words in 2019: "When I was a kid and saw The Empire Strikes Back at 11am on the day it opened, and sat there until 10pm watching it back to back to back, it so profoundly moved me because I didn't know a damn thing about the story."

He's making Doomsday now. That quote hits different. 🎬

Trailer before December or radio silence all the way to opening night — what do you think? 👇`;

const IMAGE_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/TiCRDTREBquRUugY.png';

async function run() {
  // Step 1: Upload photo as unpublished
  const uploadRes = await fetch(
    `https://graph.facebook.com/v19.0/${PAGE_ID}/photos?access_token=${TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: IMAGE_URL, published: false }),
    }
  );
  const uploadData = await uploadRes.json();
  console.log('UPLOAD:', JSON.stringify(uploadData));

  if (!uploadData.id) {
    console.error('Image upload failed:', JSON.stringify(uploadData));
    process.exit(1);
  }

  const photoId = uploadData.id;

  // Step 2: Create post with attached photo
  const postRes = await fetch(
    `https://graph.facebook.com/v19.0/${PAGE_ID}/feed?access_token=${TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: POST_TEXT,
        attached_media: [{ media_fbid: photoId }],
      }),
    }
  );
  const postData = await postRes.json();
  console.log('POST:', JSON.stringify(postData));

  if (!postData.id) {
    console.error('Post creation failed:', JSON.stringify(postData));
    process.exit(1);
  }

  const postId = postData.id;

  // Step 3: Add first comment after a short delay
  await new Promise(r => setTimeout(r, 3000));
  const commentRes = await fetch(
    `https://graph.facebook.com/v19.0/${postId}/comments?access_token=${TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: FIRST_COMMENT }),
    }
  );
  const commentData = await commentRes.json();
  console.log('COMMENT:', JSON.stringify(commentData));

  console.log('\n✅ Done! Post ID:', postId);
}

run().catch(console.error);
