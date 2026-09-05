import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { repairMojibake } from "@shared/repairMojibake";
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
import {
  NLF_BLOG_SYSTEM_PROMPT, BULK_TOPIC_POOL, CATEGORY_LABELS,
  getNextTemplateKey, getLayoutDataPrompt, BLOG_JSON_SCHEMA_WITH_LAYOUT,
  TEMPLATE_DISPLAY_NAMES,
} from "../blog-content-strategy";

const BLOG_CATEGORIES = [
  "market_trends", "character_spotlight", "grading_guide",
  "set_breakdown", "investment_strategy", "collecting_tips",
  "nlf_news", "behind_the_scenes", "card_history", "sports_crossover"
] as const;

// Reliable image generation with retry logic
async function generateImageWithRetry(imagePrompt: string, title: string, category: string, maxRetries = 3): Promise<string | null> {
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

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let prompt = imagePrompt;
      if (attempt === 2) {
        prompt = `Realistic product photograph related to: ${title}. Trading cards on a dark surface with natural lighting, shallow depth of field, professional photography style. No text, no letters, no words.`;
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

// Legacy JSON schema (without layoutData) — kept for backward compatibility
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

  // AI Article Generation — ORDER 66 Layout Engine with template rotation
  generateArticle: adminProcedure.input(z.object({
    topic: z.string().optional(),
    category: z.enum(BLOG_CATEGORIES).default("market_trends"),
    focusKeyword: z.string().optional(),
    autoPublish: z.boolean().default(false),
    scheduledAt: z.number().optional(),
  })).mutation(async ({ input }) => {
    // Get next template in the rotation
    const templateKey = getNextTemplateKey();
    const templateName = TEMPLATE_DISPLAY_NAMES[templateKey];
    const layoutDataPrompt = getLayoutDataPrompt(templateKey);

    const categoryLabel = CATEGORY_LABELS[input.category] || input.category;
    const topicPrompt = input.topic
      ? `Write about: ${input.topic}`
      : `Choose a compelling, specific topic within the category: ${categoryLabel}`;

    const userPrompt = `${topicPrompt}

Category: ${categoryLabel}
${input.focusKeyword ? `Focus Keyword: ${input.focusKeyword}` : ""}

This article will use the "${templateKey}" template (${templateName}).
${layoutDataPrompt}

Respond in JSON with these fields:
- title, slug, excerpt, contentMarkdown, metaDescription, focusKeyword, tags, imagePrompt, layoutData

imagePrompt MUST describe a REALISTIC PHOTOGRAPHY-STYLE image. Must look like a real photograph, not AI art. Use product photography, flat-lay, macro, or lifestyle photo styles with natural lighting. NEVER use cosmic, glowing, neon, or illustrated styles. MUST NOT contain any text, letters, or words.`;

    console.log(`[Blog] Generating article with Template: ${templateKey} (${templateName})`);

    const response = await invokeLLM({
      messages: [
        { role: "system", content: NLF_BLOG_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: BLOG_JSON_SCHEMA_WITH_LAYOUT,
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
      layoutTemplate: 1,
      layoutData: article.layoutData || null,
    });

    return { success: true, title: article.title, template: templateKey, templateName };
  }),

  // Bulk generate articles for scheduling — with template rotation
  bulkGenerate: adminProcedure.input(z.object({
    count: z.number().min(1).max(24),
    intervalMinutes: z.number().default(60),
    startTime: z.number().optional(),
    categories: z.array(z.enum(BLOG_CATEGORIES)).optional(),
  })).mutation(async ({ input }) => {
    const startTime = input.startTime || Date.now();
    const results: { title: string; scheduledAt: number; template: string }[] = [];

    for (let i = 0; i < Math.min(input.count, BULK_TOPIC_POOL.length); i++) {
      const scheduledAt = startTime + (i * input.intervalMinutes * 60 * 1000);
      const topicEntry = BULK_TOPIC_POOL[i];
      const templateKey = getNextTemplateKey();
      const templateName = TEMPLATE_DISPLAY_NAMES[templateKey];
      const layoutDataPrompt = getLayoutDataPrompt(templateKey);

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: NLF_BLOG_SYSTEM_PROMPT },
            {
              role: "user",
              content: `Write about: ${topicEntry.topic}\nCategory: ${CATEGORY_LABELS[topicEntry.category] || topicEntry.category}\n\nThis article will use the "${templateKey}" template (${templateName}).\n${layoutDataPrompt}\n\nRespond in JSON with: title, slug, excerpt, contentMarkdown, metaDescription, focusKeyword, tags, imagePrompt, layoutData\n\nimagePrompt MUST describe a REALISTIC PHOTOGRAPHY-STYLE image. MUST NOT contain any text, letters, or words.`
            },
          ],
          response_format: BLOG_JSON_SCHEMA_WITH_LAYOUT,
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
          layoutTemplate: 1,
          layoutData: parsed.layoutData || null,
        });

        results.push({ title: parsed.title, scheduledAt, template: templateKey });
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
        const imagePrompt = `Realistic product photograph for a blog article titled "${post.title}". Trading cards arranged on a dark surface with natural lighting, shallow depth of field, professional photography style. No text, no letters, no words in the image.`;
        
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

function repairBlogPost<T extends {
  title?: string | null;
  excerpt?: string | null;
  contentMarkdown?: string | null;
  metaDescription?: string | null;
}>(post: T | null | undefined): T | null | undefined {
  if (!post) return post;
  const repair = (value: string | null | undefined) =>
    value == null ? value : repairMojibake(value);
  return {
    ...post,
    title: repair(post.title) as T["title"],
    excerpt: repair(post.excerpt) as T["excerpt"],
    contentMarkdown: repair(post.contentMarkdown) as T["contentMarkdown"],
    metaDescription: repair(post.metaDescription) as T["metaDescription"],
  };
}

export const blogPublicRouter = router({
  list: publicProcedure.input(z.object({
    category: z.string().optional(),
    limit: z.number().optional(),
  }).optional()).query(async ({ input }) => {
    const posts = input?.category
      ? await getPublishedBlogPostsByCategory(input.category)
      : await getPublishedBlogPosts(input?.limit);
    return (posts || []).map((post) => repairBlogPost(post));
  }),

  featured: publicProcedure.query(async () => {
    const posts = await getFeaturedBlogPosts();
    return (posts || []).map((post) => repairBlogPost(post));
  }),

  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const post = await getPublishedBlogPostBySlug(input.slug);
    if (post) {
      incrementBlogPostViews(post.id).catch(() => {});
    }
    return repairBlogPost(post);
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
