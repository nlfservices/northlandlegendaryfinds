import type { Express } from "express";
import { getAllMarvelSets, getAllCharacterSlugs, getAllCardDetailSlugs, getPublishedBlogPosts, getPublishedArticles } from "./db";
import { getDb } from "./db";
import { mcuMedia } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const SITE_URL = "https://northlandlegendaryfinds.com";

// Static pages with their priorities and change frequencies
const STATIC_PAGES: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/shop", priority: "0.9", changefreq: "weekly" },
  { path: "/marvel", priority: "0.8", changefreq: "weekly" },
  { path: "/cards", priority: "0.8", changefreq: "weekly" },
  { path: "/checklists", priority: "0.7", changefreq: "weekly" },
  { path: "/whatnot", priority: "0.7", changefreq: "daily" },
  { path: "/transparency", priority: "0.7", changefreq: "weekly" },
  { path: "/about", priority: "0.6", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/faq", priority: "0.6", changefreq: "monthly" },
  { path: "/subscribe", priority: "0.5", changefreq: "monthly" },
  { path: "/shipping", priority: "0.4", changefreq: "monthly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/refund-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/characters", priority: "0.8", changefreq: "weekly" },
  { path: "/the-collector", priority: "0.8", changefreq: "daily" },
  { path: "/card-shows", priority: "0.7", changefreq: "weekly" },
  { path: "/our-process", priority: "0.7", changefreq: "monthly" },
  { path: "/card-hub", priority: "0.7", changefreq: "weekly" },
  { path: "/mcu-news", priority: "0.7", changefreq: "weekly" },
  { path: "/matrix", priority: "0.6", changefreq: "weekly" },
  { path: "/free-credit", priority: "0.8", changefreq: "weekly" },
  { path: "/sitemap", priority: "0.5", changefreq: "weekly" },
  { path: "/rewards", priority: "0.4", changefreq: "monthly" },
  { path: "/login", priority: "0.2", changefreq: "yearly" },
  { path: "/trending", priority: "0.8", changefreq: "weekly" },
  { path: "/giveaway", priority: "0.7", changefreq: "weekly" },
  { path: "/market-intel", priority: "0.7", changefreq: "weekly" },
  { path: "/market-intel/2024-vs-2025-topps-marvel", priority: "0.6", changefreq: "monthly" },
  { path: "/market-intel/topps-vs-upper-deck-marvel", priority: "0.6", changefreq: "monthly" },
  { path: "/market-intel/marvel-vs-pokemon-cards", priority: "0.6", changefreq: "monthly" },
  { path: "/market-intel/why-fanatics-trading-cards", priority: "0.6", changefreq: "monthly" },
  { path: "/market-intel/best-topps-marvel-cards", priority: "0.6", changefreq: "monthly" },
  { path: "/star-wars", priority: "0.5", changefreq: "monthly" },
  { path: "/marvel-card-hub", priority: "0.7", changefreq: "weekly" },
  { path: "/submit-show", priority: "0.4", changefreq: "monthly" },
  { path: "/whatnot", priority: "0.7", changefreq: "daily" },
  { path: "/nerd-gossip", priority: "0.7", changefreq: "daily" },
  { path: "/gambit-deck", priority: "0.6", changefreq: "monthly" },
  { path: "/mcu-spotlight", priority: "0.7", changefreq: "weekly" },
  { path: "/the-little-things", priority: "0.7", changefreq: "weekly" },
  { path: "/movies-series", priority: "0.8", changefreq: "weekly" },
  { path: "/artists", priority: "0.7", changefreq: "monthly" },
  { path: "/api-docs", priority: "0.4", changefreq: "monthly" },
  // Comic Book Auto Artist Profile Pages
  { path: "/artists/frank-miller", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/jack-kirby", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/bill-sienkiewicz", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/arthur-adams", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/jim-cheung", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/adi-granov", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/marc-silvestri", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/greg-capullo", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/inhyuk-lee", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/esad-ribic", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/adam-kubert", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/steve-mcniven", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/mark-brooks", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/lucio-parrillo", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/ryan-stegman", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/ed-mcguinness", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/greg-horn", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/mike-zeck", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/derrick-chew", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/joshua-cassara", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/mark-bagley", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/mike-mayhew", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/steve-epting", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/ariel-diaz", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/e-m-gist", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/mike-mckone", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/paul-pelletier", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/ryan-brown", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/scott-williams", priority: "0.6", changefreq: "monthly" },
  { path: "/artists/whilce-portacio", priority: "0.6", changefreq: "monthly" },
];

// Product slugs (static, from products.ts)
const PRODUCT_SLUGS = [
  "variant-cosmic-drop",
  "variant-chrome-edition",
  "snap-collection-100",
  "snap-collection-500",
  "mv-origins-100",
  "mv-origins-500",
  "mv-parallel-100",
  "mv-parallel-500",
  "mv-legendary-100",
  "mv-legendary-500",
  "topps-marvel-chrome",
  "topps-chrome-sapphire",
  "topps-marvel-mint",
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrlEntry(
  path: string,
  priority: string,
  changefreq: string,
  lastmod?: string
): string {
  const loc = `${SITE_URL}${escapeXml(path)}`;
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  return `  <url>
    <loc>${loc}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export function registerSitemapRoute(app: Express) {
  // Serve sitemap at both /sitemap.xml and /api/sitemap.xml
  app.get(["/sitemap.xml", "/api/sitemap.xml"], async (_req, res) => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const entries: string[] = [];

      // Static pages
      for (const page of STATIC_PAGES) {
        entries.push(buildUrlEntry(page.path, page.priority, page.changefreq, today));
      }

      // Product pages
      for (const slug of PRODUCT_SLUGS) {
        entries.push(buildUrlEntry(`/product/${slug}`, "0.8", "weekly", today));
      }

      // Dynamic card set pages from database
      try {
        const sets = await getAllMarvelSets();
        for (const set of sets) {
          entries.push(buildUrlEntry(`/cards/${set.slug}`, "0.7", "weekly", today));
        }
      } catch {
        // If DB query fails, still serve sitemap with static pages
        console.warn("[Sitemap] Failed to fetch card sets from database");
      }

      // Dynamic character pages from database
      try {
        const characters = await getAllCharacterSlugs();
        for (const char of characters) {
          entries.push(buildUrlEntry(`/characters/${char.slug}`, "0.6", "weekly", today));
        }
      } catch {
        console.warn("[Sitemap] Failed to fetch character slugs from database");
      }

      // Dynamic individual card detail pages
      try {
        const cardSlugs = await getAllCardDetailSlugs();
        for (const card of cardSlugs) {
          entries.push(buildUrlEntry(`/cards/${card.setSlug}/${encodeURIComponent(card.cardNumber)}`, "0.5", "monthly", today));
        }
      } catch {
        console.warn("[Sitemap] Failed to fetch card detail slugs from database");
      }

      // Dynamic trending character pages (reuses character slugs)
      try {
        const trendingChars = await getAllCharacterSlugs();
        for (const char of trendingChars) {
          entries.push(buildUrlEntry(`/trending/${char.slug}`, "0.7", "weekly", today));
        }
      } catch {
        console.warn("[Sitemap] Failed to fetch trending character slugs from database");
      }

      // Dynamic MCU News article pages
      try {
        const mcuArticles = await getPublishedArticles();
        for (const article of mcuArticles) {
          const articleDate = article.publishedAt
            ? new Date(typeof article.publishedAt === "number" ? article.publishedAt : Date.now()).toISOString().split("T")[0]
            : today;
          entries.push(buildUrlEntry(`/mcu-news/${escapeXml(article.slug)}`, "0.7", "weekly", articleDate));
        }
        console.log(`[Sitemap] Added ${mcuArticles.length} MCU News article URLs`);
      } catch {
        console.warn("[Sitemap] Failed to fetch MCU News articles from database");
      }

      // Dynamic MCU Movies & Series pages
      try {
        const db = await getDb();
        if (db) {
          const mediaItems = await db.select({ slug: mcuMedia.slug }).from(mcuMedia).where(eq(mcuMedia.status, "published"));
          for (const item of mediaItems) {
            entries.push(buildUrlEntry(`/movies-series/${escapeXml(item.slug)}`, "0.7", "monthly", today));
          }
          console.log(`[Sitemap] Added ${mediaItems.length} Movies & Series URLs`);
        }
      } catch {
        console.warn("[Sitemap] Failed to fetch MCU Movies & Series from database");
      }

      // Dynamic blog post pages (The Collector)
      try {
        const blogPosts = await getPublishedBlogPosts();
        for (const post of blogPosts) {
          const postDate = post.publishedAt
            ? new Date(typeof post.publishedAt === "number" ? post.publishedAt : Date.now()).toISOString().split("T")[0]
            : today;
          entries.push(buildUrlEntry(`/the-collector/${escapeXml(post.slug)}`, "0.7", "monthly", postDate));
        }
        console.log(`[Sitemap] Added ${blogPosts.length} blog post URLs`);
      } catch {
        console.warn("[Sitemap] Failed to fetch blog posts from database");
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

      res.set("Content-Type", "application/xml");
      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600"); // Cache for 1 hour
      res.set("X-Robots-Tag", "noindex"); // Sitemaps shouldn't be indexed themselves
      res.send(xml);
    } catch (error) {
      console.error("[Sitemap] Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });
}
