/**
 * Generate test articles directly using server-side functions
 * Bypasses tRPC admin auth by calling DB + LLM functions directly
 * Usage: cd /home/ubuntu/northland-legendary-finds && node --loader tsx scripts/generate-test-articles.mjs
 */

// We need to use tsx to handle TypeScript imports
// This script is run via: npx tsx scripts/generate-test-articles.mjs

import 'dotenv/config';

async function main() {
  console.log('=== ORDER 66 Blog Layout Engine — Test Article Generation ===\n');
  
  // Dynamic imports of server modules
  const { invokeLLM } = await import('../server/_core/llm.ts');
  const { generateImage } = await import('../server/_core/imageGeneration.ts');
  const { createBlogPost } = await import('../server/db.ts');
  const { 
    NLF_BLOG_SYSTEM_PROMPT, CATEGORY_LABELS,
    getNextTemplate, getLayoutDataPrompt, BLOG_JSON_SCHEMA_WITH_LAYOUT,
    TEMPLATE_NAMES,
  } = await import('../server/blog-content-strategy.ts');

  const INTERNAL_LINKS = [
    { text: "Browse our card database", url: "/cards" },
    { text: "View our checklists", url: "/checklists" },
    { text: "See our process", url: "/our-process" },
    { text: "Shop NLF repacks", url: "/shop" },
  ];

  const FALLBACK_PROMPTS = {
    market_trends: "Professional product photography of several Marvel trading cards and sealed wax packs arranged on a dark wood desk next to a laptop showing a price chart, warm natural lighting, shallow depth of field, realistic photo style, no text no letters no words",
    character_spotlight: "Close-up macro photograph of a single graded Marvel trading card in a PSA slab case standing upright on a dark felt surface, soft studio lighting with bokeh background, realistic product photography, no text no letters no words",
  };

  async function generateImageWithRetry(imagePrompt, title, category, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        let prompt = imagePrompt;
        if (attempt === 2) {
          prompt = `Realistic product photograph related to: ${title}. Trading cards on a dark surface with natural lighting, shallow depth of field, professional photography style. No text, no letters, no words.`;
        } else if (attempt >= 3) {
          prompt = FALLBACK_PROMPTS[category] || FALLBACK_PROMPTS.market_trends;
        }
        console.log(`   [Image] Attempt ${attempt}/${maxRetries}...`);
        const imgResult = await generateImage({ prompt });
        if (imgResult.url) {
          console.log(`   [Image] ✅ Success on attempt ${attempt}`);
          return imgResult.url;
        }
      } catch (err) {
        console.error(`   [Image] Attempt ${attempt} failed:`, err.message);
        if (attempt < maxRetries) await new Promise(r => setTimeout(r, 2000 * attempt));
      }
    }
    return null;
  }

  const tests = [
    { topic: "The Rise of Marvel Graded Card Values in 2026: What Collectors Need to Know", category: "market_trends" },
    { topic: "Spider-Man Trading Cards: The Ultimate Collector's Guide to Web-Slinging Rarities", category: "character_spotlight" },
  ];

  for (const test of tests) {
    const templateNumber = getNextTemplate();
    const templateName = TEMPLATE_NAMES[templateNumber] || "Field Report";
    const layoutDataPrompt = getLayoutDataPrompt(templateNumber);
    const categoryLabel = CATEGORY_LABELS[test.category] || test.category;

    console.log(`\n🔄 Generating: "${test.topic}"`);
    console.log(`   📐 Template #${templateNumber}: ${templateName}`);
    console.log(`   📂 Category: ${categoryLabel}`);
    console.log('   ⏳ Calling LLM (30-60s)...');

    const userPrompt = `Write about: ${test.topic}

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

      console.log(`   ✅ LLM generated: "${article.title}"`);
      console.log(`   🏷️ Tags: ${(article.tags || []).join(', ')}`);
      console.log(`   📊 Layout data keys: ${Object.keys(article.layoutData || {}).join(', ') || 'none'}`);

      // Generate image
      console.log('   🖼️ Generating featured image...');
      const featuredImageUrl = await generateImageWithRetry(
        article.imagePrompt,
        article.title,
        test.category
      );

      const readTime = Math.max(1, Math.ceil(article.contentMarkdown.split(/\s+/).length / 200));
      const now = Date.now();

      await createBlogPost({
        title: article.title,
        slug: article.slug + "-" + Date.now().toString(36),
        excerpt: article.excerpt,
        contentMarkdown: article.contentMarkdown,
        featuredImageUrl,
        category: test.category,
        tags: article.tags,
        isAiGenerated: true,
        aiPrompt: test.topic,
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

      console.log(`   ✅ Saved to database and published!`);
      console.log(`   🔗 View at: /the-collector/${article.slug}-${Date.now().toString(36)}`);
    } catch (err) {
      console.error(`   ❌ Failed:`, err.message);
    }
  }

  console.log('\n=== Test Generation Complete ===');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
