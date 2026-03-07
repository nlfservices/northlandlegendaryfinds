/**
 * Import script: Marvel card sets + CGC graded cards + AGS submissions
 * Run with: node import-data.mjs
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const pool = mysql.createPool(DATABASE_URL);
const db = drizzle(pool);

// ============================================================
// 1. Import Marvel Sets from scraped JSON
// ============================================================
async function importMarvelSets() {
  console.log('\n=== Importing Marvel Sets ===');
  const data = JSON.parse(fs.readFileSync('/home/ubuntu/all-marvel-cards-data.json', 'utf-8'));
  
  // Clear existing data
  await pool.execute('DELETE FROM marvel_cards');
  await pool.execute('DELETE FROM marvel_sets');
  
  // Import sets
  for (const s of data.sets) {
    const slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    await pool.execute(
      `INSERT INTO marvel_sets (sourceId, name, shortName, slug, releaseYear, totalCards) VALUES (?, ?, ?, ?, ?, ?)`,
      [s.id, s.name, s.shortName, slug, s.releaseYear, s.totalCards]
    );
    console.log(`  Set: ${s.name} (${s.totalCards} cards)`);
  }
  
  // Get the inserted set IDs mapped by sourceId
  const [sets] = await pool.execute('SELECT id, sourceId FROM marvel_sets');
  const setIdMap = {};
  for (const s of sets) {
    setIdMap[s.sourceId] = s.id;
  }
  
  // Import cards for each set
  let totalCards = 0;
  for (const [sourceSetId, cards] of Object.entries(data.cards_by_set)) {
    const setId = setIdMap[parseInt(sourceSetId)];
    if (!setId) {
      console.log(`  WARNING: No set found for sourceId ${sourceSetId}`);
      continue;
    }
    
    let sortOrder = 0;
    for (const card of cards) {
      await pool.execute(
        `INSERT INTO marvel_cards (setId, cardNumber, characterName, cardType, parallels, rarity, sourceId, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [setId, card.cardNumber, card.characterName, card.cardType || 'Base', card.parallels || null, card.rarity || null, card.id, sortOrder++]
      );
      totalCards++;
    }
    console.log(`  Imported ${cards.length} cards for set ${sourceSetId}`);
  }
  
  console.log(`  TOTAL: ${totalCards} cards imported`);
  return setIdMap;
}

// ============================================================
// 2. Parse CGC CSV files and import graded cards
// ============================================================
function parseCGCCardDescription(desc) {
  // Example: "Marvel English Doctor Doom 4 2025 Marvel Comic Book Heroes Golden Anniversary(2025) Purple & Gold Lava Refractor (# to 75) "
  // Example: "Marvel English Black Panther 79 2025 Marvel Studios Chrome (2025 Topps) Orange Geometric Refractor (# to 25) "
  // Example: "Marvel English Adam Kubert SA-AD 2025 Marvel Comic Book Heroes Golden Anniversary(2025) Autos Gold Flake Shimmer Refractor (# to 24)"
  
  const result = {
    cardName: '',
    cardNumber: '',
    cardSet: '',
    subset: '',
    parallel: '',
    numberedTo: null,
  };
  
  // Remove "Marvel English " prefix
  let d = desc.trim().replace(/^Marvel\s+English\s+/i, '');
  
  // Extract "# to XX" numbering
  const numMatch = d.match(/\(#\s*to\s*(\d+)\)\s*/);
  if (numMatch) {
    result.numberedTo = parseInt(numMatch[1]);
    d = d.replace(numMatch[0], '').trim();
  }
  
  // Try to find the set year pattern "2025 Marvel..." or "2025 Topps..."
  // The card number is right before the year
  const setPatterns = [
    /^(.+?)\s+(\S+)\s+(2025\s+Marvel\s+Studios\s+Chrome\s*\(2025\s+Topps\))\s*(.*)/i,
    /^(.+?)\s+(\S+)\s+(2025\s+Marvel\s+Comic\s+Book\s+Heroes\s+Golden\s+Anniversary\s*\(2025\))\s*(.*)/i,
    /^(.+?)\s+(\S+)\s+(2025\s+Marvel\s+Comic\s+Book\s+Heroes\s*\(2025\))\s*(.*)/i,
    /^(.+?)\s+(\S+)\s+(2025\s+Topps\s+Chrome\s+Marvel\s*(?:\(2025\))?)\s*(.*)/i,
    /^(.+?)\s+(\S+)\s+(2025\s+Topps\s+Chrome\s*(?:\(2025\))?)\s*(.*)/i,
    /^(.+?)\s+(\S+)\s+(2025\s+Marvel\s+Mint\s*(?:\(2025\))?)\s*(.*)/i,
    /^(.+?)\s+(\S+)\s+(2025\s+Marvel\s+Sapphire\s*(?:\(2025\))?)\s*(.*)/i,
    /^(.+?)\s+(\S+)\s+(2025\s+Marvel\s+Studios\s+Sapphire\s*(?:\(2025\))?)\s*(.*)/i,
    /^(.+?)\s+(\S+)\s+(2025\s+Marvel\s+Studios\s*(?:\(2025\))?)\s*(.*)/i,
    /^(.+?)\s+(\S+)\s+(2025\s+.+?)$/i,
  ];
  
  for (const pattern of setPatterns) {
    const match = d.match(pattern);
    if (match) {
      result.cardName = match[1].trim();
      result.cardNumber = match[2].trim();
      
      let setAndRest = match[3].trim();
      let afterSet = match[4] ? match[4].trim() : '';
      
      // Clean up set name
      result.cardSet = setAndRest.replace(/\s*\(2025(?:\s+Topps)?\)\s*/g, '').trim();
      
      // The afterSet contains subset + parallel info
      if (afterSet) {
        // Try to separate subset from parallel
        // Common patterns: "Snap Variation Orange Refractor", "Autos Gold Flake Shimmer Refractor"
        // Subset patterns: "Golden Anniversary", "Snap Variation", "Base"
        const subsetPatterns = [
          /^(Golden\s+Anniversary)\s+(.*)/i,
          /^(Snap\s+Variation)\s+(.*)/i,
          /^(Autos?)\s+(.*)/i,
          /^(Base)\s+(.*)/i,
          /^(Indestructible)\s+(.*)/i,
          /^(Air\s+Marvel)\s+(.*)/i,
          /^(Avengers\s+Infinity)\s+(.*)/i,
          /^(Classic\s+Comic\s+Book\s+Covers)\s+(.*)/i,
          /^(Future\s+Stars)\s+(.*)/i,
          /^(Galactic\s+Legends)\s+(.*)/i,
          /^(Iron\s+Man\s+Gold)\s+(.*)/i,
          /^(Marvel\s+Anniversaries)\s+(.*)/i,
          /^(Marvel\s+Icons)\s+(.*)/i,
          /^(Marvel\s+Reflections)\s+(.*)/i,
          /^(X\s+Men\s+Giant\s+Size)\s+(.*)/i,
          /^(Sapphire\s+Selections)\s+(.*)/i,
          /^(Infinite\s+Sapphire)\s+(.*)/i,
        ];
        
        let foundSubset = false;
        for (const sp of subsetPatterns) {
          const sm = afterSet.match(sp);
          if (sm) {
            result.subset = sm[1].trim();
            result.parallel = sm[2].trim();
            foundSubset = true;
            break;
          }
        }
        
        if (!foundSubset) {
          // Everything is the parallel
          result.parallel = afterSet;
        }
      }
      
      break;
    }
  }
  
  // If we didn't match any pattern, try a simpler approach
  if (!result.cardName && !result.cardSet) {
    // Just grab what we can
    result.cardName = d.substring(0, 50);
    result.cardSet = 'Unknown';
  }
  
  return result;
}

function parseGrade(gradeStr) {
  if (!gradeStr) return { grade: null, gradeNumeric: null };
  const g = gradeStr.trim();
  if (g === 'GEM MINT 10') return { grade: 'GEM MINT 10', gradeNumeric: 10.0 };
  if (g === 'PRISTINE 10') return { grade: 'PRISTINE 10', gradeNumeric: 10.0 };
  const num = parseFloat(g);
  if (!isNaN(num)) return { grade: g, gradeNumeric: num };
  return { grade: g, gradeNumeric: null };
}

async function importCGCCards() {
  console.log('\n=== Importing CGC Graded Cards ===');
  
  const cgcFiles = [
    { file: '/home/ubuntu/upload/CGC1A.csv', batchId: 'CGC1A' },
    { file: '/home/ubuntu/upload/CGC2A.csv', batchId: 'CGC2A' },
    { file: '/home/ubuntu/upload/CGC3A-shippingMonday.csv', batchId: 'CGC3A' },
    { file: '/home/ubuntu/upload/CGC4A-.csv', batchId: 'CGC4A' },
    { file: '/home/ubuntu/upload/CGC5A-.csv', batchId: 'CGC5A' },
  ];
  
  // Clear existing CGC graded cards
  await pool.execute("DELETE FROM graded_cards WHERE gradingCompany = 'CGC'");
  
  let totalImported = 0;
  let totalErrors = 0;
  
  for (const { file, batchId } of cgcFiles) {
    console.log(`\n  Processing ${batchId} (${path.basename(file)})...`);
    const content = fs.readFileSync(file, 'utf-8').replace(/^\uFEFF/, ''); // Remove BOM
    const lines = content.split('\n').filter(l => l.trim());
    
    // Skip header
    let batchCount = 0;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      
      // Parse CSV (handle quoted fields)
      const fields = [];
      let current = '';
      let inQuotes = false;
      for (const ch of line) {
        if (ch === '"') {
          inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
          fields.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
      fields.push(current.trim());
      
      if (fields.length < 8) continue;
      
      const invoiceNum = fields[0];
      const status = fields[1];
      const received = fields[2];
      const shipped = fields[3];
      const lineItem = fields[4];
      const certNumber = fields[5];
      const cardDesc = fields[6];
      const gradeStr = fields[7];
      const autoGrade = fields[8] || null;
      const errorType = fields[9] || null;
      
      if (!cardDesc) continue;
      
      const parsed = parseCGCCardDescription(cardDesc);
      const { grade, gradeNumeric } = parseGrade(gradeStr);
      
      // Map status
      let dbStatus = 'submitted';
      if (status === 'Shipped') dbStatus = 'shipped';
      else if (status === 'Delivered') dbStatus = 'delivered';
      else if (status === 'Received') dbStatus = 'received';
      else if (status === 'Grading') dbStatus = 'grading';
      
      // Parse dates
      let receivedDate = null;
      let shippedDate = null;
      if (received) {
        const [m, d, y] = received.split('/');
        receivedDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
      if (shipped) {
        const [m, d, y] = shipped.split('/');
        shippedDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
      
      try {
        await pool.execute(
          `INSERT INTO graded_cards (gradingCompany, grade, gradeNumeric, autographGrade, cardName, cardNumber, cardSet, subset, parallel, numberedTo, certNumber, invoiceNumber, lineItem, batchId, status, receivedDate, shippedDate, errorType) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ['CGC', grade, gradeNumeric, autoGrade || null, parsed.cardName, parsed.cardNumber, parsed.cardSet, parsed.subset || null, parsed.parallel || null, parsed.numberedTo, certNumber, invoiceNum, lineItem, batchId, dbStatus, receivedDate, shippedDate, errorType || null]
        );
        batchCount++;
        totalImported++;
      } catch (err) {
        totalErrors++;
        if (totalErrors <= 5) {
          console.log(`    ERROR on line ${i}: ${err.message}`);
          console.log(`    Fields: ${JSON.stringify(fields.slice(0, 8))}`);
        }
      }
    }
    
    console.log(`  ${batchId}: ${batchCount} cards imported`);
  }
  
  console.log(`\n  CGC TOTAL: ${totalImported} cards imported, ${totalErrors} errors`);
}

// ============================================================
// 3. Parse AGS PDF files and import submissions
// ============================================================
function parseAGSCardLine(text) {
  // AGS format from pdftotext:
  // "4166149Winter Soldier"
  // "COMIC BOOK HEROES 2000's Gold Atomic"
  // "2025 MARVEL TOPPS 2025 TOPPS MARVEL COMIC BOOK HEROES 1975 GOLDEN ANNIVERSARY 98"
  // 
  // Pattern: ID + Character Name on first line
  // Parallel info on second line
  // Set info + card number on third line
  
  return text;
}

async function importAGSCards() {
  console.log('\n=== Importing AGS Submissions ===');
  
  const agsFiles = [
    { file: '/home/ubuntu/upload/AGS1.pdf', batchId: 'AGS1' },
    { file: '/home/ubuntu/upload/AGS2.pdf', batchId: 'AGS2' },
    { file: '/home/ubuntu/upload/AGS3.pdf', batchId: 'AGS3' },
    { file: '/home/ubuntu/upload/AGS4.pdf', batchId: 'AGS4' },
    { file: '/home/ubuntu/upload/AGS5.pdf', batchId: 'AGS5' },
    { file: '/home/ubuntu/upload/AGS6.pdf', batchId: 'AGS6' },
  ];
  
  // Clear existing AGS graded cards
  await pool.execute("DELETE FROM graded_cards WHERE gradingCompany = 'AGS'");
  
  let totalImported = 0;
  
  for (const { file, batchId } of agsFiles) {
    console.log(`\n  Processing ${batchId} (${path.basename(file)})...`);
    
    // Extract text from PDF
    let text;
    try {
      text = execSync(`pdftotext "${file}" - 2>/dev/null`, { encoding: 'utf-8' });
    } catch (e) {
      console.log(`    ERROR: Could not extract text from ${file}`);
      continue;
    }
    
    // Extract submission number
    const subMatch = text.match(/Submission\s*#:\s*(\S+)/);
    const submissionNum = subMatch ? subMatch[1] : batchId;
    
    // Extract number of cards
    const numMatch = text.match(/No\.\s*of\s*Cards:\s*(\d+)/);
    const expectedCards = numMatch ? parseInt(numMatch[1]) : 0;
    console.log(`    Submission: ${submissionNum}, Expected cards: ${expectedCards}`);
    
    // Parse card entries
    // AGS PDF format has card entries like:
    // <AGS_ID><CharacterName>
    // <Parallel/Variant info>
    // <Set info> <Card Number>
    // Then quantities and prices
    
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    let batchCount = 0;
    let i = 0;
    
    // Find card entries by looking for AGS item IDs (7-digit numbers followed by character name)
    const cardPattern = /^(\d{7})([A-Z][\w\s\-\.&']+)/;
    
    while (i < lines.length) {
      const match = lines[i].match(cardPattern);
      if (match) {
        const agsItemId = match[1];
        const characterName = match[2].trim();
        
        // Next line(s) should have parallel/variant info
        let parallel = '';
        let cardSet = '';
        let cardNumber = '';
        let subset = '';
        
        // Look ahead for parallel and set info
        let j = i + 1;
        while (j < lines.length && j < i + 5) {
          const line = lines[j];
          
          // Skip quantity/price lines
          if (/^\d+$/.test(line) || /^\$/.test(line) || /^\(USD\)/.test(line)) {
            j++;
            continue;
          }
          
          // Check if this is a set line (starts with "2025 MARVEL")
          if (line.match(/^2025\s+MARVEL/i)) {
            // Parse set info: "2025 MARVEL TOPPS 2025 TOPPS CHROME 126"
            // or "2025 MARVEL TOPPS 2025 TOPPS MARVEL COMIC BOOK HEROES 1975 GOLDEN ANNIVERSARY 98"
            const setLine = line;
            
            // Extract card number (last number in the line)
            const numMatch = setLine.match(/\s+(\d+)\s*$/);
            if (numMatch) {
              cardNumber = numMatch[1];
            }
            // Also check for prefix card numbers like "S-79", "SA-AD"
            const prefixMatch = setLine.match(/\s+([A-Z]+-[A-Z0-9]+)\s*$/);
            if (prefixMatch) {
              cardNumber = prefixMatch[1];
            }
            
            // Extract set name
            if (setLine.includes('COMIC BOOK HEROES')) {
              cardSet = '2025 Topps Comic Book Heroes';
              if (setLine.includes('GOLDEN ANNIVERSARY')) subset = 'Golden Anniversary';
              else if (setLine.includes('1975')) subset = 'Comic Book Heroes 1975';
              else if (setLine.includes('1976')) subset = 'Comic Book Heroes 1976';
              else if (setLine.includes('2025')) subset = 'Comic Book Heroes 2025';
            } else if (setLine.includes('STUDIOS') && setLine.includes('SAPPHIRE')) {
              cardSet = '2025 Topps Marvel Studios Sapphire';
            } else if (setLine.includes('STUDIOS') && setLine.includes('CHROME')) {
              cardSet = '2025 Marvel Studios Chrome';
            } else if (setLine.includes('STUDIOS')) {
              cardSet = '2025 Topps Marvel Studios';
            } else if (setLine.includes('SAPPHIRE')) {
              cardSet = '2025 Topps Marvel Sapphire';
            } else if (setLine.includes('CHROME')) {
              cardSet = '2025 Topps Chrome';
            } else if (setLine.includes('MINT')) {
              cardSet = '2025 Topps Marvel Mint';
            }
            
            j++;
            break;
          }
          
          // Check if this is an AGS page header/footer
          if (line.includes('AGS Submissions') || line.includes('Page Ave') || line.includes('hey@agscard.com') || line === submissionNum) {
            j++;
            continue;
          }
          
          // This should be parallel/variant info
          if (!parallel && !line.match(/^\d{7}/)) {
            parallel = line;
            
            // Try to extract subset from parallel
            if (parallel.includes('Golden Anniversary')) {
              subset = 'Golden Anniversary';
            } else if (parallel.startsWith('Base ')) {
              subset = 'Base';
              parallel = parallel.replace(/^Base\s+/, '');
            } else if (parallel.startsWith('Snap Variation')) {
              subset = 'Snap Variation';
              parallel = parallel.replace(/^Snap Variation\s+/, '');
            }
          }
          
          j++;
        }
        
        // Extract numbered-to from parallel
        let numberedTo = null;
        const numToMatch = parallel.match(/\(#\s*to\s*(\d+)\)/);
        if (numToMatch) {
          numberedTo = parseInt(numToMatch[1]);
          parallel = parallel.replace(numToMatch[0], '').trim();
        }
        
        if (characterName) {
          try {
            await pool.execute(
              `INSERT INTO graded_cards (gradingCompany, grade, gradeNumeric, cardName, cardNumber, cardSet, subset, parallel, numberedTo, certNumber, invoiceNumber, batchId, status) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              ['AGS', null, null, characterName, cardNumber || null, cardSet || null, subset || null, parallel || null, numberedTo, agsItemId, submissionNum, batchId, 'submitted']
            );
            batchCount++;
            totalImported++;
          } catch (err) {
            if (totalImported < 5) {
              console.log(`    ERROR: ${err.message}`);
            }
          }
        }
        
        i = j;
      } else {
        i++;
      }
    }
    
    console.log(`  ${batchId}: ${batchCount} cards imported (expected ${expectedCards})`);
  }
  
  console.log(`\n  AGS TOTAL: ${totalImported} cards imported`);
}

// ============================================================
// Main
// ============================================================
async function main() {
  try {
    console.log('Starting data import...');
    
    await importMarvelSets();
    await importCGCCards();
    await importAGSCards();
    
    // Print summary
    const [marvelSetCount] = await pool.execute('SELECT COUNT(*) as count FROM marvel_sets');
    const [marvelCardCount] = await pool.execute('SELECT COUNT(*) as count FROM marvel_cards');
    const [gradedCount] = await pool.execute('SELECT COUNT(*) as count FROM graded_cards');
    const [cgcCount] = await pool.execute("SELECT COUNT(*) as count FROM graded_cards WHERE gradingCompany = 'CGC'");
    const [agsCount] = await pool.execute("SELECT COUNT(*) as count FROM graded_cards WHERE gradingCompany = 'AGS'");
    
    console.log('\n=== IMPORT SUMMARY ===');
    console.log(`Marvel Sets: ${marvelSetCount[0].count}`);
    console.log(`Marvel Cards (encyclopedia): ${marvelCardCount[0].count}`);
    console.log(`Graded Cards Total: ${gradedCount[0].count}`);
    console.log(`  CGC: ${cgcCount[0].count}`);
    console.log(`  AGS: ${agsCount[0].count}`);
    
    // Show grade distribution for CGC
    const [grades] = await pool.execute("SELECT grade, COUNT(*) as count FROM graded_cards WHERE gradingCompany = 'CGC' GROUP BY grade ORDER BY count DESC");
    console.log('\nCGC Grade Distribution:');
    for (const g of grades) {
      console.log(`  ${g.grade || 'N/A'}: ${g.count}`);
    }
    
    await pool.end();
    console.log('\nDone!');
  } catch (err) {
    console.error('Fatal error:', err);
    await pool.end();
    process.exit(1);
  }
}

main();
