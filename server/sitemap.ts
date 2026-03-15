import type { Express } from "express";
import { getAllMarvelSets, getAllCharacterSlugs, getAllCardDetailSlugs } from "./db";

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
  app.get("/sitemap.xml", async (_req, res) => {
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

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

      res.set("Content-Type", "application/xml");
      res.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
      res.send(xml);
    } catch (error) {
      console.error("[Sitemap] Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });
}
