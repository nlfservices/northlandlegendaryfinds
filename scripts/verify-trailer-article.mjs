import { getDb } from '../server/db.ts';
import { articles } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  const [article] = await db.select({
    title: articles.title,
    template: articles.templateLayout,
    status: articles.status,
    slug: articles.slug,
    featuredImage: articles.featuredImage,
  }).from(articles).where(eq(articles.slug, 'doomsday-trailer-prediction-why-everyone-is-wrong-june-2026'));

  if (!article) {
    console.error("❌ Article NOT found!");
    process.exit(1);
  }

  console.log("✅ Article verified in database:");
  console.log("  Title:", article.title);
  console.log("  Template:", article.template);
  console.log("  Status:", article.status);
  console.log("  Slug:", article.slug);
  console.log("  Featured Image:", article.featuredImage ? "✅ Set" : "❌ Missing");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
