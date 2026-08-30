# Current work — 2026-08-29 CT

Handoff: **docs-only PR** (`docs/agent-handoff`) so Manus and ChatGPT can read architecture, deploy rules, and card-research governance **without write or deploy**. Do not merge this PR as part of the handoff task. Do not deploy. Do not edit application code.

Production remains GitHub `main` → Railway, domain via Cloudflare. Live www home 200 with `server: cloudflare` and `x-railway-edge` (checked 2026-08-29 CT).

## Live sets with official odds

| setId | slug | Notes |
| --- | --- | --- |
| 1 | `2025-topps-chrome` | Official hobby odds. Iron Man Refractor **1:2**. Seed: live numeric base is 197, not 200 — do not invent missing numbers. |
| 2 | `2025-topps-comic-book-heroes` | Official hobby odds. **Missing fronts:** 137, 140–144, 149, 150. **Missing backs:** 138, 140–144, 149, 150. Do not write dead `/cbh/` URLs for those. |
| 3 | `2025-topps-marvel-mint` | Official metal cardType + hobby odds. Hercules in this set. Metal base is **1–120** (Bronze 1–50, Silver 51–75, Gold 76–100, Platinum 101–120), not 1–100 only. |
| 4 | `2025-topps-marvel-sapphire` | 2025 Topps Marvel **Chrome** Sapphire. **Not set 6.** Green /99 1:5, Aqua /75 1:7. Photos `/mcs/`. |
| 5 | `2025-topps-marvel-studios` | Official hobby odds (Rainbow Refractor 1:2, …). |
| 6 | `2025-topps-marvel-studios-sapphire` | **Pack rates** (Blue 1:1 … Padparadscha 1:420). Official sheet has no print-run numbers — do not invent `/99`. Not set 4. |
| 30001 | `2025-marvel-the-collector` | Official hobby odds. MCU Perfection 1–85. |
| 90001 | `2024-topps-chrome-marvel` | Official hobby odds. |
| 90002 | `2024-topps-chrome-sapphire-marvel` | **Print runs only** (odds seed does not invent pack rates beyond the sheet). |
| 90003 | `2025-topps-chrome-deadpool` | Official hobby odds. |
| 90004 | `2026-topps-brooklyn-captain-america-85th` | Official hobby odds. |
| 90005 | `2026-topps-chrome-marvel-comics` | Official hobby odds. |
| 90006 | `2026-topps-marvel-mint` | Official hobby odds. Photo seed is numeric **1–125** (not 1–100) at `/mint2026/26TMM-{n}F.jpg`. |
| 90007 | `2026-topps-marvel-vault` | **NEW.** Official checklist + hobby odds. **336** cards in `vault2026Seed.ts`. Photos stay empty. |
| 90008 | `2025-topps-finest-x-men-97` | **NEW.** Official checklist + hobby odds. **226** cards. Professor X Common Refractor **1:6**. Photos stay empty. |
| 60001 | `2026-topps-finest-fantastic-four` | Official hobby odds. |

## Not done — do not invent

- **2026 Chrome Sapphire:** no official checklist. Do not invent cards, parallels, or odds. Do not clone 2025 Sapphire (set 4) or Studios Sapphire (set 6).

## Known issues

- MCU News **garbled dashes** (en-dash mojibake in article bodies).
- **Soft 404s:** `/card-hub`, `/trending-cards`, `/doomsday-box-office` return HTTP 200 then client `NotFound`. Real routes: `/marvel-card-hub`, `/trending`, `/doomsday`. SPA does not send HTTP 404.
- **COTD Wolverine blank** — Super Grok owns Card of the Day.

## Agent status

| Agent | Now |
| --- | --- |
| Jarvis | Live official set layer, MCU News media rewrite to R2, seeds after listen |
| Super Grok | Home, header, Card Database, COTD (Wolverine blank) |
| ChatGPT | Doctor Doom serial-numbered population 2024-forward (do not rebuild unless assigned) |
| Manus / ChatGPT (site) | **Read/advise only.** No push, no deploy, no Manus hosting |
| Claude | Audit against this handbook |

## Next

Human review of the docs PR. Merge only when Pat wants these markdown files on `main` (that merge would deploy via Railway). Application code is unchanged in this handoff.
