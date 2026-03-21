/**
 * Card Shows Directory - Comprehensive listing of sports card shows across America
 * SEO-optimized with JSON-LD structured data, full addresses, websites, and contact info
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "wouter";
import {
  Search, MapPin, Calendar, Clock, Users, DollarSign, ChevronDown, ChevronUp,
  ExternalLink, Mail, Phone, Navigation, Star, Filter, ArrowRight, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import USMapSVG from "@/components/USMapSVG";
import ComicConsSection from "@/components/ComicConsSection";
import { ALL_SHOWS, CARD_SHOWS_STATS, type CardShow } from "@/lib/cardShowsData";

// ===== CONSTANTS =====
const MONTHS = [
  { value: "all", label: "All Months" },
  { value: "3", label: "March" }, { value: "4", label: "April" },
  { value: "5", label: "May" }, { value: "6", label: "June" },
  { value: "7", label: "July" }, { value: "8", label: "August" },
  { value: "9", label: "September" }, { value: "10", label: "October" },
  { value: "11", label: "November" }, { value: "12", label: "December" },
];

const SORT_OPTIONS = [
  { value: "date", label: "Sort by Date" },
  { value: "state", label: "Sort by State" },
  { value: "name", label: "Sort by Name" },
];

// Group shows by state
function groupByState(shows: CardShow[]) {
  const groups: Record<string, { stateName: string; state: string; shows: CardShow[] }> = {};
  for (const show of shows) {
    if (!groups[show.state]) {
      groups[show.state] = { stateName: show.stateName, state: show.state, shows: [] };
    }
    groups[show.state].shows.push(show);
  }
  return Object.values(groups).sort((a, b) => a.stateName.localeCompare(b.stateName));
}

// Get unique states from shows
function getUniqueStates(shows: CardShow[]) {
  const states = new Map<string, string>();
  for (const show of shows) {
    states.set(show.state, show.stateName);
  }
  return Array.from(states.entries())
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([abbr, name]) => ({ abbr, name }));
}

// ===== JSON-LD STRUCTURED DATA =====
function cardShowsJsonLd() {
  const events = ALL_SHOWS.filter(s => s.featured).slice(0, 20).map(show => ({
    "@type": "Event",
    name: show.name,
    startDate: show.startDate,
    endDate: show.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: show.venue || show.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: show.address || undefined,
        addressLocality: show.city,
        addressRegion: show.state,
        addressCountry: "US",
      },
    },
    description: `Sports card show in ${show.city}, ${show.stateName}. ${show.tableCount ? show.tableCount + " dealer tables." : ""} ${show.isFree ? "Free admission." : show.admission ? "Admission: " + show.admission + "." : ""}`,
    isAccessibleForFree: show.isFree,
    organizer: {
      "@type": "Organization",
      name: "Northland Legendary Finds",
      url: "https://northlandlegendaryfinds.com",
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sports Card Shows Directory 2026",
    description: `Complete directory of ${CARD_SHOWS_STATS.totalShows} sports card shows across ${CARD_SHOWS_STATS.totalStates} states, March through December 2026.`,
    numberOfItems: CARD_SHOWS_STATS.totalShows,
    itemListElement: events.map((event, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: event,
    })),
  };
}

function faqJsonLd() {
  const faqs = [
    {
      q: "How do I find sports card shows near me?",
      a: "Use the search bar at the top of this directory to search by city, state, or show name. You can also click any state abbreviation in the quick-nav bar to jump directly to shows in that state. Each listing includes a 'Directions' link that opens Google Maps for easy navigation.",
    },
    {
      q: "Are sports card shows free to attend?",
      a: `Many sports card shows offer free admission — in fact, ${CARD_SHOWS_STATS.freeAdmission} of the ${CARD_SHOWS_STATS.totalShows} shows in our directory are free to attend. Shows that do charge admission typically range from $2 to $15, with some larger expos charging up to $25-$35 for multi-day passes.`,
    },
    {
      q: "What should I bring to a sports card show?",
      a: "Bring cash (many vendors prefer it), your trade binder if you want to trade, penny sleeves and top loaders to protect purchases, a backpack or bag, and a list of cards you're looking for. Some shows also accept card payments, but cash is king at most card shows.",
    },
    {
      q: "What types of cards can I find at sports card shows?",
      a: "Sports card shows feature a wide variety of trading cards including baseball, football, basketball, hockey, soccer, and non-sport cards like Pokemon, Marvel, Star Wars, and anime TCGs. You'll find vintage cards, modern releases, graded cards (PSA, BGS, SGC, AGS, CGC), autographed cards, game-used memorabilia cards, and sealed hobby boxes and packs.",
    },
    {
      q: "How often is this card show directory updated?",
      a: "This directory is compiled from Sports Collectors Digest, TCDB.com, and major show promoters. We update it regularly as new shows are announced. You can also submit your own show using the 'Submit Your Show' form. Always verify dates and details with the show organizer before attending, as schedules can change.",
    },
    {
      q: "What is the biggest sports card show in 2026?",
      a: "The 46th National Sports Collectors Convention (NSCC) is the biggest card show of 2026, taking place July 29 - August 3 at the Donald E. Stephens Convention Center in Rosemont, Illinois. It features 2,000+ dealer tables and is the premier event in the hobby.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// ===== SHOW CARD COMPONENT =====
function ShowCard({ show }: { show: CardShow }) {
  const startDate = new Date(show.startDate + "T12:00:00");
  const monthShort = startDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = startDate.getDate();

  const mapsUrl = show.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(show.address + ", " + show.city + ", " + show.state)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(show.city + ", " + show.state)}`;

  return (
    <div className={`relative rounded-xl border transition-all duration-200 hover:shadow-lg ${
      show.featured
        ? "border-orange-500/40 bg-gradient-to-br from-orange-500/5 via-card to-card hover:border-orange-500/60"
        : "border-border bg-card hover:border-primary/40"
    }`}>
      {show.featured && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs font-bold">
            <Star className="w-3 h-3 mr-1 fill-orange-400" /> FEATURED
          </Badge>
        </div>
      )}

      <div className="p-5 flex gap-4">
        {/* Date badge */}
        <div className={`flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center text-center ${
          show.featured ? "bg-orange-500/15 border border-orange-500/30" : "bg-primary/10 border border-primary/30"
        }`}>
          <span className={`text-xs font-bold tracking-wider ${show.featured ? "text-orange-400" : "text-primary"}`}>
            {monthShort}
          </span>
          <span className="text-xl font-bold text-foreground">{day}</span>
        </div>

        {/* Show details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-base leading-tight mb-1 pr-24" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.02em" }}>
            {show.name.toUpperCase()}
          </h3>

          <p className="text-sm text-muted-foreground mb-2">
            <Calendar className="w-3.5 h-3.5 inline mr-1 opacity-60" />
            {show.dateDisplay}
          </p>

          {/* Venue */}
          {show.venue && (
            <p className="text-sm text-foreground/80 mb-1">{show.venue}</p>
          )}

          {/* Address */}
          {show.address && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary/80 hover:text-primary transition-colors inline-flex items-center gap-1 mb-2"
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="underline underline-offset-2">{show.address}</span>
            </a>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
            {show.hours && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> {show.hours}
              </span>
            )}
            {show.tableCount && (
              <span className="inline-flex items-center gap-1">
                <Users className="w-3 h-3" /> {show.tableCount} tables
              </span>
            )}
            {show.admission && (
              <span className={`inline-flex items-center gap-1 font-semibold ${show.isFree ? "text-emerald-400" : "text-foreground/70"}`}>
                <DollarSign className="w-3 h-3" /> {show.isFree ? "FREE Admission" : show.admission}
              </span>
            )}
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-2 mt-3">
            {show.website && (
              <a
                href={show.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
              >
                <ExternalLink className="w-3 h-3" /> Website
              </a>
            )}
            {show.email && (
              <a
                href={`mailto:${show.email}`}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
              >
                <Mail className="w-3 h-3" /> Email
              </a>
            )}
            {show.phone && (
              <a
                href={`tel:${show.phone}`}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/20"
              >
                <Phone className="w-3 h-3" /> {show.phone}
              </a>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
            >
              <Navigation className="w-3 h-3" /> Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== STATE SECTION COMPONENT =====
function StateSection({
  stateName,
  stateAbbr,
  shows,
  isExpanded,
  onToggle,
}: {
  stateName: string;
  stateAbbr: string;
  shows: CardShow[];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const featuredCount = shows.filter(s => s.featured).length;
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={sectionRef} id={`state-${stateAbbr}`} className="scroll-mt-40">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-200 group"
      >
        <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
          {stateAbbr}
        </div>
        <div className="flex-1 text-left">
          <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.03em" }}>
            {stateName.toUpperCase()}
          </h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{shows.length} show{shows.length !== 1 ? "s" : ""}</span>
            {featuredCount > 0 && (
              <span className="text-orange-400 font-semibold">{featuredCount} featured</span>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3 pl-2">
          {shows.map((show, i) => (
            <ShowCard key={`${show.state}-${show.startDate}-${i}`} show={show} />
          ))}
        </div>
      )}
    </div>
  );
}

// ===== MAIN PAGE COMPONENT =====
export default function CardShows() {
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());

  // Filter and sort shows
  const filteredShows = useMemo(() => {
    let result = [...ALL_SHOWS];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.stateName.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q) ||
          (s.venue && s.venue.toLowerCase().includes(q)) ||
          (s.address && s.address.toLowerCase().includes(q))
      );
    }

    // Month filter
    if (monthFilter !== "all") {
      const month = parseInt(monthFilter);
      result = result.filter(s => s.month === month);
    }

    // Sort
    if (sortBy === "date") {
      result.sort((a, b) => a.startDate.localeCompare(b.startDate));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => a.stateName.localeCompare(b.stateName) || a.startDate.localeCompare(b.startDate));
    }

    return result;
  }, [search, monthFilter, sortBy]);

  const stateGroups = useMemo(() => groupByState(filteredShows), [filteredShows]);
  const uniqueStates = useMemo(() => getUniqueStates(filteredShows), [filteredShows]);
  const statesWithShows = useMemo(() => uniqueStates.map(s => s.abbr), [uniqueStates]);

  const toggleState = (state: string) => {
    setExpandedStates(prev => {
      const next = new Set(prev);
      if (next.has(state)) next.delete(state);
      else next.add(state);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedStates(new Set(stateGroups.map(g => g.state)));
  };

  const collapseAll = () => {
    setExpandedStates(new Set());
  };

  const scrollToState = (abbr: string) => {
    setExpandedStates(prev => new Set([...Array.from(prev), abbr]));
    setTimeout(() => {
      document.getElementById(`state-${abbr}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Sports Card Shows Directory 2026 — Find Card Shows Near You"
        description={`Complete directory of ${CARD_SHOWS_STATS.totalShows} sports card shows across ${CARD_SHOWS_STATS.totalStates} states. Find card shows near you with full addresses, websites, and contact info. March through December 2026.`}
        path="/card-shows"
        jsonLd={[cardShowsJsonLd(), faqJsonLd()]}
      />

      {/* ===== HERO WITH US MAP ===== */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        <div className="container relative z-10">
          {/* Map container with text overlay */}
          <div className="relative max-w-5xl mx-auto">
            {/* US Map as background */}
            <div className="relative">
              <USMapSVG
                className="w-full h-auto text-primary opacity-100"
                highlightedStates={statesWithShows}
                onStateClick={(stateId) => {
                  const el = document.getElementById(`state-${stateId}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Auto-expand the state
                    setExpandedStates(prev => {
                      const next = new Set(prev);
                      next.add(stateId);
                      return next;
                    });
                  }
                }}
              />

              {/* Text overlay centered on the map */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background/80 backdrop-blur-sm border border-primary/30 rounded-full mb-4">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-primary text-sm font-bold tracking-wide">2026 SHOW DIRECTORY</span>
                </div>

                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.9] mb-4"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  <span className="text-primary drop-shadow-[0_2px_10px_rgba(34,197,94,0.3)]">CARD SHOWS</span>
                  <br />
                  <span
                    className="bg-clip-text text-transparent drop-shadow-lg"
                    style={{
                      backgroundImage: "linear-gradient(135deg, #f97316, #eab308, #22c55e)",
                    }}
                  >
                    ACROSS AMERICA
                  </span>
                </h1>

                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl mx-auto mb-4 bg-background/60 backdrop-blur-sm rounded-lg px-4 py-2">
                  Your complete directory of sports card shows, trading card expos, and collectibles conventions
                  in the lower 48 states. Click any state on the map to jump to shows.
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-4 bg-background/70 backdrop-blur-sm rounded-xl px-6 py-3">
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xl sm:text-2xl font-bold text-primary">{CARD_SHOWS_STATS.totalStates}</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">States</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Calendar className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-xl sm:text-2xl font-bold text-orange-400">{CARD_SHOWS_STATS.totalShows}</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Shows</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xl sm:text-2xl font-bold text-emerald-400">{CARD_SHOWS_STATS.freeAdmission}</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Free</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xl sm:text-2xl font-bold text-blue-400">Mar–Dec</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">2026</span>
                  </div>
                </div>

                {/* Submit CTA */}
                <Link href="/submit-show">
                  <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10 bg-background/70 backdrop-blur-sm">
                    <Plus className="w-4 h-4 mr-2" /> Submit Your Show
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEARCH & FILTERS ===== */}
      <div className="sticky top-[64px] z-30 bg-background/95 backdrop-blur-md border-b border-border py-3">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search shows, cities, states, venues..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-[140px] bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map(m => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={expandAll} className="hidden sm:flex text-xs">
                Expand All
              </Button>
              <Button variant="ghost" size="sm" onClick={collapseAll} className="hidden sm:flex text-xs">
                Collapse
              </Button>
            </div>
          </div>

          {/* Result count */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              {filteredShows.length} show{filteredShows.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex sm:hidden gap-2">
              <Button variant="outline" size="sm" onClick={expandAll} className="text-xs h-7 px-2">
                Expand All
              </Button>
              <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs h-7 px-2">
                Collapse
              </Button>
            </div>
          </div>

          {/* State quick-nav */}
          <div className="flex flex-wrap gap-1 mt-2">
            {uniqueStates.map(s => (
              <button
                key={s.abbr}
                onClick={() => scrollToState(s.abbr)}
                title={s.name}
                className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-card border border-border hover:border-primary/50 hover:text-primary transition-colors text-muted-foreground"
              >
                {s.abbr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== STATE SECTIONS ===== */}
      <section className="py-8">
        <div className="container space-y-4">
          {stateGroups.map(group => (
            <StateSection
              key={group.state}
              stateName={group.stateName}
              stateAbbr={group.state}
              shows={group.shows}
              isExpanded={expandedStates.has(group.state)}
              onToggle={() => toggleState(group.state)}
            />
          ))}

          {stateGroups.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No shows found matching your search.</p>
              <p className="text-muted-foreground/60 text-sm mt-1">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== SUBMIT YOUR SHOW CTA ===== */}
      <section className="py-12 bg-card/50 border-y border-border">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            HAVE A SHOW TO <span className="text-primary">ADD?</span>
          </h2>
          <p className="text-muted-foreground mb-6">
            Are you a show promoter or organizer? Submit your card show to our directory and reach thousands of collectors looking for events near them.
          </p>
          <Link href="/submit-show">
            <Button size="lg" className="bg-primary hover:bg-primary/90 font-bold text-lg px-8">
              <Plus className="w-5 h-5 mr-2" /> Submit Your Show
            </Button>
          </Link>
        </div>
      </section>

      {/* ===== COMIC CONS & COLLECTIBLE EVENTS SECTION ===== */}
      <ComicConsSection />

      {/* ===== SEO CONTENT ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
            Find Sports Card Shows <span className="text-primary">Near You</span> in 2026
          </h2>

          <div className="prose prose-invert prose-green max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>
              Whether you are a seasoned collector hunting for vintage gems or a newcomer exploring the hobby,
              attending a sports card show is one of the best ways to buy, sell, and trade cards in person.
              Our comprehensive directory lists <strong className="text-foreground">{CARD_SHOWS_STATS.totalShows} card shows
              across {CARD_SHOWS_STATS.totalStates} states</strong> from March through December 2026, making it easy to find events near you.
            </p>
            <p>
              Sports card shows range from small local gatherings with 20-30 tables to massive multi-day expos
              featuring 500+ dealers. The highlight of the 2026 show calendar is the <strong className="text-foreground">46th
              National Sports Collectors Convention (NSCC)</strong> in Rosemont, Illinois, with over 2,000 dealer tables.
              Other major events include the Dallas Card Show, Front Row Card Shows touring multiple cities,
              and regional favorites like the Pittsburgh 500 and Baltimore Card Show.
            </p>
            <p>
              At card shows you will find everything from modern releases like 2025 Topps Chrome and Panini Prizm
              to vintage treasures from the 1950s-1980s. Many shows also feature Pokemon, Marvel, Star Wars,
              and other trading card games. Grading companies like PSA, BGS, SGC, AGS, and CGC often have
              on-site submission services at larger events.
            </p>
            <p>
              <strong className="text-foreground">{CARD_SHOWS_STATS.freeAdmission} shows in our directory offer free admission</strong>,
              making it easy to explore the hobby without any upfront cost. Each listing includes the venue address
              with a Google Maps link for directions, show hours, table counts, admission prices, and direct
              contact information including websites, email, and phone numbers.
            </p>
            <p>
              This directory is brought to you by <strong className="text-foreground">Northland Legendary Finds</strong>,
              your source for premium Marvel trading card repacks. Whether you are attending a show in person
              or shopping online, we are here to help you find the cards you love. See you at the next show!
            </p>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16 bg-card/30 border-t border-border">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ fontFamily: "'Anton', sans-serif" }}>
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "How do I find sports card shows near me?",
                a: "Use the search bar at the top of this directory to search by city, state, or show name. You can also click any state abbreviation in the quick-nav bar to jump directly to shows in that state. Each listing includes a 'Directions' link that opens Google Maps for easy navigation.",
              },
              {
                q: "Are sports card shows free to attend?",
                a: `Many sports card shows offer free admission — in fact, ${CARD_SHOWS_STATS.freeAdmission} of the ${CARD_SHOWS_STATS.totalShows} shows in our directory are free to attend. Shows that do charge admission typically range from $2 to $15, with some larger expos charging up to $25-$35 for multi-day passes.`,
              },
              {
                q: "What should I bring to a sports card show?",
                a: "Bring cash (many vendors prefer it), your trade binder if you want to trade, penny sleeves and top loaders to protect purchases, a backpack or bag, and a list of cards you're looking for. Some shows also accept card payments, but cash is king at most card shows.",
              },
              {
                q: "What types of cards can I find at sports card shows?",
                a: "Sports card shows feature a wide variety of trading cards including baseball, football, basketball, hockey, soccer, and non-sport cards like Pokemon, Marvel, Star Wars, and anime TCGs. You'll find vintage cards, modern releases, graded cards (PSA, BGS, SGC, AGS, CGC), autographed cards, game-used memorabilia cards, and sealed hobby boxes and packs.",
              },
              {
                q: "How often is this card show directory updated?",
                a: "This directory is compiled from Sports Collectors Digest, TCDB.com, and major show promoters. We update it regularly as new shows are announced. You can also submit your own show using the 'Submit Your Show' form. Always verify dates and details with the show organizer before attending.",
              },
              {
                q: "What is the biggest sports card show in 2026?",
                a: "The 46th National Sports Collectors Convention (NSCC) is the biggest card show of 2026, taking place July 29 - August 3 at the Donald E. Stephens Convention Center in Rosemont, Illinois. It features 2,000+ dealer tables and is the premier event in the hobby.",
              },
            ].map((faq, i) => (
              <div key={i} className="border border-border rounded-lg p-5">
                <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER NOTE ===== */}
      <section className="py-8 border-t border-border">
        <div className="container max-w-4xl text-center">
          <p className="text-xs text-muted-foreground/60">
            Show information compiled from Sports Collectors Digest, TCDB.com, and major show promoters.
            Dates, times, and details are subject to change — always verify with the show organizer before attending.
            Have a show to add?{" "}
            <Link href="/submit-show" className="text-primary hover:underline">
              Submit it here
            </Link>
            .
          </p>
          <p className="text-xs text-muted-foreground/40 mt-2">
            Last updated: March 2026 | Covers March 1 - December 31, 2026
          </p>
        </div>
      </section>
    </div>
  );
}
