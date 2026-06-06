import { config } from 'dotenv';
config();

const PAGE_ID = process.env.FB_PAGE_ID;
const TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

// Step 1: Check current call_to_action on the page
console.log('Checking current Page CTA...');
const checkRes = await fetch(
  `https://graph.facebook.com/v19.0/${PAGE_ID}?fields=call_to_actions&access_token=${TOKEN}`
);
const checkData = await checkRes.json();
console.log('Current CTA:', JSON.stringify(checkData, null, 2));

// Step 2: Update the Page CTA to "Learn More"
console.log('\nUpdating Page CTA to Learn More...');
const updateRes = await fetch(
  `https://graph.facebook.com/v19.0/${PAGE_ID}/call_to_actions?access_token=${TOKEN}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'LEARN_MORE',
      web_destination_type: 'WEBSITE',
      website_url: 'https://northlandlegendaryfinds.com',
    }),
  }
);
const updateData = await updateRes.json();
console.log('Update result:', JSON.stringify(updateData, null, 2));

if (updateData.id || updateData.success) {
  console.log('\n✅ Page CTA updated to "Learn More" successfully!');
} else {
  console.log('\n⚠️ Response received — check above for details');
}
