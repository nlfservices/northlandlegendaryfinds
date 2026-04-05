/**
 * ORDER 66 — Blog Layout Engine v1.5
 * 12 distinct layout templates for blog posts.
 * Each template renders the same blog data in a unique visual layout.
 */

import { useState, useEffect, useRef } from "react";
import { Streamdown } from "streamdown";
import type { LayoutData } from "@/lib/blogLayoutTypes";
import {
  PullQuote, FactBox, StatCounters, ComparisonTableView,
  Timeline, StickyTOC, LightboxGallery, ProfileCard,
  AlertBanner, HeatBadge, ArticleMetadata, BackToBlog,
  TagsSection, BlogNewsletter, RelatedArticlesCarousel, GreenDivider,
} from "./BlogSharedElements";
import {
  SocialShareInline, SocialShareFloating, SocialShareBottomBar,
} from "@/components/SocialShareButtons";

/* ------------------------------------------------------------------ */
/*  COMMON PROPS                                                       */
/* ------------------------------------------------------------------ */
interface TemplateProps {
  post: any;
  layoutData: LayoutData;
  tags: string[];
  relatedPosts: any[];
  shareUrl: string;
  formattedDate: string;
}

/** Split markdown content into paragraphs for interleaving with design elements */
function splitContent(markdown: string): string[] {
  // Split on double newlines (paragraph boundaries)
  return markdown.split(/\n\n+/).filter(Boolean);
}

/** Render markdown prose block */
function Prose({ content, className = "" }: { content: string; className?: string }) {
  return (
    <div className={`prose prose-invert prose-lg max-w-none
      prose-headings:font-bold prose-headings:tracking-tight prose-headings:uppercase
      prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
      prose-p:leading-relaxed
      prose-a:text-[#00ff41] prose-a:no-underline hover:prose-a:underline
      prose-strong:text-[#e8f5e0]
      prose-img:rounded-xl prose-img:border prose-img:border-[#2a2a40]
      prose-blockquote:border-[#00ff41] prose-blockquote:bg-[#00ff41]/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1
      prose-li:text-[#c0d8b8]
      prose-code:text-[#00ff41] prose-code:bg-[#00ff41]/10 prose-code:rounded prose-code:px-1
      ${className}`}
      style={{ color: "#c0d8b8" }}>
      <Streamdown>{content}</Streamdown>
    </div>
  );
}

/** Common wrapper for all templates */
function TemplateWrapper({ children, post, tags, relatedPosts, shareUrl }: {
  children: React.ReactNode;
  post: any;
  tags: string[];
  relatedPosts: any[];
  shareUrl: string;
}) {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a14", color: "#e8f5e0" }}>
      <SocialShareFloating url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />
      <div className="container max-w-5xl py-8 px-4">
        {children}
        <SocialShareBottomBar url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />
        <TagsSection tags={tags} />
        <BlogNewsletter />
        <RelatedArticlesCarousel posts={relatedPosts} />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  TEMPLATE 1: FIELD REPORT — Image-left / text-right split          */
/* ================================================================== */
export function Template1_FieldReport({ post, layoutData, tags, relatedPosts, shareUrl, formattedDate }: TemplateProps) {
  const paragraphs = splitContent(post.contentMarkdown || "");
  const firstTwo = paragraphs.slice(0, 2).join("\n\n");
  const rest = paragraphs.slice(2).join("\n\n");

  return (
    <TemplateWrapper post={post} tags={tags} relatedPosts={relatedPosts} shareUrl={shareUrl}>
      <BackToBlog />
      <ArticleMetadata date={formattedDate} readTime={post.readTimeMinutes || 5}
        category={post.category} author={post.authorName || "NLF Team"} heatLevel={layoutData.heatLevel} />

      {/* Two-column hero */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Sticky image left */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          {(layoutData.contentImage || post.featuredImageUrl) && (
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(0,255,65,0.2)" }}>
              <img src={layoutData.contentImage || post.featuredImageUrl} alt={post.title}
                className="w-full aspect-[4/3] object-cover" />
            </div>
          )}
        </div>
        {/* Title + opening text right */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-4"
            style={{ fontFamily: "Anton, sans-serif" }}>
            {post.title}
          </h1>
          {post.excerpt && <p className="text-lg mb-6" style={{ color: "#c0d8b8" }}>{post.excerpt}</p>}
          <SocialShareInline url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />
          <GreenDivider />
          <Prose content={firstTwo} />
        </div>
      </div>

      {/* Single column below */}
      {layoutData.pullQuote && <PullQuote text={layoutData.pullQuote} />}
      <Prose content={rest} />
      {layoutData.factBox && <FactBox text={layoutData.factBox} />}
      {layoutData.stats && <StatCounters stats={layoutData.stats} />}
    </TemplateWrapper>
  );
}

/* ================================================================== */
/*  TEMPLATE 2: PERSONNEL DOSSIER — Character profile card            */
/* ================================================================== */
export function Template2_PersonnelDossier({ post, layoutData, tags, relatedPosts, shareUrl, formattedDate }: TemplateProps) {
  return (
    <TemplateWrapper post={post} tags={tags} relatedPosts={relatedPosts} shareUrl={shareUrl}>
      <BackToBlog />
      <ArticleMetadata date={formattedDate} readTime={post.readTimeMinutes || 5}
        category={post.category} author={post.authorName || "NLF Team"} heatLevel={layoutData.heatLevel} />

      <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-6"
        style={{ fontFamily: "Anton, sans-serif" }}>
        {post.title}
      </h1>
      <SocialShareInline url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />

      {/* Dossier card */}
      {layoutData.profile && <ProfileCard profile={layoutData.profile} />}

      {/* Featured image */}
      {post.featuredImageUrl && !layoutData.profile?.imageUrl && (
        <div className="rounded-lg overflow-hidden mb-8" style={{ border: "1px solid rgba(0,255,65,0.2)" }}>
          <img src={post.featuredImageUrl} alt={post.title} className="w-full aspect-video object-cover" />
        </div>
      )}

      <GreenDivider />
      <Prose content={post.contentMarkdown || ""} />
      {layoutData.pullQuote && <PullQuote text={layoutData.pullQuote} />}
      {layoutData.factBox && <FactBox text={layoutData.factBox} />}
    </TemplateWrapper>
  );
}

/* ================================================================== */
/*  TEMPLATE 3: DATA BRIEF — Stats-heavy analytical                   */
/* ================================================================== */
export function Template3_DataBrief({ post, layoutData, tags, relatedPosts, shareUrl, formattedDate }: TemplateProps) {
  return (
    <TemplateWrapper post={post} tags={tags} relatedPosts={relatedPosts} shareUrl={shareUrl}>
      <BackToBlog />
      <ArticleMetadata date={formattedDate} readTime={post.readTimeMinutes || 5}
        category={post.category} author={post.authorName || "NLF Team"} heatLevel={layoutData.heatLevel} />

      {/* Stats grid at top */}
      {layoutData.stats && <StatCounters stats={layoutData.stats} />}

      <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-4"
        style={{ fontFamily: "Anton, sans-serif" }}>
        {post.title}
      </h1>
      <SocialShareInline url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />

      {post.featuredImageUrl && (
        <div className="rounded-lg overflow-hidden my-8" style={{ border: "1px solid rgba(0,255,65,0.2)" }}>
          <img src={post.featuredImageUrl} alt={post.title} className="w-full aspect-video object-cover" />
        </div>
      )}

      {/* Two-column: main content + key findings sidebar */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Prose content={post.contentMarkdown || ""} />
          {layoutData.comparison && <ComparisonTableView data={layoutData.comparison} />}
        </div>
        <aside className="lg:sticky lg:top-32 lg:self-start space-y-4">
          <div className="p-4 rounded-lg" style={{ background: "#141420", border: "1px solid rgba(0,255,65,0.2)" }}>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ fontFamily: "Oswald, sans-serif", color: "#00ff41" }}>
              KEY FINDINGS
            </h4>
            {layoutData.pullQuote && <p className="text-sm leading-relaxed" style={{ color: "#c0d8b8" }}>{layoutData.pullQuote}</p>}
          </div>
          {layoutData.factBox && <FactBox text={layoutData.factBox} />}
        </aside>
      </div>
    </TemplateWrapper>
  );
}

/* ================================================================== */
/*  TEMPLATE 4: INTERCEPTED TRANSMISSION — Pull-quote dominant        */
/* ================================================================== */
export function Template4_InterceptedTransmission({ post, layoutData, tags, relatedPosts, shareUrl, formattedDate }: TemplateProps) {
  const paragraphs = splitContent(post.contentMarkdown || "");
  // Interleave pull quotes every 3 paragraphs
  const pullQuotes = layoutData.pullQuote ? layoutData.pullQuote.split("|").map(s => s.trim()) : [];

  return (
    <TemplateWrapper post={post} tags={tags} relatedPosts={relatedPosts} shareUrl={shareUrl}>
      <BackToBlog />
      <ArticleMetadata date={formattedDate} readTime={post.readTimeMinutes || 5}
        category={post.category} author={post.authorName || "NLF Team"} heatLevel={layoutData.heatLevel} />

      <div className="mb-4 text-xs uppercase tracking-widest"
        style={{ fontFamily: "Oswald, sans-serif", color: "#7a9070" }}>
        SIGNAL INTERCEPT // PRIORITY TRANSMISSION
      </div>

      <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-4"
        style={{ fontFamily: "Anton, sans-serif" }}>
        {post.title}
      </h1>
      <SocialShareInline url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />

      {post.featuredImageUrl && (
        <div className="rounded-lg overflow-hidden my-8" style={{ border: "1px solid rgba(0,255,65,0.2)" }}>
          <img src={post.featuredImageUrl} alt={post.title} className="w-full aspect-video object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {paragraphs.map((p, i) => (
          <div key={i}>
            <Prose content={p} />
            {(i + 1) % 3 === 0 && pullQuotes[Math.floor(i / 3)] && (
              <PullQuote text={pullQuotes[Math.floor(i / 3)]} />
            )}
          </div>
        ))}
        {/* Show remaining pull quotes */}
        {pullQuotes.length > 0 && paragraphs.length < 3 && <PullQuote text={pullQuotes[0]} />}
      </div>

      {layoutData.factBox && <FactBox text={layoutData.factBox} />}
    </TemplateWrapper>
  );
}

/* ================================================================== */
/*  TEMPLATE 5: SITUATION ROOM — Full-width parallax hero             */
/* ================================================================== */
export function Template5_SituationRoom({ post, layoutData, tags, relatedPosts, shareUrl, formattedDate }: TemplateProps) {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a14", color: "#e8f5e0" }}>
      <SocialShareFloating url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />

      {/* Full-width parallax hero */}
      <div className="relative min-h-[60vh] flex items-end overflow-hidden">
        {post.featuredImageUrl && (
          <>
            <img src={post.featuredImageUrl} alt={post.title}
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to top, #0a0a14 10%, transparent 60%)" }} />
          </>
        )}
        <div className="relative container max-w-5xl px-4 pb-12">
          <BackToBlog />
          <ArticleMetadata date={formattedDate} readTime={post.readTimeMinutes || 5}
            category={post.category} author={post.authorName || "NLF Team"} heatLevel={layoutData.heatLevel} />
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] mb-4"
            style={{ fontFamily: "Anton, sans-serif" }}>
            {post.title}
          </h1>
          {post.excerpt && <p className="text-lg max-w-2xl" style={{ color: "#c0d8b8" }}>{post.excerpt}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-3xl py-12 px-4">
        <SocialShareInline url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />
        <GreenDivider />
        <Prose content={post.contentMarkdown || ""} />
        {layoutData.pullQuote && <PullQuote text={layoutData.pullQuote} />}
        {layoutData.factBox && <FactBox text={layoutData.factBox} />}
        {layoutData.stats && <StatCounters stats={layoutData.stats} />}
        <SocialShareBottomBar url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />
        <TagsSection tags={tags} />
        <BlogNewsletter />
        <RelatedArticlesCarousel posts={relatedPosts} />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  TEMPLATE 6: ASSET GALLERY — Image gallery with lightbox           */
/* ================================================================== */
export function Template6_AssetGallery({ post, layoutData, tags, relatedPosts, shareUrl, formattedDate }: TemplateProps) {
  return (
    <TemplateWrapper post={post} tags={tags} relatedPosts={relatedPosts} shareUrl={shareUrl}>
      <BackToBlog />
      <ArticleMetadata date={formattedDate} readTime={post.readTimeMinutes || 5}
        category={post.category} author={post.authorName || "NLF Team"} heatLevel={layoutData.heatLevel} />

      <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-4"
        style={{ fontFamily: "Anton, sans-serif" }}>
        {post.title}
      </h1>
      <SocialShareInline url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />

      {/* Gallery grid */}
      {layoutData.gallery && layoutData.gallery.length > 0 && (
        <LightboxGallery images={layoutData.gallery} />
      )}

      <Prose content={post.contentMarkdown || ""} />
      {layoutData.pullQuote && <PullQuote text={layoutData.pullQuote} />}
      {layoutData.factBox && <FactBox text={layoutData.factBox} />}
    </TemplateWrapper>
  );
}

/* ================================================================== */
/*  TEMPLATE 7: STRATEGIC ANALYSIS — Long-form with sticky TOC        */
/* ================================================================== */
export function Template7_StrategicAnalysis({ post, layoutData, tags, relatedPosts, shareUrl, formattedDate }: TemplateProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (!layoutData.toc?.length) return;
    const observers: IntersectionObserver[] = [];
    layoutData.toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(item.id); },
        { rootMargin: "-100px 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [layoutData.toc]);

  return (
    <TemplateWrapper post={post} tags={tags} relatedPosts={relatedPosts} shareUrl={shareUrl}>
      <BackToBlog />
      <ArticleMetadata date={formattedDate} readTime={post.readTimeMinutes || 8}
        category={post.category} author={post.authorName || "NLF Team"} heatLevel={layoutData.heatLevel} />

      <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-4"
        style={{ fontFamily: "Anton, sans-serif" }}>
        {post.title}
      </h1>
      <SocialShareInline url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />

      {post.featuredImageUrl && (
        <div className="rounded-lg overflow-hidden my-8" style={{ border: "1px solid rgba(0,255,65,0.2)" }}>
          <img src={post.featuredImageUrl} alt={post.title} className="w-full aspect-video object-cover" />
        </div>
      )}

      {/* Two-column: TOC sidebar + content */}
      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block">
          {layoutData.toc && <StickyTOC items={layoutData.toc} activeId={activeSection} />}
        </aside>
        <div className="lg:col-span-3">
          <Prose content={post.contentMarkdown || ""} />
          {layoutData.pullQuote && <PullQuote text={layoutData.pullQuote} />}
          {layoutData.comparison && <ComparisonTableView data={layoutData.comparison} />}
          {layoutData.factBox && <FactBox text={layoutData.factBox} />}
        </div>
      </div>
    </TemplateWrapper>
  );
}

/* ================================================================== */
/*  TEMPLATE 8: FLASH ALERT — Urgent/breaking news                   */
/* ================================================================== */
export function Template8_FlashAlert({ post, layoutData, tags, relatedPosts, shareUrl, formattedDate }: TemplateProps) {
  return (
    <TemplateWrapper post={post} tags={tags} relatedPosts={relatedPosts} shareUrl={shareUrl}>
      <BackToBlog />

      {/* Alert banner */}
      <AlertBanner level={layoutData.alertLevel || "medium"} />

      <ArticleMetadata date={formattedDate} readTime={post.readTimeMinutes || 3}
        category={post.category} author={post.authorName || "NLF Team"} heatLevel={layoutData.heatLevel || "hot"} />

      <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-4"
        style={{ fontFamily: "Anton, sans-serif" }}>
        {post.title}
      </h1>
      <SocialShareInline url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />

      {/* Key facts box */}
      {layoutData.factBox && (
        <div className="p-5 rounded-lg my-6"
          style={{ background: "#141420", border: "2px solid rgba(0,255,65,0.3)" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ fontFamily: "Oswald, sans-serif", color: "#00ff41" }}>
            KEY FACTS
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#c0d8b8" }}>{layoutData.factBox}</p>
        </div>
      )}

      {post.featuredImageUrl && (
        <div className="rounded-lg overflow-hidden my-8" style={{ border: "1px solid rgba(0,255,65,0.2)" }}>
          <img src={post.featuredImageUrl} alt={post.title} className="w-full aspect-video object-cover" />
        </div>
      )}

      <Prose content={post.contentMarkdown || ""} />
      {layoutData.stats && <StatCounters stats={layoutData.stats} />}
      {layoutData.pullQuote && <PullQuote text={layoutData.pullQuote} />}
    </TemplateWrapper>
  );
}

/* ================================================================== */
/*  TEMPLATE 9: AFTER-ACTION REPORT — Timeline/chronological          */
/* ================================================================== */
export function Template9_AfterActionReport({ post, layoutData, tags, relatedPosts, shareUrl, formattedDate }: TemplateProps) {
  const paragraphs = splitContent(post.contentMarkdown || "");
  const intro = paragraphs.slice(0, 2).join("\n\n");
  const rest = paragraphs.slice(2).join("\n\n");

  return (
    <TemplateWrapper post={post} tags={tags} relatedPosts={relatedPosts} shareUrl={shareUrl}>
      <BackToBlog />
      <ArticleMetadata date={formattedDate} readTime={post.readTimeMinutes || 5}
        category={post.category} author={post.authorName || "NLF Team"} heatLevel={layoutData.heatLevel} />

      <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-4"
        style={{ fontFamily: "Anton, sans-serif" }}>
        {post.title}
      </h1>
      <SocialShareInline url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />

      {post.featuredImageUrl && (
        <div className="rounded-lg overflow-hidden my-8" style={{ border: "1px solid rgba(0,255,65,0.2)" }}>
          <img src={post.featuredImageUrl} alt={post.title} className="w-full aspect-video object-cover" />
        </div>
      )}

      {/* Intro paragraphs */}
      <Prose content={intro} />

      {/* Timeline */}
      {layoutData.timeline && layoutData.timeline.length > 0 && (
        <Timeline entries={layoutData.timeline} />
      )}

      {/* Remaining content */}
      <Prose content={rest} />
      {layoutData.pullQuote && <PullQuote text={layoutData.pullQuote} />}
      {layoutData.factBox && <FactBox text={layoutData.factBox} />}
    </TemplateWrapper>
  );
}

/* ================================================================== */
/*  TEMPLATE 10: TECHNICAL SCHEMATIC — Diagram-heavy technical        */
/* ================================================================== */
export function Template10_TechnicalSchematic({ post, layoutData, tags, relatedPosts, shareUrl, formattedDate }: TemplateProps) {
  return (
    <TemplateWrapper post={post} tags={tags} relatedPosts={relatedPosts} shareUrl={shareUrl}>
      <BackToBlog />
      <ArticleMetadata date={formattedDate} readTime={post.readTimeMinutes || 6}
        category={post.category} author={post.authorName || "NLF Team"} heatLevel={layoutData.heatLevel} />

      <div className="mb-2 text-xs uppercase tracking-widest"
        style={{ fontFamily: "ui-monospace, monospace", color: "#7a9070" }}>
        TECHNICAL REFERENCE // REF-{post.id?.toString().padStart(4, "0") || "0001"}
      </div>

      <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-4"
        style={{ fontFamily: "Anton, sans-serif" }}>
        {post.title}
      </h1>
      <SocialShareInline url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />

      {/* Specification table */}
      {layoutData.stats && (
        <div className="my-8 rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a40" }}>
          <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest"
            style={{ fontFamily: "Oswald, sans-serif", color: "#00ff41", background: "#0a0a14" }}>
            SPECIFICATIONS
          </div>
          {layoutData.stats.map((stat, i) => (
            <div key={i} className="flex justify-between px-4 py-2 text-sm"
              style={{
                background: i % 2 === 0 ? "#141420" : "#0a0a14",
                borderBottom: "1px solid #2a2a40",
              }}>
              <span style={{ color: "#7a9070", fontFamily: "Oswald, sans-serif" }}>{stat.label}</span>
              <span style={{ color: "#00ff41", fontFamily: "ui-monospace, monospace" }}>
                {stat.value}{stat.suffix || ""}
              </span>
            </div>
          ))}
        </div>
      )}

      {post.featuredImageUrl && (
        <div className="rounded-lg overflow-hidden my-8 p-4"
          style={{ background: "#141420", border: "1px solid #2a2a40" }}>
          <img src={post.featuredImageUrl} alt={post.title} className="w-full aspect-video object-cover rounded" />
          <p className="text-xs text-center mt-2" style={{ color: "#7a9070", fontFamily: "ui-monospace, monospace" }}>
            FIG. 1 — {post.title}
          </p>
        </div>
      )}

      <Prose content={post.contentMarkdown || ""} />
      {layoutData.comparison && <ComparisonTableView data={layoutData.comparison} />}
      {layoutData.pullQuote && <PullQuote text={layoutData.pullQuote} />}
      {layoutData.factBox && <FactBox text={layoutData.factBox} />}
    </TemplateWrapper>
  );
}

/* ================================================================== */
/*  TEMPLATE 11: SURVEILLANCE LOG — Image-right / text-left split     */
/* ================================================================== */
export function Template11_SurveillanceLog({ post, layoutData, tags, relatedPosts, shareUrl, formattedDate }: TemplateProps) {
  const paragraphs = splitContent(post.contentMarkdown || "");
  const firstTwo = paragraphs.slice(0, 2).join("\n\n");
  const rest = paragraphs.slice(2).join("\n\n");

  return (
    <TemplateWrapper post={post} tags={tags} relatedPosts={relatedPosts} shareUrl={shareUrl}>
      <BackToBlog />
      <ArticleMetadata date={formattedDate} readTime={post.readTimeMinutes || 5}
        category={post.category} author={post.authorName || "NLF Team"} heatLevel={layoutData.heatLevel} />

      {/* Two-column hero — mirror of Template 1 */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Title + opening text left */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-4"
            style={{ fontFamily: "Anton, sans-serif" }}>
            {post.title}
          </h1>
          {post.excerpt && <p className="text-lg mb-6" style={{ color: "#c0d8b8" }}>{post.excerpt}</p>}
          <SocialShareInline url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />
          <GreenDivider />
          <Prose content={firstTwo} />
        </div>
        {/* Sticky image right */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          {(layoutData.contentImage || post.featuredImageUrl) && (
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(0,255,65,0.2)" }}>
              <img src={layoutData.contentImage || post.featuredImageUrl} alt={post.title}
                className="w-full aspect-[4/3] object-cover" />
            </div>
          )}
        </div>
      </div>

      {layoutData.pullQuote && <PullQuote text={layoutData.pullQuote} />}
      <Prose content={rest} />
      {layoutData.factBox && <FactBox text={layoutData.factBox} />}
      {layoutData.stats && <StatCounters stats={layoutData.stats} />}
    </TemplateWrapper>
  );
}

/* ================================================================== */
/*  TEMPLATE 12: COMMAND BRIEFING — Executive summary                 */
/* ================================================================== */
export function Template12_CommandBriefing({ post, layoutData, tags, relatedPosts, shareUrl, formattedDate }: TemplateProps) {
  return (
    <TemplateWrapper post={post} tags={tags} relatedPosts={relatedPosts} shareUrl={shareUrl}>
      <BackToBlog />
      <ArticleMetadata date={formattedDate} readTime={post.readTimeMinutes || 8}
        category={post.category} author={post.authorName || "NLF Team"} heatLevel={layoutData.heatLevel} />

      <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-4"
        style={{ fontFamily: "Anton, sans-serif" }}>
        {post.title}
      </h1>
      <SocialShareInline url={shareUrl} title={post.title} excerpt={post.excerpt || undefined} />

      {/* Key Findings box */}
      {layoutData.pullQuote && (
        <div className="p-6 rounded-lg my-8"
          style={{ background: "#141420", border: "2px solid rgba(0,255,65,0.3)" }}>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3"
            style={{ fontFamily: "Oswald, sans-serif", color: "#00ff41" }}>
            KEY FINDINGS
          </h3>
          <ul className="space-y-2">
            {layoutData.pullQuote.split("|").map((finding, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#c0d8b8" }}>
                <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#00ff41" }} />
                {finding.trim()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {post.featuredImageUrl && (
        <div className="rounded-lg overflow-hidden my-8" style={{ border: "1px solid rgba(0,255,65,0.2)" }}>
          <img src={post.featuredImageUrl} alt={post.title} className="w-full aspect-video object-cover" />
        </div>
      )}

      <Prose content={post.contentMarkdown || ""} />
      {layoutData.stats && <StatCounters stats={layoutData.stats} />}
      {layoutData.comparison && <ComparisonTableView data={layoutData.comparison} />}
      {layoutData.factBox && <FactBox text={layoutData.factBox} />}
    </TemplateWrapper>
  );
}

/* ================================================================== */
/*  TEMPLATE ROUTER — Selects the correct template by number          */
/* ================================================================== */
export function BlogTemplateRouter({ templateNumber, ...props }: TemplateProps & { templateNumber: number }) {
  const templates: Record<number, React.FC<TemplateProps>> = {
    1: Template1_FieldReport,
    2: Template2_PersonnelDossier,
    3: Template3_DataBrief,
    4: Template4_InterceptedTransmission,
    5: Template5_SituationRoom,
    6: Template6_AssetGallery,
    7: Template7_StrategicAnalysis,
    8: Template8_FlashAlert,
    9: Template9_AfterActionReport,
    10: Template10_TechnicalSchematic,
    11: Template11_SurveillanceLog,
    12: Template12_CommandBriefing,
  };

  const Template = templates[templateNumber] || Template1_FieldReport;
  return <Template {...props} />;
}
