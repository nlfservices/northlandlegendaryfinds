/**
 * Card Shows Directory 2026
 * SEO-optimized directory of sports card shows across the lower 48 states.
 * Features: A-Z state organization, full addresses, website links, Google Maps links,
 * JSON-LD structured data, rich SEO content, FAQ section.
 */

import { useState, useMemo, useCallback } from "react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  Star,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Navigation,
  Users,
  DollarSign,
  Ticket,
  ChevronsUpDown,
} from "lucide-react";
import { getShowsByState, getShowStats, type CardShow, type StateGroup } from "@/lib/cardShowsData";

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getGoogleMapsUrl(show: CardShow): string {
  const parts = [show.venue, show.address, show.city, show.stateName].filter(Boolean);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(", "))}`;
}

function ShowCard({ show }: { show: CardShow }) {
  const isFree = show.admission.toLowerCase().includes("free");

  return (
    <article
      className={`relative rounded-lg border p-4 sm:p-5 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 ${
        show.featured
          ? "border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-transparent"
          : "border-border/50 bg-card/50 hover:border-primary/30"
      }`}
      itemScope
      itemType="https://schema.org/Event"
    >
      {/* Featured badge */}
      {show.featured && (
        <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-amber-500 text-black text-[10px] font-bold tracking-widest rounded-full flex items-center gap-1">
          <Star className="w-2.5 h-2.5" />
          FEATURED
        </div>
      )}

      {/* Date badge */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-16 text-center">
          <div className={`rounded-lg p-2 ${show.featured ? "bg-amber-500/15 border border-amber-500/30" : "bg-primary/10 border border-primary/20"}`}>
            <div className={`text-[10px] font-bold tracking-wider ${show.featured ? "text-amber-400" : "text-primary"}`}>
              {MONTH_NAMES[show.month]?.substring(0, 3).toUpperCase()}
            </div>
            <div className="text-lg font-bold text-foreground">{show.day}</div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Show name */}
          <h3 className="font-bold text-base sm:text-lg text-foreground leading-tight mb-1" itemProp="name">
            {show.name || `${show.city} Card Show`}
          </h3>

          {/* Date display */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <time itemProp="startDate" content={`2026-${String(show.month).padStart(2, "0")}-${String(show.day).padStart(2, "0")}`}>
              {show.date}, 2026
            </time>
          </div>

          {/* Venue & Address */}
          {(show.venue || show.address) && (
            <div className="mb-2" itemProp="location" itemScope itemType="https://schema.org/Place">
              {show.venue && (
                <div className="text-sm font-medium text-foreground/90" itemProp="name">
                  {show.venue}
                </div>
              )}
              {show.address && (
                <div className="flex items-start gap-1.5 mt-0.5" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-primary mt-0.5" />
                  <a
                    href={getGoogleMapsUrl(show)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
                    itemProp="streetAddress"
                  >
                    {show.address}
                  </a>
                </div>
              )}
              {!show.address && show.city && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{show.city}, {show.stateName}</span>
                </div>
              )}
            </div>
          )}

          {/* Info row: Hours, Tables, Admission */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
            {show.hours && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {show.hours}
              </span>
            )}
            {show.tables && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {show.tables} tables
              </span>
            )}
            {show.admission && (
              <span className={`flex items-center gap-1 font-medium ${isFree ? "text-green-400" : "text-foreground/70"}`}>
                {isFree ? <Ticket className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                {isFree ? "FREE Admission" : `Admission: ${show.admission}`}
              </span>
            )}
          </div>

          {/* Contact & Links row */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/30">
            {show.website && (
              <a
                href={show.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-md hover:bg-primary/20 transition-colors"
              >
                <Globe className="w-3 h-3" />
                Website
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            {show.email && (
              <a
                href={`mailto:${show.email}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20 rounded-md hover:bg-secondary/20 transition-colors"
              >
                <Mail className="w-3 h-3" />
                Email
              </a>
            )}
            {show.phone && (
              <a
                href={`tel:${show.phone.replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground border border-border/30 rounded-md hover:bg-muted/80 transition-colors"
              >
                <Phone className="w-3 h-3" />
                {show.phone}
              </a>
            )}
            <a
              href={getGoogleMapsUrl(show)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md hover:bg-blue-500/20 transition-colors"
            >
              <Navigation className="w-3 h-3" />
              Directions
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function StateSection({
  group,
  isExpanded,
  onToggle,
}: {
  group: StateGroup;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <section id={`state-${group.state}`} className="scroll-mt-32">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 rounded-lg border border-border/40 bg-card/30 hover:bg-card/60 transition-all group"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-sm">
            {group.state}
          </span>
          <div className="text-left">
            <h2 className="text-lg font-bold text-foreground tracking-wide uppercase">
              {group.stateName}
            </h2>
            <p className="text-xs text-muted-foreground">
              {group.shows.length} show{group.shows.length !== 1 ? "s" : ""}
              {group.featuredCount > 0 && (
                <span className="ml-2 text-amber-400">
                  <Star className="w-3 h-3 inline mr-0.5" />
                  {group.featuredCount} featured
                </span>
              )}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3 pl-2 sm:pl-4">
          {group.shows.map((show, i) => (
            <ShowCard key={`${group.state}-${i}`} show={show} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function CardShows() {
  const [searchQuery, setSearchQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());

  const allGroups = useMemo(() => getShowsByState(), []);
  const stats = useMemo(() => getShowStats(), []);

  // Filter and sort
  const filteredGroups = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allGroups
      .map((group) => {
        let shows = group.shows;

        // Month filter
        if (monthFilter !== "all") {
          const m = parseInt(monthFilter);
          shows = shows.filter((s) => s.month === m);
        }

        // Search filter
        if (q) {
          shows = shows.filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.city.toLowerCase().includes(q) ||
              s.stateName.toLowerCase().includes(q) ||
              s.state.toLowerCase() === q ||
              s.venue.toLowerCase().includes(q) ||
              s.address.toLowerCase().includes(q)
          );
        }

        // Sort
        if (sortBy === "name") {
          shows = [...shows].sort((a, b) => a.name.localeCompare(b.name));
        }

        return { ...group, shows, featuredCount: shows.filter((s) => s.featured).length };
      })
      .filter((g) => g.shows.length > 0);
  }, [allGroups, searchQuery, monthFilter, sortBy]);

  const totalFiltered = useMemo(
    () => filteredGroups.reduce((sum, g) => sum + g.shows.length, 0),
    [filteredGroups]
  );

  const toggleState = useCallback((state: string) => {
    setExpandedStates((prev) => {
      const next = new Set(prev);
      if (next.has(state)) next.delete(state);
      else next.add(state);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedStates(new Set(filteredGroups.map((g) => g.state)));
  }, [filteredGroups]);

  const collapseAll = useCallback(() => {
    setExpandedStates(new Set());
  }, []);

  const scrollToState = useCallback(
    (state: string) => {
      setExpandedStates((prev) => new Set([...prev, state]));
      setTimeout(() => {
        const el = document.getElementById(`state-${state}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    },
    []
  );

  // JSON-LD for the directory page
  const directoryJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sports Card Shows Directory 2026",
    description: "Complete directory of sports card shows, trading card expos, and collectibles conventions across the United States from March through December 2026.",
    numberOfItems: stats.totalShows,
    itemListElement: allGroups.flatMap((group) =>
      group.shows.slice(0, 3).map((show, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Event",
          name: show.name || `${show.city} Card Show`,
          startDate: `2026-${String(show.month).padStart(2, "0")}-${String(show.day).padStart(2, "0")}`,
          location: {
            "@type": "Place",
            name: show.venue || show.city,
            address: {
              "@type": "PostalAddress",
              streetAddress: show.address,
              addressLocality: show.city,
              addressRegion: show.state,
              addressCountry: "US",
            },
          },
          ...(show.website && { url: show.website }),
          ...(show.admission && {
            offers: {
              "@type": "Offer",
              price: show.admission.toLowerCase().includes("free") ? "0" : show.admission.replace(/[^0-9.]/g, ""),
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          }),
        },
      }))
    ),
  }), [allGroups, stats.totalShows]);

  const faqItems = useMemo(() => [
    {
      question: "How do I find sports card shows near me?",
      answer: "Use the search bar at the top of this directory to search by city, state, or show name. You can also click any state abbreviation in the quick-nav bar to jump directly to shows in that state. Each listing includes a 'Directions' link that opens Google Maps for easy navigation.",
    },
    {
      question: "Are sports card shows free to attend?",
      answer: `Many sports card shows offer free admission — in fact, ${stats.freeAdmission} of the ${stats.totalShows} shows in our directory are free to attend. Shows that do charge admission typically range from $2 to $15, with some larger expos charging up to $25-$35 for multi-day passes.`,
    },
    {
      question: "What should I bring to a sports card show?",
      answer: "Bring cash (many vendors prefer it), your trade binder if you want to trade, penny sleeves and top loaders to protect purchases, a backpack or bag, and a list of cards you're looking for. Some shows also accept card payments, but cash is king at most card shows.",
    },
    {
      question: "What types of cards can I find at sports card shows?",
      answer: "Sports card shows feature a wide variety of trading cards including baseball, football, basketball, hockey, soccer, and non-sport cards like Pokemon, Marvel, Star Wars, and anime TCGs. You'll find vintage cards, modern releases, graded cards (PSA, BGS, SGC, AGS), autographed cards, game-used memorabilia cards, and sealed hobby boxes and packs.",
    },
    {
      question: "How often is this card show directory updated?",
      answer: "This directory is compiled from Sports Collectors Digest, TCDB.com, and major show promoters. We update it regularly as new shows are announced. Always verify dates and details with the show organizer before attending, as schedules can change.",
    },
    {
      question: "What is the biggest sports card show in 2026?",
      answer: "The 46th National Sports Collectors Convention (NSCC) is the biggest card show of 2026, taking place July 29 - August 3 at the Donald E. Stephens Convention Center in Rosemont, Illinois. It features 2,000+ dealer tables and is the premier event in the hobby. Other major shows include the Dallas Card Show, Front Row Card Shows, and regional expos in most major cities.",
    },
  ], [stats.freeAdmission, stats.totalShows]);

  const faqJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  }), [faqItems]);

  return (
    <div className="min-h-screen">
      <SEO
        title="Sports Card Shows Directory 2026 — Find Card Shows Near You"
        description={`Complete directory of ${stats.totalShows} sports card shows across ${stats.totalStates} states in 2026. Find trading card shows, collectibles expos, and card conventions near you with addresses, dates, and details.`}
        path="/card-shows"
        type="website"
        jsonLd={[
          directoryJsonLd,
          faqJsonLd,
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Card Shows Directory", url: "/card-shows" },
          ]),
        ]}
      >
        <meta name="keywords" content="sports card shows 2026, card shows near me, trading card shows, sports card conventions, card show directory, baseball card shows, football card shows, pokemon card shows, card show calendar, sports memorabilia shows" />
        <meta name="robots" content="index, follow" />
      </SEO>

      {/* ===== HERO SECTION ===== */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, oklch(0.75 0.20 145 / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 30%, oklch(0.75 0.15 85 / 0.2) 0%, transparent 50%)",
        }} />

        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/25 rounded-full mb-6">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-bold tracking-wide">2026 SHOW DIRECTORY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.9] mb-4">
            <span className="bg-gradient-to-r from-primary via-green-400 to-primary bg-clip-text text-transparent">
              CARD SHOWS
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              ACROSS AMERICA
            </span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Your complete directory of sports card shows, trading card expos, and collectibles conventions in the lower 48 states. March through December 2026 — organized A-Z by state with full addresses, websites, and contact info.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary">
                <MapPin className="w-5 h-5" />
                <span className="text-2xl sm:text-3xl font-bold">{stats.totalStates}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">States Covered</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <Calendar className="w-5 h-5" />
                <span className="text-2xl sm:text-3xl font-bold">{stats.totalShows}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Shows Listed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <Ticket className="w-5 h-5" />
                <span className="text-2xl sm:text-3xl font-bold">{stats.freeAdmission}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Free Admission</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-secondary">
                <Clock className="w-5 h-5" />
                <span className="text-2xl sm:text-3xl font-bold">Mar–Dec</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEARCH & FILTERS ===== */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border/30 py-3">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search shows, cities, states, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card/50 border-border/40"
              />
            </div>
            <div className="flex gap-2">
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-[140px] bg-card/50 border-border/40">
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value="3">March</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="5">May</SelectItem>
                  <SelectItem value="6">June</SelectItem>
                  <SelectItem value="7">July</SelectItem>
                  <SelectItem value="8">August</SelectItem>
                  <SelectItem value="9">September</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">December</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "date" | "name")}>
                <SelectTrigger className="w-[140px] bg-card/50 border-border/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Expand/Collapse + State Quick Nav */}
          <div className="flex items-center gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={expandAll} className="text-xs h-7 px-2">
              <ChevronsUpDown className="w-3 h-3 mr-1" />
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs h-7 px-2">
              Collapse
            </Button>
            <div className="text-xs text-muted-foreground ml-2">
              {totalFiltered} show{totalFiltered !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* State quick nav */}
          <div className="flex flex-wrap gap-1 mt-2">
            {filteredGroups.map((g) => (
              <button
                key={g.state}
                onClick={() => scrollToState(g.state)}
                title={g.stateName}
                className="px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
              >
                {g.state}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHOW LISTINGS ===== */}
      <section className="container py-8">
        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <StateSection
              key={group.state}
              group={group}
              isExpanded={expandedStates.has(group.state)}
              onToggle={() => toggleState(group.state)}
            />
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No shows found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

      {/* ===== SEO CONTENT SECTION ===== */}
      <section className="border-t border-border/30 bg-card/20">
        <div className="container py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            Find Sports Card Shows Near You in 2026
          </h2>
          <div className="max-w-4xl text-muted-foreground space-y-4 text-sm sm:text-base leading-relaxed">
            <p>
              Whether you are a seasoned collector hunting for vintage gems or a newcomer exploring the hobby, attending a sports card show is one of the best ways to buy, sell, and trade cards in person. Our comprehensive directory lists <strong className="text-foreground">{stats.totalShows} card shows across {stats.totalStates} states</strong> from March through December 2026, making it easy to find events near you.
            </p>
            <p>
              Sports card shows range from small local gatherings with 20-30 tables to massive multi-day expos featuring 500+ dealers. The highlight of the 2026 show calendar is the <strong className="text-foreground">46th National Sports Collectors Convention (NSCC)</strong> in Rosemont, Illinois, with over 2,000 dealer tables. Other major events include the Dallas Card Show, Front Row Card Shows touring multiple cities, and regional favorites like the Pittsburgh 500 and Baltimore Card Show.
            </p>
            <p>
              At card shows you will find everything from modern releases like 2025 Topps Chrome and Panini Prizm to vintage treasures from the 1950s-1980s. Many shows also feature Pokemon, Marvel, Star Wars, and other trading card games. Grading companies like PSA, BGS, SGC, and AGS often have on-site submission services at larger events.
            </p>
            <p>
              <strong className="text-foreground">{stats.freeAdmission} shows in our directory offer free admission</strong>, making it easy to explore the hobby without any upfront cost. Each listing includes the venue address with a Google Maps link for directions, show hours, table counts, admission prices, and direct contact information including websites, email, and phone numbers.
            </p>
            <p>
              This directory is brought to you by <strong className="text-foreground">Northland Legendary Finds</strong>, your source for premium Marvel trading card repacks. Whether you are attending a show in person or shopping online, we are here to help you find the cards you love. See you at the next show!
            </p>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="border-t border-border/30">
        <div className="container py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-border/30 rounded-lg p-5 bg-card/30">
                <h3 className="font-bold text-foreground mb-2">{item.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER NOTE ===== */}
      <section className="border-t border-border/30 bg-card/10">
        <div className="container py-8 text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            Show information compiled from Sports Collectors Digest, TCDB.com, and major show promoters.
            Dates, times, and details are subject to change — always verify with the show organizer before attending.
            Have a show to add?{" "}
            <a href="/contact" className="text-primary hover:underline">
              Contact us
            </a>
            .
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-2">
            Last updated: March 2026 | Covers March 1 - December 31, 2026
          </p>
        </div>
      </section>
    </div>
  );
}
