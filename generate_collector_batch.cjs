/**
 * Generate AI images for The Collector set characters
 * Usage: node generate_collector_batch.cjs <batch_number>
 * Batch 1 = characters 1-10, Batch 2 = 11-20, etc.
 */
const mysql = require('mysql2/promise');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Characters needing new portrait images (MCU actor-inspired stylized art)
const CHARACTERS = [
  // Batch 1: MCU Perfection characters
  { name: 'Yelena Belova', prompt: 'Stylized digital portrait of a young woman with blonde hair in a tactical combat vest, confident smirk, inspired by MCU Black Widow ally, dramatic lighting, Marvel superhero art style, vibrant colors, dynamic pose, cosmic energy background' },
  { name: 'John F. Walker', prompt: 'Stylized digital portrait of a muscular man with short brown hair wearing a stars-and-stripes Captain America-style uniform with shield, stern determined expression, inspired by MCU U.S. Agent, dramatic lighting, Marvel superhero art style' },
  { name: 'Valentina Allegra de Fontaine', prompt: 'Stylized digital portrait of a sophisticated woman with dark hair in an elegant dark suit, knowing smile, inspired by MCU spy handler character, dramatic lighting, Marvel art style, dark purple and gold color scheme' },
  { name: 'Rio Vidal', prompt: 'Stylized digital portrait of a mysterious dark-haired woman with an enigmatic expression, witchy dark robes with mystical energy, inspired by MCU Agatha All Along character, dramatic purple and green magical lighting, Marvel art style' },
  { name: 'G\'iah', prompt: 'Stylized digital portrait of a young woman with light hair and alien Skrull features, green-tinged skin undertones, determined expression, inspired by MCU Secret Invasion character, dramatic lighting, Marvel superhero art style, cosmic background' },
  { name: 'Zuri', prompt: 'Stylized digital portrait of a distinguished older African man with grey beard wearing Wakandan tribal robes and ceremonial garments, wise expression, inspired by MCU Wakandan elder, dramatic lighting, Marvel art style, vibrant African patterns' },
  { name: 'Erik Killmonger', prompt: 'Stylized digital portrait of a muscular African American man with short hair and ritual scarification marks on torso, wearing Black Panther golden jaguar suit, fierce determined expression, inspired by MCU villain, dramatic lighting, Marvel art style' },
  { name: 'Rocket', prompt: 'Stylized digital portrait of an anthropomorphic raccoon in tactical gear with weapons, cybernetic implants, fierce expression, inspired by MCU Guardians of the Galaxy character, dramatic lighting, Marvel art style, space background' },
  { name: 'The High Evolutionary', prompt: 'Stylized digital portrait of a man in a sleek red and silver armored suit with a distinctive helmet, menacing expression, inspired by MCU Guardians Vol 3 villain, dramatic lighting, Marvel art style, laboratory background with genetic experiments' },
  { name: 'Grandmaster', prompt: 'Stylized digital portrait of an eccentric older man with blue and gold face paint, flamboyant robes, playful mischievous expression, inspired by MCU Thor Ragnarok character, dramatic lighting, Marvel art style, arena background' },
  
  // Batch 2: More MCU Perfection characters
  { name: 'Frigga', prompt: 'Stylized digital portrait of a regal older woman with golden hair in elaborate Asgardian royal robes and crown, warm maternal expression, inspired by MCU Thor mother character, dramatic lighting, Marvel art style, golden Asgardian palace background' },
  { name: 'Korg', prompt: 'Stylized digital portrait of a large friendly rock creature made of blue-grey stones, gentle expression, wearing gladiator armor, inspired by MCU Thor Ragnarok character, dramatic lighting, Marvel art style, arena background' },
  { name: 'Sif', prompt: 'Stylized digital portrait of a fierce warrior woman with long dark hair in Asgardian battle armor with sword and shield, determined expression, inspired by MCU Asgardian warrior, dramatic lighting, Marvel art style, Asgardian battlefield background' },
  { name: 'Talos', prompt: 'Stylized digital portrait of a green-skinned Skrull alien man with ridged chin and pointed ears in a dark suit, friendly expression, inspired by MCU Captain Marvel character, dramatic lighting, Marvel art style, space background' },
  { name: 'Yon-Rogg', prompt: 'Stylized digital portrait of a handsome man with slicked-back hair in teal and silver Kree warrior armor, stern commanding expression, inspired by MCU Captain Marvel villain, dramatic lighting, Marvel art style, Kree starship background' },
  { name: 'Dar-Benn', prompt: 'Stylized digital portrait of a young woman with short dark hair and blue Kree skin markings in dark Kree warrior armor, fierce expression, wielding a golden bangle weapon, inspired by MCU The Marvels villain, dramatic lighting, Marvel art style' },
  { name: 'Druig', prompt: 'Stylized digital portrait of a young man with dark hair and piercing eyes in dark Eternal armor with gold accents, mysterious brooding expression, inspired by MCU Eternals character, dramatic lighting, Marvel art style, cosmic energy background' },
  { name: 'Hope van Dyne', prompt: 'Stylized digital portrait of an athletic woman with shoulder-length brown hair in the Wasp suit with translucent wings, determined expression, inspired by MCU Ant-Man character, dramatic lighting, Marvel art style, quantum realm background' },
  { name: 'Dr. Christine Palmer', prompt: 'Stylized digital portrait of an elegant woman with auburn hair in doctor scrubs with a white coat, compassionate expression, inspired by MCU Doctor Strange character, dramatic lighting, Marvel art style, hospital with mystical portal background' },
  { name: 'Kaecilius', prompt: 'Stylized digital portrait of a man with dark cracked markings around his eyes wearing dark sorcerer robes, menacing zealot expression, inspired by MCU Doctor Strange villain, dramatic lighting, Marvel art style, dark dimension energy background' },
  
  // Batch 3: More characters
  { name: 'Mordo', prompt: 'Stylized digital portrait of a stern African man with short hair in green and brown sorcerer robes with mystical staff, disillusioned expression, inspired by MCU Doctor Strange character, dramatic lighting, Marvel art style, Kamar-Taj background' },
  { name: 'Clea', prompt: 'Stylized digital portrait of a striking woman with platinum blonde hair in purple and dark mystical robes, powerful expression, inspired by MCU Doctor Strange character, dramatic lighting, Marvel art style, dark dimension purple energy background' },
  { name: 'Maria Hill', prompt: 'Stylized digital portrait of a professional woman with dark hair in a SHIELD tactical uniform, alert focused expression, inspired by MCU Avengers character, dramatic lighting, Marvel art style, SHIELD helicarrier background' },
  { name: 'Aldrich Killian', prompt: 'Stylized digital portrait of a man with slicked-back hair in a business suit with glowing orange Extremis energy coursing through his body, sinister smile, inspired by MCU Iron Man 3 villain, dramatic lighting, Marvel art style, fiery background' },
  { name: 'Trevor Slattery', prompt: 'Stylized digital portrait of an eccentric older man with long grey hair and beard wearing theatrical robes, bewildered comedic expression, inspired by MCU Iron Man 3 and Shang-Chi character, dramatic lighting, Marvel art style' },
  { name: 'Pietro Maximoff', prompt: 'Stylized digital portrait of a young man with silver-white hair in athletic running gear with blue energy trails, cocky smirk, inspired by MCU Avengers Age of Ultron character, dramatic lighting, Marvel art style, speed blur background' },
  { name: 'Peggy Carter', prompt: 'Stylized digital portrait of a beautiful woman with 1940s vintage curled brown hair in a red hat and military uniform, determined courageous expression, inspired by MCU Captain America character, dramatic lighting, Marvel art style, WWII era background' },
  { name: 'M\'Baku', prompt: 'Stylized digital portrait of a powerful muscular African man with tribal face paint and fur-lined Jabari warrior armor, fierce proud expression, inspired by MCU Black Panther character, dramatic lighting, Marvel art style, snowy mountain background' },
  { name: 'Red Guardian', prompt: 'Stylized digital portrait of a burly bearded man in a red and white Soviet-style superhero suit with star emblem, boisterous proud expression, inspired by MCU Black Widow character, dramatic lighting, Marvel art style, Russian winter background' },
  { name: 'Cassie Lang', prompt: 'Stylized digital portrait of a young woman with brown hair in a purple and silver Stature superhero suit, brave determined expression, inspired by MCU Ant-Man character, dramatic lighting, Marvel art style, quantum realm background' },
  
  // Batch 4: More characters
  { name: 'Sylvie', prompt: 'Stylized digital portrait of a young woman with blonde hair and a broken Loki-style horned tiara in green and gold variant armor, fierce rebellious expression, inspired by MCU Loki series character, dramatic lighting, Marvel art style, TVA timeline background' },
  { name: 'Malekith', prompt: 'Stylized digital portrait of a pale elf-like creature with half-blackened face in dark armor, menacing expression, wielding the Aether red energy, inspired by MCU Thor Dark World villain, dramatic lighting, Marvel art style, dark elf realm background' },
  { name: 'Justin Hammer', prompt: 'Stylized digital portrait of a slick businessman with brown hair in an expensive suit, smug overconfident expression, inspired by MCU Iron Man 2 villain, dramatic lighting, Marvel art style, weapons expo background' },
  { name: 'Iron Monger', prompt: 'Stylized digital portrait of a massive silver and grey power armor suit with glowing blue eyes, imposing menacing stance, inspired by MCU Iron Man villain Obadiah Stane, dramatic lighting, Marvel art style, industrial factory background' },
  { name: 'Yellowjacket', prompt: 'Stylized digital portrait of a man in a sleek yellow and black armored suit with stinger weapons, menacing expression through helmet visor, inspired by MCU Ant-Man villain, dramatic lighting, Marvel art style, Pym Technologies lab background' },
  { name: 'Wenwu', prompt: 'Stylized digital portrait of a distinguished Asian man with slicked-back hair wielding ten glowing golden rings around his forearms, powerful commanding expression, inspired by MCU Shang-Chi character, dramatic lighting, Marvel art style, ancient temple background' },
  { name: 'Phil Coulson', prompt: 'Stylized digital portrait of a mild-mannered man in a dark suit and tie with SHIELD badge, calm professional expression with hint of heroism, inspired by MCU Avengers character, dramatic lighting, Marvel art style, SHIELD headquarters background' },
  { name: 'Dr. Erik Selvig', prompt: 'Stylized digital portrait of an older Scandinavian man with grey hair and glasses in a lab coat, brilliant eccentric expression, inspired by MCU Thor character, dramatic lighting, Marvel art style, astrophysics laboratory background' },
  { name: 'Ramonda', prompt: 'Stylized digital portrait of a regal African queen with elaborate traditional headdress and Wakandan royal robes, dignified powerful expression, inspired by MCU Black Panther character, dramatic lighting, Marvel art style, Wakandan throne room background' },
  { name: 'Ayesha', prompt: 'Stylized digital portrait of a golden-skinned woman with elaborate golden hair and robes, haughty regal expression, inspired by MCU Guardians of the Galaxy character, dramatic lighting, Marvel art style, golden Sovereign throne background' },
  
  // Batch 5: Last characters + Dual Autographs
  { name: 'Cosmo', prompt: 'Stylized digital portrait of a golden retriever dog in a Soviet space suit with cosmonaut helmet, friendly intelligent expression, floating in space, inspired by MCU Guardians of the Galaxy character, dramatic lighting, Marvel art style, Knowhere space station background' },
  { name: 'King Laufey', prompt: 'Stylized digital portrait of a massive blue-skinned Frost Giant king with red eyes and ice crown, menacing powerful expression, inspired by MCU Thor villain, dramatic lighting, Marvel art style, frozen Jotunheim realm background' },
  { name: 'Fandral', prompt: 'Stylized digital portrait of a dashing blonde man with a goatee in Asgardian warrior armor with a rapier sword, charming swashbuckler expression, inspired by MCU Thor character, dramatic lighting, Marvel art style, Asgardian palace background' },
  { name: 'Captain America & Hawkeye', prompt: 'Stylized digital art of two Marvel heroes side by side: Captain America in his blue suit with shield and Hawkeye with bow and arrows in purple tactical gear, heroic poses, dramatic lighting, Marvel superhero art style, battle background' },
  { name: 'The Thing & Human Torch', prompt: 'Stylized digital art of two Marvel heroes side by side: The Thing as a massive orange rock creature and Human Torch engulfed in flames flying, heroic poses, dramatic lighting, Marvel Fantastic Four art style, cosmic background' },
  { name: 'Thanos & Wanda Maximoff', prompt: 'Stylized digital art of two Marvel characters facing off: Thanos with golden Infinity Gauntlet and Wanda Maximoff with red chaos magic energy, dramatic confrontation, dramatic lighting, Marvel art style, Endgame battlefield background' },
  { name: 'Ant-Man & The Wasp', prompt: 'Stylized digital art of two Marvel heroes side by side: Ant-Man in red and silver suit and The Wasp in yellow suit with translucent wings, heroic poses, dramatic lighting, Marvel art style, quantum realm background' },
  { name: 'Mister Fantastic & Invisible Woman', prompt: 'Stylized digital art of two Marvel heroes: Mister Fantastic stretching his arms and Invisible Woman creating force fields, heroic poses in blue Fantastic Four suits, dramatic lighting, Marvel art style, cosmic background' },
];

// Show Stoppers - MCU action scene cards
const SHOW_STOPPERS = [
  { name: 'Avengers Assembled', prompt: 'Epic stylized digital art of the original six Avengers assembled in battle formation - Iron Man, Captain America, Thor, Hulk, Black Widow, Hawkeye - dramatic circular shot from Avengers 2012, cinematic Marvel art style, New York battle background' },
  { name: 'Tony Tests His Mark', prompt: 'Stylized digital art of Iron Man testing his first Mark suit in a workshop, repulsor blasts firing, sparks flying, inspired by MCU Iron Man movie, dramatic lighting, Marvel cinematic art style' },
  { name: 'An Explosive Escape', prompt: 'Stylized digital art of Iron Man flying away from a massive explosion in the desert, Mark I armor, dramatic escape scene, inspired by MCU Iron Man origin, cinematic Marvel art style, fiery explosion background' },
  { name: 'A Universal Threat Emerges', prompt: 'Stylized digital art of Thanos emerging from a cosmic portal with the Infinity Gauntlet glowing, menacing presence, inspired by MCU Avengers, dramatic purple cosmic lighting, Marvel cinematic art style' },
  { name: 'Mayhem in Monaco', prompt: 'Stylized digital art of Whiplash attacking with electric whips at a Monaco race track, cars crashing, sparks flying, inspired by MCU Iron Man 2, dramatic lighting, Marvel cinematic art style' },
  { name: 'The Battle of Wakanda', prompt: 'Stylized digital art of a massive battle in Wakanda with Black Panther, Captain America, and Wakandan warriors fighting alien Outriders, inspired by MCU Infinity War, dramatic lighting, Marvel cinematic art style' },
  { name: 'Strength of the Winter Soldier', prompt: 'Stylized digital art of the Winter Soldier with metal arm in combat, catching Captain America shield, intense fight scene, inspired by MCU Captain America, dramatic lighting, Marvel cinematic art style' },
  { name: 'Black Widow Emerges Victorious', prompt: 'Stylized digital art of Black Widow in a victorious combat pose after defeating enemies, red hair flowing, inspired by MCU Avengers, dramatic lighting, Marvel cinematic art style, destroyed facility background' },
  { name: 'Swinging Into Action', prompt: 'Stylized digital art of Spider-Man swinging through a city skyline on webs, dynamic acrobatic pose, inspired by MCU Spider-Man, dramatic lighting, Marvel cinematic art style, New York City background' },
  { name: 'Reaching For Infinity', prompt: 'Stylized digital art of multiple heroes reaching for the Infinity Gauntlet in an epic tug-of-war, inspired by MCU Endgame climax, dramatic cosmic lighting, Marvel cinematic art style' },
  { name: 'Wanda\'s Sacrifice', prompt: 'Stylized digital art of Scarlet Witch destroying the Mind Stone while holding back Thanos with red chaos magic, emotional sacrifice scene, inspired by MCU Infinity War, dramatic red and purple lighting, Marvel cinematic art style' },
  { name: 'Suiting Up For Battle', prompt: 'Stylized digital art of Iron Man in the iconic suit-up sequence, armor pieces assembling around Tony Stark, inspired by MCU, dramatic lighting with metallic reflections, Marvel cinematic art style' },
  { name: 'Thor Confronts Gorr', prompt: 'Stylized digital art of Thor wielding Mjolnir and Stormbreaker facing off against Gorr the God Butcher in shadow realm, lightning crackling, inspired by MCU Thor Love and Thunder, dramatic lighting, Marvel cinematic art style' },
  { name: 'The Marvels United', prompt: 'Stylized digital art of Captain Marvel, Ms. Marvel, and Monica Rambeau combining their powers in a trinity formation, glowing energy, inspired by MCU The Marvels, dramatic cosmic lighting, Marvel cinematic art style' },
  { name: 'Shuri Takes Up The Mantle', prompt: 'Stylized digital art of Shuri in the new Black Panther suit, powerful pose with vibranium claws, inspired by MCU Black Panther Wakanda Forever, dramatic purple and gold lighting, Marvel cinematic art style, Wakandan background' },
  { name: 'Rocket Leads The Charge', prompt: 'Stylized digital art of Rocket Raccoon leading the Guardians of the Galaxy into battle, wielding a massive gun, inspired by MCU Guardians Vol 3, dramatic lighting, Marvel cinematic art style, space battle background' },
  { name: 'Rumble on the Runway', prompt: 'Stylized digital art of the epic airport battle from Captain America Civil War, Team Cap vs Team Iron Man, heroes clashing on a runway, dramatic lighting, Marvel cinematic art style' },
  { name: 'Bargaining with Dormammu', prompt: 'Stylized digital art of Doctor Strange confronting the massive cosmic entity Dormammu in the Dark Dimension, time loop green energy, inspired by MCU Doctor Strange, dramatic mystical lighting, Marvel cinematic art style' },
  { name: 'Ego\'s Secrets Revealed', prompt: 'Stylized digital art of the living planet Ego revealing his true cosmic form to Star-Lord, massive planetary face in space, inspired by MCU Guardians Vol 2, dramatic cosmic lighting, Marvel cinematic art style' },
  { name: 'Fending Off Fenris', prompt: 'Stylized digital art of Hulk fighting the giant wolf Fenris on the Rainbow Bridge of Asgard, epic scale battle, inspired by MCU Thor Ragnarok, dramatic lightning and fire, Marvel cinematic art style' },
  { name: 'Upgrades Unleashed', prompt: 'Stylized digital art of Spider-Man in the Iron Spider suit with mechanical spider legs deployed, leaping into action, inspired by MCU Infinity War, dramatic lighting, Marvel cinematic art style' },
  { name: 'Tony Stark\'s Final Stand', prompt: 'Stylized digital art of Tony Stark with the Infinity Stones on his hand, the iconic "I am Iron Man" snap moment, inspired by MCU Endgame, dramatic golden and cosmic lighting, Marvel cinematic art style, emotional heroic moment' },
  { name: 'Earth\'s Last Hope', prompt: 'Stylized digital art of the massive Avengers Endgame final battle with portals opening and all heroes assembling, Captain America facing Thanos army, inspired by MCU, dramatic epic lighting, Marvel cinematic art style' },
  { name: 'A Legacy Lives On', prompt: 'Stylized digital art of Sam Wilson as the new Captain America with wings spread and shield raised, heroic pose against an American sky, inspired by MCU Falcon and Winter Soldier, dramatic patriotic lighting, Marvel cinematic art style' },
  { name: 'Introducing The New Avengers', prompt: 'Stylized digital art of the new generation of Avengers heroes assembled - Shang-Chi, Ms. Marvel, Kate Bishop, Yelena, and others - heroic group pose, inspired by MCU Phase 5, dramatic lighting, Marvel cinematic art style' },
];

async function generateAndUpload(prompt, filename) {
  const { generateImage } = require('./server/_core/imageGeneration.ts');
  // Actually we need to use the API directly since this is CJS
  
  const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL;
  const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;
  
  const response = await fetch(`${FORGE_URL}/image/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FORGE_KEY}`
    },
    body: JSON.stringify({
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    })
  });
  
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Image generation failed: ${response.status} ${err}`);
  }
  
  const data = await response.json();
  const imageUrl = data.data[0].url;
  
  // Download the image
  const imgResponse = await fetch(imageUrl);
  const imgBuffer = Buffer.from(await imgResponse.arrayBuffer());
  
  // Save locally
  const localPath = `/home/ubuntu/webdev-static-assets/${filename}`;
  fs.writeFileSync(localPath, imgBuffer);
  
  // Upload to CDN
  const cdnUrl = execSync(`manus-upload-file --webdev ${localPath}`, { encoding: 'utf-8' }).trim();
  
  return cdnUrl;
}

async function main() {
  const batchNum = parseInt(process.argv[2]) || 1;
  const batchSize = 10;
  
  // Combine all items
  const allItems = [...CHARACTERS, ...SHOW_STOPPERS];
  
  const startIdx = (batchNum - 1) * batchSize;
  const endIdx = Math.min(startIdx + batchSize, allItems.length);
  const batch = allItems.slice(startIdx, endIdx);
  
  console.log(`\nBatch ${batchNum}: Processing items ${startIdx + 1} to ${endIdx} of ${allItems.length}`);
  console.log(`Total batches needed: ${Math.ceil(allItems.length / batchSize)}\n`);
  
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  for (let i = 0; i < batch.length; i++) {
    const item = batch[i];
    const globalIdx = startIdx + i + 1;
    console.log(`[${globalIdx}/${allItems.length}] Generating: ${item.name}...`);
    
    try {
      const filename = `collector-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}.webp`;
      const cdnUrl = await generateAndUpload(item.prompt, filename);
      console.log(`  ✓ Generated and uploaded: ${cdnUrl.substring(0, 80)}...`);
      
      // Update all cards with this character name in The Collector set
      const [result] = await conn.query(
        "UPDATE marvel_cards SET imageUrl = ? WHERE setId = 30001 AND (characterName = ? OR characterName LIKE ?)",
        [cdnUrl, item.name, `${item.name} (%`]
      );
      console.log(`  ✓ Updated ${result.affectedRows} card(s) in database`);
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
    }
  }
  
  // Show remaining count
  const [remaining] = await conn.query(
    "SELECT COUNT(*) as cnt FROM marvel_cards WHERE setId = 30001 AND (imageUrl IS NULL OR imageUrl = '')"
  );
  console.log(`\nRemaining cards without images: ${remaining[0].cnt}`);
  
  await conn.end();
}

main().catch(console.error);
