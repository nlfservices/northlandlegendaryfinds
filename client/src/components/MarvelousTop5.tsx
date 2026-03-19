/**
 * Marvelous Top 5 — Weekly buzz rankings from the Marvel universe
 * Fetches data from the database (admin-editable via Top 5 Manager)
 * Features cosmic frame templates and 3D card flip animation (front/back)
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { TrendingUp, ExternalLink, ChevronRight, Flame, Sparkles, Loader2, RotateCcw } from "lucide-react";
import { Link } from "wouter";

const FRAME_URLS: Record<string, string> = {
  marvel_mint_gold: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_Marvel_Mint_Gold_f3bc7dc2.png",
  marvel_mint_silver: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_Marvel_Mint_Silver_57c1219f.png",
  marvel_mint_bronze: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_Marvel_Mint_Bronze_ca850e23.png",
  marvel_mint_platinum: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_Marvel_Mint_Platinum_126c3799.png",
  "1975_era_gold_amber": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_1975_Era_Gold_Amber_137f3e23.png",
  "1976_era_blue_silver": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_1976_Era_Blue_Silver_7e6de901.png",
  "2025_era_emerald_green": "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/combined_2025_Era_Emerald_Green_4b7926e9.png",
};

const heatConfig = {
  blazing: { label: "BLAZING", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30", icon: Flame },
  hot: { label: "HOT", color: "text-orange-400", bg: "bg-orange-500/15 border-orange-500/30", icon: Flame },
  rising: { label: "RISING", color: "text-yellow-400", bg: "bg-yellow-500/15 border-yellow-500/30", icon: TrendingUp },
};

// ============================================================
// FALLBACK DATA — used if database is empty or loading fails
// ============================================================
const FALLBACK_ITEMS = [
  {
    id: 1, rank: 1, title: "Spider-Man: Brand New Day", character: "Spider-Man",
    tagline: "The trailer just dropped — and the hype is unreal",
    backstory: "Tom Holland returns as Peter Parker in a high-stakes prequel to Avengers: Doomsday. The Brand New Day trailer reveals lost friendships, new villains, and strange powers as Peter's life spins upside down. Set for July 2026, this is the fourth solo Spider-Man film and the bridge between Thunderbolts* and Doomsday. Spider-Man cards are already surging in the secondary market.",
    cardImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-101_Spider-Man_318857c1.webp",
    frontImage: null, backImage: null, frameTemplate: "marvel_mint_gold",
    cardLabel: "2025 Topps Chrome #101", cardLink: "/cards/chrome/101",
    sources: [
      { title: "BBC — Brand New Day Trailer Breakdown", url: "https://www.bbc.co.uk/newsround/articles/cj323868dl4o" },
      { title: "People — Everything We Know", url: "https://people.com/spider-man-brand-new-day-everything-we-know-11928797" },
    ],
    heatLevel: "blazing" as const, category: "Movie", isActive: true,
  },
  {
    id: 2, rank: 2, title: "Doctor Doom's Multiverse Takeover", character: "Doctor Doom",
    tagline: "Robert Downey Jr. becomes Marvel's greatest villain",
    backstory: "The centerpiece of Avengers: Doomsday, Doctor Doom is being positioned as the most dangerous threat the MCU has ever faced. Robert Downey Jr.'s casting as Victor Von Doom sent shockwaves through the fandom. In the comics, Doom is returning in Captain America #12 this June, reshaping Steve Rogers' world before the Armageddon event.",
    cardImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-148_Doctor_Doom_52f7a61b.webp",
    frontImage: null, backImage: null, frameTemplate: "marvel_mint_platinum",
    cardLabel: "2025 Topps Chrome #148", cardLink: "/cards/chrome/148",
    sources: [
      { title: "Bleeding Cool — Doctor Doom Returns in Captain America", url: "https://bleedingcool.com/comics/return-of-doctor-doom-in-marvels-captain-america-june-2026-solicits/" },
    ],
    heatLevel: "blazing" as const, category: "Movie / Comics", isActive: true,
  },
  {
    id: 3, rank: 3, title: "Sentry: The Void Awakens", character: "Sentry",
    tagline: "Thunderbolts* breakout star heads to Doomsday",
    backstory: "Lewis Pullman's portrayal of Bob Reynolds / The Sentry in Thunderbolts* has become one of the MCU's most talked-about performances. At the 2026 Oscars, Pullman teased \"surprises\" for Avengers: Doomsday. The Sentry's power level makes him a wildcard in the Doomsday conflict.",
    cardImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chrome_168_sentry-8SrWXzwLRmHBTnWBHh7kCH.webp",
    frontImage: null, backImage: null, frameTemplate: "1976_era_blue_silver",
    cardLabel: "2025 Topps Chrome #168", cardLink: "/cards/chrome/168",
    sources: [
      { title: "E! Online — Pullman Teases Doomsday at Oscars", url: "https://www.eonline.com/news/1429755/oscars-2026-lewis-pullman-on-avengers-doomsday-breaking-rules" },
    ],
    heatLevel: "hot" as const, category: "Movie", isActive: true,
  },
  {
    id: 4, rank: 4, title: "Wolverine: Weapon X Unleashed", character: "Wolverine",
    tagline: "Hugh Jackman confirmed for Doomsday — claws out",
    backstory: "After the record-breaking success of Deadpool & Wolverine, Hugh Jackman is confirmed to return as Logan in Avengers: Doomsday. In the card market, Wolverine Chrome parallels and inserts are consistently among the top sellers.",
    cardImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-103_Wolverine_1cc49682.webp",
    frontImage: null, backImage: null, frameTemplate: "2025_era_emerald_green",
    cardLabel: "2025 Topps Chrome #103", cardLink: "/cards/chrome/103",
    sources: [
      { title: "Collider — MCU's Defining Moment in 2026", url: "https://www.facebook.com/collider/posts/the-marvel-cinematic-universe-faces-a-defining-moment-in-2026-after-the-muted-re/1340615581433199/" },
    ],
    heatLevel: "hot" as const, category: "Movie", isActive: true,
  },
  {
    id: 5, rank: 5, title: "Captain America: Shield Reforged", character: "Captain America",
    tagline: "Anthony Mackie leads the new Avengers into war",
    backstory: "Sam Wilson's Captain America is stepping into the leadership role for Avengers: Doomsday. After Brave New World established him as the new Cap, the stakes have never been higher. Sam Wilson Chrome cards are gaining traction as collectors bet on his rising MCU prominence.",
    cardImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chrome_185_captain_america-koKKBbDfbETQNRvGxiM3Nh.webp",
    frontImage: null, backImage: null, frameTemplate: "1975_era_gold_amber",
    cardLabel: "2025 Topps Chrome #185", cardLink: "/cards/chrome/185",
    sources: [
      { title: "Bleeding Cool — Cap #12 Doctor Doom Confrontation", url: "https://bleedingcool.com/comics/return-of-doctor-doom-in-marvels-captain-america-june-2026-solicits/" },
    ],
    heatLevel: "rising" as const, category: "Movie / Comics", isActive: true,
  },
];

/**
 * 3D Flip Card with cosmic frame overlay.
 * If frontImage is a pre-composited URL (from server-side green screen processing),
 * it is displayed directly. Otherwise, the card image is overlaid on the frame template
 * using CSS positioning.
 */
function FlipCard({ item, size = "large" }: { item: any; size?: "large" | "thumb" }) {
  const [flipped, setFlipped] = useState(false);
  const hasBack = !!item.backImage;
  const frontImg = item.frontImage || item.cardImage;
  const backImg = item.backImage;
  const frameUrl = item.frameTemplate ? FRAME_URLS[item.frameTemplate] : null;

  // If frontImage exists, it's likely already composited server-side
  // In that case, show it directly without frame overlay
  const isFrontComposited = !!item.frontImage;
  const isBackComposited = !!item.backImage;

  const isLarge = size === "large";
  const containerClass = isLarge
    ? "w-52 md:w-60 aspect-square"
    : "w-12 h-16";

  if (!isLarge) {
    // Thumbnail — no flip, just show front
    return (
      <div className={`${containerClass} rounded-md overflow-hidden flex-shrink-0`}>
        <img src={frontImg} alt={item.character} className="w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }

  const renderFace = (imgSrc: string, alt: string, isComposited: boolean, label: string) => {
    if (isComposited) {
      // Pre-composited image from server — show directly
      return (
        <>
          <img src={imgSrc} alt={alt} className="w-full h-full object-contain rounded-xl" loading="lazy" />
          <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm rounded-md px-2 py-1 text-center">
            <span className="text-[10px] text-gray-300 font-medium">{label}</span>
          </div>
        </>
      );
    }
    if (frameUrl) {
      // CSS overlay: frame background + card image in center
      return (
        <div className="relative w-full h-full">
          <img src={frameUrl} alt="frame" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
          <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: "28%", paddingBottom: "12%", paddingLeft: "18%", paddingRight: "18%" }}>
            <img src={imgSrc} alt={alt} className="w-full h-full object-cover rounded-sm" loading="lazy" />
          </div>
          <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm rounded-md px-2 py-1 text-center">
            <span className="text-[10px] text-gray-300 font-medium">{label}</span>
          </div>
        </div>
      );
    }
    return (
      <>
        <img src={imgSrc} alt={alt} className="w-full h-full object-cover rounded-xl" loading="lazy" />
        <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm rounded-md px-2 py-1 text-center">
          <span className="text-[10px] text-gray-300 font-medium">{label}</span>
        </div>
      </>
    );
  };

  return (
    <div className="relative group">
      {/* Flip container */}
      <div
        className={`${containerClass} cursor-pointer`}
        style={{ perspective: "1000px" }}
        onClick={() => hasBack && setFlipped(!flipped)}
      >
        <div
          className="relative w-full h-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            {renderFace(frontImg, item.character, isFrontComposited, item.cardLabel)}
          </div>

          {/* Back Face */}
          {hasBack && backImg && (
            <div
              className="absolute inset-0 rounded-xl overflow-hidden"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              {renderFace(backImg, `${item.character} back`, isBackComposited, "Card Back")}
            </div>
          )}
        </div>
      </div>

      {/* Flip hint */}
      {hasBack && (
        <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] text-gray-500 transition-opacity ${flipped ? "opacity-70" : "opacity-40 group-hover:opacity-70"}`}>
          <RotateCcw className="w-3 h-3" />
          <span>Click to flip</span>
        </div>
      )}
    </div>
  );
}

export default function MarvelousTop5() {
  const { data: dbItems, isLoading } = trpc.top5.list.useQuery();
  const [activeIndex, setActiveIndex] = useState(0);

  // Use database items if available, otherwise fallback
  const items = (dbItems && dbItems.length > 0) ? dbItems : FALLBACK_ITEMS;
  const active: any = items[activeIndex] || items[0];
  if (!active) return null;

  const heat = heatConfig[active.heatLevel as keyof typeof heatConfig] || heatConfig.rising;
  const HeatIcon = heat.icon;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(34,197,94,0.4) 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }} />

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/25 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-bold tracking-wider uppercase">Updated Weekly</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
            <span className="text-white">The Marvelous </span>
            <span className="text-primary">Top 5</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The hottest buzz in the Marvel universe right now — movies, comics, and what it means for your collection.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Main Content: Ranking List + Active Spotlight */}
        {!isLoading && (
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left: Ranking List */}
            <div className="lg:col-span-4 space-y-2">
              {items.map((item: any, idx: number) => {
                const itemHeat = heatConfig[item.heatLevel as keyof typeof heatConfig] || heatConfig.rising;
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.id || item.rank}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${
                      isActive
                        ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/5"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Number */}
                      <div className={`text-3xl font-black tabular-nums w-10 text-center ${
                        isActive ? "text-primary" : "text-white/20 group-hover:text-white/40"
                      } transition-colors`}>
                        {item.rank}
                      </div>

                      {/* Card Thumbnail */}
                      <div className={`w-12 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${
                        isActive ? "border-primary/60 shadow-md shadow-primary/20" : "border-white/10"
                      }`}>
                        <FlipCard item={item} size="thumb" />
                      </div>

                      {/* Title + Heat */}
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-bold text-sm truncate transition-colors ${
                          isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                        }`}>
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-bold ${itemHeat.color}`}>
                            {itemHeat.label}
                          </span>
                          <span className="text-gray-600 text-xs">&bull;</span>
                          <span className="text-gray-500 text-xs">{item.category}</span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-all ${
                        isActive ? "text-primary translate-x-0" : "text-white/10 -translate-x-1 group-hover:text-white/30 group-hover:translate-x-0"
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Active Spotlight */}
            <div className="lg:col-span-8">
              <div className="relative bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden">
                {/* Spotlight Header with Card Image */}
                <div className="relative flex flex-col md:flex-row">
                  {/* Card Image with Cosmic Frame + Flip */}
                  <div className="md:w-72 lg:w-80 flex-shrink-0 p-6 pb-10 flex items-center justify-center">
                    <FlipCard item={active} size="large" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 md:py-8">
                    {/* Rank + Heat Badge */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-5xl font-black text-primary/30">#{active.rank}</span>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${heat.bg} ${heat.color}`}>
                        <HeatIcon className="w-3.5 h-3.5" />
                        {heat.label}
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {active.title}
                    </h3>
                    <p className="text-primary font-semibold text-sm mb-4 italic">
                      {active.tagline}
                    </p>

                    {/* Backstory */}
                    <p className="text-gray-400 leading-relaxed text-sm mb-5">
                      {String(active.backstory)}
                    </p>

                    {/* Sources */}
                    {active.sources && (active.sources as any[]).length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sources</span>
                        <div className="flex flex-wrap gap-2">
                          {(active.sources as any[]).map((source: any, i: number) => (
                            <a
                              key={i}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-gray-400 hover:text-primary hover:border-primary/30 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {source.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View Card CTA */}
                    {active.cardLink && (
                      <Link href={active.cardLink}>
                        <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm font-semibold hover:bg-primary/20 transition-colors cursor-pointer">
                          View {active.character} Card Details
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
