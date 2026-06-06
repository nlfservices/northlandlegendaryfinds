import { getDb } from '../server/db.ts';
import { articles } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  await db.delete(articles).where(eq(articles.id, 1890001));
  console.log('Deleted article 1890001');
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
