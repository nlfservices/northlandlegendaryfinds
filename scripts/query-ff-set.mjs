import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);

const [rows] = await conn.execute(
  "SELECT id, name, slug, description FROM marvel_sets WHERE slug LIKE '%fantastic%' OR name LIKE '%Fantastic%'"
);

console.log(JSON.stringify(rows, null, 2));
await conn.end();
