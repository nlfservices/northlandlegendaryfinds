import dotenv from 'dotenv';
dotenv.config();

const FB_PAGE_ID = process.env.FB_PAGE_ID;
const FB_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const IG_ACCOUNT_ID = process.env.IG_BUSINESS_ACCOUNT_ID;

const IMAGE_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/PGOYWGqWaVmdhFQZ.png';
const ARTICLE_URL = 'https://northlandlegendaryfinds.com/mcu-news/pedro-pascal-mandalorian-reed-richards-fantastic-four-doomsday';
const FALLEN_SON_URL = 'https://northlandlegendaryfinds.com/mcu-news/fallen-son-part-1-denial-anger-wolverine-avengers-captain-america';

const POST_MESSAGE = `This Is The Way... To The Baxter Building.

Pedro Pascal is about to own TWO franchises at the same time. The Mandalorian & Grogu is NOW in theaters, and Avengers: Doomsday drops this December with Pascal as Reed Richards.

So we gotta ask...

Who are you more excited for — Mando or Mr. Fantastic?

(And no, you can't say Doctor Doom... even though that's obviously everyone's real answer.)

We break down Pascal's insane 2026 run, what it means for the card market, and why collectors should be paying attention RIGHT NOW:

${ARTICLE_URL}

Drop your answer below and follow Northland Legendary Finds for daily MCU news and card market intel.

#PedroPascal #Mandalorian #MandoAndGrogu #ReedRichards #FantasticFour #AvengersDoomsday #DoctorDoom #StarWars #Marvel #MCU #TradingCards #MarvelCards #NorthlandLegendaryFinds`;

const FIRST_COMMENT = `We're going Mando on this one. There's something about seeing that beskar armor on the big screen that just hits different. Plus Grogu in IMAX? Come on.

But ask us again after Doomsday drops... we might change our answer real quick.

What Pedro Pascal cards are you holding? We've got some INSANE pulls in the vault right now — 1/1 SuperFractor, dual autos with Galactus, the works. Check the article for the full collection showcase.

Speaking of epic storylines — check out our Fallen Son: The Death of Captain America deep dive:
${FALLEN_SON_URL}`;

const IG_CAPTION = `This Is The Way... To The Baxter Building.

Pedro Pascal is about to own TWO franchises at the same time. The Mandalorian & Grogu is NOW in theaters, and Avengers: Doomsday drops this December with Pascal as Reed Richards.

Who are you more excited for — Mando or Mr. Fantastic?

(And no, you can't say Doctor Doom... even though that's obviously everyone's real answer.)

We break down Pascal's insane 2026 run, what it means for the card market, and why collectors should be paying attention RIGHT NOW. Link in bio!

Drop your answer below and follow @northlandlegendaryfinds for daily MCU news and card market intel.

#PedroPascal #Mandalorian #MandoAndGrogu #ReedRichards #FantasticFour #AvengersDoomsday #DoctorDoom #StarWars #Marvel #MCU #TradingCards #MarvelCards #NorthlandLegendaryFinds #CardCollector #ToppsChrome #MarvelStudios`;

async function postToFacebook() {
  console.log('=== POSTING TO FACEBOOK ===');
  
  // Post photo with message
  const fbUrl = `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/photos`;
  const fbResponse = await fetch(fbUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: IMAGE_URL,
      message: POST_MESSAGE,
      access_token: FB_TOKEN
    })
  });
  
  const fbData = await fbResponse.json();
  if (fbData.error) {
    console.error('Facebook Error:', fbData.error.message);
    return null;
  }
  
  console.log('Facebook post SUCCESS! Post ID:', fbData.post_id || fbData.id);
  
  // Now add the first comment
  const postId = fbData.post_id || fbData.id;
  if (postId) {
    const commentUrl = `https://graph.facebook.com/v19.0/${postId}/comments`;
    const commentResponse = await fetch(commentUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: FIRST_COMMENT,
        access_token: FB_TOKEN
      })
    });
    const commentData = await commentResponse.json();
    if (commentData.error) {
      console.error('Comment Error:', commentData.error.message);
    } else {
      console.log('First comment posted! Comment ID:', commentData.id);
    }
  }
  
  return postId;
}

async function postToInstagram() {
  console.log('\n=== POSTING TO INSTAGRAM ===');
  
  // Step 1: Create media container
  const containerUrl = `https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media`;
  const containerResponse = await fetch(containerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: IMAGE_URL,
      caption: IG_CAPTION,
      access_token: FB_TOKEN
    })
  });
  
  const containerData = await containerResponse.json();
  if (containerData.error) {
    console.error('Instagram Container Error:', containerData.error.message);
    return null;
  }
  
  console.log('Instagram container created:', containerData.id);
  
  // Step 2: Wait a moment for processing
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Step 3: Publish the container
  const publishUrl = `https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media_publish`;
  const publishResponse = await fetch(publishUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: containerData.id,
      access_token: FB_TOKEN
    })
  });
  
  const publishData = await publishResponse.json();
  if (publishData.error) {
    console.error('Instagram Publish Error:', publishData.error.message);
    return null;
  }
  
  console.log('Instagram post SUCCESS! Media ID:', publishData.id);
  return publishData.id;
}

// Run both
try {
  const fbPostId = await postToFacebook();
  const igPostId = await postToInstagram();
  
  console.log('\n=== SUMMARY ===');
  console.log('Facebook:', fbPostId ? 'SUCCESS' : 'FAILED');
  console.log('Instagram:', igPostId ? 'SUCCESS' : 'FAILED');
} catch (err) {
  console.error('Error:', err.message);
}

process.exit(0);
