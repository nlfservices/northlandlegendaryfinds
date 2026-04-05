import 'dotenv/config';

async function main() {
  const { createBlogPost } = await import('../server/db.ts');
  
  const testData = {
    title: "Test Article",
    slug: "test-article-" + Date.now(),
    excerpt: "Test excerpt",
    contentMarkdown: "# Test\n\nThis is a test article.",
    featuredImageUrl: "https://example.com/test.jpg",
    category: "market_trends",
    tags: ["test"],
    isAiGenerated: true,
    aiPrompt: "test",
    isFeatured: false,
    isPublished: false,
    authorName: "NLF Team",
    publishedAt: Date.now(),
    scheduledAt: null,
    metaDescription: "Test meta",
    focusKeyword: "test",
    internalLinks: [{ text: "test", url: "/test" }],
    readTimeMinutes: 1,
    layoutTemplate: 4,
    layoutData: {
      timeline: [
        { date: "2026-01-01", title: "Test event", description: "Test description" }
      ],
      toc: ["Section 1", "Section 2"],
    },
  };

  try {
    await createBlogPost(testData);
    console.log("✅ Insert succeeded!");
  } catch (err) {
    console.error("❌ Insert failed:", err.message);
    console.error("Full error:", err);
  }

  // Now try without layoutData
  try {
    const testData2 = { ...testData, slug: "test-article-2-" + Date.now(), layoutTemplate: 5, layoutData: null };
    await createBlogPost(testData2);
    console.log("✅ Insert without layoutData succeeded!");
  } catch (err) {
    console.error("❌ Insert without layoutData failed:", err.message);
  }

  process.exit(0);
}

main().catch(console.error);
