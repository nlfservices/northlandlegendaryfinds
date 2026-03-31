/**
 * Redistribute blog article publish dates so same-category articles
 * are spread apart and don't cluster together.
 * 
 * Strategy: Sort articles by date, then re-interleave them so no two
 * consecutive articles share the same category. Maintain the same
 * date range but redistribute evenly.
 */

import { getPublishedBlogPosts, updateBlogPost } from "../server/db";

interface Post {
  id: number;
  title: string | null;
  category: string | null;
  publishedAt: Date | number | string | null;
}

async function redistribute() {
  const posts = await getPublishedBlogPosts();
  
  console.log(`\n=== Current article order (newest first) ===`);
  for (const p of posts) {
    const d = p.publishedAt ? new Date(typeof p.publishedAt === 'number' ? p.publishedAt : p.publishedAt as any).toISOString().split('T')[0] : 'draft';
    console.log(`  ${p.id}\t${d}\t${p.category}\t${(p.title || '').substring(0, 60)}`);
  }

  // Group posts by category
  const byCategory: Record<string, Post[]> = {};
  for (const p of posts) {
    const cat = p.category || 'uncategorized';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(p);
  }

  console.log(`\n=== Category distribution ===`);
  for (const [cat, catPosts] of Object.entries(byCategory)) {
    console.log(`  ${cat}: ${catPosts.length} articles`);
  }

  // Interleave: pick from categories round-robin, largest categories first
  // This ensures maximum spacing between same-category articles
  const sortedCategories = Object.entries(byCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([cat, catPosts]) => ({ cat, posts: [...catPosts] }));

  const interleaved: Post[] = [];
  let lastCategory = '';
  
  while (sortedCategories.some(c => c.posts.length > 0)) {
    // Sort by remaining count (most first) to spread evenly
    sortedCategories.sort((a, b) => b.posts.length - a.posts.length);
    
    let picked = false;
    for (const catGroup of sortedCategories) {
      if (catGroup.posts.length === 0) continue;
      if (catGroup.cat === lastCategory && sortedCategories.filter(c => c.posts.length > 0).length > 1) continue;
      
      const post = catGroup.posts.shift()!;
      interleaved.push(post);
      lastCategory = catGroup.cat;
      picked = true;
      break;
    }
    
    // If we couldn't avoid same category (only one category left), just pick it
    if (!picked) {
      for (const catGroup of sortedCategories) {
        if (catGroup.posts.length > 0) {
          interleaved.push(catGroup.posts.shift()!);
          break;
        }
      }
    }
  }

  // Now assign new dates: spread from oldest to newest
  // Keep the same date range but space evenly
  const oldestDate = new Date('2026-03-25T12:00:00Z').getTime(); // Start from Mar 25
  const newestDate = Date.now();
  const totalArticles = interleaved.length;
  const interval = (newestDate - oldestDate) / (totalArticles - 1);

  console.log(`\n=== New interleaved order (newest first) ===`);
  const updates: { id: number; publishedAt: number; title: string; category: string }[] = [];
  
  for (let i = 0; i < interleaved.length; i++) {
    // Newest first in the interleaved array, so reverse the date assignment
    const newDate = newestDate - (i * interval);
    const post = interleaved[i];
    const dateStr = new Date(newDate).toISOString().split('T')[0];
    console.log(`  ${post.id}\t${dateStr}\t${post.category}\t${(post.title || '').substring(0, 55)}`);
    updates.push({
      id: post.id,
      publishedAt: Math.round(newDate),
      title: post.title || '',
      category: post.category || '',
    });
  }

  // Apply updates
  console.log(`\n=== Applying ${updates.length} date updates ===`);
  for (const update of updates) {
    await updateBlogPost(update.id, { publishedAt: update.publishedAt });
    console.log(`  Updated ID ${update.id}: ${new Date(update.publishedAt).toISOString().split('T')[0]}`);
  }

  console.log(`\n✅ Done! ${updates.length} articles redistributed with category diversity.`);
  process.exit(0);
}

redistribute().catch(err => {
  console.error("Failed:", err);
  process.exit(1);
});
