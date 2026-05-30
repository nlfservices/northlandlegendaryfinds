const PAGE_ID = process.env.FB_PAGE_ID!;
const PAGE_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN!;
const IG_ACCOUNT_ID = process.env.IG_BUSINESS_ACCOUNT_ID;

const IMAGE_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/wqJVWDZPiPznzJxB.jpg';

const mainCaption = `WHO YOU GOT? 🟣⚔️🟠

Vibranium vs Adamantium. The King of Wakanda vs the Weapon X experiment.

Black Panther's suit absorbs every hit and redirects it back. Wolverine's claws cut through literally anything — and he heals from whatever T'Challa throws at him.

One's a genius tactician with an entire nation backing him. The other is an unkillable animal who's been fighting wars for 200 years.

Drop your pick below 👇

Full breakdown: https://northlandlegendaryfinds.com/mcu-news/who-would-win-black-panther-vs-wolverine

#BlackPanther #Wolverine #WhoYouGot #MarvelComics #Vibranium`;

const followUpComment = `Here's the real question — can adamantium claws cut vibranium? In the comics, the answer isn't as simple as you think. We broke it all down in the full article.

Read it here: https://northlandlegendaryfinds.com/mcu-news/who-would-win-black-panther-vs-wolverine

#Adamantium #Vibranium #XMen #Avengers #MarvelDebate #MCU #ComicBooks #MarvelCollector #WhoWouldWin`;

const igCaption = `WHO YOU GOT? 🟣⚔️🟠

Vibranium vs Adamantium. The King of Wakanda vs the Weapon X experiment.

Black Panther's suit absorbs every hit and redirects it back. Wolverine's claws cut through literally anything — and he heals from whatever T'Challa throws at him.

One's a genius tactician with an entire nation backing him. The other is an unkillable animal who's been fighting wars for 200 years.

Drop your pick below 👇

Full breakdown at northlandlegendaryfinds.com/mcu-news

#BlackPanther #Wolverine #WhoYouGot #MarvelComics #Vibranium #Adamantium #XMen #Avengers #MarvelDebate #MCU #ComicBooks #MarvelCollector #WhoWouldWin`;

async function main() {
  // === FACEBOOK POST ===
  console.log('📘 Posting to Facebook...');
  
  const photoRes = await fetch(
    `https://graph.facebook.com/v21.0/${PAGE_ID}/photos?access_token=${PAGE_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: IMAGE_URL,
        message: mainCaption,
      }),
    }
  );
  const photoData = await photoRes.json() as any;
  console.log('Facebook photo post:', JSON.stringify(photoData));
  
  if (photoData.post_id || photoData.id) {
    const postId = photoData.post_id || photoData.id;
    console.log(`✅ Facebook post live! ID: ${postId}`);
    
    const commentRes = await fetch(
      `https://graph.facebook.com/v21.0/${postId}/comments?access_token=${PAGE_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: followUpComment }),
      }
    );
    const commentData = await commentRes.json() as any;
    console.log(`✅ Follow-up comment posted! ID: ${commentData.id}`);
  } else {
    console.error('❌ Facebook post failed:', photoData);
  }

  // === INSTAGRAM POST ===
  console.log('\n📸 Posting to Instagram...');
  
  if (!IG_ACCOUNT_ID) {
    console.log('⚠️ No IG_BUSINESS_ACCOUNT_ID configured, skipping Instagram');
    return;
  }

  const igContainerRes = await fetch(
    `https://graph.facebook.com/v21.0/${IG_ACCOUNT_ID}/media?access_token=${PAGE_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: IMAGE_URL,
        caption: igCaption,
      }),
    }
  );
  const igContainerData = await igContainerRes.json() as any;
  console.log('IG container:', JSON.stringify(igContainerData));

  if (igContainerData.id) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const igPublishRes = await fetch(
      `https://graph.facebook.com/v21.0/${IG_ACCOUNT_ID}/media_publish?access_token=${PAGE_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: igContainerData.id,
        }),
      }
    );
    const igPublishData = await igPublishRes.json() as any;
    console.log(`✅ Instagram post live! ID: ${igPublishData.id}`);
  } else {
    console.error('❌ Instagram container creation failed:', igContainerData);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
