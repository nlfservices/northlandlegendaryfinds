import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const updates = [
  { id: 985, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s174-leila-LmBDnNdRUB5LM7iFF96BpD.webp' },
  { id: 986, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s175-daredevil-JBq7sWSkvp4i96jWTnSjoG.webp' },
  { id: 987, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s176-punisher-83UPa7wUt8KohWGkLAGdjt.webp' },
  { id: 988, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s177-daniel-blake-NaCLfjUBm4NrCEzjJS7FBj.webp' },
  { id: 989, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s178-kingpin-VynExNJkWTp7qDN2iRR5TQ.webp' },
  { id: 990, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s179-vanessa-EQ8jJdn58Lkmwd6EaLhXJQ.webp' },
  { id: 992, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s180-karen-evLHfLiU6DunR6CVh2YEcG.webp' },
  { id: 993, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s181-foggy-eUMq6i4bCbxT9FeH92VRqG.webp' },
  { id: 1004, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s191-mel-5iWc9Wtdkumotp4oEKaXsW.webp' },
  { id: 1005, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s192-void-4ppdq5JwKsA5FcPRnVbCFA.webp' },
  { id: 1006, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s193-mephisto-MksiNhsn5vErSjTYXa28oY.webp' },
  { id: 1007, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s194-mrfantastic-ZKZ9CdB2r3U6bLbgvqMdVj.webp' },
  { id: 1008, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s195-invisible-woman-U8S4JtKn6HrHKjGQ5fPiRN.webp' },
  { id: 1009, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s196-human-torch-fhmx3sZSXcpMQcaVzfBeGc.webp' },
  { id: 1010, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s197-thing-ZiibrnHCiqWfkcSPMokUAU.webp' },
  { id: 1011, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s198-silver-surfer-HnLKtpZ4fbonTfyXajnvRq.webp' },
  { id: 1012, url: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/snap-s199-herbie-mYquvGkhWbA8GLQpqUgQ6D.webp' },
];

let updated = 0;
for (const u of updates) {
  const [result] = await conn.execute('UPDATE marvel_cards SET imageUrl = ? WHERE id = ?', [u.url, u.id]);
  updated += result.affectedRows;
}
console.log(`Snap batch 18: ${updated} rows updated`);

// Check remaining
const [remaining] = await conn.execute(
  "SELECT COUNT(*) as cnt FROM marvel_cards s JOIN marvel_cards b ON b.setId = 5 AND b.cardType = 'Base' AND CONCAT('S-', b.cardNumber) = s.cardNumber WHERE s.setId = 5 AND s.cardType = 'THE SNAP VARIATION' AND s.imageUrl = b.imageUrl"
);
console.log(`Remaining snap cards sharing base image: ${remaining[0].cnt}`);

// Also check total cards with no image
const [noImage] = await conn.execute("SELECT COUNT(*) as cnt FROM marvel_cards WHERE imageUrl IS NULL OR imageUrl = ''");
console.log(`Total cards with no image: ${noImage[0].cnt}`);

// Check total unique images in Studios set
const [uniqueStudios] = await conn.execute("SELECT COUNT(DISTINCT imageUrl) as cnt FROM marvel_cards WHERE setId = 5");
console.log(`Unique images in Studios set: ${uniqueStudios[0].cnt}`);

await conn.end();
