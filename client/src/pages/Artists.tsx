/**
 * Artists Directory — Tiered directory of Topps Marvel trading card artists
 * Design: Dark cosmic theme matching NLF site, tier-based cards with glow effects
 */

import { useState, useMemo } from "react";
import { ARTISTS, TIERS, type TierName, type CategoryName } from "@/data/artists";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Palette, Pen } from "lucide-react";

const TIER_ORDER: TierName[] = [
  "Latverian Sovereign",
  "Infinity",
  "Uru",
  "Vibranium",
  "Adamantium",
];

export default function Artists() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | CategoryName>("All");
  const [activeTier, setActiveTier] = useState<"All" | TierName>("All");

  const filtered = useMemo(() => {
    return ARTISTS.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || a.category === activeCategory;
      const matchesTier = activeTier === "All" || a.tier === activeTier;
      return matchesSearch && matchesCategory && matchesTier;
    });
  }, [search, activeCategory, activeTier]);

  const grouped = useMemo(() => {
    const map: Record<TierName, typeof filtered> = {} as Record<TierName, typeof filtered>;
    for (const tier of TIER_ORDER) {
      map[tier] = filtered.filter((a) => a.tier === tier);
    }
    return map;
  }, [filtered]);

  const totalArtists = ARTISTS.length;
  const comicArtists = ARTISTS.filter(a => a.category === "Comic Book Artist Autographs").length;
  const sketchArtists = ARTISTS.filter(a => a.category === "Sketch Card Artists").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-black via-[#0a0a1a] to-background border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(199,125,255,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,212,255,0.1),transparent_60%)]" />
        <div className="container relative z-10 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
            <Palette className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-bold tracking-widest uppercase">NLF Artist Directory</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-white">
            THE ARTISTS BEHIND<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#C77DFF] to-[#00D4FF]">
              THE CARDS
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
            Every sketch, every signature, every brushstroke. The definitive tier guide to Topps Marvel trading card artists — ranked by collector demand and hobby impact.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="text-center">
              <div className="text-3xl font-black text-white">{totalArtists}</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Total Artists</div>
            </div>
            <div className="w-px bg-white/10 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-black text-[#C77DFF]">{comicArtists}</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Comic Book Autos</div>
            </div>
            <div className="w-px bg-white/10 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-black text-[#00D4FF]">{sketchArtists}</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Sketch Card Artists</div>
            </div>
            <div className="w-px bg-white/10 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-black text-[#FFD700]">5</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Tiers</div>
            </div>
          </div>

          {/* Tier Legend */}
          <div className="flex flex-wrap justify-center gap-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold cursor-pointer transition-all"
                style={{
                  borderColor: tier.borderColor,
                  backgroundColor: activeTier === tier.name ? tier.bgColor : "transparent",
                  color: tier.color,
                  boxShadow: activeTier === tier.name ? `0 0 12px ${tier.glowColor}` : "none",
                }}
                onClick={() => setActiveTier(activeTier === tier.name ? "All" : tier.name)}
              >
                <span>{tier.icon}</span>
                <span>{tier.name}</span>
                <span className="opacity-60 text-xs">({getArtistsByTierCount(tier.name)})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-white/10">
        <div className="container py-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search artists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
            />
          </div>
          <div className="flex gap-2">
            {(["All", "Comic Book Artist Autographs", "Sketch Card Artists"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  activeCategory === cat
                    ? "bg-primary text-black border-primary"
                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat === "Comic Book Artist Autographs" && <Pen className="w-3.5 h-3.5" />}
                {cat === "Sketch Card Artists" && <Palette className="w-3.5 h-3.5" />}
                {cat === "All" ? "All" : cat === "Comic Book Artist Autographs" ? "Comic Autos" : "Sketch Cards"}
              </button>
            ))}
          </div>
          <div className="text-white/40 text-sm ml-auto">
            {filtered.length} artist{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Artist Grid by Tier */}
      <div className="container py-12 space-y-16">
        {TIER_ORDER.map((tierName) => {
          const tierArtists = grouped[tierName];
          if (tierArtists.length === 0) return null;
          const tier = TIERS.find(t => t.name === tierName)!;

          return (
            <section key={tierName}>
              {/* Tier Header */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-xl border"
                  style={{
                    borderColor: tier.borderColor,
                    backgroundColor: tier.bgColor,
                    boxShadow: `0 0 20px ${tier.glowColor}`,
                  }}
                >
                  <span className="text-2xl">{tier.icon}</span>
                  <div>
                    <div className="font-black text-xl tracking-tight" style={{ color: tier.color }}>
                      {tier.name}
                    </div>
                    <div className="text-white/50 text-xs">{tier.description}</div>
                  </div>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{ color: tier.color, backgroundColor: tier.bgColor, border: `1px solid ${tier.borderColor}` }}
                >
                  {tierArtists.length} artist{tierArtists.length !== 1 ? "s" : ""}
                </div>
                <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${tier.borderColor}, transparent)` }} />
              </div>

              {/* Artist Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {tierArtists.map((artist) => (
                  <div
                    key={artist.name}
                    className="group relative rounded-xl border p-4 transition-all duration-200 cursor-default"
                    style={{
                      borderColor: tier.borderColor,
                      backgroundColor: tier.bgColor,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 16px ${tier.glowColor}`;
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    }}
                  >
                    {/* Tier icon badge */}
                    <div className="absolute top-2 right-2 text-sm opacity-60">{tier.icon}</div>

                    {/* Avatar placeholder */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black mb-3"
                      style={{ backgroundColor: tier.bgColor, border: `2px solid ${tier.borderColor}`, color: tier.color }}
                    >
                      {artist.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="font-bold text-white text-sm leading-tight mb-2">{artist.name}</div>

                    <Badge
                      className="text-xs px-2 py-0.5 border-0"
                      style={{
                        backgroundColor: artist.category === "Comic Book Artist Autographs"
                          ? "rgba(199,125,255,0.15)"
                          : "rgba(0,212,255,0.15)",
                        color: artist.category === "Comic Book Artist Autographs" ? "#C77DFF" : "#00D4FF",
                      }}
                    >
                      {artist.category === "Comic Book Artist Autographs" ? "Comic Auto" : "Sketch Card"}
                    </Badge>

                    {artist.sets.length > 0 && (
                      <div className="mt-2 text-white/30 text-xs truncate" title={artist.sets.join(", ")}>
                        {artist.sets[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-24 text-white/30">
            <Palette className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <div className="text-xl font-semibold">No artists found</div>
            <div className="text-sm mt-2">Try adjusting your search or filters</div>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="border-t border-white/10 py-8 text-center text-white/30 text-sm">
        <p>Artist tiers reflect collector demand and hobby impact — not official Topps rankings.</p>
        <p className="mt-1">All artists are officially licensed by Topps for Marvel trading cards.</p>
      </div>
    </div>
  );
}

function getArtistsByTierCount(tier: TierName): number {
  return ARTISTS.filter(a => a.tier === tier).length;
}
