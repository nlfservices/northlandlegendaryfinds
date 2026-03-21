/**
 * Comic Cons & Collectible Events Section
 * Visually distinct section for the Card Shows page with purple/blue accent theme
 * Separate from the green-themed card shows section above
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  Search, MapPin, Calendar, ChevronDown, ChevronUp,
  ExternalLink, Star, Sparkles, Trophy, Globe, Ticket,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  comicConEvents,
  searchComicCons,
  getUniqueStates,
  TIER_LABELS,
  TYPE_LABELS,
  type ComicConEvent,
} from "@/lib/comicCons";

// ===== CONSTANTS =====
const MONTHS = [
  { value: "all", label: "All Months" },
  { value: "3", label: "March" }, { value: "4", label: "April" },
  { value: "5", label: "May" }, { value: "6", label: "June" },
  { value: "7", label: "July" }, { value: "8", label: "August" },
  { value: "9", label: "September" }, { value: "10", label: "October" },
  { value: "11", label: "November" }, { value: "12", label: "December" },
];

const TIER_FILTERS = [
  { value: "all", label: "All Tiers" },
  { value: "1", label: "National (Tier 1)" },
  { value: "2", label: "Major Regional (Tier 2)" },
  { value: "3", label: "Regional (Tier 3)" },
  { value: "4", label: "Local (Tier 4)" },
];

const TYPE_FILTERS = [
  { value: "all", label: "All Types" },
  { value: "comic-con", label: "Comic Cons" },
  { value: "pop-culture", label: "Pop Culture" },
  { value: "anime-gaming", label: "Anime & Gaming" },
  { value: "collectibles", label: "Collectibles" },
  { value: "card-show", label: "Card Shows" },
];

// ===== EVENT CARD COMPONENT =====
function EventCard({ event }: { event: ComicConEvent }) {
  const startDate = new Date(event.startDate + "T12:00:00");
  const monthShort = startDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = startDate.getDate();

  const tierInfo = TIER_LABELS[event.tier];
  const typeInfo = TYPE_LABELS[event.type];

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.name + " " + event.city + ", " + event.stateAbbr)}`;

  return (
    <div className={`relative rounded-xl border transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/5 ${
      event.tier === 1
        ? "border-yellow-500/40 bg-gradient-to-br from-yellow-500/5 via-card to-card hover:border-yellow-500/60"
        : event.tier === 2
        ? "border-purple-500/30 bg-gradient-to-br from-purple-500/5 via-card to-card hover:border-purple-500/50"
        : "border-border bg-card hover:border-purple-400/40"
    }`}>
      {/* Tier badge */}
      {event.tier <= 2 && (
        <div className="absolute top-3 right-3">
          <Badge className={`text-xs font-bold ${
            event.tier === 1
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              : "bg-purple-500/20 text-purple-300 border-purple-500/30"
          }`}>
            {event.tier === 1 ? <Trophy className="w-3 h-3 mr-1" /> : <Star className="w-3 h-3 mr-1" />}
            {tierInfo.label.toUpperCase()}
          </Badge>
        </div>
      )}

      <div className="p-5 flex gap-4">
        {/* Date badge */}
        <div className={`flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center text-center ${
          event.tier === 1
            ? "bg-yellow-500/15 border border-yellow-500/30"
            : "bg-purple-500/10 border border-purple-500/30"
        }`}>
          <span className={`text-xs font-bold tracking-wider ${
            event.tier === 1 ? "text-yellow-400" : "text-purple-400"
          }`}>
            {monthShort}
          </span>
          <span className="text-xl font-bold text-foreground">{day}</span>
        </div>

        {/* Event details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-base leading-tight mb-1 pr-24" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.02em" }}>
            {event.name.toUpperCase()}
          </h3>

          <p className="text-sm text-muted-foreground mb-1">
            <Calendar className="w-3.5 h-3.5 inline mr-1 opacity-60" />
            {event.dates}
          </p>

          <p className="text-sm text-foreground/80 mb-2">
            <MapPin className="w-3.5 h-3.5 inline mr-1 opacity-60" />
            {event.city}, {event.stateAbbr}
          </p>

          {/* Description */}
          <p className="text-xs text-muted-foreground/80 leading-relaxed mb-3 line-clamp-2">
            {event.description}
          </p>

          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-full border font-medium ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
            <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-full border font-medium ${
              event.tier === 1 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
              event.tier === 2 ? "bg-purple-500/10 text-purple-300 border-purple-500/20" :
              event.tier === 3 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
              "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            }`}>
              {tierInfo.emoji} Tier {event.tier}
            </span>
          </div>

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {event.highlights.slice(0, 4).map((h, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground border border-border/50">
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {event.website && (
              <a
                href={event.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/20"
              >
                <Globe className="w-3 h-3" /> Website
              </a>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
            >
              <MapPin className="w-3 h-3" /> Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN SECTION COMPONENT =====
export default function ComicConsSection() {
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  // Fetch comic cons from database
  const { data: dbEvents } = trpc.public.events.list.useQuery(
    { eventType: "comic-con" },
    { staleTime: 5 * 60 * 1000 }
  );

  // Convert DB events to ComicConEvent format, falling back to static data
  const allEvents: ComicConEvent[] = useMemo(() => {
    if (dbEvents && dbEvents.length > 0) {
      return dbEvents.map((e: any): ComicConEvent => ({
        name: e.name,
        startDate: e.startDate,
        endDate: e.endDate,
        dates: e.dateDisplay || '',
        city: e.city,
        stateAbbr: e.state,
        state: e.stateName || '',
        description: e.description || '',
        website: e.website || undefined,
        tier: (e.tier || 4) as 1 | 2 | 3 | 4,
        type: (e.eventSubtype || 'comic-con') as ComicConEvent['type'],
        highlights: e.highlights ? (typeof e.highlights === 'string' ? JSON.parse(e.highlights) : e.highlights) : [],
      }));
    }
    return comicConEvents;
  }, [dbEvents]);

  const uniqueStates = useMemo(() => {
    const states = new Map<string, string>();
    for (const e of allEvents) {
      states.set(e.stateAbbr, e.state);
    }
    return Array.from(states.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([abbr, name]) => ({ abbr, name }));
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    let result = search.trim()
      ? allEvents.filter(e => {
          const q = search.toLowerCase();
          return e.name.toLowerCase().includes(q) ||
            e.city.toLowerCase().includes(q) ||
            e.state.toLowerCase().includes(q) ||
            e.stateAbbr.toLowerCase().includes(q) ||
            (e.description && e.description.toLowerCase().includes(q));
        })
      : [...allEvents];

    // Month filter
    if (monthFilter !== "all") {
      const month = parseInt(monthFilter);
      result = result.filter(e => {
        const m = parseInt(e.startDate.split("-")[1]);
        return m === month;
      });
    }

    // Tier filter
    if (tierFilter !== "all") {
      const tier = parseInt(tierFilter);
      result = result.filter(e => e.tier === tier);
    }

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter(e => e.type === typeFilter);
    }

    // State filter
    if (stateFilter !== "all") {
      result = result.filter(e => e.stateAbbr === stateFilter);
    }

    // Sort by tier first (Tier 1 on top), then by date
    result.sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return a.startDate.localeCompare(b.startDate);
    });

    return result;
  }, [search, monthFilter, tierFilter, typeFilter, stateFilter]);

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 24);
  const hasMore = filteredEvents.length > 24 && !showAll;

  // Stats
  const totalEvents = comicConEvents.length;
  const tier1Count = comicConEvents.filter(e => e.tier === 1).length;
  const tier2Count = comicConEvents.filter(e => e.tier === 2).length;
  const stateCount = uniqueStates.length;

  return (
    <>
      {/* ===== DIVIDER ===== */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-purple-500/30" />
        </div>
        <div className="relative flex justify-center">
          <div className="bg-background px-6 py-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-bold text-purple-400 tracking-wider uppercase">New Section</span>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      </div>

      {/* ===== COMIC CONS HERO ===== */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        {/* Purple gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/8 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />

        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full mb-4">
            <Ticket className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-bold tracking-wide">2026 EVENT GUIDE</span>
          </div>

          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.9] mb-4"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            <span className="text-purple-400 drop-shadow-[0_2px_10px_rgba(168,85,247,0.3)]">COMIC CONS</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #a855f7, #6366f1, #3b82f6)",
              }}
            >
              & COLLECTIBLE EVENTS
            </span>
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-6">
            Your guide to comic conventions, pop culture expos, and collectible events across the United States.
            From SDCC to your local comic con — find your next adventure.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Ticket className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xl sm:text-2xl font-bold text-purple-400">{totalEvents}</span>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Events</span>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xl sm:text-2xl font-bold text-blue-400">{stateCount}</span>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground">States</span>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xl sm:text-2xl font-bold text-yellow-400">{tier1Count}</span>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground">National</span>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Star className="w-3.5 h-3.5 text-purple-300" />
                <span className="text-xl sm:text-2xl font-bold text-purple-300">{tier2Count}</span>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Major Regional</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEARCH & FILTERS ===== */}
      <div className="sticky top-[64px] z-30 bg-background/95 backdrop-blur-md border-y border-purple-500/20 py-3">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events, cities, states..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-card border-border focus-visible:ring-purple-500/50"
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-[120px] bg-card text-xs">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {uniqueStates.map(s => (
                    <SelectItem key={s.abbr} value={s.abbr}>{s.name} ({s.abbr})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-[120px] bg-card text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map(m => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-[140px] bg-card text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIER_FILTERS.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px] bg-card text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_FILTERS.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Result count */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
            </p>
            {(search || monthFilter !== "all" || tierFilter !== "all" || typeFilter !== "all" || stateFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-purple-400 hover:text-purple-300 h-7"
                onClick={() => {
                  setSearch("");
                  setMonthFilter("all");
                  setTierFilter("all");
                  setTypeFilter("all");
                  setStateFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ===== EVENT CARDS ===== */}
      <section className="py-8">
        <div className="container">
          <div className="grid gap-4 md:grid-cols-2">
            {displayedEvents.map((event, i) => (
              <EventCard key={`${event.stateAbbr}-${event.startDate}-${i}`} event={event} />
            ))}
          </div>

          {displayedEvents.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No events found matching your filters.</p>
              <p className="text-muted-foreground/60 text-sm mt-1">Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {hasMore && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAll(true)}
                className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10"
              >
                Show All {filteredEvents.length} Events
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {showAll && filteredEvents.length > 24 && (
            <div className="text-center mt-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(false)}
                className="text-muted-foreground hover:text-purple-400"
              >
                Show Less
                <ChevronUp className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ===== TIER LEGEND ===== */}
      <section className="py-8 bg-card/30 border-y border-border">
        <div className="container max-w-4xl">
          <h3 className="text-lg font-bold mb-4 text-center" style={{ fontFamily: "'Anton', sans-serif" }}>
            EVENT <span className="text-purple-400">TIER GUIDE</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(tier => {
              const info = TIER_LABELS[tier];
              const count = comicConEvents.filter(e => e.tier === tier).length;
              return (
                <div key={tier} className="text-center p-4 rounded-lg border border-border bg-card/50">
                  <div className="text-2xl mb-1">{info.emoji}</div>
                  <div className={`font-bold text-sm ${info.color}`}>Tier {tier}: {info.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{count} events</div>
                  <div className="text-[10px] text-muted-foreground/60 mt-1">
                    {tier === 1 && "SDCC, NYCC, C2E2, MegaCon, ECCC, WonderCon"}
                    {tier === 2 && "Dragon Con, HeroesCon, GalaxyCon circuit, Fan Expo"}
                    {tier === 3 && "Growing regional cons, niche events"}
                    {tier === 4 && "Local shows, one-day events, recurring meets"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SEO CONTENT ===== */}
      <section className="py-12">
        <div className="container max-w-4xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
            Your Guide to <span className="text-purple-400">Comic Cons</span> in 2026
          </h3>

          <div className="prose prose-invert prose-purple max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>
              Comic conventions are more than just events — they are pilgrimages for fans of comics, collectibles, and pop culture.
              Whether you are hunting for rare variant covers, getting your graded slabs signed by the artist, or just soaking in
              the cosplay and energy, there is a con for every level of fandom.
            </p>
            <p>
              Our 2026 guide covers <strong className="text-foreground">{totalEvents} events across {stateCount} states</strong>,
              from the massive <strong className="text-foreground">San Diego Comic-Con</strong> and <strong className="text-foreground">New York Comic Con</strong> to
              growing regional favorites like <strong className="text-foreground">GalaxyCon</strong>'s traveling circuit and
              <strong className="text-foreground"> Fan Expo</strong>'s multi-city events. We have organized every event into
              four tiers so you can quickly identify which cons are worth the trip.
            </p>
            <p>
              For trading card collectors, comic cons offer unique opportunities to find exclusive variants, meet artists who
              design card sets, and discover dealers with inventory you will not find online. Many larger cons feature dedicated
              collectibles sections with grading companies offering on-site submissions. If you are a Marvel card collector,
              conventions are the perfect place to find chase cards, artist proofs, and one-of-one sketch cards.
            </p>
            <p>
              <strong className="text-foreground">Pro tip:</strong> Pair a comic con visit with a nearby card show from our
              directory above for the ultimate collector weekend. Many cities host both types of events on the same weekends.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER NOTE ===== */}
      <section className="py-6 border-t border-border">
        <div className="container max-w-4xl text-center">
          <p className="text-xs text-muted-foreground/60">
            Event information compiled from comicconventionlist.com, upcomingcons.com, conventionscene.com, and thepopverse.com.
            Dates and details are subject to change — always verify with the event organizer before attending.
          </p>
          <p className="text-xs text-muted-foreground/40 mt-2">
            Last updated: March 2026 | Covers March - December 2026
          </p>
        </div>
      </section>
    </>
  );
}
