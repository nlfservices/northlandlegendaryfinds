import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { adminRouter } from "./routers/admin";
import { publicRouter } from "./routers/public";
import { checkoutRouter } from "./routers/checkout";
import { ebayRouter } from "./routers/ebay";
import { articleAdminRouter, articlePublicRouter } from "./routers/articles";
import { subscriberRouter } from "./routers/subscriber";

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

  // Subscriber routes (The Vault)
  subscriber: subscriberRouter,

  // Article routes (MCU Intel)
  articles: articlePublicRouter,
  adminArticles: articleAdminRouter,
});

export type AppRouter = typeof appRouter;
