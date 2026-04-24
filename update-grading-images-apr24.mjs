/**
 * Update Grading Article Images — April 24, 2026
 * Replace all old images with new comic-style Marvel card images
 * Also add the NORAD vault image to the PSA Monopoly article
 * Run from project root: node update-grading-images-apr24.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// OLD image URLs to replace
const OLD = {
  monopolyHero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-monopoly-hero-Hr9Qbfu2eh7T7oLBS4odJN.webp",
  arbitrageHero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-arbitrage-hero-DdACj9roXisDZ5Wd4uD85T.webp",
  authenticationHero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-authentication-hero-EdH4pJpigqu8MjgQ42JTZF.webp",
  pokemonVolume: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-pokemon-volume-MxgS8koJH8sstoKHKFFjmA.webp",
  crossoverComparison: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-crossover-comparison-9HjSNGUU2hbjMrAD6WJWpj.webp",
};

// NEW comic-style image URLs
const NEW = {
  marvelCardsHero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-marvel-cards-hero2-2KtH47RSZujnLfWTagQeYf.webp",
  noradVault: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-norad-vault-WDQZzEmEvVNbgWwntaYcPz.webp",
  crossoverComic: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-crossover-comic-9iXTaoR3Sb7icCYJc3FjkG.webp",
  pokemonDominance: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-pokemon-dominance-8GLADCRtfbZ5temtMsze3N.webp",
  authenticationSimple: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/grading-authentication-simple-Lwjh7KynFxciPC3W7MsCjB.webp",
};

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // ===== ARTICLE 1: PSA's Monopoly Play =====
  // Replace featured image + inline images + add NORAD vault image
  {
    const slug = "psa-monopoly-collectors-holdings-grading-industry-acquisitions-2026";
    const [rows] = await conn.execute("SELECT id, contentMarkdown, featuredImageUrl FROM articles WHERE slug = ?", [slug]);
    if (rows.length === 0) { console.error(`❌ Article not found: ${slug}`); } 
    else {
      let content = rows[0].contentMarkdown;
      
      // Replace old pokemonVolume inline image with new comic-style pokemon dominance
      content = content.replace(
        `<img src="${OLD.pokemonVolume}" alt="Trading card grading facility processing massive volume of submissions" style="width:100%;border-radius:12px;margin:16px 0;" />`,
        `<img src="${NEW.pokemonDominance}" alt="Comic illustration of Pokemon cards flooding a grading facility while Marvel cards wait in a tiny queue — 68% of all grading volume" style="width:100%;border-radius:12px;margin:16px 0;" />`
      );
      
      // Replace old crossover comparison with new comic-style crossover
      content = content.replace(
        `<img src="${OLD.crossoverComparison}" alt="Different grading company slabs showing price differences for the same card" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />`,
        `<img src="${NEW.crossoverComic}" alt="Comic book style illustration showing a card being cracked from a lesser grading slab and upgraded to a premium slab with value soaring" style="width:100%;max-width:700px;border-radius:12px;margin:12px 0;" />`
      );
      
      // Add NORAD vault image after "The Price of Monopoly" heading
      content = content.replace(
        `## The Price of Monopoly`,
        `<img src="${NEW.noradVault}" alt="Comic illustration of a classified grading facility built into a mountain like NORAD — massive vault door reads CLOSED TO PUBLIC with armed guards" style="width:100%;border-radius:12px;margin:16px 0;" />\n\n## The Price of Monopoly`
      );
      
      // Update featured image
      await conn.execute(
        "UPDATE articles SET contentMarkdown = ?, featuredImageUrl = ? WHERE slug = ?",
        [content, NEW.marvelCardsHero, slug]
      );
      console.log(`✅ Updated: PSA Monopoly Play — new hero + 3 inline images`);
    }
  }

  // ===== ARTICLE 2: The Grading Arbitrage =====
  // Replace featured image + inline crossover image
  {
    const slug = "grading-arbitrage-crack-slab-crossover-psa-sgc-bgc-strategy-guide";
    const [rows] = await conn.execute("SELECT id, contentMarkdown, featuredImageUrl FROM articles WHERE slug = ?", [slug]);
    if (rows.length === 0) { console.error(`❌ Article not found: ${slug}`); }
    else {
      let content = rows[0].contentMarkdown;
      
      // Replace old crossover comparison inline image
      content = content.replace(
        `<img src="${OLD.crossoverComparison}" alt="Same card in different grading company slabs showing dramatic price differences" style="width:100%;border-radius:12px;margin:16px 0;" />`,
        `<img src="${NEW.crossoverComic}" alt="Comic book panel showing the crossover process — original slab cracked open, card breaks free, then reappears in a premium slab with value soaring and dollar signs" style="width:100%;border-radius:12px;margin:16px 0;" />`
      );
      
      // Update featured image
      await conn.execute(
        "UPDATE articles SET contentMarkdown = ?, featuredImageUrl = ? WHERE slug = ?",
        [content, NEW.crossoverComic, slug]
      );
      console.log(`✅ Updated: Grading Arbitrage — new hero + inline image`);
    }
  }

  // ===== ARTICLE 3: Does Grading Even Matter? =====
  // Replace featured image + all inline images
  {
    const slug = "does-card-grading-matter-authentication-vs-premium-slabs-2026";
    const [rows] = await conn.execute("SELECT id, contentMarkdown, featuredImageUrl FROM articles WHERE slug = ?", [slug]);
    if (rows.length === 0) { console.error(`❌ Article not found: ${slug}`); }
    else {
      let content = rows[0].contentMarkdown;
      
      // Replace old pokemon volume inline image
      content = content.replace(
        `<img src="${OLD.pokemonVolume}" alt="Massive volume of trading cards being processed at grading facility" style="width:100%;border-radius:12px;margin:16px 0;" />`,
        `<img src="${NEW.pokemonDominance}" alt="Comic illustration of a tidal wave of Pokemon cards flooding a grading factory conveyor belt while a small stack of Marvel cards waits in a priority queue — 68% of all cards" style="width:100%;border-radius:12px;margin:16px 0;" />`
      );
      
      // Replace old crossover comparison inline image
      content = content.replace(
        `<img src="${OLD.crossoverComparison}" alt="Different grading slabs showing price variations across companies" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />`,
        `<img src="${NEW.authenticationSimple}" alt="Comic illustration showing The Collector's Dilemma — authentication path with magnifying glass and verified stamp vs premium grading path with microscopes and lab coats" style="width:100%;border-radius:12px;margin:16px 0;" />`
      );
      
      // Add the NORAD vault image before "The Grading Industry Serves Itself" section
      content = content.replace(
        `## The Grading Industry Serves Itself`,
        `<img src="${NEW.noradVault}" alt="Comic illustration of a top-secret grading facility built into a mountain — massive vault door marked CLASSIFIED GRADING FACILITY CLOSED TO PUBLIC" style="width:100%;border-radius:12px;margin:16px 0;" />\n\n## The Grading Industry Serves Itself`
      );
      
      // Update featured image
      await conn.execute(
        "UPDATE articles SET contentMarkdown = ?, featuredImageUrl = ? WHERE slug = ?",
        [content, NEW.authenticationSimple, slug]
      );
      console.log(`✅ Updated: Does Grading Even Matter — new hero + 3 inline images`);
    }
  }

  // Verify all 3 articles
  const [verify] = await conn.execute(
    "SELECT id, title, slug, featuredImageUrl FROM articles WHERE slug IN (?, ?, ?)",
    [
      "psa-monopoly-collectors-holdings-grading-industry-acquisitions-2026",
      "grading-arbitrage-crack-slab-crossover-psa-sgc-bgc-strategy-guide",
      "does-card-grading-matter-authentication-vs-premium-slabs-2026",
    ]
  );
  console.log("\n--- Updated Articles ---");
  verify.forEach((r) => {
    console.log(`  ${r.id}: ${r.title}`);
    console.log(`    Hero: ${r.featuredImageUrl.substring(0, 80)}...`);
  });

  await conn.end();
  console.log("\nDone! All 3 grading articles updated with new comic-style images.");
}

main().catch(console.error);
