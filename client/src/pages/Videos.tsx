/**
 * Videos gallery — NLF YouTube listings filtered by character A–Z and set.
 * Dark background, green accents. Embeds only; no invented posters.
 */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Filter, Play, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO, { breadcrumbJsonLd, collectionPageJsonLd, organizationJsonLd } from "@/components/SEO";
import {
  VIDEOS,
  filterAndSortVideos,
  getCharacterLetters,
  getSetFilterOptions,
  youtubeEmbedUrl,
  type VideoEntry,
} from "@/data/videos";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function VideoCard({ video }: { video: VideoEntry }) {
  const setHref = video.setSlug ? `/cards/${video.setSlug}` : null;

  return (
    <article className="bg-card/60 border border-green-500/20 rounded-xl overflow-hidden hover:border-green-400/50 transition-all shadow-lg shadow-green-950/20">
      <div className="relative w-full overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`${youtubeEmbedUrl(video.youtubeId)}?rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <div className="p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded border border-green-500/40 bg-green-500/15 text-green-400">
            {video.character}
          </span>
          <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            {video.parallel}
          </span>
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded border border-border/60 text-muted-foreground">
            {video.setLabel}
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
          {video.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {video.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {setHref && (
            <Link
              href={setHref}
              className="inline-flex items-center gap-1 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors"
            >
              View {video.setFilter}
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Videos() {
  const [letterFilter, setLetterFilter] = useState<string | null>(null);
  const [setFilter, setSetFilter] = useState<string | null>(null);

  const lettersWithVideos = useMemo(() => new Set(getCharacterLetters(VIDEOS)), []);
  const setOptions = useMemo(() => getSetFilterOptions(VIDEOS), []);

  const filtered = useMemo(
    () => filterAndSortVideos(VIDEOS, { letter: letterFilter, set: setFilter }),
    [letterFilter, setFilter]
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Videos — Marvel Card YouTube Gallery"
        description="Watch Northland Legendary Finds Marvel card videos. Filter by character A–Z and set, including Doctor Doom Comic Cut 1/1 from 2025 Topps Marvel Mint."
        path="/videos"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Videos", url: "/videos" },
          ]),
          collectionPageJsonLd({
            name: "NLF Videos — Marvel Card YouTube Gallery",
            description: "YouTube gallery of Northland Legendary Finds Marvel trading card videos, filterable by character and set.",
            url: "/videos",
            itemCount: VIDEOS.length,
          }),
          organizationJsonLd(),
        ]}
      />

      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.12),transparent_70%)]" />
        <div className="container relative z-10 py-12 lg:py-16">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Videos</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
            <Youtube className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-bold tracking-wide">NLF VIDEO GALLERY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] mb-4">
            <span className="text-primary">VIDEOS</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Marvel card videos from Northland Legendary Finds. Filter by character A–Z or set —
            starting with Doctor Doom Comic Cut 1/1 from 2025 Topps Marvel Mint.
          </p>
        </div>
      </section>

      <section className="container py-8 lg:py-10 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-green-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Character A–Z
            </h2>
          </div>
          <div className="border border-border/50 bg-card/30 rounded-lg overflow-x-auto">
            <div className="flex gap-1 p-2 min-w-max">
              <Button
                variant={letterFilter === null ? "default" : "ghost"}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => setLetterFilter(null)}
              >
                All
              </Button>
              {ALPHABET.map((letter) => {
                const hasVideos = lettersWithVideos.has(letter);
                return (
                  <Button
                    key={letter}
                    variant={letterFilter === letter ? "default" : "ghost"}
                    size="sm"
                    className={`h-8 w-8 p-0 text-xs ${!hasVideos ? "opacity-40" : ""}`}
                    onClick={() => setLetterFilter(letter)}
                  >
                    {letter}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Play className="w-4 h-4 text-green-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Set
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={setFilter === null ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setSetFilter(null)}
            >
              All Sets
            </Button>
            {setOptions.map((label) => (
              <Button
                key={label}
                variant={setFilter === label ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setSetFilter(label)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {filtered.length} video{filtered.length === 1 ? "" : "s"}
          {letterFilter ? ` · ${letterFilter}` : ""}
          {setFilter ? ` · ${setFilter}` : ""}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-16 border border-border/40 rounded-xl bg-card/20">
            <Youtube className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No videos match these filters</h3>
            <p className="text-muted-foreground mb-4">
              Try another letter or set, or clear the filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setLetterFilter(null);
                setSetFilter(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
