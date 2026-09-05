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
