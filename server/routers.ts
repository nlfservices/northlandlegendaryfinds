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
import { slabPackAdminRouter, slabPackPublicRouter } from "./routers/slabPacks";

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

  // MCU Intel articles (public)
  articles: articlePublicRouter,

  // MCU Intel articles (admin)
  adminArticles: articleAdminRouter,

  // Top 5 Buzz (public)
  top5: top5PublicRouter,

  // Top 5 Buzz (admin)
  adminTop5: top5AdminRouter,

  // Digital Slab Packs (admin)
  adminSlabPacks: slabPackAdminRouter,

  // Digital Slab Packs (public)
  slabPacks: slabPackPublicRouter,
});

export type AppRouter = typeof appRouter;
