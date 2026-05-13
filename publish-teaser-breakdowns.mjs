/**
 * Publish 6 Avengers: Doomsday Teaser Breakdown Articles — May 12, 2026
 * Run from project root: node publish-teaser-breakdowns.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

// Image URLs (already uploaded to CDN)
const IMAGES = {
  overview: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-all-teasers-overview-DRvRUta7QtTs8tUuroPasn.webp",
  steveRogers: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-steve-rogers-teaser-mR4VSEvbhcfYFY4VDv3btq.webp",
  thor: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-thor-teaser-jChqz3XaMYxNqf9q325FZD.webp",
  xmen: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-xmen-teaser-AXAKkSFiqwAysfXYAjHGzj.webp",
  wakandaFF: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-wakanda-ff-teaser-nn4rW4sTfjKKJpmYRdLUqZ.webp",
  spiderman: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-spiderman-connection-DPeNvHNVe92jsWiRdkWjhB.webp",
};

// Read article content from markdown files
function getContent(filepath) {
  const raw = readFileSync(filepath, 'utf-8');
  // Extract content after "## Content" header
  const contentMatch = raw.split('## Content\n\n');
  return contentMatch.length > 1 ? contentMatch[1].trim() : raw;
}

const now = Date.now();

const articles = [
  {
    title: "Every Avengers: Doomsday Teaser Trailer Decoded — The Complete Breakdown",
    slug: "avengers-doomsday-teaser-trailers-complete-breakdown",
    excerpt: "All four Avengers: Doomsday teasers decoded in one place — from Steve Rogers' farmhouse return to the X-Men's MCU debut. Every Easter egg, theory, and card market implication explained.",
    featuredImageUrl: IMAGES.overview,
    category: "rumors",
    tags: JSON.stringify(["Avengers Doomsday", "Doctor Doom", "Captain America", "Thor", "X-Men", "Fantastic Four", "Wakanda", "Teaser Trailers", "MCU Phase 6"]),
    relatedCharacters: JSON.stringify(["Doctor Doom", "Captain America", "Thor", "Professor X", "Cyclops", "Black Panther", "The Thing"]),
    cardMarketImpact: "Every character confirmed for Doomsday represents a potential price surge. When Endgame was announced, key character cards saw 200-400% increases. With the largest roster in MCU history, demand for Topps Marvel Mint and Comic Book Heroes cards is already climbing.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now,
    metaDescription: "Complete breakdown of all 4 Avengers Doomsday teaser trailers. Steve Rogers, Thor, X-Men, Fantastic Four & Wakanda decoded with Easter eggs, theories, and Marvel card market analysis.",
    sources: JSON.stringify([
      { title: "ScreenCrush - CinemaCon Trailer Breakdown", url: "https://screencrush.com/avengers-doomsday-cinemacon-trailer/" },
      { title: "Marvel Studios Official", url: "https://www.marvel.com/movies/avengers-doomsday" }
    ]),
    contentFile: "/home/ubuntu/articles/article1-overview.md",
  },
  {
    title: "Steve Rogers Is Back: Avengers Doomsday Teaser Reveals Chris Evans' Return",
    slug: "avengers-doomsday-steve-rogers-teaser-breakdown",
    excerpt: "Chris Evans returns as Steve Rogers in the first Avengers: Doomsday teaser. Full scene-by-scene breakdown of the farmhouse, the shield, and what it means for the MCU.",
    featuredImageUrl: IMAGES.steveRogers,
    category: "rumors",
    tags: JSON.stringify(["Steve Rogers", "Captain America", "Chris Evans", "Avengers Doomsday", "Teaser Breakdown", "MCU Phase 6", "Endgame"]),
    relatedCharacters: JSON.stringify(["Captain America", "Doctor Doom"]),
    cardMarketImpact: "Steve Rogers' confirmed return is already moving the needle on Captain America cards. The emotional weight mirrors the Endgame arc that made Cap cards spike 300% in 2019.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now - 3600000,
    metaDescription: "Full breakdown of the Avengers Doomsday Steve Rogers teaser. Chris Evans returns as Captain America — scene-by-scene analysis with Easter eggs, theories, and card market implications.",
    sources: JSON.stringify([
      { title: "Marvel Studios Official Teaser", url: "https://youtu.be/UiMg566PREA" },
      { title: "ScreenCrush Breakdown", url: "https://screencrush.com/avengers-doomsday-cinemacon-trailer/" }
    ]),
    contentFile: "/home/ubuntu/articles/article2-steve-rogers.md",
  },
  {
    title: "Thor's Last Stand: The Odinforce Prayer That Changes Everything in Avengers Doomsday",
    slug: "avengers-doomsday-thor-teaser-breakdown",
    excerpt: "Thor prays for the Odinforce in the second Avengers: Doomsday teaser. Full breakdown of the forest scene, Love's role, and why this signals Thor's most powerful form ever.",
    featuredImageUrl: IMAGES.thor,
    category: "rumors",
    tags: JSON.stringify(["Thor", "Chris Hemsworth", "Avengers Doomsday", "Odinforce", "Love and Thunder", "Stormbreaker", "Teaser Breakdown"]),
    relatedCharacters: JSON.stringify(["Thor", "Doctor Doom"]),
    cardMarketImpact: "An Odinforce-powered Thor is a completely different proposition for the card market. This is Thor at his absolute peak, which historically drives premium card prices to new highs.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now - 7200000,
    metaDescription: "Full breakdown of the Avengers Doomsday Thor teaser. Chris Hemsworth's prayer for the Odinforce analyzed scene-by-scene with Easter eggs, comic connections, and card market impact.",
    sources: JSON.stringify([
      { title: "Marvel Studios Official Teaser", url: "https://youtu.be/1clWprLC5Ak" },
      { title: "Marvel Comics - Odinforce", url: "https://www.marvel.com/characters/thor-odinson" }
    ]),
    contentFile: "/home/ubuntu/articles/article3-thor.md",
  },
  {
    title: "The X-Men Are Finally Here: Professor X, Cyclops, and the Abandoned Mansion Explained",
    slug: "avengers-doomsday-xmen-teaser-breakdown",
    excerpt: "The X-Men officially enter the MCU in the third Avengers: Doomsday teaser. Patrick Stewart's Xavier, Cyclops' uncontrolled blasts, and the abandoned mansion decoded.",
    featuredImageUrl: IMAGES.xmen,
    category: "rumors",
    tags: JSON.stringify(["X-Men", "Professor X", "Cyclops", "Patrick Stewart", "Avengers Doomsday", "X-Mansion", "Mutants", "MCU Phase 6"]),
    relatedCharacters: JSON.stringify(["Professor X", "Cyclops", "Doctor Doom"]),
    cardMarketImpact: "The X-Men entering the MCU is the single biggest event for Marvel card collectors since the Disney-Fox merger. Every X-Men card in existence just became exponentially more relevant.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now - 10800000,
    metaDescription: "Full breakdown of the Avengers Doomsday X-Men teaser. Professor X, Cyclops, and the abandoned X-Mansion analyzed with Easter eggs, mutant theories, and card market implications.",
    sources: JSON.stringify([
      { title: "Marvel Studios Official Teaser", url: "https://youtu.be/kH1XlwHQv9o" },
      { title: "Marvel Comics - X-Men", url: "https://www.marvel.com/teams-and-groups/x-men" }
    ]),
    contentFile: "/home/ubuntu/articles/article4-xmen.md",
  },
  {
    title: "Wakanda Meets the Fantastic Four: M'Baku, The Thing, and the Desert Alliance",
    slug: "avengers-doomsday-wakanda-fantastic-four-teaser-breakdown",
    excerpt: "King M'Baku meets The Thing in a barren desert in the fourth Avengers: Doomsday teaser. Full breakdown of the Wakanda-FF alliance, Namor on land, and Doom's terraforming.",
    featuredImageUrl: IMAGES.wakandaFF,
    category: "rumors",
    tags: JSON.stringify(["Wakanda", "Fantastic Four", "M'Baku", "The Thing", "Namor", "Shuri", "Avengers Doomsday", "Teaser Breakdown", "Talokanil"]),
    relatedCharacters: JSON.stringify(["Black Panther", "The Thing", "Namor"]),
    cardMarketImpact: "This teaser confirms Wakanda and Fantastic Four characters are all in Doomsday. The Thing is particularly undervalued with fewer cards in circulation than most Marvel characters.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now - 14400000,
    metaDescription: "Full breakdown of the Avengers Doomsday Wakanda and Fantastic Four teaser. M'Baku meets The Thing, Namor on land, and Doom's world-changing power analyzed with card market impact.",
    sources: JSON.stringify([
      { title: "Marvel Studios Official Teaser", url: "https://youtu.be/399Ez7WHK5s" },
      { title: "Marvel Comics - Fantastic Four", url: "https://www.marvel.com/teams-and-groups/fantastic-four" }
    ]),
    contentFile: "/home/ubuntu/articles/article5-wakanda-ff.md",
  },
  {
    title: "The Hidden Spider-Man Connection to Avengers Doomsday: Why Brand New Day Changes Everything",
    slug: "spider-man-brand-new-day-doomsday-connection-theory",
    excerpt: "A leaked synopsis, timeline confirmations, and comic book history all point to one conclusion — Spider-Man's story is inextricably linked to Doctor Doom's plan in Avengers: Doomsday.",
    featuredImageUrl: IMAGES.spiderman,
    category: "rumors",
    tags: JSON.stringify(["Spider-Man", "Tom Holland", "Tobey Maguire", "Avengers Doomsday", "Brand New Day", "Doctor Doom", "Multiverse", "MCU Theory"]),
    relatedCharacters: JSON.stringify(["Spider-Man", "Doctor Doom"]),
    cardMarketImpact: "Spider-Man cards are always premium, but the Doomsday connection adds a new dimension. If Peter Parker is central to the resolution of Doom's plan, then Spider-Man cards are at the center of the hype.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: now - 18000000,
    metaDescription: "The hidden Spider-Man connection to Avengers Doomsday explained. Brand New Day timeline leak, Tobey Maguire's role, and why Peter Parker may be the key to defeating Doctor Doom.",
    sources: JSON.stringify([
      { title: "GamesRadar - Spider-Man Doomsday Connection", url: "https://www.gamesradar.com/entertainment/marvel-movies/avengers-doomsday-director-retcons-spider-mans-mcu-origins-by-saying-peter-parker-doesnt-blame-himself-for-uncle-bens-death/" },
      { title: "GeekTyrant - Brand New Day Timeline", url: "https://geektyrant.com/news/spider-man-brand-new-day-theater-listing-drops-a-big-avengers-doomsday-timeline-surprise" },
      { title: "Spider-Man Doomsday Theory Video", url: "https://youtu.be/8TZMtslA3UY" }
    ]),
    contentFile: "/home/ubuntu/articles/article6-spiderman.md",
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  for (const article of articles) {
    try {
      // Read content from file
      const content = getContent(article.contentFile);
      
      await conn.execute(
        `INSERT INTO articles (title, slug, excerpt, contentMarkdown, featuredImageUrl, category, tags, cardMarketImpact, relatedCharacters, sources, isFeatured, isPublished, authorName, publishedAt, metaDescription)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          article.title,
          article.slug,
          article.excerpt,
          content,
          article.featuredImageUrl,
          article.category,
          article.tags,
          article.cardMarketImpact,
          article.relatedCharacters,
          article.sources,
          article.isFeatured,
          article.isPublished,
          article.authorName,
          article.publishedAt,
          article.metaDescription,
        ]
      );
      console.log(`✅ Published: "${article.title}"`);
    } catch (err) {
      console.error(`❌ Failed: "${article.title}" — ${err.message}`);
    }
  }

  // Verify
  const [rows] = await conn.execute(
    "SELECT id, title, slug, publishedAt, isFeatured FROM articles ORDER BY publishedAt DESC LIMIT 10"
  );
  console.log("\n--- Latest Articles ---");
  rows.forEach((r) => console.log(`  ${r.id}: [${r.isFeatured ? 'FEATURED' : ''}] ${r.title} → /mcu-news/${r.slug}`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
