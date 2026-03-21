/**
 * MCU Timeline - Complete Marvel Phase 6 Release Schedule
 * Shows all Marvel movies and Disney+ shows in chronological release order
 * Highlights Avengers: Doomsday and the record-breaking Spider-Man: Brand New Day trailer
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Film, Tv, Calendar, Clock, CheckCircle, Play, ArrowRight,
  ChevronDown, ChevronUp, ExternalLink, Sparkles, Eye, Flame,
  TrendingUp, Star, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

// ===== ASSETS =====
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/mcu-timeline-hero-hvcPnpNMmPiRSy3mNm9jaz.webp";

// ===== POSTER IMAGES =====
const POSTERS = {
  captainAmericaBNW: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/captain-america-bnw-poster_76cfb465.jpg",
  thunderbolts: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/thunderbolts-poster_70a160e6.jpg",
  fantasticFour: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fantastic-four-poster_a52fbf6f.jpg",
  yfnsSpiderman: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/yfns-spiderman-poster_24eb3c95.jpg",
  daredevilS1: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/daredevil-ba-s1-poster_9f494d8d.jpg",
  ironheart: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/ironheart-poster_0510227a.jpg",
  eyesOfWakanda: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/eyes-of-wakanda-poster_1b0f0fb5.jpg",
  marvelZombies: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/marvel-zombies-poster_e18e68c6.jpg",
  wonderMan: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/wonderman-poster_fd3afde9.png",
  daredevilS2: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/daredevil-ba-s2-poster_d03beb9e.jpg",
  punisher: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/punisher-special-poster_74e98cf4.jpg",
  xmen97s2: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/xmen97-s2-poster_e252ead3.jpg",
  spidermanBND: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/spiderman-bnd-poster_51aa9327.jpg",
  visionQuest: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/visionquest-poster_02a01a0a.jpg",
  doomsday: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/avengers-doomsday-poster_b8103fc5.jpg",
  secretWars: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/avengers-secret-wars-poster_9374bbe7.png",
};

// ===== TYPES =====
type ReleaseStatus = "released" | "streaming" | "upcoming" | "filming" | "announced";
type MediaType = "movie" | "show" | "animated" | "special";

interface MCURelease {
  id: string;
  title: string;
  date: string;
  sortDate: string; // YYYY-MM-DD for sorting
  type: MediaType;
  status: ReleaseStatus;
  platform: "Theaters" | "Disney+";
  poster: string;
  phase: number;
  description: string;
  cast?: string[];
  director?: string;
  highlight?: string; // Special callout text
  featured?: boolean; // Extra prominent display
  cardTieIn?: string; // Link to NLF card database
  trailerUrl?: string;
}

// ===== COMPLETE MCU PHASE 5 & 6 DATA =====
const MCU_RELEASES: MCURelease[] = [
  // ===== PHASE 5 (Already Released) =====
  {
    id: "captain-america-bnw",
    title: "Captain America: Brave New World",
    date: "Feb 14, 2025",
    sortDate: "2025-02-14",
    type: "movie",
    status: "released",
    platform: "Theaters",
    poster: POSTERS.captainAmericaBNW,
    phase: 5,
    description: "Sam Wilson takes on the mantle of Captain America and faces a conspiracy that threatens the world. Features Red Hulk and the return of The Leader.",
    cast: ["Anthony Mackie", "Harrison Ford", "Tim Blake Nelson", "Danny Ramirez"],
    director: "Julius Onah",
    cardTieIn: "/cards?q=captain+america",
  },
  {
    id: "thunderbolts",
    title: "Thunderbolts*",
    date: "May 2, 2025",
    sortDate: "2025-05-02",
    type: "movie",
    status: "released",
    platform: "Theaters",
    poster: POSTERS.thunderbolts,
    phase: 5,
    description: "A team of antiheroes — Yelena Belova, Bucky Barnes, John Walker, Ghost, and Taskmaster — are recruited by Valentina Allegra de Fontaine for a dangerous mission.",
    cast: ["Florence Pugh", "Sebastian Stan", "David Harbour", "Wyatt Russell"],
    director: "Jake Schreier",
    cardTieIn: "/cards?q=thunderbolts",
  },
  // ===== PHASE 6 =====
  {
    id: "fantastic-four",
    title: "The Fantastic Four: First Steps",
    date: "Jul 25, 2025",
    sortDate: "2025-07-25",
    type: "movie",
    status: "released",
    platform: "Theaters",
    poster: POSTERS.fantasticFour,
    phase: 6,
    description: "Marvel's First Family finally arrives in the MCU. Set in a retro-futuristic 1960s, the Fantastic Four face Galactus and the Silver Surfer.",
    cast: ["Pedro Pascal", "Vanessa Kirby", "Joseph Quinn", "Ebon Moss-Bachrach"],
    director: "Matt Shakman",
    cardTieIn: "/cards?q=fantastic+four",
  },
  {
    id: "yfns-spiderman",
    title: "Your Friendly Neighborhood Spider-Man",
    date: "Jan 29, 2025",
    sortDate: "2025-01-29",
    type: "animated",
    status: "released",
    platform: "Disney+",
    poster: POSTERS.yfnsSpiderman,
    phase: 6,
    description: "An animated series exploring an alternate version of Peter Parker's origin story in a world where Norman Osborn mentors the young hero instead of Tony Stark.",
    director: "Jeff Trammell (showrunner)",
  },
  {
    id: "daredevil-ba-s1",
    title: "Daredevil: Born Again (Season 1)",
    date: "Mar 4, 2025",
    sortDate: "2025-03-04",
    type: "show",
    status: "released",
    platform: "Disney+",
    poster: POSTERS.daredevilS1,
    phase: 6,
    description: "Matt Murdock returns to Hell's Kitchen as Daredevil, facing Kingpin's rise to political power as the newly elected Mayor of New York City.",
    cast: ["Charlie Cox", "Vincent D'Onofrio", "Jon Bernthal"],
    cardTieIn: "/cards?q=daredevil",
  },
  {
    id: "ironheart",
    title: "Ironheart",
    date: "Jun 24, 2025",
    sortDate: "2025-06-24",
    type: "show",
    status: "released",
    platform: "Disney+",
    poster: POSTERS.ironheart,
    phase: 6,
    description: "Riri Williams, a genius inventor from Chicago, builds her own suit of armor after the events of Black Panther: Wakanda Forever. She faces The Hood and discovers magic.",
    cast: ["Dominique Thorne", "Anthony Ramos", "Lyric Ross"],
    cardTieIn: "/cards?q=ironheart",
  },
  {
    id: "eyes-of-wakanda",
    title: "Eyes of Wakanda",
    date: "Aug 27, 2025",
    sortDate: "2025-08-27",
    type: "animated",
    status: "released",
    platform: "Disney+",
    poster: POSTERS.eyesOfWakanda,
    phase: 6,
    description: "An animated anthology following Wakandan warriors across different eras as they retrieve vibranium artifacts from around the world. Spans from 1260 BC to modern day.",
  },
  {
    id: "marvel-zombies",
    title: "Marvel Zombies",
    date: "Oct 3, 2025",
    sortDate: "2025-10-03",
    type: "animated",
    status: "released",
    platform: "Disney+",
    poster: POSTERS.marvelZombies,
    phase: 6,
    description: "A What If...? spinoff following survivors in a zombie-infested Marvel universe. TV-MA rated — the first Marvel Studios animated series aimed at mature audiences.",
  },
  {
    id: "wonder-man",
    title: "Wonder Man",
    date: "Jan 27, 2026",
    sortDate: "2026-01-27",
    type: "show",
    status: "released",
    platform: "Disney+",
    poster: POSTERS.wonderMan,
    phase: 6,
    description: "Simon Williams, a Hollywood stuntman with ionic powers, navigates the entertainment industry while uncovering a conspiracy. Called 'a low-key gem up there with the MCU's best.'",
    cast: ["Yahya Abdul-Mateen II", "Ben Kingsley", "Demetrius Grosse"],
  },
  {
    id: "daredevil-ba-s2",
    title: "Daredevil: Born Again (Season 2)",
    date: "Mar 24, 2026",
    sortDate: "2026-03-24",
    type: "show",
    status: "streaming",
    platform: "Disney+",
    poster: POSTERS.daredevilS2,
    phase: 6,
    description: "Matt Murdock's story continues with the return of Jessica Jones (Krysten Ritter), Bullseye, and Karen Page. Season 3 has already been confirmed.",
    cast: ["Charlie Cox", "Vincent D'Onofrio", "Krysten Ritter", "Wilson Bethel"],
    highlight: "NOW STREAMING",
    cardTieIn: "/cards?q=daredevil",
  },
  {
    id: "punisher-special",
    title: "The Punisher (Special Presentation)",
    date: "Early 2026",
    sortDate: "2026-04-15",
    type: "special",
    status: "upcoming",
    platform: "Disney+",
    poster: POSTERS.punisher,
    phase: 6,
    description: "Frank Castle returns in a Marvel Studios Special Presentation. Jon Bernthal promises: 'It will not be Punisher-lite. It's not going to be easy, it's not going to be light.'",
    cast: ["Jon Bernthal"],
    cardTieIn: "/cards?q=punisher",
  },
  {
    id: "xmen-97-s2",
    title: "X-Men '97 (Season 2)",
    date: "Summer 2026",
    sortDate: "2026-06-15",
    type: "animated",
    status: "upcoming",
    platform: "Disney+",
    poster: POSTERS.xmen97s2,
    phase: 6,
    description: "The beloved animated series returns for a darker second season. Voice actor Ross Marquand says: 'I'm amazed Disney greenlit it because it's so dark. A lot of people die.'",
    highlight: "Season 3 already confirmed",
  },
  {
    id: "spiderman-bnd",
    title: "Spider-Man: Brand New Day",
    date: "Jul 31, 2026",
    sortDate: "2026-07-31",
    type: "movie",
    status: "upcoming",
    platform: "Theaters",
    poster: POSTERS.spidermanBND,
    phase: 6,
    description: "Four years after No Way Home, Peter Parker is a full-time Spider-Man living entirely alone. A surprising physical evolution threatens his existence as a new pattern of crimes gives rise to one of the most powerful threats he has ever faced.",
    cast: ["Tom Holland", "Zendaya", "Jacob Batalon", "Jon Bernthal", "Mark Ruffalo", "Sadie Sink", "Michael Mando", "Charlie Cox"],
    director: "Destin Daniel Cretton",
    featured: true,
    highlight: "TRAILER BROKE ALL RECORDS — 718.6M VIEWS IN 24 HOURS",
    cardTieIn: "/cards?q=spider-man",
    trailerUrl: "https://www.youtube.com/watch?v=8TZMtslA3UY",
  },
  {
    id: "visionquest",
    title: "VisionQuest",
    date: "Late 2026",
    sortDate: "2026-09-01",
    type: "show",
    status: "upcoming",
    platform: "Disney+",
    poster: POSTERS.visionQuest,
    phase: 6,
    description: "White Vision struggles to feel the memories he was given in WandaVision. Paul Bettany returns in a show helmed by Star Trek: Picard's Terry Matalas, with each episode described as 'a different type of movie.'",
    cast: ["Paul Bettany"],
    cardTieIn: "/cards?q=vision",
  },
  {
    id: "avengers-doomsday",
    title: "Avengers: Doomsday",
    date: "Dec 18, 2026",
    sortDate: "2026-12-18",
    type: "movie",
    status: "upcoming",
    platform: "Theaters",
    poster: POSTERS.doomsday,
    phase: 6,
    description: "Robert Downey Jr. returns to the MCU — not as Tony Stark, but as Doctor Doom. The Avengers, Fantastic Four, and X-Men unite against the multiverse's greatest threat. The Russo Brothers direct with an idea they say will 'rival Endgame and Infinity War.'",
    cast: ["Robert Downey Jr.", "Chris Hemsworth", "Anthony Mackie", "Pedro Pascal", "Sebastian Stan", "Patrick Stewart", "Letitia Wright"],
    director: "Anthony & Joe Russo",
    featured: true,
    highlight: "THE BIGGEST MCU EVENT SINCE ENDGAME",
    cardTieIn: "/cards?q=doctor+doom",
  },
  {
    id: "avengers-secret-wars",
    title: "Avengers: Secret Wars",
    date: "Dec 17, 2027",
    sortDate: "2027-12-17",
    type: "movie",
    status: "announced",
    platform: "Theaters",
    poster: POSTERS.secretWars,
    phase: 6,
    description: "The grand finale of the Multiverse Saga. Inspired by the 2015 Secret Wars comics — incursions, Battleworld, and the collision of universes. Filming begins mid-2026.",
    director: "Anthony & Joe Russo",
    highlight: "END OF THE MULTIVERSE SAGA",
  },
];

// ===== FILTER OPTIONS =====
const FILTERS = [
  { key: "all", label: "All Releases", icon: Calendar },
  { key: "movie", label: "Movies", icon: Film },
  { key: "show", label: "Shows", icon: Tv },
  { key: "animated", label: "Animated", icon: Sparkles },
  { key: "upcoming", label: "Upcoming Only", icon: Clock },
];

// ===== STATUS CONFIG =====
const STATUS_CONFIG: Record<ReleaseStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  released: { label: "Released", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
  streaming: { label: "Now Streaming", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Play },
  upcoming: { label: "Upcoming", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Clock },
  filming: { label: "In Production", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Film },
  announced: { label: "Announced", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", icon: Star },
};

const TYPE_CONFIG: Record<MediaType, { label: string; color: string }> = {
  movie: { label: "Movie", color: "bg-red-500/20 text-red-400" },
  show: { label: "Series", color: "bg-blue-500/20 text-blue-400" },
  animated: { label: "Animated", color: "bg-purple-500/20 text-purple-400" },
  special: { label: "Special", color: "bg-amber-500/20 text-amber-400" },
};

export default function MCUTimeline() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredReleases = useMemo(() => {
    let filtered = [...MCU_RELEASES];
    if (activeFilter === "upcoming") {
      filtered = filtered.filter(r => r.status === "upcoming" || r.status === "streaming" || r.status === "announced" || r.status === "filming");
    } else if (activeFilter !== "all") {
      filtered = filtered.filter(r => r.type === activeFilter);
    }
    return filtered.sort((a, b) => a.sortDate.localeCompare(b.sortDate));
  }, [activeFilter]);

  const stats = useMemo(() => ({
    total: MCU_RELEASES.length,
    movies: MCU_RELEASES.filter(r => r.type === "movie").length,
    shows: MCU_RELEASES.filter(r => r.type === "show" || r.type === "special").length,
    animated: MCU_RELEASES.filter(r => r.type === "animated").length,
    released: MCU_RELEASES.filter(r => r.status === "released").length,
    upcoming: MCU_RELEASES.filter(r => r.status !== "released").length,
  }), []);

  return (
    <div className="min-h-screen">
      <SEO
        title="MCU Timeline — Every Marvel Movie & Show in Phase 5 & 6"
        description="Complete Marvel Cinematic Universe release schedule. Every movie, Disney+ show, and animated series from Phase 5 & 6 — from Captain America: Brave New World to Avengers: Secret Wars."
        path="/mcu-timeline"
        image={HERO_BG}
        type="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "MCU Timeline", url: "/mcu-timeline" },
          ]),
        ]}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[350px] sm:min-h-[450px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide">PHASE 5 & 6 RELEASE SCHEDULE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              <span className="text-foreground">MCU </span>
              <span className="text-primary">TIMELINE</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8">
              Every Marvel movie, Disney+ show, and animated series — from the already-released Phase 5 films
              through the Multiverse Saga finale. Track what's streaming now and what's coming next.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-red-400" />
                <span className="text-sm font-bold text-foreground">{stats.movies} Movies</span>
              </div>
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold text-foreground">{stats.shows} Shows</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-bold text-foreground">{stats.animated} Animated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-bold text-foreground">{stats.released} Released</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-foreground">{stats.upcoming} Upcoming</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SPIDER-MAN TRAILER RECORD BANNER ===== */}
      <section className="relative bg-gradient-to-r from-red-950/40 via-red-900/20 to-background border-y border-red-500/20">
        <div className="container py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-red-400 font-bold uppercase tracking-wider">Record Breaker</p>
                <p className="text-lg sm:text-xl font-bold text-foreground" style={{ fontFamily: "'Anton', sans-serif" }}>
                  SPIDER-MAN: BRAND NEW DAY
                </p>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm text-muted-foreground">
                The trailer shattered every record with{" "}
                <span className="text-red-400 font-bold">718.6 million views in 24 hours</span> — the most-watched
                trailer in history, beating GTA 6's previous record. In theaters July 31, 2026.
              </p>
            </div>
            <a
              href="https://www.youtube.com/watch?v=8TZMtslA3UY"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold">
                <Play className="w-4 h-4 mr-2" />
                Watch Trailer
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ===== FILTER BAR ===== */}
      <section className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground hover:bg-card/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE GRID ===== */}
      <section className="container py-10 sm:py-14">
        <div className="space-y-4">
          {filteredReleases.map((release, index) => {
            const statusCfg = STATUS_CONFIG[release.status];
            const typeCfg = TYPE_CONFIG[release.type];
            const StatusIcon = statusCfg.icon;
            const isExpanded = expandedId === release.id;
            const isFeatured = release.featured;

            return (
              <div
                key={release.id}
                className={`group relative rounded-xl border transition-all duration-300 overflow-hidden ${
                  isFeatured
                    ? "border-primary/40 bg-gradient-to-r from-primary/5 via-card to-card shadow-lg shadow-primary/5"
                    : "border-border bg-card hover:border-primary/20"
                }`}
              >
                {/* Featured badge */}
                {isFeatured && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                      FEATURED
                    </div>
                  </div>
                )}

                <div
                  className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : release.id)}
                >
                  {/* Poster */}
                  <div className={`flex-shrink-0 ${isFeatured ? "w-full sm:w-32 h-48 sm:h-44" : "w-full sm:w-24 h-40 sm:h-36"} rounded-lg overflow-hidden bg-muted`}>
                    <img
                      src={release.poster}
                      alt={release.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {/* Type badge */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeCfg.color}`}>
                        {typeCfg.label}
                      </span>
                      {/* Status badge */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {statusCfg.label}
                      </span>
                      {/* Platform */}
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {release.platform}
                      </span>
                      {/* Phase */}
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Phase {release.phase}
                      </span>
                    </div>

                    <h3 className={`font-bold leading-tight mb-1 ${isFeatured ? "text-xl sm:text-2xl" : "text-lg"}`} style={{ fontFamily: "'Anton', sans-serif" }}>
                      {release.title}
                    </h3>

                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-primary font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {release.date}
                      </span>
                      {release.director && (
                        <span className="text-xs text-muted-foreground">
                          Dir: {release.director}
                        </span>
                      )}
                    </div>

                    {/* Highlight callout */}
                    {release.highlight && (
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                        release.status === "streaming"
                          ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                          : "bg-primary/15 text-primary border border-primary/30"
                      }`}>
                        <Zap className="w-3 h-3" />
                        {release.highlight}
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {release.description}
                    </p>

                    {/* Expand indicator */}
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Show less</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Show more</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-0 border-t border-border/50">
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      {/* Full description */}
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Synopsis</h4>
                        <p className="text-sm text-foreground/80">{release.description}</p>
                      </div>

                      {/* Cast & Links */}
                      <div className="space-y-3">
                        {release.cast && release.cast.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Cast</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {release.cast.map((actor) => (
                                <span key={actor} className="text-xs bg-muted px-2 py-1 rounded-full text-foreground/80">
                                  {actor}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {release.cardTieIn && (
                            <Link href={release.cardTieIn}>
                              <Button size="sm" variant="outline" className="text-xs border-primary/30 text-primary hover:bg-primary/10">
                                <Eye className="w-3 h-3 mr-1" />
                                Browse Cards
                              </Button>
                            </Link>
                          )}
                          {release.trailerUrl && (
                            <a href={release.trailerUrl} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline" className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">
                                <Play className="w-3 h-3 mr-1" />
                                Watch Trailer
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredReleases.length === 0 && (
          <div className="text-center py-16">
            <Film className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No releases match this filter.</p>
          </div>
        )}
      </section>

      {/* ===== FUTURE SLATE (2028-2029) ===== */}
      <section className="bg-card/50 border-t border-border">
        <div className="container py-10 sm:py-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
              <span className="text-foreground">BEYOND PHASE 6 — </span>
              <span className="text-primary">2028 & BEYOND</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Marvel Studios has announced dates for six additional untitled films stretching into 2029.
              Rumored projects include X-Men, Black Panther 3, Thor 5, and Doctor Strange 3.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { date: "Feb 18, 2028", rumor: "Untitled Marvel Film", speculation: "Could be Blade or Shang-Chi 2" },
              { date: "May 5, 2028", rumor: "Untitled Marvel Film", speculation: "Widely rumored to be X-Men reboot (Jake Schreier directing)" },
              { date: "Jul 28, 2028", rumor: "Untitled Marvel Film", speculation: "Likely Black Panther 3 (Denzel Washington cast, Ryan Coogler directing)" },
              { date: "Dec 15, 2028", rumor: "Untitled Marvel Film", speculation: "Possibly Thor 5 or Doctor Strange 3" },
              { date: "May 4, 2029", rumor: "Untitled Marvel Film", speculation: "Could be Spider-Man 5 or Fantastic Four sequel" },
              { date: "Jul 13, 2029", rumor: "Untitled Marvel Film", speculation: "Could be the start of Phase 8 or a new saga" },
            ].map((slot, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">{slot.date}</span>
                </div>
                <h4 className="font-bold text-foreground mb-1">{slot.rumor}</h4>
                <p className="text-xs text-muted-foreground">{slot.speculation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA: DOOMSDAY INTEL ===== */}
      <section className="border-t border-border">
        <div className="container py-10 sm:py-14">
          <div className="bg-gradient-to-r from-green-950/30 via-card to-card border border-primary/20 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-primary">AVENGERS: DOOMSDAY</span>
                <span className="text-foreground"> CHARACTER INTEL</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Dive deep into every confirmed and rumored character for Avengers: Doomsday. See their card values,
                read the latest casting news, and track which characters have cards in our database.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/">
                  <Button className="bg-primary text-primary-foreground font-bold">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Doomsday Intel Hub
                  </Button>
                </Link>
                <Link href="/mcu-intel">
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
                    MCU News & Articles
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-32 h-44 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <img
                src={POSTERS.doomsday}
                alt="Avengers: Doomsday"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== ALSO RUMORED SECTION ===== */}
      <section className="border-t border-border bg-card/30">
        <div className="container py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
            <span className="text-foreground">ALSO IN </span>
            <span className="text-primary">DEVELOPMENT</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Armor Wars", desc: "Don Cheadle as War Machine dealing with Stark tech in the wrong hands. Originally a Disney+ series, now a movie.", status: "TBC" },
              { title: "Blade", desc: "Mahershala Ali stars in the long-delayed vampire hunter film. Production has been troubled with multiple director changes.", status: "TBC" },
              { title: "Shang-Chi 2", desc: "A sequel to the 2021 hit. Destin Daniel Cretton signed a multi-year deal with Marvel. Expected in Phase 7.", status: "TBC" },
              { title: "Nova", desc: "Richard Rider gets his own project. Moon Knight writer Sabir Pirzada is attached. Could be a movie or Disney+ series.", status: "TBC" },
            ].map((project, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-foreground">{project.title}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{project.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">{project.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="border-t border-border">
        <div className="container py-10 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            {MCU_RELEASES.length} total releases tracked &middot; Updated March 2026
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/cards">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
                Browse Card Database
              </Button>
            </Link>
            <Link href="/shop">
              <Button className="bg-primary text-primary-foreground font-bold">
                Shop NLF Repacks
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
