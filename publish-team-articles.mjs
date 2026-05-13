/**
 * Publish 4 Team-Based Doomsday Articles — May 9-12, 2026
 * Run from project root: node publish-team-articles.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Image URLs (from manus-upload-file --webdev)
const IMAGES = {
  xmen: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-xmen-team-cards-fuEazaAYuZ8M5CE2uTaeny.webp",
  thorCap: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-thor-cap-team-cards-XNA72VqrbHfXnfZbaUb83p.webp",
  wakandaFF: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-wakanda-ff-vibranium-cards-3NwjKLKFGZytLijnGcwsLz.webp",
  alanCumming: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-alan-cumming-traitors-nightcrawler-geGH2gPSp9zUXtLvwNbgwD.webp",
};

// Stagger dates: May 12 (today), May 11, May 10, May 9
const may12 = new Date('2026-05-12T10:00:00-05:00').getTime();
const may11 = new Date('2026-05-11T10:00:00-05:00').getTime();
const may10 = new Date('2026-05-10T10:00:00-05:00').getTime();
const may9 = new Date('2026-05-09T10:00:00-05:00').getTime();

// Read article content from files
const xmenContent = readFileSync('/home/ubuntu/articles/team1-xmen.md', 'utf-8').replace(/^# .+\n\n/, '');
const thorCapContent = readFileSync('/home/ubuntu/articles/team2-thor-cap.md', 'utf-8').replace(/^# .+\n\n/, '');
const wakandaFFContent = readFileSync('/home/ubuntu/articles/team3-wakanda-ff-vibranium.md', 'utf-8').replace(/^# .+\n\n/, '');
const alanCummingContent = readFileSync('/home/ubuntu/articles/team4-alan-cumming-traitors.md', 'utf-8').replace(/^# .+\n\n/, '');

const articles = [
  {
    title: "The X-Men's Last Stand: Every Mutant Confirmed for Avengers: Doomsday and the Jean Grey Mystery",
    slug: "xmen-doomsday-confirmed-roster-jean-grey-mystery",
    excerpt: "Hugh Jackman, Halle Berry, Patrick Stewart, and Alan Cumming are all confirmed for Doomsday. But where is Jean Grey? Insider rumors suggest Marvel is hiding their biggest secret.",
    featuredImageUrl: IMAGES.xmen,
    category: "rumors",
    tags: JSON.stringify(["X-Men", "Doomsday", "Jean Grey", "Wolverine", "Nightcrawler", "Famke Janssen", "Topps Marvel Mint"]),
    relatedCharacters: JSON.stringify(["Wolverine", "Storm", "Jean Grey", "Professor X", "Magneto", "Nightcrawler", "Rogue"]),
    cardMarketImpact: "X-Men Platinum tier cards in Topps Marvel Mint are climbing 15% since the teaser. Jean Grey Gold tier (#97) is the ultimate speculation play if she's secretly in the film.",
    isFeatured: 1,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: may12,
    metaDescription: "Every mutant confirmed for Avengers Doomsday plus the Jean Grey mystery. Famke Janssen denies involvement but insiders say otherwise. X-Men Topps Marvel Mint card analysis.",
    sources: JSON.stringify([
      { title: "Alan Cumming Deadline Interview", url: "https://deadline.com/2026/05/alan-cumming-avengers-doomsday-nightcrawler/" },
      { title: "ComicBook.com - Secret Characters", url: "https://comicbook.com/movies/news/original-x-men-star-reveals-avengers-doomsday-has-secret-unannounced-characters-reveals-how-much-hes-in-it/" },
    ]),
    contentMarkdown: xmenContent,
  },
  {
    title: "Thunder and Vibranium: Thor and Captain America's Reunion in Avengers: Doomsday",
    slug: "thor-captain-america-reunion-doomsday-teaser-breakdown",
    excerpt: "The first two Doomsday teasers put Thor and Captain America front and center. Their reunion isn't fan service — it's a narrative necessity against Doctor Doom.",
    featuredImageUrl: IMAGES.thorCap,
    category: "rumors",
    tags: JSON.stringify(["Thor", "Captain America", "Doomsday", "Steve Rogers", "Chris Evans", "Chris Hemsworth", "Topps Marvel Mint"]),
    relatedCharacters: JSON.stringify(["Thor", "Captain America", "Steve Rogers", "Valkyrie"]),
    cardMarketImpact: "Thor #105 and Captain America #104 are back-to-back in the Topps Marvel Mint Platinum tier. Their reunion confirmation has pushed premium parallels to new highs.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: may11,
    metaDescription: "Thor and Captain America reunite in Avengers Doomsday. Teaser trailer breakdown reveals their partnership is key to stopping Doctor Doom. Card market analysis included.",
    sources: JSON.stringify([
      { title: "ScreenCrush CinemaCon Trailer Breakdown", url: "https://screencrush.com/avengers-doomsday-cinemacon-trailer/" },
    ]),
    contentMarkdown: thorCapContent,
  },
  {
    title: "Vibranium Wars: Why Doctor Doom Needs Wakanda, Namor, and the Fantastic Four",
    slug: "vibranium-wars-doom-wakanda-namor-fantastic-four",
    excerpt: "The fourth Doomsday teaser reveals Doom's true objective: vibranium. Wakanda under siege, Namor's alliance, and the Fantastic Four caught in the crossfire of Doom's master plan.",
    featuredImageUrl: IMAGES.wakandaFF,
    category: "rumors",
    tags: JSON.stringify(["Wakanda", "Fantastic Four", "Namor", "Vibranium", "Doctor Doom", "Black Panther", "Silver Surfer", "Topps Marvel Mint"]),
    relatedCharacters: JSON.stringify(["Black Panther", "Namor", "Mister Fantastic", "Invisible Woman", "Human Torch", "The Thing", "Silver Surfer", "Doctor Doom"]),
    cardMarketImpact: "Wakandan and Fantastic Four cards are the most undervalued Doomsday segment. Black Panther #120 Platinum and Mister Fantastic #106 Platinum are positioned for major gains.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: may10,
    metaDescription: "Doctor Doom is after vibranium in Avengers Doomsday. Wakanda, Namor, and the Fantastic Four unite against his master plan. Card market analysis for collectors.",
    sources: JSON.stringify([
      { title: "ScreenCrush CinemaCon Trailer Breakdown", url: "https://screencrush.com/avengers-doomsday-cinemacon-trailer/" },
    ]),
    contentMarkdown: wakandaFFContent,
  },
  {
    title: "How to Trick Your Wife Into Seeing Avengers: Doomsday (Thanks to The Traitors' Alan Cumming)",
    slug: "alan-cumming-traitors-nightcrawler-doomsday-guide",
    excerpt: "The host of Peacock's The Traitors is returning as Nightcrawler in Avengers: Doomsday. Here's how to use that fact to get your non-Marvel partner into the theater.",
    featuredImageUrl: IMAGES.alanCumming,
    category: "rumors",
    tags: JSON.stringify(["Alan Cumming", "Nightcrawler", "The Traitors", "Doomsday", "X-Men", "Pedro Pascal", "Topps Comic Book Heroes"]),
    relatedCharacters: JSON.stringify(["Nightcrawler", "Wolverine"]),
    cardMarketImpact: "Alan Cumming's crossover appeal between The Traitors and Doomsday creates demand from a new collector demographic. Nightcrawler cards are underpriced relative to other confirmed X-Men.",
    isFeatured: 0,
    isPublished: 1,
    authorName: "NLF Team",
    publishedAt: may9,
    metaDescription: "Alan Cumming from The Traitors returns as Nightcrawler in Avengers Doomsday. A fun guide to convincing your non-Marvel partner to see the film. Plus Nightcrawler card picks.",
    sources: JSON.stringify([
      { title: "Alan Cumming Deadline Interview", url: "https://deadline.com/2026/05/alan-cumming-avengers-doomsday-nightcrawler/" },
      { title: "ComicBook.com - Secret Characters", url: "https://comicbook.com/movies/news/original-x-men-star-reveals-avengers-doomsday-has-secret-unannounced-characters-reveals-how-much-hes-in-it/" },
    ]),
    contentMarkdown: alanCummingContent,
  },
];

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  for (const article of articles) {
    try {
      await conn.execute(
        `INSERT INTO articles (title, slug, excerpt, contentMarkdown, featuredImageUrl, category, tags, cardMarketImpact, relatedCharacters, sources, isFeatured, isPublished, authorName, publishedAt, metaDescription)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          article.title,
          article.slug,
          article.excerpt,
          article.contentMarkdown,
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
  rows.forEach((r) => console.log(`  ${r.id}: [${r.isFeatured ? 'FEATURED' : ''}] ${r.title} (${r.slug})`));

  await conn.end();
  console.log(`\nDone! ${articles.length} article(s) published.`);
}

main().catch(console.error);
