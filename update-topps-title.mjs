import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const newTitle = "Topps Is Back With Marvel — And It Changes Everything for Collectors";
const newSlug = "topps-is-back-with-marvel-changes-everything-for-collectors";

const [result] = await conn.execute(
  `UPDATE articles SET title = ?, slug = ? WHERE slug LIKE '%topps-reclaims%'`,
  [newTitle, newSlug]
);

console.log("Updated rows:", result.affectedRows);

// Verify
const [rows] = await conn.execute(
  `SELECT id, title, slug FROM articles WHERE slug LIKE '%topps%'`
);
console.log("Updated article:", rows);

await conn.end();
