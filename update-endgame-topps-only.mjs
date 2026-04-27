import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Get current content
  const [rows] = await conn.execute('SELECT id, contentMarkdown FROM articles WHERE id = 360001');
  if (!rows.length) { console.log('Article not found!'); process.exit(1); }
  
  let content = rows[0].contentMarkdown;
  console.log('Original length:', content.length);
  
  // 1. Replace the Iron Man #1 image with the correct Topps Chrome image
  content = content.replace(
    'https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/xRESJkdKfjxRlPTs.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/qTyLNVirGHYhlxOT.jpg'
  );
  // Update the alt text too
  content = content.replace(
    'alt="Iron Man Tony Stark #1 2025 Topps Marvel Studios Chrome Base Card"',
    'alt="Iron Man Tony Stark #1 2025 Topps Marvel Studios Chrome Base Card with Topps Chrome logo"'
  );
  
  // 2. Remove the entire R-5 Reflections section (heading, image, and text)
  // Find and remove from "### Iron Man & Doctor Doom R-5" through the end of that section
  const r5Start = content.indexOf('### Iron Man & Doctor Doom R-5');
  if (r5Start !== -1) {
    // Find the next section after R-5 (starts with "Browse our")
    const nextSection = content.indexOf('Browse our [Card Database]', r5Start);
    if (nextSection !== -1) {
      const r5Section = content.substring(r5Start, nextSection);
      content = content.replace(r5Section, '');
      console.log('Removed R-5 Reflections section');
    }
  }
  
  // 3. Also remove R-5 from the Collector's Corner Hot Cards list
  // Remove the bullet point about R-5 Reflections
  content = content.replace(
    /- \*\*Iron Man R-5 2025 Topps Marvel Studios Chrome Reflections\*\* — [^\n]+\n/,
    ''
  );
  console.log('Removed R-5 from Hot Cards list');
  
  // 4. Update the "What This Means for Collectors" section to remove R-5 reference
  content = content.replace(
    'For Iron Man collectors, the R-5 Reflections insert (Iron Man and Doctor Doom) is the card to watch. It directly connects the Endgame legacy to the Doomsday future, making it a narrative bridge card that mirrors what the re-release itself is doing on screen.',
    'For Iron Man collectors, the **Iron Man #1 base card** from Marvel Studios Chrome is the key piece. As the literal first card in the set — bookending Thanos #100 at the end — it represents the beginning of the MCU story that Endgame concluded. Low-numbered parallels of both Iron Man #1 and Thanos #100 create the ultimate Endgame collecting pair.'
  );
  console.log('Updated What This Means section');
  
  // 5. Also update the R-5 mention in the Iron Man #1 section text
  content = content.replace(
    "The **R-5 Reflections insert** pairs Iron Man with Doctor Doom in a stunning split-face chrome design, foreshadowing the Doomsday narrative. And the **AS-5 Avengers Shadowbox** insert features Iron Man in the original Avengers lineup.\n\n",
    ''
  );
  console.log('Removed R-5/AS-5 mention from Iron Man section');
  
  console.log('New length:', content.length);
  
  // Update the database
  await conn.execute('UPDATE articles SET contentMarkdown = ? WHERE id = 360001', [content]);
  console.log('✅ Article updated successfully — Topps only!');
  
  await conn.end();
}

main().catch(console.error);
