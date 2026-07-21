import 'dotenv/config';

const PAGE_ID = process.env.FB_PAGE_ID;
const ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

const articleUrl = 'https://northlandlegendaryfinds.com/mcu-news/avengers-doomsday-trailer-missing-characters-collectors-guide';

const message = `The Doomsday trailer showed us 25 heroes assembled against Doctor Doom.

But some of the biggest names in the MCU are nowhere to be found.

Doctor Strange. Spider-Man. Wolverine. Deadpool. Hulk.

Marvel doesn't hide characters unless they have something BIG planned. Here's who's missing, why they're being hidden, and what it means for the card market.

🔗 Read the full breakdown: ${articleUrl}

#AvengersAssemble #AvengersDoomsday #DoctorDoom #MCU #MarvelStudios #DoctorStrange #SpiderMan #Wolverine #Deadpool #Hulk #MarvelCards #NorthlandLegendaryFinds`;

// Post to Facebook
const url = `https://graph.facebook.com/v21.0/${PAGE_ID}/feed`;
const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message,
    link: articleUrl,
    access_token: ACCESS_TOKEN
  })
});

const data = await res.json();
if (data.id) {
  console.log('✅ Facebook post published!');
  console.log('   Post ID:', data.id);
  
  // Now add a follow-up comment
  const commentUrl = `https://graph.facebook.com/v21.0/${data.id}/comments`;
  const commentRes = await fetch(commentUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Follow our page for daily MCU news, card market intel, and giveaways! 🎁\n\n${articleUrl}`,
      access_token: ACCESS_TOKEN
    })
  });
  const commentData = await commentRes.json();
  if (commentData.id) {
    console.log('✅ Follow-up comment posted!');
    console.log('   Comment ID:', commentData.id);
  } else {
    console.log('⚠️ Comment failed:', JSON.stringify(commentData));
  }
} else {
  console.log('❌ Post failed:', JSON.stringify(data));
}

process.exit(0);
