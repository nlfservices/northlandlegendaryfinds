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
  const imgRegex = /!\[.*?\]\((.*?)\)/g;
  const images: string[] = [];
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    images.push(match[1]);
  }
  return images;
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
      <figure style={{ margin: "0 0 2.2rem" }}>
        <div style={{ aspectRatio: "3 / 2", background: "#0c0d11", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
          {featuredImageUrl ? (
            <img src={featuredImageUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".4rem", color: "#565b66", background: "repeating-linear-gradient(135deg,#121419 0 16px,#0e1014 16px 32px)" }}>
              <span style={{ fontSize: "1.8rem" }}>▭</span>
              <span style={{ fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", fontSize: ".74rem" }}>Lead Image — Add</span>
              <span style={{ fontSize: ".66rem", opacity: 0.65 }}>1200 × 800 · 3:2</span>
            </div>
          )}
        </div>
        <figcaption style={{ fontSize: ".78rem", color: "var(--muted-foreground)", marginTop: ".6rem", lineHeight: 1.5, paddingLeft: ".8rem", borderLeft: `2px solid ${CI_RULE}` }}>
          {title}
        </figcaption>
      </figure>

      {/* ③ body */}
      <div className="ci-body" style={{ fontSize: "1.08rem", color: "#d2d5dd" }}>
        {intro && <RichContent className={`${proseClasses} ci-intro-prose`}>{intro}</RichContent>}

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

            <RichContent className={proseClasses}>{section.body}</RichContent>

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
                <CollectorSpot cardMarketImpact={cardMarketImpact} focusTitle={null} skin="editorial" />
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
export function MagazineTemplate({ content, title, featuredImageUrl, cardMarketImpact }: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const pullQuote = useMemo(() => extractPullQuote(content), [content]);

  return (
    <div className="space-y-0">
      {/* Magazine-style intro with large drop cap feel */}
      <div className="relative mb-12">
        <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full hidden lg:block" />
        <RichContent className={`${proseClasses} text-base sm:text-xl leading-relaxed [&_div]:mx-auto [&_img]:mx-auto`}>{intro}</RichContent>
      </div>

      {/* Pull Quote — Magazine style */}
      {pullQuote && (
        <div className="my-12 py-8 px-6 sm:px-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl" />
          <div className="absolute left-6 top-4 opacity-20">
            <Quote className="w-12 h-12 text-primary" />
          </div>
          <blockquote className="relative text-2xl sm:text-3xl font-bold text-foreground leading-snug italic text-center px-8">
            "{pullQuote}"
          </blockquote>
          <div className="h-1 w-20 bg-primary mx-auto mt-6 rounded-full" />
        </div>
      )}

      {/* Sections with alternating layouts */}
      {sections.map((section, i) => (
        <div key={i} className={`py-8 ${i % 2 === 0 ? '' : 'bg-card/30 -mx-2 px-2 sm:-mx-8 sm:px-8 rounded-2xl'}`}>
          {/* Section heading with decorative element */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              i % 3 === 0 ? 'bg-primary/20 text-primary' :
              i % 3 === 1 ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {i % 3 === 0 ? <Flame className="w-5 h-5" /> :
               i % 3 === 1 ? <Star className="w-5 h-5" /> :
               <Zap className="w-5 h-5" />}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{section.heading}</h2>
          </div>

          {/* Content with side accent */}
          <RichContent className={`${proseClasses} sm:pl-4 sm:border-l-2 border-border/50 [&_div]:mx-auto [&_img]:mx-auto`}>{section.body}</RichContent>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// TEMPLATE 3: SPOTLIGHT — Character/topic focus with stats sidebar
// ============================================================
export function SpotlightTemplate({ content, title, featuredImageUrl, tags, cardMarketImpact }: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);

  // Extract character names from tags for the spotlight sidebar
  const characters = tags?.slice(0, 6) || [];

  return (
    <div className="space-y-8">
      {/* Spotlight Hero — Full-width image */}
      {featuredImageUrl && (
        <div className="relative -mx-4 sm:-mx-8 rounded-2xl overflow-hidden mb-10">
          <img src={featuredImageUrl} alt={title} className="w-full h-64 sm:h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      )}

      {/* Two-column layout: Main content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Main content column */}
        <div className="space-y-10">
          {intro && (
            <RichContent className={`${proseClasses} text-lg`}>{intro}</RichContent>
          )}

          {sections.map((section, i) => (
            <div key={i} className="relative">
              {/* Numbered section marker */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">{section.heading}</h2>
              </div>
              <RichContent className={`${proseClasses} ml-12`}>{section.body}</RichContent>
            </div>
          ))}
        </div>

        {/* Sticky Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {/* Character/Topic Quick Stats */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold text-sm uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Key Characters
              </h3>
              <div className="space-y-2">
                {characters.map((char, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-bold">{char.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium">{char}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                In This Article
              </h3>
              <nav className="space-y-1">
                {sections.slice(0, 8).map((section, i) => (
                  <div key={i} className="text-xs text-muted-foreground py-1.5 border-b border-border/30 last:border-0 truncate">
                    {section.heading}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ============================================================
// TEMPLATE 4: TIMELINE — Visual timeline with event markers
// ============================================================
export function TimelineTemplate({ content, title, cardMarketImpact }: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);

  const timelineColors = [
    'border-primary bg-primary/20 text-primary',
    'border-yellow-500 bg-yellow-500/20 text-yellow-400',
    'border-purple-500 bg-purple-500/20 text-purple-400',
    'border-cyan-500 bg-cyan-500/20 text-cyan-400',
    'border-red-500 bg-red-500/20 text-red-400',
    'border-emerald-500 bg-emerald-500/20 text-emerald-400',
  ];

  return (
    <div className="space-y-8">
      {/* Intro with large text */}
      <div className="relative pb-8 border-b border-border/50">
        <RichContent className={`${proseClasses} text-lg`}>{intro}</RichContent>
      </div>

      {/* Timeline Layout */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden sm:block" />

        <div className="space-y-0">
          {sections.map((section, i) => {
            const colorClass = timelineColors[i % timelineColors.length];
            return (
              <div key={i} className="relative pl-0 sm:pl-16 pb-10">
                {/* Timeline node */}
                <div className={`absolute left-3 top-2 w-7 h-7 rounded-full border-2 flex items-center justify-center hidden sm:flex ${colorClass}`}>
                  <span className="text-[10px] font-bold">{i + 1}</span>
                </div>

                {/* Mobile indicator */}
                <div className={`sm:hidden inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-3 ${colorClass}`}>
                  <span>Part {i + 1}</span>
                </div>

                {/* Content card */}
                <div className={`bg-card/50 border border-border/50 rounded-xl p-6 sm:p-8 hover:border-border transition-colors ${
                  i % 2 === 0 ? '' : 'bg-card/30'
                }`}>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${colorClass.split(' ')[1]}`} />
                    {section.heading}
                  </h2>
                  <RichContent className={proseClasses}>{section.body}</RichContent>
                </div>

                {/* Connector line for mobile */}
                {i < sections.length - 1 && (
                  <div className="sm:hidden w-0.5 h-6 bg-border/50 ml-6 mt-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TEMPLATE 5: LISTICLE — Numbered entries with visual cards
// ============================================================
export function ListicleTemplate({ content, title, tags, cardMarketImpact }: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);

  const rankColors = [
    'from-yellow-500/20 to-yellow-500/5 border-yellow-500/40',
    'from-purple-500/20 to-purple-500/5 border-purple-500/40',
    'from-cyan-500/20 to-cyan-500/5 border-cyan-500/40',
    'from-red-500/20 to-red-500/5 border-red-500/40',
    'from-emerald-500/20 to-emerald-500/5 border-emerald-500/40',
    'from-blue-500/20 to-blue-500/5 border-blue-500/40',
    'from-orange-500/20 to-orange-500/5 border-orange-500/40',
    'from-pink-500/20 to-pink-500/5 border-pink-500/40',
  ];

  const rankBadgeColors = [
    'bg-yellow-500 text-black',
    'bg-purple-500 text-white',
    'bg-cyan-500 text-black',
    'bg-red-500 text-white',
    'bg-emerald-500 text-black',
    'bg-blue-500 text-white',
    'bg-orange-500 text-black',
    'bg-pink-500 text-white',
  ];

  return (
    <div className="space-y-8">
      {/* Listicle intro with count badge */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="px-4 py-2 bg-primary/20 border border-primary/40 rounded-full">
            <span className="text-sm font-bold text-primary">{sections.length} Sections</span>
          </div>
          {tags && tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.slice(0, 4).map(tag => (
                <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <RichContent className={`${proseClasses} text-lg border-b border-border/50 pb-8`}>{intro}</RichContent>
      </div>

      {/* Listicle entries as visual cards */}
      <div className="space-y-6">
        {sections.map((section, i) => {
          const colorClass = rankColors[i % rankColors.length];
          const badgeClass = rankBadgeColors[i % rankBadgeColors.length];
          return (
            <div key={i} className={`relative bg-gradient-to-r ${colorClass} border rounded-xl overflow-hidden`}>
              {/* Rank badge */}
              <div className="absolute top-0 left-0">
                <div className={`${badgeClass} px-4 py-2 rounded-br-xl font-bold text-lg`}>
                  #{i + 1}
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-14 sm:pt-8 sm:pl-20">
                {/* Section heading */}
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 leading-tight">
                  {section.heading}
                </h2>

                {/* Content */}
                <RichContent className={proseClasses}>{section.body}</RichContent>
              </div>

              {/* Bottom accent line */}
              <div className={`h-1 w-full ${badgeClass.split(' ')[0]} opacity-50`} />
            </div>
          );
        })}
      </div>
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
          <RichContent className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-xl prose-a:text-[#6B8FD4] prose-strong:text-white prose-blockquote:border-[#B22234] prose-blockquote:text-gray-300 prose-img:rounded-lg">{intro}</RichContent>
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
                        <img src={sectionImage} alt={section.heading} className="w-full h-auto object-cover" />
                      </div>
                      <RichContent className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-[#6B8FD4] prose-strong:text-white prose-blockquote:border-[#B22234] prose-blockquote:text-gray-400 prose-img:rounded-lg">{sectionBody}</RichContent>
                    </>
                  ) : (
                    <>
                      <RichContent className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-[#6B8FD4] prose-strong:text-white prose-blockquote:border-[#B22234] prose-blockquote:text-gray-400 prose-img:rounded-lg">{sectionBody}</RichContent>
                      <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#3C3B6E]/30">
                        <img src={sectionImage} alt={section.heading} className="w-full h-auto object-cover" />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <RichContent className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-[#6B8FD4] prose-strong:text-white prose-blockquote:border-[#B22234] prose-blockquote:text-gray-400 prose-img:rounded-lg">{sectionBody}</RichContent>
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

type CollectorSkin = "cinematic" | "comic" | "editorial" | "default";

function CollectorSpot({
  cardMarketImpact,
  focusTitle,
  skin = "default",
}: {
  cardMarketImpact?: string | null;
  focusTitle?: string | null;
  skin?: CollectorSkin;
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
            <div
              style={{
                width: 90,
                height: 120,
                flexShrink: 0,
                background:
                  "repeating-linear-gradient(45deg,#16161f 0 10px,#101018 10px 20px)",
                border: "1px solid #3a4a5a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6a6a7a",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: ".56rem",
                textAlign: "center",
              }}
            >
              CARD IMG
            </div>
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
          <div
            style={{
              width: 74,
              height: 100,
              flexShrink: 0,
              border: "1px solid #2e333d",
              background: "repeating-linear-gradient(135deg,#181b22 0 9px,#13151b 9px 18px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666c78",
              fontSize: ".54rem",
              textAlign: "center",
            }}
          >
            CARD IMG
          </div>
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: ".4rem",
            color: "#5a5a6a",
            background: "repeating-linear-gradient(45deg,#0e0e16 0 22px,#0a0a10 22px 44px)",
          }}
        >
          <span style={{ fontSize: "1.6rem" }}>▦</span>
          <span style={{ fontFamily: "'Oswald',sans-serif", letterSpacing: ".2em", textTransform: "uppercase", fontSize: ".74rem" }}>
            Scene Still — Add Image
          </span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".66rem", opacity: 0.6 }}>1600 × 700</span>
        </div>
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
          <RichContent className={`${proseClasses} cine-intro-prose`}>{intro}</RichContent>
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
              <RichContent className={proseClasses}>{section.body}</RichContent>
            </div>
          </div>

          {/* still after first scene */}
          {i === 0 && <CineStill imageUrl={null} caption="FIG. 01 — Add a scene still." alt={section.heading} />}

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
              <CollectorSpot cardMarketImpact={cardMarketImpact} focusTitle={null} skin="cinematic" />
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
// TEMPLATE 8: DOSSIER — Intel briefing, classified look, data panels
// ============================================================
export function DossierTemplate({ content, title, featuredImageUrl, tags, excerpt }: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);

  return (
    <div className="space-y-6 font-mono">
      {/* Classified header bar */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Intelligence Briefing</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-yellow-400/60" />
          <span className="text-xs text-yellow-400/60">EYES ONLY</span>
        </div>
      </div>

      {/* Subject line */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <span className="text-muted-foreground uppercase tracking-wider">Subject:</span>
          <span className="text-foreground font-bold">{title}</span>
          {tags && tags.length > 0 && (
            <>
              <span className="text-muted-foreground uppercase tracking-wider">Tags:</span>
              <span className="text-primary">{tags.join(' / ')}</span>
            </>
          )}
          {excerpt && (
            <>
              <span className="text-muted-foreground uppercase tracking-wider">Summary:</span>
              <span className="text-muted-foreground">{excerpt}</span>
            </>
          )}
        </div>
      </div>

      {/* Featured image as "attached evidence" */}
      {featuredImageUrl && (
        <div className="border border-dashed border-border rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Attached: Visual Reference</div>
          <img src={featuredImageUrl} alt={title} className="w-full h-auto rounded-lg" />
        </div>
      )}

      {/* Intro as "executive summary" */}
      <div className="bg-card/50 border border-border rounded-lg p-6">
        <h3 className="text-sm uppercase tracking-wider text-primary mb-4 font-bold">Executive Summary</h3>
        <RichContent className={`${proseClasses} font-sans`}>{intro}</RichContent>
      </div>

      {/* Sections as "intelligence sections" */}
      {sections.map((section, i) => (
        <div key={i} className="border border-border rounded-lg overflow-hidden">
          {/* Section header bar */}
          <div className="bg-muted/50 px-5 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground uppercase tracking-wide">
              {section.heading}
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Section {String(i + 1).padStart(2, '0')}
            </span>
          </div>
          {/* Section content */}
          <div className="p-5 sm:p-6">
            <RichContent className={`${proseClasses} font-sans`}>{section.body}</RichContent>
          </div>
        </div>
      ))}

      {/* End of briefing */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-muted-foreground/20 rounded-full">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">End of Briefing</span>
        </div>
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
              <RichContent className={proseClasses}>{intro}</RichContent>
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
              <RichContent className={proseClasses}>{section.body}</RichContent>
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
// TEMPLATE 10: DISNEY EXPERIENCE — Parks + Disney+ explorer, vibrant adventure
// ============================================================
export function DisneyExperienceTemplate({ content, title, featuredImageUrl, tags, excerpt, category }: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const sectionColors = [
    { bg: 'from-blue-500/10 to-transparent', border: 'border-blue-500/30', num: 'bg-blue-500/20 text-blue-300' },
    { bg: 'from-purple-500/10 to-transparent', border: 'border-purple-500/30', num: 'bg-purple-500/20 text-purple-300' },
    { bg: 'from-pink-500/10 to-transparent', border: 'border-pink-500/30', num: 'bg-pink-500/20 text-pink-300' },
    { bg: 'from-green-500/10 to-transparent', border: 'border-green-500/30', num: 'bg-green-500/20 text-green-300' },
    { bg: 'from-yellow-500/10 to-transparent', border: 'border-yellow-500/30', num: 'bg-yellow-500/20 text-yellow-300' },
  ];
  return (
    <div className="space-y-6">
      {/* Vibrant header */}
      <div className="relative overflow-hidden rounded-2xl">
        {featuredImageUrl ? (
          <img src={featuredImageUrl} alt={title} className="w-full h-64 sm:h-80 object-cover" />
        ) : (
          <div className="w-full h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {category.includes('disney_parks') && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/30 border border-blue-400/50 rounded-full text-blue-300 text-xs font-bold">
                <Ticket className="w-3 h-3" /> Disney Parks
              </span>
            )}
            {category.includes('disney_plus') && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/30 border border-purple-400/50 rounded-full text-purple-300 text-xs font-bold">
                <Tv className="w-3 h-3" /> Disney+
              </span>
            )}
            {!category.includes('disney_parks') && !category.includes('disney_plus') && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-500/30 border border-pink-400/50 rounded-full text-pink-300 text-xs font-bold">
                <Sparkles className="w-3 h-3" /> Marvel Experience
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{title}</h1>
        </div>
      </div>
      {intro && (
        <div className="border-l-4 border-blue-500 pl-6 py-2">
          <RichContent className={proseClasses}>{intro}</RichContent>
        </div>
      )}
      {sections.map((section, i) => {
        const c = sectionColors[i % sectionColors.length];
        return (
          <div key={i} className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full ${c.num} flex items-center justify-center flex-shrink-0`}>
                <span className="text-sm font-black">{i + 1}</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">{section.heading}</h2>
            </div>
            <RichContent className={proseClasses}>{section.body}</RichContent>
          </div>
        );
      })}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          {tags.map((tag, i) => (
            <span key={i} className="text-xs px-3 py-1 bg-muted text-muted-foreground rounded-full">{tag}</span>
          ))}
        </div>
      )}
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
          <RichContent className={proseClasses}>{intro}</RichContent>
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
          <RichContent className={proseClasses}>{section.body}</RichContent>
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
            <RichContent className={`${proseClasses} comic-intro-prose`}>{intro}</RichContent>
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
            <RichContent className={proseClasses}>{section.body}</RichContent>
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
  articleId?: number
): ArticleTemplate {
  // If explicitly set to patriotic, always respect it (special occasion template)
  if (templateLayout === 'patriotic') {
    return 'patriotic';
  }
  
  // If we have an article ID, auto-rotate through 7 templates
  if (articleId) {
    const index = (articleId - 1) % ROTATION_TEMPLATES.length;
    return ROTATION_TEMPLATES[index];
  }
  
  // Fallback for when no articleId is available
  return templateLayout || 'classic';
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
