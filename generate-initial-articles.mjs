/**
 * Generate initial batch of blog articles for The Collector
 * This script calls the blog generation endpoint directly via the server
 */

import "dotenv/config";

// We'll call the server's internal functions directly
const SERVER_URL = "http://localhost:3000";

// First, let's generate articles one at a time using the scheduler's logic
// We need to import the server modules directly

async function main() {
  console.log("Generating initial blog articles for The Collector...\n");
  
  // We'll use a simple approach - call the blog scheduler's generate function
  // by importing the db and llm modules directly
  
  const { createBlogPost } = await import("./server/db.ts");
  const { invokeLLM } = await import("./server/_core/llm.ts");
  const { generateImage } = await import("./server/_core/imageGeneration.ts");
  
  const topics = [
    { topic: "Top 5 Marvel cards that have doubled in value this year", category: "market_trends" },
    { topic: "Why CGC vs PSA vs AGS grading matters for Marvel card values", category: "grading_guide" },
    { topic: "Spider-Man cards: the ultimate collecting guide for 2026", category: "character_spotlight" },
    { topic: "How to build a Marvel card portfolio that appreciates over time", category: "investment_strategy" },
    { topic: "Beginner's guide to Marvel trading card collecting", category: "collecting_tips" },
    { topic: "The rise of Marvel cards as alternative investments", category: "investment_strategy" },
  ];

  const categoryLabels = {
    market_trends: "Marvel Card Market Trends & Investment",
    character_spotlight: "Marvel Character Spotlight & Card Values",
    grading_guide: "Card Grading Guide (CGC, AGS, PSA)",
    set_breakdown: "Topps Marvel Set Breakdown & Chase Cards",
    investment_strategy: "Trading Card Investment Strategy",
    collecting_tips: "Card Collecting Tips & Best Practices",
    nlf_news: "Northland Legendary Finds News & Updates",
    behind_the_scenes: "Behind the Scenes at NLF",
    card_history: "Marvel Trading Card History & Nostalgia",
  };

  for (let i = 0; i < topics.length; i++) {
    const { topic, category } = topics[i];
    console.log(`[${i + 1}/${topics.length}] Generating: "${topic}"...`);
    
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert Marvel trading card content writer for Northland Legendary Finds (NLF), a premium Marvel card repack company. NLF uses grading services including CGC, AGS, and PSA. They sell curated repack series with full transparency — every card is listed on a public checklist before purchase.

Write SEO-optimized blog articles that:
- Position Marvel trading cards as a legitimate collectible investment
- Reference real Marvel characters, sets (Topps Comic Book Heroes, Marvel Ages, etc.), and grading standards
- Include specific card examples and approximate market values when relevant
- Use a knowledgeable but accessible tone — like talking to a fellow collector
- Naturally mention NLF's process, transparency, and quality when relevant (but don't be overly promotional)
- Structure with clear H2/H3 headings for SEO
- Include a compelling meta description (max 160 chars)
- End with a call-to-action that drives engagement

The article should be 800-1200 words, well-structured with markdown formatting.`
          },
          {
            role: "user",
            content: `Write about: ${topic}\nCategory: ${categoryLabels[category]}\n\nRespond in JSON: {"title":"...","slug":"...","excerpt":"...","contentMarkdown":"...","metaDescription":"...","focusKeyword":"...","tags":["..."],"imagePrompt":"..."}`
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "blog_article",
            strict: true,
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                slug: { type: "string" },
                excerpt: { type: "string" },
                contentMarkdown: { type: "string" },
                metaDescription: { type: "string" },
                focusKeyword: { type: "string" },
                tags: { type: "array", items: { type: "string" } },
                imagePrompt: { type: "string" },
              },
              required: ["title", "slug", "excerpt", "contentMarkdown", "metaDescription", "focusKeyword", "tags", "imagePrompt"],
              additionalProperties: false,
            },
          },
        },
      });

      const rawContent = response.choices[0]?.message?.content;
      if (!rawContent) throw new Error("No content from LLM");
      const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
      const article = JSON.parse(contentStr);

      // Generate featured image
      let featuredImageUrl = null;
      try {
        console.log(`  Generating image...`);
        const imgResult = await generateImage({ prompt: article.imagePrompt });
        featuredImageUrl = imgResult.url ?? null;
        console.log(`  Image generated: ${featuredImageUrl ? "yes" : "no"}`);
      } catch (err) {
        console.log(`  Image generation failed, continuing without image`);
      }

      const readTime = Math.max(1, Math.ceil((article.contentMarkdown || "").split(/\s+/).length / 200));
      const now = Date.now();

      await createBlogPost({
        title: article.title,
        slug: article.slug + "-" + now.toString(36),
        excerpt: article.excerpt,
        contentMarkdown: article.contentMarkdown,
        featuredImageUrl,
        category: category,
        tags: article.tags,
        isAiGenerated: true,
        aiPrompt: topic,
        isFeatured: i < 3, // First 3 are featured
        isPublished: true,
        authorName: "NLF Team",
        publishedAt: now - (i * 3600000), // Stagger by 1 hour each
        scheduledAt: null,
        metaDescription: article.metaDescription,
        focusKeyword: article.focusKeyword,
        internalLinks: [
          { text: "Browse our card database", url: "/cards" },
          { text: "View our checklists", url: "/checklists" },
          { text: "See our process", url: "/our-process" },
          { text: "Shop NLF repacks", url: "/shop" },
        ],
        readTimeMinutes: readTime,
      });

      console.log(`  ✓ Published: "${article.title}"\n`);
      
      // Small delay between articles to avoid rate limiting
      await new Promise(r => setTimeout(r, 2000));
      
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}\n`);
    }
  }

  console.log("Done! Initial articles generated.");
  process.exit(0);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
