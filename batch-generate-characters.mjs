/**
 * Batch Character Article Generator
 * Generates LLM-powered character articles for all remaining characters
 * Runs in parallel batches of 5 to stay within rate limits
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL
  ? `${process.env.BUILT_IN_FORGE_API_URL.replace(/\/$/, '')}/v1/chat/completions`
  : 'https://forge.manus.im/v1/chat/completions';
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const BATCH_SIZE = 5; // concurrent LLM calls per batch
const DELAY_BETWEEN_BATCHES_MS = 1000; // 1s pause between batches

function characterNameToSlug(name) {
  return name.toLowerCase().replace(/[()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function invokeLLM(messages, responseFormat) {
  const payload = {
    model: 'gemini-2.5-flash',
    messages,
    max_tokens: 32768,
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

async function getRemainingCharacters(conn) {
  const [rows] = await conn.query(`
    SELECT mc.characterName, COUNT(*) as cardCount
    FROM marvel_cards mc
    LEFT JOIN character_content cc ON mc.characterName = cc.characterName
    WHERE mc.characterName IS NOT NULL AND mc.characterName != ''
      AND (cc.characterName IS NULL OR cc.status = 'error')
    GROUP BY mc.characterName
    ORDER BY COUNT(*) DESC
  `);
  return rows;
}

async function getCardContext(conn, characterName) {
  const [rows] = await conn.query(`
    SELECT DISTINCT cs.name as setName, mc.cardType
    FROM marvel_cards mc
    JOIN card_sets cs ON mc.setId = cs.id
    WHERE mc.characterName = ?
  `, [characterName]);
  const setNames = [...new Set(rows.map(r => r.setName).filter(Boolean))];
  const cardTypes = [...new Set(rows.map(r => r.cardType).filter(Boolean))];
  return { setNames, cardTypes };
}

async function generateForCharacter(conn, characterName, cardCount) {
  const slug = characterNameToSlug(characterName);
  const { setNames, cardTypes } = await getCardContext(conn, characterName);

  const response = await invokeLLM(
    [
      {
        role: 'system',
        content: `You are a veteran Marvel trading card collector and comics historian writing for "Northland Legendary Finds" — a premium card shop run by collectors who've been in the hobby since 1993. Write like a knowledgeable friend at a card show: passionate, specific, and real. Weave in the Northland Legendary Finds brand name naturally 2-3 times. Use Markdown formatting with ## headers, bold text, and organized sections. Do NOT use images or links.`
      },
      {
        role: 'user',
        content: `Write a comprehensive 1000-1200 word article about the Marvel character "${characterName}". This character appears on ${cardCount} trading cards across these sets: ${setNames.join(', ')}. Card types include: ${cardTypes.join(', ')}.

Structure the article with these sections:
## Origin Story & First Appearance
Cover their comic book origins, first appearance issue, and creators.

## Powers & Abilities
Detail their superpowers, skills, and notable abilities.

## Key Story Arcs & Moments
Highlight 3-5 of their most important comic storylines or MCU moments.

## MCU Appearances
If applicable, cover their Marvel Cinematic Universe appearances and portrayal.

## Trading Card Legacy
Discuss their presence in Marvel trading cards, why collectors value cards featuring this character, and mention they appear in ${cardCount} cards across ${setNames.length} sets in the Northland Legendary Finds collection including ${setNames.slice(0, 3).join(', ')}.

## Why Collectors Love ${characterName}
End with why this character is beloved by both fans and card collectors.

Also provide:
1. A meta description (150-160 characters) for SEO
2. Key facts as JSON: {"realName": "...", "firstAppearance": "...", "creators": "...", "teams": ["..."], "notablePowers": ["..."]}

Format the response as JSON with these fields:
- "article": the full markdown article
- "metaDescription": the SEO meta description
- "keyFacts": the key facts object`
      }
    ],
    {
      type: 'json_schema',
      json_schema: {
        name: 'character_content',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            article: { type: 'string', description: 'Full markdown article, 1000-1200 words' },
            metaDescription: { type: 'string', description: 'SEO meta description, 150-160 chars' },
            keyFacts: {
              type: 'object',
              properties: {
                realName: { type: 'string' },
                firstAppearance: { type: 'string' },
                creators: { type: 'string' },
                teams: { type: 'array', items: { type: 'string' } },
                notablePowers: { type: 'array', items: { type: 'string' } },
              },
              required: ['realName', 'firstAppearance', 'creators', 'teams', 'notablePowers'],
              additionalProperties: false,
            },
          },
          required: ['article', 'metaDescription', 'keyFacts'],
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
    'SELECT id FROM character_content WHERE slug = ?', [slug]
  );

  if (existing.length > 0) {
    await conn.query(
      `UPDATE character_content SET historyMarkdown = ?, metaDescription = ?, keyFacts = ?, status = 'generated', updatedAt = NOW() WHERE id = ?`,
      [parsed.article, parsed.metaDescription, JSON.stringify(parsed.keyFacts), existing[0].id]
    );
  } else {
    await conn.query(
      `INSERT INTO character_content (characterName, slug, historyMarkdown, metaDescription, keyFacts, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 'generated', NOW(), NOW())`,
      [characterName, slug, parsed.article, parsed.metaDescription, JSON.stringify(parsed.keyFacts)]
    );
  }

  return parsed;
}

async function main() {
  console.log('=== Batch Character Article Generator ===');
  console.log(`API URL: ${FORGE_API_URL}`);
  console.log(`Batch size: ${BATCH_SIZE}`);

  const conn = await getConnection();
  const remaining = await getRemainingCharacters(conn);
  console.log(`\nCharacters remaining: ${remaining.length}`);

  if (remaining.length === 0) {
    console.log('All characters already have generated content!');
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

    console.log(`\n--- Batch ${batchNum}/${totalBatches} (${batch.map(c => c.characterName).join(', ')}) ---`);

    const results = await Promise.allSettled(
      batch.map(char => generateForCharacter(conn, char.characterName, char.cardCount))
    );

    for (let j = 0; j < results.length; j++) {
      const charName = batch[j].characterName;
      if (results[j].status === 'fulfilled') {
        completed++;
        console.log(`  ✓ ${charName} (${completed}/${remaining.length})`);
      } else {
        errors++;
        console.error(`  ✗ ${charName}: ${results[j].reason?.message?.slice(0, 100)}`);
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const rate = (completed / (elapsed / 60)).toFixed(1);
    const eta = completed > 0 ? (((remaining.length - completed - errors) / (completed / (elapsed / 1))) / 60).toFixed(0) : '?';
    console.log(`  Progress: ${completed + errors}/${remaining.length} | Rate: ${rate}/min | ETA: ${eta}min | Errors: ${errors}`);

    // Pause between batches to avoid rate limits
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
