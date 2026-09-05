/**
 * Repair classic UTF-8 mojibake (bytes decoded as Windows-1252 / Latin-1).
 * Used for source hygiene, public API strings, and live DB copy that never
 * lived in git. Restores the intended Unicode only — no new wording.
 */

const REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  // Uppercased leftover of em/en-dash mojibake (CSS text-transform: uppercase)
  ["\u00C2\u20AC\u201D", "\u2014"],
  ["\u00C2\u20AC\u201C", "\u2013"],

  // General punctuation (UTF-8 E2 80 xx)
  ["\u00E2\u20AC\u201D", "\u2014"],
  ["\u00E2\u20AC\u201C", "\u2013"],
  ["\u00E2\u20AC\u2122", "\u2019"],
  ["\u00E2\u20AC\u0153", "\u201C"],
  ["\u00E2\u20AC\u00A6", "\u2026"],
  ["\u00E2\u20AC\u00A2", "\u2022"],
  ["\u00E2\u20AC\u00B9", "\u2039"],
  ["\u00E2\u20AC\u00BA", "\u203A"],
  ["\u00E2\u20AC\u02DC", "\u2018"],

  // Arrows (UTF-8 E2 86 xx)
  ["\u00E2\u2020\u2019", "\u2192"],
  ["\u00E2\u2020\u0090", "\u2190"],

  // Block / geometric (UTF-8 E2 96 xx) — Latin-1 vs CP1252 variants
  ["\u00E2\u2014\u02C6", "\u2588"],
  ["\u00E2\u2013\u02C6", "\u2588"],
  ["\u00E2\u2013\u00B6", "\u25B6"],
  ["\u00E2\u2014\u00B6", "\u25B6"],
  ["\u00E2\u2013\u00A3", "\u25A3"],
  ["\u00E2\u2014\u00A3", "\u25A3"],

  // Misc symbols
  ["\u00E2\u0161\u00A1", "\u26A1"],
  ["\u00E2\u2122\u00A0", "\u2660"],
  ["\u00E2\u2122\u00A5", "\u2665"],
  ["\u00E2\u2122\u00A6", "\u2666"],
  ["\u00E2\u2122\u00A3", "\u2663"],
  ["\u00E2\u00AD\u0090", "\u2B50"],
  ["\u00E2\u02DC\u2026", "\u2605"],
  ["\u00E2\u02DC\u2020", "\u2606"],

  // Box drawing (comment chrome)
  ["\u00E2\u2022\u0090", "\u2550"],
  ["\u00E2\u201D\u20AC", "\u2500"],

  // C2 / C3 Latin-1 leftovers
  ["\u00C2\u00B7", "\u00B7"],
  ["\u00C3\u2014", "\u00D7"],
  ["\u00C3\u00A9", "\u00E9"],
  ["\u00C2\u00A0", "\u00A0"],

  // CP850 of UTF-8 punctuation (seed / older imports)
  ["\u00D4\u00C7\u00F6", "\u2014"],
  ["\u00D4\u00C7\u00F4", "\u2013"],
  ["\u00D4\u00C7\u00FF", "\u2019"],
  ["\u00D4\u00C7\u00D6", "\u2019"],
];

export function repairMojibake(value: string): string {
  let out = value;
  for (const [from, to] of REPLACEMENTS) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  return out;
}

export function repairMojibakeFields<T extends Record<string, unknown>>(
  row: T,
  keys: readonly (keyof T)[]
): T {
  const next = { ...row };
  for (const key of keys) {
    const current = next[key];
    if (typeof current === "string") {
      (next as Record<string, unknown>)[key as string] = repairMojibake(current);
    }
  }
  return next;
}

/** True when a string still contains a known mojibake lead sequence. */
export function hasMojibake(value: string): boolean {
  return REPLACEMENTS.some(([from]) => value.includes(from));
}
