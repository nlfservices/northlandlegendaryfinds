/**
 * Regenerate featured images for existing blog articles using realistic photography style
 * Targets articles that don't have layoutTemplate set (legacy articles with old cosmic images)
 */
import 'dotenv/config';

async function main() {
  console.log('=== Regenerate Blog Images — Realistic Photography Style ===\n');
  
  const { generateImage } = await import('../server/_core/imageGeneration.ts');
  const { getDb } = await import('../server/db.ts');
  const { blogPosts } = await import('../drizzle/schema.ts');
  const { eq, isNull } = await import('drizzle-orm');
  const db = await getDb();

  // Get all published articles that don't have a layoutTemplate (legacy articles)
  const legacyPosts = await db.select({
    id: blogPosts.id,
    title: blogPosts.title,
    slug: blogPosts.slug,
    category: blogPosts.category,
    featuredImageUrl: blogPosts.featuredImageUrl,
  })
  .from(blogPosts)
  .where(isNull(blogPosts.layoutTemplate))
  .orderBy(blogPosts.id);

  console.log(`Found ${legacyPosts.length} legacy articles to regenerate images for.\n`);

  const PROMPTS_BY_CATEGORY = {
    market_trends: "Professional product photography of several Marvel trading cards and sealed wax packs arranged on a dark wood desk next to a laptop showing a price chart, warm natural lighting, shallow depth of field, realistic photo style, no text no letters no words",
    character_spotlight: "Close-up macro photograph of a single graded Marvel trading card in a PSA slab case standing upright on a dark felt surface, soft studio lighting with bokeh background, realistic product photography, no text no letters no words",
    grading_guide: "Flat-lay photograph of a collector's desk with Marvel trading cards, a magnifying loupe, and a grading submission form on dark leather surface, overhead shot, warm ambient lighting, no text no letters no words",
    set_breakdown: "Overhead flat-lay photograph of an opened box of Marvel trading cards with several packs and loose cards spread across a dark surface, natural daylight from a window, realistic product photography, no text no letters no words",
    investment_strategy: "Professional photograph of a hand holding a graded Marvel trading card slab with a blurred stock chart on a monitor in the background, shallow depth of field, warm office lighting, no text no letters no words",
    collecting_tips: "Lifestyle photograph of a father and son at a kitchen table sorting through Marvel trading cards together, warm natural window light, candid moment, shallow depth of field, no text no letters no words",
    nlf_news: "Product photography of a sealed Marvel trading card repack box on a clean dark surface with dramatic side lighting, professional studio shot, shallow depth of field, no text no letters no words",
    behind_the_scenes: "Behind-the-scenes photograph of hands carefully sorting and organizing Marvel trading cards into protective sleeves on a work table, warm overhead lighting, candid documentary style, no text no letters no words",
    card_history: "Vintage-style photograph of classic Marvel trading cards from different eras arranged chronologically on aged wood, warm nostalgic lighting, shallow depth of field, no text no letters no words",
    sports_crossover: "Product photography of Marvel trading cards displayed next to sports trading cards on a dark surface, showing the crossover appeal, warm studio lighting, no text no letters no words",
  };

  const FALLBACK_PROMPT = "Professional product photography of several Marvel trading cards arranged on a dark surface with warm natural lighting, shallow depth of field, realistic photo style, no text no letters no words";

  let successCount = 0;
  let failCount = 0;

  for (const post of legacyPosts) {
    console.log(`[${successCount + failCount + 1}/${legacyPosts.length}] "${post.title}"`);
    
    const prompt = PROMPTS_BY_CATEGORY[post.category] || FALLBACK_PROMPT;
    
    let newImageUrl = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const usePrompt = attempt === 1 ? prompt : FALLBACK_PROMPT;
        console.log(`   🖼️ Attempt ${attempt}/3...`);
        const result = await generateImage({ prompt: usePrompt });
        if (result.url) {
          newImageUrl = result.url;
          break;
        }
      } catch (err) {
        console.error(`   ❌ Attempt ${attempt} failed:`, err.message?.substring(0, 80));
        if (attempt < 3) await new Promise(r => setTimeout(r, 3000 * attempt));
      }
    }

    if (newImageUrl) {
      await db.update(blogPosts)
        .set({ featuredImageUrl: newImageUrl })
        .where(eq(blogPosts.id, post.id));
      successCount++;
      console.log(`   ✅ Updated!`);
    } else {
      failCount++;
      console.log(`   ❌ All attempts failed, keeping old image.`);
    }

    // Delay between requests
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`\n=== Image Regeneration Complete ===`);
  console.log(`   ✅ Success: ${successCount}/${legacyPosts.length}`);
  console.log(`   ❌ Failed: ${failCount}/${legacyPosts.length}`);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
