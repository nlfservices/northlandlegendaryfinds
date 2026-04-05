/**
 * Bulk generate 12 articles — one per template (3-12 since 1 & 2 already done)
 * Usage: cd /home/ubuntu/northland-legendary-finds && npx tsx scripts/bulk-generate-12.mjs
 */
import 'dotenv/config';

async function main() {
  console.log('=== ORDER 66 — Bulk Generate 10 Articles (Templates 3-12) ===\n');
  
  const { invokeLLM } = await import('../server/_core/llm.ts');
  const { generateImage } = await import('../server/_core/imageGeneration.ts');
  const { createBlogPost } = await import('../server/db.ts');
  const { 
    NLF_BLOG_SYSTEM_PROMPT, CATEGORY_LABELS,
    getLayoutDataPrompt, BLOG_JSON_SCHEMA_WITH_LAYOUT,
    TEMPLATE_NAMES,
  } = await import('../server/blog-content-strategy.ts');

  const INTERNAL_LINKS = [
    { text: "Browse our card database", url: "/cards" },
    { text: "View our checklists", url: "/checklists" },
    { text: "See our process", url: "/our-process" },
    { text: "Shop NLF repacks", url: "/shop" },
  ];

  const FALLBACK_PROMPTS = [
    "Professional product photography of several Marvel trading cards and sealed wax packs arranged on a dark wood desk next to a laptop showing a price chart, warm natural lighting, shallow depth of field, realistic photo style, no text no letters no words",
    "Close-up macro photograph of a single graded Marvel trading card in a PSA slab case standing upright on a dark felt surface, soft studio lighting with bokeh background, realistic product photography, no text no letters no words",
    "Flat-lay photograph of a collector's desk with Marvel trading cards, a magnifying loupe, and a grading submission form on dark leather surface, overhead shot, warm ambient lighting, no text no letters no words",
    "Lifestyle photograph of a father and son at a kitchen table sorting through Marvel trading cards together, warm natural window light, candid moment, shallow depth of field, no text no letters no words",
  ];

  // Topics mapped to templates 3-12 (templates 1 & 2 already generated)
  const articles = [
    { template: 3, topic: "Marvel Card Market Data Q1 2026: Topps Chrome Leads the Pack", category: "market_trends" },
    { template: 4, topic: "Breaking: Topps Announces New Marvel Platinum 2026 Set with Ultra-Rare Parallels", category: "sets" },
    { template: 5, topic: "The State of Marvel Card Collecting: A 2026 Situation Report", category: "market_trends" },
    { template: 6, topic: "Gallery: The Most Beautiful Topps Marvel Card Designs of All Time", category: "history" },
    { template: 7, topic: "CGC vs PSA vs AGS: Which Grading Service is Best for Your Marvel Cards in 2026?", category: "grading" },
    { template: 8, topic: "FLASH: Spider-Man Brand New Day Trailer Sends Card Values Soaring Overnight", category: "market_trends" },
    { template: 9, topic: "After-Action Report: What We Learned from NLF's First 1000 Repack Sales", category: "nlf_news" },
    { template: 10, topic: "Technical Guide: Understanding Topps Marvel Card Parallels, Refractors, and Numbered Hits", category: "sets" },
    { template: 11, topic: "Collector's Log: Tracking the Rise of Wolverine Cards Through Every Topps Set", category: "character_spotlight" },
    { template: 12, topic: "Executive Briefing: Why Marvel Trading Cards Are the Smartest Alternative Investment of 2026", category: "investment" },
  ];

  let successCount = 0;
  let failCount = 0;

  for (const art of articles) {
    const templateNumber = art.template;
    const templateName = TEMPLATE_NAMES[templateNumber] || "Unknown";
    const layoutDataPrompt = getLayoutDataPrompt(templateNumber);
    const categoryLabel = CATEGORY_LABELS[art.category] || art.category;

    console.log(`\n[${ successCount + failCount + 1}/10] 🔄 Template #${templateNumber}: ${templateName}`);
    console.log(`   Topic: "${art.topic}"`);
    console.log(`   Category: ${categoryLabel}`);
    console.log('   ⏳ Calling LLM...');

    const userPrompt = `Write about: ${art.topic}

Category: ${categoryLabel}

This article will use Layout Template #${templateNumber}: "${templateName}".
${layoutDataPrompt}

Respond in JSON with these fields:
- title, slug, excerpt, contentMarkdown, metaDescription, focusKeyword, tags, imagePrompt, layoutData

imagePrompt MUST describe a REALISTIC PHOTOGRAPHY-STYLE image. Must look like a real photograph, not AI art. Use product photography, flat-lay, macro, or lifestyle photo styles with natural lighting. NEVER use cosmic, glowing, neon, or illustrated styles. MUST NOT contain any text, letters, or words.`;

    try {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: NLF_BLOG_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: BLOG_JSON_SCHEMA_WITH_LAYOUT,
      });

      const rawContent = response.choices[0]?.message?.content;
      if (!rawContent) throw new Error("No content from LLM");
      const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
      const article = JSON.parse(contentStr);

      console.log(`   ✅ LLM: "${article.title}"`);
      console.log(`   📊 Layout data: ${Object.keys(article.layoutData || {}).join(', ') || 'none'}`);

      // Generate image with retries
      let featuredImageUrl = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          let prompt = article.imagePrompt;
          if (attempt === 2) {
            prompt = `Realistic product photograph related to: ${article.title}. Trading cards on a dark surface with natural lighting, shallow depth of field, professional photography style. No text, no letters, no words.`;
          } else if (attempt >= 3) {
            prompt = FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];
          }
          console.log(`   🖼️ Image attempt ${attempt}/3...`);
          const imgResult = await generateImage({ prompt });
          if (imgResult.url) {
            featuredImageUrl = imgResult.url;
            console.log(`   🖼️ ✅ Image success`);
            break;
          }
        } catch (err) {
          console.error(`   🖼️ Attempt ${attempt} failed:`, err.message?.substring(0, 80));
          if (attempt < 3) await new Promise(r => setTimeout(r, 2000 * attempt));
        }
      }

      const readTime = Math.max(1, Math.ceil(article.contentMarkdown.split(/\s+/).length / 200));
      const now = Date.now();
      const uniqueSlug = article.slug + "-" + now.toString(36);

      await createBlogPost({
        title: article.title,
        slug: uniqueSlug,
        excerpt: article.excerpt,
        contentMarkdown: article.contentMarkdown,
        featuredImageUrl,
        category: art.category,
        tags: article.tags,
        isAiGenerated: true,
        aiPrompt: art.topic,
        isFeatured: false,
        isPublished: true,
        authorName: "NLF Team",
        publishedAt: now,
        scheduledAt: null,
        metaDescription: article.metaDescription,
        focusKeyword: article.focusKeyword || null,
        internalLinks: INTERNAL_LINKS,
        readTimeMinutes: readTime,
        layoutTemplate: templateNumber,
        layoutData: article.layoutData || null,
      });

      successCount++;
      console.log(`   ✅ Published! Slug: ${uniqueSlug}`);
    } catch (err) {
      failCount++;
      console.error(`   ❌ Failed:`, err.message?.substring(0, 150));
    }

    // Small delay between articles to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n=== Bulk Generation Complete ===`);
  console.log(`   ✅ Success: ${successCount}/10`);
  console.log(`   ❌ Failed: ${failCount}/10`);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
