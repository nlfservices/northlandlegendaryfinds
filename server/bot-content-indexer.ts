/**
 * Facebook Comment Bot — Content Indexer
 *
 * Syncs all published NLF articles into the site_content_index table
 * so the bot has a searchable knowledge base to draw from when
 * generating contextually relevant replies.
 *
 * Called by:
 *  - Admin tRPC mutation (manual re-index)
 *  - Heartbeat cron job at /api/scheduled/bot-reindex (every 2 hours)
 */

import { getDb } from "./db";
import {
  articles,
  siteContentIndex,
  botSettings,
  InsertSiteContentIndex,
} from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Strip HTML tags and markdown syntax from article content.
 * Returns plain text suitable for LLM context.
 */
function stripMarkdown(md: string): string {
  return md
    // Remove HTML tags
    .replace(/<[^>]+>/g, " ")
    // Remove image syntax ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    // Remove link syntax [text](url) → keep text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // Remove headings
    .replace(/^#{1,6}\s+/gm, "")
    // Remove bold/italic
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, "")
    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Build a concise summary from the first ~500 chars of body text.
 */
function buildSummary(bodyText: string, excerpt: string | null): string {
  if (excerpt && excerpt.length > 20) return excerpt;
  return bodyText.slice(0, 500).replace(/\s+\S*$/, "") + "…";
}

/**
 * Index all published articles into site_content_index.
 * Upserts by articleSlug — safe to run repeatedly.
 * Returns the count of articles indexed.
 */
export async function indexAllArticles(): Promise<{
  indexed: number;
  skipped: number;
  errors: string[];
}> {
  const db = await getDb();
  if (!db) {
    return { indexed: 0, skipped: 0, errors: ["Database not available"] };
  }

  let indexed = 0;
  let skipped = 0;
  const errors: string[] = [];

  try {
    // Fetch all published articles
    const publishedArticles = await db
      .select()
      .from(articles)
      .where(eq(articles.isPublished, true));

    for (const article of publishedArticles) {
      try {
        const bodyText = stripMarkdown(article.contentMarkdown || "");
        const summary = buildSummary(bodyText, article.excerpt || null);

        const entry: InsertSiteContentIndex = {
          articleSlug: article.slug,
          title: article.title,
          bodyText: bodyText.slice(0, 65000), // MySQL TEXT limit safety
          summary,
          tags: Array.isArray(article.tags) ? article.tags : [],
          relatedCharacters: Array.isArray(article.relatedCharacters)
            ? article.relatedCharacters
            : [],
          category: article.category,
          template: article.templateLayout || "classic",
          publishedAt: article.publishedAt
            ? new Date(article.publishedAt)
            : null,
          indexedAt: new Date(),
        };

        // Upsert: insert or update on duplicate slug
        await db
          .insert(siteContentIndex)
          .values(entry)
          .onDuplicateKeyUpdate({
            set: {
              title: entry.title,
              bodyText: entry.bodyText,
              summary: entry.summary,
              tags: entry.tags,
              relatedCharacters: entry.relatedCharacters,
              category: entry.category,
              template: entry.template,
              publishedAt: entry.publishedAt,
              indexedAt: new Date(),
            },
          });

        indexed++;
      } catch (err: any) {
        errors.push(`${article.slug}: ${err.message}`);
        skipped++;
      }
    }

    // Update lastIndexedAt in bot_settings
    try {
      const existing = await db.select().from(botSettings).limit(1);
      if (existing.length > 0) {
        await db
          .update(botSettings)
          .set({ lastIndexedAt: new Date() })
          .where(eq(botSettings.id, existing[0].id));
      } else {
        // Create default settings row if it doesn't exist
        await db.insert(botSettings).values({
          enabled: false,
          replyMode: "review",
          replyDelayMs: 30000,
          maxReplyLength: 280,
          replyWindowDays: 7,
          lastIndexedAt: new Date(),
        });
      }
    } catch (settingsErr: any) {
      console.warn("[BotIndexer] Could not update lastIndexedAt:", settingsErr.message);
    }

    console.log(
      `[BotIndexer] Done: ${indexed} indexed, ${skipped} skipped, ${errors.length} errors`
    );
    return { indexed, skipped, errors };
  } catch (err: any) {
    console.error("[BotIndexer] Fatal error:", err.message);
    return { indexed, skipped, errors: [err.message] };
  }
}

/**
 * Search the site_content_index for articles relevant to a given comment.
 * Returns up to `limit` results sorted by relevance (simple keyword match).
 */
export async function searchContentIndex(
  query: string,
  limit: number = 3
): Promise<
  Array<{
    slug: string;
    title: string;
    summary: string;
    tags: string[];
    relatedCharacters: string[];
    category: string | null;
  }>
> {
  const db = await getDb();
  if (!db) return [];

  try {
    // Pull all indexed articles (small table, fast enough for now)
    const all = await db.select().from(siteContentIndex);

    if (all.length === 0) return [];

    // Simple relevance scoring: count keyword matches in title + summary + tags + chars
    const queryWords = query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2);

    const scored = all.map(entry => {
      const haystack = [
        entry.title,
        entry.summary,
        (entry.tags as string[] || []).join(" "),
        (entry.relatedCharacters as string[] || []).join(" "),
        entry.category,
      ]
        .join(" ")
        .toLowerCase();

      const score = queryWords.reduce(
        (acc, word) => acc + (haystack.includes(word) ? 1 : 0),
        0
      );

      return { entry, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => ({
        slug: s.entry.articleSlug,
        title: s.entry.title,
        summary: s.entry.summary || "",
        tags: (s.entry.tags as string[]) || [],
        relatedCharacters: (s.entry.relatedCharacters as string[]) || [],
        category: s.entry.category,
      }));
  } catch (err: any) {
    console.error("[BotIndexer] Search error:", err.message);
    return [];
  }
}
