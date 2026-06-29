/**
 * Card of the Day — Public Page
 * Route: /card-of-the-day
 * Features cards from all 3 sets: Marvel Mint, Marvel Studios Chrome, Comic Book Heroes 50th
 */

import { useMemo, useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Helmet } from "react-helmet-async";

// ── Gold + Primary colors matching NLF design ────────────────────────────────
const GOLD = "#ffce4d";
const PRIMARY = "var(--primary, #62e08a)";

// ── Types ────────────────────────────────────────────────────────────────────
type CardData = {
  dateISO: string;
  dateLabel: string;
  characterName: string;
  characterRealName?: string | null;
  characterTagline?: string | null;
  characterBio?: string | null;
  characterFacts?: { k: string; v: string }[] | null;
  characterImageUrl?: string | null;
  cardNumber?: string | null;
  setName: string;
  setLabel?: string | null;
  parallelType?: string | null;
  printRun?: number | null;
  serialNumber?: number | null;
  cgcGrade?: string | null;
  gradingCompany?: string | null;
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
  youtubeId?: string | null;
  estimatedPrice?: string | null;
  buzzNote?: string | null;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function buildCardName(data: CardData) {
  const parts: string[] = [];
  if (data.setLabel) parts.push(data.setLabel);
  parts.push(data.characterName);
  if (data.cardNumber) parts.push(data.cardNumber);
  if (data.parallelType) parts.push(data.parallelType);
  return parts.join(" ");
}

function buildPrintRunLabel(data: CardData) {
  if (data.serialNumber && data.printRun) return `${data.serialNumber}/${data.printRun}`;
  if (data.printRun) return `/${data.printRun}`;
  return null;
}

function buildGradeLabel(data: CardData) {
  if (!data.cgcGrade) return null;
  const company = data.gradingCompany || "CGC";
  return `${company} ${data.cgcGrade}`;
}

function ebaySearchUrl(cardName: string) {
  return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(cardName)}`;
}
function googleNewsUrl(characterName: string) {
  return `https://news.google.com/search?q=${encodeURIComponent(`"${characterName}" Marvel`)}`;
}

// ── Sub-components ───────────────────────────────────────────────────────────
function Placeholder({ icon, label, dims }: { icon: string; label: string; dims?: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".5rem", color: "#565d72", background: "repeating-linear-gradient(135deg,#10141f 0 18px,#0b0e16 18px 36px)" }}>
      <span style={{ fontSize: "2.6rem" }}>{icon}</span>
      <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", fontSize: ".8rem" }}>{label}</span>
      {dims && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".66rem", opacity: 0.65 }}>{dims}</span>}
    </div>
  );
}

function Chip({ children, green, gold }: { children: React.ReactNode; green?: boolean; gold?: boolean }) {
  const color = gold ? "#ffce4d" : green ? "#3fb56b" : undefined;
  const borderColor = gold ? "rgba(255,206,77,.4)" : green ? "rgba(63,181,107,.4)" : "var(--border,#242a3a)";
  const bg = gold ? "rgba(255,206,77,.08)" : green ? "rgba(63,181,107,.08)" : "transparent";
  return (
    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".66rem", letterSpacing: ".06em", textTransform: "uppercase", border: `1px solid ${borderColor}`, color: color || "var(--muted-foreground,#8a90a3)", background: bg, padding: ".3rem .6rem", borderRadius: 7 }}>
      {children}
    </span>
  );
}

function SpecRow({ k, v, green, gold }: { k: string; v: string; green?: boolean; gold?: boolean }) {
  const color = gold ? "#ffce4d" : green ? "var(--primary,#62e08a)" : "var(--foreground,#eaedf4)";
  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr auto", gap: "1rem", padding: ".7rem 1rem", fontSize: ".9rem", borderBottom: "1px solid var(--border,#242a3a)" }}>
      <span style={{ color: "var(--muted-foreground,#8a90a3)" }}>{k}</span>
      <span style={{ color, fontWeight: 600, textAlign: "right" }}>{v}</span>
    </div>
  );
}

function SectionRule({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center" style={{ gap: ".8rem", margin: "2.2rem 0 1.1rem" }}>
      <span style={{ fontSize: "1.1rem" }}>{icon}</span>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "1.3rem", margin: 0, color: "#fff", whiteSpace: "nowrap" }}>{title}</h2>
      <span style={{ flex: 1, height: 1, background: "var(--border,#242a3a)" }} />
    </div>
  );
}

// ── Main Card Component ───────────────────────────────────────────────────────
function CardOfTheDayDisplay({ data }: { data: CardData }) {
  const {
    cardNumber, setLabel, frontImageUrl, backImageUrl, youtubeId,
    estimatedPrice, characterName, characterRealName, characterTagline,
    characterBio, characterFacts, characterImageUrl, buzzNote,
    dateLabel, dateISO, parallelType,
  } = data;

  const cardName = buildCardName(data);
  const printRunLabel = buildPrintRunLabel(data);
  const gradeLabel = buildGradeLabel(data);
  const nlfMcuNewsUrl = "/mcu-news";
  const nlfCharactersUrl = `/characters`;
  const nlfCardDatabaseUrl = "/cards";
  const whatnotUrl = "https://www.whatnot.com/user/northlandlegendaryfinds";

  const tabs = useMemo(() => {
    const t: { key: string; label: string }[] = [{ key: "front", label: "Front" }];
    if (backImageUrl) t.push({ key: "back", label: "Back" });
    if (youtubeId) t.push({ key: "video", label: "▶ Video" });
    return t;
  }, [backImageUrl, youtubeId]);

  const [active, setActive] = useState("front");

  const jsonLd = useMemo(() => {
    const obj: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: cardName,
      category: "Trading Card",
      image: frontImageUrl ? [frontImageUrl] : undefined,
      description: characterBio
        ? `${cardName}. ${characterBio}`
        : `${cardName} — featured Card of the Day at Northland Legendary Finds.`,
      brand: { "@type": "Brand", name: setLabel || "Topps" },
      offers: {
        "@type": "AggregateOffer",
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
        url: "https://northlandlegendaryfinds.com/mcu-news",
      },
    };
    Object.keys(obj).forEach((k) => obj[k] === undefined && delete obj[k]);
    return JSON.stringify(obj);
  }, [cardName, setLabel, frontImageUrl, characterBio]);

  return (
    <div style={{ maxWidth: "60rem", margin: "0 auto", padding: "2rem 1.25rem 4rem", color: "var(--foreground,#eaedf4)" }}>
      {/* SEO structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      {/* Header strip */}
      <div className="flex items-center justify-between" style={{ gap: "1rem", marginBottom: "1.4rem", flexWrap: "wrap" }}>
        <span className="inline-flex items-center" style={{ gap: ".55rem", background: `linear-gradient(135deg,${GOLD},#ff9d3c)`, color: "#1c1405", fontFamily: "'Sora',sans-serif", fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", fontSize: ".82rem", padding: ".5rem 1rem", borderRadius: 999 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#1c1405" }} />
          Card of the Day
        </span>
        {dateLabel && (
          <time dateTime={dateISO} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".74rem", color: "var(--muted-foreground,#8a90a3)", letterSpacing: ".08em", textTransform: "uppercase" }}>
            {dateLabel}
          </time>
        )}
      </div>

      {/* Main: media stage + buy panel */}
      <div className="cod-main" style={{ display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: "1.8rem", alignItems: "start", marginBottom: "2rem" }}>
        {/* Media stage */}
        <div style={{ border: "1px solid var(--border,#242a3a)", borderRadius: 18, overflow: "hidden", background: "var(--card,#141823)" }}>
          <div className="flex" style={{ borderBottom: "1px solid var(--border,#242a3a)" }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                style={{
                  flex: 1, background: active === t.key ? "rgba(255,206,77,.06)" : "none", border: "none",
                  color: active === t.key ? "#fff" : "var(--muted-foreground,#8a90a3)",
                  fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: ".82rem", letterSpacing: ".04em",
                  textTransform: "uppercase", padding: ".8rem", cursor: "pointer",
                  borderBottom: `2px solid ${active === t.key ? GOLD : "transparent"}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="cod-card-viewer" style={{ aspectRatio: "3 / 4", position: "relative", background: "#0a0c11", overflow: "hidden" }}>
            {active === "front" && (
              frontImageUrl
                ? (
                  <>
                    <img src={frontImageUrl} alt={`${cardName} front`} className="cod-card-img" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
                    <div className="cod-zoom-hint" title="Hover to zoom">🔍</div>
                  </>
                )
                : <Placeholder icon="◈" label="Card Image Coming Soon" dims="Photo being added" />
            )}
            {active === "back" && (
              backImageUrl
                ? (
                  <>
                    <img src={backImageUrl} alt={`${cardName} back`} className="cod-card-img" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
                    <div className="cod-zoom-hint" title="Hover to zoom">🔍</div>
                  </>
                )
                : <Placeholder icon="▣" label="Card Back — Coming Soon" />
            )}
            {active === "video" && youtubeId && (
              <iframe
                title={`${cardName} video`}
                src={`https://www.youtube.com/embed/${youtubeId}`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>

        {/* Info panel */}
        <div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.6rem", lineHeight: 1.15, margin: "0 0 .5rem", color: "#fff" }}>
            {characterName}
            {characterRealName && characterRealName !== characterName && (
              <span style={{ display: "block", fontWeight: 400, fontSize: "1rem", color: "var(--muted-foreground,#8a90a3)", marginTop: ".2rem" }}>{characterRealName}</span>
            )}
          </h1>
          <div className="flex" style={{ flexWrap: "wrap", gap: ".5rem", marginBottom: "1.1rem" }}>
            {cardNumber && <Chip>{cardNumber}</Chip>}
            {parallelType && <Chip gold>{parallelType}</Chip>}
            {printRunLabel && <Chip gold>#{printRunLabel}</Chip>}
            {gradeLabel && <Chip green>{gradeLabel}</Chip>}
          </div>

          {/* Specs */}
          <div style={{ border: "1px solid var(--border,#242a3a)", borderRadius: 14, overflow: "hidden", marginBottom: "1.2rem" }}>
            <SpecRow k="Set" v={setLabel || "2025 Topps"} />
            {cardNumber && <SpecRow k="Card No." v={cardNumber} />}
            {parallelType && <SpecRow k="Parallel" v={parallelType} gold />}
            {printRunLabel && <SpecRow k="Print Run" v={`#${printRunLabel}`} gold />}
            {gradeLabel && <SpecRow k="Grade" v={gradeLabel} green />}
            {estimatedPrice && <SpecRow k="Est. Value" v={estimatedPrice} green />}
          </div>

          {/* Action links */}
          <div className="flex" style={{ flexDirection: "column", gap: ".6rem" }}>
            <a className="cod-btn" href={ebaySearchUrl(cardName)} target="_blank" rel="noopener noreferrer"
               style={{ background: "#fff", color: "#111" }}>
              Search on <strong style={{ color: "#e53238", marginLeft: ".25rem" }}>eBay</strong>
            </a>
            <a className="cod-btn" href={nlfMcuNewsUrl}
               style={{ background: PRIMARY, color: "var(--primary-foreground,#08200f)" }}>
              Explore MCU News
            </a>
            <a className="cod-btn" href={nlfCharactersUrl}
               style={{ background: "linear-gradient(135deg, #5b8cff, #a86bff)", color: "#fff" }}>
              🦸 Meet the Characters
            </a>
            <a className="cod-btn" href={nlfCardDatabaseUrl}
               style={{ background: "linear-gradient(135deg, #ffce4d, #ff9f43)", color: "#111" }}>
              🃏 Browse Card Database
            </a>
            <a className="cod-btn" href={whatnotUrl} target="_blank" rel="noopener"
               style={{ background: "#1c2333", color: "#fff", border: "1px solid var(--steel,#384259)" }}>
              ▶ Watch Live on Whatnot
            </a>
          </div>
        </div>
      </div>

      {/* Character info — evergreen SEO content */}
      <SectionRule icon="🦹" title={`Who Is ${characterName}?`} />
      <div className="cod-char" style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "1.3rem", background: "var(--card,#141823)", border: "1px solid var(--border,#242a3a)", borderRadius: 16, padding: "1.3rem", marginBottom: "1.4rem" }}>
        <div style={{ aspectRatio: "3 / 4", borderRadius: 11, border: "1px solid var(--border,#242a3a)", background: "#0a0c11", position: "relative", overflow: "hidden" }}>
          {characterImageUrl
            ? <img src={characterImageUrl} alt={characterName} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#565d72", fontSize: "1.6rem", background: "repeating-linear-gradient(135deg,#10141f 0 14px,#0b0e16 14px 28px)" }}>◈</div>}
        </div>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.35rem", color: "#fff", margin: "0 0 .15rem" }}>
            {characterRealName || characterName}
          </h2>
          {characterTagline && (
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".72rem", color: "#3fb56b", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".7rem" }}>
              {characterTagline}
            </div>
          )}
          {characterBio && <p style={{ margin: "0 0 .8rem", fontSize: ".95rem", color: "#c4c9d6" }}>{characterBio}</p>}
          {characterFacts && characterFacts.length > 0 && (
            <div className="flex" style={{ flexWrap: "wrap", gap: ".5rem" }}>
              {characterFacts.map((f, i) => (
                <span key={i} style={{ fontSize: ".74rem", background: "#0e121b", border: "1px solid var(--border,#242a3a)", borderRadius: 8, padding: ".35rem .65rem" }}>
                  <strong style={{ color: "#fff" }}>{f.k}</strong> {f.v}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Why it matters now */}
      <SectionRule icon="🎬" title="Why the Buzz Right Now" />
      <div style={{ background: "linear-gradient(135deg,rgba(91,140,255,.08),rgba(168,107,255,.04))", border: "1px solid rgba(91,140,255,.3)", borderRadius: 16, padding: "1.3rem 1.4rem", marginBottom: "1.4rem" }}>
        {buzzNote && <p style={{ fontSize: ".96rem", color: "#cdd2e0", margin: "0 0 1rem" }}>{buzzNote}</p>}
        <a href={googleNewsUrl(characterName)} target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center"
           style={{ gap: ".5rem", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: ".9rem", color: "#5b8cff", textDecoration: "none", border: "1px solid rgba(91,140,255,.4)", padding: ".6rem 1.1rem", borderRadius: 10 }}>
          📰 Latest {characterName} News →
        </a>
      </div>

      {/* Whatnot CTA */}
      <div style={{ marginTop: "1.8rem", borderRadius: 16, background: `linear-gradient(135deg,${PRIMARY},#3aa0ff)`, padding: 2 }}>
        <div className="flex items-center justify-between" style={{ background: "#10141c", borderRadius: 14, padding: "1.4rem 1.6rem", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.3rem", margin: "0 0 .2rem", color: "#fff" }}>Want this card in hand?</h3>
            <p style={{ margin: 0, fontSize: ".88rem", color: "#aeb4c4" }}>Catch it in a live break — strong floor, loaded middle, healthy ceiling.</p>
          </div>
          <a href={whatnotUrl} target="_blank" rel="noopener"
             style={{ background: PRIMARY, color: "var(--primary-foreground,#08200f)", fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: ".9rem", padding: ".75rem 1.4rem", borderRadius: 10, textDecoration: "none", whiteSpace: "nowrap" }}>
            ▶ Join Live Break
          </a>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        .cod-main { grid-template-columns: 1.05fr .95fr; }
        .cod-char { grid-template-columns: 120px 1fr; }
        .cod-btn {
          display: flex; align-items: center; justify-content: center;
          padding: .85rem 1.2rem; border-radius: 12px; font-family: 'Sora',sans-serif;
          font-weight: 700; font-size: .9rem; text-decoration: none; cursor: pointer;
          transition: opacity .15s;
        }
        .cod-btn:hover { opacity: .85; }

        /* Card hover zoom */
        .cod-card-viewer { cursor: zoom-in; }
        .cod-card-img {
          transform-origin: center center;
          transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform;
        }
        .cod-card-viewer:hover .cod-card-img {
          transform: scale(1.55);
        }
        .cod-zoom-hint {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0,0,0,0.55);
          color: #fff;
          font-size: 1rem;
          padding: 4px 7px;
          border-radius: 8px;
          pointer-events: none;
          opacity: 0.7;
          transition: opacity 0.2s;
          z-index: 10;
        }
        .cod-card-viewer:hover .cod-zoom-hint {
          opacity: 0;
        }
        @media (max-width: 640px) {
          .cod-main { grid-template-columns: 1fr !important; }
          .cod-char { grid-template-columns: 80px 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Page wrapper ─────────────────────────────────────────────────────────────
export default function CardOfTheDayPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const dateParam = params.date; // undefined = today

  // Fetch card data — either by date or today's
  const todayQuery = trpc.cardOfTheDay.getTodaysCard.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    enabled: !dateParam,
  });
  const dateQuery = trpc.cardOfTheDay.getCardForDate.useQuery(
    { date: dateParam! },
    { staleTime: 1000 * 60 * 5, enabled: !!dateParam }
  );

  const data = dateParam ? dateQuery.data : todayQuery.data;
  const isLoading = dateParam ? dateQuery.isLoading : todayQuery.isLoading;
  const error = dateParam ? dateQuery.error : todayQuery.error;

  // Get the effective date for navigation
  const effectiveDate = data?.dateISO ?? dateParam;

  // Fetch prev/next dates for navigation
  const adjacentQuery = trpc.cardOfTheDay.getAdjacentDates.useQuery(
    { date: effectiveDate! },
    { enabled: !!effectiveDate, staleTime: 1000 * 60 * 5 }
  );

  const pageTitle = data
    ? `Card of the Day: ${data.characterName} — ${data.setLabel || "NLF Collection"} | Northland Legendary Finds`
    : "Card of the Day | Northland Legendary Finds";

  const pageDesc = data
    ? `Featured card for ${data.dateLabel}: ${data.characterName} ${data.cardNumber ?? ""} ${data.parallelType ?? ""} ${data.printRun ? `/${data.printRun}` : ""}. ${data.characterTagline ?? ""} Discover rare Marvel trading cards at NLF.`
    : "Discover a new rare Marvel trading card every day at Northland Legendary Finds.";

  const canonicalUrl = effectiveDate
    ? `https://northlandlegendaryfinds.com/card-of-the-day/${effectiveDate}`
    : "https://northlandlegendaryfinds.com/card-of-the-day";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        {data?.frontImageUrl && <meta property="og:image" content={data.frontImageUrl} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
        {adjacentQuery.data?.prev && (
          <link rel="prev" href={`https://northlandlegendaryfinds.com/card-of-the-day/${adjacentQuery.data.prev}`} />
        )}
        {adjacentQuery.data?.next && (
          <link rel="next" href={`https://northlandlegendaryfinds.com/card-of-the-day/${adjacentQuery.data.next}`} />
        )}
      </Helmet>

      {isLoading && (
        <div style={{ maxWidth: "60rem", margin: "4rem auto", padding: "2rem", textAlign: "center", color: "var(--muted-foreground,#8a90a3)" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>◈</div>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".85rem", letterSpacing: ".08em", textTransform: "uppercase" }}>Loading card…</p>
        </div>
      )}

      {error && (
        <div style={{ maxWidth: "60rem", margin: "4rem auto", padding: "2rem", textAlign: "center", color: "#ff6b6b" }}>
          <p>Could not load this card. Please try again.</p>
        </div>
      )}

      {data && <CardOfTheDayDisplay data={data as CardData} />}

      {/* Prev / Next Navigation */}
      {effectiveDate && (
        <div style={{ maxWidth: "60rem", margin: "0 auto 3rem", padding: "0 1.2rem" }}>
          <div className="flex items-center justify-between" style={{ background: "var(--card,#141823)", border: "1px solid var(--border,#242a3a)", borderRadius: 14, padding: "1rem 1.4rem" }}>
            {adjacentQuery.data?.prev ? (
              <button
                onClick={() => navigate(`/card-of-the-day/${adjacentQuery.data!.prev}`)}
                style={{ background: "none", border: "1px solid var(--border,#242a3a)", color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: ".85rem", padding: ".6rem 1.2rem", borderRadius: 10, cursor: "pointer" }}
              >
                ← Previous Card
              </button>
            ) : <div />}
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".75rem", color: "var(--muted-foreground,#8a90a3)", letterSpacing: ".05em" }}>
              {data?.dateLabel}
            </span>
            {adjacentQuery.data?.next ? (
              <button
                onClick={() => navigate(`/card-of-the-day/${adjacentQuery.data!.next}`)}
                style={{ background: "none", border: "1px solid var(--border,#242a3a)", color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: ".85rem", padding: ".6rem 1.2rem", borderRadius: 10, cursor: "pointer" }}
              >
                Next Card →
              </button>
            ) : <div />}
          </div>
        </div>
      )}
    </>
  );
}
