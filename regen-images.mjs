/**
 * Regenerate images for blog posts that are missing them
 * Uses direct DB access and image generation
 */
import 'dotenv/config';

// Dynamic import to handle the TS compilation
const { getBlogPostsWithoutImages, updateBlogPost } = await import('./server/db.ts');
const { generateImage } = await import('./server/_core/imageGeneration.ts');

async function generateImageWithRetry(imagePrompt, title, category, maxRetries = 3) {
  const FALLBACK_PROMPTS = {
    market_trends: "A dramatic cosmic scene with Marvel trading cards floating in space surrounded by golden price charts and upward arrows, dark background with purple nebula, investment theme",
    character_spotlight: "A single glowing Marvel trading card hovering in a dark cosmic void with energy beams radiating outward, collector spotlight theme",
    grading_guide: "A pristine graded trading card in a protective slab case under a magnifying glass with golden light, professional grading inspection theme, dark background",
    set_breakdown: "A spread of colorful Marvel trading cards fanned out on a dark surface with dramatic lighting, set collection theme with cosmic background",
    investment_strategy: "A vault door opening to reveal glowing Marvel trading cards inside, investment and treasure theme, dark dramatic lighting with gold accents",
    collecting_tips: "A collector's desk with Marvel trading cards, protective sleeves, and a magnifying glass, warm lighting, organized collection theme",
    nlf_news: "The Northland Legendary Finds logo glowing with cosmic energy against a dark space background with green and purple nebula",
    behind_the_scenes: "A workstation with stacks of Marvel trading cards being sorted and graded, behind the scenes workshop theme, warm professional lighting",
    card_history: "Vintage Marvel trading cards from the 1990s arranged in a nostalgic display with aged paper texture and warm sepia tones, history theme",
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let prompt = imagePrompt;
      if (attempt === 2) {
        prompt = `A visually striking illustration related to: ${title}. Marvel trading cards theme, dark cosmic background with vibrant colors.`;
      } else if (attempt >= 3) {
        prompt = FALLBACK_PROMPTS[category] || FALLBACK_PROMPTS.market_trends;
      }

      console.log(`  Attempt ${attempt}/${maxRetries}...`);
      const imgResult = await generateImage({ prompt });
      if (imgResult.url) {
        console.log(`  ✓ Success on attempt ${attempt}`);
        return imgResult.url;
      }
    } catch (err) {
      console.error(`  ✗ Attempt ${attempt} failed:`, err.message);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }
  return null;
}

async function main() {
  console.log("Checking for blog posts without images...\n");
  
  const posts = await getBlogPostsWithoutImages();
  console.log(`Found ${posts.length} posts without images.\n`);
  
  if (posts.length === 0) {
    console.log("All posts have images! Nothing to do.");
    process.exit(0);
  }

  let fixed = 0;
  let failed = 0;

  for (const post of posts) {
    console.log(`\nProcessing: "${post.title}" (${post.category})`);
    
    const imagePrompt = `A visually striking, high-quality illustration for a blog article titled "${post.title}". Marvel trading cards theme, dark cosmic background with vibrant green and purple energy, professional and eye-catching.`;
    
    const imageUrl = await generateImageWithRetry(
      imagePrompt,
      post.title,
      post.category || "market_trends"
    );

    if (imageUrl) {
      await updateBlogPost(post.id, { featuredImageUrl: imageUrl });
      fixed++;
      console.log(`  ✓ Image saved for post ${post.id}`);
    } else {
      failed++;
      console.log(`  ✗ Could not generate image for post ${post.id}`);
    }

    // Delay between generations
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log(`\n=== DONE ===`);
  console.log(`Fixed: ${fixed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${posts.length}`);
  
  process.exit(0);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
