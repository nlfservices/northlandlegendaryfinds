/**
 * Card Shows Directory - Comprehensive listing of sports card shows across America
 * SEO-optimized with JSON-LD structured data, full addresses, websites, and contact info
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "wouter";
import {
  Search, MapPin, Calendar, Clock, Users, DollarSign, ChevronDown, ChevronUp,
  ExternalLink, Mail, Phone, Navigation, Star, Filter, ArrowRight, Plus,
  Ticket, Sparkles, Trophy, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import USMapSVG from "@/components/USMapSVG";
import ComicConsSection from "@/components/ComicConsSection";
import { ALL_SHOWS, CARD_SHOWS_STATS, type CardShow } from "@/lib/cardShowsData";
import {
  comicConEvents,
  searchComicCons,
  getUniqueStates as getComicConStates,
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

// ===== TAB TYPE =====
type ActiveTab = "card-shows" | "comic-cons";

// ===== COMIC CON CONSTANTS =====
const CC_TIER_FILTERS = [
  { value: "all", label: "All Tiers" },
  { value: "1", label: "National (Tier 1)" },
  { value: "2", label: "Major Regional (Tier 2)" },
  { value: "3", label: "Regional (Tier 3)" },
  { value: "4", label: "Local (Tier 4)" },
];

const CC_TYPE_FILTERS = [
  { value: "all", label: "All Types" },
  { value: "comic-con", label: "Comic Cons" },
  { value: "pop-culture", label: "Pop Culture" },
  { value: "anime-gaming", label: "Anime & Gaming" },
  { value: "collectibles", label: "Collectibles" },
  { value: "card-show", label: "Card Shows" },
];

// ===== COMIC CON EVENT CARD (inline) =====
function ComicConEventCard({ event }: { event: ComicConEvent }) {
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
          <p className="text-xs text-muted-foreground/80 leading-relaxed mb-3 line-clamp-2">
            {event.description}
          </p>
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
          {event.highlights && event.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {event.highlights.slice(0, 4).map((h, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground border border-border/50">
                  {h}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {event.website && (
              <a href={event.website} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/20">
                <Globe className="w-3 h-3" /> Website
              </a>
            )}
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20">
              <MapPin className="w-3 h-3" /> Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN PAGE COMPONENT =====
export default function CardShows() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("card-shows");
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());

  // Comic con state
  const [ccSearch, setCcSearch] = useState("");
  const [ccMonthFilter, setCcMonthFilter] = useState("all");
  const [ccTierFilter, setCcTierFilter] = useState("all");
  const [ccTypeFilter, setCcTypeFilter] = useState("all");
  const [ccStateFilter, setCcStateFilter] = useState("all");
  const [ccShowAll, setCcShowAll] = useState(false);

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

  // ===== COMIC CON FILTERING =====
  const ccUniqueStates = useMemo(() => getComicConStates(), []);

  const ccFilteredEvents = useMemo(() => {
    let result = ccSearch.trim() ? searchComicCons(ccSearch) : [...comicConEvents];
    if (ccMonthFilter !== "all") {
      const month = parseInt(ccMonthFilter);
      result = result.filter(e => parseInt(e.startDate.split("-")[1]) === month);
    }
    if (ccTierFilter !== "all") {
      result = result.filter(e => e.tier === parseInt(ccTierFilter));
    }
    if (ccTypeFilter !== "all") {
      result = result.filter(e => e.type === ccTypeFilter);
    }
    if (ccStateFilter !== "all") {
      result = result.filter(e => e.stateAbbr === ccStateFilter);
    }
    result.sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return a.startDate.localeCompare(b.startDate);
    });
    return result;
  }, [ccSearch, ccMonthFilter, ccTierFilter, ccTypeFilter, ccStateFilter]);

  const ccDisplayedEvents = ccShowAll ? ccFilteredEvents : ccFilteredEvents.slice(0, 24);
  const ccHasMore = ccFilteredEvents.length > 24 && !ccShowAll;
  const ccTotalEvents = comicConEvents.length;
  const ccTier1Count = comicConEvents.filter(e => e.tier === 1).length;
  const ccTier2Count = comicConEvents.filter(e => e.tier === 2).length;
  const ccStateCount = ccUniqueStates.length;

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
        {/* Gradient background that shifts with active tab */}
        <div className={`absolute inset-0 transition-colors duration-500 ${
          activeTab === "card-shows"
            ? "bg-gradient-to-b from-primary/5 via-transparent to-transparent"
            : "bg-gradient-to-b from-purple-500/8 via-transparent to-transparent"
        }`} />
        {activeTab === "comic-cons" && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
        )}

        <div className="container relative z-10">
          <div className="relative max-w-5xl mx-auto">
            {/* US Map as background (always visible) */}
            <div className="relative">
              <USMapSVG
                className={`w-full h-auto transition-colors duration-500 ${
                  activeTab === "card-shows" ? "text-primary opacity-100" : "text-purple-500 opacity-80"
                }`}
                highlightedStates={statesWithShows}
                onStateClick={(stateId) => {
                  if (activeTab === "card-shows") {
                    const el = document.getElementById(`state-${stateId}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setExpandedStates(prev => {
                        const next = new Set(prev);
                        next.add(stateId);
                        return next;
                      });
                    }
                  }
                }}
              />

              {/* Text overlay centered on the map */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 bg-background/80 backdrop-blur-sm border rounded-full mb-4 transition-colors duration-300 ${
                  activeTab === "card-shows" ? "border-primary/30" : "border-purple-500/30"
                }`}>
                  {activeTab === "card-shows" ? (
                    <Calendar className="w-4 h-4 text-primary" />
                  ) : (
                    <Ticket className="w-4 h-4 text-purple-400" />
                  )}
                  <span className={`text-sm font-bold tracking-wide ${
                    activeTab === "card-shows" ? "text-primary" : "text-purple-400"
                  }`}>
                    2026 EVENT DIRECTORY
                  </span>
                </div>

                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.9] mb-4"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  <span className={`drop-shadow-lg ${
                    activeTab === "card-shows"
                      ? "text-primary drop-shadow-[0_2px_10px_rgba(34,197,94,0.3)]"
                      : "text-purple-400 drop-shadow-[0_2px_10px_rgba(168,85,247,0.3)]"
                  }`}>
                    {activeTab === "card-shows" ? "CARD SHOWS" : "COMIC CONS"}
                  </span>
                  <br />
                  <span
                    className="bg-clip-text text-transparent drop-shadow-lg"
                    style={{
                      backgroundImage: activeTab === "card-shows"
                        ? "linear-gradient(135deg, #f97316, #eab308, #22c55e)"
                        : "linear-gradient(135deg, #a855f7, #6366f1, #3b82f6)",
                    }}
                  >
                    {activeTab === "card-shows" ? "& COLLECTIBLE EVENTS" : "& POP CULTURE EVENTS"}
                  </span>
                </h1>

                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl mx-auto mb-4 bg-background/60 backdrop-blur-sm rounded-lg px-4 py-2">
                  {activeTab === "card-shows"
                    ? "Your complete directory of sports card shows, trading card expos, and collectibles conventions in the lower 48 states."
                    : "Your guide to comic conventions, pop culture expos, and collectible events across the United States."}
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-4 bg-background/70 backdrop-blur-sm rounded-xl px-6 py-3">
                  {activeTab === "card-shows" ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Ticket className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-xl sm:text-2xl font-bold text-purple-400">{ccTotalEvents}</span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">Events</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-xl sm:text-2xl font-bold text-blue-400">{ccStateCount}</span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">States</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                          <span className="text-xl sm:text-2xl font-bold text-yellow-400">{ccTier1Count}</span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">National</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Star className="w-3.5 h-3.5 text-purple-300" />
                          <span className="text-xl sm:text-2xl font-bold text-purple-300">{ccTier2Count}</span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">Major Regional</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Submit CTA (card shows only) */}
                {activeTab === "card-shows" && (
                  <Link href="/submit-show">
                    <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10 bg-background/70 backdrop-blur-sm">
                      <Plus className="w-4 h-4 mr-2" /> Submit Your Show
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TAB SWITCHER ===== */}
      <div className="sticky top-[64px] z-40 bg-background border-b border-border">
        <div className="container">
          <div className="flex">
            <button
              onClick={() => setActiveTab("card-shows")}
              className={`flex-1 sm:flex-none px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === "card-shows"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.05em" }}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              CARD SHOWS
              <span className="ml-2 text-xs font-normal opacity-70">({CARD_SHOWS_STATS.totalShows})</span>
            </button>
            <button
              onClick={() => setActiveTab("comic-cons")}
              className={`flex-1 sm:flex-none px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                activeTab === "comic-cons"
                  ? "border-purple-500 text-purple-400 bg-purple-500/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.05em" }}
            >
              <Ticket className="w-4 h-4 inline mr-2" />
              COMIC CONS
              <span className="ml-2 text-xs font-normal opacity-70">({ccTotalEvents})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== CARD SHOWS TAB CONTENT ===== */}
      {activeTab === "card-shows" && (
        <>
          {/* Search & Filters */}
          <div className="sticky top-[112px] z-30 bg-background/95 backdrop-blur-md border-b border-border py-3">
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

          {/* State Sections */}
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

          {/* Submit Your Show CTA */}
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
        </>
      )}

      {/* ===== COMIC CONS TAB CONTENT ===== */}
      {activeTab === "comic-cons" && (
        <>
          {/* Search & Filters */}
          <div className="sticky top-[112px] z-30 bg-background/95 backdrop-blur-md border-b border-purple-500/20 py-3">
            <div className="container">
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events, cities, states..."
                    value={ccSearch}
                    onChange={e => setCcSearch(e.target.value)}
                    className="pl-10 bg-card border-border focus-visible:ring-purple-500/50"
                  />
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Select value={ccStateFilter} onValueChange={setCcStateFilter}>
                    <SelectTrigger className="w-[120px] bg-card text-xs">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {ccUniqueStates.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={ccMonthFilter} onValueChange={setCcMonthFilter}>
                    <SelectTrigger className="w-[120px] bg-card text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={ccTierFilter} onValueChange={setCcTierFilter}>
                    <SelectTrigger className="w-[140px] bg-card text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CC_TIER_FILTERS.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={ccTypeFilter} onValueChange={setCcTypeFilter}>
                    <SelectTrigger className="w-[130px] bg-card text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CC_TYPE_FILTERS.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Result count */}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {ccFilteredEvents.length} event{ccFilteredEvents.length !== 1 ? "s" : ""} found
                </p>
                {(ccSearch || ccMonthFilter !== "all" || ccTierFilter !== "all" || ccTypeFilter !== "all" || ccStateFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-purple-400 hover:text-purple-300 h-7"
                    onClick={() => {
                      setCcSearch("");
                      setCcMonthFilter("all");
                      setCcTierFilter("all");
                      setCcTypeFilter("all");
                      setCcStateFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Event Cards */}
          <section className="py-8">
            <div className="container">
              <div className="grid gap-4 md:grid-cols-2">
                {ccDisplayedEvents.map((event, i) => (
                  <ComicConEventCard key={`${event.stateAbbr}-${event.startDate}-${i}`} event={event} />
                ))}
              </div>

              {ccDisplayedEvents.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No events found matching your filters.</p>
                  <p className="text-muted-foreground/60 text-sm mt-1">Try adjusting your search or filter criteria.</p>
                </div>
              )}

              {ccHasMore && (
                <div className="text-center mt-8">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCcShowAll(true)}
                    className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10"
                  >
                    Show All {ccFilteredEvents.length} Events
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {ccShowAll && ccFilteredEvents.length > 24 && (
                <div className="text-center mt-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCcShowAll(false)}
                    className="text-muted-foreground hover:text-purple-400"
                  >
                    Show Less
                    <ChevronUp className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Tier Legend */}
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
        </>
      )}

      {/* ===== SEO CONTENT (shared) ===== */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
            Find {activeTab === "card-shows" ? "Sports Card Shows" : "Comic Cons"} <span className={activeTab === "card-shows" ? "text-primary" : "text-purple-400"}>Near You</span> in 2026
          </h2>

          {activeTab === "card-shows" ? (
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
          ) : (
            <div className="prose prose-invert prose-purple max-w-none text-muted-foreground leading-relaxed space-y-4">
              <p>
                Comic conventions are more than just events — they are pilgrimages for fans of comics, collectibles, and pop culture.
                Whether you are hunting for rare variant covers, getting your graded slabs signed by the artist, or just soaking in
                the cosplay and energy, there is a con for every level of fandom.
              </p>
              <p>
                Our 2026 guide covers <strong className="text-foreground">{ccTotalEvents} events across {ccStateCount} states</strong>,
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
                <strong className="text-foreground">Pro tip:</strong> Switch to the Card Shows tab above to find nearby card shows
                and pair them with a comic con visit for the ultimate collector weekend.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16 bg-card/30 border-t border-border">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ fontFamily: "'Anton', sans-serif" }}>
            Frequently Asked <span className={activeTab === "card-shows" ? "text-primary" : "text-purple-400"}>Questions</span>
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
            {activeTab === "card-shows"
              ? "Show information compiled from Sports Collectors Digest, TCDB.com, and major show promoters."
              : "Event information compiled from comicconventionlist.com, upcomingcons.com, conventionscene.com, and thepopverse.com."}
            {" "}Dates, times, and details are subject to change — always verify with the event organizer before attending.
            {activeTab === "card-shows" && (
              <>
                {" "}Have a show to add?{" "}
                <Link href="/submit-show" className="text-primary hover:underline">
                  Submit it here
                </Link>
                .
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground/40 mt-2">
            Last updated: March 2026 | Covers March 1 - December 31, 2026
          </p>
        </div>
      </section>
    </div>
  );
}
