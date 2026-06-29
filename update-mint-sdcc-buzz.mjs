/**
 * Update all 18 Marvel Mint card buzzNotes to reference SDCC 2026 / Comic Con hype
 */
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;

const sdccBuzzNotes = [
  { id: 41, buzz: "One of only 10 Black Chromes in existence. Iron Man was THE card everyone was hunting at SDCC 2026 — this CGC 10 is the crown jewel of the Marvel Mint set." },
  { id: 42, buzz: "Thor Black Chrome CGC 8 — the God of Thunder was a standout on the SDCC 2026 show floor. Marvel Mint's stained-glass design had collectors lining up." },
  { id: 43, buzz: "ONE OF FIVE Red Chromes ever made. Mister Fantastic CGC 10 — the Fantastic Four hype at Comic Con 2026 made this card impossible to find." },
  { id: 44, buzz: "Rogue Black Chrome CGC 10 Gem Mint. X-Men dominated SDCC 2026 panels and this card was the talk of the trading card community all weekend." },
  { id: 45, buzz: "Hulk Black Chrome CGC 10. World War Hulk rumors at Comic Con 2026 sent demand for this card through the roof." },
  { id: 46, buzz: "Doctor Strange Black Chrome CGC 10. The Multiverse Saga panels at SDCC 2026 reminded everyone why Strange is a must-have in any collection." },
  { id: 47, buzz: "Blade Black Chrome CGC 7.5. The Blade MCU movie got a standing ovation at Comic Con 2026 — expect this card to climb." },
  { id: 48, buzz: "ONE OF FIVE Chrome-Red Refractors. Storm PSA 10 Gem Mint — after the X-Men SDCC 2026 reveal, Storm cards are on fire." },
  { id: 49, buzz: "ONE OF FIVE Red Refractors. Black Widow CGC 10 Pristine — the rarest grade in the set. Comic Con 2026 put a spotlight on Yelena's future and Natasha's legacy." },
  { id: 50, buzz: "Venom Black Chrome CGC 8. The symbiote saga continues — SDCC 2026 confirmed more Venom content and collectors are stacking these." },
  { id: 51, buzz: "Magneto Black Chrome CGC 10. The Master of Magnetism stole every X-Men panel at Comic Con 2026. This gem is a long-term hold." },
  { id: 52, buzz: "Daredevil Black Chrome CGC 10. Born Again hype from SDCC 2026 made Daredevil one of the hottest characters in the Marvel Mint set." },
  { id: 53, buzz: "Professor X Black Chrome CGC 9.5 Mint+. Patrick Stewart's surprise appearance at Comic Con 2026 sent X-Men card demand soaring." },
  { id: 54, buzz: "ONE OF FIVE Red Refractors. Gambit CGC 10 Gem Mint — Channing Tatum may be gone but Remy LeBeau owned SDCC 2026. This card is pure heat." },
  { id: 30001, buzz: "Spider-Man Red Refractor CGC 8.5 — the most-watched card in the entire Marvel Mint set. SDCC 2026 confirmed new Spidey projects and this card is climbing fast." },
  { id: 30002, buzz: "Wolverine Red Refractor CGC 9. After the SDCC 2026 X-Men panel, Logan cards are the hottest in the hobby. Marvel Mint's design is chef's kiss." },
  { id: 30003, buzz: "Captain America Chrome-Red Refractor PSA 10 — one of the cleanest slabs in the collection. Comic Con 2026 reminded us why Cap is forever." },
  { id: 30004, buzz: "Doctor Doom Red Refractor CGC 8.5. RDJ as Doom dominated SDCC 2026 — this is THE villain card of the year. Marvel Mint's stained-glass Doom is iconic." },
];

async function main() {
  const mysql = await import("mysql2/promise");
  const conn = await mysql.createConnection(DATABASE_URL);

  let updated = 0;
  for (const { id, buzz } of sdccBuzzNotes) {
    const [result] = await conn.execute(
      "UPDATE card_of_the_day_entries SET buzzNote = ? WHERE id = ?",
      [buzz, id]
    );
    if (result.affectedRows > 0) updated++;
  }

  console.log(`Updated ${updated} / ${sdccBuzzNotes.length} Marvel Mint buzzNotes with SDCC 2026 references.`);
  await conn.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
