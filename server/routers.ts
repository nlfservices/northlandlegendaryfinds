import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { adminRouter } from "./routers/admin";
import { publicRouter } from "./routers/public";
import { checkoutRouter } from "./routers/checkout";
import { ebayRouter } from "./routers/ebay";
import { matrixRouter } from "./routers/matrix";
import { subscriberRouter } from "./routers/subscriber";
import { articlePublicRouter, articleAdminRouter } from "./routers/articles";
import { top5PublicRouter, top5AdminRouter } from "./routers/top5";
import { youtubeRouter } from "./routers/youtube";
import { blogPublicRouter, blogAdminRouter } from "./routers/blog";
import { loyaltyPublicRouter, loyaltyProtectedRouter, loyaltyAdminRouter } from "./routers/loyalty";
import { cardShowsPublicRouter, cardShowsAdminRouter } from "./routers/cardShows";
import { socialPostRouter } from "./routers/socialPosts";
import { metaCapiRouter } from "./routers/metaCapi";
import { affiliateAdminRouter, affiliatePublicRouter } from "./routers/affiliateLinks";
import { mcuMediaPublicRouter, mcuMediaAdminRouter } from "./routers/mcuMedia";
import { socialDraftsRouter } from "./routers/socialDrafts";
import { ghlAdminRouter } from "./routers/ghlAdmin";
import { pollsRouter } from "./routers/polls";
import { socialBotRouter } from "./routers/socialBot";
import { apiKeysRouter } from "./routers/apiKeys";
import { userManagementRouter } from "./routers/userManagement";
import { invitesRouter } from "./routers/invites";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Admin routes (require admin role)
  admin: adminRouter,

  // Public routes (no auth required)
  public: publicRouter,

  // Checkout routes (Stripe integration)
  checkout: checkoutRouter,

  // eBay API routes (admin only)
  ebay: ebayRouter,

  // Matrix admin portal (access code gate + IP lockout)
  matrix: matrixRouter,

  // Subscriber routes
  subscriber: subscriberRouter,

  // MCU News articles (public)
  articles: articlePublicRouter,

  // MCU News articles (admin)
  adminArticles: articleAdminRouter,

  // Top 5 Buzz (public)
  top5: top5PublicRouter,

  // Top 5 Buzz (admin)
  adminTop5: top5AdminRouter,

  // YouTube RSS feed (public)
  youtube: youtubeRouter,

  // The Collector blog (public)
  blog: blogPublicRouter,

  // The Collector blog (admin)
  adminBlog: blogAdminRouter,

  // Loyalty/Rewards program (public)
  loyalty: loyaltyPublicRouter,

  // Loyalty/Rewards program (authenticated member)
  loyaltyMember: loyaltyProtectedRouter,

  // Loyalty/Rewards program (admin)
  adminLoyalty: loyaltyAdminRouter,

  // Card Shows directory (public)
  cardShows: cardShowsPublicRouter,

  // Card Shows directory (admin)
  adminCardShows: cardShowsAdminRouter,

  // Social Post Generator (admin)
  socialPosts: socialPostRouter,

  // Meta Conversions API (server-side tracking)
  metaCapi: metaCapiRouter,

  // Affiliate Links (public - for Collector's Corner)
  affiliateLinks: affiliatePublicRouter,

  // Affiliate Links (admin management)
  adminAffiliateLinks: affiliateAdminRouter,

  // MCU Movies & Series (public)
  mcuMedia: mcuMediaPublicRouter,

  // MCU Movies & Series (admin)
  adminMcuMedia: mcuMediaAdminRouter,

  // Social Drafts (admin - AI content + image generation pipeline)
  socialDrafts: socialDraftsRouter,

  // GHL CRM (admin - conversations & contacts from GoHighLevel)
  ghl: ghlAdminRouter,

  // Article Polls (community voting)
  polls: pollsRouter,

  // Facebook Comment Bot (admin)
  socialBot: socialBotRouter,

  // API Key management (admin only)
  apiKeys: apiKeysRouter,

  // User management portal (admin+)
  userManagement: userManagementRouter,

  // User invitations (admin+)
  invites: invitesRouter,

});

export type AppRouter = typeof appRouter;
