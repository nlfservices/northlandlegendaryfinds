/**
 * Facebook Comment Bot — AI Reply Generator
 *
 * Takes a fan comment, searches the NLF knowledge base for relevant context,
 * and generates a reply in NLF's brand voice using the site's LLM.
 *
 * Brand voice: casual, knowledgeable, community-focused — never corporate.
 * Always posts as "Northland Legendary Finds" page.
 */

import { invokeLLM } from "./_core/llm";
import { searchContentIndex } from "./bot-content-indexer";
import { getDb } from "./db";
import {
  botSettings,
  botReplyLog,
  InsertBotReplyLog,
} from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { replyToComment } from "./facebook-api";

const NLF_SYSTEM_PROMPT = `You are the social media voice for Northland Legendary Finds (NLF) — a Marvel trading card collector community and MCU content hub.

Your job is to reply to fan comments on NLF's Facebook posts. You are:
- Casual and friendly, like a fellow Marvel fan
- Knowledgeable about the MCU, Marvel comics, and trading cards
- Community-focused — you celebrate fans, not sell to them
- Never corporate, never pushy, never salesy
- Enthusiastic about Marvel lore, Avengers Doomsday, Doctor Doom, and card collecting

Rules:
1. Keep replies SHORT — 1-3 sentences max, ideally under 200 characters
2. Never mention prices, buying, or selling unless the fan specifically asks
3. Never push the /cards page or any product
4. If the comment is a question you can answer from site context, answer it naturally
5. If you don't know the answer, be honest and say "great question!" and engage
6. Use casual language: "honestly", "wild", "love this", "right?!", "lowkey", etc.
7. End with a question or engagement hook when it feels natural
8. Never use hashtags in replies
9. If the comment is spam, offensive, or irrelevant, respond with SKIP
10. Sign off occasionally with "— NLF" but not every time`;

/**
 * Get the current bot settings (or defaults if not configured).
 */
export async function getBotSettings() {
  const db = await getDb();
  if (!db) {
    return {
      enabled: false,
      replyMode: "review" as const,
      replyDelayMs: 30000,
      personalityPrompt: null,
      maxReplyLength: 280,
      replyWindowDays: 7,
    };
  }

  const rows = await db.select().from(botSettings).limit(1);
  if (rows.length === 0) {
    return {
      enabled: false,
      replyMode: "review" as const,
      replyDelayMs: 30000,
      personalityPrompt: null,
      maxReplyLength: 280,
      replyWindowDays: 7,
    };
  }

  return rows[0];
}

/**
 * Generate an AI reply for a fan comment.
 * Returns the reply text, or null if the comment should be skipped.
 */
export async function generateBotReply(opts: {
  commentText: string;
  commenterName: string;
  postContext?: string;
}): Promise<{ reply: string | null; skip: boolean; reason?: string }> {
  const { commentText, commenterName, postContext } = opts;

  // Skip very short or empty comments
  if (!commentText || commentText.trim().length < 3) {
    return { reply: null, skip: true, reason: "Comment too short" };
  }

  // Skip if it looks like spam (all caps, excessive punctuation, etc.)
  const spamPatterns = [
    /^[A-Z\s!?]{20,}$/, // All caps
    /(.)\1{5,}/, // Repeated characters
    /https?:\/\//i, // Contains URL (could be spam)
    /follow\s+me|check\s+my\s+profile/i, // Self-promotion
  ];
  for (const pattern of spamPatterns) {
    if (pattern.test(commentText)) {
      return { reply: null, skip: true, reason: "Spam pattern detected" };
    }
  }

  try {
    const settings = await getBotSettings();

    // Search the knowledge base for relevant context
    const relevantContent = await searchContentIndex(commentText, 2);

    // Build context string from relevant articles
    let contextBlock = "";
    if (relevantContent.length > 0) {
      contextBlock = "\n\nRelevant NLF content you can reference:\n";
      for (const article of relevantContent) {
        contextBlock += `\n• "${article.title}" (/${article.category}/${article.slug})\n  ${article.summary}\n`;
      }
    }

    // Build the custom personality prompt addition
    const personalityAddition = settings.personalityPrompt
      ? `\n\nAdditional brand voice guidance:\n${settings.personalityPrompt}`
      : "";

    const systemPrompt = NLF_SYSTEM_PROMPT + personalityAddition;

    const userPrompt = `A fan named ${commenterName} commented on one of our Facebook posts:

"${commentText}"

${postContext ? `Context about the post they commented on: ${postContext}` : ""}
${contextBlock}

Write a short, casual, engaging reply in NLF's voice. If the comment is spam, offensive, or doesn't warrant a reply, respond with exactly: SKIP`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const rawContent = response.choices?.[0]?.message?.content;
    const rawReply = typeof rawContent === "string" ? rawContent.trim() : "";

    if (!rawReply || rawReply === "SKIP" || rawReply.toUpperCase().includes("SKIP")) {
      return { reply: null, skip: true, reason: "LLM decided to skip" };
    }

    // Truncate to max length
    const maxLen = settings.maxReplyLength || 280;
    const finalReply =
      rawReply.length > maxLen
        ? rawReply.slice(0, maxLen - 3).replace(/\s+\S*$/, "") + "..."
        : rawReply;

    return { reply: finalReply, skip: false };
  } catch (err: any) {
    console.error("[BotReply] LLM error:", err.message);
    return { reply: null, skip: true, reason: `LLM error: ${err.message}` };
  }
}

/**
 * Process a single incoming comment:
 * 1. Check if we've already replied
 * 2. Generate a reply
 * 3. If mode is 'auto', post immediately; if 'review', queue for approval
 */
export async function processComment(opts: {
  fbPostId: string;
  fbCommentId: string;
  commenterName: string;
  commentText: string;
  commentedAt?: Date;
  postContext?: string;
}): Promise<{
  action: "replied" | "queued" | "skipped" | "already_processed";
  replyText?: string;
  logId?: number;
}> {
  const db = await getDb();
  if (!db) return { action: "skipped" };

  // Check if we've already processed this comment
  const existing = await db
    .select()
    .from(botReplyLog)
    .where(eq(botReplyLog.fbCommentId, opts.fbCommentId))
    .limit(1);

  if (existing.length > 0) {
    return { action: "already_processed", logId: existing[0].id };
  }

  const settings = await getBotSettings();

  // Check if bot is enabled
  if (!settings.enabled) {
    return { action: "skipped" };
  }

  // Check comment age (only reply to comments within replyWindowDays)
  if (opts.commentedAt) {
    const ageMs = Date.now() - opts.commentedAt.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    if (ageDays > (settings.replyWindowDays || 7)) {
      const logEntry: InsertBotReplyLog = {
        fbPostId: opts.fbPostId,
        fbCommentId: opts.fbCommentId,
        commenterName: opts.commenterName,
        commentText: opts.commentText,
        botReply: null,
        sent: false,
        skipReason: `Comment too old (${Math.round(ageDays)} days)`,
      };
      const result = await db.insert(botReplyLog).values(logEntry);
      return { action: "skipped", logId: Number(result[0].insertId) };
    }
  }

  // Generate the reply
  const { reply, skip, reason } = await generateBotReply({
    commentText: opts.commentText,
    commenterName: opts.commenterName,
    postContext: opts.postContext,
  });

  if (skip || !reply) {
    const logEntry: InsertBotReplyLog = {
      fbPostId: opts.fbPostId,
      fbCommentId: opts.fbCommentId,
      commenterName: opts.commenterName,
      commentText: opts.commentText,
      botReply: null,
      sent: false,
      skipReason: reason || "Skipped",
    };
    const result = await db.insert(botReplyLog).values(logEntry);
    return { action: "skipped", logId: Number(result[0].insertId) };
  }

  // In 'auto' mode: post immediately (with optional delay)
  if (settings.replyMode === "auto") {
    // Optional delay to seem more human
    if (settings.replyDelayMs && settings.replyDelayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, settings.replyDelayMs));
    }

    const fbResult = await replyToComment(opts.fbCommentId, reply);

    const logEntry: InsertBotReplyLog = {
      fbPostId: opts.fbPostId,
      fbCommentId: opts.fbCommentId,
      commenterName: opts.commenterName,
      commentText: opts.commentText,
      botReply: reply,
      sent: fbResult.success,
      replyCommentId: fbResult.replyId,
      skipReason: fbResult.success ? null : fbResult.error,
      repliedAt: fbResult.success ? new Date() : null,
    };

    const result = await db.insert(botReplyLog).values(logEntry);
    return {
      action: "replied",
      replyText: reply,
      logId: Number(result[0].insertId),
    };
  }

  // In 'review' mode: queue for admin approval
  const logEntry: InsertBotReplyLog = {
    fbPostId: opts.fbPostId,
    fbCommentId: opts.fbCommentId,
    commenterName: opts.commenterName,
    commentText: opts.commentText,
    botReply: reply,
    sent: false,
    skipReason: null,
  };

  const result = await db.insert(botReplyLog).values(logEntry);
  return {
    action: "queued",
    replyText: reply,
    logId: Number(result[0].insertId),
  };
}
