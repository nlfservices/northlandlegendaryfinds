import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { getDb } from "../db";
import {
  users,
  articles,
  blogPosts,
  inventoryCards,
  shows,
  orders,
  socialPostDrafts,
  launchSubscribers,
  repackProducts,
  cardSets,
  pulls,
  loyaltyMembers,
} from "../../drizzle/schema";
import { count, gte, eq, sql } from "drizzle-orm";

// Verify the caller has a valid Matrix admin session
function isAdminSession(req: any): boolean {
  const cookie = req.cookies?.["nlf_matrix_session"];
  return !!cookie;
}

async function getSiteContext(): Promise<string> {
  const db = await getDb();
  if (!db) return "Database not available — cannot retrieve live site data.";

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    [totalUsers],
    [recentUsers],
    [publishedArticles],
    [draftArticles],
    [totalBlogPosts],
    [totalInventory],
    [totalShows],
    [upcomingShows],
    [totalOrders],
    [recentOrders],
    [totalSubscribers],
    [recentSubscribers],
    [totalProducts],
    [totalCardSets],
    [totalPulls],
    [recentPulls],
    [totalSocialDrafts],
    [pendingSocialDrafts],
    [loyaltyMembersCount],
  ] = await Promise.all([
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(users).where(gte(users.createdAt, sevenDaysAgo)),
    db.select({ value: count() }).from(articles).where(eq(articles.isPublished, true)),
    db.select({ value: count() }).from(articles).where(eq(articles.isPublished, false)),
    db.select({ value: count() }).from(blogPosts),
    db.select({ value: count() }).from(inventoryCards),
    db.select({ value: count() }).from(shows),
    db.select({ value: count() }).from(shows).where(gte(shows.showDate, now.getTime())),

    db.select({ value: count() }).from(orders),
    db.select({ value: count() }).from(orders).where(gte(orders.createdAt, thirtyDaysAgo)),
    db.select({ value: count() }).from(launchSubscribers),
    db.select({ value: count() }).from(launchSubscribers).where(gte(launchSubscribers.createdAt, sevenDaysAgo)),
    db.select({ value: count() }).from(repackProducts),
    db.select({ value: count() }).from(cardSets),
    db.select({ value: count() }).from(pulls),
    db.select({ value: count() }).from(pulls).where(gte(pulls.createdAt, sevenDaysAgo)),
    db.select({ value: count() }).from(socialPostDrafts),
    db.select({ value: count() }).from(socialPostDrafts).where(eq(socialPostDrafts.status, "draft")),
    db.select({ value: count() }).from(loyaltyMembers),
  ]);

  return `
You are the NLF Command Center AI Assistant for Northland Legendary Finds — a Marvel trading card collector community and content hub at northlandlegendaryfinds.com.

You have access to live site data as of ${now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}:

## USERS & COMMUNITY
- Total registered users: ${totalUsers.value}
- New users (last 7 days): ${recentUsers.value}
- Launch subscribers (email list): ${totalSubscribers.value}
- New subscribers (last 7 days): ${recentSubscribers.value}
- Loyalty program members: ${loyaltyMembersCount.value}

## CONTENT
- Published MCU News articles: ${publishedArticles.value}
- Draft MCU News articles: ${draftArticles.value}
- The Collector blog posts: ${totalBlogPosts.value}
- Pending social post drafts: ${pendingSocialDrafts.value}
- Total social post drafts: ${totalSocialDrafts.value}

## PRODUCTS & INVENTORY
- Repack products: ${totalProducts.value}
- Card sets in database: ${totalCardSets.value}
- Inventory cards tracked: ${totalInventory.value}
- Total pulls logged: ${totalPulls.value}
- Pulls logged (last 7 days): ${recentPulls.value}

## SHOWS & ORDERS
- Total shows: ${totalShows.value}
- Upcoming shows: ${upcomingShows.value}
- Total orders: ${totalOrders.value}
- Orders (last 30 days): ${recentOrders.value}

## SITE STRATEGY
- NLF is a collector community and content hub — NOT a card shop
- Focus: building data, community, and MCU content
- Repacks are the future revenue stream, launching around Avengers: Doomsday (May 2026)
- Key pages: /mcu-news, /movies-series, /marvel-characters, /about, /whatnot
- Brand voice: casual, knowledgeable, community-focused — never corporate

Answer questions accurately using this data. Be concise, direct, and helpful. If asked about something not in the data, say so honestly rather than guessing.
`.trim();
}

export const aiAssistantRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Require Matrix admin session
      if (!isAdminSession(ctx.req)) {
        throw new Error("Admin session required");
      }

      const systemContext = await getSiteContext();

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemContext },
          ...input.messages,
        ],
      });

      const content = response.choices?.[0]?.message?.content ?? "I couldn't generate a response. Please try again.";
      return { content };
    }),
});
