/**
 * Characters Index Page - Browse all Marvel characters with their card counts
 * SEO-optimized with paginated grid, search, and alphabetical filtering
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, Users, ChevronRight, Layers, ArrowLeft, ArrowRight
} from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const ALPHABET = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const PAGE_SIZE = 60;

function characterNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function Characters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [letterFilter, setLetterFilter] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const { data, isLoading } = trpc.public.marvel.allCharacters.useQuery(
    { limit: 2000, offset: 0 }
  );

  const filtered = useMemo(() => {
    if (!data?.characters) return [];
    let chars = data.characters;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      chars = chars.filter((c: any) => c.characterName.toLowerCase().includes(q));
    }

    if (letterFilter) {
      if (letterFilter === "#") {
        chars = chars.filter((c: any) => /^[^a-zA-Z]/.test(c.characterName));
      } else {
        chars = chars.filter((c: any) =>
          c.characterName.toUpperCase().startsWith(letterFilter)
        );
      }
    }

    return chars;
  }, [data?.characters, searchQuery, letterFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Marvel Characters - Complete Trading Card Character Database"
        description="Browse 880+ Marvel characters with detailed histories, powers, and trading card appearances across all Northland Legendary Finds card sets."
        path="/characters"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Characters", url: "/characters" },
        ])}
      />

      {/* Hero */}
      <section className="relative border-b border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="container max-w-6xl relative py-8 lg:py-12">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Characters</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                Marvel Characters
              </h1>
              <p className="text-muted-foreground text-lg">
                {data?.total ?? "..."} characters across all trading card sets
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Alphabet Filter */}
      <div className="border-b border-border/50 bg-card/30 sticky top-0 z-10">
        <div className="container max-w-6xl py-2 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            <Button
              variant={letterFilter === null ? "default" : "ghost"}
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => { setLetterFilter(null); setPage(0); }}
            >
              All
            </Button>
            {ALPHABET.map((letter) => (
              <Button
                key={letter}
                variant={letterFilter === letter ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0 text-xs"
                onClick={() => { setLetterFilter(letter); setPage(0); }}
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Characters Grid */}
      <div className="container max-w-6xl py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Characters Found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? `No results for "${searchQuery}"` : "No characters match this filter."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {paged.map((char: any) => {
                const slug = characterNameToSlug(char.characterName);
                return (
                  <Link
                    key={char.characterName}
                    href={`/characters/${slug}`}
                    className="group bg-card border border-border/50 rounded-xl p-4 hover:border-primary/50 hover:bg-card/80 transition-all"
                  >
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate mb-1">
                      {char.characterName}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Layers className="w-3 h-3" />
                      <span>{char.cardCount} cards</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page + 1} of {totalPages} ({filtered.length} characters)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
