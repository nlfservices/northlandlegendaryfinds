/**
 * Update Top 15 Strongest Marvel Characters article with comic-realistic character images
 * Run from project root: node update-top15-images.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

// Comic-realistic character artwork URLs (webp compressed)
const IMG = {
  thor:     "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/top15-rune-king-thor-ddy7GBJjWtpFRqh7cymcBv.webp",
  thanos:   "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/top15-thanos-gauntlet-9cLoa7bQKG4smxXZcRHG59.webp",
  galactus: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/top15-galactus-R4qVfrFpZGMbELEcyam8Cv.webp",
  scarlet:  "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/top15-scarlet-witch-RtrS92XyjCmTV2Z2KZ5brn.webp",
  doom:     "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/top15-god-emperor-doom-25JGfBSoo9gFT8H7WPd7Vf.webp",
  tribunal: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/top15-living-tribunal-QH9Vit4k2Jz7wGJ84UvQ6U.webp",
  oaa:      "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/top15-one-above-all-No25WsjYdnhVAv69nkKLmn.webp",
  franklin: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/top15-franklin-richards-2eNyXMY5ouNpHMQt8a3GbN.webp",
  loki:     "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/top15-loki-god-stories-EQPq4H4d8Ju2XpwzgPkgHr.webp",
  death:    "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/top15-death-entity-Nng36ZwDW37x5dYHCPDLfU.webp",
};

// Helper to create an image block — alternating left/right float for visual variety
function imgBlock(url, alt, caption, side = "right") {
  return `<div style="float:${side};margin:${side === 'right' ? '0 0 1rem 1.5rem' : '0 1.5rem 1rem 0'};max-width:420px"><img src="${url}" alt="${alt}" style="width:100%;border-radius:8px;" /><em style="display:block;text-align:center;font-size:0.85rem;color:#888;margin-top:0.25rem">${caption}</em></div>`;
}

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Get current content
  const [rows] = await conn.execute(
    "SELECT id, contentMarkdown FROM articles WHERE slug = 'top-15-strongest-marvel-characters-all-time-comics-mcu'"
  );
  if (rows.length === 0) { console.error("Article not found!"); process.exit(1); }

  let content = rows[0].contentMarkdown;
  const articleId = rows[0].id;
  console.log(`Found article ID: ${articleId}, content length: ${content.length}`);

  // Remove old generic images (the two existing float images)
  content = content.replace(/<div style="float:right;margin:0 0 1rem 1\.5rem;max-width:500px"><img src="https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\/310419663027009739\/SGHqXeh8PZJcCDnFiAMuFi\/strongest-marvel-cosmic[^"]*"[^<]*<\/img><em[^<]*<\/em><\/div>/g, '');
  content = content.replace(/<div style="float:left;margin:0 1\.5rem 1rem 0;max-width:500px"><img src="https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\/310419663027009739\/SGHqXeh8PZJcCDnFiAMuFi\/strongest-marvel-magic[^"]*"[^<]*<\/img><em[^<]*<\/em><\/div>/g, '');
  // Also try with self-closing img tags
  content = content.replace(/<div style="float:right;margin:0 0 1rem 1\.5rem;max-width:500px"><img src="https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\/310419663027009739\/SGHqXeh8PZJcCDnFiAMuFi\/strongest-marvel-cosmic[^"]*"[^/]*\/><em[^<]*<\/em><\/div>/g, '');
  content = content.replace(/<div style="float:left;margin:0 1\.5rem 1rem 0;max-width:500px"><img src="https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\/310419663027009739\/SGHqXeh8PZJcCDnFiAMuFi\/strongest-marvel-magic[^"]*"[^/]*\/><em[^<]*<\/em><\/div>/g, '');
  // Broader cleanup for any remaining old images
  content = content.replace(/<div style="float:[^"]*"><img src="[^"]*strongest-marvel-cosmic[^"]*"[^<]*(?:<\/img>|\/?>)<em[^<]*<\/em><\/div>\n*/g, '');
  content = content.replace(/<div style="float:[^"]*"><img src="[^"]*strongest-marvel-magic[^"]*"[^<]*(?:<\/img>|\/?>)<em[^<]*<\/em><\/div>\n*/g, '');

  // Now insert character images into each section
  // Strategy: add image right after the section heading for key characters, alternating left/right

  // #15 Thor — right float after the heading
  const thorImg = imgBlock(IMG.thor, "Rune King Thor — wielding the Odinforce and Rune Magic", "Rune King Thor: beyond the physical, beyond the gods", "right");
  content = content.replace(
    "## 15. Thor (Rune King)\n\n**Peak Power Source:**",
    `## 15. Thor (Rune King)\n\n${thorImg}\n\n**Peak Power Source:**`
  );

  // #14 Thanos — left float
  const thanosImg = imgBlock(IMG.thanos, "Thanos wielding the Infinity Gauntlet on his cosmic throne", "The Mad Titan: six stones, infinite power", "left");
  content = content.replace(
    "## 14. Thanos (Infinity Gauntlet)\n\n**Peak Power Source:**",
    `## 14. Thanos (Infinity Gauntlet)\n\n${thanosImg}\n\n**Peak Power Source:**`
  );

  // #13 Galactus — right float
  const galactusImg = imgBlock(IMG.galactus, "Galactus the Devourer consuming a planet with the Power Cosmic", "The Devourer of Worlds: hunger that shapes the cosmos", "right");
  content = content.replace(
    "## 13. Galactus (Well-Fed)\n\n**Peak Power Source:**",
    `## 13. Galactus (Well-Fed)\n\n${galactusImg}\n\n**Peak Power Source:**`
  );

  // #10 Loki — left float (replaces old generic magic image)
  const lokiImg = imgBlock(IMG.loki, "Loki God of Stories seated on his throne at the end of time, sustaining the multiverse", "God of Stories: holding the multiverse together through sheer will", "left");
  content = content.replace(
    "## 10. Loki (God of Stories)\n\n**Peak Power Source:**",
    `## 10. Loki (God of Stories)\n\n${lokiImg}\n\n**Peak Power Source:**`
  );

  // #9 Scarlet Witch — right float
  const scarletImg = imgBlock(IMG.scarlet, "Scarlet Witch channeling Chaos Magic with reality-warping hex energy", "Chaos Magic: three words changed the Marvel Universe forever", "right");
  content = content.replace(
    "## 9. Scarlet Witch (Chaos Magic)\n\n**Peak Power Source:**",
    `## 9. Scarlet Witch (Chaos Magic)\n\n${scarletImg}\n\n**Peak Power Source:**`
  );

  // #8 Death — left float
  const deathImg = imgBlock(IMG.death, "Death — the cosmic embodiment of mortality in the Marvel Universe", "The inevitable conclusion: even Thanos sought her favor", "left");
  content = content.replace(
    "## 8. Death\n\n**Peak Power Source:**",
    `## 8. Death\n\n${deathImg}\n\n**Peak Power Source:**`
  );

  // #7 Franklin Richards — right float
  const franklinImg = imgBlock(IMG.franklin, "Franklin Richards creating universes with cosmic energy, with Galactus as his herald", "The most powerful mutant ever born: universes at his fingertips", "right");
  content = content.replace(
    "## 7. Franklin Richards\n\n**Peak Power Source:**",
    `## 7. Franklin Richards\n\n${franklinImg}\n\n**Peak Power Source:**`
  );

  // #3 God Emperor Doom — left float
  const doomImg = imgBlock(IMG.doom, "God Emperor Doom on the throne of Battleworld wielding stolen Beyonder power", "God Emperor Doom: the only thing standing between existence and oblivion", "left");
  content = content.replace(
    "## 3. God Emperor Doom (Battleworld)\n\n**Peak Power Source:**",
    `## 3. God Emperor Doom (Battleworld)\n\n${doomImg}\n\n**Peak Power Source:**`
  );

  // #2 Living Tribunal — right float
  const tribunalImg = imgBlock(IMG.tribunal, "The Living Tribunal — three-faced cosmic judge of the Marvel multiverse", "Equity, Necessity, Vengeance: the judge of all realities", "right");
  content = content.replace(
    "## 2. The Living Tribunal\n\n**Peak Power Source:**",
    `## 2. The Living Tribunal\n\n${tribunalImg}\n\n**Peak Power Source:**`
  );

  // #1 The One Above All — centered (full-width for the top spot)
  const oaaImg = `<div style="text-align:center;margin:1rem 0"><img src="${IMG.oaa}" alt="The One Above All — supreme creator of the Marvel multiverse" style="max-width:600px;width:100%;border-radius:8px;" /><em style="display:block;text-align:center;font-size:0.85rem;color:#888;margin-top:0.25rem">The Supreme Architect: all that is, was, and will be</em></div>`;
  content = content.replace(
    "## 1. The One Above All\n\n**Peak Power Source:**",
    `## 1. The One Above All\n\n${oaaImg}\n\n**Peak Power Source:**`
  );

  // Update the database
  await conn.execute(
    "UPDATE articles SET contentMarkdown = ?, updatedAt = NOW() WHERE id = ?",
    [content, articleId]
  );

  console.log(`\n✅ Updated article ${articleId} with 10 comic-realistic character images`);
  console.log(`New content length: ${content.length}`);

  // Verify images were inserted
  const imgCount = (content.match(/<img src="/g) || []).length;
  console.log(`Total images in article: ${imgCount}`);

  await conn.end();
}

main().catch(console.error);
