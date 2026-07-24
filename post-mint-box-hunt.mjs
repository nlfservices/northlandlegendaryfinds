import 'dotenv/config';

const PAGE_ID = process.env.FB_PAGE_ID;
const ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

const message = `🔥 ON THE HUNT: 2026 Topps Marvel Mint Boxes 🔥

Live from San Diego Comic-Con — if anyone has 2026 Topps Marvel Mint boxes or knows where to find them, hit us up! 

Last year's set gave us 1/1 Comic Cuts, encased Chrome Refractors, and some of the most beautiful Marvel cards ever made. The 2026 set with Spider-Man on the cover? We need those boxes.

Dallas Card Show ✅
Cards dropped for grading in Florida ✅
SDCC this week 🎯
The National next week 🎯

If you're at Comic-Con and spot any Mint boxes — tag us or DM. Let's go! 🕷

#ToppsMarvelMint #SDCC2026 #MarvelCards #TradingCards #ToppsChrome #SpiderMan #MarvelCollector #CardCollector #NorthlandLegendaryFinds`;

const imageUrl = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/LlcCWbycjDEGZMmn.png';

// Post photo with message
const url = `https://graph.facebook.com/v21.0/${PAGE_ID}/photos?access_token=${ACCESS_TOKEN}`;

const formData = new URLSearchParams();
formData.append('url', imageUrl);
formData.append('message', message);

const res = await fetch(url, {
  method: 'POST',
  body: formData,
});

const data = await res.json();
if (data.id || data.post_id) {
  console.log('✅ Facebook post published!');
  console.log('Post ID:', data.post_id || data.id);
} else {
  console.error('❌ Error:', JSON.stringify(data, null, 2));
}
