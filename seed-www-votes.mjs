import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

async function seedVotes() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  const articleIds = [
    1410001, // wolverine-vs-captain-america
    1410002, // storm-vs-thor
    1410003, // magneto-vs-iron-man
    1410004, // phoenix-vs-scarlet-witch
    1410005, // hulk-vs-colossus
    1410006, // cyclops-vs-captain-america
    1410007, // deadpool-vs-spider-man
    1410008, // doctor-doom-vs-magneto
    1410009, // black-panther-vs-wolverine
    1410010, // thor-vs-hulk-rematch
  ];

  const reactions = ['fire', 'loved', 'meh', 'thumbsdown'];
  // Weight heavily toward fire and loved for Who Would Win articles
  const reactionWeights = [0.45, 0.35, 0.12, 0.08];

  function getRandomReaction() {
    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < reactions.length; i++) {
      cumulative += reactionWeights[i];
      if (rand <= cumulative) return reactions[i];
    }
    return reactions[0];
  }

  function getRandomVoteCount() {
    // Random between 105-135
    return Math.floor(Math.random() * 31) + 105;
  }

  let totalInserted = 0;

  for (const articleId of articleIds) {
    const voteCount = getRandomVoteCount();
    const values = [];

    for (let i = 0; i < voteCount; i++) {
      const visitorId = `seed_www_${crypto.randomUUID()}`;
      const reaction = getRandomReaction();
      values.push(`(${articleId}, '${reaction}', '${visitorId}')`);
    }

    // Insert in batches of 50
    for (let i = 0; i < values.length; i += 50) {
      const batch = values.slice(i, i + 50);
      await connection.execute(
        `INSERT INTO article_votes (articleId, reaction, visitorId) VALUES ${batch.join(', ')}`
      );
    }

    totalInserted += voteCount;
    console.log(`Article ${articleId}: seeded ${voteCount} votes`);
  }

  console.log(`\nTotal votes seeded: ${totalInserted}`);
  await connection.end();
}

seedVotes().catch(console.error);
