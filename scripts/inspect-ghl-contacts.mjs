import dotenv from "dotenv";
dotenv.config();

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const apiKey = process.env.GHL_API_KEY;
const locationId = process.env.GHL_LOCATION_ID;

if (!apiKey || !locationId) {
  console.error("❌ GHL_API_KEY or GHL_LOCATION_ID not set");
  process.exit(1);
}

async function fetchContacts(limit = 100) {
  const params = new URLSearchParams({
    locationId,
    limit: String(limit),
  });

  const response = await fetch(`${GHL_API_BASE}/contacts/?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: GHL_API_VERSION,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`❌ GHL API error (${response.status}): ${text}`);
    process.exit(1);
  }

  const data = await response.json();
  return data.contacts || [];
}

async function main() {
  console.log("🔍 Fetching GHL contacts...\n");
  const contacts = await fetchContacts(100);

  console.log(`📊 Total contacts fetched: ${contacts.length}\n`);

  if (contacts.length === 0) {
    console.log("No contacts found.");
    return;
  }

  // Show all unique field keys across all contacts
  const allKeys = new Set();
  contacts.forEach(c => Object.keys(c).forEach(k => allKeys.add(k)));
  console.log("📋 Fields present in GHL contacts:");
  [...allKeys].forEach(k => console.log(`  - ${k}`));

  console.log("\n📝 Sample of first 5 contacts:\n");
  contacts.slice(0, 5).forEach((c, i) => {
    console.log(`--- Contact ${i + 1} ---`);
    console.log(`  Name: ${c.firstName || ""} ${c.lastName || ""}`.trim() || "  Name: (none)");
    console.log(`  Email: ${c.email || "(none)"}`);
    console.log(`  Phone: ${c.phone || "(none)"}`);
    console.log(`  Source: ${c.source || "(none)"}`);
    console.log(`  Tags: ${(c.tags || []).join(", ") || "(none)"}`);
    console.log(`  Date Added: ${c.dateAdded || "(none)"}`);
    if (c.customFields && c.customFields.length > 0) {
      console.log(`  Custom Fields:`);
      c.customFields.forEach(f => console.log(`    ${f.id || f.key}: ${f.value}`));
    }
    console.log();
  });

  // Summary stats
  const withEmail = contacts.filter(c => c.email).length;
  const withPhone = contacts.filter(c => c.phone).length;
  const withTags = contacts.filter(c => c.tags && c.tags.length > 0).length;
  const sources = {};
  contacts.forEach(c => {
    const s = c.source || "unknown";
    sources[s] = (sources[s] || 0) + 1;
  });

  console.log("📈 Data Quality Summary:");
  console.log(`  With email: ${withEmail}/${contacts.length}`);
  console.log(`  With phone: ${withPhone}/${contacts.length}`);
  console.log(`  With tags: ${withTags}/${contacts.length}`);
  console.log("\n  Sources breakdown:");
  Object.entries(sources).forEach(([s, count]) => console.log(`    ${s}: ${count}`));
}

main().catch(console.error);
