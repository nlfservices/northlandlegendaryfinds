/**
 * Battleworld — Card of the Day Hub
 * Themed around Doctor Doom's Secret Wars domain.
 * Features: cosmic background, Doom card flip animation, team filter tabs, archive grid.
 */

import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { trpc } from "@/lib/trpc";
import { getCharacterBackground } from "@/lib/cardBackgrounds";

// ── Assets ──────────────────────────────────────────────────────────────────
const BG_IMAGE = "/manus-storage/battleworld-bg_c7b881be.png";

// ── Team Definitions ────────────────────────────────────────────────────────
type TeamKey = "all" | "avengers" | "xmen" | "fantastic_four" | "guardians" | "villains" | "secret_wars";

interface TeamDef {
  key: TeamKey;
  label: string;
  color: string;
  members: string[];
}

const TEAMS: TeamDef[] = [
  { key: "all", label: "ALL (A-Z)", color: "#ffce4d", members: [] },
  {
    key: "avengers",
    label: "AVENGERS",
    color: "#e63946",
    members: [
      "iron man", "captain america", "thor", "hulk", "black widow", "hawkeye",
      "scarlet witch", "vision", "ant-man", "wasp", "falcon", "war machine",
      "black panther", "spider-man", "captain marvel", "she-hulk", "wonder man",
      "ms. marvel", "kate bishop", "shang-chi", "moon knight", "tony stark",
      "steve rogers", "natasha romanoff", "clint barton", "wanda maximoff",
      "sam wilson", "peter parker", "carol danvers", "bruce banner",
    ],
  },
  {
    key: "xmen",
    label: "X-MEN",
    color: "#ffd60a",
    members: [
      "wolverine", "storm", "cyclops", "jean grey", "rogue", "gambit",
      "beast", "nightcrawler", "colossus", "kitty pryde", "iceman", "angel",
      "magneto", "professor x", "psylocke", "cable", "bishop", "jubilee",
      "emma frost", "mystique", "deadpool", "x-23", "laura kinney",
      "logan", "ororo munroe", "scott summers",
    ],
  },
  {
    key: "fantastic_four",
    label: "FANTASTIC FOUR",
    color: "#4895ef",
    members: [
      "mr. fantastic", "invisible woman", "human torch", "thing",
      "reed richards", "sue storm", "johnny storm", "ben grimm",
      "silver surfer", "galactus", "franklin richards", "valeria richards",
    ],
  },
  {
    key: "guardians",
    label: "GUARDIANS",
    color: "#a855f7",
    members: [
      "star-lord", "gamora", "drax", "rocket raccoon", "groot", "mantis",
      "nebula", "adam warlock", "peter quill", "rocket",
    ],
  },
  {
    key: "villains",
    label: "VILLAINS",
    color: "#8b0000",
    members: [
      "doctor doom", "thanos", "loki", "venom", "green goblin", "kingpin",
      "ultron", "kang", "red skull", "carnage", "mephisto", "dormammu",
      "hela", "taskmaster", "baron zemo", "modok", "abomination",
      "doc ock", "doctor octopus", "vulture", "mysterio", "electro",
      "sandman", "rhino", "kraven", "scorpion", "hobgoblin",
      "norman osborn", "wilson fisk", "victor von doom",
    ],
  },
  {
    key: "secret_wars",
    label: "SECRET WARS",
    color: "#9d4edd",
    members: [
      "doctor doom", "beyonder", "molecule man", "spider-woman",
      "battleworld", "god emperor doom", "maker", "black swan",
      "namor", "black bolt", "medusa", "maximus",
    ],
  },
];

function getTeamForCharacter(characterName: string): TeamKey[] {
  const lower = characterName.toLowerCase();
  const teams: TeamKey[] = [];
  for (const team of TEAMS) {
    if (team.key === "all") continue;
    if (team.members.some((m) => lower.includes(m) || m.includes(lower))) {
      teams.push(team.key);
    }
  }
  return teams.length > 0 ? teams : ["all"];
}

// ── Constants ───────────────────────────────────────────────────────────────
const DOOM_GREEN = "#3fb56b";

const SET_COLORS: Record<string, string> = {
  mint: "#ffce4d",
  comic_book_heroes: "#5b8cff",
  marvel_studios: "#a86bff",
};

// ── Page Component ──────────────────────────────────────────────────────────
export default function Battleworld() {
  const [, navigate] = useLocation();
  const [activeTeam, setActiveTeam] = useState<TeamKey>("all");


  // Fetch today's card
  const todayQuery = trpc.cardOfTheDay.getTodaysCard.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
  });

  // Fetch archive (all past cards)
  const allDatesQuery = trpc.cardOfTheDay.getAllDates.useQuery(undefined, {
    staleTime: 1000 * 60 * 10,
  });

  const todayISO = new Date().toISOString().slice(0, 10);

  // Filter to only past/today cards
  const pastCards = useMemo(() => {
    if (!allDatesQuery.data) return [];
    return allDatesQuery.data.filter((c) => c.date <= todayISO);
  }, [allDatesQuery.data, todayISO]);

  // Filter by team
  const filteredCards = useMemo(() => {
    if (activeTeam === "all") {
      return [...pastCards].sort((a, b) => a.characterName.localeCompare(b.characterName));
    }
    return pastCards
      .filter((c) => getTeamForCharacter(c.characterName).includes(activeTeam))
      .sort((a, b) => a.characterName.localeCompare(b.characterName));
  }, [pastCards, activeTeam]);

  // Stats
  const totalCards = pastCards.length;
  const uniqueSets = new Set(pastCards.map((c) => c.setName)).size;

  const today = todayQuery.data;

  return (
    <>
      <Helmet>
        <title>Battleworld | Card of the Day Hub | Northland Legendary Finds</title>
        <meta
          name="description"
          content="Welcome to Battleworld — Doctor Doom's domain where one card rules each day. Explore daily featured Marvel trading cards organized by team, from Avengers to X-Men to Secret Wars."
        />
        <meta property="og:title" content="Battleworld | Northland Legendary Finds" />
        <meta property="og:description" content="Doctor Doom's domain — one card rules each day. Daily featured Marvel cards, team archives, and more." />
        <meta property="og:image" content={BG_IMAGE} />
      </Helmet>

      <div
        className="min-h-screen relative"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10">
          {/* ═══ HERO SECTION ═══ */}
          <section className="pt-24 pb-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
              {/* Title */}
              <h1
                className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-2"
                style={{
                  background: `linear-gradient(135deg, ${DOOM_GREEN}, #b0b0b0)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 40px rgba(63,181,107,0.3)",
                }}
              >
                BATTLEWORLD
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 font-medium mb-2">
                Doctor Doom's Domain — One Card Rules Each Day
              </p>
              <p className="text-sm text-gray-500 mb-10">
                {totalCards} cards featured across {uniqueSets} sets
              </p>



              {/* Today's Card CTA */}
              {today && (
                <button
                  onClick={() => navigate(`/card-of-the-day/${today.dateISO}`)}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full border transition-all hover:scale-105"
                  style={{
                    borderColor: DOOM_GREEN + "60",
                    background: "rgba(63,181,107,0.08)",
                  }}
                >
                  <span className="text-sm font-bold" style={{ color: DOOM_GREEN }}>
                    TODAY'S RULER:
                  </span>
                  <span className="text-white font-semibold">{today.characterName}</span>
                  <span className="text-gray-400">→</span>
                </button>
              )}
            </div>
          </section>

          {/* ═══ NEW SET RELEASE SPOTLIGHT ═══ */}
          <section className="px-4 pb-10">
            <div className="max-w-5xl mx-auto">
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(10,10,10,0.92), rgba(15,20,15,0.88))",
                  border: `1px solid ${DOOM_GREEN}30`,
                  boxShadow: `0 0 40px ${DOOM_GREEN}08`,
                }}
              >
                {/* Header bar */}
                <div
                  className="px-6 py-3 flex items-center gap-3"
                  style={{ background: `linear-gradient(90deg, ${DOOM_GREEN}20, transparent)` }}
                >
                  <span className="text-xs font-black tracking-widest" style={{ color: DOOM_GREEN }}>
                    ⚡ NEW RELEASE
                  </span>
                  <span className="text-xs text-gray-400">July 1, 2026</span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    {/* Left: Info */}
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                        2026 Topps Chrome Marvel
                      </h2>
                      <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                        The flagship Chrome set is here. 200-card base with 15+ DEBUT characters never before on a Topps card,
                        17 insert sets including One World Under Doom and The Beyond, plus Hobby-exclusive Clawed Chrome
                        and Storm's Lightning parallels.
                      </p>

                      {/* Key stats */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="text-center p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <div className="text-xl font-black text-white">200</div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Base Cards</div>
                        </div>
                        <div className="text-center p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <div className="text-xl font-black text-white">17</div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Insert Sets</div>
                        </div>
                        <div className="text-center p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <div className="text-xl font-black text-white">15+</div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Debut Cards</div>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-2 text-sm text-gray-300 mb-6">
                        <p>🎯 <strong className="text-white">Chase Hits:</strong> Kevin Feige Auto, Frank Miller Auto, Stan Lee Relics, 1960s Comic Excerpts</p>
                        <p>🔥 <strong className="text-white">Hobby Exclusives:</strong> Clawed Chrome, Storm's Lightning, Marvel Logofractor</p>
                        <p>⭐ <strong className="text-white">Key Inserts:</strong> One World Under Doom, The Beyond, Cordially Invited, Marvel Icons</p>
                      </div>

                      {/* CTA */}
                      <a
                        href="/mcu-news/2026-topps-chrome-marvel-complete-breakdown"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${DOOM_GREEN}, #2d8a4e)`,
                          color: "#000",
                        }}
                      >
                        Read Full Breakdown →
                      </a>
                    </div>

                    {/* Right: Product visual */}
                    <div className="flex-shrink-0">
                      <div
                        className="relative w-48 h-64 sm:w-56 sm:h-72 rounded-xl overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                          border: `2px solid ${DOOM_GREEN}50`,
                          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${DOOM_GREEN}15`,
                        }}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                          <div className="text-4xl mb-3">💎</div>
                          <div className="text-center">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">2026</div>
                            <div className="text-lg font-black text-white">CHROME</div>
                            <div className="text-sm font-bold" style={{ color: DOOM_GREEN }}>MARVEL</div>
                          </div>
                          <div className="mt-3 text-[10px] text-gray-500 text-center">
                            Hobby • Value • Mega
                          </div>
                        </div>
                        {/* Shimmer effect */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `linear-gradient(135deg, transparent 30%, ${DOOM_GREEN}12 50%, transparent 70%)`,
                            animation: "shimmer 3s infinite",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ TEAM FILTER TABS ═══ */}
          <section className="px-4 pb-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap justify-center gap-2">
                {TEAMS.map((team) => {
                  const isActive = activeTeam === team.key;
                  const count =
                    team.key === "all"
                      ? pastCards.length
                      : pastCards.filter((c) => getTeamForCharacter(c.characterName).includes(team.key)).length;

                  return (
                    <button
                      key={team.key}
                      onClick={() => setActiveTeam(team.key)}
                      className="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                      style={{
                        background: isActive ? team.color + "25" : "rgba(255,255,255,0.05)",
                        border: `2px solid ${isActive ? team.color : "rgba(255,255,255,0.1)"}`,
                        color: isActive ? team.color : "#9ca3af",
                        transform: isActive ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      {team.label}
                      {count > 0 && (
                        <span
                          className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                          style={{
                            background: isActive ? team.color + "30" : "rgba(255,255,255,0.08)",
                          }}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ═══ ARCHIVE GRID ═══ */}
          <section className="px-4 pb-24">
            <div className="max-w-6xl mx-auto">
              {filteredCards.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-lg">
                    {allDatesQuery.isLoading
                      ? "Loading the domains of Battleworld..."
                      : "No cards in this domain yet. Check back as Battleworld grows."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredCards.map((card, idx) => {
                    const isToday = card.date === todayISO;
                    const setColor = SET_COLORS[card.setName] || "#888";
                    const teams = getTeamForCharacter(card.characterName);
                    const teamColor = teams[0] !== "all"
                      ? TEAMS.find((t) => t.key === teams[0])?.color || "#888"
                      : setColor;

                    return (
                      <div
                        key={card.date}
                        onClick={() => navigate(`/card-of-the-day/${card.date}`)}
                        className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1"
                        style={{
                          animationDelay: `${idx * 30}ms`,
                          border: isToday
                            ? `2px solid ${DOOM_GREEN}`
                            : "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(0,0,0,0.5)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {/* Card image with NLF background */}
                        <div className="aspect-[2/3] relative overflow-hidden">
                          {/* Team-matched background */}
                          <img
                            src={getCharacterBackground(card.characterName)}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                          {card.frontImageUrl ? (
                            <img
                              src={card.frontImageUrl}
                              alt={card.characterName}
                              className="relative w-[78%] h-[85%] object-contain mx-auto mt-[7%] drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <span className="text-3xl">🃏</span>
                            </div>
                          )}

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Today badge */}
                          {isToday && (
                            <div
                              className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black"
                              style={{ background: DOOM_GREEN, color: "#000" }}
                            >
                              TODAY
                            </div>
                          )}

                          {/* Team dot */}
                          <div
                            className="absolute top-2 left-2 w-3 h-3 rounded-full border border-white/30"
                            style={{ background: teamColor }}
                            title={teams.join(", ")}
                          />
                        </div>

                        {/* Info */}
                        <div className="p-3">
                          <p className="text-white text-sm font-bold truncate">
                            {card.characterName}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[11px] text-gray-400">
                              {new Date(card.date + "T12:00:00").toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span
                              className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                              style={{ background: setColor + "20", color: setColor }}
                            >
                              {card.setLabel || card.setName}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* ═══ SEO CONTENT FOOTER ═══ */}
          <section className="px-4 pb-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="rounded-2xl p-8" style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <h2 className="text-xl font-bold text-white mb-4">Welcome to Battleworld</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  In Marvel's Secret Wars, Doctor Doom seized the power of the Beyonders and forged Battleworld — a patchwork
                  planet of salvaged realities where he ruled as God Emperor. Here at Northland Legendary Finds, our Battleworld
                  is where one graded Marvel trading card claims the throne each day. From Avengers to X-Men, Fantastic Four to
                  the Guardians of the Galaxy, every domain is represented.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  With Avengers: Doomsday approaching, the cards featured here connect directly to the characters rumored for
                  Marvel's next epic crossover. Explore the archive, discover which cards have ruled, and see which team's domain
                  grows the fastest.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="/characters" className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-colors">
                    Marvel Characters
                  </a>
                  <a href="/cards" className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-colors">
                    Card Database
                  </a>
                  <a href="/mcu-news" className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-colors">
                    MCU News
                  </a>
                  <a href="/about" className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-colors">
                    About NLF
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
