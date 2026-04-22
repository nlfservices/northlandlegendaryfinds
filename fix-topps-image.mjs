import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const newImageUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/article-topps-marvel-only-BBDTCC8Xwks77WW5pS4wAE.webp";

const [result] = await conn.execute(
  `UPDATE articles SET featuredImageUrl = ? WHERE slug = ?`,
  [newImageUrl, "topps-is-back-with-marvel-changes-everything-for-collectors"]
);

console.log("Updated rows:", result.affectedRows);

// Verify
const [rows] = await conn.execute(
  `SELECT id, title, featuredImageUrl FROM articles WHERE slug LIKE '%topps%'`
);
console.log("Updated article:", rows);

await conn.end();
