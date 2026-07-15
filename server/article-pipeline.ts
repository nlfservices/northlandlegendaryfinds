/**
 * Northland Legendary Finds — Article Pipeline
 * Template-as-contract enforcement + per-section image pairing
 *
 * This is the ENFORCEMENT layer. It does not trust any caller to
 * "remember" the rules — it checks them and refuses to publish
 * contract violations.
 *
 * THE ROTATION COUNTER only advances on SUCCESSFUL publish.
 * Special templates (patriotic, collector_spotlight) never touch the counter.
 */

import { getSiteSetting, setSiteSetting } from "./db";

// ─── 1. ROTATION ORDER + TEMPLATE CONTRACTS ───────────────────────────────────

export const ROTATION = [
  "classic", "magazine", "spotlight", "timeline", "listicle",
  "cinematic", "dossier", "character_profile", "disney_experience", "comic_strip",
] as const;

export type RotationTemplate = typeof ROTATION[number];

export const SPECIALS = ["patriotic", "collector_spotlight"] as const;
export type SpecialTemplate = typeof SPECIALS[number];
export type AnyTemplate = RotationTemplate | SpecialTemplate;

interface TemplateContract {
  featuredImage: "required" | "optional" | "stripped";
  h2Range: [number, number];
  inlineImagePerH2?: "required" | "optional";
  inlineImageMin?: number;
  blockquotesMin: number;
}

export const CONTRACTS: Record<AnyTemplate, TemplateContract> = {
  classic:             { featuredImage: "required", h2Range: [3, 8],  inlineImagePerH2: "optional", blockquotesMin: 0 },
  magazine:            { featuredImage: "required", h2Range: [4, 8],  inlineImagePerH2: "optional", blockquotesMin: 2 },
  spotlight:           { featuredImage: "required", h2Range: [3, 8],  inlineImagePerH2: "optional", blockquotesMin: 0 },
  timeline:            { featuredImage: "stripped", h2Range: [4, 8],  inlineImagePerH2: "required", blockquotesMin: 0 },
  listicle:            { featuredImage: "optional", h2Range: [5, 10], inlineImagePerH2: "required", blockquotesMin: 0 },
  cinematic:           { featuredImage: "required", h2Range: [3, 6],  inlineImagePerH2: "optional", blockquotesMin: 0 },
  dossier:             { featuredImage: "optional", h2Range: [3, 8],  inlineImageMin: 1,            blockquotesMin: 0 },
  character_profile:   { featuredImage: "required", h2Range: [3, 6],  inlineImagePerH2: "optional", blockquotesMin: 0 },
  disney_experience:   { featuredImage: "required", h2Range: [3, 8],  inlineImagePerH2: "optional", blockquotesMin: 0 },
  comic_strip:         { featuredImage: "optional", h2Range: [4, 8],  inlineImagePerH2: "required", blockquotesMin: 0 },
  patriotic:           { featuredImage: "required", h2Range: [3, 8],  inlineImagePerH2: "optional", blockquotesMin: 0 },
  collector_spotlight: { featuredImage: "required", h2Range: [3, 8],  inlineImagePerH2: "optional", blockquotesMin: 0 },
};


// ─── 2. ROTATION RESOLVER ─────────────────────────────────────────────────────

export function resolveNextTemplate(lastRotationTemplate: string | null): { name: RotationTemplate; contract: TemplateContract } {
  const lastIdx = lastRotationTemplate ? ROTATION.indexOf(lastRotationTemplate as RotationTemplate) : -1;
  const nextIdx = (lastIdx + 1) % ROTATION.length;
  const name = ROTATION[nextIdx];
  return { name, contract: CONTRACTS[name] };
}

/** Read the current rotation state from the database */
export async function getNextTemplate(): Promise<{ name: RotationTemplate; contract: TemplateContract }> {
  const last = await getSiteSetting("last_rotation_template");
  return resolveNextTemplate(last);
}

/** Advance the rotation counter in the database (only call on successful publish) */
export async function advanceRotation(template: RotationTemplate): Promise<void> {
  await setSiteSetting("last_rotation_template", template, "Last article template in rotation (auto-managed by pipeline)");
}


// ─── 3. MARKDOWN PARSE / REBUILD ──────────────────────────────────────────────

export interface ParsedSection {
  heading: string;
  body: string[];
  images: string[];
  blockquotes: number;
  injectedImage?: string;
}

export function parseDocument(markdown: string): { intro: string[]; sections: ParsedSection[] } {
  const lines = (markdown || "").split("\n");
  const intro: string[] = [];
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      if (current) sections.push(current);
      current = { heading: h2[1], body: [], images: [], blockquotes: 0 };
      continue;
    }
    (current ? current.body : intro).push(line);
    if (current) {
      const imgs = line.match(/!\[[^\]]*\]\(([^)]+)\)/g) || [];
      for (const im of imgs) {
        const url = (im.match(/\(([^)]+)\)/) || [])[1];
        if (url) current.images.push(url);
      }
      if (/^\s*>\s+/.test(line)) current.blockquotes++;
    }
  }
  if (current) sections.push(current);
  return { intro, sections };
}

export function rebuildDocument(intro: string[], sections: ParsedSection[]): string {
  const parts: string[] = [];
  const introText = intro.join("\n").trim();
  if (introText) parts.push(introText);
  for (const s of sections) {
    let block = `## ${s.heading}`;
    if (s.injectedImage) block += `\n\n${s.injectedImage}`;
    const bodyText = s.body.join("\n").trim();
    if (bodyText) block += `\n\n${bodyText}`;
    parts.push(block);
  }
  return parts.join("\n\n") + "\n";
}


// ─── 4. VALIDATION GATE ───────────────────────────────────────────────────────

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  h2Count: number;
}

export function validateArticle(
  record: { contentMarkdown: string; featuredImageUrl?: string | null },
  template: AnyTemplate
): ValidationResult {
  const contract = CONTRACTS[template];
  if (!contract) return { ok: false, errors: [`Unknown template "${template}"`], warnings: [], h2Count: 0 };

  const errors: string[] = [];
  const warnings: string[] = [];
  const { sections } = parseDocument(record.contentMarkdown);
  const h2Count = sections.length;

  // H2 count
  const [minH2, maxH2] = contract.h2Range;
  if (h2Count < minH2 || h2Count > maxH2) {
    errors.push(`H2 count ${h2Count} is outside ${minH2}–${maxH2} for ${template}`);
  }

  // Featured image
  if (contract.featuredImage === "required" && !record.featuredImageUrl) {
    errors.push(`${template} requires a featured image but featuredImageUrl is empty`);
  }
  if (contract.featuredImage === "stripped" && record.featuredImageUrl) {
    warnings.push(`${template} strips the hero image — the renderer ignores featuredImageUrl. Consider setting it null.`);
  }

  // Inline image per H2
  if (contract.inlineImagePerH2 === "required") {
    sections.forEach((s, i) => {
      if (s.images.length === 0 && !s.injectedImage) {
        errors.push(`Section ${i + 1} ("${s.heading}") requires an inline image but has none`);
      }
    });
  }

  // Inline image minimum (e.g. dossier)
  if (contract.inlineImageMin) {
    const total = sections.reduce((n, s) => n + s.images.length, 0);
    if (total < contract.inlineImageMin) {
      errors.push(`${template} needs at least ${contract.inlineImageMin} inline image(s); found ${total}`);
    }
  }

  // Blockquotes (pull quotes)
  if (contract.blockquotesMin > 0) {
    const totalBq = sections.reduce((n, s) => n + s.blockquotes, 0);
    if (totalBq < contract.blockquotesMin) {
      errors.push(`${template} needs at least ${contract.blockquotesMin} blockquote(s) for pull quotes; found ${totalBq}`);
    }
  }

  // Belt-and-suspenders: no duplicate image anywhere in the article
  const urls: string[] = [];
  sections.forEach(s => s.images.forEach(u => urls.push(u)));
  if (record.featuredImageUrl) urls.push(record.featuredImageUrl);
  const seen = new Set<string>();
  for (const u of urls) {
    if (seen.has(u)) errors.push(`Duplicate image used: ${u}`);
    seen.add(u);
  }

  return { ok: errors.length === 0, errors, warnings, h2Count };
}


// ─── 5. TIMESTAMP VALIDATION ─────────────────────────────────────────────────

/**
 * Validates and normalizes a publishedAt value to milliseconds since epoch.
 * Rejects date strings, seconds-based timestamps, and out-of-range values.
 * Returns a valid millisecond timestamp or throws.
 */
export function validatePublishedAt(value: unknown): number {
  if (value === null || value === undefined) return Date.now();
  const n = typeof value === "string" ? Number(value) : Number(value);
  if (isNaN(n)) throw new Error(`publishedAt must be a numeric millisecond timestamp, got: ${value}`);
  // Detect seconds (10 digits) vs milliseconds (13 digits)
  const digits = String(Math.floor(Math.abs(n))).length;
  if (digits === 10) {
    // Seconds — auto-convert to millis
    const ms = n * 1000;
    if (ms < 1600000000000 || ms > 1900000000000) {
      throw new Error(`publishedAt (converted from seconds) out of range: ${ms}`);
    }
    return ms;
  }
  if (digits === 13) {
    if (n < 1600000000000 || n > 1900000000000) {
      throw new Error(`publishedAt out of valid range (2020–2030): ${n}`);
    }
    return n;
  }
  throw new Error(`publishedAt has ${digits} digits — expected 10 (seconds) or 13 (milliseconds). Got: ${n}`);
}


// ─── 6. AUTO-QUARANTINE VERIFIER ─────────────────────────────────────────────

export interface QuarantineResult {
  scanned: number;
  quarantined: number;
  details: Array<{ id: number; slug: string; template: string; errors: string[] }>;
}

/**
 * Scans ALL published articles against their template contracts.
 * Any article that fails is auto-flipped to unpublished (quarantined).
 * Returns a summary of what was found and quarantined.
 *
 * Call this:
 *  - On-demand after any raw SQL workflow touching the articles table
 *  - From the daily heartbeat as a safety net
 */
export async function quarantineFailingArticles(
  getAllPublished: () => Promise<Array<{ id: number; slug: string; templateLayout: string; contentMarkdown: string; featuredImageUrl: string | null }>>,
  unpublishById: (id: number) => Promise<void>
): Promise<QuarantineResult> {
  const articles = await getAllPublished();
  const details: QuarantineResult["details"] = [];

  for (const article of articles) {
    const template = article.templateLayout as AnyTemplate;
    if (!CONTRACTS[template]) {
      // Unknown template — quarantine
      details.push({
        id: article.id,
        slug: article.slug,
        template: article.templateLayout,
        errors: [`Unknown template "${article.templateLayout}" not in contracts`],
      });
      await unpublishById(article.id);
      continue;
    }

    const result = validateArticle(
      { contentMarkdown: article.contentMarkdown, featuredImageUrl: article.featuredImageUrl },
      template
    );

    if (!result.ok) {
      details.push({
        id: article.id,
        slug: article.slug,
        template: article.templateLayout,
        errors: result.errors,
      });
      await unpublishById(article.id);
    }
  }

  return {
    scanned: articles.length,
    quarantined: details.length,
    details,
  };
}


// ─── 7. TEMPLATE INFO HELPER (for callers to know what's next) ────────────────

export function getContractSummary(template: AnyTemplate): string {
  const c = CONTRACTS[template];
  if (!c) return `Unknown template: ${template}`;
  const parts = [
    `Template: ${template}`,
    `Featured image: ${c.featuredImage}`,
    `H2 sections: ${c.h2Range[0]}–${c.h2Range[1]}`,
    `Inline images per H2: ${c.inlineImagePerH2 || "n/a"}`,
    c.inlineImageMin ? `Min inline images total: ${c.inlineImageMin}` : null,
    c.blockquotesMin > 0 ? `Min blockquotes: ${c.blockquotesMin}` : null,
  ].filter(Boolean);
  return parts.join(" | ");
}
