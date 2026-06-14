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
import { TrendingUp, Star, Calendar, Hash, Zap, Award, Target, Flame, BookOpen, Quote, Shield, Flag, FileText, Eye, ArrowLeft, Share2, Clock, User } from "lucide-react";
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
// TEMPLATE 1: CLASSIC (current layout — kept as default)
// ============================================================
export function ClassicTemplate({ content }: TemplateProps) {
  return (
    <RichContent className={proseClasses}>{content}</RichContent>
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
// TEMPLATE 7: CINEMATIC — Full-bleed hero, dark moody, film-strip feel
// ============================================================
export function CinematicTemplate({ content, title, featuredImageUrl, excerpt }: TemplateProps) {
  const { intro, sections } = useMemo(() => splitBySections(content), [content]);
  const pullQuote = useMemo(() => extractPullQuote(content), [content]);

  return (
    <div className="space-y-0 -mx-4 sm:-mx-8">
      {/* Full-bleed hero with cinematic aspect ratio */}
      {featuredImageUrl && (
        <div className="relative w-full aspect-[21/9] mb-12 overflow-hidden">
          <img src={featuredImageUrl} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-black/60" />
          {/* Film grain overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />
          {/* Film strip perforations */}
          <div className="absolute top-0 left-0 right-0 h-6 flex items-center justify-between px-4 opacity-30">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-sm bg-black border border-white/20" />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-between px-4 opacity-30">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-sm bg-black border border-white/20" />
            ))}
          </div>
        </div>
      )}

      <div className="px-4 sm:px-8">
        {/* Cinematic intro — centered, dramatic */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <RichContent className={`${proseClasses} text-xl leading-loose prose-p:text-foreground/80 text-center`}>{intro}</RichContent>
        </div>

        {/* Sections as cinematic "scenes" */}
        {sections.map((section, i) => (
          <div key={i} className="mb-16">
            {/* Scene marker */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-muted-foreground/30" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground/60">
                Scene {String(i + 1).padStart(2, '0')}
              </span>
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-muted-foreground/30" />
            </div>

            {/* Section title — large, cinematic */}
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-foreground leading-tight">
              {section.heading}
            </h2>

            {/* Content with max-width for readability */}
            <div className="max-w-3xl mx-auto">
              <RichContent className={`${proseClasses} prose-p:text-lg`}>{section.body}</RichContent>
            </div>

            {/* Dramatic pull quote after first section */}
            {i === 0 && pullQuote && (
              <div className="max-w-2xl mx-auto my-12 text-center">
                <div className="text-4xl text-muted-foreground/20 mb-2">"</div>
                <blockquote className="text-2xl sm:text-3xl font-light italic text-foreground/80 leading-relaxed">
                  {pullQuote}
                </blockquote>
                <div className="text-4xl text-muted-foreground/20 mt-2 rotate-180">"</div>
              </div>
            )}
          </div>
        ))}
      </div>
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
// TEMPLATE SELECTOR — Returns the correct template component
// ============================================================
export type ArticleTemplate = 'classic' | 'magazine' | 'spotlight' | 'timeline' | 'listicle' | 'patriotic' | 'cinematic' | 'dossier';

/**
 * 7-template rotation order for MCU News articles.
 * Cycles deterministically based on article ID so each article always gets the same template.
 * Patriotic is excluded from rotation (reserved for special occasions like Memorial Day).
 */
const ROTATION_TEMPLATES: ArticleTemplate[] = [
  'classic',    // position 0
  'magazine',   // position 1
  'spotlight',  // position 2
  'timeline',   // position 3
  'listicle',   // position 4
  'cinematic',  // position 5
  'dossier',    // position 6
];

/**
 * Determines the article template to use.
 * - If templateLayout is explicitly set to a non-default template (patriotic, cinematic, etc.), use it.
 * - If articleId is provided, auto-rotate through 7 templates based on ID.
 * - Patriotic is never auto-assigned (only manually set for special articles).
 */
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
    case 'classic':
    default:
      return <ClassicTemplate {...props} />;
  }
}
