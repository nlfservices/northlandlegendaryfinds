/**
 * Redistribute templates across legacy articles (currently all Template 1)
 * and delete unpublished test articles
 */
import 'dotenv/config';

async function main() {
  const { getDb } = await import('../server/db.ts');
  const { blogPosts } = await import('../drizzle/schema.ts');
  const { eq, and, sql } = await import('drizzle-orm');
  const db = await getDb();

  // 1. Delete unpublished test articles
  console.log('Cleaning up unpublished test articles...');
  const deleted = await db.delete(blogPosts)
    .where(and(
      eq(blogPosts.isPublished, false),
      eq(blogPosts.title, 'Test Article')
    ));
  console.log('Deleted test articles.\n');

  // 2. Get all legacy articles (the ones that defaulted to template 1)
  // These are IDs 10-150001 (the original batch)
  const legacyPosts = await db.select({
    id: blogPosts.id,
    title: blogPosts.title,
    category: blogPosts.category,
    layoutTemplate: blogPosts.layoutTemplate,
  })
  .from(blogPosts)
  .where(sql`${blogPosts.id} <= 150001`)
  .orderBy(blogPosts.id);

  console.log(`Found ${legacyPosts.length} legacy articles to redistribute.\n`);

  // Assign templates in round-robin, skipping template 1 since new articles already use it
  // Use templates 1-12 cycling through
  let templateCounter = 0;
  for (const post of legacyPosts) {
    templateCounter++;
    const newTemplate = ((templateCounter - 1) % 12) + 1;
    
    await db.update(blogPosts)
      .set({ layoutTemplate: newTemplate })
      .where(eq(blogPosts.id, post.id));
    
    console.log(`  [${post.id}] T${post.layoutTemplate} → T${newTemplate} | ${post.title.substring(0, 50)}`);
  }

  console.log(`\nRedistributed ${legacyPosts.length} articles across 12 templates.`);
  
  // Verify final distribution
  const allPosts = await db.select({
    layoutTemplate: blogPosts.layoutTemplate,
  }).from(blogPosts);
  
  const dist = {};
  for (const p of allPosts) {
    const key = p.layoutTemplate || 'none';
    dist[key] = (dist[key] || 0) + 1;
  }
  console.log('\nFinal template distribution:');
  for (const [k, v] of Object.entries(dist).sort((a, b) => Number(a[0]) - Number(b[0]))) {
    console.log(`  Template ${k}: ${v} articles`);
  }

  process.exit(0);
}

main().catch(console.error);
