/**
 * Generate 8 fresh Topps-focused articles using the project's own LLM and DB modules
 * Run: npx tsx scripts/generate-articles.ts
 */

import { invokeLLM } from "../server/_core/llm";
import { generateImage } from "../server/_core/imageGeneration";
import { createBlogPost } from "../server/db";
import { NLF_BLOG_SYSTEM_PROMPT, CATEGORY_LABELS } from "../server/blog-content-strategy";

const ARTICLES = [
  { topic: "Is Spider-Man the Michael Jordan of Marvel cards? The GOAT comparison every collector needs to understand", category: "character_spotlight" },
  { topic: "Why Topps exclusive Marvel license makes their cards the only long-term safe investment in the hobby", category: "market_trends" },
  { topic: "The Pokémon hedge: why smart collectors are moving into Marvel cards as Pokémon faces a new wax era with US printing", category: "investment_strategy" },
  { topic: "Spider-Man Brand New Day: the most trailer views in history and what it means for Spider-Man card values", category: "market_trends" },
  { topic: "CGC vs PSA vs AGS: which grading company gives your Marvel cards the best value and why it matters", category: "grading_guide" },
  { topic: "From baseball diamonds to Marvel cards: why sports card dads are joining the hobby through their kids", category: "sports_crossover" },
  { topic: "Topps Comic Book Heroes 1976: the complete guide to Marvel's most iconic and foundational card set", category: "set_breakdown" },
  { topic: "How NLF builds transparency into every repack series with full checklists and graded cards", category: "nlf_news" },
];

const JSON_SCHEMA = {
  type: "json_schema" as const,
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
};

const INTERNAL_LINKS = [
  { text: "Browse our card database", url: "/cards" },
  { text: "View our checklists", url: "/checklists" },
  { text: "See our process", url: "/our-process" },
  { text: "Shop NLF repacks", url: "/shop" },
];

async function generateImageWithRetry(imagePrompt: string, title: string, category: string): Promise<string | null> {
  const FALLBACK_PROMPTS: Record<string, string> = {
    market_trends: "A dramatic cosmic scene with trading cards floating in space surrounded by golden price charts and upward arrows, dark background with purple nebula, investment theme, no text no letters",
    character_spotlight: "A single glowing trading card hovering in a dark cosmic void with energy beams radiating outward, collector spotlight theme, no text no letters",
    grading_guide: "A pristine graded trading card in a protective slab case under a magnifying glass with golden light, professional grading inspection theme, dark background, no text no letters",
    set_breakdown: "A spread of colorful trading cards fanned out on a dark surface with dramatic lighting, set collection theme with cosmic background, no text no letters",
    investment_strategy: "A vault door opening to reveal glowing trading cards inside, investment and treasure theme, dark dramatic lighting with gold accents, no text no letters",
    sports_crossover: "A split scene showing sports equipment on one side and trading cards on the other, connected by cosmic energy, family bonding theme, no text no letters",
    nlf_news: "A glowing cosmic energy burst against a dark space background with green and purple nebula, card collecting brand theme, no text no letters",
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      let prompt = imagePrompt;
      if (attempt === 2) {
        prompt = `A visually striking illustration related to: ${title}. Trading cards theme, dark cosmic background with vibrant colors. No text, no letters, no words.`;
      } else if (attempt >= 3) {
        prompt = FALLBACK_PROMPTS[category] || FALLBACK_PROMPTS.market_trends;
      }

      console.log(`    Image attempt ${attempt}/3...`);
      const imgResult = await generateImage({ prompt });
      if (imgResult.url) {
        console.log(`    Image: ✅`);
        return imgResult.url;
      }
    } catch (err: any) {
      console.log(`    Image attempt ${attempt} failed: ${err.message?.substring(0, 80)}`);
      if (attempt < 3) await new Promise(r => setTimeout(r, 3000));
    }
  }
  return null;
}

async function main() {
  console.log("=== NLF Blog Article Generator ===");
  console.log(`Generating ${ARTICLES.length} fresh Topps-focused articles...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < ARTICLES.length; i++) {
    const article = ARTICLES[i];
    console.log(`\n[${i + 1}/${ARTICLES.length}] Generating: "${article.topic.substring(0, 70)}..."`);
    console.log(`  Category: ${article.category}`);

    try {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: NLF_BLOG_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Write about: ${article.topic}\nCategory: ${CATEGORY_LABELS[article.category] || article.category}\n\nRespond in JSON: {"title":"...","slug":"...","excerpt":"...","contentMarkdown":"...","metaDescription":"...","focusKeyword":"...","tags":["..."],"imagePrompt":"A detailed prompt for a featured image. MUST NOT contain any text, letters, or words."}`
          },
        ],
        response_format: JSON_SCHEMA,
      });

      const rawContent = response.choices?.[0]?.message?.content;
      if (!rawContent) throw new Error("No content from LLM");
      const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
      const parsed = JSON.parse(contentStr);

      console.log(`  Title: "${parsed.title}"`);

      // Generate image
      const imageUrl = await generateImageWithRetry(parsed.imagePrompt, parsed.title, article.category);

      // Insert into DB
      const slug = parsed.slug + "-" + Date.now().toString(36);
      const readTime = Math.max(1, Math.ceil((parsed.contentMarkdown || "").split(/\s+/).length / 200));
      const now = Date.now();

      await createBlogPost({
        title: parsed.title,
        slug,
        excerpt: parsed.excerpt,
        contentMarkdown: parsed.contentMarkdown,
        featuredImageUrl: imageUrl,
        category: article.category as any,
        tags: parsed.tags,
        isAiGenerated: true,
        aiPrompt: article.topic,
        isFeatured: i < 3,
        isPublished: true,
        authorName: "NLF Team",
        publishedAt: now,
        scheduledAt: null,
        metaDescription: parsed.metaDescription,
        focusKeyword: parsed.focusKeyword,
        internalLinks: INTERNAL_LINKS,
        readTimeMinutes: readTime,
      });

      console.log(`  ✅ Published!`);
      success++;
    } catch (err: any) {
      console.log(`  ❌ Error: ${err.message}`);
      failed++;
    }

    if (i < ARTICLES.length - 1) {
      console.log("  Waiting 3s...");
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`\n=== Complete ===`);
  console.log(`Success: ${success}, Failed: ${failed}`);
  process.exit(0);
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
