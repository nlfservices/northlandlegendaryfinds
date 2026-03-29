import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { generateImage } from "../_core/imageGeneration";
import {
  getAllBlogPosts, getPublishedBlogPosts, getPublishedBlogPostsByCategory,
  getFeaturedBlogPosts, getPublishedBlogPostBySlug, getBlogPostById,
  createBlogPost, updateBlogPost, deleteBlogPost,
  toggleBlogPostFeatured, toggleBlogPostPublished,
  incrementBlogPostViews, publishScheduledBlogPosts,
  getBlogPostsWithoutImages,
} from "../db";
import { NLF_BLOG_SYSTEM_PROMPT, BULK_TOPIC_POOL, CATEGORY_LABELS } from "../blog-content-strategy";

const BLOG_CATEGORIES = [
  "market_trends", "character_spotlight", "grading_guide",
  "set_breakdown", "investment_strategy", "collecting_tips",
  "nlf_news", "behind_the_scenes", "card_history", "sports_crossover"
] as const;

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

      console.log(`[Blog Image] Attempt ${attempt}/${maxRetries} for "${title.substring(0, 50)}..."`);
      const imgResult = await generateImage({ prompt });
      if (imgResult.url) {
        console.log(`[Blog Image] Success on attempt ${attempt}`);
        return imgResult.url;
      }
    } catch (err) {
      console.error(`[Blog Image] Attempt ${attempt} failed:`, err);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }

  console.error(`[Blog Image] All ${maxRetries} attempts failed for "${title}"`);
  return null;
}

const blogPostInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  contentMarkdown: z.string().min(1),
  featuredImageUrl: z.string().optional(),
  category: z.enum(BLOG_CATEGORIES).default("market_trends"),
  tags: z.array(z.string()).optional(),
  isAiGenerated: z.boolean().default(false),
  aiPrompt: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  authorName: z.string().default("NLF Team"),
  publishedAt: z.number().optional(),
  scheduledAt: z.number().optional(),
  metaDescription: z.string().optional(),
  focusKeyword: z.string().optional(),
  internalLinks: z.array(z.object({ text: z.string(), url: z.string() })).optional(),
  readTimeMinutes: z.number().optional(),
});

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

// ==================== ADMIN BLOG ROUTES ====================

export const blogAdminRouter = router({
  list: adminProcedure.query(async () => {
    return getAllBlogPosts();
  }),

  getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getBlogPostById(input.id);
  }),

  create: adminProcedure.input(blogPostInput).mutation(async ({ input }) => {
    const readTime = Math.max(1, Math.ceil((input.contentMarkdown || "").split(/\s+/).length / 200));
    await createBlogPost({
      ...input,
      excerpt: input.excerpt ?? null,
      featuredImageUrl: input.featuredImageUrl ?? null,
      tags: input.tags ?? null,
      aiPrompt: input.aiPrompt ?? null,
      publishedAt: input.isPublished ? (input.publishedAt ?? Date.now()) : null,
      scheduledAt: input.scheduledAt ?? null,
      metaDescription: input.metaDescription ?? null,
      focusKeyword: input.focusKeyword ?? null,
      internalLinks: input.internalLinks ?? null,
      readTimeMinutes: readTime,
    });
    return { success: true };
  }),

  update: adminProcedure.input(z.object({
    id: z.number(),
    data: blogPostInput.partial(),
  })).mutation(async ({ input }) => {
    const updateData: any = { ...input.data };
    if (updateData.contentMarkdown) {
      updateData.readTimeMinutes = Math.max(1, Math.ceil(updateData.contentMarkdown.split(/\s+/).length / 200));
    }
    await updateBlogPost(input.id, updateData);
    return { success: true };
  }),

  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await deleteBlogPost(input.id);
    return { success: true };
  }),

  toggleFeatured: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await toggleBlogPostFeatured(input.id);
    return { success: true };
  }),

  togglePublished: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await toggleBlogPostPublished(input.id);
    return { success: true };
  }),

  // AI Article Generation — uses centralized NLF content strategy
  generateArticle: adminProcedure.input(z.object({
    topic: z.string().optional(),
    category: z.enum(BLOG_CATEGORIES).default("market_trends"),
    focusKeyword: z.string().optional(),
    autoPublish: z.boolean().default(false),
    scheduledAt: z.number().optional(),
  })).mutation(async ({ input }) => {
    const categoryLabel = CATEGORY_LABELS[input.category] || input.category;
    const topicPrompt = input.topic
      ? `Write about: ${input.topic}`
      : `Choose a compelling, specific topic within the category: ${categoryLabel}`;

    const userPrompt = `${topicPrompt}

Category: ${categoryLabel}
${input.focusKeyword ? `Focus Keyword: ${input.focusKeyword}` : ""}

Respond in this exact JSON format:
{
  "title": "Article title (60 chars max for SEO)",
  "slug": "url-friendly-slug",
  "excerpt": "2-3 sentence preview (max 300 chars)",
  "contentMarkdown": "Full article in markdown with H2/H3 headings",
  "metaDescription": "SEO meta description (max 160 chars)",
  "focusKeyword": "primary SEO keyword",
  "tags": ["tag1", "tag2", "tag3"],
  "imagePrompt": "A detailed prompt to generate a featured image for this article. Should be visually striking, related to the topic, dark cosmic theme. MUST NOT contain any text, letters, or words in the image."
}`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: NLF_BLOG_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: JSON_SCHEMA,
    });

    const rawContent = response.choices[0]?.message?.content;
    if (!rawContent) throw new Error("Failed to generate article content");
    const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
    const article = JSON.parse(contentStr);

    // Generate featured image with retry logic
    const featuredImageUrl = await generateImageWithRetry(
      article.imagePrompt,
      article.title,
      input.category
    );

    const readTime = Math.max(1, Math.ceil(article.contentMarkdown.split(/\s+/).length / 200));
    const now = Date.now();

    await createBlogPost({
      title: article.title,
      slug: article.slug + "-" + Date.now().toString(36),
      excerpt: article.excerpt,
      contentMarkdown: article.contentMarkdown,
      featuredImageUrl,
      category: input.category,
      tags: article.tags,
      isAiGenerated: true,
      aiPrompt: input.topic || topicPrompt,
      isFeatured: false,
      isPublished: input.autoPublish,
      authorName: "NLF Team",
      publishedAt: input.autoPublish ? now : null,
      scheduledAt: input.scheduledAt ?? null,
      metaDescription: article.metaDescription,
      focusKeyword: article.focusKeyword || input.focusKeyword || null,
      internalLinks: INTERNAL_LINKS,
      readTimeMinutes: readTime,
    });

    return { success: true, title: article.title };
  }),

  // Bulk generate articles for scheduling — uses centralized topic pool
  bulkGenerate: adminProcedure.input(z.object({
    count: z.number().min(1).max(24),
    intervalMinutes: z.number().default(60),
    startTime: z.number().optional(),
    categories: z.array(z.enum(BLOG_CATEGORIES)).optional(),
  })).mutation(async ({ input }) => {
    const startTime = input.startTime || Date.now();
    const results: { title: string; scheduledAt: number }[] = [];

    for (let i = 0; i < Math.min(input.count, BULK_TOPIC_POOL.length); i++) {
      const scheduledAt = startTime + (i * input.intervalMinutes * 60 * 1000);
      const topicEntry = BULK_TOPIC_POOL[i];

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: NLF_BLOG_SYSTEM_PROMPT },
            {
              role: "user",
              content: `Write about: ${topicEntry.topic}\nCategory: ${CATEGORY_LABELS[topicEntry.category] || topicEntry.category}\n\nRespond in JSON: {"title":"...","slug":"...","excerpt":"...","contentMarkdown":"...","metaDescription":"...","focusKeyword":"...","tags":["..."],"imagePrompt":"A detailed prompt for a featured image. MUST NOT contain any text, letters, or words."}`
            },
          ],
          response_format: JSON_SCHEMA,
        });

        const rawBulk = response.choices[0]?.message?.content;
        const bulkStr = typeof rawBulk === "string" ? rawBulk : JSON.stringify(rawBulk || "{}");
        const parsed = JSON.parse(bulkStr);

        // Generate image with retry logic
        const featuredImageUrl = await generateImageWithRetry(
          parsed.imagePrompt,
          parsed.title,
          topicEntry.category
        );

        const readTime = Math.max(1, Math.ceil((parsed.contentMarkdown || "").split(/\s+/).length / 200));

        await createBlogPost({
          title: parsed.title,
          slug: parsed.slug + "-" + Date.now().toString(36),
          excerpt: parsed.excerpt,
          contentMarkdown: parsed.contentMarkdown,
          featuredImageUrl,
          category: topicEntry.category,
          tags: parsed.tags,
          isAiGenerated: true,
          aiPrompt: topicEntry.topic,
          isFeatured: i < 3,
          isPublished: false,
          authorName: "NLF Team",
          publishedAt: null,
          scheduledAt,
          metaDescription: parsed.metaDescription,
          focusKeyword: parsed.focusKeyword,
          internalLinks: INTERNAL_LINKS,
          readTimeMinutes: readTime,
        });

        results.push({ title: parsed.title, scheduledAt });
      } catch (err) {
        console.error(`[Blog] Failed to generate article ${i + 1}:`, err);
      }
    }

    return { success: true, generated: results.length, articles: results };
  }),

  // Publish scheduled posts (called by cron/scheduler)
  publishScheduled: adminProcedure.mutation(async () => {
    const count = await publishScheduledBlogPosts();
    return { success: true, published: count };
  }),

  // Regenerate images for posts that are missing them
  regenerateImages: adminProcedure.mutation(async () => {
    const postsWithoutImages = await getBlogPostsWithoutImages();
    let fixed = 0;
    let failed = 0;

    for (const post of postsWithoutImages) {
      try {
        const imagePrompt = `A visually striking, high-quality illustration for a blog article titled "${post.title}". Trading cards theme, dark cosmic background with vibrant green and purple energy, professional and eye-catching. No text, no letters, no words in the image.`;
        
        const imageUrl = await generateImageWithRetry(
          imagePrompt,
          post.title,
          post.category || "market_trends"
        );

        if (imageUrl) {
          await updateBlogPost(post.id, { featuredImageUrl: imageUrl });
          fixed++;
          console.log(`[Blog] Regenerated image for: "${post.title}"`);
        } else {
          failed++;
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (err) {
        console.error(`[Blog] Failed to regenerate image for post ${post.id}:`, err);
        failed++;
      }
    }

    return { success: true, total: postsWithoutImages.length, fixed, failed };
  }),
});

// ==================== PUBLIC BLOG ROUTES ====================

export const blogPublicRouter = router({
  list: publicProcedure.input(z.object({
    category: z.string().optional(),
    limit: z.number().optional(),
  }).optional()).query(async ({ input }) => {
    if (input?.category) {
      return getPublishedBlogPostsByCategory(input.category);
    }
    return getPublishedBlogPosts(input?.limit);
  }),

  featured: publicProcedure.query(async () => {
    return getFeaturedBlogPosts();
  }),

  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const post = await getPublishedBlogPostBySlug(input.slug);
    if (post) {
      incrementBlogPostViews(post.id).catch(() => {});
    }
    return post;
  }),

  categories: publicProcedure.query(() => {
    return [
      { key: "market_trends", label: "Market Trends", description: "Card values, price movements, and investment analysis" },
      { key: "character_spotlight", label: "Character Spotlight", description: "Deep dives into Marvel character card values" },
      { key: "grading_guide", label: "Grading Guide", description: "CGC, AGS, PSA — everything about card grading" },
      { key: "set_breakdown", label: "Set Breakdown", description: "Topps Marvel set analysis and chase card guides" },
      { key: "investment_strategy", label: "Investment Strategy", description: "Building your Marvel card portfolio" },
      { key: "collecting_tips", label: "Collecting Tips", description: "Best practices for new and experienced collectors" },
      { key: "nlf_news", label: "NLF News", description: "Updates from Northland Legendary Finds" },
      { key: "behind_the_scenes", label: "Behind the Scenes", description: "How NLF builds premium repacks" },
      { key: "card_history", label: "Card History", description: "The rich history of Marvel trading cards" },
      { key: "sports_crossover", label: "Sports Crossover", description: "From sports cards to Marvel cards — the collector's bridge" },
    ];
  }),
});
