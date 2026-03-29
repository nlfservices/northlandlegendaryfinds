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
} from "../db";

const BLOG_CATEGORIES = [
  "market_trends", "character_spotlight", "grading_guide",
  "set_breakdown", "investment_strategy", "collecting_tips",
  "nlf_news", "behind_the_scenes", "card_history"
] as const;

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

  // AI Article Generation
  generateArticle: adminProcedure.input(z.object({
    topic: z.string().optional(),
    category: z.enum(BLOG_CATEGORIES).default("market_trends"),
    focusKeyword: z.string().optional(),
    autoPublish: z.boolean().default(false),
    scheduledAt: z.number().optional(),
  })).mutation(async ({ input }) => {
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

    const categoryLabel = categoryLabels[input.category] || input.category;
    const topicPrompt = input.topic
      ? `Write about: ${input.topic}`
      : `Choose a compelling, specific topic within the category: ${categoryLabel}`;

    const systemPrompt = `You are an expert Marvel trading card content writer for Northland Legendary Finds (NLF), a premium Marvel card repack company. NLF uses grading services including CGC, AGS, and PSA. They sell curated repack series with full transparency — every card is listed on a public checklist before purchase.

Write SEO-optimized blog articles that:
- Position Marvel trading cards as a legitimate collectible investment
- Reference real Marvel characters, sets (Topps Comic Book Heroes, Marvel Ages, etc.), and grading standards
- Include specific card examples and approximate market values when relevant
- Use a knowledgeable but accessible tone — like talking to a fellow collector
- Naturally mention NLF's process, transparency, and quality when relevant (but don't be overly promotional)
- Include internal linking opportunities to NLF pages (card database, checklists, process page)
- Target the focus keyword naturally throughout the article
- Structure with clear H2/H3 headings for SEO
- Include a compelling meta description (max 160 chars)
- End with a call-to-action that drives engagement

The article should be 800-1200 words, well-structured with markdown formatting.`;

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
  "imagePrompt": "A detailed prompt to generate a featured image for this article. Should be visually striking, related to Marvel cards/collecting, dark cosmic theme matching NLF branding."
}`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
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
    if (!rawContent) throw new Error("Failed to generate article content");
    const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);

    const article = JSON.parse(contentStr);

    // Generate featured image
    let featuredImageUrl: string | null = null;
    try {
      const imageResult = await generateImage({
        prompt: article.imagePrompt,
      });
      featuredImageUrl = imageResult.url ?? null;
    } catch (err) {
      console.error("[Blog] Image generation failed:", err);
    }

    const readTime = Math.max(1, Math.ceil(article.contentMarkdown.split(/\s+/).length / 200));
    const now = Date.now();

    // Add internal links
    const internalLinks = [
      { text: "Browse our card database", url: "/cards" },
      { text: "View our checklists", url: "/checklists" },
      { text: "See our process", url: "/our-process" },
      { text: "Shop NLF repacks", url: "/shop" },
    ];

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
      internalLinks,
      readTimeMinutes: readTime,
    });

    return { success: true, title: article.title };
  }),

  // Bulk generate articles for scheduling
  bulkGenerate: adminProcedure.input(z.object({
    count: z.number().min(1).max(24),
    intervalMinutes: z.number().default(60),
    startTime: z.number().optional(),
    categories: z.array(z.enum(BLOG_CATEGORIES)).optional(),
  })).mutation(async ({ input }) => {
    const startTime = input.startTime || Date.now();
    const categories = input.categories || [...BLOG_CATEGORIES];
    const results: { title: string; scheduledAt: number }[] = [];

    const topicPool = [
      { topic: "Top 5 Marvel cards that have doubled in value this year", category: "market_trends" as const },
      { topic: "Why CGC vs PSA vs AGS grading matters for Marvel card values", category: "grading_guide" as const },
      { topic: "Spider-Man cards: the ultimate collecting guide for 2026", category: "character_spotlight" as const },
      { topic: "Topps Comic Book Heroes set breakdown — every chase card explained", category: "set_breakdown" as const },
      { topic: "How to build a Marvel card portfolio that appreciates over time", category: "investment_strategy" as const },
      { topic: "Beginner's guide to Marvel trading card collecting", category: "collecting_tips" as const },
      { topic: "The rise of Marvel cards as alternative investments", category: "investment_strategy" as const },
      { topic: "Doctor Doom cards surge ahead of Avengers Doomsday", category: "market_trends" as const },
      { topic: "Understanding card grading scales: what does a 9.5 really mean?", category: "grading_guide" as const },
      { topic: "Wolverine card values and the X-Men collecting renaissance", category: "character_spotlight" as const },
      { topic: "Marvel Ages vs Comic Book Heroes: which set is the better investment?", category: "set_breakdown" as const },
      { topic: "How repack transparency is changing the card collecting industry", category: "nlf_news" as const },
      { topic: "The history of Marvel trading cards from 1990 to today", category: "card_history" as const },
      { topic: "Iron Man cards: tracking Tony Stark's value across every set", category: "character_spotlight" as const },
      { topic: "Why graded cards outperform raw cards as long-term investments", category: "investment_strategy" as const },
      { topic: "Topps Marvel Platinum: the premium set collectors are chasing", category: "set_breakdown" as const },
      { topic: "How to spot undervalued Marvel cards before they spike", category: "collecting_tips" as const },
      { topic: "The Fantastic Four effect: how MCU announcements move card prices", category: "market_trends" as const },
      { topic: "Building your first graded Marvel card collection on a budget", category: "collecting_tips" as const },
      { topic: "Venom and symbiote cards: a dark horse investment opportunity", category: "character_spotlight" as const },
      { topic: "What makes a repack worth buying? The transparency checklist", category: "nlf_news" as const },
      { topic: "Marvel sketch cards: the most unique collectibles in the hobby", category: "card_history" as const },
      { topic: "Deadpool cards and the comedy premium in Marvel collecting", category: "character_spotlight" as const },
      { topic: "2026 Marvel card market predictions: what's hot and what's not", category: "market_trends" as const },
    ];

    for (let i = 0; i < Math.min(input.count, topicPool.length); i++) {
      const scheduledAt = startTime + (i * input.intervalMinutes * 60 * 1000);
      const topicEntry = topicPool[i];

      try {
        const categoryLabel: Record<string, string> = {
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

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an expert Marvel trading card content writer for Northland Legendary Finds (NLF), a premium Marvel card repack company. NLF uses grading services including CGC, AGS, and PSA. Write SEO-optimized blog articles that position Marvel trading cards as a legitimate collectible investment. Use a knowledgeable but accessible tone. The article should be 800-1200 words with markdown formatting, clear H2/H3 headings.`
            },
            {
              role: "user",
              content: `Write about: ${topicEntry.topic}\nCategory: ${categoryLabel[topicEntry.category]}\n\nRespond in JSON: {"title":"...","slug":"...","excerpt":"...","contentMarkdown":"...","metaDescription":"...","focusKeyword":"...","tags":["..."],"imagePrompt":"..."}`
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

        const rawBulk = response.choices[0]?.message?.content;
        const bulkStr = typeof rawBulk === "string" ? rawBulk : JSON.stringify(rawBulk || "{}");
        const parsed = JSON.parse(bulkStr);

        // Generate image
        let featuredImageUrl: string | null = null;
        try {
          const imgResult = await generateImage({ prompt: parsed.imagePrompt });
          featuredImageUrl = imgResult.url ?? null;
        } catch { /* image gen is best-effort */ }

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
          internalLinks: [
            { text: "Browse our card database", url: "/cards" },
            { text: "View our checklists", url: "/checklists" },
            { text: "See our process", url: "/our-process" },
          ],
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
      // Increment view count (fire and forget)
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
    ];
  }),
});
