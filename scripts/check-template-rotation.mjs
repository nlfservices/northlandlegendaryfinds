import { getDb } from '../server/db.ts';
import { articles } from '../drizzle/schema.ts';
import { desc } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  const result = await db
    .select({ id: articles.id, title: articles.title, slug: articles.slug, templateLayout: articles.templateLayout, publishedAt: articles.publishedAt })
    .from(articles)
    .orderBy(desc(articles.publishedAt))
    .limit(10);
  console.log('Recent articles:');
  result.forEach(a => {
    console.log(`  [${a.templateLayout || 'none'}] ${a.title?.substring(0, 60)} (${a.slug})`);
  });
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
