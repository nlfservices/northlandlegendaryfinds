/**
 * Update Pedro Pascal article with real NLF card photos
 * Replaces the placeholder section with actual card showcase
 * Run from project root: node update-pedro-pascal-cards.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// CDN URLs for uploaded card photos
const CARDS = {
  mandoMasterworkFront: "/manus-storage/pedro-pascal-mando-masterwork-auto-front_19f74a56.jpg",
  mandoMasterworkBack: "/manus-storage/pedro-pascal-mando-masterwork-auto-back_d92f4da2.jpg",
  mandoHyperspaceFront: "/manus-storage/pedro-pascal-mando-hyperspace-chrome-auto_d6344c74.jpg",
  mandoHyperspaceBack: "/manus-storage/pedro-pascal-mando-hyperspace-chrome-back_49654c08.jpg",
  ffDualAstronautPurple: "/manus-storage/pedro-pascal-ff-dual-auto-astronaut-purple_2213f2ca.jpg",
  ffDualRedRefractor: "/manus-storage/pedro-pascal-ff-dual-auto-red-refractor_80fd7ce7.jpg",
  galactusDualAGS9: "/manus-storage/pedro-pascal-galactus-dual-auto-ags9_746c0aaf.jpg",
  reedSuperfractor1of1: "/manus-storage/pedro-pascal-reed-richards-superfractor-1of1-cgc_b52ee2b3.jpg",
  reedRedRefractor4of5: "/manus-storage/pedro-pascal-reed-richards-red-refractor-4of5-ags10_ab666bb3.jpg",
  reedRedRefractor2of5: "/manus-storage/pedro-pascal-reed-richards-red-refractor-2of5_c227bd61.jpg",
  galactusDualBlueSapphire: "/manus-storage/pedro-pascal-galactus-dual-auto-blue-sapphire_0675f94d.jpg",
};

// New section to replace the placeholder
const newCardSection = `## NLF Exclusive: Pedro Pascal Autograph Collection in Our Repacks

We're putting our money where our mouth is. Northland Legendary Finds has assembled one of the most impressive Pedro Pascal autograph collections in the hobby — spanning both his Star Wars and Marvel careers. These cards are going directly into our upcoming repack boxes.

### The Mandalorian Autographs

<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;">
<img src="${CARDS.mandoMasterworkFront}" alt="Pedro Pascal Star Wars Masterwork Authentic Autograph as The Mandalorian - 1/5" style="width:100%;border-radius:12px;" />
<img src="${CARDS.mandoMasterworkBack}" alt="Star Wars Masterwork Pedro Pascal Autograph back - numbered 1 of 5" style="width:100%;border-radius:12px;" />
</div>

**Topps Star Wars Masterwork — Pedro Pascal Authentic Autograph (1/5)** — One of only five in existence. The Masterwork line is Topps' ultra-premium tier, and this card features Pascal's bold blue ink signature across the iconic beskar armor.

<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;">
<img src="${CARDS.mandoHyperspaceFront}" alt="2024 Topps Star Wars Hyperspace Chrome Pedro Pascal Autograph - Red Refractor" style="width:100%;border-radius:12px;" />
<img src="${CARDS.mandoHyperspaceBack}" alt="2024 Topps Star Wars Hyperspace Chrome Pedro Pascal Autograph back" style="width:100%;border-radius:12px;" />
</div>

**2024 Topps Star Wars Hyperspace Chrome — Pedro Pascal Autograph Variation (A-PP), Red Refractor** — From the Topps Autograph Archive, this stunning red chrome parallel features Mando in full action pose with blaster drawn.

### Reed Richards / Mister Fantastic Autographs

<img src="${CARDS.reedSuperfractor1of1}" alt="Pedro Pascal Reed Richards Mister Fantastic SuperFractor 1/1 CGC 8.5 Auto 8" style="width:100%;max-width:500px;border-radius:12px;margin:16px 0;" />

**2025 Topps Chrome Marvel Studios — Pedro Pascal as Reed Richards, SuperFractor AUTOGRAPH #AA-PP — 1/1** — THE one-of-one. CGC graded NM/MINT+ 8.5 with Auto grade 8. There is literally no other card like this in existence. The SuperFractor parallel is the holy grail of any Topps Chrome set, and this one features Pedro Pascal's debut as Mister Fantastic.

<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;">
<img src="${CARDS.reedRedRefractor4of5}" alt="Pedro Pascal Reed Richards Red Refractor 4/5 AGS Gem-MT 10" style="width:100%;border-radius:12px;" />
<img src="${CARDS.reedRedRefractor2of5}" alt="Pedro Pascal Reed Richards Red Refractor 2/5 with NLF sticker" style="width:100%;border-radius:12px;" />
</div>

**2025 Topps Chrome Marvel Studios — Mister Fantastic Red Refractor Auto (#AA-PP)** — We have TWO of the five Red Refractors that exist: the **4/5** (AGS Gem-MT 10 — perfect grade!) and the **2/5**. That means NLF owns 40% of all Red Refractor Pedro Pascal Reed Richards autos in the world.

### Dual Autographs: Reed Richards + Galactus

<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;">
<img src="${CARDS.galactusDualAGS9}" alt="Mister Fantastic and Galactus Dual Autograph 04/10 AGS Mint 9" style="width:100%;border-radius:12px;" />
<img src="${CARDS.galactusDualBlueSapphire}" alt="Mister Fantastic and Galactus Dual Autograph Blue Sapphire 08/10" style="width:100%;border-radius:12px;" />
</div>

**2025 Topps Chrome Marvel Studios — Mister Fantastic & Galactus Dual Autographs (#DA-PI)** — Pedro Pascal AND Ralph Ineson (Galactus) on the same card. We have the **04/10** (AGS Mint 9) AND the **08/10 Blue Sapphire** parallel. Two cards featuring the hero and villain of *Fantastic Four: First Steps* — signed by both actors.

### Dual Autographs: Reed Richards + Invisible Woman

<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;">
<img src="${CARDS.ffDualAstronautPurple}" alt="Mister Fantastic and Invisible Woman Dual Autograph Purple 14/15 - astronaut suits" style="width:100%;border-radius:12px;" />
<img src="${CARDS.ffDualRedRefractor}" alt="Mister Fantastic and Invisible Woman Dual Autograph Red Refractor" style="width:100%;border-radius:12px;" />
</div>

**Topps Marvel Studios Chrome — Mister Fantastic & Invisible Woman Dual Autographs** — Pedro Pascal and Vanessa Kirby together on premium parallels. The **purple astronaut variant (14/15)** shows them in their space suits, while the **red refractor** features the FF in their iconic blue uniforms with cosmic energy crackling between them.

---

**Every single one of these cards is available in NLF repacks.** One lucky collector will pull a piece of history — autographs from the only actor simultaneously starring in Star Wars and Marvel theatrical releases. Check our <a href="https://northlandlegendaryfinds.com/shop" target="_blank">Shop</a> or catch our next <a href="https://northlandlegendaryfinds.com/whatnot" target="_blank">Whatnot stream</a> for your shot at these cards.`;

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Get current article
  const [rows] = await conn.execute("SELECT id, contentMarkdown FROM articles WHERE id = 1500005");
  if (rows.length === 0) {
    console.error("Article not found!");
    await conn.end();
    process.exit(1);
  }

  let content = rows[0].contentMarkdown;

  // Replace the placeholder section
  const oldSection = `## NLF Exclusive: 1/1 Pedro Pascal Auto in Our Repacks

We're putting our money where our mouth is. Northland Legendary Finds has secured a **1/1 Pedro Pascal Autograph card** that's going directly into our upcoming repack boxes. This is a true one-of-one — there is no other card like it in existence.

<!-- PLACEHOLDER: User's 1/1 Pedro Pascal Auto card photo will be inserted here -->
<!-- When user provides card photos, replace this section with actual images -->

**This card is available in NLF repacks.** One lucky collector will pull a piece of history — an autograph from the only actor simultaneously starring in Star Wars and Marvel theatrical releases. Check our <a href="https://northlandlegendaryfinds.com/shop" target="_blank">Shop</a> or catch our next <a href="https://northlandlegendaryfinds.com/whatnot" target="_blank">Whatnot stream</a> for your shot at this card.`;

  if (content.includes(oldSection)) {
    content = content.replace(oldSection, newCardSection);
    console.log("Replaced placeholder section with real card photos!");
  } else {
    // Try a simpler match
    const simpleOld = "## NLF Exclusive: 1/1 Pedro Pascal Auto in Our Repacks";
    const collectorCorner = "## Collector's Corner";
    const idx1 = content.indexOf(simpleOld);
    const idx2 = content.indexOf(collectorCorner);
    
    if (idx1 !== -1 && idx2 !== -1) {
      content = content.substring(0, idx1) + newCardSection + "\n\n" + content.substring(idx2);
      console.log("Replaced section using index-based approach!");
    } else {
      console.error("Could not find placeholder section to replace!");
      console.log("Looking for:", simpleOld);
      console.log("Content snippet around expected area:", content.substring(2000, 2500));
      await conn.end();
      process.exit(1);
    }
  }

  // Update the article
  await conn.execute("UPDATE articles SET contentMarkdown = ? WHERE id = 1500005", [content]);
  console.log("Article updated successfully!");

  // Verify
  const [verify] = await conn.execute("SELECT LENGTH(contentMarkdown) as len FROM articles WHERE id = 1500005");
  console.log("New content length:", verify[0].len, "characters");

  await conn.end();
  console.log("Done!");
}

main().catch(console.error);
