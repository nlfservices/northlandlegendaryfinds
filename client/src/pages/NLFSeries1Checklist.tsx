/**
 * NLF Marvel Mint Series 1 — 83 Card Checklist
 * SlabMethod-inspired clean checklist format
 * Cards listed by parallel type, one per line, all caps
 */
import SEO, { breadcrumbJsonLd } from "@/components/SEO";
import { useState } from "react";
import { ListChecks, ChevronDown, ChevronUp, Download, Shield, Award, Gem } from "lucide-react";

// ─── Card Data ───────────────────────────────────────────────────────────────

interface CardEntry {
  year: string;
  brand: string;
  set: string;
  parallel: string;
  number: string;
  character: string;
  serial: string;
  grader: string;
  grade: string;
}

interface Section {
  title: string;
  subtitle: string;
  color: string;
  cards: CardEntry[];
}

const sections: Section[] = [
  {
    title: "BRONZE /100",
    subtitle: "Raw — BCW Magnetic Holders",
    color: "#CD7F32",
    cards: [
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#1", character: "HERCULES", serial: "11/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#8", character: "ULTRON", serial: "69/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#5", character: "COSMO THE SPACEDOG", serial: "6/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#9", character: "MADAME WEB", serial: "17/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#11", character: "ODIN", serial: "44/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#13", character: "MS. MARVEL", serial: "49/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#15", character: "KINGPIN", serial: "6/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#17", character: "RONAN THE ACCUSER", serial: "29/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#21", character: "THE COLLECTOR", serial: "69/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#23", character: "WEREWOLF", serial: "16/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#25", character: "BLACK KNIGHT", serial: "80/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#27", character: "GLADIATOR", serial: "27/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#29", character: "IRONHEART", serial: "13/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#31", character: "DAGGER", serial: "96/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#33", character: "WONDER MAN", serial: "30/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#35", character: "AGENT HILL", serial: "49/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#37", character: "HEIMDALL", serial: "26/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#39", character: "MEDUSA", serial: "40/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#41", character: "EGO", serial: "75/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#43", character: "J. JONAH JAMESON", serial: "95/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#45", character: "SQUIRREL GIRL", serial: "45/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#47", character: "MUSE", serial: "30/100", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "BRONZE /100", number: "#49", character: "MYSTERIO", serial: "26/100", grader: "", grade: "RAW" },
    ],
  },
  {
    title: "SILVER /75",
    subtitle: "Raw — BCW Magnetic Holders",
    color: "#C0C0C0",
    cards: [
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "SILVER /75", number: "#51", character: "BEAST", serial: "14/75", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "SILVER /75", number: "#53", character: "WAR MACHINE", serial: "38/75", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "SILVER /75", number: "#55", character: "GHOST", serial: "2/75", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "SILVER /75", number: "#57", character: "OKOYE", serial: "58/75", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "SILVER /75", number: "#59", character: "MONICA RAMBEAU", serial: "31/75", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "SILVER /75", number: "#61", character: "VALKYRIE", serial: "20/75", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "SILVER /75", number: "#63", character: "MANTIS", serial: "5/75", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "SILVER /75", number: "#65", character: "IRON FIST", serial: "75/75", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "SILVER /75", number: "#71", character: "ANCIENT ONE", serial: "35/75", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "SILVER /75", number: "#67", character: "BLACK BOLT", serial: "15/75", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "SILVER /75", number: "#73", character: "NAMOR", serial: "43/75", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "SILVER /75", number: "#75", character: "DOCTOR OCTOPUS", serial: "8/75", grader: "", grade: "RAW" },
    ],
  },
  {
    title: "GOLD /50",
    subtitle: "Raw — BCW Magnetic Holders",
    color: "#FFD700",
    cards: [
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "GOLD /50", number: "#79", character: "ANT-MAN", serial: "45/50", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "GOLD /50", number: "#81", character: "CAPTAIN MARVEL", serial: "9/50", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "GOLD /50", number: "#85", character: "STAR-LORD", serial: "17/50", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "GOLD /50", number: "#87", character: "CYCLOPS", serial: "7/50", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "GOLD /50", number: "#93", character: "GAMORA", serial: "3/50", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "GOLD /50", number: "#95", character: "ELEKTRA", serial: "35/50", grader: "", grade: "RAW" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "GOLD /50", number: "#99", character: "ROCKET RACCOON", serial: "3/50", grader: "", grade: "RAW" },
    ],
  },
  {
    title: "PLATINUM REFRACTOR /99",
    subtitle: "AGS Graded",
    color: "#E5E4E2",
    cards: [
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "PLATINUM REFRACTOR /99", number: "#117", character: "PROFESSOR X", serial: "76/99", grader: "AGS", grade: "NM-MT+ 8.5" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "PLATINUM REFRACTOR /99", number: "#113", character: "BLACK WIDOW", serial: "74/99", grader: "AGS", grade: "MINT 9" },
    ],
  },
  {
    title: "BRONZE GOLD REFRACTOR /50",
    subtitle: "AGS Graded",
    color: "#CD7F32",
    cards: [
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#41", character: "EGO", serial: "6/50", grader: "AGS", grade: "MINT+ 9.5" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#43", character: "J. JONAH JAMESON", serial: "13/50", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#45", character: "SQUIRREL GIRL", serial: "18/50", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#47", character: "MUSE", serial: "25/50", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#49", character: "MYSTERIO", serial: "7/50", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#3", character: "ULTRON", serial: "3/50", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#7", character: "NOVA", serial: "23/50", grader: "AGS", grade: "MINT 9" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#9", character: "MADAME WEB", serial: "9/50", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#11", character: "ODIN", serial: "17/50", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#13", character: "MS. MARVEL", serial: "13/50", grader: "AGS", grade: "MINT 9" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#15", character: "KINGPIN", serial: "43/50", grader: "AGS", grade: "MINT 9" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#17", character: "RONAN THE ACCUSER", serial: "9/50", grader: "AGS", grade: "MINT 9" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#21", character: "THE COLLECTOR", serial: "3/50", grader: "AGS", grade: "MINT+ 9.5" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#23", character: "WEREWOLF", serial: "42/50", grader: "AGS", grade: "MINT 9" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#7", character: "NOVA", serial: "23/50", grader: "AGS", grade: "MINT 9" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#3", character: "ULTRON", serial: "9/50", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#25", character: "BLACK KNIGHT", serial: "41/50", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#27", character: "GLADIATOR", serial: "3/50", grader: "AGS", grade: "MINT+ 9.5" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#29", character: "IRONHEART", serial: "16/50", grader: "AGS", grade: "NM-MT 8" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#33", character: "WONDER MAN", serial: "17/50", grader: "AGS", grade: "MINT 9" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#35", character: "AGENT HILL", serial: "34/50", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "BRONZE GOLD REFRACTOR /50", number: "#37", character: "HEIMDALL", serial: "17/50", grader: "AGS", grade: "NM-MT+ 8.5" },
    ],
  },
  {
    title: "SILVER GOLD REFRACTOR /75",
    subtitle: "AGS Graded",
    color: "#C0C0C0",
    cards: [
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "SILVER GOLD REFRACTOR /75", number: "#51", character: "BEAST", serial: "26/75", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "SILVER GOLD REFRACTOR /75", number: "#53", character: "WAR MACHINE", serial: "11/75", grader: "AGS", grade: "NM-MT 8" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "SILVER GOLD REFRACTOR /75", number: "#55", character: "GHOST", serial: "14/75", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "SILVER GOLD REFRACTOR /75", number: "#61", character: "VALKYRIE", serial: "7/75", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "SILVER GOLD REFRACTOR /75", number: "#67", character: "BLACK BOLT", serial: "45/75", grader: "AGS", grade: "GEM-MT 10" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "SILVER GOLD REFRACTOR /75", number: "#71", character: "ANCIENT ONE", serial: "3/75", grader: "AGS", grade: "NM-MT+ 8.5" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "SILVER GOLD REFRACTOR /75", number: "#73", character: "NAMOR", serial: "12/75", grader: "AGS", grade: "GEM-MT 10" },
    ],
  },
  {
    title: "GOLD GOLD REFRACTOR /50",
    subtitle: "AGS Graded",
    color: "#FFD700",
    cards: [
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "GOLD GOLD REFRACTOR /50", number: "#85", character: "STAR-LORD", serial: "39/50", grader: "AGS", grade: "MINT+ 9.5" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "GOLD GOLD REFRACTOR /50", number: "#89", character: "FALCON (CAPTAIN AMERICA)", serial: "18/50", grader: "AGS", grade: "MINT+ 9.5" },
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "GOLD GOLD REFRACTOR /50", number: "#99", character: "ROCKET RACCOON", serial: "47/50", grader: "AGS", grade: "MINT 9" },
    ],
  },
  {
    title: "GOLD ORANGE REFRACTOR /50",
    subtitle: "AGS Graded",
    color: "#FF8C00",
    cards: [
      { year: "2025", brand: "TOPPS", set: "CHROME MARVEL MINT", parallel: "GOLD ORANGE REFRACTOR /50", number: "#33", character: "WONDER MAN", serial: "17/50", grader: "AGS", grade: "MINT 9" },
    ],
  },
  {
    title: "GOLD /50",
    subtitle: "BGS Graded",
    color: "#FFD700",
    cards: [
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "GOLD /50", number: "#1", character: "HERCULES", serial: "28/50", grader: "BGS", grade: "MINT 9" },
    ],
  },
  {
    title: "PRINTING PLATES 1/1",
    subtitle: "AGS Graded",
    color: "#9B59B6",
    cards: [
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "YELLOW PRINTING PLATE 1/1", number: "#60", character: "WINTER SOLDIER", serial: "1/1", grader: "AGS", grade: "MINT 9" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "CYAN PRINTING PLATE 1/1", number: "#17", character: "RONAN THE ACCUSER", serial: "1/1", grader: "AGS", grade: "MINT+ 9.5" },
    ],
  },
  {
    title: "PRINTING PLATES 1/1",
    subtitle: "Raw — Topps Case",
    color: "#9B59B6",
    cards: [
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "CYAN PRINTING PLATE 1/1", number: "#45", character: "SQUIRREL GIRL", serial: "1/1", grader: "", grade: "RAW" },
    ],
  },
  {
    title: "GAMBIT'S DECK INSERT /99",
    subtitle: "CGC Graded",
    color: "#E74C3C",
    cards: [
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "GAMBIT'S DECK", number: "#C-A", character: "WOLVERINE — ACE OF CLUBS", serial: "61/99", grader: "CGC", grade: "MINT 9" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "GAMBIT'S DECK", number: "#C-8", character: "LOKI — 8 OF CLUBS", serial: "/99", grader: "CGC", grade: "MINT 9" },
      { year: "2025", brand: "TOPPS", set: "MARVEL MINT", parallel: "GAMBIT'S DECK", number: "#D-3", character: "LEGION — 3 OF DIAMONDS", serial: "74/99", grader: "CGC", grade: "MINT 9" },
    ],
  },
];

// ─── Grade Badge Color ───────────────────────────────────────────────────────

function getGradeColor(grade: string): string {
  if (grade.includes("10")) return "text-amber-400";
  if (grade.includes("9.5")) return "text-yellow-300";
  if (grade.includes("9") && !grade.includes("9.5")) return "text-emerald-400";
  if (grade.includes("8.5")) return "text-sky-400";
  if (grade.includes("8") && !grade.includes("8.5")) return "text-blue-400";
  if (grade === "RAW") return "text-zinc-400";
  return "text-zinc-300";
}

function getGraderBadge(grader: string): string {
  switch (grader) {
    case "AGS": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    case "BGS": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "CGC": return "bg-red-500/20 text-red-300 border-red-500/30";
    default: return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function NLFSeries1Checklist() {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set(sections.map((_, i) => i)) // All expanded by default
  );

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const totalCards = sections.reduce((sum, s) => sum + s.cards.length, 0);
  const gradedCards = sections.reduce(
    (sum, s) => sum + s.cards.filter((c) => c.grade !== "RAW").length,
    0
  );
  const rawCards = totalCards - gradedCards;
  const gem10Count = sections.reduce(
    (sum, s) => sum + s.cards.filter((c) => c.grade.includes("10")).length,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="NLF Marvel Mint Series 1 — 83 Card Checklist"
        description="Complete 83-card checklist for Northland Legendary Finds Marvel Mint Series 1 repack. Features 2025 Topps Marvel Mint and Chrome Marvel Mint cards — Bronze, Silver, Gold, Platinum Refractors, Printing Plates, and Gambit's Deck inserts."
        path="/nlf-series-1"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Checklists", url: "/checklists" },
          { name: "NLF Series 1", url: "/nlf-series-1" },
        ])}
      />

      {/* ─── Header ─── */}
      <section className="relative py-12 lg:py-16 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative z-10 max-w-5xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <ListChecks className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-bold tracking-wide">OFFICIAL CHECKLIST</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              NLF MARVEL MINT{" "}
              <span className="text-primary">SERIES 1</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              {totalCards} Card Checklist — Finalized on 5/20/2026
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-2xl mx-auto italic">
              Individual items in this series have been sealed and will not be changed.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{totalCards}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Cards</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-400">{gradedCards}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Graded Slabs</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-zinc-400">{rawCards}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Raw Cards</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-400">{gem10Count}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">GEM-MT 10s</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Card List ─── */}
      <section className="py-8 lg:py-12">
        <div className="container max-w-5xl">
          {sections.map((section, sectionIndex) => {
            const isExpanded = expandedSections.has(sectionIndex);
            return (
              <div key={sectionIndex} className="mb-4">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(sectionIndex)}
                  className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: section.color }}
                    />
                    <div className="text-left">
                      <h2 className="font-bold text-base sm:text-lg" style={{ fontFamily: "'Anton', sans-serif" }}>
                        {section.title}
                      </h2>
                      <p className="text-xs text-muted-foreground">{section.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {section.cards.length} card{section.cards.length !== 1 ? "s" : ""}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </button>

                {/* Card Rows */}
                {isExpanded && (
                  <div className="mt-1 border border-border rounded-lg overflow-hidden">
                    {/* Table Header (desktop) */}
                    <div className="hidden sm:grid sm:grid-cols-[60px_1fr_140px_80px_100px] gap-2 px-4 py-2 bg-muted/30 border-b border-border text-xs text-muted-foreground uppercase tracking-wider font-medium">
                      <span>Card #</span>
                      <span>Character</span>
                      <span>Serial</span>
                      <span>Grader</span>
                      <span>Grade</span>
                    </div>

                    {section.cards.map((card, cardIndex) => (
                      <div
                        key={cardIndex}
                        className={`px-4 py-2.5 ${
                          cardIndex % 2 === 0 ? "bg-card" : "bg-muted/10"
                        } ${cardIndex < section.cards.length - 1 ? "border-b border-border/50" : ""}`}
                      >
                        {/* Desktop Row */}
                        <div className="hidden sm:grid sm:grid-cols-[60px_1fr_140px_80px_100px] gap-2 items-center">
                          <span className="text-sm font-mono text-muted-foreground">
                            {card.number}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {card.character}
                          </span>
                          <span className="text-sm font-mono text-muted-foreground">
                            {card.serial}
                          </span>
                          <span>
                            {card.grader ? (
                              <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${getGraderBadge(card.grader)}`}>
                                {card.grader}
                              </span>
                            ) : (
                              <span className="text-xs text-zinc-500">—</span>
                            )}
                          </span>
                          <span className={`text-sm font-bold ${getGradeColor(card.grade)}`}>
                            {card.grade}
                          </span>
                        </div>

                        {/* Mobile Row */}
                        <div className="sm:hidden">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground">{card.number}</span>
                              <span className="text-sm font-semibold text-foreground">{card.character}</span>
                            </div>
                            <span className={`text-sm font-bold ${getGradeColor(card.grade)}`}>
                              {card.grade}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{card.serial}</span>
                            {card.grader && (
                              <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${getGraderBadge(card.grader)}`}>
                                {card.grader}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Summary & Info ─── */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "'Anton', sans-serif" }}>
            SERIES <span className="text-primary">BREAKDOWN</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Grading Distribution */}
            <div className="bg-background border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wide">Grading Companies</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">AGS Graded</span>
                  <span className="text-sm font-bold text-purple-300">35</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">CGC Graded</span>
                  <span className="text-sm font-bold text-red-300">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">BGS Graded</span>
                  <span className="text-sm font-bold text-blue-300">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Raw (BCW Holders)</span>
                  <span className="text-sm font-bold text-zinc-400">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Raw (Topps Case)</span>
                  <span className="text-sm font-bold text-zinc-400">1</span>
                </div>
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="bg-background border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Gem className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm uppercase tracking-wide">Grade Distribution</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">GEM-MT 10</span>
                  <span className={`text-sm font-bold ${getGradeColor("10")}`}>16</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">MINT+ 9.5</span>
                  <span className={`text-sm font-bold ${getGradeColor("9.5")}`}>6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">MINT 9</span>
                  <span className={`text-sm font-bold ${getGradeColor("9")}`}>14</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">NM-MT+ 8.5</span>
                  <span className={`text-sm font-bold ${getGradeColor("8.5")}`}>3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">NM-MT 8</span>
                  <span className={`text-sm font-bold ${getGradeColor("8")}`}>2</span>
                </div>
              </div>
            </div>

            {/* Parallel Distribution */}
            <div className="bg-background border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm uppercase tracking-wide">Parallel Types</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Bronze /100</span>
                  <span className="text-sm font-bold" style={{ color: "#CD7F32" }}>23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Silver /75</span>
                  <span className="text-sm font-bold" style={{ color: "#C0C0C0" }}>12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gold /50</span>
                  <span className="text-sm font-bold" style={{ color: "#FFD700" }}>8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Refractors</span>
                  <span className="text-sm font-bold text-cyan-300">32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Printing Plates 1/1</span>
                  <span className="text-sm font-bold text-purple-300">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gambit's Deck /99</span>
                  <span className="text-sm font-bold text-red-300">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground/60 max-w-3xl mx-auto">
              Northland Legendary Finds is not affiliated with, endorsed by, or sponsored by Topps, Marvel, or any trading card manufacturer.
              All cards were lawfully acquired from the secondary market and independently repackaged by Northland Legendary Finds.
              Pack contents are randomly inserted. No specific card or grade is guaranteed.
              All trademarks, logos, and brand names are the property of their respective owners.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
