/**
 * Article Template Layouts — 5 different visual styles for article rendering
 * Each template is designed for SEO (heavy word count, structured headings, internal links)
 * and visual variety (different image placements, text arrangements, sidebars)
 * 
 * Templates:
 * 1. Classic — Current layout (hero image top, linear content flow)
 * 2. Magazine — Pull quotes, side images, multi-column feel
 * 3. Spotlight — Character/topic focus with stats sidebar, card gallery
 * 4. Timeline — Visual timeline with event markers and milestones
 * 5. Listicle — Numbered entries with card thumbnails, comparison sections
 */

import { useMemo } from "react";
import { Streamdown } from "streamdown";
import { TrendingUp, Star, Calendar, Hash, Zap, Award, Target, Flame, BookOpen, Quote } from "lucide-react";

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
  const boldMatch = content.match(/\*\*([^*]{20,100})\*\*/);
  if (boldMatch) return boldMatch[1];
  
  // Fallback: find a short impactful sentence
  const sentences = content.split(/\.\s+/);
  const impactful = sentences.find(s => s.length > 40 && s.length < 120 && !s.includes('http'));
  return impactful ? impactful + '.' : '';
}

// ============================================================
// TEMPLATE 1: CLASSIC (current layout — kept as default)
// ============================================================
export function ClassicTemplate({ content }: TemplateProps) {
  return (
    <div className={proseClasses}>
      <Streamdown>{content}</Streamdown>
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
        <div className={`${proseClasses} text-xl leading-relaxed`}>
          <Streamdown>{intro}</Streamdown>
        </div>
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
        <div key={i} className={`py-8 ${i % 2 === 0 ? '' : 'bg-card/30 -mx-4 px-4 sm:-mx-8 sm:px-8 rounded-2xl'}`}>
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
          <div className={`${proseClasses} pl-4 border-l-2 border-border/50`}>
            <Streamdown>{section.body}</Streamdown>
          </div>

          {/* Inline market callout for every 3rd section */}
          {i === 2 && cardMarketImpact && (
            <div className="mt-8 p-5 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-400 text-sm uppercase tracking-wider mb-1">Market Signal</h4>
                  <p className="text-muted-foreground text-sm">{cardMarketImpact}</p>
                </div>
              </div>
            </div>
          )}
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
      {/* Spotlight Hero — Full-width with overlay text */}
      {featuredImageUrl && (
        <div className="relative -mx-4 sm:-mx-8 rounded-2xl overflow-hidden mb-10">
          <img src={featuredImageUrl} alt={title} className="w-full h-64 sm:h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className={`${proseClasses} text-lg`}>
              <Streamdown>{intro.slice(0, 500)}</Streamdown>
            </div>
          </div>
        </div>
      )}

      {/* Two-column layout: Main content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Main content column */}
        <div className="space-y-10">
          {!featuredImageUrl && (
            <div className={`${proseClasses} text-lg`}>
              <Streamdown>{intro}</Streamdown>
            </div>
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
              <div className={`${proseClasses} ml-12`}>
                <Streamdown>{section.body}</Streamdown>
              </div>
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

            {/* Market Impact Card */}
            {cardMarketImpact && (
              <div className="bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-5">
                <h3 className="font-bold text-sm uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Market Impact
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cardMarketImpact}</p>
              </div>
            )}

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
        <div className={`${proseClasses} text-lg`}>
          <Streamdown>{intro}</Streamdown>
        </div>
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
                  <div className={proseClasses}>
                    <Streamdown>{section.body}</Streamdown>
                  </div>
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

      {/* Market Impact — Timeline end marker */}
      {cardMarketImpact && (
        <div className="relative pl-0 sm:pl-16">
          <div className="absolute left-3 top-2 w-7 h-7 rounded-full border-2 border-emerald-500 bg-emerald-500/20 flex items-center justify-center hidden sm:flex">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Collector's Market Outlook
            </h3>
            <p className="text-muted-foreground">{cardMarketImpact}</p>
          </div>
        </div>
      )}
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
        <div className={`${proseClasses} text-lg border-b border-border/50 pb-8`}>
          <Streamdown>{intro}</Streamdown>
        </div>
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
                <div className={proseClasses}>
                  <Streamdown>{section.body}</Streamdown>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className={`h-1 w-full ${badgeClass.split(' ')[0]} opacity-50`} />
            </div>
          );
        })}
      </div>

      {/* Summary card at bottom */}
      {cardMarketImpact && (
        <div className="bg-card border-2 border-primary/30 rounded-xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground mb-2">The Bottom Line for Collectors</h3>
              <p className="text-muted-foreground leading-relaxed">{cardMarketImpact}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TEMPLATE SELECTOR — Returns the correct template component
// ============================================================
export type ArticleTemplate = 'classic' | 'magazine' | 'spotlight' | 'timeline' | 'listicle';

export function getArticleTemplate(templateLayout: ArticleTemplate | null | undefined): ArticleTemplate {
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
    case 'classic':
    default:
      return <ClassicTemplate {...props} />;
  }
}
