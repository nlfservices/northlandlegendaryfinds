/**
 * Batch Card Detail Article Generator
 * Generates LLM-powered card detail articles for all remaining cards
 * Runs in parallel batches of 5 to stay within rate limits
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL
  ? `${process.env.BUILT_IN_FORGE_API_URL.replace(/\/$/, '')}/v1/chat/completions`
  : 'https://forge.manus.im/v1/chat/completions';
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const BATCH_SIZE = 5;
const DELAY_BETWEEN_BATCHES_MS = 1000;

function parseParallels(parallelsStr) {
  if (!parallelsStr) return [];
  return parallelsStr.split(',').map(p => {
    const trimmed = p.trim();
    const numbered = trimmed.match(/^\/(\d+)/);
    return {
      name: trimmed,
      isNumbered: !!numbered,
      printRun: numbered ? parseInt(numbered[1]) : null,
    };
  });
}

async function invokeLLM(messages, responseFormat) {
  const payload = {
    model: 'gemini-2.5-flash',
    messages,
    max_tokens: 16384,
    thinking: { budget_tokens: 128 },
  };
  if (responseFormat) payload.response_format = responseFormat;

  const res = await fetch(FORGE_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${FORGE_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LLM ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.json();
}

async function getConnection() {
  return mysql.createConnection(process.env.DATABASE_URL);
}

async function getRemainingCards(conn) {
  const [rows] = await conn.query(`
    SELECT mc.id, mc.cardNumber, mc.characterName, mc.cardType, mc.parallels, mc.setId,
           ms.slug as setSlug, ms.name as setName
    FROM marvel_cards mc
    JOIN marvel_sets ms ON mc.setId = ms.id
    LEFT JOIN card_detail_content cdc ON mc.id = cdc.cardId AND cdc.status = 'generated'
    WHERE cdc.id IS NULL
    ORDER BY ms.id, mc.cardNumber
  `);
  return rows;
}

async function getSameCharacterCards(conn, setId, characterName, excludeId) {
  if (!characterName) return [];
  const [rows] = await conn.query(
    `SELECT cardNumber, cardType FROM marvel_cards WHERE setId = ? AND characterName = ? AND id != ? LIMIT 5`,
    [setId, characterName, excludeId]
  );
  return rows;
}

async function generateForCard(conn, card) {
  const parallels = parseParallels(card.parallels);
  const numberedParallels = parallels.filter(p => p.isNumbered).map(p => p.name);
  const sameCharCards = await getSameCharacterCards(conn, card.setId, card.characterName, card.id);

  const response = await invokeLLM(
    [
      {
        role: 'system',
        content: `You are a Marvel trading card expert writing for Northland Legendary Finds, a premium Marvel card shop run by collectors since 1993. Write engaging, collector-focused content about specific trading cards. Use a knowledgeable but approachable tone — like a friend at a card show. Focus on what makes this specific card and its parallels collectible. Mention "Northland Legendary Finds" naturally 1-2 times.`
      },
      {
        role: 'user',
        content: `Write a 500-700 word article about the ${card.characterName} card #${card.cardNumber} from the ${card.setName} set.

Card details:
- Card Type/Subset: ${card.cardType || "Base"}
- Available Numbered Parallels: ${numberedParallels.length > 0 ? numberedParallels.join(", ") : "Standard parallels"}
- Other ${card.characterName} cards in this set: ${sameCharCards.length > 0 ? sameCharCards.map(c => `#${c.cardNumber} (${c.cardType})`).join(", ") : "None"}

Structure the article with these sections:
## About This Card
Describe what makes this specific card special in the ${card.setName} set. Discuss the card type "${card.cardType || "Base"}" and its significance.

## The Parallel Breakdown
Detail the available parallels and refractors for this card. Explain what each numbered parallel means for collectors (print run, rarity, value). ${numberedParallels.length > 0 ? `Cover these specific parallels: ${numberedParallels.join(", ")}` : "Discuss the standard parallel structure."}

## ${card.characterName} in ${card.setName}
Discuss why ${card.characterName} is featured in this set and what the character means to Marvel card collectors.

## Collector's Notes
Provide tips on what to look for, which parallels are most sought-after, and why this card belongs in a collection.

Write for the Northland Legendary Finds audience - serious Marvel card collectors who appreciate detail about print runs, parallels, and card value.`
      }
    ],
    {
      type: 'json_schema',
      json_schema: {
        name: 'card_detail_content',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            article: { type: 'string', description: 'Full markdown article, 500-700 words' },
            metaDescription: { type: 'string', description: 'SEO meta description, 150-160 chars' },
          },
          required: ['article', 'metaDescription'],
          additionalProperties: false,
        },
      },
    }
  );

  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content from LLM');
  const parsed = JSON.parse(content);

  // Upsert into database
  const [existing] = await conn.query(
    'SELECT id FROM card_detail_content WHERE cardId = ?', [card.id]
  );

  if (existing.length > 0) {
    await conn.query(
      `UPDATE card_detail_content SET contentMarkdown = ?, metaDescription = ?, status = 'generated', updatedAt = NOW() WHERE id = ?`,
      [parsed.article, parsed.metaDescription, existing[0].id]
    );
  } else {
    await conn.query(
      `INSERT INTO card_detail_content (cardId, setSlug, cardNumber, contentMarkdown, metaDescription, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 'generated', NOW(), NOW())`,
      [card.id, card.setSlug, card.cardNumber, parsed.article, parsed.metaDescription]
    );
  }

  return parsed;
}

async function main() {
  console.log('=== Batch Card Detail Article Generator ===');
  console.log(`API URL: ${FORGE_API_URL}`);
  console.log(`Batch size: ${BATCH_SIZE}`);

  const conn = await getConnection();
  const remaining = await getRemainingCards(conn);
  console.log(`\nCards remaining: ${remaining.length}`);

  if (remaining.length === 0) {
    console.log('All cards already have generated content!');
    await conn.end();
    return;
  }

  let completed = 0;
  let errors = 0;
  const startTime = Date.now();

  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    const batch = remaining.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(remaining.length / BATCH_SIZE);

    console.log(`\n--- Batch ${batchNum}/${totalBatches} ---`);

    const results = await Promise.allSettled(
      batch.map(card => generateForCard(conn, card))
    );

    for (let j = 0; j < results.length; j++) {
      const card = batch[j];
      const label = `${card.setSlug}/#${card.cardNumber} ${card.characterName}`;
      if (results[j].status === 'fulfilled') {
        completed++;
        console.log(`  ✓ ${label} (${completed}/${remaining.length})`);
      } else {
        errors++;
        console.error(`  ✗ ${label}: ${results[j].reason?.message?.slice(0, 100)}`);
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const rate = completed > 0 ? (completed / (elapsed / 60)).toFixed(1) : '0';
    const eta = completed > 0 ? (((remaining.length - completed - errors) / (completed / (elapsed / 1))) / 60).toFixed(0) : '?';
    console.log(`  Progress: ${completed + errors}/${remaining.length} | Rate: ${rate}/min | ETA: ${eta}min | Errors: ${errors}`);

    if (i + BATCH_SIZE < remaining.length) {
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_BATCHES_MS));
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n=== COMPLETE ===`);
  console.log(`Generated: ${completed} | Errors: ${errors} | Time: ${totalTime} minutes`);

  await conn.end();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
