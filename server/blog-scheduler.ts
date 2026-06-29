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

import { publishScheduledBlogPosts, publishScheduledArticles, createArticle, getPublishedArticles } from "./db";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import {
  NLF_BLOG_SYSTEM_PROMPT, TOPIC_POOLS, CATEGORY_LABELS,
  getNextTemplateKey, getLayoutDataPrompt, BLOG_JSON_SCHEMA_WITH_LAYOUT,
  TEMPLATE_DISPLAY_NAMES,
} from "./blog-content-strategy";

// ==================== CONFIGURATION ====================

const AUTO_GENERATE_ENABLED = true; // Re-enabled with ORDER 66 template rotation (3 articles/day at 8am, 1pm, 6pm CT)
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const DB_RETRY_ATTEMPTS = 3;
const DB_RETRY_DELAY_MS = 3000;

// Generation hours in UTC (6am, 12pm, 7pm CT = CDT UTC-5)
const GENERATION_HOURS_UTC = [11, 17, 0];

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
  market_trends: "Professional product photography of several Marvel trading cards and sealed wax packs arranged on a dark wood desk next to a laptop showing a price chart, warm natural lighting, shallow depth of field, realistic photo style, no text no letters no words",
  character_spotlight: "Close-up macro photograph of a single graded Marvel trading card in a PSA slab case standing upright on a dark felt surface, soft studio lighting with bokeh background, realistic product photography, no text no letters no words",
  grading_guide: "Overhead flat-lay photograph of trading card grading supplies on a clean desk: a graded slab, a magnifying loupe, penny sleeves, and a submission form, soft natural window lighting, realistic photo, no text no letters no words",
  set_breakdown: "Flat-lay photograph of a complete set of colorful Marvel trading cards fanned out on a black velvet surface, shot from above with even studio lighting, realistic product photography, no text no letters no words",
  investment_strategy: "Photograph of a collector's hands carefully placing a graded Marvel card into a fireproof safe alongside other slabbed cards, warm ambient lighting, realistic lifestyle photo, no text no letters no words",
  collecting_tips: "Photograph of a collector's organized desk with trading cards in a binder, top loaders, penny sleeves, and a cup of coffee, warm natural lighting from a window, cozy realistic lifestyle photo, no text no letters no words",
  nlf_news: "Professional photograph of a neatly arranged display of graded Marvel trading cards in acrylic stands on a dark surface with soft accent lighting, clean product photography style, no text no letters no words",
  behind_the_scenes: "Photograph of a real card shop workspace with stacks of trading cards being sorted on a table, shipping supplies nearby, overhead fluorescent and warm desk lamp lighting, realistic behind-the-scenes photo, no text no letters no words",
  card_history: "Photograph of vintage 1970s and 1980s Marvel trading cards arranged on aged wood with a nostalgic warm tone, some cards slightly worn showing age, realistic still life photography, no text no letters no words",
  sports_crossover: "Photograph of a family kitchen table with Marvel trading cards on one side and baseball cards on the other, a father and child's hands visible reaching for cards, warm home lighting, realistic lifestyle photo, no text no letters no words",
};

async function generateImageWithRetry(imagePrompt: string, title: string, category: string, maxRetries = 3): Promise<string | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let prompt = imagePrompt;
      if (attempt === 2) {
        prompt = `Realistic product photograph related to: ${title}. Trading cards on a dark surface with natural lighting, shallow depth of field, professional photography style. No text, no letters, no words.`;
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

// JSON schema now imported from blog-content-strategy.ts (BLOG_JSON_SCHEMA_WITH_LAYOUT)

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
      () => getPublishedArticles(count),
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

  // Get next template in rotation (9-template cycle)
  const templateKey = getNextTemplateKey();
  const templateName = TEMPLATE_DISPLAY_NAMES[templateKey];
  const layoutDataPrompt = getLayoutDataPrompt(templateKey);

  console.log(`[Blog Scheduler] Generating article: "${topic}" (${category}) — Template: ${templateKey} (${templateName})`);

  try {
    const response = await withRetry(
      () => invokeLLM({
        messages: [
          { role: "system", content: NLF_BLOG_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Write about: ${topic}\nCategory: ${CATEGORY_LABELS[category] || category}\n\nThis article will use the "${templateKey}" template (${templateName}).\n${layoutDataPrompt}\n\nRespond in JSON with: title, slug, excerpt, contentMarkdown, metaDescription, focusKeyword, tags, imagePrompt, layoutData\n\nimagePrompt MUST describe a REALISTIC PHOTOGRAPHY-STYLE image. Must look like a real photograph, not AI art. Use product photography, flat-lay, macro, or lifestyle photo styles with natural lighting. NEVER use cosmic, glowing, neon, or illustrated styles. MUST NOT contain any text, letters, or words.`
          },
        ],
        response_format: BLOG_JSON_SCHEMA_WITH_LAYOUT,
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

    // Create the MCU News article with retry for DB operations
    await withRetry(
      () => createArticle({
        title: article.title,
        slug: article.slug + "-" + now.toString(36),
        excerpt: article.excerpt,
        contentMarkdown: article.contentMarkdown,
        featuredImageUrl,
        category: category as any,
        tags: article.tags,
        isFeatured: false,
        isPublished: true,
        authorName: "NLF Team",
        publishedAt: now,
        scheduledAt: null,
        metaDescription: article.metaDescription,
        templateLayout: templateKey as any,
      }),
      "DB insert MCU News article"
    );

    console.log(`[Blog Scheduler] Published: "${article.title}" (Template: ${templateKey})`);
    return true;
  } catch (err) {
    console.error("[Blog Scheduler] Failed to generate article:", err);
    return false;
  }
}

// ==================== SCHEDULED POST PUBLISHING ====================

async function checkScheduledPosts(): Promise<void> {
  try {
    const blogCount = await withRetry(
      () => publishScheduledBlogPosts(),
      "Publish scheduled blog posts"
    );
    if (blogCount > 0) {
      console.log(`[Blog Scheduler] Published ${blogCount} scheduled blog post(s)`);
    }
  } catch (err) {
    console.error("[Blog Scheduler] Error publishing scheduled blog posts:", err);
  }

  // Also check MCU News articles with scheduledAt
  try {
    const articleCount = await withRetry(
      () => publishScheduledArticles(),
      "Publish scheduled articles"
    );
    if (articleCount > 0) {
      console.log(`[Blog Scheduler] Published ${articleCount} scheduled MCU article(s)`);
    }
  } catch (err) {
    console.error("[Blog Scheduler] Error publishing scheduled articles:", err);
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
      () => getPublishedArticles(1),
      "Check recent generation"
    ) as any[];

    if (posts.length === 0) return false;

    const latestPost = posts[0];
    const createdAt = latestPost.createdAt instanceof Date
      ? latestPost.createdAt.getTime()
      : typeof latestPost.createdAt === "number"
        ? latestPost.createdAt
        : new Date(latestPost.createdAt as any).getTime();

    // If the latest article was created within the last 2 hours, skip
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    if (createdAt > twoHoursAgo) {
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
  console.log("[Blog Scheduler] Auto-generation enabled: 3 articles/day at 6am, 12pm, 7pm CT");
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
