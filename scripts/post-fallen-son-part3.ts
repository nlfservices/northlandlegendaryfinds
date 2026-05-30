const PAGE_ID = process.env.FB_PAGE_ID!;
const PAGE_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN!;
const IG_ACCOUNT_ID = process.env.IG_BUSINESS_ACCOUNT_ID;

const IMAGE_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/HIGVGUDmhKoeleXZ.png';

const mainCaption = `This Memorial Day weekend, we're wrapping up our Fallen Son series — and the timing couldn't be more fitting.

Steve Rogers gave everything. Not for glory. Not for power. For the idea that people deserve better.

In Part 3, Sam Wilson delivers the eulogy no one was ready for. The Arctic farewell. The moment the Marvel Universe had to accept that Captain America was gone — and decide what his legacy actually means.

Whether it's fiction or reality, Memorial Day is about honoring those who gave everything for something bigger than themselves. Cap embodied that.

Read the full breakdown:
https://northlandlegendaryfinds.com/mcu-news/fallen-son-part-3-acceptance-legacy-sam-wilson-iron-man

#FallenSon #CaptainAmerica #MemorialDay #MarvelComics #SamWilson`;

const followUpComment = `This wraps up our 3-part Fallen Son series. If you missed the earlier chapters:

Part 1 — Denial & Anger (Wolverine sees the body, Avengers break): https://northlandlegendaryfinds.com/mcu-news/fallen-son-part-1-denial-anger-wolverine-avengers-captain-america

Part 2 — Bargaining & Depression (Hawkeye's choice, Spider-Man's darkest hour): https://northlandlegendaryfinds.com/mcu-news/fallen-son-part-2-bargaining-depression-hawkeye-spider-man

Thank you to everyone who followed along. Cap would be proud of this community. 🇺🇸

#SpiderMan #Hawkeye #Wolverine #FallenSon #MarvelComics #Avengers #MCU #ComicBooks #MarvelCollector #MemorialDay`;

const igCaption = `This Memorial Day weekend, we're wrapping up our Fallen Son series — and the timing couldn't be more fitting.

Steve Rogers gave everything. Not for glory. Not for power. For the idea that people deserve better.

In Part 3, Sam Wilson delivers the eulogy no one was ready for. The Arctic farewell. The moment the Marvel Universe had to accept that Captain America was gone — and decide what his legacy actually means.

Whether it's fiction or reality, Memorial Day is about honoring those who gave everything for something bigger than themselves. Cap embodied that.

Full breakdown — link in bio or visit northlandlegendaryfinds.com/mcu-news

#FallenSon #CaptainAmerica #MemorialDay #MarvelComics #SamWilson #CivilWar #Avengers #MCU #ComicBooks #MarvelCollector #SpiderMan #Hawkeye #Wolverine`;

async function main() {
  // === FACEBOOK POST ===
  console.log('📘 Posting to Facebook...');
  
  // Step 1: Upload photo
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
    
    // Step 2: Add follow-up comment
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

  // Step 1: Create media container
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
    // Step 2: Wait a moment for processing
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Step 3: Publish the container
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
