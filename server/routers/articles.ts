import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getAllArticles, getPublishedArticles, getPublishedArticlesByCategory,
  getFeaturedArticles, getPublishedArticleBySlug, getArticleById,
  createArticle, updateArticle, deleteArticle,
  toggleArticleFeatured, toggleArticlePublished,
  castArticleVote, getArticleVoteCounts, getVisitorArticleVote,
  getAllArticleVoteSummaries, getRelatedArticles,
} from "../db";
import {
  ROTATION, SPECIALS, CONTRACTS,
  getNextTemplate, advanceRotation, validateArticle,
  getContractSummary, validatePublishedAt, quarantineFailingArticles,
  type RotationTemplate, type AnyTemplate,
} from "../article-pipeline";

const R2_BASE = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev";
const R2_PREFIX = `${R2_BASE}/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi`;
const MANUS_FILE = /(?:https?:\/\/[^/]+)?\/manus-storage\/(.+)$/i;
const CLOUDFRONT = /^https?:\/\/[^/]*cloudfront\.net/i;

function rewriteMedia(url?: string | null) {
  if (!url) return url ?? null;
  const clean = url.split("?")[0];
  const manus = clean.match(MANUS_FILE);
  if (manus) return `${R2_PREFIX}/${manus[1]}`;
  if (CLOUDFRONT.test(clean)) return clean.replace(CLOUDFRONT, R2_BASE);
  return url;
}

function rewriteArticle<T extends { featuredImageUrl?: string | null; contentMarkdown?: string | null }>(article: T | null) {
  if (!article) return article;
  return {
    ...article,
    featuredImageUrl: rewriteMedia(article.featuredImageUrl),
    contentMarkdown: article.contentMarkdown
      ? article.contentMarkdown.replace(/\]\(([^)]+)\)/g, (_full, url: string) => `](${rewriteMedia(url)})`)
      : article.contentMarkdown,
  };
}

const articleInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  contentMarkdown: z.string().min(1),
  featuredImageUrl: z.string().optional(),
  templateLayout: z.string().optional(),
  category: z.enum(["movie_news", "show_news", "casting", "card_market", "release_dates", "rumors", "analysis", "interactive_social"]).default("movie_news"),
  tags: z.array(z.string()).optional(),
  cardMarketImpact: z.string().optional(),
  relatedCharacters: z.array(z.string()).optional(),
  sources: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  isSpecial: z.boolean().default(false),
  authorName: z.string().default("NLF Team"),
  publishedAt: z.number().optional(),
  scheduledAt: z.number().optional(),
  metaDescription: z.string().optional(),
  skipValidation: z.boolean().default(false),
});

// ==================== ADMIN ARTICLE ROUTES ====================

export const articleAdminRouter = router({
  list: adminProcedure.query(async () => {
    return getAllArticles();
  }),

  getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getArticleById(input.id);
  }),

  /** Get the next template in rotation and its contract requirements */
  getNextTemplate: adminProcedure.query(async () => {
    const { name, contract } = await getNextTemplate();
    return {
      template: name,
      contract,
      summary: getContractSummary(name),
      rotationOrder: [...ROTATION],
    };
  }),

  /** Validate an article against a template contract without publishing */
  validateDraft: adminProcedure.input(z.object({
    contentMarkdown: z.string(),
    featuredImageUrl: z.string().optional(),
    templateLayout: z.string().optional(),
  })).query(async ({ input }) => {
    const template = (input.templateLayout || (await getNextTemplate()).name) as AnyTemplate;
    const result = validateArticle(
      { contentMarkdown: input.contentMarkdown, featuredImageUrl: input.featuredImageUrl },
      template
    );
    return { template, ...result, summary: getContractSummary(template) };
  }),

  create: adminProcedure.input(articleInput).mutation(async ({ input }) => {
    let templateLayout: string;
    const isSpecial = input.isSpecial && input.templateLayout &&
      (SPECIALS as readonly string[]).includes(input.templateLayout);

    if (isSpecial) {
      templateLayout = input.templateLayout!;
    } else if (input.templateLayout && (ROTATION as readonly string[]).includes(input.templateLayout)) {
      templateLayout = input.templateLayout;
    } else {
      const { name } = await getNextTemplate();
      templateLayout = name;
    }

    if (input.isPublished && !input.skipValidation) {
      const result = validateArticle(
        { contentMarkdown: input.contentMarkdown, featuredImageUrl: input.featuredImageUrl },
        templateLayout as AnyTemplate
      );
      if (!result.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Article fails ${templateLayout} template contract:\n${result.errors.join("\n")}`,
        });
      }
    }

    await createArticle({
      ...input,
      templateLayout: templateLayout as any,
      excerpt: input.excerpt ?? null,
      featuredImageUrl: input.featuredImageUrl ?? null,
      tags: input.tags ?? null,
      cardMarketImpact: input.cardMarketImpact ?? null,
      relatedCharacters: input.relatedCharacters ?? null,
      sources: input.sources ?? null,
      publishedAt: input.isPublished ? validatePublishedAt(input.publishedAt) : null,
      scheduledAt: (!input.isPublished && input.scheduledAt) ? validatePublishedAt(input.scheduledAt) : null,
      metaDescription: input.metaDescription ?? null,
    });

    if (input.isPublished && !isSpecial && (ROTATION as readonly string[]).includes(templateLayout)) {
      await advanceRotation(templateLayout as RotationTemplate);
    }

    return { success: true, templateLayout };
  }),

  update: adminProcedure.input(z.object({
    id: z.number(),
    data: articleInput.partial(),
  })).mutation(async ({ input }) => {
    const existing = await getArticleById(input.id);
    if (existing && existing.isPublished) {
      const template = (input.data.templateLayout || existing.templateLayout) as AnyTemplate;
      const merged = {
        contentMarkdown: input.data.contentMarkdown || existing.contentMarkdown,
        featuredImageUrl: input.data.featuredImageUrl || existing.featuredImageUrl,
      };
      if (template && CONTRACTS[template]) {
        const result = validateArticle(merged, template);
        if (!result.ok) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Update blocked — published article fails ${template} contract: ${result.errors.join("; ")}`,
          });
        }
      }
      if (input.data.publishedAt) {
        validatePublishedAt(input.data.publishedAt as number);
      }
    }
    await updateArticle(input.id, input.data as any);
    return { success: true };
  }),

  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await deleteArticle(input.id);
    return { success: true };
  }),

  toggleFeatured: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await toggleArticleFeatured(input.id);
    return { success: true };
  }),

  quarantineCheck: adminProcedure.mutation(async () => {
    const result = await quarantineFailingArticles(
      async () => {
        const all = await getPublishedArticles();
        return (all || []).map((a: any) => ({
          id: a.id,
          slug: a.slug,
          templateLayout: a.templateLayout || "classic",
          contentMarkdown: a.contentMarkdown || "",
          featuredImageUrl: a.featuredImageUrl || null,
        }));
      },
      async (id: number) => {
        await toggleArticlePublished(id);
      }
    );
    return result;
  }),

  togglePublished: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const article = await getArticleById(input.id);
    if (!article) throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });

    if (!article.isPublished) {
      const template = (article.templateLayout || (await getNextTemplate()).name) as AnyTemplate;
      const result = validateArticle(
        { contentMarkdown: article.contentMarkdown, featuredImageUrl: article.featuredImageUrl },
        template
      );
      if (!result.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot publish: article fails ${template} template contract:\n${result.errors.join("\n")}`,
        });
      }

      const isSpecial = (SPECIALS as readonly string[]).includes(template);
      if (!isSpecial && (ROTATION as readonly string[]).includes(template)) {
        await advanceRotation(template as RotationTemplate);
      }
    }

    await toggleArticlePublished(input.id);
    return { success: true };
  }),
});

// ==================== PUBLIC ARTICLE ROUTES ====================

export const articlePublicRouter = router({
  list: publicProcedure.input(z.object({
    category: z.string().optional(),
    limit: z.number().optional(),
  }).optional()).query(async ({ input }) => {
    const rows = input?.category
      ? await getPublishedArticlesByCategory(input.category)
      : await getPublishedArticles(input?.limit);
    return (rows || []).map((row: any) => rewriteArticle(row));
  }),

  featured: publicProcedure.query(async () => {
    const rows = await getFeaturedArticles();
    return (rows || []).map((row: any) => rewriteArticle(row));
  }),

  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    return rewriteArticle(await getPublishedArticleBySlug(input.slug));
  }),

  getVotes: publicProcedure.input(z.object({ articleId: z.number() })).query(async ({ input }) => {
    return getArticleVoteCounts(input.articleId);
  }),

  getMyVote: publicProcedure.input(z.object({ articleId: z.number(), visitorId: z.string() })).query(async ({ input }) => {
    return getVisitorArticleVote(input.articleId, input.visitorId);
  }),

  vote: publicProcedure.input(z.object({
    articleId: z.number(),
    reaction: z.enum(["loved", "fire", "meh", "thumbsdown"]),
    visitorId: z.string(),
  })).mutation(async ({ input }) => {
    await castArticleVote(input.articleId, input.reaction, input.visitorId);
    return { success: true };
  }),

  allVoteSummaries: publicProcedure.query(async () => {
    return getAllArticleVoteSummaries();
  }),

  getRelated: publicProcedure.input(z.object({
    slug: z.string(),
    tags: z.array(z.string()),
    limit: z.number().min(1).max(6).default(3),
  })).query(async ({ input }) => {
    const rows = await getRelatedArticles(input.slug, input.tags, input.limit);
    return (rows || []).map((row: any) => rewriteArticle(row));
  }),
});
