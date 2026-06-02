import { getDb } from '../server/db.ts';
import { articles } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  const result = await db.select({ 
    id: articles.id,
    featuredImageUrl: articles.featuredImageUrl, 
    templateLayout: articles.templateLayout,
    contentMarkdown: articles.contentMarkdown
  }).from(articles).where(eq(articles.slug, 'sxsw-london-tease-topps-chrome-doom-sdcc-trailer-june-2026'));
  console.log('Image:', result[0]?.featuredImageUrl);
  console.log('Template:', result[0]?.templateLayout);
  console.log('Content length:', result[0]?.contentMarkdown?.length);
  console.log('Content first 300:', result[0]?.contentMarkdown?.substring(0, 300));
  process.exit(0);
}

main();
