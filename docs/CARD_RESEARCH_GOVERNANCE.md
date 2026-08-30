# Card research governance

This is the rulebook for every model that researches Marvel cards for Northland Legendary Finds. It applies to checklists, odds, serial-numbered population, and character queries. It does **not** grant write, push, or deploy rights.

## Primary vs secondary sources

**Official Topps checklist + odds from Pat are primary.** They win.

Secondary sources (hobby shops, breakers, PriceCharting, eBay, fan wikis, prior model output) may only:

- Fill gaps the official sheet does not cover, and mark those rows as unofficial.
- Flag discrepancies for Pat / Jarvis — never silently replace official data.

If official data and a secondary source disagree, keep the official value, record the discrepancy in Notes, and wait for Pat. Do not “correct” live `parallels` from memory or from another set.

## Research each set once

Research is **set-scoped**, then reused for any character.

- Build one checklist/odds table per product (year + set slug + `setId`).
- When a character is requested, slice that set table. Do not spin up an isolated character-only database.
- Zero results for a character still count. Record the zero (set, character, date, source). A silent empty answer looks like “not researched.”

## Doctor Doom serial-numbered population

**ChatGPT owns Doctor Doom serial-numbered population 2024-forward.**

- Doctor Doom and Doom 2099 are **separate** characters. Never merge counts.
- Do not rebuild the Doom population workbook unless you are explicitly assigned to audit it.
- Grok may hunt anomalies in that workbook; Grok does not replace it.

## Model roles (research)

| Model | Research job | Not |
| --- | --- | --- |
| **Grok** | Anomaly hunting (mismatched ladders, swapped setIds, blank COTD, mojibake dashes, soft 404s) | Silent data replacement |
| **Manus** | Structured tables, spreadsheets, automation of **research files** | Hosting or deploying the site; R2/DB deletes |
| **Claude** | Audit against official sheets and this rulebook | Inventing odds |
| **ChatGPT** | Master research / serial-numbered population (incl. Doom 2024-forward) | Rebuilding Doom pop unless assigned |
| **Jarvis** | Live official set layer on the site (seeds, MCU News, `mediaUrl`) | Using unofficial ladders |

Before a major research pass, check [`CURRENT_WORK.md`](../CURRENT_WORK.md) and ask whether another model is already on that set. Do not duplicate live work.

## Required fields

Every research row should be able to carry:

| Field | Meaning |
| --- | --- |
| Year | Product year |
| Set/Product | Marketing name |
| Subset | Base, insert name, autograph set, etc. |
| Character | As printed; Doom ≠ Doom 2099 |
| Card Number | Checklist number (`1`, `MA-1`, `VO-01`) |
| Card Name | If different from character |
| Parallel Name | Official parallel name |
| Serial Number / Print Run | `/5`, `1/1`, or empty if unnumbered |
| Rarity Group | e.g. Common / Refractor / Superfractor — do not invent |
| Card Type | Matches live `cardType` when known |
| Pack Odds | Pull rate (`1:6`, `5 per box`) |
| Box Odds | If the sheet gives box rates |
| Case Odds | If the sheet gives case rates |
| Hobby/Retail Format | Hobby, value box, sapphire pack, ecomm |
| Official Checklist Confirmation | yes/no/partial |
| Official Odds Confirmation | yes/no/partial |
| Source File | Filename Pat provided |
| Source URL | If any; official over unofficial |
| Confidence | high / medium / low |
| Research Status | not started / in progress / complete / blocked |
| Notes | Discrepancies, zeros, “do not invent” |

Live site storage for pull odds is `marvel_cards.parallels` as `Name · 1:x` (U+00B7). That string is not a price list.

## Research is not inventory

A researched card is not a card in stock. Do not write research rows into `inventory_cards`. Do not infer NLF quantity from print run. Graded inventory and the encyclopedia are different tables.

## Counting rules

1. **Count each distinct issue separately.** A `/5` Red Refractor and a `/5` Red Wave are two products. If both exist, numbered copies are 5 + 5 = **10**, not 5.
2. **Do not assume the same ladder across sets.** 2025 Chrome Sapphire (set 4) is not 2025 Studios Sapphire (set 6). Chrome hobby Refractor `1:2` is not Finest X-Men ’97 Common Refractor `1:6`.
3. **Do not infer serials from color.** “Red” does not mean `/5`. Studios Sapphire official pack rates have **no** print-run numbers on the sheet — do not invent `/99`.
4. **Do not count unnumbered parallels in serial-population totals.** Refractor with no `/n` is not a numbered copy.
5. **Print-run rarity vs pull rarity are not identical.** `/5` is how many exist. `1:629` is how often it hits a pack. Record both when the official sheet has both; never substitute one for the other.

## Hard locks on the live site

Seeds hard-lock `setId`. Do not retarget set 4 odds onto set 6, or Mint 2025 onto Mint 2026 (`90006`). Chrome 2025 seed comments note live numeric base is **197, not 200** — skip numbers that do not exist; do not invent the missing three.

## When blocked

If there is no official checklist (example: 2026 Chrome Sapphire as of 2026-08-29), **stop**. Record “not done — no checklist — do not invent” in [`CURRENT_WORK.md`](../CURRENT_WORK.md). Do not scrape a fake ladder from a previous Sapphire product.
