/**
 * NLF Infinity Series #1 — 165 Card Checklist
 * Finalized on 5/27/2026 — Individual items sealed and will not be changed
 * Available ONLY on Whatnot
 */
import SEO from "@/components/SEO";
import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Shield, Gem, Star, Zap } from "lucide-react";
import { Link } from "wouter";

// ─── Card Data (exact from CSV) ───────────────────────────────────────────────

interface CardEntry {
  no: number;
  description: string;
}

const allCards: CardEntry[] = [
  { no: 1, description: "2025 TOPPS MARVEL MINT ENCASED #2 EXODUS 55/100 RAW" },
  { no: 2, description: "2025 TOPPS MARVEL MINT ENCASED #4 KILLMONGER 84/100 RAW" },
  { no: 3, description: "2025 TOPPS MARVEL MINT ENCASED #6 RED HULK 41/100 RAW" },
  { no: 4, description: "2025 TOPPS MARVEL MINT ENCASED #10 KATE BISHOP 97/100 RAW" },
  { no: 5, description: "2025 TOPPS MARVEL MINT ENCASED #36 SENTRY 6/100 RAW" },
  { no: 6, description: "2025 TOPPS MARVEL MINT ENCASED #12 ELECTRO 59/100 RAW" },
  { no: 7, description: "2025 TOPPS MARVEL MINT ENCASED #14 IKARIS 24/100 RAW" },
  { no: 8, description: "2025 TOPPS MARVEL MINT ENCASED #16 EMMA FROST 94/100 RAW" },
  { no: 9, description: "2025 TOPPS MARVEL MINT ENCASED #34 UNION JACK 71/100 RAW" },
  { no: 10, description: "2025 TOPPS MARVEL MINT ENCASED #38 VOID 13/100 RAW" },
  { no: 11, description: "2025 TOPPS MARVEL MINT ENCASED #40 HOWARD THE DUCK 56/100 RAW" },
  { no: 12, description: "2025 TOPPS MARVEL MINT ENCASED #32 DRAX 65/100 RAW" },
  { no: 13, description: "2025 TOPPS MARVEL MINT ENCASED #42 SCORPION 78/100 RAW" },
  { no: 14, description: "2025 TOPPS MARVEL MINT ENCASED #30 CLOAK 57/100 RAW" },
  { no: 15, description: "2025 TOPPS MARVEL MINT ENCASED #44 ANGEL 74/100 RAW" },
  { no: 16, description: "2025 TOPPS MARVEL MINT ENCASED #46 THE PROWLER 26/100 RAW" },
  { no: 17, description: "2025 TOPPS MARVEL MINT ENCASED #28 CABLE 19/100 RAW" },
  { no: 18, description: "2025 TOPPS MARVEL MINT ENCASED #48 AMERICA CHAVEZ 2/100 RAW" },
  { no: 19, description: "2025 TOPPS MARVEL MINT ENCASED #26 M.O.D.O.K. 39/100 RAW" },
  { no: 20, description: "2025 TOPPS MARVEL MINT ENCASED #50 DRACULA 82/100 RAW" },
  { no: 21, description: "2025 TOPPS MARVEL MINT ENCASED #24 KITTY PRYDE 29/100 RAW" },
  { no: 22, description: "2025 TOPPS MARVEL MINT ENCASED #22 IRON PATRIOT 58/100 RAW" },
  { no: 23, description: "2025 TOPPS MARVEL MINT ENCASED #20 BISHOP 6/100 RAW" },
  { no: 24, description: "2025 TOPPS MARVEL MINT ENCASED #18 PHANTOM RIDER 85/100 RAW" },
  { no: 25, description: "2025 TOPPS MARVEL MINT ENCASED #52 QUICKSILVER 50/75 RAW" },
  { no: 26, description: "2025 TOPPS MARVEL MINT ENCASED #74 SILVER SABLE 1/75 RAW" },
  { no: 27, description: "2025 TOPPS MARVEL MINT ENCASED #72 SHE-HULK 64/75 RAW" },
  { no: 28, description: "2025 TOPPS MARVEL MINT ENCASED #70 ICEMAN 50/75 RAW" },
  { no: 29, description: "2025 TOPPS MARVEL MINT ENCASED #68 GROOT 51/75 RAW" },
  { no: 30, description: "2025 TOPPS MARVEL MINT ENCASED #66 COLOSSUS 5/75 RAW" },
  { no: 31, description: "2025 TOPPS MARVEL MINT ENCASED #64 PEPPER POTTS 52/75 RAW" },
  { no: 32, description: "2025 TOPPS MARVEL MINT ENCASED #62 SILVER SURFER 73/75 RAW" },
  { no: 33, description: "2025 TOPPS MARVEL MINT ENCASED #54 AGENT CARTER 27/75 RAW" },
  { no: 34, description: "2025 TOPPS MARVEL MINT ENCASED #56 BLACK CAT 1/75 RAW" },
  { no: 35, description: "2025 TOPPS MARVEL MINT ENCASED #58 NIGHTCRAWLER 55/75 RAW" },
  { no: 36, description: "2025 TOPPS MARVEL MINT ENCASED #60 WINTER SOLDIER 7/75 RAW" },
  { no: 37, description: "2025 TOPPS MARVEL MINT ENCASED #100 VISION 35/50 RAW" },
  { no: 38, description: "2025 TOPPS MARVEL MINT ENCASED #98 HUMAN TORCH 49/50 RAW" },
  { no: 39, description: "2025 TOPPS MARVEL MINT ENCASED #94 HAWKEYE 23/50 RAW" },
  { no: 40, description: "2025 TOPPS MARVEL MINT ENCASED #88 WASP 11/50 RAW" },
  { no: 41, description: "2025 TOPPS MARVEL MINT ENCASED #82 MAYOR LUKE CAGE 26/50 RAW" },
  { no: 42, description: "2025 TOPPS MARVEL MINT ENCASED #80 LOKI 42/50 RAW" },
  { no: 43, description: "2025 TOPPS MARVEL MINT ENCASED #76 NICK FURY 23/50 RAW" },
  { no: 44, description: "2025 TOPPS MARVEL THE COLLECTOR #2 INVISIBLE WOMAN 21/100 RAW" },
  { no: 45, description: "2025 TOPPS MARVEL THE COLLECTOR #56 ANT-MAN 7/100 RAW" },
  { no: 46, description: "2025 TOPPS MARVEL THE COLLECTOR #24 IRONHEART 71/100 RAW" },
  { no: 47, description: "2025 TOPPS MARVEL THE COLLECTOR #54 DRUIG 87/100 RAW" },
  { no: 48, description: "2025 TOPPS MARVEL THE COLLECTOR #22 WILSON FISK 63/100 RAW" },
  { no: 49, description: "2025 TOPPS MARVEL THE COLLECTOR #58 DR. CHRISTINE PALMER 94/100 RAW" },
  { no: 50, description: "2025 TOPPS MARVEL THE COLLECTOR #20 MOON KNIGHT 59/100 RAW" },
  { no: 51, description: "2025 TOPPS MARVEL THE COLLECTOR #60 THE ANCIENT ONE 82/100 RAW" },
  { no: 52, description: "2025 TOPPS MARVEL THE COLLECTOR #14 FALCON 73/100 RAW" },
  { no: 53, description: "2025 TOPPS MARVEL THE COLLECTOR #64 AMERICA CHAVEZ 3/100 RAW" },
  { no: 54, description: "2025 TOPPS MARVEL THE COLLECTOR #12 CAPTAIN AMERICA 51/100 RAW" },
  { no: 55, description: "2025 TOPPS MARVEL THE COLLECTOR #72 TREVOR SLATTERY 50/100 RAW" },
  { no: 56, description: "2025 TOPPS MARVEL THE COLLECTOR #78 HAWKEYE 74/100 RAW" },
  { no: 57, description: "2025 TOPPS MARVEL THE COLLECTOR #80 PEGGY CARTER 81/100 RAW" },
  { no: 58, description: "2025 TOPPS MARVEL THE COLLECTOR #30 DRAX 55/100 RAW" },
  { no: 59, description: "2025 TOPPS MARVEL THE COLLECTOR #32 YONDU 21/100 RAW" },
  { no: 60, description: "2025 TOPPS MARVEL THE COLLECTOR #38 ODIN 2/100 RAW" },
  { no: 61, description: "2025 TOPPS MARVEL THE COLLECTOR #4 THE THING 2/100 RAW" },
  { no: 62, description: "2025 TOPPS MARVEL THE COLLECTOR #50 MONICA RAMBEAU 93/100 RAW" },
  { no: 63, description: "2025 TOPPS MARVEL THE COLLECTOR #44 SIF 5/100 RAW" },
  { no: 64, description: "2025 TOPPS MARVEL THE COLLECTOR #40 FRIGGA 97/100 RAW" },
  { no: 65, description: "2025 TOPPS MARVEL THE COLLECTOR #V-14 BARON ZEMO 59/100 RAW" },
  { no: 66, description: "2025 TOPPS MARVEL THE COLLECTOR #V-24 RED HULK 17/100 RAW" },
  { no: 67, description: "2025 TOPPS MARVEL THE COLLECTOR #V-22 M.O.D.O.K. 48/100 RAW" },
  { no: 68, description: "2025 TOPPS MARVEL THE COLLECTOR #V-12 CROSSBONES 19/100 RAW" },
  { no: 69, description: "2025 TOPPS MARVEL THE COLLECTOR #V-18 DAR-BENN 71/100 RAW" },
  { no: 70, description: "2025 TOPPS MARVEL THE COLLECTOR #V-10 JUSTIN HAMMER 53/100 RAW" },
  { no: 71, description: "2025 TOPPS MARVEL THE COLLECTOR #V-16 KAECILIUS 2/100 RAW" },
  { no: 72, description: "2025 TOPPS MARVEL THE COLLECTOR #V-06 ALDRICH KILLIAN 31/100 RAW" },
  { no: 73, description: "2025 TOPPS MARVEL THE COLLECTOR #V-04 NAMOR 90/100 RAW" },
  { no: 74, description: "2025 TOPPS MARVEL THE COLLECTOR #73 WAR MACHINE 13/25 RAW" },
  { no: 75, description: "2025 TOPPS MARVEL THE COLLECTOR #83 IRON MAN 3/25 RAW" },
  { no: 76, description: "2025 TOPPS MARVEL THE COLLECTOR #25 ZURI 13/25 RAW" },
  { no: 77, description: "2025 TOPPS MARVEL THE COLLECTOR #59 WONG 17/25 RAW" },
  { no: 78, description: "2025 TOPPS MARVEL THE COLLECTOR #60 THE ANCIENT ONE 9/25 RAW" },
  { no: 79, description: "2025 TOPPS MARVEL THE COLLECTOR #4 THE THING 24/25 RAW" },
  { no: 80, description: "2025 TOPPS MARVEL THE COLLECTOR #2 INVISIBLE WOMAN 19/25 RAW" },
  { no: 81, description: "2025 TOPPS MARVEL THE COLLECTOR #66 SILVER SURFER 9/25 RAW" },
  { no: 82, description: "2025 TOPPS MARVEL THE COLLECTOR #74 VISION 16/25 RAW" },
  { no: 83, description: "2025 TOPPS MARVEL THE COLLECTOR #ST-5 MAYHEM IN MONACO 3/5 RAW" },
  { no: 84, description: "2025 TOPPS MARVEL THE COLLECTOR #ST-16 ROCKET LEADS THE CHARGE 9/10 RAW" },
  { no: 85, description: "2025 TOPPS MARVEL THE COLLECTOR #ST-25 INTRODUCING THE NEW AVENGERS 15/15 RAW" },
  { no: 86, description: "2025 TOPPS MARVEL THE COLLECTOR #ST-20 FENDING OFF FENRIS 1/25 RAW" },
  { no: 87, description: "2025 TOPPS MARVEL THE COLLECTOR #ST-24 A LEGACY LIVES ON 18/100 RAW" },
  { no: 88, description: "2025 TOPPS MARVEL THE COLLECTOR #ST-8 BLACK WIDOW EMERGES VICTORIOUS 49/100 RAW" },
  { no: 89, description: "2025 TOPPS MARVEL THE COLLECTOR #ST-7 STRENGTH OF THE WINTER SOLDIER 45/100 RAW" },
  { no: 90, description: "2025 TOPPS MARVEL THE COLLECTOR #74 VISION 8/15 RAW" },
  { no: 91, description: "2025 TOPPS MARVEL THE COLLECTOR #V-19 GRANDMASTER 4/5 RAW" },
  { no: 92, description: "2025 TOPPS MARVEL THE COLLECTOR #V-13 YELLOWJACKET 6/15 RAW" },
  { no: 93, description: "2025 TOPPS MARVEL THE COLLECTOR #V-04 NAMOR 3/25 RAW" },
  { no: 94, description: "2025 TOPPS MARVEL THE COLLECTOR #V-08 RONAN 24/25 RAW" },
  { no: 95, description: "2025 TOPPS MARVEL THE COLLECTOR #MT-5 NAMOR 4/5 RAW" },
  { no: 96, description: "2025 TOPPS MARVEL THE COLLECTOR #MT-16 CASSIE LANG 7/10 RAW" },
  { no: 97, description: "2025 TOPPS MARVEL THE COLLECTOR #MT-6 FALCON 7/15 RAW" },
  { no: 98, description: "2025 TOPPS MARVEL THE COLLECTOR #MT-21 THE THING 5/15 RAW" },
  { no: 99, description: "2025 TOPPS MARVEL THE COLLECTOR #MT-22 INVISIBLE WOMAN 15/25 RAW" },
  { no: 100, description: "2025 TOPPS MARVEL THE COLLECTOR #MT-22 INVISIBLE WOMAN 17/100 RAW" },
  { no: 101, description: "2025 TOPPS MARVEL THE COLLECTOR #MT-16 CASSIE LANG 18/100 RAW" },
  { no: 102, description: "2025 TOPPS MARVEL THE COLLECTOR #MT-10 CAPTAIN AMERICA 10/25 RAW" },
  { no: 103, description: "2025 TOPPS MARVEL THE COLLECTOR #MT-10 CAPTAIN AMERICA 100/100 RAW" },
  { no: 104, description: "2025 TOPPS MARVEL THE COLLECTOR #MT-6 FALCON 2/100 RAW" },
  { no: 105, description: "2025 TOPPS MARVEL THE COLLECTOR #MT-4 BLACK PANTHER 65/100 RAW" },
  { no: 106, description: "2025 TOPPS MARVEL THE COLLECTOR #MT-16 CASSIE LANG 25/25 RAW" },
  { no: 107, description: "2025 TOPPS MARVEL THE COLLECTOR #TM-WR WYATT RUSSELL/JOHN F. WALKER 7/15 THUNDERBOLTS* RAW" },
  { no: 108, description: "2025 TOPPS MARVEL THE COLLECTOR #TM-DT DOMINIQUE THORNE/RIRI WILLIAMS 24/100 BLACK PANTHER: WAKANDA FOREVER RAW" },
  { no: 109, description: "2025 TOPPS MARVEL THE COLLECTOR #TM-ED ELIZABETH DEBICKI/AYESHA 29/100 GUARDIANS OF THE GALAXY VOL. 2 RAW" },
  { no: 110, description: "2025 TOPPS MARVEL MINT #H-A SPIDER-MAN 32/99 CGC 9" },
  { no: 111, description: "2025 TOPPS MARVEL MINT #D-5 ICEMAN 8/99 CGC 9" },
  { no: 112, description: "2025 TOPPS MARVEL MINT #D-7 VISION 44/99 CGC 6" },
  { no: 113, description: "2025 TOPPS MARVEL MINT SKETCH CARD ISAIAH XAVIER BRADLEY ARTIST-ISAIAH XAVIER BRADLEY 1/1 AGS 10" },
  { no: 114, description: "2025 TOPPS MARVEL MINT SKETCH CARD NAMOR ARTIST-SHAOW SIONG 1/1 CGC 9" },
  { no: 115, description: "2025 TOPPS MARVEL MINT #17 RONAN THE ACCUSER 1/1 AGS 9.5" },
  { no: 116, description: "2025 TOPPS MARVEL MINT #71 ANCIENT ONE 1/1 AGS 9" },
  { no: 117, description: "2025 TOPPS MARVEL MINT #45 SQUIRREL GIRL 1/1 AGS 9.5" },
  { no: 118, description: "2025 TOPPS MARVEL MINT #CA-CY CHRIS YOST 22/50 AGS 9.5" },
  { no: 119, description: "2025 TOPPS MARVEL MINT #CA-JH JONATHAN HICKMAN 19/50 AGS 9.5" },
  { no: 120, description: "2025 TOPPS MARVEL MINT #CA-MB MARK BROOKS 38/50 AGS 10" },
  { no: 121, description: "2025 TOPPS MARVEL MINT ORANGE FOIL #72 SHE-HULK 16/25 AGS 9.5" },
  { no: 122, description: "2025 TOPPS MARVEL MINT ORANGE FOIL #70 ICEMAN 6/25 AGS 9.5" },
  { no: 123, description: "2025 TOPPS MARVEL MINT ORANGE FOIL #66 COLOSSUS 12/25 AGS 9.5" },
  { no: 124, description: "2025 TOPPS MARVEL MINT ORANGE FOIL #64 PEPPER POTTS 18/25 AGS 9.5" },
  { no: 125, description: "2025 TOPPS MARVEL MINT ORANGE FOIL #60 WINTER SOLDIER 5/25 AGS 10" },
  { no: 126, description: "2025 TOPPS MARVEL MINT ORANGE FOIL #54 AGENT CARTER 22/25 AGS 9.5" },
  { no: 127, description: "2025 TOPPS MARVEL MINT ORANGE FOIL #86 GALACTUS 7/25 AGS 9.5" },
  { no: 128, description: "2025 TOPPS MARVEL MINT ORANGE FOIL #76 NICK FURY 4/25 AGS 9" },
  { no: 129, description: "2025 TOPPS MARVEL MINT BLACK FOIL #12 ELECTRO 2/10 AGS 8" },
  { no: 130, description: "2025 TOPPS MARVEL MINT GOLD FOIL #54 AGENT CARTER 15/50 AGS 10" },
  { no: 131, description: "2025 TOPPS MARVEL MINT BLACK REFRACTOR #10 KATE BISHOP 8/10 AGS 9" },
  { no: 132, description: "2025 TOPPS MARVEL MINT BLACK REFRACTOR #28 CABLE 3/10 PSA 9" },
  { no: 133, description: "2025 TOPPS MARVEL MINT BLACK REFRACTOR #61 VALKYRIE 8/10 AGS 8" },
  { no: 134, description: "2025 TOPPS MARVEL MINT BLACK REFRACTOR #63 MANTIS 9/10 AGS 9.5" },
  { no: 135, description: "2025 TOPPS MARVEL MINT BLACK FOIL #85 STAR-LORD 6/10 AGS 9.5" },
  { no: 136, description: "2025 TOPPS MARVEL MINT SILVER FOIL #118 INVISIBLE WOMAN 60/99 AGS 9.5" },
  { no: 137, description: "2025 TOPPS MARVEL MINT BLACK REFRACTOR #100 VISION 1/10 CGC 8" },
  { no: 138, description: "2025 TOPPS MARVEL MINT SILVER FOIL #106 MISTER FANTASTIC 45/99 AGS 9.5" },
  { no: 139, description: "2025 TOPPS MARVEL MINT BLACK REFRACTOR #117 PROFESSOR X 4/10 CGC 9.5" },
  { no: 140, description: "2025 TOPPS MARVEL MINT RED FOIL #19 HANK PYM 2/5 CGC 8" },
  { no: 141, description: "2025 TOPPS MARVEL MINT BLACK FOIL #106 MISTER FANTASTIC 4/10 CGC 8" },
  { no: 142, description: "2025 TOPPS MARVEL MINT RED FOIL #71 ANCIENT ONE 3/5 CGC 7" },
  { no: 143, description: "2025 TOPPS MARVEL MINT RED REFRACTOR #55 GHOST 4/5 CGC 10" },
  { no: 144, description: "2025 TOPPS MARVEL MINT RED REFRACTOR #6 RED HULK 4/5 CGC 8.5" },
  { no: 145, description: "2025 TOPPS MARVEL MINT #88 WASP 3/5 CGC 9" },
  { no: 146, description: "2025 TOPPS MARVEL THE COLLECTOR #61 KAECILIUS 8/25 RAW" },
  { no: 147, description: "2025 TOPPS MARVEL THE COLLECTOR #58 DR. CHRISTINE PALMER 12/25 RAW" },
  { no: 148, description: "2025 TOPPS MARVEL THE COLLECTOR #10 SENTRY 61/100 RAW" },
  { no: 149, description: "2025 TOPPS MARVEL THE COLLECTOR #52 SHANG-CHI 100/100 RAW" },
  { no: 150, description: "2025 TOPPS MARVEL THE COLLECTOR #53 IKARIS 15/15 RAW" },
  { no: 151, description: "2025 TOPPS MARVEL THE COLLECTOR #52 SHANG-CHI 07/15 RAW" },
  { no: 152, description: "2025 TOPPS MARVEL THE COLLECTOR #82 HULK 08/15 RAW" },
  { no: 153, description: "2025 TOPPS MARVEL THE COLLECTOR #29 GROOT 04/15 RAW" },
  { no: 154, description: "2025 TOPPS MARVEL THE COLLECTOR #45 VALKYRIE 07/15 RAW" },
  { no: 155, description: "2025 TOPPS MARVEL THE COLLECTOR #10 SENTRY 10/10 RAW" },
  { no: 156, description: "2025 TOPPS MARVEL THE COLLECTOR #11 VALENTINA ALLEGRA DE FONTAINE 09/10 RAW" },
  { no: 157, description: "2025 TOPPS MARVEL THE COLLECTOR #3 HUMAN TORCH 02/5 RAW" },
  { no: 158, description: "2025 TOPPS MARVEL THE COLLECTOR #68 NICK FURY 1/1 RAW" },
  { no: 159, description: "2025 TOPPS MARVEL THE COLLECTOR #MP-TS TILDA SWINTON/THE ANCIENT ONE DOCTOR STRANGE 01/5 RAW" },
  { no: 160, description: "2025 TOPPS MARVEL THE COLLECTOR #MP-DT DOMINIQUE THORNE/IRONHEART BLACK PANTHER WAKANDA FOREVER 13/25 RAW" },
  { no: 161, description: "2025 TOPPS MARVEL MINT #10-C THOR 72/99 CGC 10" },
  { no: 162, description: "2025 TOPPS MARVEL MINT SILVER FOIL #104 CAPTAIN AMERICA 29/99 AGS 8" },
  { no: 163, description: "2025 TOPPS MARVEL MINT SILVER FOIL #113 BLACK WIDOW 74/99 AGS 9" },
  { no: 164, description: "2025 TOPPS MARVEL MINT SILVER FOIL #11 DAREDEVIL 14/99 AGS 9.5" },
  { no: 165, description: "2025 TOPPS MARVEL MINT ENCASED PLATINUM REFRACTOR #119 GAMBIT 10/25 AGS 9.5" },
];

// ─── Section groupings ─────────────────────────────────────────────────────

const encasedRaw = allCards.filter(c =>
  c.description.includes("MINT ENCASED") && !c.description.includes("PLATINUM REFRACTOR") && c.description.endsWith("RAW")
);
const collectorCards = allCards.filter(c => c.description.includes("THE COLLECTOR"));
const gradedSlabs = allCards.filter(c =>
  (c.description.includes("AGS") || c.description.includes("CGC") || c.description.includes("PSA")) &&
  !c.description.includes("THE COLLECTOR")
);
const platinumCards = allCards.filter(c => c.description.includes("PLATINUM REFRACTOR"));

// ─── Stats ─────────────────────────────────────────────────────────────────

const oneOfOnes = allCards.filter(c => /\b1\/1\b/.test(c.description)).length;
const gradedCount = allCards.filter(c =>
  c.description.includes("AGS") || c.description.includes("CGC") || c.description.includes("PSA")
).length;

// ─── Section Component ─────────────────────────────────────────────────────

function ChecklistSection({
  title,
  subtitle,
  color,
  cards,
  icon,
  defaultOpen = true,
}: {
  title: string;
  subtitle: string;
  color: string;
  cards: CardEntry[];
  icon: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span style={{ color }}>{icon}</span>
          <div className="text-left">
            <div className="font-bold text-sm tracking-widest uppercase" style={{ color }}>
              {title}
            </div>
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-background border border-border" style={{ color }}>
            {cards.length} cards
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="divide-y divide-border/40">
          {cards.map((card) => (
            <div
              key={card.no}
              className="flex items-start gap-4 px-5 py-3 hover:bg-accent/10 transition-colors"
            >
              <span className="text-xs font-mono text-muted-foreground/60 w-8 shrink-0 pt-0.5">
                {String(card.no).padStart(3, "0")}
              </span>
              <span className="text-sm font-medium tracking-wide text-foreground/90 leading-relaxed">
                {card.description}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function NLFInfinitySeries1Checklist() {
  const [search, setSearch] = useState("");

  const filteredCards = search.trim()
    ? allCards.filter(c => c.description.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="NLF Infinity Series #1 — 165 Card Checklist | Northland Legendary Finds"
        description="Full 165-card checklist for NLF Infinity Series #1. Finalized 5/27/2026. Includes Topps Marvel Mint Encased, The Collector, graded slabs, 1/1s, and rare parallels. Available only on Whatnot."
      />

      {/* ── Hero ── */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #00ff88 0%, transparent 50%), radial-gradient(circle at 80% 50%, #7c3aed 0%, transparent 50%)",
          }}
        />
        <div className="container relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full mb-6">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-bold tracking-widest uppercase">
              Available Only on Whatnot
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            <span className="text-white">NLF</span>{" "}
            <span className="text-green-400">INFINITY</span>{" "}
            <span className="text-white">SERIES #1</span>
          </h1>

          <p className="text-muted-foreground text-lg mb-2">
            165 Card Checklist — Finalized May 27, 2026
          </p>
          <p className="text-muted-foreground/60 text-sm mb-10">
            Individual items in this series have been sealed and will not be changed.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Cards", value: "165", color: "#00ff88" },
              { label: "Graded Slabs", value: `${gradedCount}`, color: "#a78bfa" },
              { label: "1/1 Cards", value: `${oneOfOnes}`, color: "#f59e0b" },
              { label: "Sets Featured", value: "3", color: "#38bdf8" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
                <div className="text-2xl font-black" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Whatnot CTA */}
          <a
            href="https://www.whatnot.com/user/northlandlegendaryfinds"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-black text-lg rounded-lg transition-colors shadow-lg shadow-green-500/20"
          >
            <ExternalLink className="w-5 h-5" />
            Watch Live on Whatnot
          </a>
          <p className="text-muted-foreground/50 text-xs mt-3">
            Every pack ripped on camera. No pre-rips. 100% transparent.
          </p>
        </div>
      </section>

      {/* ── Search ── */}
      <section className="py-6 border-b border-border bg-card/30">
        <div className="container max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Search cards... (e.g. WOLVERINE, ENCASED, 1/1, CGC, GAMBIT)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
          {search && (
            <p className="text-xs text-muted-foreground mt-2">
              {filteredCards?.length ?? 0} result
              {filteredCards?.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* ── Checklist ── */}
      <section className="py-10">
        <div className="container max-w-4xl mx-auto">
          {filteredCards ? (
            <div className="border border-border rounded-lg overflow-hidden mb-4">
              <div className="px-5 py-4 bg-card border-b border-border">
                <div className="font-bold text-sm tracking-widest uppercase text-green-400">
                  Search Results
                </div>
              </div>
              <div className="divide-y divide-border/40">
                {filteredCards.length === 0 ? (
                  <div className="px-5 py-8 text-center text-muted-foreground text-sm">
                    No cards found matching &ldquo;{search}&rdquo;
                  </div>
                ) : (
                  filteredCards.map((card) => (
                    <div
                      key={card.no}
                      className="flex items-start gap-4 px-5 py-3 hover:bg-accent/10 transition-colors"
                    >
                      <span className="text-xs font-mono text-muted-foreground/60 w-8 shrink-0 pt-0.5">
                        {String(card.no).padStart(3, "0")}
                      </span>
                      <span className="text-sm font-medium tracking-wide text-foreground/90 leading-relaxed">
                        {card.description}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              <ChecklistSection
                title="Topps Marvel Mint Encased — Raw"
                subtitle="Numbered Parallels /100, /75, /50 — Raw in BCW Magnetic Holders"
                color="#00ff88"
                icon={<Shield className="w-5 h-5" />}
                cards={encasedRaw}
              />
              <ChecklistSection
                title="Topps Marvel The Collector — Raw"
                subtitle="Numbered Parallels, Short Prints, Villains, Story Threads, Movie Tiles, Autographs"
                color="#38bdf8"
                icon={<Gem className="w-5 h-5" />}
                cards={collectorCards}
                defaultOpen={false}
              />
              <ChecklistSection
                title="Graded Slabs — AGS / CGC / PSA"
                subtitle="Professionally Graded Marvel Mint Cards including 1/1 Sketch Cards and Rare Parallels"
                color="#a78bfa"
                icon={<Star className="w-5 h-5" />}
                cards={gradedSlabs}
                defaultOpen={false}
              />
              {platinumCards.length > 0 && (
                <ChecklistSection
                  title="Platinum Refractors — Encased"
                  subtitle="Premium Encased Platinum Parallel Graded Cards"
                  color="#e5e4e2"
                  icon={<Gem className="w-5 h-5" />}
                  cards={platinumCards}
                  defaultOpen={false}
                />
              )}
            </>
          )}

          {/* Disclaimer */}
          <div className="text-center mt-10 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground/50 max-w-3xl mx-auto leading-relaxed">
              NLF Infinity Series #1 is available exclusively through Northland Legendary Finds live
              shows on Whatnot. This checklist was finalized on May 27, 2026. Individual items in
              this series have been sealed and will not be changed. Northland Legendary Finds is not
              affiliated with, endorsed by, or sponsored by Topps, Marvel, or any trading card
              manufacturer. All cards were lawfully acquired from the secondary market and
              independently repackaged by Northland Legendary Finds. All trademarks, logos, and
              brand names are the property of their respective owners.
            </p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
              >
                ← Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
