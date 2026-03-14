/**
 * Dynamic Sitemap Generation System
 * 
 * Generates XML sitemaps on-the-fly from database content.
 * Every new page/card is automatically included — no manual maintenance.
 * 
 * Routes:
 *   GET /sitemap.xml          → Sitemap index (references all sub-sitemaps)
 *   GET /sitemap-pages.xml    → Core static pages
 *   GET /sitemap-sets.xml     → Card set listing pages
 *   GET /sitemap-cards-{n}.xml → Individual card pages (split per set for size)
 *   GET /sitemap-products.xml → Product/shop pages
 *   GET /sitemap-images.xml   → Image sitemap with card images
 *   GET /robots.txt           → Crawl directives + sitemap reference
 */

import { Express, Request, Response } from "express";
import { getDb } from "./db";
import { marvelSets, marvelCards, repackProducts } from "../drizzle/schema";
import { eq, asc, and, isNotNull, ne } from "drizzle-orm";

// ==================== HELPERS ====================

function getBaseUrl(req: Request): string {
  // Always use the canonical production domain for sitemaps
  // This ensures Google indexes the correct URLs regardless of where the server runs
  if (process.env.NODE_ENV === "production" || process.env.SITE_URL) {
    return process.env.SITE_URL || "https://northlandlegendaryfinds.com";
  }
  // In development, derive from request
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "northlandlegendaryfinds.com";
  return `${proto}://${host}`;
}

function xmlHeader(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(date?: Date | null): string {
  if (!date) return new Date().toISOString().split("T")[0];
  return new Date(date).toISOString().split("T")[0];
}

/** Generate a URL-friendly slug from character name + card number */
function cardSlug(characterName: string, cardNumber: string): string {
  const name = characterName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
  const num = cardNumber.toLowerCase().replace(/[^a-z0-9-]/g, "");
  return `${name}-${num}`;
}

// ==================== STATIC PAGES ====================

const STATIC_PAGES: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/shop", priority: "0.9", changefreq: "daily" },
  { path: "/marvel", priority: "0.8", changefreq: "weekly" },
  { path: "/cards", priority: "0.9", changefreq: "daily" },
  { path: "/checklists", priority: "0.7", changefreq: "weekly" },
  { path: "/whatnot", priority: "0.7", changefreq: "weekly" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
  { path: "/faq", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.4", changefreq: "monthly" },
  { path: "/shipping", priority: "0.4", changefreq: "monthly" },
  { path: "/transparency", priority: "0.5", changefreq: "monthly" },
  { path: "/subscribe", priority: "0.4", changefreq: "monthly" },
  { path: "/terms", priority: "0.2", changefreq: "yearly" },
  { path: "/privacy", priority: "0.2", changefreq: "yearly" },
  { path: "/refund-policy", priority: "0.2", changefreq: "yearly" },
  { path: "/star-wars", priority: "0.5", changefreq: "monthly" },
];

// Pages to explicitly noindex (not included in sitemaps)
const NOINDEX_PATHS = ["/admin", "/admin/ebay-comps", "/cart", "/order-success", "/404", "/card-display"];

// ==================== SITEMAP INDEX ====================

async function generateSitemapIndex(req: Request): Promise<string> {
  const base = getBaseUrl(req);
  const today = formatDate();

  // Get all sets for per-set card sitemaps
  const db = await getDb();
  const sets = db ? await db.select().from(marvelSets).orderBy(asc(marvelSets.id)) : [];

  let xml = xmlHeader();
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static pages sitemap
  xml += `  <sitemap>\n    <loc>${base}/sitemap-pages.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;

  // Sets sitemap
  xml += `  <sitemap>\n    <loc>${base}/sitemap-sets.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;

  // Products sitemap
  xml += `  <sitemap>\n    <loc>${base}/sitemap-products.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;

  // Per-set card sitemaps (keeps each under 50,000 URL limit)
  for (const set of sets) {
    xml += `  <sitemap>\n    <loc>${base}/sitemap-cards-${set.id}.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;
  }

  // Image sitemap
  xml += `  <sitemap>\n    <loc>${base}/sitemap-images.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;

  xml += `</sitemapindex>`;
  return xml;
}

// ==================== STATIC PAGES SITEMAP ====================

function generatePagesSitemap(req: Request): string {
  const base = getBaseUrl(req);
  const today = formatDate();

  let xml = xmlHeader();
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const page of STATIC_PAGES) {
    xml += `  <url>\n`;
    xml += `    <loc>${base}${page.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

// ==================== SETS SITEMAP ====================

async function generateSetsSitemap(req: Request): Promise<string> {
  const base = getBaseUrl(req);
  const db = await getDb();
  const sets = db ? await db.select().from(marvelSets).orderBy(asc(marvelSets.id)) : [];

  let xml = xmlHeader();
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const set of sets) {
    xml += `  <url>\n`;
    xml += `    <loc>${base}/cards/${escapeXml(set.slug)}</loc>\n`;
    xml += `    <lastmod>${formatDate(set.updatedAt)}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

// ==================== CARDS SITEMAP (per set) ====================

async function generateCardsSitemap(req: Request, setId: number): Promise<string | null> {
  const base = getBaseUrl(req);
  const db = await getDb();
  if (!db) return null;

  // Verify set exists
  const setResult = await db.select().from(marvelSets).where(eq(marvelSets.id, setId)).limit(1);
  if (setResult.length === 0) return null;
  const set = setResult[0];

  // Get all cards in this set
  const cards = await db.select().from(marvelCards)
    .where(eq(marvelCards.setId, setId))
    .orderBy(asc(marvelCards.sortOrder));

  let xml = xmlHeader();
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  for (const card of cards) {
    const slug = cardSlug(card.characterName, card.cardNumber);
    xml += `  <url>\n`;
    xml += `    <loc>${base}/cards/${escapeXml(set.slug)}/${escapeXml(slug)}</loc>\n`;
    xml += `    <lastmod>${formatDate(card.createdAt)}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;

    // Include image in card sitemap entry
    if (card.imageUrl) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(card.imageUrl)}</image:loc>\n`;
      xml += `      <image:title>${escapeXml(card.characterName)} #${escapeXml(card.cardNumber)} - ${escapeXml(set.name)}</image:title>\n`;
      xml += `      <image:caption>${escapeXml(card.characterName)} ${escapeXml(card.cardType || "")} card from ${escapeXml(set.name)}</image:caption>\n`;
      xml += `    </image:image>\n`;
    }

    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

// ==================== PRODUCTS SITEMAP ====================

async function generateProductsSitemap(req: Request): Promise<string> {
  const base = getBaseUrl(req);
  const db = await getDb();
  const products = db
    ? await db.select().from(repackProducts).where(eq(repackProducts.status, "active"))
    : [];

  let xml = xmlHeader();
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const product of products) {
    xml += `  <url>\n`;
    xml += `    <loc>${base}/product/${escapeXml(product.slug)}</loc>\n`;
    xml += `    <lastmod>${formatDate(product.updatedAt)}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

// ==================== IMAGE SITEMAP ====================

async function generateImageSitemap(req: Request): Promise<string> {
  const base = getBaseUrl(req);
  const db = await getDb();

  let xml = xmlHeader();
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  if (db) {
    // Get all sets
    const sets = await db.select().from(marvelSets).orderBy(asc(marvelSets.id));

    for (const set of sets) {
      // Get cards with images for this set
      const cards = await db.select().from(marvelCards)
        .where(and(eq(marvelCards.setId, set.id), isNotNull(marvelCards.imageUrl)))
        .orderBy(asc(marvelCards.sortOrder));

      if (cards.length === 0) continue;

      // Group images under the set page URL
      xml += `  <url>\n`;
      xml += `    <loc>${base}/cards/${escapeXml(set.slug)}</loc>\n`;

      for (const card of cards) {
        if (!card.imageUrl) continue;
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(card.imageUrl)}</image:loc>\n`;
        xml += `      <image:title>${escapeXml(card.characterName)} #${escapeXml(card.cardNumber)}</image:title>\n`;
        xml += `      <image:caption>${escapeXml(card.characterName)} ${escapeXml(card.cardType || "")} card from ${escapeXml(set.name)}</image:caption>\n`;
        xml += `    </image:image>\n`;
      }

      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;
  return xml;
}

// ==================== ROBOTS.TXT ====================

function generateRobotsTxt(req: Request): string {
  const base = getBaseUrl(req);

  return [
    "# Northland Legendary Finds - Robots.txt",
    "# https://northlandlegendaryfinds.com",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    "# Disallow utility/admin pages",
    "Disallow: /admin",
    "Disallow: /admin/",
    "Disallow: /cart",
    "Disallow: /order-success",
    "Disallow: /card-display",
    "Disallow: /api/",
    "",
    "# Disallow parameterized duplicates",
    "Disallow: /*?utm_*",
    "Disallow: /*?fbclid*",
    "Disallow: /*?gclid*",
    "",
    `# Sitemap`,
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n");
}

// ==================== REGISTER ROUTES ====================

export function registerSitemapRoutes(app: Express): void {
  // Sitemap index
  app.get("/sitemap.xml", async (req: Request, res: Response) => {
    try {
      const xml = await generateSitemapIndex(req);
      res.set("Content-Type", "application/xml; charset=utf-8");
      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.send(xml);
    } catch (err) {
      console.error("[Sitemap] Error generating sitemap index:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Static pages sitemap
  app.get("/sitemap-pages.xml", (req: Request, res: Response) => {
    try {
      const xml = generatePagesSitemap(req);
      res.set("Content-Type", "application/xml; charset=utf-8");
      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.send(xml);
    } catch (err) {
      console.error("[Sitemap] Error generating pages sitemap:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Sets sitemap
  app.get("/sitemap-sets.xml", async (req: Request, res: Response) => {
    try {
      const xml = await generateSetsSitemap(req);
      res.set("Content-Type", "application/xml; charset=utf-8");
      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.send(xml);
    } catch (err) {
      console.error("[Sitemap] Error generating sets sitemap:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Products sitemap
  app.get("/sitemap-products.xml", async (req: Request, res: Response) => {
    try {
      const xml = await generateProductsSitemap(req);
      res.set("Content-Type", "application/xml; charset=utf-8");
      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.send(xml);
    } catch (err) {
      console.error("[Sitemap] Error generating products sitemap:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Per-set card sitemaps
  app.get("/sitemap-cards-:setId.xml", async (req: Request, res: Response) => {
    try {
      const setId = parseInt(req.params.setId);
      if (isNaN(setId)) {
        res.status(404).send("Invalid set ID");
        return;
      }
      const xml = await generateCardsSitemap(req, setId);
      if (!xml) {
        res.status(404).send("Set not found");
        return;
      }
      res.set("Content-Type", "application/xml; charset=utf-8");
      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.send(xml);
    } catch (err) {
      console.error("[Sitemap] Error generating cards sitemap:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Image sitemap
  app.get("/sitemap-images.xml", async (req: Request, res: Response) => {
    try {
      const xml = await generateImageSitemap(req);
      res.set("Content-Type", "application/xml; charset=utf-8");
      res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.send(xml);
    } catch (err) {
      console.error("[Sitemap] Error generating image sitemap:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Robots.txt
  app.get("/robots.txt", (req: Request, res: Response) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(generateRobotsTxt(req));
  });

  console.log("[Sitemap] Routes registered: /sitemap.xml, /sitemap-*.xml, /robots.txt");
}

// Export helpers for testing and card detail pages
export { cardSlug, NOINDEX_PATHS, STATIC_PAGES };
