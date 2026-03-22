/**
 * Doomsday Section — Avengers: Doomsday Character Intel Hub
 * Doctor Doom centerpiece with rotating character spotlights,
 * real news/rumor intel, article backlinks, and NLF card images.
 */

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Newspaper, Shield, Swords, Flame, Zap, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// ===== ASSETS =====
const DOOM_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-villain-silhouette-bRM9RnWPaYDGXVzxSNryLP.webp";
const BG_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doomsday-section-bg-BjSMCi7WHT8WWJNCqKkRAi.webp";

// ===== TYPES =====
interface DoomsdayCharacter {
  id: string;
  name: string;
  actor: string;
  faction: "Villain" | "Avengers" | "Fantastic Four" | "X-Men" | "Thunderbolts";
  status: "Confirmed" | "Rumored";
  roleSummary: string;
  newsHeadline: string;
  articles: { url: string; source: string }[];
  cardImageUrl: string | null;
  cardNumber: string | null;
}

// ===== CHARACTER DATA =====
const DOOMSDAY_CHARACTERS: DoomsdayCharacter[] = [
  {
    id: "doctor-doom",
    name: "Doctor Doom",
    actor: "Robert Downey Jr.",
    faction: "Villain",
    status: "Confirmed",
    roleSummary: "Robert Downey Jr. returns to the MCU as Doctor Doom, the primary antagonist of Avengers: Doomsday. The film explores Doom's tragic backstory, his disfigurement, and his rise as the multiverse's greatest threat.",
    newsHeadline: "Robert Downey Jr.'s Doctor Doom Disfigurement Revealed In Avengers: Doomsday Art",
    articles: [
      { url: "https://screenrant.com/avengers-doomsday-robert-downey-jr-doctor-doom-face-mcu-art/", source: "Screen Rant" },
      { url: "https://www.yahoo.com/entertainment/movies/articles/robert-downey-jr-doctor-doom-045400748.html", source: "Yahoo Entertainment" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-148_Doctor_Doom_52f7a61b.webp",
    cardNumber: "148",
  },
  {
    id: "thor",
    name: "Thor",
    actor: "Chris Hemsworth",
    faction: "Avengers",
    status: "Confirmed",
    roleSummary: "Thor returns with a more serious, dramatic arc in Doomsday — a departure from the comedic tone of Love and Thunder. A teaser shows him praying for strength to protect his adopted daughter, Love. Fan theories suggest Thor may die in the film.",
    newsHeadline: "Thor Goes Serious in 'Avengers: Doomsday' After Hemsworth Criticized 'Too Silly' MCU",
    articles: [
      { url: "https://variety.com/2025/film/news/thor-avengers-doomsday-serious-chris-hemsworth-criticism-silly-1236620635/", source: "Variety" },
      { url: "https://www.yahoo.com/entertainment/movies/articles/chris-hemsworth-seemingly-wrapped-avengers-192630797.html", source: "Yahoo Entertainment" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-119_Thor_56a124bc.webp",
    cardNumber: "119",
  },
  {
    id: "captain-america",
    name: "Captain America",
    actor: "Anthony Mackie",
    faction: "Avengers",
    status: "Confirmed",
    roleSummary: "Sam Wilson leads his own Avengers team in Doomsday, fighting alongside the Fantastic Four and X-Men against Doctor Doom. Rumors suggest he may face an evil variant of Steve Rogers' Captain America from another universe.",
    newsHeadline: "Sam Wilson's Real Avengers Get Their Due in Doomsday After Thunderbolts* Setup",
    articles: [
      { url: "https://screenrant.com/thunderbolts-sam-wilson-real-avengers-doomsday-mcu-fix/", source: "Screen Rant" },
      { url: "https://www.cbr.com/character-reunions-avengers-doomsday-more-than-cameo/", source: "CBR" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chrome_185_captain_america-koKKBbDfbETQNRvGxiM3Nh.webp",
    cardNumber: "185",
  },
  {
    id: "mister-fantastic",
    name: "Mister Fantastic",
    actor: "Pedro Pascal",
    faction: "Fantastic Four",
    status: "Confirmed",
    roleSummary: "Pedro Pascal's Reed Richards has an integral role in Doomsday following his debut in The Fantastic Four: First Steps. Pascal has clarified he won't be leading the Avengers, but his character is expected to be central to the film's events.",
    newsHeadline: "Pedro Pascal Refutes Reed Richards Leading Avengers in 'Doomsday': 'A Mislead'",
    articles: [
      { url: "https://variety.com/2025/film/news/pedro-pascal-reed-richards-leading-avengers-doomsday-1236470208/", source: "Variety" },
      { url: "https://www.forbes.com/sites/paultassi/2025/07/17/mr-fantastic-will-lead-the-avengers-in-doomsday--what-about-sam-and-yelena/", source: "Forbes" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-089_Mister_Fantastic_faeb8ea2.webp",
    cardNumber: "089",
  },
  {
    id: "invisible-woman",
    name: "Invisible Woman",
    actor: "Vanessa Kirby",
    faction: "Fantastic Four",
    status: "Confirmed",
    roleSummary: "Vanessa Kirby reprises Sue Storm in Doomsday, exploring the challenges of being a new mother with superpowers. The Fantastic Four team up with the Avengers to confront Doctor Doom's multiversal threat.",
    newsHeadline: "Vanessa Kirby On Sue Storm, Committing To MCU Through Doomsday and Beyond",
    articles: [
      { url: "https://deadline.com/2025/07/vanessa-kirby-the-fantastic-four-first-steps-mcu-doomsday-1236469883/", source: "Deadline" },
      { url: "https://nypost.com/2025/03/26/entertainment/marvel-announces-avengers-doomsday-cast-vanessa-kirby-sebastian-stan-chris-hemsworth/", source: "New York Post" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chrome_174_invisible_woman-hERLcKYLf5Y9rYL6D2sTUk.webp",
    cardNumber: "174",
  },
  {
    id: "human-torch",
    name: "Human Torch",
    actor: "Joseph Quinn",
    faction: "Fantastic Four",
    status: "Confirmed",
    roleSummary: "Joseph Quinn returns as Johnny Storm, joining the broader roster of heroes against Doctor Doom. Quinn has spoken about the 'relief' of having his Doomsday casting officially announced and praised working alongside Robert Downey Jr.",
    newsHeadline: "Joseph Quinn Felt 'Relief' When His Avengers: Doomsday Casting Was Announced",
    articles: [
      { url: "https://www.ign.com/articles/fantastic-fours-joseph-quinn-felt-relief-when-his-avengers-doomsday-casting-was-announced", source: "IGN" },
      { url: "https://people.com/joseph-quinn-gushes-over-robert-downey-jr-avengers-doomsday-exclusive-11777721", source: "People" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-040_Human_Torch_bf683dab.webp",
    cardNumber: "040",
  },
  {
    id: "the-thing",
    name: "The Thing",
    actor: "Ebon Moss-Bachrach",
    faction: "Fantastic Four",
    status: "Confirmed",
    roleSummary: "Ben Grimm appears in Doomsday alongside the rest of the Fantastic Four, interacting with the Avengers and X-Men against a multiversal threat. Kevin Feige has called having the FF in Doomsday 'a thrill.'",
    newsHeadline: "Kevin Feige Teases the Fantastic Four in 'Avengers: Doomsday': 'It's a Thrill'",
    articles: [
      { url: "https://www.marvel.com/articles/movies/fantastic-four-first-steps-avengers-doomsday-kevin-feige", source: "Marvel.com" },
      { url: "https://vocal.media/beat/avengers-doomsday-s-main-twist-might-be-hidden-in-plain-sight", source: "Vocal" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-109_The_Thing_a5dae37c.webp",
    cardNumber: "109",
  },
  {
    id: "gambit",
    name: "Gambit",
    actor: "Channing Tatum",
    faction: "X-Men",
    status: "Confirmed",
    roleSummary: "Channing Tatum's Gambit returns with a more serious, dramatic role compared to his comedic Deadpool & Wolverine appearance. He'll be a member of the X-Men facing Doctor Doom, with Tatum toning down the thick Cajun accent for the darker tone.",
    newsHeadline: "Channing Tatum's Gambit Takes On Serious Role In Avengers: Doomsday",
    articles: [
      { url: "https://screenrant.com/avengers-doomsday-xmen-teaser-channing-tatum-gambit-darker/", source: "Screen Rant" },
      { url: "https://variety.com/2025/film/news/channing-tatum-gambit-accent-avengers-doomsday-injury-1236504531/", source: "Variety" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-105_Gambit_4c11ff4d.webp",
    cardNumber: "105",
  },
  {
    id: "cyclops",
    name: "Cyclops",
    actor: "James Marsden",
    faction: "X-Men",
    status: "Confirmed",
    roleSummary: "James Marsden reprises Cyclops as part of a larger trend of bringing back original X-Men actors. He'll appear alongside Patrick Stewart and Ian McKellen, generating nostalgia while setting up future X-Men stories in the MCU.",
    newsHeadline: "Why James Marsden Is Playing Cyclops In Doomsday Instead Of The Prequel Actor",
    articles: [
      { url: "https://screenrant.com/avengers-doomsday-cyclops-actor-james-marsden-explained/", source: "Screen Rant" },
      { url: "https://www.yahoo.com/entertainment/movies/articles/cyclops-actor-james-marsden-says-023104494.html", source: "Yahoo Entertainment" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-107_Cyclops_f0689438.webp",
    cardNumber: "107",
  },
  {
    id: "magneto",
    name: "Magneto",
    actor: "Ian McKellen",
    faction: "X-Men",
    status: "Confirmed",
    roleSummary: "Ian McKellen returns as Magneto and has revealed his character will destroy New Jersey in the film. This has sparked speculation about a connection to Ms. Marvel, who resides in New Jersey, hinting at a larger mutant storyline.",
    newsHeadline: "Ian McKellen's Magneto Will Wreak Havoc — Again — In Avengers: Doomsday",
    articles: [
      { url: "https://www.inverse.com/entertainment/magneto-avengers-doomsday-comeback", source: "Inverse" },
      { url: "https://screenrant.com/avengers-doomsday-magneto-tease-bigger-ms-marvel-theory-mcu/", source: "Screen Rant" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chrome_169_magneto-5NA8vtyhi9Bfkd6qG3pBzv.webp",
    cardNumber: "169",
  },
  {
    id: "bucky-barnes",
    name: "Bucky Barnes",
    actor: "Sebastian Stan",
    faction: "Thunderbolts",
    status: "Confirmed",
    roleSummary: "Bucky is a core member of the Thunderbolts, now operating as the New Avengers. Rumors suggest he'll act as a mediator between the Thunderbolts and other Avengers. Heavy speculation that Bucky may sacrifice himself in the film.",
    newsHeadline: "Bucky Barnes' MCU Fate In Question as Doomsday Death Rumors Intensify",
    articles: [
      { url: "https://screenrant.com/avengers-doomsday-bucky-barnes-death-update-the-batman-2/", source: "Screen Rant" },
      { url: "https://www.yahoo.com/entertainment/movies/articles/bucky-barnes-sentry-avengers-doomsday-220622695.html", source: "Yahoo Entertainment" },
    ],
    cardImageUrl: null,
    cardNumber: null,
  },
  {
    id: "ant-man",
    name: "Ant-Man",
    actor: "Paul Rudd",
    faction: "Avengers",
    status: "Confirmed",
    roleSummary: "Paul Rudd returns as Ant-Man, though his specific role is being kept under wraps. Rudd has been coy in interviews, joking that he doesn't even know the plot. His role is expected to be significant given his history with the Avengers.",
    newsHeadline: "Paul Rudd Addresses Ant-Man Future In 'Avengers: Doomsday' & 'Secret Wars'",
    articles: [
      { url: "https://deadline.com/2025/03/paul-rudd-ant-man-future-avengers-doomsday-secret-wars-1236327867/", source: "Deadline" },
      { url: "https://screenrant.com/paul-rudd-avengers-doomsday-story-response/", source: "Screen Rant" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-141_Ant-Man_b6db983b.webp",
    cardNumber: "141",
  },
  {
    id: "shang-chi",
    name: "Shang-Chi",
    actor: "Simu Liu",
    faction: "Avengers",
    status: "Confirmed",
    roleSummary: "Shang-Chi returns as an older, more self-assured hero on Sam Wilson's new Avengers team. Simu Liu has called the film 'a love letter to superhero movies' and hinted at interactions with the X-Men.",
    newsHeadline: "How Shang-Chi Has Changed in Avengers: Doomsday Revealed by Simu Liu",
    articles: [
      { url: "https://comicbook.com/marvel/news/how-shang-chi-has-changed-in-avengers-doomsday-revealed-by-simu-liu-exclusive/", source: "ComicBook.com" },
      { url: "https://deadline.com/2025/11/simu-liu-avengers-doomsday-love-letter-superhero-movies-1236605870/", source: "Deadline" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-159_Shang-Chi_40d93a82.webp",
    cardNumber: "159",
  },
  {
    id: "loki",
    name: "Loki",
    actor: "Tom Hiddleston",
    faction: "Avengers",
    status: "Confirmed",
    roleSummary: "After becoming the God of Stories to protect the multiverse, Loki returns to join the Avengers against Doctor Doom. This marks a significant turn from villain to hero, and his multiverse knowledge will be critical to the fight.",
    newsHeadline: "Marvel's Avengers: Doomsday Rewrites Tom Hiddleston's Loki",
    articles: [
      { url: "https://screenrant.com/avengers-doomsday-rewrites-tom-hiddleston-loki/", source: "Screen Rant" },
      { url: "https://deadline.com/2025/12/tom-hiddleston-loki-avengers-doomsday-story-1236658815/", source: "Deadline" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/STUDIOS_TVA-1_Loki-gNty6SoseZJiimEM3QLzHg.webp",
    cardNumber: "TVA-1",
  },
  {
    id: "spider-man",
    name: "Spider-Man",
    actor: "Tom Holland",
    faction: "Avengers",
    status: "Rumored",
    roleSummary: "Tom Holland's Spider-Man is heavily rumored but not officially confirmed. His role could involve a team-up with Loki against Doctor Doom, leveraging his multiverse experience. Conflicting reports suggest scheduling conflicts may limit his appearance.",
    newsHeadline: "Tom Holland's Spider-Man Return In Doomsday Just Became More Likely",
    articles: [
      { url: "https://screenrant.com/tom-holland-spider-man-avengers-doomsday-return-tom-hiddleston-comments/", source: "Screen Rant" },
      { url: "https://www.cbr.com/spider-man-avengers-doomsday-appearance/", source: "CBR" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-101_Spider-Man_318857c1.webp",
    cardNumber: "101",
  },
  {
    id: "wolverine",
    name: "Wolverine",
    actor: "Hugh Jackman",
    faction: "X-Men",
    status: "Rumored",
    roleSummary: "After Deadpool & Wolverine's massive success, Hugh Jackman's Wolverine is heavily rumored for Doomsday. His inclusion would unite the X-Men roster with the Avengers and Fantastic Four for the first time in the MCU.",
    newsHeadline: "Hugh Jackman's Wolverine Rumored to Join X-Men Roster in Avengers: Doomsday",
    articles: [
      { url: "https://screenrant.com/avengers-doomsday-xmen-teaser-channing-tatum-gambit-darker/", source: "Screen Rant" },
      { url: "https://variety.com/2025/film/news/channing-tatum-gambit-accent-avengers-doomsday-injury-1236504531/", source: "Variety" },
    ],
    cardImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/CHROME-103_Wolverine_1cc49682.webp",
    cardNumber: "103",
  },
];

// Faction colors and icons
const FACTION_CONFIG: Record<string, { color: string; borderColor: string; bgColor: string; icon: typeof Shield }> = {
  Villain: { color: "text-green-400", borderColor: "border-green-500/40", bgColor: "bg-green-500/10", icon: Swords },
  Avengers: { color: "text-blue-400", borderColor: "border-blue-500/40", bgColor: "bg-blue-500/10", icon: Shield },
  "Fantastic Four": { color: "text-cyan-400", borderColor: "border-cyan-500/40", bgColor: "bg-cyan-500/10", icon: Flame },
  "X-Men": { color: "text-amber-400", borderColor: "border-amber-500/40", bgColor: "bg-amber-500/10", icon: Zap },
  Thunderbolts: { color: "text-red-400", borderColor: "border-red-500/40", bgColor: "bg-red-500/10", icon: Star },
};

export default function DoomsdaySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const character = DOOMSDAY_CHARACTERS[activeIndex];
  const faction = FACTION_CONFIG[character.faction] || FACTION_CONFIG.Avengers;
  const FactionIcon = faction.icon;

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % DOOMSDAY_CHARACTERS.length);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + DOOMSDAY_CHARACTERS.length) % DOOMSDAY_CHARACTERS.length);
  }, [activeIndex, goTo]);

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goNext, 8000);
    return () => clearInterval(timer);
  }, [goNext, isPaused]);

  // Faction counts
  const factionCounts = DOOMSDAY_CHARACTERS.reduce((acc, c) => {
    acc[c.faction] = (acc[c.faction] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <section
      className="relative py-16 lg:py-24 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img src={BG_IMG} alt="" className="w-full h-full object-cover opacity-40" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      {/* Green energy accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/60 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full mb-4">
            <Swords className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-bold tracking-wide">MAY 1, 2026 — IN THEATERS</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            AVENGERS: <span className="text-green-400">DOOMSDAY</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            The biggest Marvel event in history. Track every confirmed and rumored character — with the latest news, insider intel, and their cards from our collection.
          </p>
        </div>

        {/* Main Content: Doom Image + Character Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start max-w-7xl mx-auto">

          {/* Left: Doctor Doom Image (desktop only) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="relative">
              <div className="absolute -inset-4 bg-green-500/5 rounded-3xl blur-2xl" />
              <img
                src={DOOM_IMG}
                alt="Doctor Doom"
                className="relative w-full rounded-2xl shadow-2xl shadow-green-900/30"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-2xl p-4">
                <p className="text-green-400 text-xs font-bold tracking-widest">THE THREAT</p>
                <p className="text-white text-lg font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>DOCTOR DOOM</p>
              </div>
            </div>
          </div>

          {/* Center: Character Spotlight */}
          <div className="lg:col-span-6">
            <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
              {/* Character Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${faction.bgColor} border ${faction.borderColor}`}>
                    <FactionIcon className={`w-5 h-5 ${faction.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${faction.color}`}>
                        {character.faction}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        character.status === "Confirmed"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}>
                        {character.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Anton', sans-serif" }}>
                      {character.name.toUpperCase()}
                    </h3>
                  </div>
                </div>
                <span className="text-muted-foreground text-sm hidden sm:block">
                  {activeIndex + 1} / {DOOMSDAY_CHARACTERS.length}
                </span>
              </div>

              {/* Actor */}
              <p className="text-muted-foreground text-sm mb-4">
                Played by <span className="text-foreground font-semibold">{character.actor}</span>
              </p>

              {/* Card Image + Intel */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
                {/* Card Image */}
                {character.cardImageUrl && (
                  <div className="sm:col-span-2">
                    <Link href="/cards">
                      <div className="group relative cursor-pointer">
                        <div className={`absolute -inset-1 rounded-xl ${faction.bgColor} opacity-50 group-hover:opacity-80 blur-sm transition-opacity`} />
                        <img
                          src={character.cardImageUrl}
                          alt={`${character.name} — 2025 Topps Chrome #${character.cardNumber}`}
                          className="relative w-full rounded-lg shadow-lg group-hover:scale-[1.02] transition-transform"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg p-2">
                          <p className="text-[10px] text-white/70 font-mono">2025 Topps Chrome #{character.cardNumber}</p>
                          <p className="text-[10px] text-primary font-bold">IN OUR COLLECTION →</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Intel Panel */}
                <div className={character.cardImageUrl ? "sm:col-span-3" : "sm:col-span-5"}>
                  {/* Role Summary */}
                  <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-4 mb-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> CHARACTER INTEL
                    </p>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {character.roleSummary}
                    </p>
                  </div>

                  {/* News Headline */}
                  <div className={`border ${faction.borderColor} rounded-xl p-4 ${faction.bgColor}`}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
                      <Newspaper className="w-3.5 h-3.5" /> LATEST NEWS
                    </p>
                    <p className="text-sm font-semibold text-foreground mb-3 leading-snug">
                      {character.newsHeadline}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {character.articles.map((article, i) => (
                        <a
                          key={i}
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 text-xs font-bold ${faction.color} hover:underline`}
                        >
                          <ExternalLink className="w-3 h-3" />
                          {article.source}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={goPrev}
                    className="p-2 rounded-lg bg-card/60 border border-border hover:border-green-500/40 hover:bg-green-500/10 transition-colors"
                    aria-label="Previous character"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goNext}
                    className="p-2 rounded-lg bg-card/60 border border-border hover:border-green-500/40 hover:bg-green-500/10 transition-colors"
                    aria-label="Next character"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Dot indicators */}
                <div className="flex gap-1 flex-wrap justify-end max-w-[200px]">
                  {DOOMSDAY_CHARACTERS.map((c, i) => {
                    const f = FACTION_CONFIG[c.faction] || FACTION_CONFIG.Avengers;
                    return (
                      <button
                        key={c.id}
                        onClick={() => goTo(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === activeIndex
                            ? `${f.color.replace("text-", "bg-")} scale-125`
                            : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        }`}
                        aria-label={`Go to ${c.name}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Faction Roster */}
          <div className="lg:col-span-3">
            <div className="bg-card/40 backdrop-blur-sm border border-border rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                DOOMSDAY ROSTER
              </h4>

              {/* Faction summary */}
              <div className="space-y-2 mb-4">
                {Object.entries(factionCounts).map(([factionName, count]) => {
                  const fc = FACTION_CONFIG[factionName] || FACTION_CONFIG.Avengers;
                  const FIcon = fc.icon;
                  return (
                    <div key={factionName} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <FIcon className={`w-3.5 h-3.5 ${fc.color}`} />
                        <span className={fc.color}>{factionName}</span>
                      </div>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  ALL CHARACTERS
                </h4>
                <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
                  {DOOMSDAY_CHARACTERS.map((c, i) => {
                    const fc = FACTION_CONFIG[c.faction] || FACTION_CONFIG.Avengers;
                    const isActive = i === activeIndex;
                    return (
                      <button
                        key={c.id}
                        onClick={() => goTo(i)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 ${
                          isActive
                            ? `${fc.bgColor} ${fc.borderColor} border font-bold`
                            : "hover:bg-card/80 border border-transparent"
                        }`}
                      >
                        {c.cardImageUrl && (
                          <img src={c.cardImageUrl} alt="" className="w-6 h-8 rounded-sm object-cover shrink-0" loading="lazy" />
                        )}
                        {!c.cardImageUrl && (
                          <div className={`w-6 h-8 rounded-sm ${fc.bgColor} border ${fc.borderColor} flex items-center justify-center shrink-0`}>
                            <span className="text-[8px]">?</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className={`block truncate ${isActive ? fc.color : "text-foreground/80"}`}>
                            {c.name}
                          </span>
                          <span className="block text-[10px] text-muted-foreground truncate">{c.actor}</span>
                        </div>
                        {c.status === "Rumored" && (
                          <span className="text-[8px] text-amber-400 ml-auto shrink-0">?</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-4">
              <Link href="/cards">
                <Button variant="outline" className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10 font-bold text-sm">
                  Browse All Doomsday Cards
                  <ExternalLink className="w-3.5 h-3.5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom: Movie countdown */}
        <div className="mt-10 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {DOOMSDAY_CHARACTERS.filter(c => c.status === "Confirmed").length} confirmed &middot;{" "}
            {DOOMSDAY_CHARACTERS.filter(c => c.status === "Rumored").length} rumored &middot;{" "}
            {DOOMSDAY_CHARACTERS.filter(c => c.cardImageUrl).length} in our card database
          </p>
        </div>
      </div>
    </section>
  );
}
