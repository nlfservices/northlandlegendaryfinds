import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);

const slug = "comic-art-vs-actor-portrayal-marvel-card-collector-types-2025";

// Fetch current content
const [rows] = await conn.execute(
  "SELECT id, contentMarkdown FROM articles WHERE slug = ?",
  [slug]
);

if (!rows.length) {
  console.error("Article not found!");
  process.exit(1);
}

const article = rows[0];
let content = article.contentMarkdown;

// Replace "1970s" references with "1975"
const before = content;
content = content.replace(
  /Marvel has been making trading cards since the 1970s/g,
  "Topps has been making Marvel trading cards since 1975"
);
content = content.replace(
  /since the 1970s/g,
  "since 1975"
);
content = content.replace(
  /making cards since the 1970s/g,
  "making Marvel cards since 1975"
);

if (content === before) {
  console.log("No changes needed — text may already be updated or pattern not found.");
  // Show the relevant excerpt
  const idx = before.indexOf("1970");
  if (idx !== -1) {
    console.log("Found at:", before.substring(Math.max(0, idx - 50), idx + 80));
  }
} else {
  await conn.execute(
    "UPDATE articles SET contentMarkdown = ?, updatedAt = NOW() WHERE id = ?",
    [content, article.id]
  );
  console.log("✅ Article updated — changed '1970s' to '1975'");
}

await conn.end();
