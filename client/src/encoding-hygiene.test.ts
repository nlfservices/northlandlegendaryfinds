import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { hasMojibake } from "@shared/repairMojibake";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SKIP_DIRS = new Set([".git", "node_modules", "dist", ".manus"]);
const SKIP_FILES = new Set([
  // These seeds document / match live DB mojibake on purpose.
  "server/mint2025MetaSeed.ts",
  "server/finestFF2026MetaSeed.ts",
]);
const EXT = new Set([".tsx", ".ts", ".jsx", ".js", ".mjs", ".cjs", ".html", ".css"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
      continue;
    }
    if (!EXT.has(path.extname(entry.name))) continue;
    const rel = path.relative(ROOT, full).replace(/\\/g, "/");
    if (SKIP_FILES.has(rel)) continue;
    if (rel.endsWith("repairMojibake.ts") || rel.endsWith("repairMojibake.test.ts")) continue;
    out.push(full);
  }
  return out;
}

describe("source encoding hygiene", () => {
  it("uses a real em dash on the Card Database and Doomsday badge copy Pat reported", () => {
    const cards = fs.readFileSync(path.join(ROOT, "client/src/pages/CardDatabase.tsx"), "utf8");
    const doomsday = fs.readFileSync(path.join(ROOT, "client/src/pages/DoomsdayCountdown.tsx"), "utf8");
    const ticker = fs.readFileSync(path.join(ROOT, "client/src/components/GlobalTicker.tsx"), "utf8");
    expect(cards).toContain("2024 to 2026 \u2014 organized by year");
    expect(cards).not.toContain("\u00E2\u20AC\u201D");
    expect(doomsday).toContain("MCU Phase 6 \u2014 Live Countdown");
    expect(ticker).toContain("SPIDER-MAN: BRAND NEW DAY \u2014");
    expect(ticker).toContain("from \"lucide-react\"");
  });

  it("has no Windows-1252 mojibake sequences in client/server/shared source", () => {
    const offenders: string[] = [];
    for (const file of walk(ROOT)) {
      const text = fs.readFileSync(file, "utf8");
      if (hasMojibake(text)) {
        offenders.push(path.relative(ROOT, file));
      }
    }
    expect(offenders).toEqual([]);
  });
});
