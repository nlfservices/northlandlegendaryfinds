/**
 * Marvelous Top 5 â€” Weekly buzz rankings from the Marvel universe
 * Each entry features a card image from the NLF database, backstory, and source links
 * Easy to update: just change the BUZZ_ITEMS array below
 */

import { useState } from "react";
import { TrendingUp, ExternalLink, ChevronRight, Flame, Sparkles } from "lucide-react";
import { Link } from "wouter";

interface BuzzItem {
  rank: number;
  title: string;
  character: string;
  tagline: string;
  backstory: string;
  cardImage: string;
  cardLabel: string;
  cardLink: string;
  sources: { title: string; url: string }[];
  heatLevel: "blazing" | "hot" | "rising";
  category: string;
}

// ============================================================
// UPDATE THIS ARRAY TO CHANGE THE TOP 5 â€” no code changes needed
// ============================================================
const BUZZ_ITEMS: BuzzItem[] = [
  {
    rank: 1,
    title: "Spider-Man: Brand New Day",
    character: "Spider-Man",
    tagline: "The trailer just dropped â€” and the hype is unreal",
    backstory:
      "Tom Holland returns as Peter Parker in a high-stakes prequel to Avengers: Doomsday. The Brand New Day trailer reveals lost friendships, new villains, and strange powers as Peter's life spins upside down. Set for July 2026, this is the fourth solo Spider-Man film and the bridge between Thunderbolts* and Doomsday. Spider-Man cards are already surging in the secondary market.",
    cardImage:
      "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-101_Spider-Man_318857c1.webp",
    cardLabel: "2025 Topps Chrome #101",
    cardLink: "/cards/chrome/101",
    sources: [
      { title: "BBC â€” Brand New Day Trailer Breakdown", url: "https://www.bbc.co.uk/newsround/articles/cj323868dl4o" },
      { title: "People â€” Everything We Know", url: "https://people.com/spider-man-brand-new-day-everything-we-know-11928797" },
    ],
    heatLevel: "blazing",
    category: "Movie",
  },
  {
    rank: 2,
    title: "Doctor Doom's Multiverse Takeover",
    character: "Doctor Doom",
    tagline: "Robert Downey Jr. becomes Marvel's greatest villain",
    backstory:
      "The centerpiece of Avengers: Doomsday, Doctor Doom is being positioned as the most dangerous threat the MCU has ever faced. Robert Downey Jr.'s casting as Victor Von Doom sent shockwaves through the fandom. In the comics, Doom is returning in Captain America #12 this June, reshaping Steve Rogers' world before the Armageddon event. His cards â€” especially Chrome parallels â€” are among the most sought-after in the 2025 Topps set.",
    cardImage:
      "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-148_Doctor_Doom_52f7a61b.webp",
    cardLabel: "2025 Topps Chrome #148",
    cardLink: "/cards/chrome/148",
    sources: [
      { title: "Bleeding Cool â€” Doctor Doom Returns in Captain America", url: "https://bleedingcool.com/comics/return-of-doctor-doom-in-marvels-captain-america-june-2026-solicits/" },
      { title: "E! Online â€” Lewis Pullman Teases Doomsday Surprises", url: "https://www.eonline.com/news/1429755/oscars-2026-lewis-pullman-on-avengers-doomsday-breaking-rules" },
    ],
    heatLevel: "blazing",
    category: "Movie / Comics",
  },
  {
    rank: 3,
    title: "Sentry: The Void Awakens",
    character: "Sentry",
    tagline: "Thunderbolts* breakout star heads to Doomsday",
    backstory:
      "Lewis Pullman's portrayal of Bob Reynolds / The Sentry in Thunderbolts* has become one of the MCU's most talked-about performances. At the 2026 Oscars, Pullman teased \"surprises\" for Avengers: Doomsday. Fans are speculating that The Void â€” Sentry's dark alter ego â€” could play a pivotal role. The Sentry's power level (often compared to Superman) makes him a wildcard in the Doomsday conflict. His cards are climbing fast.",
    cardImage:
      "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chrome_168_sentry-8SrWXzwLRmHBTnWBHh7kCH.webp",
    cardLabel: "2025 Topps Chrome #168",
    cardLink: "/cards/chrome/168",
    sources: [
      { title: "E! Online â€” Pullman Teases Doomsday at Oscars", url: "https://www.eonline.com/news/1429755/oscars-2026-lewis-pullman-on-avengers-doomsday-breaking-rules" },
      { title: "Yahoo â€” Spider-Man Connection to The Void?", url: "https://www.yahoo.com/entertainment/movies/articles/thunderbolts-fans-think-spider-man-093818684.html" },
    ],
    heatLevel: "hot",
    category: "Movie",
  },
  {
    rank: 4,
    title: "Wolverine: Weapon X Unleashed",
    character: "Wolverine",
    tagline: "Hugh Jackman confirmed for Doomsday â€” claws out",
    backstory:
      "After the record-breaking success of Deadpool & Wolverine, Hugh Jackman is confirmed to return as Logan in Avengers: Doomsday. Wolverine's role in the multiverse saga is still shrouded in mystery, but his presence guarantees explosive action. In the card market, Wolverine Chrome parallels and inserts are consistently among the top sellers. His Sapphire and Gold parallels command premium prices.",
    cardImage:
      "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-103_Wolverine_1cc49682.webp",
    cardLabel: "2025 Topps Chrome #103",
    cardLink: "/cards/chrome/103",
    sources: [
      { title: "Collider â€” MCU's Defining Moment in 2026", url: "https://www.facebook.com/collider/posts/the-marvel-cinematic-universe-faces-a-defining-moment-in-2026-after-the-muted-re/1340615581433199/" },
      { title: "Hollywood.com â€” Everything We Know About Brand New Day", url: "https://www.hollywood.com/movies/everything-we-know-about-spider-man-brand-new-day-61030871" },
    ],
    heatLevel: "hot",
    category: "Movie",
  },
  {
    rank: 5,
    title: "Captain America: Shield Reforged",
    character: "Captain America",
    tagline: "Anthony Mackie leads the new Avengers into war",
    backstory:
      "Sam Wilson's Captain America is stepping into the leadership role for Avengers: Doomsday. After Brave New World established him as the new Cap, the stakes have never been higher. In the comics, Captain America #12 ties directly into the Armageddon event with a Doctor Doom confrontation. Sam Wilson Chrome cards are gaining traction as collectors bet on his rising MCU prominence.",
    cardImage:
      "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chrome_185_captain_america-koKKBbDfbETQNRvGxiM3Nh.webp",
    cardLabel: "2025 Topps Chrome #185",
    cardLink: "/cards/chrome/185",
    sources: [
      { title: "Bleeding Cool â€” Cap #12 Doctor Doom Confrontation", url: "https://bleedingcool.com/comics/return-of-doctor-doom-in-marvels-captain-america-june-2026-solicits/" },
      { title: "Collider â€” MCU Faces Defining Moment", url: "https://www.facebook.com/collider/posts/the-marvel-cinematic-universe-faces-a-defining-moment-in-2026-after-the-muted-re/1340615581433199/" },
    ],
    heatLevel: "rising",
    category: "Movie / Comics",
  },
];

const heatConfig = {
  blazing: { label: "BLAZING", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30", icon: Flame },
  hot: { label: "HOT", color: "text-orange-400", bg: "bg-orange-500/15 border-orange-500/30", icon: Flame },
  rising: { label: "RISING", color: "text-yellow-400", bg: "bg-yellow-500/15 border-yellow-500/30", icon: TrendingUp },
};

export default function MarvelousTop5() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = BUZZ_ITEMS[activeIndex];
  const heat = heatConfig[active.heatLevel];
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
            The hottest buzz in the Marvel universe right now â€” movies, comics, and what it means for your collection.
          </p>
        </div>

        {/* Main Content: Ranking List + Active Spotlight */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left: Ranking List */}
          <div className="lg:col-span-4 space-y-2">
            {BUZZ_ITEMS.map((item, idx) => {
              const itemHeat = heatConfig[item.heatLevel];
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.rank}
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
                      <img
                        src={item.cardImage}
                        alt={item.character}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
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
                {/* Card Image */}
                <div className="md:w-64 lg:w-72 flex-shrink-0 p-6 flex items-center justify-center bg-gradient-to-br from-primary/5 to-transparent">
                  <Link href={active.cardLink}>
                    <div className="relative group cursor-pointer">
                      <div className="absolute -inset-3 bg-primary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img
                        src={active.cardImage}
                        alt={active.character}
                        className="relative w-44 md:w-52 rounded-lg shadow-2xl shadow-black/50 border border-white/10 group-hover:scale-[1.02] transition-transform"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm rounded-md px-2 py-1 text-center">
                        <span className="text-[10px] text-gray-300 font-medium">{active.cardLabel}</span>
                      </div>
                    </div>
                  </Link>
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
                    {active.backstory}
                  </p>

                  {/* Sources */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sources</span>
                    <div className="flex flex-wrap gap-2">
                      {active.sources.map((source, i) => (
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

                  {/* View Card CTA */}
                  <Link href={active.cardLink}>
                    <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm font-semibold hover:bg-primary/20 transition-colors cursor-pointer">
                      View {active.character} Card Details
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

