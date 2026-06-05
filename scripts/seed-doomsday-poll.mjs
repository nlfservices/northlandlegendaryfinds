import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Insert the poll
await connection.execute(
  `INSERT INTO article_polls (articleSlug, question, options, isActive, createdAt)
   VALUES (?, ?, ?, 1, NOW())
   ON DUPLICATE KEY UPDATE question = VALUES(question)`,
  [
    "doomsday-trailer-prediction-why-everyone-is-wrong-june-2026",
    "When does the first Avengers: Doomsday trailer drop?",
    JSON.stringify([
      "☕ SDCC — but only if Doom finishes his espresso first",
      "🕷️ Attached to Spider-Man — Doom hates sharing the spotlight",
      "🎬 Endgame Re-Release (September 25) — the nostalgia play",
      "🚫 No trailer ever — the mystery IS the marketing",
      "🤷 I just want to see Doom make an espresso"
    ])
  ]
);

console.log("✅ Doomsday trailer poll seeded!");
await connection.end();
