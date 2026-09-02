/**
 * Videos gallery — NLF YouTube listings filtered by character A–Z, team, and set.
 * Dark background, green accents. Cards link into /videos/:slug SEO pages.
 */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Filter, Play, Users, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO, { breadcrumbJsonLd, collectionPageJsonLd, organizationJsonLd } from "@/components/SEO";
import {
  VIDEOS,
  filterAndSortVideos,
  getCharacterLetters,
  getSetFilterOptions,
  getTeamFilterOptions,
  getTeamsWithVideos,
  hasVideoDetailPage,
  videoDetailPath,
  youtubeEmbedUrl,
  type VideoEntry,
} from "@/data/videos";
import { loreCompanionForVideo } from "@/data/doomComicCuts";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function VideoCard({ video }: { video: VideoEntry }) {
  const setHref = video.setSlug ? `/cards/${video.setSlug}` : null;
  const detailHref = hasVideoDetailPage(video) ? videoDetailPath(video.id) : null;
  const lore = loreCompanionForVideo(video.id);

  return (
    <article className="overflow-hidden rounded-xl border border-green-500/20 bg-card/60 shadow-lg shadow-green-950/20 transition-all hover:border-green-400/50">
      <div className="relative w-full overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`${youtubeEmbedUrl(video.youtubeId)}?rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <div className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border border-green-500/40 bg-green-500/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-green-400">
            {video.character}
          </span>
          <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
            {video.parallel}
          </span>
          <span className="rounded border border-border/60 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {video.setLabel}
          </span>
        </div>

        {detailHref ? (
          <h2 className="text-lg font-bold leading-snug text-foreground sm:text-xl">
            <Link href={detailHref} className="transition-colors hover:text-green-400">
              {video.title}
            </Link>
          </h2>
        ) : (
          <h2 className="text-lg font-bold leading-snug text-foreground sm:text-xl">
            {video.title}
          </h2>
        )}
        <p className="text-sm leading-relaxed text-muted-foreground">{video.description}</p>

        {video.teams.length > 0 && (
          <p className="text-xs text-muted-foreground/80">{video.teams.join(" · ")}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {detailHref && (
            <Link
              href={detailHref}
              className="inline-flex items-center gap-1 text-sm font-semibold text-green-400 transition-colors hover:text-green-300"
            >
              Watch details
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
          {setHref && (
            <Link
              href={setHref}
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
            >
              View {video.setFilter}
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
          {lore && (
            <Link
              href={lore.href}
              className="inline-flex items-center gap-1 text-sm font-semibold text-green-400 transition-colors hover:text-green-300"
            >
              {lore.label}
              <ChevronRight className="h-4 w-4" />
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
  const [teamFilter, setTeamFilter] = useState<string | null>(null);

  const lettersWithVideos = useMemo(() => new Set(getCharacterLetters(VIDEOS)), []);
  const setOptions = useMemo(() => getSetFilterOptions(VIDEOS), []);
  const teamOptions = useMemo(() => getTeamFilterOptions(), []);
  const teamsWithVideos = useMemo(() => new Set(getTeamsWithVideos(VIDEOS)), []);

  const filtered = useMemo(
    () => filterAndSortVideos(VIDEOS, { letter: letterFilter, set: setFilter, team: teamFilter }),
    [letterFilter, setFilter, teamFilter]
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Videos — Marvel Card YouTube Gallery"
        description="Watch Northland Legendary Finds Marvel card videos. Filter by character A–Z, team, and set, including Doctor Doom Comic Cut 1/1 from 2025 Topps Marvel Mint."
        path="/videos"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Videos", url: "/videos" },
          ]),
          collectionPageJsonLd({
            name: "NLF Videos — Marvel Card YouTube Gallery",
            description: "YouTube gallery of Northland Legendary Finds Marvel trading card videos, filterable by character, team, and set.",
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
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">Videos</span>
          </nav>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-4 py-1.5">
            <Youtube className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold tracking-wide text-primary">NLF VIDEO GALLERY</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-6xl">
            <span className="text-primary">VIDEOS</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Marvel card videos from Northland Legendary Finds. Filter by character A–Z, team, or set —
            starting with Doctor Doom Comic Cut 1/1 from 2025 Topps Marvel Mint.
          </p>
          <p className="mt-3 text-sm text-green-400/90">
            Filter by character or team — learn the roster while you watch.
          </p>
        </div>
      </section>

      <section className="container space-y-6 py-8 lg:py-10">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Filter className="h-4 w-4 text-green-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Character A–Z
            </h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border/50 bg-card/30">
            <div className="flex min-w-max gap-1 p-2">
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
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-green-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Team / storyline
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={teamFilter === null ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setTeamFilter(null)}
            >
              All Teams
            </Button>
            {teamOptions.map((label) => {
              const hasVideos = teamsWithVideos.has(label);
              return (
                <Button
                  key={label}
                  variant={teamFilter === label ? "default" : "outline"}
                  size="sm"
                  className={`h-8 text-xs ${!hasVideos ? "opacity-40" : ""}`}
                  onClick={() => setTeamFilter(label)}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Play className="h-4 w-4 text-green-400" />
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
          {teamFilter ? ` · ${teamFilter}` : ""}
          {setFilter ? ` · ${setFilter}` : ""}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border/40 bg-card/20 py-16 text-center">
            <Youtube className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">No videos match these filters</h3>
            <p className="mb-4 text-muted-foreground">
              Try another letter, team, or set, or clear the filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setLetterFilter(null);
                setSetFilter(null);
                setTeamFilter(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filtered.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
