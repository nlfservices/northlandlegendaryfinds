import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const SLUG = 'complete-mcu-release-calendar-every-movie-series-cartoon-2026-2028';

// Image URLs (compressed webp versions for fast loading)
const IMAGES = {
  doomsday: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/cal-doomsday-concept-DqBcj9RfhGbjgJhZGCuQZF.webp',
  spiderman: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/cal-spiderman-bnd-concept-MTs8jZsQL4sPpGVRWjHtQe.webp',
  secretWars: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/cal-secret-wars-concept-TRYGLNe3mZ2FAtmQgMQuoF.webp',
  punisher: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/cal-punisher-concept-YR9Wqw8vNazSAFyYKk49Pd.webp',
  xmen97: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/cal-xmen97-concept-chjGfFjsqBT3rtBWxBq8s3.webp',
  visionquest: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/cal-visionquest-concept-bkUvELxsKUvcTAX8RUCEv5.webp',
  endgame: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/cal-endgame-rerelease-concept-gJ7ABB4o7Hwwit7ohRBnBE.webp',
};

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  const [rows] = await conn.execute('SELECT id, contentMarkdown FROM articles WHERE slug = ?', [SLUG]);
  if (!rows.length) { console.error('Article not found!'); process.exit(1); }
  
  let content = rows[0].contentMarkdown;
  const id = rows[0].id;
  
  // Insert images after each section heading
  // Doomsday section
  content = content.replace(
    '### Avengers: Doomsday — December 18, 2026',
    `### Avengers: Doomsday — December 18, 2026\n\n<img src="${IMAGES.doomsday}" alt="Avengers Doomsday concept art" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />\n`
  );
  
  // Spider-Man section
  content = content.replace(
    '### Spider-Man: Brand New Day — July 24, 2026',
    `### Spider-Man: Brand New Day — July 24, 2026\n\n<img src="${IMAGES.spiderman}" alt="Spider-Man Brand New Day concept art" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />\n`
  );
  
  // Secret Wars section
  content = content.replace(
    '### Avengers: Secret Wars — December 17, 2027',
    `### Avengers: Secret Wars — December 17, 2027\n\n<img src="${IMAGES.secretWars}" alt="Avengers Secret Wars concept art" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />\n`
  );
  
  // Punisher section
  content = content.replace(
    '### The Punisher: One Last Kill — May 12, 2026',
    `### The Punisher: One Last Kill — May 12, 2026\n\n<img src="${IMAGES.punisher}" alt="The Punisher concept art" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />\n`
  );
  
  // X-Men '97 section
  content = content.replace(
    "### X-Men '97 Season 2 — Summer 2026",
    `### X-Men '97 Season 2 — Summer 2026\n\n<img src="${IMAGES.xmen97}" alt="X-Men 97 Season 2 concept art" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />\n`
  );
  
  // VisionQuest section
  content = content.replace(
    '### VisionQuest — TBA 2026',
    `### VisionQuest — TBA 2026\n\n<img src="${IMAGES.visionquest}" alt="VisionQuest concept art" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />\n`
  );
  
  // Endgame Re-Release section
  content = content.replace(
    '## The Endgame Re-Release',
    `## The Endgame Re-Release\n\n<img src="${IMAGES.endgame}" alt="Avengers Endgame Re-Release concept art" style="width:100%;max-width:600px;border-radius:12px;margin:12px 0;" />\n`
  );
  
  await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = ?', [content, id]);
  console.log('✅ Updated Release Calendar article with 7 concept images!');
  
  await conn.end();
}

main().catch(e => { console.error(e); process.exit(1); });
