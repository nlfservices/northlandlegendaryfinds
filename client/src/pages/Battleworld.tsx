/**
 * Battleworld — Card of the Day Hub
 * Themed around Doctor Doom's Secret Wars domain.
 * Entry point for daily featured cards with full archive.
 */

import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { trpc } from "@/lib/trpc";

// ── Constants ────────────────────────────────────────────────────────────────
const GOLD = "#ffce4d";
const DOOM_GREEN = "#3fb56b";

const SET_COLORS: Record<string, string> = {
  mint: "#ffce4d",
  comic_book_heroes: "#5b8cff",
  marvel_studios: "#a86bff",
};

const SET_LABELS_FALLBACK: Record<string, string> = {
  mint: "Marvel Mint",
  comic_book_heroes: "Comic Book Heroes",
  marvel_studios: "Marvel Studios",
};

// ── Page Component ───────────────────────────────────────────────────────────
export default function Battleworld() {
  const [, navigate] = useLocation();

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

  // Group by month for the archive
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, typeof pastCards> = {};
    pastCards.forEach((card) => {
      const monthKey = card.date.slice(0, 7); // YYYY-MM
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(card);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [pastCards]);

  const todayCard = todayQuery.data;

  return (
    <>
      <Helmet>
        <title>Battleworld — Card of the Day | Northland Legendary Finds</title>
        <meta name="description" content="Welcome to Battleworld. Every day, one Marvel trading card rises to rule. Explore today's featured card and browse the full archive of past selections from Northland Legendary Finds." />
        <meta property="og:title" content="Battleworld — Card of the Day | Northland Legendary Finds" />
        <meta property="og:description" content="Doctor Doom's domain awaits. One card rules each day. Explore the full archive of Marvel trading cards featured on Northland Legendary Finds." />
        {todayCard?.frontImageUrl && <meta property="og:image" content={todayCard.frontImageUrl} />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://northlandlegendaryfinds.com/battleworld" />
        <link rel="canonical" href="https://northlandlegendaryfinds.com/battleworld" />
      </Helmet>

      <div style={{ minHeight: "100vh", background: "#080b12" }}>
        {/* ═══ HERO SECTION ═══ */}
        <section style={{
          position: "relative",
          padding: "4rem 1.25rem 3rem",
          textAlign: "center",
          overflow: "hidden",
        }}>
          {/* Subtle radial glow behind */}
          <div style={{
            position: "absolute",
            top: "-30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle, rgba(63,181,107,.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Title */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{
              fontFamily: "'Sora',sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              color: "#fff",
              margin: "0 0 .4rem",
              letterSpacing: "-.02em",
              lineHeight: 1.1,
            }}>
              <span style={{ color: DOOM_GREEN }}>BATTLE</span>WORLD
            </h1>
            <p style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: ".78rem",
              color: "var(--muted-foreground,#8a90a3)",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              margin: "0 0 .5rem",
            }}>
              One card rules each day
            </p>
            <p style={{
              maxWidth: "36rem",
              margin: "0 auto 2.5rem",
              fontSize: ".92rem",
              color: "#c4c9d6",
              lineHeight: 1.6,
            }}>
              Welcome to Doctor Doom's domain. Every day we crown a new card from the NLF collection — 
              explore today's ruler and browse the full archive of past featured cards.
            </p>
          </div>

          {/* Today's Card — Hero Display */}
          {todayQuery.isLoading && (
            <div style={{ padding: "3rem", color: "var(--muted-foreground,#8a90a3)" }}>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".8rem" }}>Loading today's card…</p>
            </div>
          )}

          {todayCard && (
            <div
              onClick={() => navigate(`/card-of-the-day/${todayCard.dateISO}`)}
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: "52rem",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "280px 1fr",
                gap: "2rem",
                alignItems: "center",
                background: "linear-gradient(135deg, rgba(63,181,107,.06), rgba(255,206,77,.03))",
                border: `1px solid rgba(63,181,107,.3)`,
                borderRadius: 20,
                padding: "2rem",
                cursor: "pointer",
                transition: "border-color .3s, transform .3s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(63,181,107,.6)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(63,181,107,.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {/* Card Image */}
              <div style={{
                aspectRatio: "63/88",
                borderRadius: 14,
                overflow: "hidden",
                background: "#0a0c11",
                boxShadow: "0 8px 32px rgba(0,0,0,.5), 0 0 60px rgba(63,181,107,.15)",
              }}>
                {todayCard.frontImageUrl ? (
                  <img
                    src={todayCard.frontImageUrl}
                    alt={`${todayCard.characterName} — Today's Card`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#565d72", fontSize: "3rem" }}>◈</div>
                )}
              </div>

              {/* Card Info */}
              <div>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".5rem",
                  background: "rgba(63,181,107,.12)",
                  border: "1px solid rgba(63,181,107,.3)",
                  borderRadius: 8,
                  padding: ".35rem .75rem",
                  marginBottom: ".8rem",
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: DOOM_GREEN }} />
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".68rem", color: DOOM_GREEN, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>
                    Today's Ruler
                  </span>
                </div>

                <h2 style={{
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  color: "#fff",
                  margin: "0 0 .4rem",
                  lineHeight: 1.15,
                }}>
                  {todayCard.characterName}
                </h2>

                {todayCard.characterTagline && (
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".72rem", color: DOOM_GREEN, letterSpacing: ".08em", textTransform: "uppercase", margin: "0 0 .8rem" }}>
                    {todayCard.characterTagline}
                  </p>
                )}

                <div className="flex" style={{ flexWrap: "wrap", gap: ".5rem", marginBottom: "1rem" }}>
                  {todayCard.setLabel && (
                    <span style={{ fontSize: ".74rem", background: "#0e121b", border: "1px solid var(--border,#242a3a)", borderRadius: 8, padding: ".3rem .6rem", color: "#c4c9d6" }}>
                      {todayCard.setLabel}
                    </span>
                  )}
                  {todayCard.parallelType && (
                    <span style={{ fontSize: ".74rem", background: "#0e121b", border: "1px solid var(--border,#242a3a)", borderRadius: 8, padding: ".3rem .6rem", color: GOLD }}>
                      {todayCard.parallelType}
                    </span>
                  )}
                  {todayCard.cardNumber && (
                    <span style={{ fontSize: ".74rem", background: "#0e121b", border: "1px solid var(--border,#242a3a)", borderRadius: 8, padding: ".3rem .6rem", color: "#c4c9d6" }}>
                      {todayCard.cardNumber}
                    </span>
                  )}
                  {todayCard.printRun && (
                    <span style={{ fontSize: ".74rem", background: "#0e121b", border: `1px solid rgba(255,206,77,.3)`, borderRadius: 8, padding: ".3rem .6rem", color: GOLD, fontWeight: 700 }}>
                      /{todayCard.printRun}
                    </span>
                  )}
                </div>

                {todayCard.characterBio && (
                  <p style={{ fontSize: ".88rem", color: "#aeb4c4", lineHeight: 1.55, margin: "0 0 1rem", maxWidth: "28rem" }}>
                    {todayCard.characterBio.slice(0, 180)}{todayCard.characterBio.length > 180 ? "…" : ""}
                  </p>
                )}

                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".4rem",
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: 700,
                  fontSize: ".85rem",
                  color: DOOM_GREEN,
                }}>
                  View Full Card →
                </span>
              </div>
            </div>
          )}

          {/* Responsive override for mobile */}
          <style>{`
            @media (max-width: 640px) {
              .bw-hero-card { grid-template-columns: 1fr !important; text-align: center !important; }
            }
          `}</style>
        </section>

        {/* ═══ STATS BAR ═══ */}
        <section style={{ maxWidth: "52rem", margin: "0 auto 2.5rem", padding: "0 1.25rem" }}>
          <div className="flex items-center justify-center" style={{
            gap: "2rem",
            flexWrap: "wrap",
            background: "var(--card,#141823)",
            border: "1px solid var(--border,#242a3a)",
            borderRadius: 14,
            padding: "1rem 2rem",
          }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.4rem", color: GOLD }}>{pastCards.length}</span>
              <span style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "var(--muted-foreground,#8a90a3)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: ".1rem" }}>Cards Featured</span>
            </div>
            <div style={{ width: 1, height: 28, background: "var(--border,#242a3a)" }} />
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#5b8cff" }}>{groupedByMonth.length}</span>
              <span style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "var(--muted-foreground,#8a90a3)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: ".1rem" }}>Months Active</span>
            </div>
            <div style={{ width: 1, height: 28, background: "var(--border,#242a3a)" }} />
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#a86bff" }}>3</span>
              <span style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "var(--muted-foreground,#8a90a3)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: ".1rem" }}>Sets Represented</span>
            </div>
          </div>
        </section>

        {/* ═══ ARCHIVE SECTION ═══ */}
        <section style={{ maxWidth: "60rem", margin: "0 auto", padding: "0 1.25rem 4rem" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: "1.5rem" }}>
            <h2 style={{
              fontFamily: "'Sora',sans-serif",
              fontWeight: 800,
              fontSize: "1.3rem",
              color: "#fff",
              margin: 0,
            }}>
              The Archive
            </h2>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".7rem", color: "var(--muted-foreground,#8a90a3)", letterSpacing: ".06em" }}>
              {pastCards.length} cards total
            </span>
          </div>

          {allDatesQuery.isLoading && (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground,#8a90a3)" }}>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".8rem" }}>Loading archive…</p>
            </div>
          )}

          {groupedByMonth.map(([monthKey, cards]) => {
            const monthDate = new Date(monthKey + "-01T00:00:00Z");
            const monthLabel = monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
            return (
              <div key={monthKey} style={{ marginBottom: "2rem" }}>
                <h3 style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: ".72rem",
                  color: "var(--muted-foreground,#8a90a3)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  margin: "0 0 .8rem",
                  paddingBottom: ".5rem",
                  borderBottom: "1px solid var(--border,#242a3a)",
                }}>
                  {monthLabel}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: ".7rem" }}>
                  {cards.map((card) => {
                    const dateObj = new Date(card.date + "T00:00:00Z");
                    const dayLabel = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
                    const isToday = card.date === todayISO;
                    return (
                      <button
                        key={card.date}
                        onClick={() => navigate(`/card-of-the-day/${card.date}`)}
                        style={{
                          background: isToday ? "rgba(63,181,107,.08)" : "var(--card,#141823)",
                          border: `1px solid ${isToday ? "rgba(63,181,107,.5)" : "var(--border,#242a3a)"}`,
                          borderRadius: 12,
                          padding: ".45rem",
                          cursor: "pointer",
                          transition: "all .2s",
                          textAlign: "center",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,206,77,.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = isToday ? "rgba(63,181,107,.5)" : "var(--border,#242a3a)"; e.currentTarget.style.transform = "translateY(0)"; }}
                      >
                        {/* Thumbnail */}
                        <div style={{ aspectRatio: "3/4", borderRadius: 8, overflow: "hidden", background: "#0a0c11", marginBottom: ".35rem", position: "relative" }}>
                          {card.frontImageUrl ? (
                            <img src={card.frontImageUrl} alt={card.characterName} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                          ) : (
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#565d72", fontSize: "1.3rem" }}>◈</div>
                          )}
                          {isToday && (
                            <div style={{ position: "absolute", top: 4, right: 4, background: DOOM_GREEN, color: "#000", fontSize: ".55rem", fontWeight: 800, padding: "2px 5px", borderRadius: 4, fontFamily: "'Sora',sans-serif" }}>TODAY</div>
                          )}
                        </div>
                        {/* Info */}
                        <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: ".68rem", color: "#fff", margin: "0 0 .1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {card.characterName}
                        </p>
                        <div className="flex items-center justify-center" style={{ gap: ".3rem" }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: SET_COLORS[card.setName] || "#888" }} />
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".58rem", color: "var(--muted-foreground,#8a90a3)" }}>{dayLabel}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {pastCards.length === 0 && !allDatesQuery.isLoading && (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground,#8a90a3)" }}>
              <p style={{ fontSize: "2rem", marginBottom: ".5rem" }}>◈</p>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".8rem" }}>No cards featured yet. Check back tomorrow.</p>
            </div>
          )}
        </section>

        {/* ═══ SEO CONTENT FOOTER ═══ */}
        <section style={{ maxWidth: "52rem", margin: "0 auto", padding: "0 1.25rem 4rem" }}>
          <div style={{ borderTop: "1px solid var(--border,#242a3a)", paddingTop: "2rem" }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", margin: "0 0 .8rem" }}>
              About Battleworld
            </h2>
            <p style={{ fontSize: ".88rem", color: "#aeb4c4", lineHeight: 1.7, margin: "0 0 1rem" }}>
              In Marvel Comics, Battleworld is the patchwork planet assembled by Doctor Doom during the Secret Wars event. 
              Doom, wielding the power of the Beyonders, stitched together fragments of destroyed universes into a single world 
              where he ruled as God Emperor. Here at Northland Legendary Finds, our Battleworld serves a similar purpose — 
              each day we crown one card from our collection as the day's ruler, showcasing the best of 
              2025 Topps Marvel Mint, Comic Book Heroes, and Marvel Studios sets.
            </p>
            <p style={{ fontSize: ".88rem", color: "#aeb4c4", lineHeight: 1.7, margin: "0 0 1rem" }}>
              With Avengers: Doomsday arriving in theaters, Doctor Doom's influence on the MCU has never been greater. 
              Our daily card selections highlight the characters, parallels, and chase cards that connect to the 
              unfolding Multiverse Saga — from Robert Downey Jr.'s Doctor Doom to the heroes assembling to stop him.
            </p>
            <p style={{ fontSize: ".85rem", color: "#8a90a3", lineHeight: 1.6, margin: 0 }}>
              Browse our archive to see every card that has ruled Battleworld, or visit our{" "}
              <a href="/characters" style={{ color: DOOM_GREEN, textDecoration: "none" }}>Marvel Characters</a> page 
              to explore the full roster. Join the community on{" "}
              <a href="/about" style={{ color: DOOM_GREEN, textDecoration: "none" }}>our About page</a> to learn more 
              about Northland Legendary Finds.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
