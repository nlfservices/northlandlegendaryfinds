/**
 * Blog Auto-Publisher & Generator Scheduler
 * 
 * Runs on a timer to:
 * 1. Publish any blog posts whose scheduledAt time has passed
 * 2. Auto-generate new articles at configured intervals
 * 
 * Schedule: Checks every 5 minutes for posts to publish
 * Auto-generation: 3 articles per day at 8am, 1pm, 6pm CT
 * 
 * Uses the centralized NLF content strategy from blog-content-strategy.ts
 */

import { publishScheduledBlogPosts, createBlogPost, getPublishedBlogPosts } from "./db";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { NLF_BLOG_SYSTEM_PROMPT, TOPIC_POOLS, CATEGORY_LABELS } from "./blog-content-strategy";

// Reliable image generation with retry logic
async function generateImageWithRetry(imagePrompt: string, title: string, category: string, maxRetries = 3): Promise<string | null> {
  const FALLBACK_PROMPTS: Record<string, string> = {
    market_trends: "A dramatic cosmic scene with trading cards floating in space surrounded by golden price charts and upward arrows, dark background with purple nebula, investment theme, no text no letters",
    character_spotlight: "A single glowing trading card hovering in a dark cosmic void with energy beams radiating outward, collector spotlight theme, no text no letters",
    grading_guide: "A pristine graded trading card in a protective slab case under a magnifying glass with golden light, professional grading inspection theme, dark background, no text no letters",
    set_breakdown: "A spread of colorful trading cards fanned out on a dark surface with dramatic lighting, set collection theme with cosmic background, no text no letters",
    investment_strategy: "A vault door opening to reveal glowing trading cards inside, investment and treasure theme, dark dramatic lighting with gold accents, no text no letters",
    collecting_tips: "A collector's desk with trading cards, protective sleeves, and a magnifying glass, warm lighting, organized collection theme, no text no letters",
    nlf_news: "A glowing cosmic energy burst against a dark space background with green and purple nebula, card collecting brand theme, no text no letters",
    behind_the_scenes: "A workstation with stacks of trading cards being sorted and graded, behind the scenes workshop theme, warm professional lighting, no text no letters",
    card_history: "Vintage trading cards from the 1990s arranged in a nostalgic display with aged paper texture and warm sepia tones, history theme, no text no letters",
    sports_crossover: "A split scene showing sports equipment on one side and trading cards on the other, connected by cosmic energy, family bonding theme, no text no letters",
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let prompt = imagePrompt;
      if (attempt === 2) {
        prompt = `A visually striking illustration related to: ${title}. Trading cards theme, dark cosmic background with vibrant colors. No text, no letters, no words.`;
      } else if (attempt >= 3) {
        prompt = FALLBACK_PROMPTS[category] || FALLBACK_PROMPTS.market_trends;
      }

      console.log(`[Blog Scheduler Image] Attempt ${attempt}/${maxRetries} for "${title.substring(0, 50)}..."`);
      const imgResult = await generateImage({ prompt });
      if (imgResult.url) {
        console.log(`[Blog Scheduler Image] Success on attempt ${attempt}`);
        return imgResult.url;
      }
    } catch (err) {
      console.error(`[Blog Scheduler Image] Attempt ${attempt} failed:`, err);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }

  console.error(`[Blog Scheduler Image] All ${maxRetries} attempts failed for "${title}"`);
  return null;
}

const AUTO_GENERATE_ENABLED = true;
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

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

function getRandomTopic(): { topic: string; category: string } {
  const categories = Object.keys(TOPIC_POOLS);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const topics = TOPIC_POOLS[category];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  return { topic, category };
}

async function generateAndPublishArticle(): Promise<void> {
  const { topic, category } = getRandomTopic();

  console.log(`[Blog Scheduler] Generating article: "${topic}" (${category})`);

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: NLF_BLOG_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Write about: ${topic}\nCategory: ${CATEGORY_LABELS[category] || category}\n\nRespond in JSON: {"title":"...","slug":"...","excerpt":"...","contentMarkdown":"...","metaDescription":"...","focusKeyword":"...","tags":["..."],"imagePrompt":"A detailed prompt for a featured image. MUST NOT contain any text, letters, or words."}`
        },
      ],
      response_format: JSON_SCHEMA,
    });

    const rawContent = response.choices[0]?.message?.content;
    if (!rawContent) throw new Error("No content from LLM");
    const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
    const article = JSON.parse(contentStr);

    // Generate featured image with retry logic
    const featuredImageUrl = await generateImageWithRetry(
      article.imagePrompt,
      article.title,
      category
    );

    const readTime = Math.max(1, Math.ceil((article.contentMarkdown || "").split(/\s+/).length / 200));
    const now = Date.now();

    await createBlogPost({
      title: article.title,
      slug: article.slug + "-" + now.toString(36),
      excerpt: article.excerpt,
      contentMarkdown: article.contentMarkdown,
      featuredImageUrl,
      category: category as any,
      tags: article.tags,
      isAiGenerated: true,
      aiPrompt: topic,
      isFeatured: false,
      isPublished: true,
      authorName: "NLF Team",
      publishedAt: now,
      scheduledAt: null,
      metaDescription: article.metaDescription,
      focusKeyword: article.focusKeyword,
      internalLinks: INTERNAL_LINKS,
      readTimeMinutes: readTime,
    });

    console.log(`[Blog Scheduler] Published: "${article.title}"`);
  } catch (err) {
    console.error("[Blog Scheduler] Failed to generate article:", err);
  }
}

// Check and publish scheduled posts
async function checkScheduledPosts(): Promise<void> {
  try {
    const count = await publishScheduledBlogPosts();
    if (count > 0) {
      console.log(`[Blog Scheduler] Published ${count} scheduled post(s)`);
    }
  } catch (err) {
    console.error("[Blog Scheduler] Error publishing scheduled posts:", err);
  }
}

// Auto-generation: generates at 8am, 1pm, 6pm CT (Central Time)
// CT is UTC-5 (CDT) or UTC-6 (CST)
let lastGenerationHour = -1;
const GENERATION_HOURS_UTC = [13, 18, 23]; // 8am, 1pm, 6pm CT (CDT = UTC-5)

async function checkAutoGeneration(): Promise<void> {
  if (!AUTO_GENERATE_ENABLED) return;
  
  const now = new Date();
  const currentHourUTC = now.getUTCHours();
  
  // Check if we're in a generation hour and haven't already generated this hour
  if (GENERATION_HOURS_UTC.includes(currentHourUTC) && lastGenerationHour !== currentHourUTC) {
    lastGenerationHour = currentHourUTC;
    console.log(`[Blog Scheduler] Auto-generation triggered at hour ${currentHourUTC} UTC`);
    await generateAndPublishArticle();
  }
}

// Start the scheduler
export function startBlogScheduler(): void {
  console.log("[Blog Scheduler] Starting blog auto-publisher (every 5 min check)");
  console.log("[Blog Scheduler] Auto-generation enabled: 3 articles/day at 8am, 1pm, 6pm CT");
  console.log("[Blog Scheduler] Using centralized NLF content strategy (Topps-only, no Fleer/Upper Deck)");
  
  // Run immediately on startup
  checkScheduledPosts().catch(console.error);
  
  // Set interval for regular checks
  setInterval(async () => {
    await checkScheduledPosts();
    await checkAutoGeneration();
  }, CHECK_INTERVAL_MS);
}
