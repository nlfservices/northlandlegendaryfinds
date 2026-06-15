import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getAllArticles, getPublishedArticles, getPublishedArticlesByCategory,
  getFeaturedArticles, getPublishedArticleBySlug, getArticleById,
  createArticle, updateArticle, deleteArticle,
  toggleArticleFeatured, toggleArticlePublished,
  castArticleVote, getArticleVoteCounts, getVisitorArticleVote,
  getAllArticleVoteSummaries, getRelatedArticles,
} from "../db";

const articleInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  contentMarkdown: z.string().min(1),
  featuredImageUrl: z.string().optional(),
  category: z.enum(["movie_news", "show_news", "casting", "card_market", "release_dates", "rumors", "analysis", "interactive_social"]).default("movie_news"),
  tags: z.array(z.string()).optional(),
  cardMarketImpact: z.string().optional(),
  relatedCharacters: z.array(z.string()).optional(),
  sources: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  authorName: z.string().default("NLF Team"),
  publishedAt: z.number().optional(),
  scheduledAt: z.number().optional(),
  metaDescription: z.string().optional(),
});

// ==================== ADMIN ARTICLE ROUTES ====================

export const articleAdminRouter = router({
  list: adminProcedure.query(async () => {
    return getAllArticles();
  }),

  getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getArticleById(input.id);
  }),

  create: adminProcedure.input(articleInput).mutation(async ({ input }) => {
    await createArticle({
      ...input,
      excerpt: input.excerpt ?? null,
      featuredImageUrl: input.featuredImageUrl ?? null,
      tags: input.tags ?? null,
      cardMarketImpact: input.cardMarketImpact ?? null,
      relatedCharacters: input.relatedCharacters ?? null,
      sources: input.sources ?? null,
      publishedAt: input.isPublished ? (input.publishedAt ?? Date.now()) : null,
      scheduledAt: (!input.isPublished && input.scheduledAt) ? input.scheduledAt : null,
      metaDescription: input.metaDescription ?? null,
    });
    return { success: true };
  }),

  update: adminProcedure.input(z.object({
    id: z.number(),
    data: articleInput.partial(),
  })).mutation(async ({ input }) => {
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

  togglePublished: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
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
    if (input?.category) {
      return getPublishedArticlesByCategory(input.category);
    }
    return getPublishedArticles(input?.limit);
  }),

  featured: publicProcedure.query(async () => {
    return getFeaturedArticles();
  }),

  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    return getPublishedArticleBySlug(input.slug);
  }),

  /** Get vote counts for an article */
  getVotes: publicProcedure.input(z.object({ articleId: z.number() })).query(async ({ input }) => {
    return getArticleVoteCounts(input.articleId);
  }),

  /** Get a visitor's existing vote */
  getMyVote: publicProcedure.input(z.object({ articleId: z.number(), visitorId: z.string() })).query(async ({ input }) => {
    return getVisitorArticleVote(input.articleId, input.visitorId);
  }),

  /** Cast or update a vote */
  vote: publicProcedure.input(z.object({
    articleId: z.number(),
    reaction: z.enum(["loved", "fire", "meh", "thumbsdown"]),
    visitorId: z.string(),
  })).mutation(async ({ input }) => {
    await castArticleVote(input.articleId, input.reaction, input.visitorId);
    return { success: true };
  }),

  /** Get vote summaries for all articles (Voting Grounds) */
  allVoteSummaries: publicProcedure.query(async () => {
    return getAllArticleVoteSummaries();
  }),

  /** Get related articles by shared tags, excluding the current article */
  getRelated: publicProcedure.input(z.object({
    slug: z.string(),
    tags: z.array(z.string()),
    limit: z.number().min(1).max(6).default(3),
  })).query(async ({ input }) => {
    return getRelatedArticles(input.slug, input.tags, input.limit);
  }),
});
