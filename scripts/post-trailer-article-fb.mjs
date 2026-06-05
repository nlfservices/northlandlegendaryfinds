import { publishPhotoPost } from '../server/facebook-api.ts';

const message = `Remember when everyone said the Doomsday trailer was dropping at SDCC? 😂

Don't believe everything you read.

Meanwhile Doom's just over here making lattes at Starkbucks.

But here's the real question — what if there IS no traditional trailer? The Russo Brothers literally considered zero marketing for Endgame. That movie made $2.8 billion.

We wrote the full breakdown 👇

https://northlandlegendaryfinds.com/mcu-news/doomsday-trailer-prediction-why-everyone-is-wrong-june-2026

Will we get a trailer at SDCC or is Marvel playing the long game? Drop your prediction below ⬇️`;

// Doctor Doom in pink apron at Starkbucks - "DOOM DOES NOT MAKE LATTES"
const photoUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fb-doom-starkbucks-aucztXL8NTrSnnw4qSWDTi.png';

async function main() {
  console.log('Publishing photo post to Facebook...');
  const result = await publishPhotoPost({ message, photoUrl });
  if (result.success) {
    console.log('✅ Posted successfully!');
    console.log('Post ID:', result.postId);
    console.log('Photo ID:', result.photoId);
  } else {
    console.error('❌ Failed to post:', result.error);
  }
  process.exit(0);
}

main();
