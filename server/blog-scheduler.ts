/**
 * Blog Auto-Publisher & Generator Scheduler
 * 
 * Runs on a timer to:
 * 1. Publish any blog posts whose scheduledAt time has passed
 * 2. Auto-generate new articles at configured intervals
 * 
 * Schedule: Checks every 5 minutes for posts to publish
 * Auto-generation: 3 articles per day at 8am, 1pm, 6pm CT
 */

import { publishScheduledBlogPosts, createBlogPost, getPublishedBlogPosts } from "./db";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";

const AUTO_GENERATE_ENABLED = true;
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// Topic pools for auto-generation variety
const TOPIC_POOLS: Record<string, string[]> = {
  market_trends: [
    "Which Marvel cards are trending up this week and why",
    "How MCU movie announcements affect card prices",
    "The hottest Marvel card sales from recent eBay auctions",
    "Marvel card market analysis: what's moving in the graded card space",
    "Price trends for vintage Marvel cards vs modern releases",
    "How to track Marvel card values like a pro investor",
    "The impact of Avengers Doomsday on Doctor Doom card prices",
    "Marvel card index: tracking the top 50 most valuable cards",
  ],
  character_spotlight: [
    "Spider-Man cards: every major card worth collecting",
    "Wolverine card values and the X-Men collecting boom",
    "Iron Man cards across every Topps Marvel set",
    "Deadpool cards: humor meets high value in Marvel collecting",
    "Venom and symbiote cards: a dark horse investment",
    "Captain America cards: the patriotic premium in collecting",
    "Thor cards: Asgardian value across Marvel card sets",
    "Black Panther cards: Wakanda's impact on the card market",
    "Doctor Strange cards: mystical arts meet card collecting",
    "Hulk cards: smashing values in the Marvel card market",
  ],
  grading_guide: [
    "CGC vs PSA vs AGS: which grading company is right for your Marvel cards",
    "Understanding card grading scales: what each number really means",
    "How to prepare your Marvel cards for grading submission",
    "The cost of grading: is it worth it for your collection",
    "Common grading mistakes that hurt your card's value",
    "How to read a CGC label and what the numbers mean",
    "Sub-grades explained: surface, corners, edges, and centering",
    "When to grade raw cards vs keeping them ungraded",
  ],
  set_breakdown: [
    "Topps Comic Book Heroes: the complete collector's guide",
    "Marvel Ages set breakdown: every chase card worth finding",
    "Topps Marvel Platinum: the premium set collectors want",
    "Marvel Masterpieces: a legacy set that still holds value",
    "Comparing every Topps Marvel set released in the last 5 years",
    "The best Marvel card sets for new collectors to start with",
    "Hidden gems in Topps Marvel sets most collectors overlook",
    "Sketch cards: the most unique pulls in Marvel card sets",
  ],
  investment_strategy: [
    "Building a Marvel card portfolio that appreciates over time",
    "Why graded cards outperform raw cards as investments",
    "The case for Marvel cards as alternative investments in 2026",
    "Dollar-cost averaging into Marvel cards: a smart strategy",
    "How to spot undervalued Marvel cards before they spike",
    "Long-term vs short-term Marvel card investing strategies",
    "Diversifying your card portfolio across Marvel characters and sets",
    "The role of scarcity in Marvel card investment returns",
  ],
  collecting_tips: [
    "Beginner's guide to Marvel trading card collecting in 2026",
    "How to store and protect your Marvel card collection",
    "Building your first graded Marvel card collection on a budget",
    "The essential tools every Marvel card collector needs",
    "How to spot fake or counterfeit Marvel trading cards",
    "Organizing your collection: best practices for serious collectors",
    "Where to buy Marvel cards: the best sources for collectors",
    "Card show etiquette: tips for buying at conventions and shows",
  ],
  card_history: [
    "The history of Marvel trading cards from 1990 to today",
    "How Topps became the king of Marvel card production",
    "The evolution of Marvel card art: from painted to digital",
    "Iconic Marvel card sets that defined the hobby",
    "The 1990s Marvel card boom and what we can learn from it",
    "How Marvel cards survived the comic book crash of the 90s",
    "The most expensive Marvel cards ever sold at auction",
    "Marvel sketch cards: the art form that changed collecting",
  ],
  nlf_news: [
    "What makes NLF repacks different from every other repack brand",
    "How NLF builds transparency into every repack series",
    "Behind the scenes: how we source cards for NLF repacks",
    "Why we publish full checklists before you buy",
    "The NLF grading process: CGC, AGS, PSA and beyond",
    "How NLF heat-sealed mylar bags protect your investment",
  ],
};

function getRandomTopic(): { topic: string; category: string } {
  const categories = Object.keys(TOPIC_POOLS);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const topics = TOPIC_POOLS[category];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  return { topic, category };
}

async function generateAndPublishArticle(): Promise<void> {
  const { topic, category } = getRandomTopic();
  
  const categoryLabels: Record<string, string> = {
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

  console.log(`[Blog Scheduler] Generating article: "${topic}" (${category})`);

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
- Include internal linking opportunities to NLF pages
- Structure with clear H2/H3 headings for SEO
- Include a compelling meta description (max 160 chars)
- End with a call-to-action that drives engagement

The article should be 800-1200 words, well-structured with markdown formatting.`
        },
        {
          role: "user",
          content: `Write about: ${topic}\nCategory: ${categoryLabels[category] || category}\n\nRespond in JSON: {"title":"...","slug":"...","excerpt":"...","contentMarkdown":"...","metaDescription":"...","focusKeyword":"...","tags":["..."],"imagePrompt":"..."}`
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
    let featuredImageUrl: string | null = null;
    try {
      const imgResult = await generateImage({ prompt: article.imagePrompt });
      featuredImageUrl = imgResult.url ?? null;
    } catch (err) {
      console.error("[Blog Scheduler] Image generation failed, continuing without image:", err);
    }

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
      internalLinks: [
        { text: "Browse our card database", url: "/cards" },
        { text: "View our checklists", url: "/checklists" },
        { text: "See our process", url: "/our-process" },
        { text: "Shop NLF repacks", url: "/shop" },
      ],
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
  
  // Run immediately on startup
  checkScheduledPosts().catch(console.error);
  
  // Set interval for regular checks
  setInterval(async () => {
    await checkScheduledPosts();
    await checkAutoGeneration();
  }, CHECK_INTERVAL_MS);
}
