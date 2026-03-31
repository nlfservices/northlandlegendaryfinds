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
 * 
 * Reliability features:
 * - Retry logic for database operations (handles ECONNRESET)
 * - Retry logic for image generation (3 attempts with fallback prompts)
 * - Database-backed generation tracking (survives server restarts)
 * - Deduplication: checks existing slugs/titles before generating
 */

import { publishScheduledBlogPosts, createBlogPost, getPublishedBlogPosts } from "./db";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { NLF_BLOG_SYSTEM_PROMPT, TOPIC_POOLS, CATEGORY_LABELS } from "./blog-content-strategy";

// ==================== CONFIGURATION ====================

const AUTO_GENERATE_ENABLED = false; // DISABLED by user request — re-enable when ready to resume content generation
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const DB_RETRY_ATTEMPTS = 3;
const DB_RETRY_DELAY_MS = 3000;

// Generation hours in UTC (8am, 1pm, 6pm CT = CDT UTC-5)
const GENERATION_HOURS_UTC = [13, 18, 23];

// ==================== RETRY HELPERS ====================

async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxRetries = DB_RETRY_ATTEMPTS,
  delayMs = DB_RETRY_DELAY_MS
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const isRetryable = err?.message?.includes("ECONNRESET") ||
        err?.message?.includes("ETIMEDOUT") ||
        err?.message?.includes("ENOTFOUND") ||
        err?.message?.includes("Connection lost") ||
        err?.cause?.message?.includes("ECONNRESET") ||
        err?.cause?.message?.includes("ETIMEDOUT");

      if (isRetryable && attempt < maxRetries) {
        console.warn(`[Blog Scheduler] ${label} attempt ${attempt}/${maxRetries} failed (retryable): ${err.message}`);
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        continue;
      }

      // Non-retryable error or final attempt
      throw err;
    }
  }
  throw new Error(`[Blog Scheduler] ${label} exhausted all ${maxRetries} retries`);
}

// ==================== IMAGE GENERATION WITH RETRY ====================

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

async function generateImageWithRetry(imagePrompt: string, title: string, category: string, maxRetries = 3): Promise<string | null> {
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
        // Exponential backoff: 4s, 8s
        await new Promise(resolve => setTimeout(resolve, 4000 * attempt));
      }
    }
  }

  console.error(`[Blog Scheduler Image] All ${maxRetries} attempts failed for "${title}"`);
  return null;
}

// ==================== LLM JSON SCHEMA ====================

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

// ==================== TOPIC SELECTION ====================

// Track used topics in memory to avoid repeats within a session
const usedTopics = new Set<string>();
// Track recent categories to enforce diversity
const recentCategories: string[] = [];

/**
 * Get the categories of the last N published articles from the database.
 * This ensures diversity survives server restarts.
 */
async function getRecentCategoriesFromDB(count = 3): Promise<string[]> {
  try {
    const posts = await withRetry(
      () => getPublishedBlogPosts(count),
      "Fetch recent categories"
    );
    return posts.map(p => p.category || 'unknown').filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Pick a random topic ensuring:
 * 1. No topic is repeated within a session
 * 2. Category is different from the last 2 published articles
 * 3. No more than 2 articles of the same category in any 5-article window
 */
async function getRandomTopic(): Promise<{ topic: string; category: string }> {
  const categories = Object.keys(TOPIC_POOLS);

  // Load recent categories from DB if our in-memory list is empty (e.g., after restart)
  if (recentCategories.length === 0) {
    const dbCategories = await getRecentCategoriesFromDB(3);
    recentCategories.push(...dbCategories);
    console.log(`[Blog Scheduler] Loaded recent categories from DB: ${dbCategories.join(', ')}`);
  }

  // Categories to avoid: the last 2 categories used
  const avoidCategories = new Set(recentCategories.slice(0, 2));

  // Try to find an unused topic in a non-recent category (up to 30 attempts)
  for (let i = 0; i < 30; i++) {
    // Filter to categories we haven't used recently
    const eligibleCategories = categories.filter(c => !avoidCategories.has(c));
    const categoryPool = eligibleCategories.length > 0 ? eligibleCategories : categories;
    
    const category = categoryPool[Math.floor(Math.random() * categoryPool.length)];
    const topics = TOPIC_POOLS[category];
    const topic = topics[Math.floor(Math.random() * topics.length)];

    if (!usedTopics.has(topic)) {
      usedTopics.add(topic);
      // Track this category as most recent
      recentCategories.unshift(category);
      if (recentCategories.length > 5) recentCategories.pop();
      console.log(`[Blog Scheduler] Selected category: ${category} (avoided: ${Array.from(avoidCategories).join(', ')})`);
      return { topic, category };
    }
  }

  // If all topics used, clear and start fresh
  if (usedTopics.size >= categories.reduce((sum, cat) => sum + TOPIC_POOLS[cat].length, 0) * 0.8) {
    usedTopics.clear();
  }

  // Fallback: pick from non-recent category
  const eligibleCategories = categories.filter(c => !avoidCategories.has(c));
  const categoryPool = eligibleCategories.length > 0 ? eligibleCategories : categories;
  const category = categoryPool[Math.floor(Math.random() * categoryPool.length)];
  const topics = TOPIC_POOLS[category];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  recentCategories.unshift(category);
  if (recentCategories.length > 5) recentCategories.pop();
  return { topic, category };
}

// ==================== ARTICLE GENERATION ====================

async function generateAndPublishArticle(): Promise<boolean> {
  const { topic, category } = await getRandomTopic();

  console.log(`[Blog Scheduler] Generating article: "${topic}" (${category})`);

  try {
    const response = await withRetry(
      () => invokeLLM({
        messages: [
          { role: "system", content: NLF_BLOG_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Write about: ${topic}\nCategory: ${CATEGORY_LABELS[category] || category}\n\nRespond in JSON: {"title":"...","slug":"...","excerpt":"...","contentMarkdown":"...","metaDescription":"...","focusKeyword":"...","tags":["..."],"imagePrompt":"A detailed prompt for a featured image. MUST NOT contain any text, letters, or words."}`
          },
        ],
        response_format: JSON_SCHEMA,
      }),
      "LLM generation"
    );

    const rawContent = response.choices[0]?.message?.content;
    if (!rawContent) throw new Error("No content from LLM");
    const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
    const article = JSON.parse(contentStr);

    // Validate required fields
    if (!article.title || !article.slug || !article.contentMarkdown) {
      throw new Error("LLM returned incomplete article data");
    }

    // Generate featured image with retry logic
    const featuredImageUrl = await generateImageWithRetry(
      article.imagePrompt,
      article.title,
      category
    );

    const readTime = Math.max(1, Math.ceil((article.contentMarkdown || "").split(/\s+/).length / 200));
    const now = Date.now();

    // Create the blog post with retry for DB operations
    await withRetry(
      () => createBlogPost({
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
      }),
      "DB insert blog post"
    );

    console.log(`[Blog Scheduler] Published: "${article.title}"`);
    return true;
  } catch (err) {
    console.error("[Blog Scheduler] Failed to generate article:", err);
    return false;
  }
}

// ==================== SCHEDULED POST PUBLISHING ====================

async function checkScheduledPosts(): Promise<void> {
  try {
    const count = await withRetry(
      () => publishScheduledBlogPosts(),
      "Publish scheduled posts"
    );
    if (count > 0) {
      console.log(`[Blog Scheduler] Published ${count} scheduled post(s)`);
    }
  } catch (err) {
    console.error("[Blog Scheduler] Error publishing scheduled posts:", err);
  }
}

// ==================== GENERATION TRACKING (DB-BACKED) ====================

/**
 * Check if we already generated an article in the current generation window.
 * Uses the database to check if an AI-generated article was created within
 * the last 2 hours, making this survive server restarts.
 */
async function hasGeneratedRecently(): Promise<boolean> {
  try {
    const posts = await withRetry(
      () => getPublishedBlogPosts(1),
      "Check recent generation"
    );

    if (posts.length === 0) return false;

    const latestPost = posts[0];
    const createdAt = latestPost.createdAt instanceof Date
      ? latestPost.createdAt.getTime()
      : typeof latestPost.createdAt === "number"
        ? latestPost.createdAt
        : new Date(latestPost.createdAt as any).getTime();

    // If the latest AI-generated post was created within the last 2 hours, skip
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    if (latestPost.isAiGenerated && createdAt > twoHoursAgo) {
      return true;
    }

    return false;
  } catch (err) {
    console.error("[Blog Scheduler] Error checking recent generation:", err);
    // If we can't check, err on the side of not generating (avoid duplicates)
    return true;
  }
}

// In-memory fallback tracking (for within-session dedup)
let lastGenerationHour = -1;

async function checkAutoGeneration(): Promise<void> {
  if (!AUTO_GENERATE_ENABLED) return;

  const now = new Date();
  const currentHourUTC = now.getUTCHours();

  // Check if we're in a generation hour
  if (!GENERATION_HOURS_UTC.includes(currentHourUTC)) return;

  // In-memory dedup for this session
  if (lastGenerationHour === currentHourUTC) return;

  // DB-backed dedup (survives restarts)
  const recentlyGenerated = await hasGeneratedRecently();
  if (recentlyGenerated) {
    console.log(`[Blog Scheduler] Skipping generation at hour ${currentHourUTC} UTC — recent article exists`);
    lastGenerationHour = currentHourUTC;
    return;
  }

  lastGenerationHour = currentHourUTC;
  console.log(`[Blog Scheduler] Auto-generation triggered at hour ${currentHourUTC} UTC`);

  const success = await generateAndPublishArticle();
  if (success) {
    console.log(`[Blog Scheduler] Auto-generation completed successfully`);
  } else {
    console.error(`[Blog Scheduler] Auto-generation failed — will retry next interval`);
    // Reset so we try again on the next 5-minute check
    lastGenerationHour = -1;
  }
}

// ==================== STARTUP ====================

export function startBlogScheduler(): void {
  console.log("[Blog Scheduler] Starting blog auto-publisher (every 5 min check)");
  console.log("[Blog Scheduler] Auto-generation enabled: 3 articles/day at 8am, 1pm, 6pm CT");
  console.log("[Blog Scheduler] Using centralized NLF content strategy (Topps-only, no Fleer/Upper Deck)");
  console.log("[Blog Scheduler] Retry logic: DB operations (3 retries), image generation (3 retries with fallback prompts)");

  // Run immediately on startup
  checkScheduledPosts().catch(console.error);

  // Set interval for regular checks
  setInterval(async () => {
    await checkScheduledPosts();
    await checkAutoGeneration();
  }, CHECK_INTERVAL_MS);
}
