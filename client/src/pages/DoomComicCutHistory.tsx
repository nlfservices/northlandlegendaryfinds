/**
 * Doctor Doom HISTORY — collector hub for 2025 Topps Marvel Mint
 * Authentic Comic Cuts (DD-CC). Visual + scannable. Not an SEO essay.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Play, ShieldAlert, Youtube } from "lucide-react";
import SEO, { breadcrumbJsonLd, organizationJsonLd } from "@/components/SEO";
import DoomComicCutGallery from "@/components/DoomComicCutGallery";
import {
  CARD_DATABASE_PATH,
  DOOM_CARD_IMAGE,
  DOOM_GALLERY_HASH,
  DOOM_HISTORY_PATH,
  DOOM_VIDEO_PATH,
  DOOM_YOUTUBE_ID,
  MINT_2025_SET_PATH,
  MINT_COMIC_CUT_FACTS,
  OWUD_PATH,
  VIDEOS_PATH,
} from "@/data/doomComicCuts";
import { youtubeEmbedUrl } from "@/data/videos";

const SEO_TITLE = "Doctor Doom History — 2025 Marvel Mint Comic Cuts (DD-CC)";
const SEO_DESCRIPTION =
  "Collector hub for 2025 Topps Marvel Mint Authentic Comic Cuts (DD-CC): timeline, filmed 1/1, and research inventory. Reported ~200 unique Doom panels. Independent NLF page.";

const TIMELINE = [
  {
    era: "1962",
    title: "Fantastic Four #5",
    line: "Lee & Kirby introduce Victor von Doom.",
  },
  {
    era: "Classic",
    title: "Latveria / FF fights",
    line: "Iron monarch. Reed Richards' longest rival.",
  },
  {
    era: "1984 · 2015",
    title: "Secret Wars",
    line: "Beyonder to God Emperor — Doom takes the crown.",
  },
  {
    era: "2025–26",
    title: "MCU / movie era",
    line: "First Steps is out. Avengers: Doomsday is ahead.",
  },
  {
    era: "Mint 2025",
    title: "Comic Cuts",
    line: "Unique sealed published Marvel panels. Encased 1/1s.",
  },
] as const;

const HERO_CHIPS = [
  "Mint 2025",
  MINT_COMIC_CUT_FACTS.cardNumber,
  `${MINT_COMIC_CUT_FACTS.uniquePanels} 1/1s`,
  `Hobby ${MINT_COMIC_CUT_FACTS.hobbyOdds}`,
  `SDCC ${MINT_COMIC_CUT_FACTS.sdccOdds}`,
] as const;

export default function DoomComicCutHistory() {
  const [showHero, setShowHero] = useState(true);

  useEffect(() => {
    if (window.location.hash.replace("#", "") === DOOM_GALLERY_HASH) {
      document.getElementById(DOOM_GALLERY_HASH)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        path={DOOM_HISTORY_PATH}
        image={DOOM_CARD_IMAGE}
        type="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Card Database", url: CARD_DATABASE_PATH },
            { name: "2025 Topps Marvel Mint", url: MINT_2025_SET_PATH },
            { name: "Comic Cuts", url: DOOM_HISTORY_PATH },
            { name: "Doctor Doom History", url: DOOM_HISTORY_PATH },
          ]),
          organizationJsonLd(),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: SEO_TITLE,
            description: SEO_DESCRIPTION,
            image: DOOM_CARD_IMAGE,
            author: { "@type": "Organization", name: "NLF Team" },
          },
        ]}
      />

      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.12),transparent_70%)]" />

        <article className="container relative z-10 max-w-6xl py-8 lg:py-12">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={CARD_DATABASE_PATH} className="transition-colors hover:text-foreground">
              Card Database
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={MINT_2025_SET_PATH} className="transition-colors hover:text-foreground">
              2025 Topps Marvel Mint
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">Doctor Doom History</span>
          </nav>

          <header className="mb-12 grid items-center gap-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12">
            {showHero && (
              <div className="overflow-hidden rounded-xl border border-green-500/30 bg-black/60 shadow-lg shadow-green-950/40">
                <img
                  src={DOOM_CARD_IMAGE}
                  alt="2025 Topps Marvel Mint Doctor Doom Authentic Comic Cut 1/1 (DD-CC)"
                  className="mx-auto max-h-[420px] w-full object-contain"
                  onError={() => setShowHero(false)}
                />
              </div>
            )}

            <div>
              <h1 className="mb-3 text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-6xl">
                <span className="text-primary">DOCTOR DOOM</span>{" "}
                <span className="text-foreground">HISTORY</span>
              </h1>
              <p className="mb-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                Unique 1/1 comic panels. Mint Authentic Comic Cuts.
              </p>
              <div className="mb-3 flex flex-wrap gap-2">
                {HERO_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 font-mono text-xs font-semibold text-green-300"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <p className="mb-5 text-[11px] uppercase tracking-wider text-muted-foreground">
                Odds as reported · not a print-run claim
              </p>
              <div className="flex flex-wrap gap-2">
                <a href="#timeline" className={jumpChipClass}>
                  Timeline
                </a>
                <a href={`#${DOOM_GALLERY_HASH}`} className={jumpChipClass}>
                  Inventory
                </a>
                <a href="#watch" className={jumpChipClass}>
                  Watch
                </a>
              </div>
            </div>
          </header>

          <section id="timeline" className="mb-12 scroll-mt-24">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
              Quick timeline
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {TIMELINE.map((beat) => (
                <div
                  key={beat.title}
                  className="rounded-xl border border-green-500/20 bg-card/50 p-4"
                >
                  <p className="mb-1 font-mono text-[11px] font-bold uppercase tracking-wider text-green-400">
                    {beat.era}
                  </p>
                  <h2 className="mb-1 text-sm font-bold text-foreground">{beat.title}</h2>
                  <p className="text-sm text-muted-foreground">{beat.line}</p>
                </div>
              ))}
            </div>
          </section>

          <DoomComicCutGallery />

          <section id="watch" className="mb-12 max-w-xl scroll-mt-24">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Youtube className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">
                  Watch
                </h2>
              </div>
              <Link
                href={DOOM_VIDEO_PATH}
                className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300 hover:border-green-400/50 hover:text-green-200"
              >
                <Play className="h-3 w-3" />
                Filmed 1/1
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-green-500/20 bg-black">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`${youtubeEmbedUrl(DOOM_YOUTUBE_ID)}?rel=0&modestbranding=1`}
                  title="2025 Topps Marvel Mint Doctor Doom 1/1 Comic Cut"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Existing companion only — does not assign a specific issue or page.
            </p>
          </section>

          <aside className="mb-8 rounded-xl border border-amber-400/35 bg-amber-400/5 px-4 py-3 sm:px-5">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-amber-200">Not Doom 2099.</strong>{" "}
                Classic Doctor Doom — Victor von Doom. Do not conflate the two.
              </p>
            </div>
          </aside>

          <nav className="flex flex-wrap gap-2">
            <Link href={MINT_2025_SET_PATH} className={linkChipClass}>
              Mint 2025 set
            </Link>
            <Link href={VIDEOS_PATH} className={linkChipClass}>
              Videos
            </Link>
            <Link href={OWUD_PATH} className={linkChipClass}>
              OWUD stub
            </Link>
          </nav>

          <p className="mt-10 border-t border-border/50 pt-5 text-xs text-muted-foreground">
            Independent NLF write-up — not official Topps or Marvel. Odds are
            reported checklist figures. Total box print run unknown.
          </p>
        </article>
      </div>
    </div>
  );
}

const jumpChipClass =
  "rounded-full border border-border/70 px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:border-green-500/40 hover:text-green-300";

const linkChipClass =
  "rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300 transition-colors hover:border-green-400/50 hover:text-green-200";
