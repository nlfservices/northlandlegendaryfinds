/**
 * Event Scraper - Fetches card shows from TCDB.com and comic cons from FanCons.com
 * Uses LLM to parse HTML into structured event data
 * Deduplicates against existing database entries
 */

import { invokeLLM } from "./_core/llm";
import { getEventsBySource, insertEvents } from "./db";
import type { InsertEvent } from "../drizzle/schema";

const US_STATES = [
  { abbr: "AL", name: "Alabama" }, { abbr: "AK", name: "Alaska" }, { abbr: "AZ", name: "Arizona" },
  { abbr: "AR", name: "Arkansas" }, { abbr: "CA", name: "California" }, { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" }, { abbr: "DE", name: "Delaware" }, { abbr: "FL", name: "Florida" },
  { abbr: "GA", name: "Georgia" }, { abbr: "HI", name: "Hawaii" }, { abbr: "ID", name: "Idaho" },
  { abbr: "IL", name: "Illinois" }, { abbr: "IN", name: "Indiana" }, { abbr: "IA", name: "Iowa" },
  { abbr: "KS", name: "Kansas" }, { abbr: "KY", name: "Kentucky" }, { abbr: "LA", name: "Louisiana" },
  { abbr: "ME", name: "Maine" }, { abbr: "MD", name: "Maryland" }, { abbr: "MA", name: "Massachusetts" },
  { abbr: "MI", name: "Michigan" }, { abbr: "MN", name: "Minnesota" }, { abbr: "MS", name: "Mississippi" },
  { abbr: "MO", name: "Missouri" }, { abbr: "MT", name: "Montana" }, { abbr: "NE", name: "Nebraska" },
  { abbr: "NV", name: "Nevada" }, { abbr: "NH", name: "New Hampshire" }, { abbr: "NJ", name: "New Jersey" },
  { abbr: "NM", name: "New Mexico" }, { abbr: "NY", name: "New York" }, { abbr: "NC", name: "North Carolina" },
  { abbr: "ND", name: "North Dakota" }, { abbr: "OH", name: "Ohio" }, { abbr: "OK", name: "Oklahoma" },
  { abbr: "OR", name: "Oregon" }, { abbr: "PA", name: "Pennsylvania" }, { abbr: "RI", name: "Rhode Island" },
  { abbr: "SC", name: "South Carolina" }, { abbr: "SD", name: "South Dakota" }, { abbr: "TN", name: "Tennessee" },
  { abbr: "TX", name: "Texas" }, { abbr: "UT", name: "Utah" }, { abbr: "VT", name: "Vermont" },
  { abbr: "VA", name: "Virginia" }, { abbr: "WA", name: "Washington" }, { abbr: "WV", name: "West Virginia" },
  { abbr: "WI", name: "Wisconsin" }, { abbr: "WY", name: "Wyoming" },
];

// ==================== TCDB SCRAPER (Card Shows) ====================

async function fetchTCDBState(stateAbbr: string, stateName: string): Promise<string> {
  const url = `https://www.tcdb.com/CardShowCalendar.cfm?State=${stateAbbr}&Country=United%20States`;
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NLF-EventBot/1.0)" },
    });
    if (!response.ok) {
      console.warn(`[Scraper] TCDB ${stateAbbr} returned ${response.status}`);
      return "";
    }
    return await response.text();
  } catch (e) {
    console.warn(`[Scraper] TCDB ${stateAbbr} fetch failed:`, e);
    return "";
  }
}

async function parseTCDBHtml(html: string, stateAbbr: string, stateName: string): Promise<InsertEvent[]> {
  if (!html || html.length < 500) return [];
  
  // Extract just the calendar content (reduce token usage)
  const calendarMatch = html.match(/<table[^>]*class="[^"]*calendar[^"]*"[^>]*>([\s\S]*?)<\/table>/i);
  const contentHtml = calendarMatch ? calendarMatch[1] : html.substring(0, 15000);
  
  // Use LLM to parse the HTML into structured events
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a data extraction assistant. Extract card show events from the HTML content of a TCDB.com calendar page. Return a JSON array of events. Each event should have: name, dateDisplay (human-readable), startDate (YYYY-MM-DD), endDate (YYYY-MM-DD), city, hours (if available), venue (if mentioned in the event details). Only include events from the current year (2026) that haven't already passed. If no events are found, return an empty array [].`
      },
      {
        role: "user",
        content: `Extract card show events from this ${stateName} (${stateAbbr}) TCDB calendar page HTML. Return ONLY a JSON array, no other text:\n\n${contentHtml.substring(0, 12000)}`
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "card_shows",
        strict: true,
        schema: {
          type: "object",
          properties: {
            events: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Name of the card show" },
                  dateDisplay: { type: "string", description: "Human-readable date like 'March 21, 2026'" },
                  startDate: { type: "string", description: "Start date in YYYY-MM-DD format" },
                  endDate: { type: "string", description: "End date in YYYY-MM-DD format" },
                  city: { type: "string", description: "City name" },
                  hours: { type: "string", description: "Event hours like '10:00 AM - 4:00 PM'" },
                  venue: { type: "string", description: "Venue name if available" },
                },
                required: ["name", "dateDisplay", "startDate", "endDate", "city", "hours", "venue"],
                additionalProperties: false,
              }
            }
          },
          required: ["events"],
          additionalProperties: false,
        }
      }
    }
  });

  try {
    const parsed = JSON.parse(response.choices[0].message.content || "{}");
    const events: InsertEvent[] = (parsed.events || []).map((e: any) => ({
      name: e.name,
      eventType: "card-show" as const,
      tier: null,
      dateDisplay: e.dateDisplay,
      startDate: e.startDate,
      endDate: e.endDate,
      month: parseInt(e.startDate.split("-")[1]),
      venue: e.venue || null,
      address: null,
      city: e.city,
      state: stateAbbr,
      stateName: stateName,
      hours: e.hours || null,
      tableCount: null,
      admission: null,
      isFree: null,
      email: null,
      phone: null,
      website: null,
      description: null,
      highlights: null,
      featured: false,
      recurring: false,
      source: "tcdb",
      sourceId: `tcdb-${stateAbbr}-${e.name.replace(/\s+/g, "-").toLowerCase()}-${e.startDate}`,
      sourceUrl: `https://www.tcdb.com/CardShowCalendar.cfm?State=${stateAbbr}&Country=United%20States`,
      status: "approved" as const,
    }));
    return events;
  } catch (e) {
    console.warn(`[Scraper] Failed to parse TCDB LLM response for ${stateAbbr}:`, e);
    return [];
  }
}

// ==================== FANCONS SCRAPER (Comic Cons) ====================

async function fetchFanCons(): Promise<string> {
  const url = "https://fancons.com/events/schedule.php?year=2026&type=comic&loc=us";
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NLF-EventBot/1.0)" },
    });
    if (!response.ok) {
      console.warn(`[Scraper] FanCons returned ${response.status}`);
      return "";
    }
    return await response.text();
  } catch (e) {
    console.warn(`[Scraper] FanCons fetch failed:`, e);
    return "";
  }
}

function parseFanConsHtml(html: string): InsertEvent[] {
  // FanCons has a clean table format, we can parse it without LLM
  const events: InsertEvent[] = [];
  
  // Match table rows with convention data
  // Pattern: <td>Convention Name</td><td>Dates</td><td>Venue\nCity, ST</td>
  const rowRegex = /<tr[^>]*>\s*<td[^>]*>.*?<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>.*?<\/td>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi;
  
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const name = match[2].trim();
    const dateStr = match[3].trim();
    const locationHtml = match[4].trim();
    
    // Skip cancelled/postponed events
    if (name.includes("[Cancelled]") || name.includes("[Postponed]")) continue;
    
    // Parse location: "Venue Name\nCity, ST" or "Venue Name<br>City, ST"
    const locationText = locationHtml.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim();
    const locationLines = locationText.split("\n").map(l => l.trim()).filter(Boolean);
    
    let venue = "";
    let city = "";
    let stateAbbr = "";
    let stateName = "";
    
    if (locationLines.length >= 2) {
      venue = locationLines[0];
      const cityState = locationLines[locationLines.length - 1];
      const csMatch = cityState.match(/^(.+?),\s*([A-Z]{2})$/);
      if (csMatch) {
        city = csMatch[1].trim();
        stateAbbr = csMatch[2];
        stateName = US_STATES.find(s => s.abbr === stateAbbr)?.name || "";
      }
    }
    
    if (!stateAbbr || !city) continue;
    
    // Parse dates
    const { startDate, endDate, dateDisplay } = parseDateRange(dateStr);
    if (!startDate) continue;
    
    const month = parseInt(startDate.split("-")[1]);
    
    events.push({
      name,
      eventType: "comic-con",
      tier: null, // Could be enhanced later
      dateDisplay: dateDisplay || dateStr,
      startDate,
      endDate: endDate || startDate,
      month,
      venue: venue || null,
      address: null,
      city,
      state: stateAbbr,
      stateName: stateName || null,
      hours: null,
      tableCount: null,
      admission: null,
      isFree: null,
      email: null,
      phone: null,
      website: match[1] ? `https://fancons.com${match[1]}` : null,
      description: null,
      highlights: null,
      featured: false,
      recurring: false,
      source: "fancons",
      sourceId: `fancons-${name.replace(/\s+/g, "-").toLowerCase()}-${startDate}`,
      sourceUrl: "https://fancons.com/events/schedule.php?year=2026&type=comic&loc=us",
      status: "approved",
    });
  }
  
  return events;
}

function parseDateRange(dateStr: string): { startDate: string; endDate: string; dateDisplay: string } {
  const months: Record<string, string> = {
    "January": "01", "February": "02", "March": "03", "April": "04",
    "May": "05", "June": "06", "July": "07", "August": "08",
    "September": "09", "October": "10", "November": "11", "December": "12",
  };
  
  // "March 21, 2026" or "March 21-23, 2026" or "March 28 - April 1, 2026"
  const singleMatch = dateStr.match(/(\w+)\s+(\d+),\s*(\d{4})/);
  const rangeMatch = dateStr.match(/(\w+)\s+(\d+)-(\d+),\s*(\d{4})/);
  const crossMonthMatch = dateStr.match(/(\w+)\s+(\d+)\s*[-–]\s*(\w+)\s+(\d+),\s*(\d{4})/);
  
  if (crossMonthMatch) {
    const m1 = months[crossMonthMatch[1]] || "01";
    const d1 = crossMonthMatch[2].padStart(2, "0");
    const m2 = months[crossMonthMatch[3]] || m1;
    const d2 = crossMonthMatch[4].padStart(2, "0");
    const year = crossMonthMatch[5];
    return {
      startDate: `${year}-${m1}-${d1}`,
      endDate: `${year}-${m2}-${d2}`,
      dateDisplay: dateStr,
    };
  }
  
  if (rangeMatch) {
    const m = months[rangeMatch[1]] || "01";
    const d1 = rangeMatch[2].padStart(2, "0");
    const d2 = rangeMatch[3].padStart(2, "0");
    const year = rangeMatch[4];
    return {
      startDate: `${year}-${m}-${d1}`,
      endDate: `${year}-${m}-${d2}`,
      dateDisplay: dateStr,
    };
  }
  
  if (singleMatch) {
    const m = months[singleMatch[1]] || "01";
    const d = singleMatch[2].padStart(2, "0");
    const year = singleMatch[3];
    const date = `${year}-${m}-${d}`;
    return { startDate: date, endDate: date, dateDisplay: dateStr };
  }
  
  return { startDate: "", endDate: "", dateDisplay: dateStr };
}

// ==================== DEDUPLICATION ====================

function normalizeEventName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isDuplicate(
  newEvent: InsertEvent,
  existingEvents: { sourceId: string | null; name: string; startDate: string; state: string }[]
): boolean {
  // Check by sourceId first
  if (newEvent.sourceId && existingEvents.some(e => e.sourceId === newEvent.sourceId)) {
    return true;
  }
  
  // Fuzzy match: same state + similar name + date within 3 days
  const normalizedNew = normalizeEventName(newEvent.name);
  for (const existing of existingEvents) {
    if (existing.state !== newEvent.state) continue;
    
    const normalizedExisting = normalizeEventName(existing.name);
    
    // Check name similarity (contains or Levenshtein-like)
    const nameSimilar = normalizedNew.includes(normalizedExisting) || 
                        normalizedExisting.includes(normalizedNew) ||
                        normalizedNew === normalizedExisting;
    
    if (!nameSimilar) continue;
    
    // Check date proximity (within 3 days)
    const newDate = new Date(newEvent.startDate);
    const existingDate = new Date(existing.startDate);
    const daysDiff = Math.abs((newDate.getTime() - existingDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 3) return true;
  }
  
  return false;
}

// ==================== MAIN SCRAPER ORCHESTRATOR ====================

export interface ScrapeResult {
  source: string;
  statesScraped: number;
  eventsFound: number;
  newEventsInserted: number;
  duplicatesSkipped: number;
  errors: string[];
}

export async function scrapeCardShows(stateSubset?: string[]): Promise<ScrapeResult> {
  const result: ScrapeResult = {
    source: "tcdb",
    statesScraped: 0,
    eventsFound: 0,
    newEventsInserted: 0,
    duplicatesSkipped: 0,
    errors: [],
  };

  // Get existing events for deduplication
  const existingEvents = await getEventsBySource("tcdb");
  const allExistingCardShows = await getEventsBySource("seed");
  const allExisting = [...existingEvents, ...allExistingCardShows];

  const statesToScrape = stateSubset 
    ? US_STATES.filter(s => stateSubset.includes(s.abbr))
    : US_STATES;

  const newEvents: InsertEvent[] = [];

  for (const state of statesToScrape) {
    try {
      console.log(`[Scraper] Fetching TCDB ${state.abbr}...`);
      const html = await fetchTCDBState(state.abbr, state.name);
      if (!html) continue;
      
      const events = await parseTCDBHtml(html, state.abbr, state.name);
      result.eventsFound += events.length;
      result.statesScraped++;

      for (const event of events) {
        if (isDuplicate(event, allExisting)) {
          result.duplicatesSkipped++;
        } else {
          newEvents.push(event);
          allExisting.push({
            sourceId: event.sourceId || "",
            name: event.name,
            startDate: event.startDate,
            state: event.state,
          });
        }
      }

      // Rate limit: wait 1 second between state requests
      await new Promise(r => setTimeout(r, 1000));
    } catch (e: any) {
      result.errors.push(`${state.abbr}: ${e.message}`);
    }
  }

  // Insert new events
  if (newEvents.length > 0) {
    const inserted = await insertEvents(newEvents);
    result.newEventsInserted = inserted;
  }

  return result;
}

export async function scrapeComicCons(): Promise<ScrapeResult> {
  const result: ScrapeResult = {
    source: "fancons",
    statesScraped: 1,
    eventsFound: 0,
    newEventsInserted: 0,
    duplicatesSkipped: 0,
    errors: [],
  };

  try {
    // Get existing events for deduplication
    const existingFancons = await getEventsBySource("fancons");
    const existingSeed = await getEventsBySource("seed");
    const allExisting = [...existingFancons, ...existingSeed];

    console.log("[Scraper] Fetching FanCons.com...");
    const html = await fetchFanCons();
    if (!html) {
      result.errors.push("Failed to fetch FanCons page");
      return result;
    }

    const events = parseFanConsHtml(html);
    result.eventsFound = events.length;

    const newEvents: InsertEvent[] = [];
    for (const event of events) {
      if (isDuplicate(event, allExisting)) {
        result.duplicatesSkipped++;
      } else {
        newEvents.push(event);
        allExisting.push({
          sourceId: event.sourceId || "",
          name: event.name,
          startDate: event.startDate,
          state: event.state,
        });
      }
    }

    if (newEvents.length > 0) {
      const inserted = await insertEvents(newEvents);
      result.newEventsInserted = inserted;
    }
  } catch (e: any) {
    result.errors.push(e.message);
  }

  return result;
}

export async function runFullScrape(): Promise<{ cardShows: ScrapeResult; comicCons: ScrapeResult }> {
  console.log("[Scraper] Starting full scrape...");
  console.log("[Scraper] Phase 1: Card shows from TCDB.com (50 states)...");
  const cardShows = await scrapeCardShows();
  
  console.log("[Scraper] Phase 2: Comic cons from FanCons.com...");
  const comicCons = await scrapeComicCons();
  
  console.log("[Scraper] Scrape complete!");
  console.log(`  Card shows: ${cardShows.eventsFound} found, ${cardShows.newEventsInserted} new, ${cardShows.duplicatesSkipped} duplicates`);
  console.log(`  Comic cons: ${comicCons.eventsFound} found, ${comicCons.newEventsInserted} new, ${comicCons.duplicatesSkipped} duplicates`);
  
  return { cardShows, comicCons };
}
