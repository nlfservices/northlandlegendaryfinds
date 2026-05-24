import { getDb } from "../server/db";
import { articles } from "../drizzle/schema";
import { like, desc } from "drizzle-orm";

async function main() {
  const db = await getDb();
  const results = await db.select({
    id: articles.id,
    title: articles.title,
    slug: articles.slug,
    isPublished: articles.isPublished,
    templateLayout: articles.templateLayout,
    category: articles.category,
  }).from(articles).where(like(articles.title, '%Fallen Son%')).orderBy(desc(articles.createdAt)).limit(10);
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}
main();
