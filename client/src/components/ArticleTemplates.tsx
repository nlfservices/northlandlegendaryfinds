/**
 * Article Template Layouts — 7 distinct visual styles for article rendering
 * Each template creates a COMPLETELY different reading experience.
 * No two articles should ever look the same unless published on the same day.
 * 
 * Templates:
 * 1. Classic — Linear content flow with mid-article banner (default)
 * 2. Magazine — Pull quotes, alternating layouts, decorative accents
 * 3. Spotlight — Two-column with sticky sidebar, numbered sections
 * 4. Timeline — Visual timeline with event markers and milestone nodes
 * 5. Listicle — Ranked cards with color-coded entries
 * 6. Patriotic — Red/white/blue, side-by-side image/text blocks (Northland Fence style)
 * 7. Cinematic — Full-bleed hero, dark moody sections, film-strip aesthetic
 * 8. Dossier — Intel briefing style, classified look, data panels
 */

import { useMemo } from "react";
import { Link } from "wouter";
import RichContent from "@/components/RichContent";
import { TrendingUp, Star, Calendar, Hash, Zap, Award, Target, Flame, BookOpen, Quote, Shield, Flag, FileText, Eye, ArrowLeft, Share2, Clock, User, MapPin, Tv, Sparkles, DollarSign, ChevronRight, Ticket } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import ImageLightbox from "@/components/ImageLightbox";

type TemplateProps = {
  content: string;
  title: string;
  featuredImageUrl?: string | null;
  category: string;
  cardMarketImpact?: string | null;
  tags?: string[];
  excerpt?: string | null;
};

const proseClasses = `prose prose-invert prose-lg max-w-none
  prose-headings:text-foreground prose-headings:font-bold
  prose-p:text-muted-foreground prose-p:leading-relaxed
  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
  prose-strong:text-foreground
  prose-blockquote:border-primary prose-blockquote:text-muted-foreground
  prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded
  prose-img:rounded-lg prose-img:border prose-img:border-border`;

/**
 * Splits markdown content into sections by H2 headings
 */
function splitBySections(content: string): { intro: string; sections: { heading: string; body: string }[] } {
  const lines = content.split('\n');
  let intro = '';
  const sections: { heading: string; body: string }[] = [];
  let currentHeading = '';
  let currentBody: string[] = [];
  let inIntro = true;

  for (const line of lines) {
    if (line.match(/^##\s+(.+)/)) {
      if (inIntro) {
        intro = currentBody.join('\n');
        inIntro = false;
      } else if (currentHeading) {
        sections.push({ heading: currentHeading, body: currentBody.join('\n') });
      }
      currentHeading = line.replace(/^##\s+/, '');
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }
  // Push last section
  if (currentHeading) {
    sections.push({ heading: currentHeading, body: currentBody.join('\n') });
  } else if (inIntro) {
    intro = currentBody.join('\n');
  }

  return { intro, sections };
}

/**
 * Extract a compelling pull quote from content (first bold sentence or strong statement)
 */
function extractPullQuote(content: string): string {
  // Priority 1: Look for actual blockquotes (> "...") — these are intentional pull quotes
  const blockquoteMatch = content.match(/> "([^"]{20,200})"/);
  if (blockquoteMatch) return blockquoteMatch[1];
  
  // Priority 2: Look for blockquotes without quotes
  const bqMatch = content.match(/^> (.{20,150})$/m);
  if (bqMatch && !bqMatch[1].includes('Topps') && !bqMatch[1].includes('Chrome')) return bqMatch[1];
  
  // Priority 3: Bold text that isn't a card name or product
  const boldMatch = content.match(/\*\*([^*]{20,100})\*\*/);
  if (boldMatch && !boldMatch[1].includes('Topps') && !boldMatch[1].includes('Chrome') && !boldMatch[1].includes('Card')) return boldMatch[1];
  
  // Fallback: find a short impactful sentence (skip collector/card sections)
  const sentences = content.split(/\.\s+/);
  const impactful = sentences.find(s => s.length > 40 && s.length < 120 && !s.includes('http') && !s.includes('Topps') && !s.includes('eBay'));
  return impactful ? impactful + '.' : '';
}

/**
 * Extract images from markdown content
 */
function extractImages(content: string): string[] {
  const images: string[] = [];
  // Match markdown image syntax: ![alt](url)
  const mdRegex = /!\[.*?\]\((.*?)\)/g;
  let match;
  while ((match = mdRegex.exec(content)) !== null) {
    images.push(match[1]);
  }
  // Match HTML img tags: <img src="url" ...>
  const htmlRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  while ((match = htmlRegex.exec(content)) !== null) {
    if (!images.includes(match[1])) {
      images.push(match[1]);
    }
  }
  return images;
}

/**
 * Strip markdown image syntax from text so Streamdown doesn't try to render them
 * (images are already extracted and displayed in figure slots)
 */
function stripImages(text: string): string {
  return text
    .replace(/!\[.*?\]\(.*?\)\n*/g, '')
    .replace(/<img[^>]*>\s*/g, '')
    .trim();
}

// ============================================================
// TEMPLATE 1: CLASSIC — Clean Informational (NYT/Vox editorial feel)
// Serif deck, byline rule, lead image, drop-cap, inline figure,
// hanging pull quote, CollectorSpot editorial skin.
// ============================================================

const CI_ACCENT = "#c9a24b"; // understated editorial gold
const CI_RULE = "#2e333d";

export function ClassicTemplate({
  content,
  title,
  featuredImageUrl,
  excerpt,
  tags,
  category,
  cardMarketImpact,
}: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const pullQuote = useMemo(() => extractPullQuote(content), [content]);
  const inlineImages = useMemo(() => extractImages(content), [content]);

  const collectorAfter = Math.max(0, Math.ceil(sections.length * 0.6) - 1);

  const chips = [
    category || "Analysis",
    ...(tags && tags.length ? [tags[0]] : []),
  ].filter(Boolean);

  return (
    <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
      {/* ① deck / standfirst */}
      {excerpt && (
        <p
          style={{
            fontFamily: "'Fraunces',serif",
            fontWeight: 400,
            fontSize: "1.4rem",
            lineHeight: 1.5,
            color: "#c4c7d0",
            margin: "0 0 1.8rem",
            fontStyle: "italic",
          }}
        >
          {excerpt}
        </p>
      )}

      {/* byline rule */}
      <div
        className="flex items-center"
        style={{
          gap: "1rem",
          borderTop: `1px solid ${CI_RULE}`,
          borderBottom: `1px solid ${CI_RULE}`,
          padding: ".7rem 0",
          margin: "0 0 2.2rem",
          fontSize: ".78rem",
          letterSpacing: ".06em",
          textTransform: "uppercase",
          color: "var(--muted-foreground)",
        }}
      >
        {chips.map((c, i) => (
          <span key={i} className="flex items-center" style={{ gap: "1rem" }}>
            {i > 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: CI_ACCENT }} />}
            {c}
          </span>
        ))}
      </div>

      {/* ② lead image */}
      {featuredImageUrl && (
        <figure style={{ margin: "0 0 2.2rem" }}>
          <div style={{ aspectRatio: "3 / 2", background: "#0c0d11", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
            <img src={featuredImageUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <figcaption style={{ fontSize: ".78rem", color: "var(--muted-foreground)", marginTop: ".6rem", lineHeight: 1.5, paddingLeft: ".8rem", borderLeft: `2px solid ${CI_RULE}` }}>
            {title}
          </figcaption>
        </figure>
      )}

      {/* ③ body */}
      <div className="ci-body" style={{ fontSize: "1.08rem", color: "#d2d5dd" }}>
        {intro && <RichContent className={`${proseClasses} ci-intro-prose`}>{stripImages(intro)}</RichContent>}

        {sections.map((section, i) => (
          <div key={i}>
            <div style={{ margin: "2.4rem 0 1rem" }}>
              <div style={{ fontSize: ".7rem", letterSpacing: ".18em", textTransform: "uppercase", color: CI_ACCENT, marginBottom: ".4rem" }}>
                {tags && tags[i % Math.max(1, tags.length)] ? tags[i % tags.length] : "More"}
              </div>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: "1.6rem", lineHeight: 1.25, margin: 0, color: "#fff" }}>
                {section.heading}
              </h2>
            </div>

            {/* inline right-set figure on the first section */}
            {i === 0 && (
              <figure className="ci-figure" style={{ float: "right", width: "46%", margin: ".4rem 0 1rem 1.4rem" }}>
                <div style={{ aspectRatio: "4 / 3", background: "#0c0d11", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".3rem", color: "#565b66", background: "repeating-linear-gradient(135deg,#121419 0 16px,#0e1014 16px 32px)" }}>
                    <span style={{ fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", fontSize: ".66rem" }}>Figure — Add</span>
                    <span style={{ fontSize: ".6rem", opacity: 0.65 }}>800 × 600</span>
                  </div>
                </div>
                <figcaption style={{ fontSize: ".74rem", color: "var(--muted-foreground)", marginTop: ".5rem", lineHeight: 1.45 }}>
                  Add a supporting figure for this section.
                </figcaption>
              </figure>
            )}

            <RichContent className={proseClasses}>{stripImages(section.body)}</RichContent>

            {/* hanging serif pull quote after first section */}
            {i === 0 && pullQuote && (
              <div style={{ margin: "2rem 0", paddingLeft: "1.4rem", borderLeft: `2px solid ${CI_ACCENT}`, clear: "both" }}>
                <blockquote style={{ margin: 0, fontFamily: "'Fraunces',serif", fontWeight: 500, fontStyle: "italic", fontSize: "1.5rem", lineHeight: 1.4, color: "#fff" }}>
                  "{pullQuote}"
                </blockquote>
              </div>
            )}

            {/* COLLECTOR SLOT — editorial skin, ~60% scroll */}
            {i === collectorAfter && (
              <div style={{ clear: "both" }}>
                <CollectorSpot cardMarketImpact={cardMarketImpact} focusTitle={null} skin="editorial" cardImageUrl={inlineImages[0] || null} />
                <a
                  href="/mcu-news"
                  className="grid items-center"
                  style={{ margin: "2rem 0 0", borderTop: `1px solid ${CI_RULE}`, paddingTop: "1.2rem", gridTemplateColumns: "1fr auto", gap: "1rem", textDecoration: "none" }}
                >
                  <span>
                    <span style={{ fontSize: ".66rem", letterSpacing: ".18em", textTransform: "uppercase", color: CI_ACCENT, display: "block", marginBottom: ".3rem" }}>Keep Reading</span>
                    <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 500, fontSize: "1.2rem", color: "#fff", lineHeight: 1.3 }}>
                      {excerpt ? "Continue the analysis" : "More from the MCU News desk"}
                    </span>
                  </span>
                  <span style={{ fontSize: "1.4rem", color: CI_ACCENT }}>→</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .ci-intro-prose > p:first-of-type::first-letter{
          font-family:'Fraunces',serif; font-weight:600; float:left; font-size:3.6rem;
          line-height:.78; margin:.35rem .7rem 0 0; color:var(--foreground);
        }
        .ci-body p{ margin:0 0 1.3rem; }
        @media(max-width:620px){ .ci-figure{ float:none !important; width:100% !important; margin:1rem 0 !important; } }
      `}</style>
    </div>
  );
}

// ============================================================
// TEMPLATE 2: MAGAZINE — Pull quotes, alternating image/text blocks
// ============================================================
export function MagazineTemplate({
  content,
  title,
  featuredImageUrl,
  excerpt,
  tags,
  category,
  cardMarketImpact,
}: TemplateProps) {
    const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const pullQuote = useMemo(() => extractPullQuote(content), [content]);
  const inlineImages = useMemo(() => extractImages(content), [content]);
  const PINK = "#ff5d8f";
  const GOLD = "#e8b84b";
  const VIOLET = "#9b6bff";
  const BORDER = "#2a2733";
  const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii"];

  const introHalves = useMemo(() => {
    if (!intro) return null;
    const paras = intro.split(/\n\n+/).filter(Boolean);
    if (paras.length < 2) return { a: intro, b: "" };
    const mid = Math.ceil(paras.length / 2);
    return { a: paras.slice(0, mid).join("\n\n"), b: paras.slice(mid).join("\n\n") };
  }, [intro]);

  const collectorAt = Math.max(0, Math.ceil(sections.length * 0.6) - 1);

  return (
    <div>
      {/* ① masthead opener */}
      <div style={{ marginBottom: "1.8rem" }}>
        <div style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 800, letterSpacing: ".2em", textTransform: "uppercase", fontSize: ".74rem", color: PINK, marginBottom: ".6rem" }}>
          {category || "The Feature"}
        </div>
        {excerpt && (
          <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontWeight: 600, fontSize: "1.55rem", lineHeight: 1.4, color: "#d6d2dd", margin: 0, maxWidth: "34rem" }}>
            {excerpt}
          </p>
        )}
      </div>

      {/* ② asymmetric hero w/ offset tag card */}
      {featuredImageUrl && (
        <div style={{ position: "relative", margin: "0 -1.25rem 0" }}>
          <div style={{ background: "#0a090d", position: "relative", overflow: "hidden" }}>
            <img src={featuredImageUrl} alt={title} style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
          <div style={{ position: "absolute", bottom: 0, right: "1.25rem", background: PINK, color: "#0d0c10", fontFamily: "'Archivo',sans-serif", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", fontSize: ".7rem", padding: ".5rem .9rem" }}>
            Cover Story
          </div>
        </div>
      )}

      {/* ③ two-column intro w/ drop cap */}
      {introHalves && (
        <div className="mag-intro" style={{ margin: "2rem 0" }}>
          <div className="mag-intro-a">
            <RichContent className={`${proseClasses} mag-dropcap`}>{stripImages(introHalves.a)}</RichContent>
          </div>
          {introHalves.b && (
            <div className="mag-intro-b">
              <RichContent className={proseClasses}>{stripImages(introHalves.b)}</RichContent>
            </div>
          )}
        </div>
      )}

      {/* ④ full-bleed pull-quote band */}
      {pullQuote && (
        <div style={{ margin: "2rem -1.25rem", padding: "2.2rem 1.8rem", background: "linear-gradient(135deg,#1c1622,#15131b)", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, position: "relative" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", position: "absolute", top: ".2rem", left: "1rem", fontSize: "5rem", color: VIOLET, opacity: 0.25, lineHeight: 1 }}>&ldquo;</div>
          <blockquote style={{ margin: "0 auto", fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "clamp(1.5rem,3.6vw,2.2rem)", lineHeight: 1.2, color: "#fff", textAlign: "center", maxWidth: "38rem" }}>
            {pullQuote}
          </blockquote>
          <div style={{ textAlign: "center", fontFamily: "'Archivo',sans-serif", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", fontSize: ".66rem", color: GOLD, marginTop: "1rem" }}>
            — The NLF Collector&apos;s Desk
          </div>
        </div>
      )}

      {/* ⑤ feature sections — alternating figure/text + collector slot */}
      {sections.map((section, i) => {
        const imgRight = i % 2 === 1;
        const sectionImg = inlineImages[i] || null;
        const fig = sectionImg ? (
          <figure className="mag-fig" style={{ margin: 0 }}>
            <div style={{ background: "#0a090d", border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
              <img src={sectionImg} alt={section.heading} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <figcaption style={{ fontSize: ".74rem", color: "var(--muted-foreground)", marginTop: ".5rem", lineHeight: 1.45, borderLeft: `2px solid ${PINK}`, paddingLeft: ".6rem" }}>
              {section.heading}
            </figcaption>
          </figure>
        ) : null;
        const txt = (
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontWeight: 600, fontSize: "1.1rem", color: GOLD, marginBottom: ".3rem" }}>
              {ROMAN[i] || String(i + 1)}.
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.7rem", lineHeight: 1.15, margin: "0 0 .8rem", color: "#fff" }}>
              {section.heading}
            </h2>
            <div style={{ color: "#c8c5d2", fontSize: "1rem" }}>
              <RichContent className={proseClasses}>{stripImages(section.body)}</RichContent>
            </div>
          </div>
        );

        return (
          <div key={i}>
            <div
              className="mag-feature grid"
              style={{ gap: "1.6rem", margin: "2rem 0", alignItems: "start", gridTemplateColumns: imgRight ? "1.15fr 0.85fr" : "0.85fr 1.15fr" }}
            >
              {fig ? (
                <>{imgRight ? (<>{txt}{fig}</>) : (<>{fig}{txt}</>)}</>
              ) : (
                <div style={{ gridColumn: "1 / -1" }}>{txt}</div>
              )}
            </div>

            {i === collectorAt && (
              <>
                <CollectorSpot cardMarketImpact={cardMarketImpact} focusTitle={null} skin="glossy" cardImageUrl={inlineImages[0] || null} />
                <a
                  href="/mcu-news"
                  className="grid items-center"
                  style={{ margin: "1.6rem 0 0", border: `1px solid ${BORDER}`, borderRadius: 10, background: "var(--card)", gridTemplateColumns: "1fr auto", gap: "1rem", padding: "1.1rem 1.4rem", textDecoration: "none" }}
                >
                  <span>
                    <span style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 700, fontSize: ".62rem", letterSpacing: ".2em", textTransform: "uppercase", color: GOLD, display: "block", marginBottom: ".25rem" }}>In This Issue</span>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", lineHeight: 1.25 }}>
                      {excerpt ? "Continue the feature" : "More from the MCU News desk"}
                    </span>
                  </span>
                  <span style={{ fontSize: "1.4rem", color: PINK }}>&rarr;</span>
                </a>
              </>
            )}
          </div>
        );
      })}

      <style>{`
        .mag-intro{ column-count:2; column-gap:2rem; font-size:1rem; color:#cfccd8; }
        .mag-intro .mag-dropcap > p:first-of-type::first-letter{
          font-family:'Playfair Display',serif; font-weight:800; float:left;
          font-size:4.2rem; line-height:.72; margin:.4rem .6rem 0 0; color:${PINK};
        }
        @media(max-width:640px){
          .mag-intro{ column-count:1; }
          .mag-feature{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// TEMPLATE 3: SPOTLIGHT EXPLAINER — TOC rail, numbered sections, key-facts chips
// ============================================================
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}

export function SpotlightTemplate({
  content,
  title,
  featuredImageUrl,
  excerpt,
  tags,
  category,
  cardMarketImpact,
}: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const inlineImages = useMemo(() => extractImages(content), [content]);
  const collectorAt = Math.max(0, Math.ceil(sections.length * 0.6) - 1);
  const ACCENT = "#5b8cff";
  const ACCENT2 = "#8b6bff";
  const AMBER = "#ffce4d";
  const BORDER = "#232838";

  const facts = useMemo(() => {
    const out: { k: string; v: string }[] = [];
    if (category) out.push({ k: "Category", v: category });
    if (tags) tags.slice(0, 3).forEach((t, i) => out.push({ k: `Tag ${i + 1}`, v: t }));
    return out.slice(0, 4);
  }, [category, tags]);

  const anchors = sections.map((s) => slugify(s.heading));

  return (
    <div>
      {/* ① hero band */}
      <div style={{ position: "relative", margin: "0 -1.25rem 0" }}>
        <div style={{ aspectRatio: "16 / 7", background: "#0a0b10", position: "relative", overflow: "hidden" }}>
          {featuredImageUrl ? (
            <img src={featuredImageUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#101420,#0b0e16)" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,12,17,.95),transparent 60%)" }} />
          <div style={{ position: "absolute", left: "1.5rem", bottom: "1.1rem", right: "1.5rem", zIndex: 2 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", color: ACCENT, letterSpacing: ".2em", textTransform: "uppercase", fontSize: ".68rem", marginBottom: ".4rem" }}>
              {category || "The Explainer"}
            </div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem,4vw,2rem)", lineHeight: 1.1, margin: 0, color: "#fff", maxWidth: "80%" }}>
              {title}
            </h2>
          </div>
        </div>
      </div>

      {/* ② key-facts chips */}
      {facts.length > 0 && (
        <div className="flex" style={{ flexWrap: "wrap", gap: ".6rem", margin: "1.2rem 0 1.6rem" }}>
          {facts.map((f, i) => (
            <div key={i} style={{ background: "var(--card)", border: `1px solid ${BORDER}`, borderRadius: 10, padding: ".5rem .8rem", display: "flex", flexDirection: "column", minWidth: 120 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".56rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>{f.k}</span>
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", marginTop: ".15rem" }}>{f.v}</span>
            </div>
          ))}
        </div>
      )}

      {/* ③ two-column: content + sticky rail */}
      <div className="sp-grid" style={{ display: "grid", gridTemplateColumns: "1fr 230px", gap: "2rem", alignItems: "start" }}>
        <div>
          {intro && (
            <div style={{ fontSize: "1.08rem", color: "#cfd3de", marginBottom: "1.8rem", paddingBottom: "1.6rem", borderBottom: `1px solid ${BORDER}` }}>
              <RichContent className={proseClasses}>{stripImages(intro)}</RichContent>
            </div>
          )}

          {sections.map((section, i) => (
            <div key={i}>
              <div id={anchors[i]} style={{ marginBottom: "2rem", scrollMarginTop: "2rem" }}>
                <div className="flex items-center" style={{ gap: ".8rem", marginBottom: ".8rem" }}>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: ".95rem", color: ACCENT, background: "rgba(91,140,255,.12)", border: "1px solid rgba(91,140,255,.3)", width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "1.35rem", lineHeight: 1.2, margin: 0, color: "#fff" }}>
                    {section.heading}
                  </h3>
                </div>
                <div style={{ color: "#c4c9d6", fontSize: "1rem" }}>
                  <RichContent className={proseClasses}>{stripImages(section.body)}</RichContent>
                </div>
              </div>

              {i === collectorAt && (
                <>
                  <CollectorSpot cardMarketImpact={cardMarketImpact} focusTitle={null} skin="explainer" cardImageUrl={inlineImages[0] || null} />
                  <a href="/mcu-news" className="grid items-center" style={{ margin: "1.4rem 0 2rem", border: `1px solid ${BORDER}`, borderRadius: 14, background: "var(--card)", gridTemplateColumns: "1fr auto", gap: "1rem", padding: "1.1rem 1.4rem", textDecoration: "none" }}>
                    <span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".62rem", letterSpacing: ".2em", textTransform: "uppercase", color: AMBER, display: "block", marginBottom: ".25rem" }}>Go Deeper</span>
                      <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "#fff", lineHeight: 1.25 }}>More from the MCU News desk</span>
                    </span>
                    <span style={{ fontSize: "1.3rem", color: ACCENT }}>→</span>
                  </a>
                </>
              )}
            </div>
          ))}
        </div>

        {/* sticky nav rail */}
        <aside className="sp-rail" style={{ position: "sticky", top: "1.5rem" }}>
          <div style={{ height: 5, background: "#1a1f2e", borderRadius: 3, overflow: "hidden", marginBottom: "1rem" }}>
            <i style={{ display: "block", height: "100%", width: "42%", background: `linear-gradient(90deg,${ACCENT},${ACCENT2})` }} />
          </div>
          <div style={{ background: "var(--card)", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "1.1rem", marginBottom: "1rem" }}>
            <h4 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".64rem", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--muted-foreground)", margin: "0 0 .8rem" }}>In This Explainer</h4>
            <nav>
              {sections.map((s, i) => (
                <a key={i} href={`#${anchors[i]}`} className="flex items-center" style={{ gap: ".6rem", color: i === 0 ? "#fff" : "#b4bacb", textDecoration: "none", fontSize: ".84rem", padding: ".35rem 0 .35rem .7rem", lineHeight: 1.3, borderLeft: `2px solid ${i === 0 ? ACCENT : "transparent"}`, marginLeft: "-.7rem" }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".66rem", color: ACCENT }}>{String(i + 1).padStart(2, "0")}</span>
                  {s.heading}
                </a>
              ))}
            </nav>
          </div>
          <div style={{ background: "var(--card)", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "1.1rem" }}>
            <h4 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".64rem", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--muted-foreground)", margin: "0 0 .8rem" }}>Gallery</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
              {[0, 1, 2, 3].map((n) => (
                <div key={n} style={{ aspectRatio: "1", border: `1px solid ${BORDER}`, borderRadius: 7, background: "#0c0e15", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#4a5068", fontSize: "1rem", background: "repeating-linear-gradient(135deg,#0f121b 0 10px,#0b0d14 10px 20px)" }}>▤</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        @media(max-width:780px){
          .sp-grid{ grid-template-columns:1fr !important; }
          .sp-rail{ display:none; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// TEMPLATE 4: TIMELINE — Visual timeline with event markers
// ============================================================
export function TimelineTemplate({
  content,
  title,
  excerpt,
  tags,
  cardMarketImpact,
}: TemplateProps) {
    const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const pullQuote = useMemo(() => extractPullQuote(content), [content]);
  const inlineImages = useMemo(() => extractImages(content), [content]);
  const TL_CYAN = "#48c9d6";
  const TL_AMBER = "#ffce4d";
  const TL_HOT = "#ff6b5c";
  const TL_STEEL = "#37454f";
  const TL_BORDER = "#243038";

  // Build a descending countdown of day labels: start 30, end 0.
  const dayLabels = useMemo(() => {
    const n = sections.length;
    if (n <= 1) return ["0"];
    const start = 30;
    return sections.map((_, i) => String(Math.round(start - (start * i) / (n - 1))));
  }, [sections]);

  const collectorAt = Math.max(0, Math.ceil(sections.length * 0.6) - 1);

  return (
    <div>
      {/* ① mission-clock header */}
      <div style={{ background: "var(--card)", border: `1px solid ${TL_BORDER}`, borderRadius: 14, padding: "1.4rem 1.5rem", marginBottom: "1.4rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg,transparent 0 38px,rgba(72,201,214,.04) 38px 40px)", pointerEvents: "none" }} />
        <div className="inline-flex items-center" style={{ gap: ".5rem", fontFamily: "'JetBrains Mono',monospace", fontSize: ".7rem", letterSpacing: ".16em", textTransform: "uppercase", color: TL_CYAN, marginBottom: ".7rem", position: "relative", zIndex: 1 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: TL_CYAN, boxShadow: `0 0 8px ${TL_CYAN}` }} />
          T-Minus {dayLabels[0]} · Mission Active
        </div>
        <div style={{ fontSize: "1.02rem", color: "#c4ccd2", position: "relative", zIndex: 1 }}>
          {intro ? <RichContent className={proseClasses}>{stripImages(intro)}</RichContent> : excerpt && <div>{excerpt}</div>}
        </div>
      </div>

      {/* ② horizontal node rail */}
      <div style={{ position: "relative", margin: "0 -1.25rem 1.4rem", padding: "0 1.25rem" }}>
        <div className="tl-rail" style={{ display: "flex", overflowX: "auto", padding: ".5rem 0 1.2rem" }}>
          {sections.map((_, i) => (
            <div key={i} style={{ flex: "0 0 auto", width: 84, textAlign: "center", position: "relative" }}>
              {i < sections.length - 1 && (
                <div style={{ position: "absolute", top: 18, left: "50%", width: "100%", height: 2, background: TL_BORDER, zIndex: 0 }} />
              )}
              <div
                style={{
                  position: "relative", zIndex: 1, width: 38, height: 38, borderRadius: "50%",
                  margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1.1rem",
                  border: `2px solid ${i <= collectorAt ? TL_CYAN : TL_STEEL}`,
                  background: "var(--card)",
                  color: i <= collectorAt ? TL_CYAN : "var(--muted-foreground)",
                  boxShadow: i <= collectorAt ? "0 0 0 4px rgba(72,201,214,.12)" : "none",
                }}
              >
                {dayLabels[i]}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".6rem", letterSpacing: ".08em", color: i <= collectorAt ? "var(--foreground)" : "var(--muted-foreground)", marginTop: ".5rem", lineHeight: 1.3 }}>
                T-{dayLabels[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ③ phase blocks + collector slot mid-way */}
      {sections.map((section, i) => {
        const isLaunch = i === sections.length - 1;
        return (
          <div key={i}>
            <div className="tl-phase grid" style={{ gridTemplateColumns: "130px 1fr", border: `1px solid ${TL_BORDER}`, borderRadius: 14, overflow: "hidden", marginBottom: "1.1rem", background: "var(--card)" }}>
              <div className="tl-marker" style={{ background: "linear-gradient(160deg,#16202a,#101820)", borderRight: `1px solid ${TL_BORDER}`, padding: "1.3rem 1rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "3rem", lineHeight: 0.85, color: isLaunch ? TL_HOT : TL_CYAN }}>
                    {dayLabels[i]}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted-foreground)", marginTop: ".3rem" }}>
                    {isLaunch ? "Launch" : "Days Out"}
                  </div>
                </div>
              </div>
              <div style={{ padding: "1.2rem 1.4rem" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".62rem", letterSpacing: ".16em", textTransform: "uppercase", color: isLaunch ? TL_HOT : TL_AMBER, marginBottom: ".4rem" }}>
                  Phase {i + 1}{tags && tags[i] ? ` · ${tags[i]}` : ""}
                </div>
                <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1.5rem", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: ".01em", margin: "0 0 .6rem", color: "#fff" }}>
                  {section.heading}
                </h2>
                <div style={{ color: "#c2cad0", fontSize: ".95rem" }}>
                  <RichContent className={proseClasses}>{stripImages(section.body)}</RichContent>
                </div>
              </div>
            </div>

            {/* telemetry pull quote after first phase */}
            {i === 0 && pullQuote && (
              <div style={{ margin: "1.4rem 0", borderLeft: `3px solid ${TL_CYAN}`, background: "linear-gradient(90deg,rgba(72,201,214,.07),transparent)", padding: "1.1rem 1.4rem", borderRadius: "0 8px 8px 0" }}>
                <blockquote style={{ margin: 0, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.2, color: "#fff", textTransform: "uppercase", letterSpacing: ".01em" }}>
                  "{pullQuote}"
                </blockquote>
              </div>
            )}

            {/* COLLECTOR SLOT — mission skin, ~60% scroll */}
            {i === collectorAt && (
              <>
                <CollectorSpot cardMarketImpact={cardMarketImpact} focusTitle={null} skin="mission" cardImageUrl={inlineImages[0] || null} />
                <a
                  href="/mcu-news"
                  className="grid items-center"
                  style={{ margin: "1.1rem 0 0", border: `1px solid ${TL_BORDER}`, borderRadius: 14, background: "var(--card)", gridTemplateColumns: "1fr auto", gap: "1rem", padding: "1.1rem 1.4rem", textDecoration: "none" }}
                >
                  <span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".62rem", letterSpacing: ".2em", textTransform: "uppercase", color: TL_AMBER, display: "block", marginBottom: ".25rem" }}>Next Mission</span>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "#fff", lineHeight: 1.1, textTransform: "uppercase" }}>
                      {excerpt ? "Continue the plan" : "More from the MCU News desk"}
                    </span>
                  </span>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1.6rem", color: TL_CYAN }}>→</span>
                </a>
              </>
            )}
          </div>
        );
      })}

      <style>{`
        .tl-rail::-webkit-scrollbar{ height:6px; }
        .tl-rail::-webkit-scrollbar-thumb{ background:#37454f; border-radius:3px; }
        @media(max-width:640px){
          .tl-phase{ grid-template-columns:1fr !important; }
          .tl-marker{ border-right:none !important; border-bottom:1px solid #243038; flex-direction:row !important; gap:1rem; justify-content:flex-start !important; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// TEMPLATE 5: LISTICLE — Numbered entries with visual cards
// ============================================================

/**
 * Extract the first image URL from a section body.
 * Supports both markdown ![alt](url) and HTML <img src="url"> syntax.
 */
function extractFirstSectionImage(body: string): string | null {
  // Try markdown syntax first
  const mdMatch = body.match(/!\[.*?\]\((.*?)\)/);
  if (mdMatch) return mdMatch[1];
  // Try HTML img tag
  const htmlMatch = body.match(/<img[^>]+src=["']([^"']+)["']/);
  if (htmlMatch) return htmlMatch[1];
  return null;
}

/**
 * Remove the first image from a section body to avoid showing it twice
 * (once in the art slot and once inline in the text).
 */
function stripFirstImage(body: string): string {
  // Try removing markdown image first
  const mdStripped = body.replace(/!\[.*?\]\(.*?\)(\n*\*.*?\*)?/, '');
  if (mdStripped !== body) return mdStripped.replace(/^\n{2,}/, '\n');
  // Try removing HTML img tag (and optional caption paragraph)
  const htmlStripped = body.replace(/<img[^>]+>[\s\n]*(<em>.*?<\/em>)?/, '');
  if (htmlStripped !== body) return htmlStripped.replace(/^\n{2,}/, '\n');
  return body;
}

export function ListicleTemplate({
  content,
  title,
  excerpt,
  tags,
  category,
  cardMarketImpact,
}: TemplateProps) {
    const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const inlineImages = useMemo(() => extractImages(content), [content]);
  // Count UP to #1: reverse the sections so the last becomes the climax.
  // Set to false if your articles are authored #1-first.
  const countUp = true;
  const ranked = useMemo(() => {
    const arr = sections.map((s, i) => ({ ...s, rank: i + 1 }));
    return countUp ? arr.slice().reverse().map((s, idx) => ({ ...s, rank: sections.length - idx })) : arr;
  }, [sections, countUp]);

  // Collector slot injected ~60% through the ranked list
  const collectorAt = Math.max(0, Math.ceil(ranked.length * 0.6) - 1);

  const HOT = "#aff5c5";
  const GOLD = "#ffcc4d";
  const STEEL = "#3a425d";

  return (
    <div>
      {/* 0 countdown header + counter */}
      <div
        className="grid items-center"
        style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "1.4rem 1.5rem", marginBottom: "1.4rem", gridTemplateColumns: "1fr auto", gap: "1.2rem" }}
      >
        <div className="inline-flex items-center" style={{ gap: ".5rem", background: HOT, color: "#fff", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: ".72rem", letterSpacing: ".1em", textTransform: "uppercase", padding: ".3rem .7rem", borderRadius: 999, marginBottom: ".7rem" }}>
          <span>● Counting Down · {sections.length} Picks</span>
        </div>
        {intro ? (
          <RichContent className={proseClasses}>{stripImages(intro)}</RichContent>
        ) : (
          excerpt && <div>{excerpt}</div>
        )}
      </div>
      <div
        style={{ textAlign: "center", flexShrink: 0 }} className="lc-counter"
      >
        <div style={{ fontFamily: "'Anton',sans-serif", fontSize: "3.4rem", lineHeight: 0.85, color: GOLD }}>{sections.length}</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted-foreground)", marginTop: ".2rem" }}>#Picks</div>
      </div>

      {/* rank entries — alternating split cards */}
      {ranked.map((entry, idx) => {
        const flip = idx % 2 === 1; // alternate image side
        const isTop = entry.rank === 1;

        const sectionImg = extractFirstSectionImage(entry.body);

        const art = (
          <div className="lc-art" style={{ position: "relative", minHeight: 280, background: "#0a0010", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "8px" }}>
            <div className="lc-rank-bg" style={{ position: "absolute", top: 0, left: 12, fontFamily: "'Anton',sans-serif", fontSize: "6rem", lineHeight: 1, color: isTop ? "#ffff" : "rgba(255,255,255,.08)", pointerEvents: "none", zIndex: 1 }}>
              {String(entry.rank).padStart(2, "0")}
            </div>
            <div className="lc-rank-badge" style={{ position: "absolute", top: 12, left: 12, zIndex: 2, background: isTop ? GOLD : STEEL, width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".9rem" }}>
              {entry.rank}
            </div>
            {sectionImg ? (
              <ImageLightbox src={sectionImg} alt={entry.heading} className="lc-card-img w-full h-auto object-contain" />
            ) : (
              <div style={{ minHeight: 120 }} />
            )}
          </div>
        );

        const copy = (
          <div className="lc-copy" style={{ padding: "1.4rem 1.5rem", display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".62rem", letterSpacing: ".16em", textTransform: "uppercase", color: isTop ? GOLD : HOT, marginBottom: ".4rem" }}>
              {isTop ? "The One We'd Buy First" : `Tags: ${tags?.[idx % Math.max(1, tags.length)] ?? tags?.[0] ?? "The Pick"}`}
            </div>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: "1.7rem", lineHeight: 1.05, textTransform: "uppercase", letterSpacing: "-0.01em", color: "#ffff" }}>
              {entry.heading}
            </h2>
            <div style={{ color: "#c4c0d0", fontSize: ".96rem", margin: "0 0 .7rem" }}>
              <RichContent className={proseClasses}>{sectionImg ? stripFirstImage(entry.body) : entry.body}</RichContent>
            </div>
          </div>
        );

        return (
          <div
            key={idx}
            className="lc-entry grid"
            style={{
              gridTemplateColumns: flip ? "1.1fr 0.9fr" : "0.9fr 1.1fr",
              marginBottom: "1.2rem",
              border: "3px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
              background: "var(--card)",
            }}
          >
            {/* On desktop: alternate image/text sides. On mobile: always text first (via CSS order) */}
            {flip ? (
              <>
                <div className="lc-copy-wrap">{copy}</div>
                <div className="lc-art-wrap">{art}</div>
              </>
            ) : (
              <>
                <div className="lc-art-wrap">{art}</div>
                <div className="lc-copy-wrap">{copy}</div>
              </>
            )}
          </div>
        );
      })}

      {/* COLLECTOR SLOT — countdown skin, ~60% scroll */}
      {collectorAt >= 0 && (
        <>
          <CollectorSpot cardMarketImpact={cardMarketImpact} focusTitle={null} skin="countdown" cardImageUrl={inlineImages[0] || null} />
          {/* anti-bounce next-up hook */}
          <a
            href="/mcu-news"
            className="grid items-center"
            style={{ margin: "1.2rem 0 0", border: "1px solid var(--border)", borderRadius: 14, background: "var(--card)", gridTemplateColumns: "1fr auto", gap: "1rem", padding: "1.3rem 1.5rem", textDecoration: "none" }}
          >
            <span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".62rem", letterSpacing: ".2em", display: "block", marginBottom: ".25rem", color: GOLD, textTransform: "uppercase" }}>Up Next</span>
              <span style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: "1.3rem", lineHeight: 1.1, textTransform: "uppercase" }}>
                {excerpt ? "The Full Breakdown" : "More from the MCU News desk"}
              </span>
            </span>
            <span style={{ fontFamily: "'Anton',sans-serif", fontSize: "1.6rem", color: "var(--primary)" }}>→</span>
          </a>
        </>
      )}

      <style>{`
        .lc-art{ position:relative; }
        .lc-card-img{ max-height:420px; }
        @media(max-width:768px){
          .lc-entry{ grid-template-columns:1fr !important; }
          .lc-counter{ display:none; }
          .lc-copy-wrap{ order:-1 !important; }
          .lc-art-wrap{ order:1 !important; }
          .lc-art{ min-height:auto !important; max-height:none !important; padding:12px !important; }
          .lc-card-img{ max-height:420px !important; width:auto !important; max-width:100% !important; margin:0 auto !important; }
          .lc-art img{ object-fit:contain !important; border-radius:6px; }
          .lc-art .group > p.absolute{ display:none !important; }
          .lc-rank-bg{ font-size:2.5rem !important; top:4px !important; left:6px !important; opacity:0.12 !important; }
          .lc-rank-badge{ width:28px !important; height:28px !important; top:6px !important; left:6px !important; font-size:.65rem !important; }
          .lc-copy{ padding:0.9rem 1rem !important; }
          .lc-copy h2{ font-size:1.15rem !important; line-height:1.2 !important; margin-bottom:0.4rem !important; }
          .lc-entry{ margin-bottom:0.8rem !important; border-width:2px !important; }
        }
        @media(max-width:480px){
          .lc-card-img{ max-height:380px !important; }
          .lc-rank-bg{ font-size:2rem !important; }
          .lc-rank-badge{ width:24px !important; height:24px !important; font-size:.6rem !important; }
          .lc-copy{ padding:0.7rem 0.85rem !important; }
          .lc-copy h2{ font-size:1.05rem !important; line-height:1.15 !important; }
          .lc-entry{ margin-bottom:0.6rem !important; border-radius:10px !important; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// TEMPLATE 6: PATRIOTIC — Red, White & Blue, Northland Fence style
// Side-by-side image/text blocks, bold section headers, serious editorial
// ============================================================
export function PatrioticTemplate({ content, title, featuredImageUrl, excerpt, tags, category }: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const images = useMemo(() => extractImages(content), [content]);
  const pullQuote = useMemo(() => extractPullQuote(content), [content]);

  return (
    <div className="relative">
      {/* Back to MCU News link */}
      <div className="border-b border-border bg-card/30">
        <div className="container max-w-5xl py-3 px-6">
          <Link href="/mcu-news" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to MCU News
          </Link>
        </div>
      </div>

      {/* Top patriotic banner — thick stripe */}
      <div className="flex h-3">
        <div className="flex-1 bg-[#B22234]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#3C3B6E]" />
      </div>

      {/* Hero section — full-width with dramatic overlay */}
      {featuredImageUrl && (
        <div className="relative">
          <img src={featuredImageUrl} alt={title} className="w-full h-80 sm:h-[500px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-14">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[#B22234]" />
              <span className="text-[#B22234] text-sm font-black uppercase tracking-[0.2em]">In Memoriam</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 uppercase tracking-tight" style={{ fontFamily: 'Oswald, Impact, sans-serif' }}>
              {title}
            </h1>
            {excerpt && (
              <p className="text-white/90 text-lg sm:text-xl leading-relaxed max-w-3xl font-light">
                {excerpt}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Content area — dark background with patriotic accents */}
      <div className="relative px-6 sm:px-12 lg:px-20 py-12 overflow-hidden bg-background">
        {/* Subtle patriotic watermark text on dark background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute rotate-[-15deg] whitespace-nowrap">
            <span className="text-[6rem] sm:text-[8rem] lg:text-[10rem] font-black uppercase tracking-wider text-[#B22234]/[0.06] leading-none select-none" style={{ fontFamily: 'Oswald, Impact, sans-serif' }}>
              Memorial Day Weekend 2026
            </span>
          </div>
        </div>
        {/* Second watermark line offset */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden pb-[20%]" aria-hidden="true">
          <div className="absolute rotate-[-15deg] whitespace-nowrap">
            <span className="text-[5rem] sm:text-[7rem] lg:text-[9rem] font-black uppercase tracking-wider text-[#3C3B6E]/[0.08] leading-none select-none" style={{ fontFamily: 'Oswald, Impact, sans-serif' }}>
              Memorial Day Weekend 2026
            </span>
          </div>
        </div>
        {/* Top Share Buttons for patriotic template */}
        <div className="relative z-10 max-w-4xl mx-auto mb-6">
          <ShareButtons
            url={typeof window !== 'undefined' ? window.location.href : ''}
            title={title}
            variant="dark"
          />
        </div>

        {/* Intro — light text on dark, serious editorial */}
        <div className="relative z-10 max-w-4xl mx-auto mb-14 pb-10 border-b-4 border-[#B22234]">
          <RichContent className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-xl prose-a:text-[#6B8FD4] prose-strong:text-white prose-blockquote:border-[#B22234] prose-blockquote:text-gray-300 prose-img:rounded-lg">{stripImages(intro)}</RichContent>
        </div>

        {/* Sections — alternating side-by-side layout like Northland Fence */}
        {sections.map((section, i) => {
          const isEven = i % 2 === 0;
          const sectionImage = images[i] || null;
          // Strip the pull quote from the first section body to avoid duplicate display
          const sectionBody = (i === 0 && pullQuote) 
            ? section.body.replace(/> "[^"]{20,200}"\n?/g, '').trim()
            : section.body;
          
          return (
            <div key={i} className="relative z-10 max-w-5xl mx-auto mb-16">
              {/* Section header — bold with red left accent */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-12 bg-[#B22234] rounded-full" />
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight uppercase tracking-tight">
                  {section.heading}
                </h2>
              </div>

              {/* Side-by-side layout (Northland Fence style) */}
              {sectionImage ? (
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${isEven ? '' : ''}`}>
                  {isEven ? (
                    <>
                      <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#B22234]/30">
                        <ImageLightbox src={sectionImage} alt={section.heading} className="w-full h-auto object-contain" caption={section.heading} />
                      </div>
                      <RichContent className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-[#6B8FD4] prose-strong:text-white prose-blockquote:border-[#B22234] prose-blockquote:text-gray-400 prose-img:rounded-lg">{stripImages(sectionBody)}</RichContent>
                    </>
                  ) : (
                    <>
                      <RichContent className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-[#6B8FD4] prose-strong:text-white prose-blockquote:border-[#B22234] prose-blockquote:text-gray-400 prose-img:rounded-lg">{stripImages(sectionBody)}</RichContent>
                      <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#3C3B6E]/30">
                        <ImageLightbox src={sectionImage} alt={section.heading} className="w-full h-auto object-contain" caption={section.heading} />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <RichContent className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-[#6B8FD4] prose-strong:text-white prose-blockquote:border-[#B22234] prose-blockquote:text-gray-400 prose-img:rounded-lg">{stripImages(sectionBody)}</RichContent>
              )}

              {/* Pull quote after first section */}
              {i === 0 && pullQuote && (
                <div className="my-12 py-8 px-10 bg-[#3C3B6E] rounded-2xl shadow-xl">
                  <blockquote className="text-xl sm:text-2xl font-semibold text-white italic leading-relaxed">
                    "{pullQuote}"
                  </blockquote>
                  <div className="flex items-center gap-2 mt-5">
                    <Flag className="w-5 h-5 text-[#B22234]" />
                    <span className="text-sm text-white/80 font-medium uppercase tracking-wider">A moment of reflection</span>
                  </div>
                </div>
              )}

              {/* Section divider — stars and stripes inspired */}
              {i < sections.length - 1 && (
                <div className="flex items-center gap-4 mt-14">
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-[#B22234] to-transparent" />
                  <div className="flex gap-1">
                    <Star className="w-4 h-4 text-[#3C3B6E] fill-[#3C3B6E]" />
                    <Star className="w-4 h-4 text-[#B22234] fill-[#B22234]" />
                    <Star className="w-4 h-4 text-[#3C3B6E] fill-[#3C3B6E]" />
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-[#3C3B6E] to-transparent" />
                </div>
              )}
            </div>
          );
        })}
        {/* Bottom Share Buttons for patriotic template */}
        <div className="relative z-10 max-w-4xl mx-auto mt-10 pt-6 border-t-2 border-[#B22234]/30">
          <ShareButtons
            url={typeof window !== 'undefined' ? window.location.href : ''}
            title={title}
            variant="dark"
          />
        </div>
      </div>

      {/* Bottom patriotic stripe */}
      <div className="flex h-3">
        <div className="flex-1 bg-[#B22234]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#3C3B6E]" />
      </div>
    </div>
  );
}

// ============================================================
// TEMPLATE 7: CINEMATIC — Marvel.com-style feature layout
// Full-bleed 21:9 letterbox hero, scene-marked sections,
// full-bleed stills, theatrical pull quote, CollectorSpot CTA.
// ============================================================

// Shared URLs — single source of truth for all templates
const NLF_WHATNOT_URL = "https://www.whatnot.com/user/northlandfinds";
const NLF_SHOP_URL = "https://northlandlegendaryfinds.com/shop";

type CollectorSkin = "cinematic" | "comic" | "editorial" | "intel" | "countdown" | "mission" | "glossy" | "explainer" | "parkpass" | "default";

function CollectorSpot({
  cardMarketImpact,
  focusTitle,
  skin = "default",
  cardImageUrl,
}: {
  cardMarketImpact?: string | null;
  focusTitle?: string | null;
  skin?: CollectorSkin;
  cardImageUrl?: string | null;
}) {
  const hasCard = Boolean(cardMarketImpact || focusTitle);
  const heading = hasCard ? (focusTitle || "This Week's Collector Focus") : "Build Different.";
  const body = hasCard
    ? cardMarketImpact ||
      "Tracking this one closely — supply is tightening and the window is open."
    : "Strong floor, loaded middle, healthy ceiling. That's every NLF repack — live on Whatnot.";
  const kicker = hasCard ? "Now Collecting" : "From The Shop";

  if (skin === "cinematic") {
    return (
      <div
        style={{
          position: "relative",
          margin: "3rem -1.25rem",
          background: "#000",
          borderTop: "2px solid #e23636",
          borderBottom: "2px solid #e23636",
          overflow: "hidden",
        }}
      >
        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: hasCard ? "auto 1fr auto" : "1fr auto",
            gap: "1.5rem",
            padding: "1.5rem 2rem",
          }}
        >
          {hasCard && (
            cardImageUrl ? (
              <img src={cardImageUrl} alt="Featured card" style={{ width: 90, height: 120, flexShrink: 0, objectFit: "cover", borderRadius: 6, border: "1px solid #3a4a5a" }} />
            ) : (
              <div
                style={{
                  width: 90,
                  height: 120,
                  flexShrink: 0,
                  background: "linear-gradient(135deg,#1a1a2e,#16213e)",
                  border: "1px solid #3a4a5a",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "2rem" }}>🃏</span>
              </div>
            )
          )}
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "#ffce4d",
                letterSpacing: ".25em",
                textTransform: "uppercase",
                fontSize: ".66rem",
                marginBottom: ".4rem",
              }}
            >
              {kicker}
            </div>
            <h4
              style={{
                fontFamily: "'Oswald', sans-serif",
                textTransform: "uppercase",
                fontSize: "1.4rem",
                margin: "0 0 .35rem",
                color: "#fff",
                letterSpacing: ".01em",
              }}
            >
              {heading}
            </h4>
            <p style={{ margin: 0, fontSize: ".88rem", color: "#b4b4c0", maxWidth: "34rem" }}>
              {body}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            <a href={NLF_WHATNOT_URL} className="cine-cta-primary">
              Watch on Whatnot →
            </a>
            <a href={NLF_SHOP_URL} className="cine-cta-ghost">
              Shop the Repacks
            </a>
          </div>
        </div>
        <style>{`
          .cine-cta-primary{display:inline-block;text-align:center;font-family:'Oswald',sans-serif;
            text-transform:uppercase;letter-spacing:.06em;font-size:.82rem;padding:.6rem 1.2rem;
            border-radius:3px;text-decoration:none;white-space:nowrap;background:#e23636;color:#fff;}
          .cine-cta-ghost{display:inline-block;text-align:center;font-family:'Oswald',sans-serif;
            text-transform:uppercase;letter-spacing:.06em;font-size:.82rem;padding:.6rem 1.2rem;
            border-radius:3px;text-decoration:none;white-space:nowrap;border:1px solid #3a4a5a;color:#d4d4de;}
          @media(max-width:640px){
            .cine-cta-primary,.cine-cta-ghost{font-size:.78rem;}
          }
        `}</style>
      </div>
    );
  }

  // intel skin — S.H.I.E.L.D. green, IBM Plex Mono, classified aesthetic
  if (skin === "intel") {
    return (
      <div
        style={{
          margin: "1.5rem 0",
          border: "2px solid #7dd66f",
          borderRadius: 4,
          background: "var(--card)",
          overflow: "hidden",
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        <div
          style={{
            background: "#7dd66f",
            color: "#0a1606",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".14em",
            fontSize: ".66rem",
            padding: ".4rem 1rem",
          }}
        >
          // Recovered Asset — Acquisition Recommended
        </div>
        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: hasCard ? "auto 1fr auto" : "1fr auto",
            gap: "1.2rem",
            padding: "1.1rem 1.3rem",
          }}
        >
          {hasCard && (
            cardImageUrl ? (
              <img src={cardImageUrl} alt="Featured card" style={{ width: 74, height: 100, flexShrink: 0, objectFit: "cover", borderRadius: 4, border: "1px solid #2a301f" }} />
            ) : (
              <div style={{ width: 74, height: 100, flexShrink: 0, background: "linear-gradient(135deg,#161a10,#101309)", border: "1px solid #2a301f", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "1.6rem" }}>🃏</span>
              </div>
            )
          )}
          <div>
            <h4
              style={{
                fontSize: "1.1rem",
                margin: "0 0 .3rem",
                color: "#d8e0d0",
                textTransform: "uppercase",
                letterSpacing: ".04em",
                fontWeight: 700,
              }}
            >
              {heading}
            </h4>
            <p
              style={{
                margin: 0,
                fontFamily: "'Inter', sans-serif",
                fontSize: ".86rem",
                color: "var(--muted-foreground)",
                maxWidth: "30rem",
                lineHeight: 1.6,
              }}
            >
              {body}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            <a
              href={NLF_WHATNOT_URL}
              style={{
                fontSize: ".78rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".06em",
                padding: ".55rem 1.05rem",
                borderRadius: 3,
                textDecoration: "none",
                textAlign: "center",
                whiteSpace: "nowrap",
                background: "#7dd66f",
                color: "#0a1606",
              }}
            >
              Watch on Whatnot →
            </a>
            <a
              href={NLF_SHOP_URL}
              style={{
                fontSize: ".78rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".06em",
                padding: ".55rem 1.05rem",
                borderRadius: 3,
                textDecoration: "none",
                textAlign: "center",
                whiteSpace: "nowrap",
                border: "1px solid #2a301f",
                color: "#d8e0d0",
              }}
            >
              Shop the Repacks
            </a>
          </div>
        </div>
      </div>
    );
  }

  // editorial skin — quiet gold accent, Fraunces serif heading
  if (skin === "editorial") {
    return (
      <div
        className="grid items-center"
        style={{
          margin: "2.4rem 0",
          border: "1px solid var(--border)",
          borderTop: "2px solid #c9a24b",
          background: "var(--card)",
          gridTemplateColumns: hasCard ? "auto 1fr auto" : "1fr auto",
          gap: "1.3rem",
          padding: "1.3rem 1.4rem",
        }}
      >
        {hasCard && (
          cardImageUrl ? (
            <img src={cardImageUrl} alt="Featured card" style={{ width: 74, height: 100, flexShrink: 0, objectFit: "cover", borderRadius: 4, border: "1px solid #2e333d" }} />
          ) : (
            <div style={{ width: 74, height: 100, flexShrink: 0, background: "linear-gradient(135deg,#181b22,#13151b)", border: "1px solid #2e333d", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "1.6rem" }}>🃏</span>
            </div>
          )
        )}
        <div>
          <div
            style={{
              fontSize: ".66rem",
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "#c9a24b",
              marginBottom: ".35rem",
            }}
          >
            {kicker}
          </div>
          <h4
            style={{
              fontFamily: "'Fraunces',serif",
              fontWeight: 600,
              fontSize: "1.25rem",
              margin: "0 0 .3rem",
              color: "#fff",
            }}
          >
            {heading}
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: ".88rem",
              color: "var(--muted-foreground)",
              maxWidth: "30rem",
              lineHeight: 1.6,
            }}
          >
            {body}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
          <a
            href={NLF_WHATNOT_URL}
            style={{
              fontSize: ".82rem",
              fontWeight: 600,
              padding: ".55rem 1.1rem",
              borderRadius: 6,
              textDecoration: "none",
              textAlign: "center",
              whiteSpace: "nowrap",
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            Watch on Whatnot →
          </a>
          <a
            href={NLF_SHOP_URL}
            style={{
              fontSize: ".82rem",
              fontWeight: 600,
              padding: ".55rem 1.1rem",
              borderRadius: 6,
              textDecoration: "none",
              textAlign: "center",
              whiteSpace: "nowrap",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          >
            Shop the Repacks
          </a>
        </div>
      </div>
    );
  }

  // countdown skin — blue/steel gradient, JetBrains Mono, rank-list aesthetic
  if (skin === "countdown") {
    return (
      <div
        className="grid items-center"
        style={{
          margin: "1.2rem 0",
          borderRadius: 14,
          background: "linear-gradient(135deg,rgba(98,224,138,.12),rgba(77,181,255,.06))",
          border: "1px solid rgba(98,224,138,.3)",
          gridTemplateColumns: hasCard ? "auto 1fr auto" : "1fr auto",
          gap: "1.3rem",
          padding: "1.3rem 1.5rem",
        }}
      >
        {hasCard && (
          cardImageUrl ? (
            <img src={cardImageUrl} alt="Featured card" style={{ width: 78, height: 106, flexShrink: 0, objectFit: "cover", borderRadius: 4, border: "1px solid #3a4258" }} />
          ) : (
            <div style={{ width: 78, height: 106, flexShrink: 0, background: "linear-gradient(135deg,#0e1621,#111927)", border: "1px solid #3a4258", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "1.6rem" }}>🃏</span>
            </div>
          )
        )}
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: ".62rem",
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: ".35rem",
            }}
          >
            {heading}
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "'Inter', sans-serif",
              fontSize: ".88rem",
              color: "var(--muted-foreground)",
              maxWidth: "32rem",
              lineHeight: 1.6,
            }}
          >
            {body}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".55rem" }}>
          <a
            href={NLF_WHATNOT_URL}
            style={{
              fontWeight: 600,
              fontSize: ".84rem",
              padding: ".55rem 1.15rem",
              borderRadius: 7,
              textDecoration: "none",
              textAlign: "center",
              whiteSpace: "nowrap",
              background: "var(--primary)",
              color: "#0a1606",
            }}
          >
            Watch on Whatnot
          </a>
          <a
            href={NLF_SHOP_URL}
            style={{
              fontWeight: 600,
              fontSize: ".84rem",
              padding: ".55rem 1.15rem",
              borderRadius: 7,
              textDecoration: "none",
              textAlign: "center",
              whiteSpace: "nowrap",
              border: "1px solid #3a4258",
              color: "var(--primary-foreground)",
            }}
          >
            Shop the Repacks
          </a>
        </div>
      </div>
    );
  }

  if (skin === "mission") {
    return (
      <div
        style={{
          margin: "1.4rem 0",
          border: "1px solid #243038",
          borderRadius: 14,
          background: "linear-gradient(135deg,#16202a,#101820)",
          display: "grid",
          gridTemplateColumns: hasCard ? "auto 1fr auto" : "1fr auto",
          gap: "1.3rem",
          padding: "1.3rem 1.5rem",
          alignItems: "center",
        }}
      >
        {hasCard && (
          cardImageUrl ? (
            <img src={cardImageUrl} alt="Featured card" style={{ width: 78, height: 106, flexShrink: 0, objectFit: "cover", borderRadius: 4, border: "1px solid #243038" }} />
          ) : (
            <div style={{ width: 78, height: 106, flexShrink: 0, background: "linear-gradient(135deg,#101820,#16202a)", border: "1px solid #243038", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "1.6rem" }}>🃏</span>
            </div>
          )
        )}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".62rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#48c9d6", marginBottom: ".35rem" }}>{kicker}</div>
          <h4 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1.5rem", margin: "0 0 .3rem", color: "#fff", textTransform: "uppercase", letterSpacing: ".01em" }}>{heading}</h4>
          <p style={{ margin: 0, fontSize: ".88rem", color: "#8a9aaa", maxWidth: "32rem" }}>{body}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
          <a href={NLF_WHATNOT_URL} style={{ fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1.15rem", borderRadius: 7, textDecoration: "none", textAlign: "center", whiteSpace: "nowrap", background: "#48c9d6", color: "#0a1820" }}>Watch on Whatnot →</a>
          <a href={NLF_SHOP_URL} style={{ fontWeight: 600, fontSize: ".84rem", padding: ".55rem 1.15rem", borderRadius: 7, textDecoration: "none", textAlign: "center", whiteSpace: "nowrap", border: "1px solid #243038", color: "#c4ccd2" }}>Shop the Repacks</a>
        </div>
      </div>
    );
  }

  if (skin === "glossy") {
    return (
      <div style={{ margin: "2rem -1.25rem", background: "linear-gradient(135deg,#ff5d8f,#9b6bff)", padding: 2 }}>
        <div
          className="grid items-center"
          style={{ background: "#141019", gridTemplateColumns: hasCard ? "auto 1fr auto" : "1fr auto", gap: "1.4rem", padding: "1.4rem 1.6rem" }}
        >
          {hasCard && (
            cardImageUrl ? (
              <img src={cardImageUrl} alt="Featured card" style={{ width: 84, height: 112, flexShrink: 0, objectFit: "cover", borderRadius: 4, border: "1px solid #3c3848" }} />
            ) : (
              <div style={{ width: 84, height: 112, flexShrink: 0, background: "linear-gradient(135deg,#1b1622,#15111c)", border: "1px solid #3c3848", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "1.6rem" }}>🃏</span>
              </div>
            )
          )}
          <div>
            <div style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 800, color: "#ff5d8f", letterSpacing: ".2em", textTransform: "uppercase", fontSize: ".64rem", marginBottom: ".35rem" }}>{kicker}</div>
            <h4 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.5rem", margin: "0 0 .3rem", color: "#fff" }}>{heading}</h4>
            <p style={{ margin: 0, fontSize: ".88rem", color: "#bdb9c8", maxWidth: "32rem" }}>{body}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            <a href={NLF_WHATNOT_URL} style={{ fontWeight: 600, fontSize: ".84rem", padding: ".55rem 1.15rem", borderRadius: 7, textDecoration: "none", textAlign: "center", whiteSpace: "nowrap", background: "var(--primary)", color: "var(--primary-foreground)" }}>Watch on Whatnot →</a>
            <a href={NLF_SHOP_URL} style={{ fontWeight: 600, fontSize: ".84rem", padding: ".55rem 1.15rem", borderRadius: 7, textDecoration: "none", textAlign: "center", whiteSpace: "nowrap", border: "1px solid #3c3848", color: "#dcd9e4" }}>Shop the Repacks</a>
          </div>
        </div>
      </div>
    );
  }

  if (skin === "explainer") {
    return (
      <div className="grid items-center" style={{ margin:"1.6rem 0", border:"1px solid rgba(91,140,255,.4)", borderRadius:14, background:"linear-gradient(135deg,rgba(91,140,255,.1),rgba(139,107,255,.04))", gridTemplateColumns: hasCard ? "auto 1fr auto" : "1fr auto", gap:"1.3rem", padding:"1.3rem 1.5rem" }}>
        {hasCard && (
          cardImageUrl ? (
            <img src={cardImageUrl} alt="Featured card" style={{ width: 76, height: 104, flexShrink: 0, objectFit: "cover", borderRadius: 8, border: "1px solid #353c52" }} />
          ) : (
            <div style={{ width: 76, height: 104, flexShrink: 0, borderRadius: 8, background: "linear-gradient(135deg,#161b28,#11151f)", border: "1px solid #353c52", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "1.6rem" }}>🃏</span>
            </div>
          )
        )}
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", color:"#5b8cff", letterSpacing:".2em", textTransform:"uppercase", fontSize:".64rem", marginBottom:".35rem" }}>{kicker}</div>
          <h4 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"1.3rem", margin:"0 0 .3rem", color:"#fff" }}>{heading}</h4>
          <p style={{ margin:0, fontSize:".88rem", color:"#aeb4c4", maxWidth:"32rem" }}>{body}</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:".5rem" }}>
          <a href={NLF_WHATNOT_URL} style={{ fontWeight:600, fontSize:".84rem", padding:".55rem 1.15rem", borderRadius:7, textDecoration:"none", textAlign:"center", whiteSpace:"nowrap", background:"var(--primary)", color:"var(--primary-foreground)" }}>Watch on Whatnot →</a>
          <a href={NLF_SHOP_URL} style={{ fontWeight:600, fontSize:".84rem", padding:".55rem 1.15rem", borderRadius:7, textDecoration:"none", textAlign:"center", whiteSpace:"nowrap", border:"1px solid #353c52", color:"#d4d8e2" }}>Shop the Repacks</a>
        </div>
      </div>
    );
  }

  if (skin === "parkpass") {
    return (
      <div className="parkpass-collector" style={{ margin:"1.5rem 0", borderRadius:16, overflow:"hidden", background:"linear-gradient(135deg,#3aa0ff,#a86bff,#ff6fb5)", padding:2 }}>
        <div style={{ background:"#10172a", borderRadius:14, overflow:"hidden" }}>
          {cardImageUrl && (
            <div style={{ width:"100%", overflow:"hidden" }}>
              <img src={cardImageUrl} alt="Featured card" style={{ width:"100%", height:"auto", display:"block" }} />
            </div>
          )}
          <div style={{ padding:"1.3rem 1.5rem" }}>
            <div style={{ fontFamily:"'Baloo 2',sans-serif", fontWeight:700, color:"#ffcf5c", letterSpacing:".14em", textTransform:"uppercase", fontSize:".66rem", marginBottom:".35rem" }}>{kicker}</div>
            <h4 style={{ fontFamily:"'Baloo 2',sans-serif", fontWeight:800, fontSize:"1.45rem", margin:"0 0 .5rem", color:"#fff" }}>{heading}</h4>
            <p style={{ margin:"0 0 1rem", fontSize:".88rem", color:"#b4bcd4", lineHeight:1.5 }}>{body}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:".5rem" }}>
              <a href={NLF_WHATNOT_URL} style={{ fontFamily:"'Baloo 2',sans-serif", fontWeight:700, fontSize:".84rem", padding:".55rem 1.15rem", borderRadius:999, textDecoration:"none", textAlign:"center", whiteSpace:"nowrap", background:"var(--primary)", color:"var(--primary-foreground)" }}>Watch on Whatnot →</a>
              <a href={NLF_SHOP_URL} style={{ fontFamily:"'Baloo 2',sans-serif", fontWeight:700, fontSize:".84rem", padding:".55rem 1.15rem", borderRadius:999, textDecoration:"none", textAlign:"center", whiteSpace:"nowrap", border:"1.5px solid #384465", color:"#d6dcec" }}>Shop the Repacks</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // default skin — neutral, uses brand tokens
  return (
    <div
      style={{
        margin: "2.5rem 0",
        border: "1px solid var(--border)",
        borderLeft: "4px solid var(--primary)",
        borderRadius: 8,
        background: "var(--card)",
        padding: "1.4rem 1.5rem",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontSize: ".66rem",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--primary)",
            marginBottom: ".4rem",
            fontWeight: 600,
          }}
        >
          {kicker}
        </div>
        <h4 style={{ margin: "0 0 .35rem", fontSize: "1.2rem", color: "var(--foreground)" }}>
          {heading}
        </h4>
        <p style={{ margin: 0, fontSize: ".9rem", color: "var(--muted-foreground)" }}>{body}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <a
          href={NLF_WHATNOT_URL}
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            padding: ".55rem 1.1rem",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: ".85rem",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          Watch on Whatnot →
        </a>
        <a
          href={NLF_SHOP_URL}
          style={{
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            padding: ".55rem 1.1rem",
            borderRadius: 6,
            textDecoration: "none",
            fontSize: ".85rem",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          Shop the Repacks
        </a>
      </div>
    </div>
  );
}

function CineStill({
  imageUrl,
  caption,
  alt,
}: {
  imageUrl?: string | null;
  caption?: string;
  alt: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        margin: "2.5rem -1.25rem",
        aspectRatio: "16 / 7",
        background: "#000",
        overflow: "hidden",
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#0e0e16,#0a0a10)" }} />
      )}
      {caption && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "1rem 1.5rem",
            background: "linear-gradient(transparent,rgba(0,0,0,.85))",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: ".7rem",
            color: "#b4b4c0",
            letterSpacing: ".05em",
            zIndex: 2,
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}

export function CinematicTemplate({
  content,
  title,
  featuredImageUrl,
  excerpt,
  cardMarketImpact,
  category,
}: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const pullQuote = useMemo(() => extractPullQuote(content), [content]);
  const inlineImages = useMemo(() => extractImages(content), [content]);

  // collector slot sits after ~60-65% of sections; place before the last section
  const collectorAfter = Math.max(0, Math.ceil(sections.length * 0.6) - 1);

  return (
    <div>
      {/* ① full-bleed 21:9 letterbox hero */}
      <div
        style={{
          position: "relative",
          margin: "0 -1.25rem",
          aspectRatio: "21 / 9",
          background: "#000",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 42, background: "#000", zIndex: 2 }} />
        {featuredImageUrl ? (
          <img src={featuredImageUrl} alt={title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: ".5rem",
              color: "#5a5a6a",
              background: "repeating-linear-gradient(45deg,#0e0e16 0 22px,#0a0a10 22px 44px)",
            }}
          >
            <span style={{ fontSize: "2rem" }}>▦</span>
            <span style={{ fontFamily: "'Oswald',sans-serif", letterSpacing: ".2em", textTransform: "uppercase", fontSize: ".8rem" }}>
              Hero Still — Add Image
            </span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".68rem", opacity: 0.6 }}>1920 × 823 · 21:9</span>
          </div>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 42, background: "#000", zIndex: 2 }} />
        <div style={{ position: "relative", zIndex: 3, padding: "0 2rem 3rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#ffce4d", letterSpacing: ".3em", textTransform: "uppercase", fontSize: ".7rem", marginBottom: ".6rem" }}>
            {category || "Field Report"}
          </div>
          <h2
            style={{
              fontFamily: "'Oswald',sans-serif",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "clamp(1.8rem,5vw,3rem)",
              lineHeight: 0.98,
              margin: 0,
              color: "#fff",
              maxWidth: "70%",
            }}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* ② theatrical intro */}
      {intro && (
        <div className="cine-intro-wrap" style={{ maxWidth: "42rem", margin: "3rem auto 2.5rem", textAlign: "center" }}>
          <RichContent className={`${proseClasses} cine-intro-prose`}>{stripImages(intro)}</RichContent>
        </div>
      )}

      {/* ③ scenes + stills + collector slot injected mid-way */}
      {sections.map((section, i) => (
        <div key={i}>
          <div style={{ margin: "0 0 3rem" }}>
            <div className="flex items-center justify-center" style={{ gap: "1rem", margin: "0 0 1.6rem" }}>
              <span style={{ height: 1, flex: 1, maxWidth: 120, background: "linear-gradient(90deg,transparent,#3a4a5a)" }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".66rem", letterSpacing: ".3em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
                Scene {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ height: 1, flex: 1, maxWidth: 120, background: "linear-gradient(90deg,#3a4a5a,transparent)" }} />
            </div>
            <h3
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: "clamp(1.5rem,3.5vw,2.1rem)",
                textAlign: "center",
                margin: "0 0 1.4rem",
                color: "#fff",
              }}
            >
              {section.heading}
            </h3>
            <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
              <RichContent className={proseClasses}>{stripImages(section.body)}</RichContent>
            </div>
          </div>

          {/* still after first scene — use first inline image if available */}
          {i === 0 && inlineImages.length > 0 && <CineStill imageUrl={inlineImages[0]} caption={undefined} alt={section.heading} />}

          {/* pull quote after first scene */}
          {i === 0 && pullQuote && (
            <div style={{ maxWidth: "34rem", margin: "2.5rem auto", textAlign: "center" }}>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: "2.5rem", color: "#e23636", lineHeight: 0.5 }}>"</div>
              <blockquote
                style={{
                  margin: ".4rem 0 0",
                  fontFamily: "'Oswald',sans-serif",
                  fontWeight: 500,
                  fontSize: "clamp(1.3rem,3vw,1.8rem)",
                  lineHeight: 1.3,
                  color: "#fff",
                  fontStyle: "italic",
                }}
              >
                {pullQuote}
              </blockquote>
            </div>
          )}

          {/* COLLECTOR SLOT — guaranteed, genre-skinned, ~60% scroll */}
          {i === collectorAfter && (
            <>
              <CollectorSpot cardMarketImpact={cardMarketImpact} focusTitle={null} skin="cinematic" cardImageUrl={inlineImages[0] || null} />
              <a
                href="/mcu-news"
                className="grid items-center"
                style={{
                  margin: "2.5rem 0",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  background: "var(--card)",
                  gridTemplateColumns: "1fr auto",
                  gap: "1rem",
                  padding: "1.1rem 1.4rem",
                  textDecoration: "none",
                }}
              >
                <span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".62rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#ffce4d", display: "block", marginBottom: ".25rem" }}>
                    Up Next
                  </span>
                  <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.15rem", color: "#fff", lineHeight: 1.2 }}>
                    {excerpt ? "Continue the series" : "More from the MCU News desk"}
                  </span>
                </span>
                <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.5rem", color: "var(--primary)" }}>→</span>
              </a>
            </>
          )}
        </div>
      ))}

      <style>{`
        .cine-intro-prose p{ font-size:1.2rem; line-height:1.9; color:#d4d4de; text-align:center; }
        .cine-intro-prose > p:first-of-type::first-letter{
          font-family:'Oswald',sans-serif; font-size:1.4em; color:#e23636; font-weight:700;
        }
      `}</style>
    </div>
  );
}

// ============================================================
// TEMPLATE 8: DOSSIER — S.H.I.E.L.D. intel file, classified look
// Classified header, metadata grid + stamp, evidence image,
// executive summary, file-folder sections, redacted pull quote,
// CollectorSpot intel skin.
// ============================================================

const CLASSIFIED = "#d4a017";
const PRIMARY_GREEN = "#7dd66f";
const STAMP_RED = "#b5341f";
const DOS_BORDER = "#2a301f";
const DOS_PAPER = "#161a10";

function RedactedQuote({ quote }: { quote: string }) {
  const words = quote.trim().split(/\s+/);
  if (words.length < 4) return <>"{quote}"</>;
  const idx = Math.max(2, words.length - 2);
  const redactLen = Math.max(6, words[idx].length);
  return (
    <>
      "{words.slice(0, idx).join(" ")}{" "}
      <span
        style={{ background: "#1a1d14", color: "transparent", padding: "0 .2rem", borderRadius: 2, userSelect: "none" }}
        aria-label="redacted"
      >
        {"█".repeat(redactLen)}
      </span>{" "}
      {words.slice(idx + 1).join(" ")}"
    </>
  );
}

export function DossierTemplate({
  content,
  title,
  featuredImageUrl,
  excerpt,
  tags,
  category,
  cardMarketImpact,
}: TemplateProps) {
    const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const pullQuote = useMemo(() => extractPullQuote(content), [content]);
  const inlineImages = useMemo(() => extractImages(content), [content]);
  const collectorAfter = Math.max(0, Math.ceil(sections.length * 0.6) - 1);
  const caseNo = useMemo(() => {
    let h = 0;
    for (let i = 0; i < (title || "").length; i++) h = (h * 31 + title.charCodeAt(i)) & 0xffff;
    return `NLF-2026-${String(h % 10000).padStart(4, "0")}`;
  }, [title]);

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#d8e0d0" }}>
      {/* ① classified header bar */}
      <div
        className="flex items-center justify-between"
        style={{ border: `2px solid ${CLASSIFIED}`, marginBottom: "1.2rem", borderRadius: 3, overflow: "hidden" }}
      >
        <span style={{ background: CLASSIFIED, color: "#000", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", fontSize: ".8rem", padding: ".55rem 1rem", flex: 1 }}>
          Intelligence Briefing
        </span>
        <span style={{ background: "#000", color: CLASSIFIED, fontSize: ".66rem", letterSpacing: ".1em", padding: ".55rem 1rem", whiteSpace: "nowrap" }}>
          CLEARANCE: COLLECTOR · EYES ONLY
        </span>
      </div>

      {/* ② subject metadata + stamp */}
      <div style={{ background: DOS_PAPER, border: `1px solid ${DOS_BORDER}`, borderRadius: 4, padding: "1.1rem 1.3rem", marginBottom: "1.2rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", right: "1.5rem", transform: "translateY(-50%) rotate(-14deg)", border: `3px solid ${STAMP_RED}`, color: STAMP_RED, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", fontSize: "1rem", padding: ".3rem .8rem", borderRadius: 4, opacity: 0.85 }}>
          Active
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "7rem 1fr", gap: ".4rem 1rem", fontSize: ".82rem", lineHeight: 1.6 }}>
          <span style={{ color: CLASSIFIED, textTransform: "uppercase", letterSpacing: ".08em" }}>Subject:</span>
          <span>{title}</span>
          <span style={{ color: CLASSIFIED, textTransform: "uppercase", letterSpacing: ".08em" }}>Case No:</span>
          <span>{caseNo}</span>
          {category && (
            <>
              <span style={{ color: CLASSIFIED, textTransform: "uppercase", letterSpacing: ".08em" }}>Category:</span>
              <span style={{ color: PRIMARY_GREEN }}>{category}</span>
            </>
          )}
          {tags && tags.length > 0 && (
            <>
              <span style={{ color: CLASSIFIED, textTransform: "uppercase", letterSpacing: ".08em" }}>Tags:</span>
              <span>{tags.join(" · ")}</span>
            </>
          )}
        </div>
      </div>

      {/* ③ attached evidence (image) */}
      <div style={{ border: `1px dashed ${DOS_BORDER}`, borderRadius: 4, padding: ".7rem", marginBottom: "1.2rem", background: "#0e110a" }}>
        <div style={{ fontSize: ".62rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: ".5rem" }}>
          Attached — Exhibit A · Visual Reference
        </div>
        <div style={{ background: "#0a0c07", position: "relative", border: `1px solid ${DOS_BORDER}` }}>
          {featuredImageUrl ? (
            <img src={featuredImageUrl} alt={title} style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }} />
          ) : null}
        </div>
      </div>

      {/* ④ executive summary */}
      {intro && (
        <div style={{ background: "var(--card)", borderLeft: `3px solid ${PRIMARY_GREEN}`, borderRadius: "0 4px 4px 0", padding: "1.1rem 1.3rem", marginBottom: "1.5rem" }}>
          <div style={{ color: PRIMARY_GREEN, textTransform: "uppercase", letterSpacing: ".14em", fontSize: ".7rem", fontWeight: 600, marginBottom: ".6rem" }}>
            Executive Summary
          </div>
          <RichContent className={proseClasses}>{stripImages(intro)}</RichContent>
        </div>
      )}

      {/* ⑤ intel sections + collector slot mid-way */}
      {sections.map((section, i) => (
        <div key={i}>
          <div style={{ border: `1px solid ${DOS_BORDER}`, borderRadius: 4, marginBottom: "1rem", overflow: "hidden", background: DOS_PAPER }}>
            <div className="flex items-center justify-between" style={{ background: "#1c2114", padding: ".7rem 1.1rem", borderBottom: `1px solid ${DOS_BORDER}` }}>
              <h3 style={{ margin: 0, fontSize: ".92rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#d8e0d0" }}>
                {section.heading}
              </h3>
              <span style={{ fontSize: ".64rem", color: "var(--muted-foreground)", background: "#000", padding: ".2rem .5rem", borderRadius: 3, letterSpacing: ".08em" }}>
                SEC {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div style={{ padding: "1rem 1.2rem" }}>
              <RichContent className={proseClasses}>{stripImages(section.body)}</RichContent>
            </div>
          </div>

          {/* redacted pull quote after first section */}
          {i === 0 && pullQuote && (
            <div style={{ margin: "1.5rem 0", background: "#0a0c07", border: `1px solid ${DOS_BORDER}`, borderRadius: 4, padding: "1.2rem 1.4rem", position: "relative" }}>
              <span style={{ position: "absolute", top: ".5rem", right: ".7rem", fontSize: ".58rem", color: "var(--muted-foreground)", letterSpacing: ".1em" }}>
                // FLAGGED
              </span>
              <blockquote style={{ margin: 0, fontFamily: "'Special Elite', monospace", fontSize: "1.15rem", lineHeight: 1.5, color: "#d8e0d0" }}>
                <RedactedQuote quote={pullQuote} />
              </blockquote>
            </div>
          )}

          {/* COLLECTOR SLOT — intel skin, ~60% scroll */}
          {i === collectorAfter && (
            <>
              <CollectorSpot cardMarketImpact={cardMarketImpact} focusTitle={null} skin="intel" cardImageUrl={inlineImages[0] || null} />
              <a
                href="/mcu-news"
                className="grid items-center"
                style={{ margin: "1.5rem 0 0", border: `1px solid ${DOS_BORDER}`, borderRadius: 4, background: DOS_PAPER, gridTemplateColumns: "1fr auto", gap: "1rem", padding: "1rem 1.3rem", textDecoration: "none" }}
              >
                <span>
                  <span style={{ fontSize: ".62rem", letterSpacing: ".16em", textTransform: "uppercase", color: CLASSIFIED, display: "block", marginBottom: ".3rem" }}>Related File</span>
                  <span style={{ fontSize: "1rem", color: "#d8e0d0", lineHeight: 1.3, fontWeight: 600 }}>
                    {excerpt ? "Cross-reference: related briefing" : "More from the MCU News desk"}
                  </span>
                </span>
                <span style={{ fontSize: "1.3rem", color: PRIMARY_GREEN }}>→</span>
              </a>
            </>
          )}
        </div>
      ))}

      {/* end of briefing */}
      <div style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--muted-foreground)", fontSize: ".66rem", letterSpacing: ".2em", textTransform: "uppercase" }}>
        <span style={{ border: `1px solid ${DOS_BORDER}`, padding: ".4rem 1rem", borderRadius: 999 }}>— End of Briefing —</span>
      </div>
    </div>
  );
}

// ============================================================
// TEMPLATE 9: CHARACTER PROFILE — Hero card, actor bio, card cross-reference
// ============================================================
export function CharacterProfileTemplate({ content, title, featuredImageUrl, tags, excerpt, cardMarketImpact }: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const pullQuote = useMemo(() => extractPullQuote(content), [content]);
  return (
    <div className="space-y-6">
      {/* Hero banner with character art */}
      {featuredImageUrl && (
        <div className="relative w-full h-72 sm:h-96 overflow-hidden rounded-2xl mb-2">
          <img src={featuredImageUrl} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/40 rounded-full mb-3">
              <User className="w-3 h-3 text-primary" />
              <span className="text-primary text-xs font-bold uppercase tracking-wider">Character Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{title}</h1>
          </div>
        </div>
      )}
      {/* Two-column: bio + sidebar */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          {intro && (
            <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-xl p-6">
              <RichContent className={proseClasses}>{stripImages(intro)}</RichContent>
            </div>
          )}
          {pullQuote && (
            <div className="relative pl-6 border-l-4 border-primary py-2">
              <Quote className="w-6 h-6 text-primary/40 mb-2" />
              <p className="text-lg italic text-foreground/80 leading-relaxed">{pullQuote}</p>
            </div>
          )}
          {sections.map((section, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xs font-bold">{i + 1}</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">{section.heading}</h2>
              </div>
              <RichContent className={proseClasses}>{stripImages(section.body)}</RichContent>
            </div>
          ))}
        </div>
        {/* Sticky sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Character Intel</h3>
              </div>
              {excerpt && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 pb-4 border-b border-border">{excerpt}</p>
              )}
              {tags && tags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Related Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              {cardMarketImpact && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Card Market</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{cardMarketImpact}</p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-border">
                <a href="/cards" className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <ChevronRight className="w-3 h-3" /> Browse Card Database
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ============================================================
// TEMPLATE 10: DISNEY EXPERIENCE — Park-brochure layout, festive gradient hero
// ============================================================
const DX_CARD_COLORS = [
  { accent: "linear-gradient(90deg,#3aa0ff,#46d4c8)", tier: "#3aa0ff" },
  { accent: "linear-gradient(90deg,#a86bff,#ff6fb5)", tier: "#a86bff" },
  { accent: "linear-gradient(90deg,#ff6fb5,#ffcf5c)", tier: "#ff6fb5" },
  { accent: "linear-gradient(90deg,#ffcf5c,#46d4c8)", tier: "#ffcf5c" },
];

export function DisneyExperienceTemplate({
  content,
  title,
  featuredImageUrl,
  excerpt,
  tags,
  category,
  cardMarketImpact,
}: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const pullQuote = useMemo(() => extractPullQuote(content), [content]);
  const inlineImages = useMemo(() => extractImages(content), [content]);
  const collectorAt = Math.max(0, Math.ceil(sections.length * 0.6) - 1);
  const GOLD = "#ffcf5c";
  const pills = (tags && tags.length ? tags : ["Disney Parks", "Disney+", "Marvel Experience"]).slice(0, 3);
  const pillStyles = [
    { color: "#3aa0ff", border: "rgba(58,160,255,.45)", bg: "rgba(58,160,255,.1)" },
    { color: "#a86bff", border: "rgba(168,107,255,.45)", bg: "rgba(168,107,255,.1)" },
    { color: "#ff6fb5", border: "rgba(255,111,181,.45)", bg: "rgba(255,111,181,.1)" },
  ];

  return (
    <div>
      {/* ① festive hero */}
      <div style={{ position: "relative", margin: "0 -1.25rem 1.5rem", overflow: "hidden" }}>
        <div style={{ aspectRatio: "16 / 8", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,rgba(58,160,255,.25),rgba(168,107,255,.18),rgba(255,111,181,.22))" }}>
          {featuredImageUrl ? (
            <img src={featuredImageUrl} alt={title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".4rem", color: "#aab4d0", background: "repeating-linear-gradient(135deg,rgba(255,255,255,.03) 0 18px,transparent 18px 36px)" }}>
              <span style={{ fontSize: "2.2rem" }}>✦</span>
              <span style={{ fontFamily: "'Baloo 2',sans-serif", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", fontSize: ".8rem" }}>Hero Image — Add</span>
              <span style={{ fontSize: ".66rem", opacity: 0.7 }}>1200 × 600 · 16:8</span>
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(11,15,26,.92),transparent 55%)" }} />
          <div style={{ position: "absolute", left: "1.5rem", bottom: "1.2rem", right: "1.5rem", zIndex: 2 }}>
            <span style={{ display: "inline-block", background: "#ff6fb5", color: "#fff", fontFamily: "'Baloo 2',sans-serif", fontWeight: 700, fontSize: ".72rem", letterSpacing: ".04em", padding: ".35rem .9rem", borderRadius: 999, marginBottom: ".7rem" }}>
              ★ {category || "Now at the Parks"}
            </span>
            <h2 style={{ fontFamily: "'Pacifico',cursive", fontWeight: 400, fontSize: "clamp(1.8rem,5vw,2.8rem)", lineHeight: 1.05, margin: 0, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,.4)" }}>
              {title}
            </h2>
          </div>
        </div>
      </div>

      {/* ② category pills */}
      <div className="flex" style={{ flexWrap: "wrap", gap: ".5rem", marginBottom: "1.6rem" }}>
        {pills.map((p, i) => {
          const m = pillStyles[i % pillStyles.length];
          return (
            <span key={i} style={{ fontFamily: "'Baloo 2',sans-serif", fontWeight: 600, fontSize: ".78rem", padding: ".4rem .9rem", borderRadius: 999, border: `1.5px solid ${m.border}`, color: m.color, background: m.bg }}>{p}</span>
          );
        })}
      </div>

      {/* ③ intro card */}
      {intro && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderLeft: "4px solid #3aa0ff", borderRadius: 14, padding: "1.3rem 1.5rem", marginBottom: "1.8rem", fontSize: "1.05rem", color: "#cdd4e6" }}>
          <RichContent className={proseClasses}>{stripImages(intro)}</RichContent>
        </div>
      )}

      {/* ④ postcard mosaic */}
      <div className="dx-mosaic" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        {sections.map((section, i) => {
          const c = DX_CARD_COLORS[i % DX_CARD_COLORS.length];
          const wide = i === 0;
          const sectionImg = inlineImages[i] || null;
          return (
            <div key={i} className="dx-card" style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", background: "var(--card)", display: "flex", flexDirection: "column", gridColumn: wide ? "1 / -1" : "auto" }}>
              <div style={{ height: 6, background: c.accent }} />
              {sectionImg ? (
                <div style={{ aspectRatio: wide ? "21 / 8" : "16 / 9", position: "relative", overflow: "hidden", background: "#0c1120" }}>
                  <img src={sectionImg} alt={section.heading} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : null}
              <div style={{ padding: "1.1rem 1.2rem", flex: 1 }}>
                <div style={{ fontFamily: "'Baloo 2',sans-serif", fontWeight: 700, fontSize: ".66rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".4rem", color: c.tier }}>
                  {tags && tags[i] ? tags[i] : `Highlight ${i + 1}`}
                </div>
                <h3 style={{ fontFamily: "'Baloo 2',sans-serif", fontWeight: 700, fontSize: "1.3rem", lineHeight: 1.15, margin: "0 0 .5rem", color: "#fff" }}>{section.heading}</h3>
                <div style={{ color: "#c2cade", fontSize: ".95rem" }}>
                  <RichContent className={proseClasses}>{stripImages(section.body)}</RichContent>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ⑤ ticket-style pull quote */}
      {pullQuote && (
        <div className="flex" style={{ alignItems: "stretch", borderRadius: 14, overflow: "hidden", border: `2px dashed ${GOLD}`, background: "linear-gradient(135deg,rgba(255,207,92,.08),transparent)", margin: "1.5rem 0" }}>
          <div style={{ background: GOLD, color: "#3a2c08", fontFamily: "'Baloo 2',sans-serif", fontWeight: 800, writingMode: "vertical-rl", textOrientation: "mixed", padding: ".8rem .5rem", letterSpacing: ".1em", textTransform: "uppercase", fontSize: ".7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>Admit One</div>
          <blockquote style={{ margin: 0, padding: "1.2rem 1.4rem", fontFamily: "'Baloo 2',sans-serif", fontWeight: 600, fontSize: "1.3rem", lineHeight: 1.3, color: "#fff" }}>"{pullQuote}"</blockquote>
        </div>
      )}

      {/* ♥ collector slot + anti-bounce */}
      <CollectorSpot cardMarketImpact={cardMarketImpact} focusTitle={null} skin="parkpass" cardImageUrl="/manus-storage/sdcc-collectors-corner-topps-mint_c87d70a9.jpg" />
      <a href="/mcu-news" className="grid items-center" style={{ margin: "1.4rem 0 0", border: "1px solid var(--border)", borderRadius: 16, background: "var(--card)", gridTemplateColumns: "1fr auto", gap: "1rem", padding: "1.1rem 1.4rem", textDecoration: "none" }}>
        <span>
          <span style={{ fontFamily: "'Baloo 2',sans-serif", fontWeight: 700, fontSize: ".64rem", letterSpacing: ".14em", textTransform: "uppercase", color: GOLD, display: "block", marginBottom: ".25rem" }}>Plan Your Visit</span>
          <span style={{ fontFamily: "'Baloo 2',sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", lineHeight: 1.2 }}>
            {excerpt ? "More from the experience" : "More from the MCU News desk"}
          </span>
        </span>
        <span style={{ fontSize: "1.4rem", color: "#ff6fb5" }}>→</span>
      </a>

      <style>{`
        @media(max-width:640px){
          .dx-mosaic{ grid-template-columns:1fr !important; }
          .dx-card{ grid-column:auto !important; }
          .parkpass-collector img{ width:100% !important; height:auto !important; }
          .parkpass-collector h4{ font-size:1.2rem !important; }
          .parkpass-collector p{ font-size:.82rem !important; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// TEMPLATE 11: COLLECTOR SPOTLIGHT — Comics & cards deep-dive, amber/gold aesthetic
// ============================================================
export function CollectorSpotlightTemplate({ content, title, featuredImageUrl, tags, excerpt, cardMarketImpact }: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const pullQuote = useMemo(() => extractPullQuote(content), [content]);
  return (
    <div className="space-y-6">
      {/* Collector header — dark gold/amber */}
      <div className="bg-gradient-to-r from-amber-950/60 via-card to-card border border-amber-700/30 rounded-2xl overflow-hidden">
        <div className="grid sm:grid-cols-[1fr_auto] gap-0">
          <div className="p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full mb-4">
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Collector Spotlight</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight mb-3">{title}</h1>
            {excerpt && <p className="text-muted-foreground text-sm leading-relaxed">{excerpt}</p>}
          </div>
          {featuredImageUrl && (
            <div className="sm:w-56 h-48 sm:h-auto overflow-hidden">
              <img src={featuredImageUrl} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
      {cardMarketImpact && (
        <div className="bg-green-950/30 border border-green-700/40 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">Card Market Impact</p>
              <p className="text-sm text-green-100/80 leading-relaxed">{cardMarketImpact}</p>
            </div>
          </div>
        </div>
      )}
      {intro && (
        <div className="bg-card/50 rounded-xl p-6 border border-border">
          <RichContent className={proseClasses}>{stripImages(intro)}</RichContent>
        </div>
      )}
      {pullQuote && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 text-center">
          <Quote className="w-8 h-8 text-amber-500/40 mx-auto mb-3" />
          <p className="text-lg italic text-foreground/80 leading-relaxed max-w-2xl mx-auto">{pullQuote}</p>
        </div>
      )}
      {sections.map((section, i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-lg font-bold text-foreground px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
              {section.heading}
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <RichContent className={proseClasses}>{stripImages(section.body)}</RichContent>
        </div>
      ))}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground mr-1">Topics:</span>
          {tags.map((tag, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// TEMPLATE 12: COMIC STRIP — Comic-book panel layout, bold ink aesthetic
// ============================================================

const INK = "#0c0a12";
const SHADOW = "6px 6px 0 #0c0a12";

function ComicPlaceholder({
  label = "Add Image",
  dims = "1200 × 900",
  icon = "★",
  side = false,
}: { label?: string; dims?: string; icon?: string; side?: boolean }) {
  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center gap-2 text-center select-none ${
        side ? "min-h-[190px]" : "min-h-[130px]"
      }`}
      style={{
        color: "#0c0a12",
        border: "3px dashed rgba(12,10,18,.55)",
        background:
          "repeating-linear-gradient(45deg, rgba(12,10,18,.18) 0 12px, transparent 12px 24px)",
      }}
    >
      <span style={{ fontFamily: "'Bangers', cursive", fontSize: "2.2rem", lineHeight: 1 }}>{icon}</span>
      <span
        style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: ".7rem",
          letterSpacing: ".1em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: ".68rem", fontWeight: 600, opacity: 0.7 }}>{dims}</span>
    </div>
  );
}

function ComicArt({
  imageUrl,
  alt,
  dims,
  icon,
  side = false,
}: {
  imageUrl?: string | null;
  alt: string;
  dims: string;
  icon: string;
  side?: boolean;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={`w-full ${side ? "h-full" : "h-auto"} object-cover`}
        style={{ display: "block" }}
      />
    );
  }
  return <ComicPlaceholder label={alt} dims={dims} icon={icon} side={side} />;
}

export function ComicStripTemplate({ content, title, featuredImageUrl, tags, excerpt }: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const pullQuote = useMemo(() => extractPullQuote(content), [content]);

  const headVariants = [
    { bg: "#aff46d", color: INK, shadow: `2px 2px 0 ${INK}` },
    { bg: "var(--primary)", color: INK, shadow: `2px 2px 0 ${INK}` },
    { bg: "#4db8ff", color: INK, shadow: `2px 2px 0 #fff` },
    { bg: "#ffd23f", color: INK, shadow: `2px 2px 0 ${INK}` },
  ];

  const halftone: React.CSSProperties = {
    backgroundImage: "radial-gradient(#e2a214 1.4px, transparent 1.5px)",
    backgroundSize: "9px 9px",
  };

  const panelBase: React.CSSProperties = {
    border: `4px solid ${INK}`,
    borderRadius: 0,
    background: "var(--card)",
    overflow: "hidden",
    boxShadow: SHADOW,
  };

  const nextIssueHref = "/mcu-news";
  const nextIssueTitleText = excerpt
    ? "Keep reading the next file"
    : "More from the MCU News desk";

  return (
    <div style={{ "--gutter": "14px" } as React.CSSProperties}>
      {/* ISSUE COVER */}
      <div style={{ ...panelBase, marginBottom: 14 }}>
        <div className="grid grid-cols-1 sm:grid-cols-[2.15fr_.85fr]">
          <div style={{ ...halftone, background: "#ffd23f", color: INK, padding: "1.6rem 1.4rem" }}>
            <span
              style={{
                display: "inline-block",
                background: INK,
                color: "#ffd23f",
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: ".62rem",
                letterSpacing: ".14em",
                padding: ".3rem .7rem",
                borderRadius: 3,
                textTransform: "uppercase",
                marginBottom: ".9rem",
              }}
            >
              Collector File
            </span>
            <h2
              style={{
                fontFamily: "'Bangers', cursive",
                letterSpacing: ".02em",
                fontSize: "clamp(2rem,5vw,3.2rem)",
                lineHeight: 0.95,
                margin: "0 0 .8rem",
                color: INK,
                textShadow: "3px 3px 0 #fff",
              }}
            >
              {title}
            </h2>
            {excerpt && (
              <div style={{ fontWeight: 600, fontSize: ".98rem", color: "#3a2e08", lineHeight: 1.45 }}>
                {excerpt}
              </div>
            )}
          </div>
          <div style={{ background: "#e4db5f", minHeight: 230 }}>
            <ComicArt
              imageUrl={featuredImageUrl}
              alt={title}
              dims="1200 × 900 — portrait or action"
              icon="★"
            />
          </div>
        </div>
      </div>

      {/* INTRO CAPTION BOX */}
      {intro && (
        <div style={{ ...panelBase, marginBottom: 14 }}>
          <div
            className="comic-cap"
            style={{
              background: "#f4ef2d",
              color: INK,
              fontWeight: 700,
              padding: "1.25rem 1.4rem",
              fontSize: "1.05rem",
              lineHeight: 1.6,
            }}
          >
            <RichContent className={`${proseClasses} comic-intro-prose`}>{stripImages(intro)}</RichContent>
          </div>
        </div>
      )}

      {/* SECTION PANELS */}
      {sections.map((section, i) => {
        const v = headVariants[i % headVariants.length];
        const imgLeft = i % 2 === 0;
        const isFullRowImage = i % 3 !== 2;

        const head = (
          <div
            style={{
              background: v.bg,
              color: v.color,
              fontFamily: "'Bangers', cursive",
              letterSpacing: ".03em",
              padding: ".55rem 1rem",
              lineHeight: 1.1,
              borderBottom: `4px solid ${INK}`,
              textShadow: v.shadow,
            }}
          >
            {section.heading}
          </div>
        );

        const body = (
          <div style={{ padding: "1.15rem 1.25rem", flex: 1 }}>
            <RichContent className={proseClasses}>{stripImages(section.body)}</RichContent>
          </div>
        );

        const art = (
          <div
            style={{
              ...halftone,
              flex: "0 0 42%",
              borderRight: imgLeft ? `4px solid ${INK}` : undefined,
              borderLeft: imgLeft ? undefined : `4px solid ${INK}`,
            }}
            className="comic-side-art"
          >
            <ComicArt
              imageUrl={null}
              alt={section.heading}
              dims="800 × 800"
              icon="◆"
              side
            />
          </div>
        );

        if (!isFullRowImage) {
          return (
            <div key={i} style={{ ...panelBase, marginBottom: 14, display: "flex", flexDirection: "column" }}>
              {head}
              {body}
            </div>
          );
        }

        return (
          <div
            key={i}
            style={{ ...panelBase, marginBottom: 14 }}
            className="comic-img-row"
          >
            <div className={`flex flex-col sm:flex-row ${imgLeft ? "" : "sm:flex-row-reverse"}`}>
              <div className="flex flex-col flex-1">
                {head}
                {body}
              </div>
              {art}
            </div>
          </div>
        );
      })}

      {/* SPEECH-BUBBLE PULL QUOTE */}
      {pullQuote && (
        <div className="flex justify-center" style={{ margin: "20px 0" }}>
          <div
            style={{
              position: "relative",
              background: "#ffff",
              color: INK,
              border: `4px solid ${INK}`,
              borderRadius: 28,
              padding: "1.4rem 1.8rem",
              maxWidth: "80%",
              textAlign: "center",
              fontFamily: "'Bangers', cursive",
              fontSize: "clamp(1.4vw,3.4vw,2rem)",
              lineHeight: 1.05,
              letterSpacing: ".02em",
              boxShadow: SHADOW,
            }}
          >
            &ldquo;{pullQuote}&rdquo;
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 48,
                bottom: -28,
                width: 30,
                height: 30,
                background: "#ffff",
                borderRight: `4px solid ${INK}`,
                borderBottom: `4px solid ${INK}`,
                transform: "skewX(-18deg)",
              }}
            />
          </div>
        </div>
      )}

      {/* POW DIVIDER + MID-ARTICLE HOOK */}
      <div className="flex items-center" style={{ gap: 14, margin: "20px 0" }}>
        <div
          style={{
            flex: 1,
            height: 4,
            background: "repeating-linear-gradient(90deg,#0c0a12 0 14px,transparent 14px 22px)",
          }}
        />
        <div
          style={{
            fontFamily: "'Bangers', cursive",
            fontSize: "1.5rem",
            color: INK,
            background: "#ffd23f",
            border: `4px solid ${INK}`,
            padding: ".2rem 1rem",
            borderRadius: 4,
            transform: "rotate(-3deg)",
            boxShadow: `4px 4px 0 #0c0a12`,
          }}
        >
          MEANWHILE…
        </div>
        <div
          style={{
            flex: 1,
            height: 4,
            background: "repeating-linear-gradient(90deg,#0c0a12 0 14px,transparent 14px 22px)",
          }}
        />
      </div>

      {/* NEXT ISSUE HOOK */}
      <a
        href={nextIssueHref}
        className="grid items-center no-underline"
        style={{
          gridTemplateColumns: "auto 1fr auto",
          gap: "1rem",
          border: `4px solid ${INK}`,
          borderRadius: 4,
          background: INK,
          boxShadow: SHADOW,
          padding: "1rem 1.5rem",
          margin: "20px 0",
        }}
      >
        <span
          style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: ".62rem",
            letterSpacing: ".14em",
            color: "#ffd23f",
            textTransform: "uppercase",
          }}
        >
          Next Issue
        </span>
        <span
          style={{
            fontFamily: "'Bangers', cursive",
            fontSize: "1.35rem",
            color: "#ffff",
            lineHeight: 1.05,
            letterSpacing: ".02em",
          }}
        >
          {nextIssueTitleText}
        </span>
        <span style={{ fontFamily: "'Bangers', cursive", fontSize: "2rem", color: "var(--primary)" }}>
          »
        </span>
      </a>

      {/* TAGS */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: `2px solid ${INK}` }}>
          {tags.map((tag, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: ".65rem",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                background: INK,
                color: "#ffd23f",
                padding: ".25rem .6rem",
                borderRadius: 2,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Scoped CSS */}
      <style>{`
        .comic-intro-prose p:first-of-type::first-letter {
          font-family: 'Bangers', cursive;
          font-size: 3.4rem;
          line-height: .8;
          float: left;
          margin: .35rem .35rem -.2rem 0;
          color: #eff4d4;
        }
        .comic-intro-prose p { color: #0c0a12 !important; }
        @media (min-width: 640px) { .comic-side-art { min-height: 190px; } }
        @media (min-width: 640px) { .comic-img-row .comic-side-art { min-height: 100%; } }
      `}</style>
    </div>
  );
}

// ============================================================
// TEMPLATE SELECTOR — Returns the correct template component
// ============================================================
export type ArticleTemplate = 'classic' | 'magazine' | 'spotlight' | 'timeline' | 'listicle' | 'patriotic' | 'cinematic' | 'dossier' | 'character_profile' | 'disney_experience' | 'collector_spotlight' | 'comic_strip';

/**
 * 10-template rotation order for MCU News articles.
 * Cycles deterministically based on article ID so each article always gets the same template.
 * Patriotic is excluded from rotation (reserved for special occasions like Memorial Day).
 */
const ROTATION_TEMPLATES: ArticleTemplate[] = [
  'classic',             // position 0
  'magazine',            // position 1
  'spotlight',           // position 2
  'timeline',            // position 3
  'listicle',            // position 4
  'cinematic',           // position 5
  'dossier',             // position 6
  'character_profile',   // position 7
  'disney_experience',   // position 8
  'comic_strip',        // position 9
];

/**
 * Determines the article template to use.
 * - If templateLayout is explicitly set to a non-default template (patriotic, cinematic, etc.), use it.
 * - If articleId is provided, auto-rotate through 10 templates based on ID.
 * - Patriotic is never auto-assigned (only manually set for special articles).
 */
export const ALL_TEMPLATE_NAMES: Record<ArticleTemplate, string> = {
  classic: 'Classic',
  magazine: 'Magazine',
  spotlight: 'Spotlight',
  timeline: 'Timeline',
  listicle: 'Listicle',
  patriotic: 'Patriotic',
  cinematic: 'Cinematic',
  dossier: 'Dossier',
  character_profile: 'Character Profile',
  disney_experience: 'Disney Experience',
  collector_spotlight: 'Collector Spotlight',
  comic_strip: 'Comic Strip',
};
export function getArticleTemplate(
  templateLayout: ArticleTemplate | null | undefined,
  _articleId?: number
): ArticleTemplate {
  // The stored templateLayout is the source of truth.
  // Template rotation is determined at publish time and stored in the DB.
  // The renderer ALWAYS respects whatever template was assigned.
  if (templateLayout && ROTATION_TEMPLATES.includes(templateLayout)) {
    return templateLayout;
  }
  if (templateLayout === 'patriotic' || templateLayout === 'collector_spotlight') {
    return templateLayout;
  }
  // Fallback for legacy articles with no stored template
  return templateLayout || 'classic';
}

/**
 * Determines the next template in rotation based on the last published article's template.
 * Call this server-side when publishing a new article to get the correct next template.
 */
export function getNextTemplateInRotation(lastTemplate: ArticleTemplate | null | undefined): ArticleTemplate {
  if (!lastTemplate) return ROTATION_TEMPLATES[0];
  const lastIndex = ROTATION_TEMPLATES.indexOf(lastTemplate);
  if (lastIndex === -1) return ROTATION_TEMPLATES[0];
  return ROTATION_TEMPLATES[(lastIndex + 1) % ROTATION_TEMPLATES.length];
}

export function ArticleTemplateRenderer({ template, ...props }: TemplateProps & { template: ArticleTemplate }) {
  switch (template) {
    case 'magazine':
      return <MagazineTemplate {...props} />;
    case 'spotlight':
      return <SpotlightTemplate {...props} />;
    case 'timeline':
      return <TimelineTemplate {...props} />;
    case 'listicle':
      return <ListicleTemplate {...props} />;
    case 'patriotic':
      return <PatrioticTemplate {...props} />;
    case 'cinematic':
      return <CinematicTemplate {...props} />;
    case 'dossier':
      return <DossierTemplate {...props} />;
    case 'character_profile':
      return <CharacterProfileTemplate {...props} />;
    case 'disney_experience':
      return <DisneyExperienceTemplate {...props} />;
    case 'collector_spotlight':
      return <CollectorSpotlightTemplate {...props} />;
    case 'comic_strip':
      return <ComicStripTemplate {...props} />;
    case 'classic':
    default:
      return <ClassicTemplate {...props} />;
  }
}
