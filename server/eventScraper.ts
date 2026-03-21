/**
 * Event Scraper — Fetches card shows and comic cons from multiple web sources
 * Sources:
 *   1. TCDB.com — Card shows (50 US states)
 *   2. FanCons.com — Comic cons (US schedule)
 *   3. UpcomingCons.com — Comic cons (additional coverage)
 *
 * Uses LLM-assisted parsing for TCDB (complex HTML), regex for FanCons/UpcomingCons (clean structure).
 * Deduplicates against existing DB events by sourceId and fuzzy name+city+date matching.
 */

import { invokeLLM } from "./_core/llm";
import {
  getEventBySourceId,
  findDuplicateEvent,
  bulkInsertEvents,
  updateEventLastScraped,
} from "./db";
import type { InsertEvent } from "../drizzle/schema";

// ==================== TYPES ====================

interface ScrapedEvent {
  name: string;
  eventType: string;
  dateDisplay: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  month: number;
  city: string;
  state: string;
  stateName?: string;
  venue?: string;
  address?: string;
  hours?: string;
  tableCount?: number;
  admission?: string;
  isFree?: boolean;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
  tier?: number;
  source: string;
  sourceId: string;
  sourceUrl?: string;
}

interface ScrapeResult {
  source: string;
  fetched: number;
  newEvents: number;
  duplicates: number;
  errors: string[];
}

// ==================== STATE MAPPING ====================

const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia", PR: "Puerto Rico",
};

const STATE_NAME_TO_ABBR: Record<string, string> = {};
for (const [abbr, name] of Object.entries(US_STATES)) {
  STATE_NAME_TO_ABBR[name.toLowerCase()] = abbr;
}

function getStateAbbr(stateStr: string): string | null {
  if (!stateStr) return null;
  const upper = stateStr.trim().toUpperCase();
  if (US_STATES[upper]) return upper;
  const lower = stateStr.trim().toLowerCase();
  return STATE_NAME_TO_ABBR[lower] ?? null;
}

// ==================== FETCH HELPER ====================

async function fetchPage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NLFBot/1.0; +https://northlandlegendaryfinds.com)",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) {
      console.warn(`[Scraper] Failed to fetch ${url}: ${response.status}`);
      return null;
    }
    return await response.text();
  } catch (err) {
    console.warn(`[Scraper] Error fetching ${url}:`, err);
    return null;
  }
}

// ==================== 1. TCDB SCRAPER ====================

async function scrapeTCDB(): Promise<ScrapeResult> {
  const result: ScrapeResult = { source: "tcdb", fetched: 0, newEvents: 0, duplicates: 0, errors: [] };
  const allEvents: ScrapedEvent[] = [];

  // Scrape each state page
  const stateAbbrs = Object.keys(US_STATES).filter(s => s !== "PR" && s !== "DC");

  for (const stateAbbr of stateAbbrs) {
    const stateName = US_STATES[stateAbbr];
    const url = `https://www.tcdb.com/CardShowCalendar.cfm?State=${stateName.replace(/ /g, "%20")}&Country=United%20States`;

    const html = await fetchPage(url);
    if (!html) {
      result.errors.push(`Failed to fetch TCDB page for ${stateName}`);
      continue;
    }

    // Check if page has any shows
    if (html.includes("No card shows found") || html.includes("No shows found")) {
      continue;
    }

    try {
      const events = await parseTCDBWithLLM(html, stateAbbr, stateName, url);
      allEvents.push(...events);
    } catch (err) {
      result.errors.push(`LLM parse error for ${stateName}: ${err}`);
    }

    // Rate limit: wait 1s between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  result.fetched = allEvents.length;

  // Deduplicate and insert
  const newEvents: InsertEvent[] = [];
  for (const evt of allEvents) {
    const existing = await getEventBySourceId("tcdb", evt.sourceId);
    if (existing) {
      await updateEventLastScraped(existing.id);
      result.duplicates++;
      continue;
    }
    const fuzzyDup = await findDuplicateEvent(evt.name, evt.city, evt.state, evt.startDate);
    if (fuzzyDup) {
      result.duplicates++;
      continue;
    }
    newEvents.push({
      ...evt,
      eventStatus: "approved",
      lastScrapedAt: new Date(),
    });
  }

  if (newEvents.length > 0) {
    result.newEvents = await bulkInsertEvents(newEvents);
  }

  return result;
}

async function parseTCDBWithLLM(html: string, stateAbbr: string, stateName: string, sourceUrl: string): Promise<ScrapedEvent[]> {
  // Extract just the show listing portion to reduce token usage
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : html;

  // Truncate to ~15k chars to stay within token limits
  const truncated = bodyHtml.substring(0, 15000);

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You extract card show events from HTML. Return a JSON array of events. Each event has: name (string), dateDisplay (human-readable date string like "March 15, 2026" or "March 15-16, 2026"), startDate (YYYY-MM-DD), endDate (YYYY-MM-DD, same as startDate if single day), city (string), venue (string or null), hours (string or null), tableCount (number or null), admission (string or null), email (string or null), phone (string or null), website (string or null). If no events found, return []. Only include events in year 2025 or later.`,
      },
      {
        role: "user",
        content: `Extract card show events from this TCDB page for ${stateName}:\n\n${truncated}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "tcdb_events",
        strict: true,
        schema: {
          type: "object",
          properties: {
            events: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  dateDisplay: { type: "string" },
                  startDate: { type: "string" },
                  endDate: { type: "string" },
                  city: { type: "string" },
                  venue: { type: ["string", "null"] },
                  hours: { type: ["string", "null"] },
                  tableCount: { type: ["integer", "null"] },
                  admission: { type: ["string", "null"] },
                  email: { type: ["string", "null"] },
                  phone: { type: ["string", "null"] },
                  website: { type: ["string", "null"] },
                },
                required: ["name", "dateDisplay", "startDate", "endDate", "city"],
                additionalProperties: false,
              },
            },
          },
          required: ["events"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== "string") return [];

  try {
    const parsed = JSON.parse(content);
    return (parsed.events || []).map((evt: any, idx: number) => ({
      name: evt.name,
      eventType: "card-show",
      dateDisplay: evt.dateDisplay,
      startDate: evt.startDate,
      endDate: evt.endDate,
      month: parseInt(evt.startDate.split("-")[1]) || 1,
      city: evt.city,
      state: stateAbbr,
      stateName: stateName,
      venue: evt.venue || undefined,
      hours: evt.hours || undefined,
      tableCount: evt.tableCount || undefined,
      admission: evt.admission || undefined,
      isFree: evt.admission?.toLowerCase().includes("free") ? true : undefined,
      email: evt.email || undefined,
      phone: evt.phone || undefined,
      website: evt.website || undefined,
      source: "tcdb",
      sourceId: `tcdb-${stateAbbr}-${evt.startDate}-${idx}`,
      sourceUrl: sourceUrl,
    }));
  } catch {
    return [];
  }
}

// ==================== 2. FANCONS SCRAPER ====================

async function scrapeFanCons(): Promise<ScrapeResult> {
  const result: ScrapeResult = { source: "fancons", fetched: 0, newEvents: 0, duplicates: 0, errors: [] };
  const url = "https://fancons.com/events/schedule.php?year=2026&type=comic&loc=us";

  const html = await fetchPage(url);
  if (!html) {
    result.errors.push("Failed to fetch FanCons page");
    return result;
  }

  const events = parseFanConsHTML(html);
  result.fetched = events.length;

  const newEvents: InsertEvent[] = [];
  for (const evt of events) {
    const existing = await getEventBySourceId("fancons", evt.sourceId);
    if (existing) {
      await updateEventLastScraped(existing.id);
      result.duplicates++;
      continue;
    }
    const fuzzyDup = await findDuplicateEvent(evt.name, evt.city, evt.state, evt.startDate);
    if (fuzzyDup) {
      result.duplicates++;
      continue;
    }
    newEvents.push({
      ...evt,
      eventStatus: "approved",
      lastScrapedAt: new Date(),
    });
  }

  if (newEvents.length > 0) {
    result.newEvents = await bulkInsertEvents(newEvents);
  }

  return result;
}

function parseFanConsHTML(html: string): ScrapedEvent[] {
  const events: ScrapedEvent[] = [];

  // FanCons uses table rows with event data
  // Pattern: <tr> with event name link, dates, venue, city/state
  const rowRegex = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
  const rows = html.match(rowRegex) || [];

  for (const row of rows) {
    // Extract event name from link
    const nameMatch = row.match(/<a[^>]*>([^<]+)<\/a>/);
    if (!nameMatch) continue;
    const name = nameMatch[1].trim();

    // Skip header rows
    if (name === "Convention" || name === "Date" || name === "Location") continue;

    // Extract dates - look for patterns like "March 19-22, 2026" or "March 19, 2026"
    const dateMatch = row.match(/(\w+ \d{1,2}(?:-\d{1,2})?,?\s*\d{4})/);
    if (!dateMatch) continue;

    // Extract city, state from the row
    const locationMatch = row.match(/([A-Za-z\s.]+),\s*([A-Z]{2})/);
    if (!locationMatch) continue;

    const city = locationMatch[1].trim();
    const stateAbbr = locationMatch[2].trim();
    if (!US_STATES[stateAbbr]) continue; // Skip non-US

    // Extract venue if present
    const venueMatch = row.match(/<td[^>]*>([^<]+)<\/td>/g);

    const dateDisplay = dateMatch[1];
    const { startDate, endDate } = parseDateRange(dateDisplay);
    if (!startDate) continue;

    const sourceId = `fancons-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${startDate}`;

    events.push({
      name,
      eventType: classifyConventionType(name),
      dateDisplay,
      startDate,
      endDate: endDate || startDate,
      month: parseInt(startDate.split("-")[1]) || 1,
      city,
      state: stateAbbr,
      stateName: US_STATES[stateAbbr],
      source: "fancons",
      sourceId,
      sourceUrl: "https://fancons.com/events/schedule.php?year=2026&type=comic&loc=us",
    });
  }

  return events;
}

// ==================== 3. UPCOMINGCONS SCRAPER ====================

async function scrapeUpcomingCons(): Promise<ScrapeResult> {
  const result: ScrapeResult = { source: "upcomingcons", fetched: 0, newEvents: 0, duplicates: 0, errors: [] };
  const url = "https://upcomingcons.com/comic-conventions";

  const html = await fetchPage(url);
  if (!html) {
    result.errors.push("Failed to fetch UpcomingCons page");
    return result;
  }

  const events = parseUpcomingConsHTML(html);
  result.fetched = events.length;

  const newEvents: InsertEvent[] = [];
  for (const evt of events) {
    const existing = await getEventBySourceId("upcomingcons", evt.sourceId);
    if (existing) {
      await updateEventLastScraped(existing.id);
      result.duplicates++;
      continue;
    }
    const fuzzyDup = await findDuplicateEvent(evt.name, evt.city, evt.state, evt.startDate);
    if (fuzzyDup) {
      result.duplicates++;
      continue;
    }
    newEvents.push({
      ...evt,
      eventStatus: "approved",
      lastScrapedAt: new Date(),
    });
  }

  if (newEvents.length > 0) {
    result.newEvents = await bulkInsertEvents(newEvents);
  }

  return result;
}

function parseUpcomingConsHTML(html: string): ScrapedEvent[] {
  const events: ScrapedEvent[] = [];

  // UpcomingCons has a clean list: [ConName]\n City, ST\n Date Range
  // Pattern: linked name followed by city/state and date
  const eventBlockRegex = /\[([^\]]+)\]\([^)]*\)\s*\n\s*([^,\n]+),\s*([A-Z]{2})\s*\n\s*(\w+ \d{1,2}(?:[-–]\d{1,2})?,?\s*\d{4})/g;

  // Alternative: parse from HTML directly
  // Look for convention entries with name, location, date pattern
  const nameRegex = /<a[^>]*href="[^"]*"[^>]*>([^<]+)<\/a>/g;
  const allNames: string[] = [];
  let match;
  while ((match = nameRegex.exec(html)) !== null) {
    allNames.push(match[1].trim());
  }

  // Parse the text content approach - extract text between tags
  const textContent = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, "")
    .replace(/\n{3,}/g, "\n\n");

  // Match patterns like: ConName\nCity, ST\nDate
  const lines = textContent.split("\n").map(l => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    // Check if next line is a city, state pattern
    const locationMatch = nextLine?.match(/^([A-Za-z\s.'-]+),\s*([A-Z]{2})$/);
    if (!locationMatch) continue;

    const city = locationMatch[1].trim();
    const stateAbbr = locationMatch[2].trim();
    if (!US_STATES[stateAbbr]) continue;

    // Look for date in the line after location
    const dateLine = lines[i + 2];
    if (!dateLine) continue;

    const dateMatch = dateLine.match(/(\w+ \d{1,2}(?:[-–]\d{1,2})?,?\s*\d{4})/);
    if (!dateMatch) continue;

    // The current line should be the event name
    const name = line;
    if (!name || name.length < 3 || name.length > 200) continue;
    // Skip non-event lines
    if (/^(comic|book|conventions?|list|schedule|upcoming|search|sign)/i.test(name)) continue;

    const dateDisplay = dateMatch[1];
    const { startDate, endDate } = parseDateRange(dateDisplay);
    if (!startDate) continue;

    const sourceId = `upcomingcons-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${startDate}`;

    events.push({
      name,
      eventType: classifyConventionType(name),
      dateDisplay,
      startDate,
      endDate: endDate || startDate,
      month: parseInt(startDate.split("-")[1]) || 1,
      city,
      state: stateAbbr,
      stateName: US_STATES[stateAbbr],
      source: "upcomingcons",
      sourceId,
      sourceUrl: "https://upcomingcons.com/comic-conventions",
    });
  }

  return events;
}

// ==================== HELPER FUNCTIONS ====================

const MONTH_MAP: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function parseDateRange(dateStr: string): { startDate: string | null; endDate: string | null } {
  if (!dateStr) return { startDate: null, endDate: null };

  // Handle "March 19-22, 2026" or "Mar 19-22, 2026"
  const rangeMatch = dateStr.match(/(\w+)\s+(\d{1,2})[-–](\d{1,2}),?\s*(\d{4})/);
  if (rangeMatch) {
    const month = MONTH_MAP[rangeMatch[1].toLowerCase()];
    if (!month) return { startDate: null, endDate: null };
    const day1 = parseInt(rangeMatch[2]);
    const day2 = parseInt(rangeMatch[3]);
    const year = rangeMatch[4];
    return {
      startDate: `${year}-${String(month).padStart(2, "0")}-${String(day1).padStart(2, "0")}`,
      endDate: `${year}-${String(month).padStart(2, "0")}-${String(day2).padStart(2, "0")}`,
    };
  }

  // Handle "March 19, 2026"
  const singleMatch = dateStr.match(/(\w+)\s+(\d{1,2}),?\s*(\d{4})/);
  if (singleMatch) {
    const month = MONTH_MAP[singleMatch[1].toLowerCase()];
    if (!month) return { startDate: null, endDate: null };
    const day = parseInt(singleMatch[2]);
    const year = singleMatch[3];
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return { startDate: date, endDate: date };
  }

  return { startDate: null, endDate: null };
}

function classifyConventionType(name: string): string {
  const lower = name.toLowerCase();
  if (/anime|manga|otaku/.test(lower)) return "anime-gaming";
  if (/gaming|game|esport/.test(lower)) return "anime-gaming";
  if (/comic[\s-]?con|comicon|comic[\s-]?book/.test(lower)) return "comic-con";
  if (/collect[\s-]?a[\s-]?con|card[\s-]?show|card[\s-]?expo|sports[\s-]?card/.test(lower)) return "card-show";
  if (/toy|collectible|memorabilia/.test(lower)) return "collectibles";
  return "pop-culture";
}

// ==================== MAIN SCRAPE FUNCTION ====================

export type ScrapeSource = "tcdb" | "fancons" | "upcomingcons" | "all";

export async function runScrape(source: ScrapeSource = "all"): Promise<ScrapeResult[]> {
  console.log(`[Scraper] Starting scrape for source: ${source}`);
  const results: ScrapeResult[] = [];

  if (source === "tcdb" || source === "all") {
    console.log("[Scraper] Scraping TCDB...");
    const tcdbResult = await scrapeTCDB();
    results.push(tcdbResult);
    console.log(`[Scraper] TCDB: ${tcdbResult.fetched} fetched, ${tcdbResult.newEvents} new, ${tcdbResult.duplicates} duplicates`);
  }

  if (source === "fancons" || source === "all") {
    console.log("[Scraper] Scraping FanCons...");
    const fanConsResult = await scrapeFanCons();
    results.push(fanConsResult);
    console.log(`[Scraper] FanCons: ${fanConsResult.fetched} fetched, ${fanConsResult.newEvents} new, ${fanConsResult.duplicates} duplicates`);
  }

  if (source === "upcomingcons" || source === "all") {
    console.log("[Scraper] Scraping UpcomingCons...");
    const upcomingResult = await scrapeUpcomingCons();
    results.push(upcomingResult);
    console.log(`[Scraper] UpcomingCons: ${upcomingResult.fetched} fetched, ${upcomingResult.newEvents} new, ${upcomingResult.duplicates} duplicates`);
  }

  const totalNew = results.reduce((sum, r) => sum + r.newEvents, 0);
  const totalFetched = results.reduce((sum, r) => sum + r.fetched, 0);
  console.log(`[Scraper] Complete: ${totalFetched} total fetched, ${totalNew} new events added`);

  return results;
}
