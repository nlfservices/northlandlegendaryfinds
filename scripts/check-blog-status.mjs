import 'dotenv/config';

async function main() {
  const { getDb } = await import('../server/db.ts');
  const { blogPosts } = await import('../drizzle/schema.ts');
  const { sql, isNull, count } = await import('drizzle-orm');
  const db = await getDb();

  const allPosts = await db.select({
    id: blogPosts.id,
    title: blogPosts.title,
    layoutTemplate: blogPosts.layoutTemplate,
    isPublished: blogPosts.isPublished,
    featuredImageUrl: blogPosts.featuredImageUrl,
  }).from(blogPosts).orderBy(blogPosts.id);

  console.log(`Total articles: ${allPosts.length}`);
  console.log(`Published: ${allPosts.filter(p => p.isPublished).length}`);
  console.log(`With template: ${allPosts.filter(p => p.layoutTemplate).length}`);
  console.log(`Without template: ${allPosts.filter(p => !p.layoutTemplate).length}`);
  console.log(`With image: ${allPosts.filter(p => p.featuredImageUrl).length}`);
  console.log(`\nTemplate distribution:`);
  
  const templateCounts = {};
  for (const p of allPosts) {
    const key = p.layoutTemplate || 'none';
    templateCounts[key] = (templateCounts[key] || 0) + 1;
  }
  for (const [k, v] of Object.entries(templateCounts)) {
    console.log(`  Template ${k}: ${v} articles`);
  }

  console.log(`\nAll articles:`);
  for (const p of allPosts) {
    console.log(`  [${p.id}] T${p.layoutTemplate || '-'} | ${p.isPublished ? '✅' : '❌'} | ${p.title.substring(0, 60)}`);
  }

  process.exit(0);
}

main().catch(console.error);
