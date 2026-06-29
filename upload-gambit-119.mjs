/**
 * Upload Gambit #119 Marvel Mint Red Refractor CGC 10 Gem Mint
 * and update the existing DB entry (Aug 21 slot).
 */
import "dotenv/config";
import fs from "fs";

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, "");
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

async function uploadToS3(localPath, key) {
  const fileBuffer = fs.readFileSync(localPath);
  const normalizedKey = key.replace(/^\/+/, "");
  const uploadUrl = `${FORGE_API_URL}/v1/storage/upload?path=${encodeURIComponent(normalizedKey)}`;
  const fileName = normalizedKey.split("/").pop() || normalizedKey;
  const blob = new Blob([fileBuffer], { type: "image/webp" });
  const form = new FormData();
  form.append("file", blob, fileName);

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${FORGE_API_KEY}` },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  return json.url;
}

async function main() {
  const localPath = "/home/ubuntu/upload/#119_front.webp";
  const cdnKey = "cotd/mint-gambit-119-red-cgc10.webp";

  if (!fs.existsSync(localPath)) {
    console.error("File not found:", localPath);
    process.exit(1);
  }

  console.log("Uploading Gambit #119...");
  const url = await uploadToS3(localPath, cdnKey);
  console.log("Uploaded:", url);

  const mysql = await import("mysql2/promise");
  const conn = await mysql.createConnection(DATABASE_URL);

  const [result] = await conn.execute(
    `UPDATE card_of_the_day_entries
     SET frontImageUrl = ?, gradingCompany = ?, cgcGrade = ?, parallelType = ?,
         printRun = ?, buzzNote = ?, estimatedPrice = ?
     WHERE cardNumber = '#119' AND setName = 'mint'`,
    [
      url,
      "CGC",
      "10",
      "Red Refractor",
      5,
      "Marvel Mint Red Refractor #119 — Gambit CGC 10 Gem Mint. One of only FIVE ever made. Remy LeBeau is charging up for the MCU.",
      "~$150–250",
    ]
  );

  console.log(`Updated ${result.affectedRows} row(s) for Gambit #119`);
  await conn.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
