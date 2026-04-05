/**
 * ORDER 66 — Shared Blog Design Elements
 * Pull quotes, fact boxes, stat counters, heat badges, comparison tables,
 * newsletter signup, related articles carousel, and lightbox gallery.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, ChevronRight, X, BookOpen, Clock, ArrowRight,
  AlertTriangle, Info, Flame, TrendingUp, Sparkles, Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type {
  StatItem, TimelineEntry, GalleryImage, TableOfContentsItem,
  ComparisonTable, HeatLevel, AlertLevel, LayoutData,
} from "@/lib/blogLayoutTypes";
import { HEAT_COLORS, STAT_COLORS, STAT_COLOR_CYCLE } from "@/lib/blogLayoutTypes";

/* ------------------------------------------------------------------ */
/*  PULL QUOTE                                                         */
/* ------------------------------------------------------------------ */
export function PullQuote({ text }: { text: string }) {
  return (
    <blockquote className="relative my-10 p-6 rounded-r-lg"
      style={{ background: "#141420", borderLeft: "3px solid #00ff41" }}>
      <span className="absolute -top-3 left-4 text-5xl leading-none opacity-30"
        style={{ color: "#00ff41", fontFamily: "Anton, sans-serif" }}>"</span>
      <p className="text-lg uppercase tracking-wide leading-relaxed pt-2"
        style={{ fontFamily: "Anton, sans-serif", color: "#e8f5e0" }}>
        {text}
      </p>
    </blockquote>
  );
}

/* ------------------------------------------------------------------ */
/*  FACT BOX                                                           */
/* ------------------------------------------------------------------ */
export function FactBox({ text }: { text: string }) {
  return (
    <div className="my-8 p-5 rounded-lg"
      style={{
        background: "#141420",
        borderLeft: "3px solid #00ff41",
        border: "1px solid rgba(0,255,65,0.15)",
        borderLeftWidth: "3px",
        borderLeftColor: "#00ff41",
        boxShadow: "0 0 20px rgba(0,255,65,0.03)",
      }}>
      <p className="text-xs font-bold uppercase tracking-widest mb-2"
        style={{ fontFamily: "Oswald, sans-serif", color: "#00ff41" }}>
        DID YOU KNOW?
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "#c0d8b8" }}>
        {text}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HEAT BADGE                                                         */
/* ------------------------------------------------------------------ */
export function HeatBadge({ level }: { level: HeatLevel }) {
  const icons: Record<HeatLevel, typeof Flame> = {
    blazing: Flame, hot: Flame, rising: TrendingUp, new: Sparkles,
  };
  const Icon = icons[level];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${HEAT_COLORS[level]}`}
      style={{ fontFamily: "Oswald, sans-serif" }}>
      <Icon className="w-3 h-3" />
      {level}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  ALERT BANNER (Flash Alert template)                                */
/* ------------------------------------------------------------------ */
export function AlertBanner({ level, message }: { level: AlertLevel; message?: string }) {
  const colors: Record<AlertLevel, string> = {
    low: "border-[#00a0b0] bg-[#00a0b0]/10",
    medium: "border-[#c0a030] bg-[#c0a030]/10",
    high: "border-orange-500 bg-orange-500/10",
    critical: "border-[#d40924] bg-[#d40924]/10 animate-pulse",
  };
  const textColors: Record<AlertLevel, string> = {
    low: "#00a0b0", medium: "#c0a030", high: "#f97316", critical: "#d40924",
  };
  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${colors[level]} my-6`}>
      <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: textColors[level] }} />
      <div>
        <span className="text-xs font-bold uppercase tracking-widest"
          style={{ fontFamily: "Oswald, sans-serif", color: textColors[level] }}>
          FLASH ALERT — {level.toUpperCase()}
        </span>
        {message && <p className="text-sm mt-1" style={{ color: "#c0d8b8" }}>{message}</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ANIMATED STAT COUNTERS                                             */
/* ------------------------------------------------------------------ */
function AnimatedNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const steps = 40;
          const increment = value / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= value) {
              setDisplay(value);
              clearInterval(interval);
            } else {
              setDisplay(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

export function StatCounters({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
      {stats.map((stat, i) => {
        const colorKey = stat.color || STAT_COLOR_CYCLE[i % STAT_COLOR_CYCLE.length];
        const color = STAT_COLORS[colorKey];
        return (
          <div key={i} className="text-center p-4 rounded-lg"
            style={{
              background: "#141420",
              border: `1px solid ${color}30`,
              animationDelay: `${i * 100}ms`,
            }}>
            <div className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "Anton, sans-serif", color }}>
              <AnimatedNumber value={stat.value} />
              {stat.suffix || ""}
            </div>
            <div className="text-xs uppercase tracking-widest mt-1"
              style={{ fontFamily: "Oswald, sans-serif", color: "#7a9070" }}>
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  COMPARISON TABLE                                                   */
/* ------------------------------------------------------------------ */
export function ComparisonTableView({ data }: { data: ComparisonTable }) {
  return (
    <div className="my-8 overflow-x-auto rounded-lg" style={{ border: "1px solid #2a2a40" }}>
      {data.title && (
        <div className="px-4 py-2 text-sm font-bold uppercase tracking-widest"
          style={{ fontFamily: "Oswald, sans-serif", color: "#00ff41", background: "#0a0a14" }}>
          {data.title}
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "#0a0a14" }}>
            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider text-xs"
              style={{ fontFamily: "Oswald, sans-serif", color: "#00ff41" }}>Feature</th>
            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider text-xs"
              style={{ fontFamily: "Oswald, sans-serif", color: "#00ff41" }}>{data.headers[0]}</th>
            <th className="text-left px-4 py-3 font-bold uppercase tracking-wider text-xs"
              style={{ fontFamily: "Oswald, sans-serif", color: "#00ff41" }}>{data.headers[1]}</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} style={{
              background: i % 2 === 0 ? "#141420" : "#0a0a14",
              borderBottom: "1px solid #2a2a40",
            }}>
              <td className="px-4 py-3 font-medium" style={{ color: "#e8f5e0" }}>{row.label}</td>
              <td className="px-4 py-3" style={{ color: "#c0d8b8", fontFamily: "ui-monospace, monospace" }}>{row.col1}</td>
              <td className="px-4 py-3" style={{ color: "#c0d8b8", fontFamily: "ui-monospace, monospace" }}>{row.col2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TIMELINE                                                           */
/* ------------------------------------------------------------------ */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="relative my-10 pl-8">
      {/* Vertical line */}
      <div className="absolute left-3 top-0 bottom-0 w-0.5"
        style={{ background: "linear-gradient(to bottom, #00ff41, #00a0b0, #a060d0)" }} />
      {entries.map((entry, i) => (
        <div key={i} className="relative mb-8 last:mb-0">
          {/* Dot */}
          <div className="absolute -left-5 top-1 w-4 h-4 rounded-full border-2"
            style={{ borderColor: "#00ff41", background: "#0a0a14" }} />
          <div className="ml-4">
            <span className="text-xs font-bold uppercase tracking-widest"
              style={{ fontFamily: "Oswald, sans-serif", color: "#00ff41" }}>
              {entry.date}
            </span>
            <h4 className="text-lg font-bold mt-1" style={{ color: "#e8f5e0" }}>{entry.title}</h4>
            <p className="text-sm mt-1" style={{ color: "#c0d8b8" }}>{entry.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TABLE OF CONTENTS (Sticky sidebar)                                 */
/* ------------------------------------------------------------------ */
export function StickyTOC({ items, activeId }: { items: TableOfContentsItem[]; activeId?: string }) {
  return (
    <nav className="sticky top-32 space-y-1">
      <h3 className="text-xs font-bold uppercase tracking-widest mb-3"
        style={{ fontFamily: "Oswald, sans-serif", color: "#00ff41" }}>
        // CONTENTS //
      </h3>
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`}
          className="block text-sm py-1.5 transition-colors border-l-2 pl-3"
          style={{
            borderColor: activeId === item.id ? "#00ff41" : "transparent",
            color: activeId === item.id ? "#00ff41" : "#7a9070",
            paddingLeft: item.level > 2 ? "1.5rem" : "0.75rem",
          }}>
          {item.title}
        </a>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  LIGHTBOX GALLERY                                                   */
/* ------------------------------------------------------------------ */
export function LightboxGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => {
    setActiveIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  }, [images.length]);
  const next = useCallback(() => {
    setActiveIndex((i) => (i !== null ? (i + 1) % images.length : null));
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, close, prev, next]);

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8">
        {images.map((img, i) => (
          <button key={i} onClick={() => setActiveIndex(i)}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden border transition-all hover:scale-105"
            style={{ borderColor: "rgba(0,255,65,0.15)" }}>
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <span className="text-xs text-white truncate">{img.caption || img.alt}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {activeIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(10,10,20,0.95)" }}
          onClick={close}>
          <button onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10">
            <X className="w-6 h-6" style={{ color: "#e8f5e0" }} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10">
            <ChevronLeft className="w-8 h-8" style={{ color: "#e8f5e0" }} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10">
            <ChevronRight className="w-8 h-8" style={{ color: "#e8f5e0" }} />
          </button>
          <div className="max-w-5xl max-h-[85vh] px-16" onClick={(e) => e.stopPropagation()}>
            <img src={images[activeIndex].url} alt={images[activeIndex].alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            {images[activeIndex].caption && (
              <p className="text-center text-sm mt-3" style={{ color: "#c0d8b8" }}>
                {images[activeIndex].caption}
              </p>
            )}
            <p className="text-center text-xs mt-2" style={{ color: "#7a9070" }}>
              {activeIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  PROFILE CARD (Personnel Dossier)                                   */
/* ------------------------------------------------------------------ */
export function ProfileCard({ profile }: { profile: import("@/lib/blogLayoutTypes").PersonProfile }) {
  return (
    <div className="rounded-lg overflow-hidden my-8"
      style={{ background: "#141420", border: "1px solid rgba(0,255,65,0.2)" }}>
      <div className="h-1" style={{ background: "linear-gradient(to right, #00ff41, #00a0b0)" }} />
      <div className="p-6 flex flex-col md:flex-row gap-6">
        {profile.imageUrl && (
          <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 border"
            style={{ borderColor: "rgba(0,255,65,0.3)" }}>
            <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold uppercase" style={{ fontFamily: "Anton, sans-serif", color: "#e8f5e0" }}>
              {profile.name}
            </h3>
            {profile.status && (
              <span className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                style={{ background: "rgba(0,255,65,0.15)", color: "#00ff41", fontFamily: "Oswald, sans-serif" }}>
                {profile.status}
              </span>
            )}
          </div>
          <p className="text-sm mb-4" style={{ fontFamily: "Oswald, sans-serif", color: "#7a9070" }}>
            {profile.title}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {profile.stats.map((s, i) => (
              <div key={i} className="p-2 rounded text-center" style={{ background: "#0a0a14" }}>
                <div className="text-xs uppercase tracking-wider" style={{ fontFamily: "Oswald, sans-serif", color: "#7a9070" }}>
                  {s.label}
                </div>
                <div className="font-bold text-sm" style={{ color: "#00ff41" }}>{s.value}</div>
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#c0d8b8" }}>{profile.bio}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  BLOG NEWSLETTER SIGNUP                                             */
/* ------------------------------------------------------------------ */
export function BlogNewsletter() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Welcome to the legend! Check your inbox for 10% off.");
    setEmail("");
    setFirstName("");
  };

  return (
    <section className="my-12 p-8 rounded-lg text-center"
      style={{ background: "#141420", border: "1px dashed rgba(0,255,65,0.3)" }}>
      <h3 className="text-3xl font-bold uppercase mb-2"
        style={{ fontFamily: "Anton, sans-serif", color: "#e8f5e0" }}>
        // JOIN THE <span style={{ color: "#00ff41" }}>LEGEND</span> //
      </h3>
      <p className="text-sm mb-1" style={{ color: "#c0d8b8" }}>
        Be the first to know about new drops, exclusive offers, and collector tips
      </p>
      <p className="text-xs mb-6" style={{ color: "#7a9070" }}>
        Sign up and get 10% off your first order
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
        <Input
          placeholder="First name (optional)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="flex-1"
          style={{ background: "#141420", borderColor: "#2a2a40", color: "#e8f5e0" }}
        />
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
          style={{ background: "#141420", borderColor: "#2a2a40", color: "#e8f5e0" }}
        />
        <Button type="submit" className="font-bold uppercase tracking-wider"
          style={{ background: "#00ff41", color: "#0a0a0a", fontFamily: "Oswald, sans-serif" }}>
          SUBSCRIBE
        </Button>
      </form>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  RELATED ARTICLES CAROUSEL                                          */
/* ------------------------------------------------------------------ */
export function RelatedArticlesCarousel({ posts }: { posts: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!posts.length) return null;

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold uppercase"
          style={{ fontFamily: "Anton, sans-serif", color: "#e8f5e0" }}>
          // MORE FROM <span style={{ color: "#00ff41" }}>NLF</span> //
        </h3>
        <div className="flex gap-2">
          <button onClick={() => scroll("left")}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            style={{ border: "1px solid #2a2a40" }}>
            <ChevronLeft className="w-4 h-4" style={{ color: "#e8f5e0" }} />
          </button>
          <button onClick={() => scroll("right")}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            style={{ border: "1px solid #2a2a40" }}>
            <ChevronRight className="w-4 h-4" style={{ color: "#e8f5e0" }} />
          </button>
        </div>
      </div>
      <div ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}>
        {posts.map((post: any) => (
          <Link key={post.id} href={`/the-collector/${post.slug}`}>
            <article className="flex-shrink-0 w-72 rounded-lg overflow-hidden cursor-pointer group transition-all"
              style={{
                background: "#141420",
                border: "1px dashed rgba(0,255,65,0.2)",
              }}>
              {post.featuredImageUrl ? (
                <div className="aspect-video overflow-hidden">
                  <img src={post.featuredImageUrl} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(0,255,65,0.05), rgba(0,160,176,0.05))" }}>
                  <BookOpen className="w-8 h-8 opacity-30" style={{ color: "#00ff41" }} />
                </div>
              )}
              <div className="p-4">
                <h4 className="font-bold text-sm line-clamp-2 group-hover:text-[#00ff41] transition-colors"
                  style={{ color: "#e8f5e0" }}>
                  {post.title}
                </h4>
                <p className="text-xs mt-2 line-clamp-2" style={{ color: "#7a9070" }}>
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider mt-3"
                  style={{ fontFamily: "Oswald, sans-serif", color: "#00ff41" }}>
                  READ MORE <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  BACK TO BLOG LINK                                                  */
/* ------------------------------------------------------------------ */
export function BackToBlog() {
  return (
    <Link href="/the-collector"
      className="inline-flex items-center gap-2 text-sm transition-colors hover:text-[#00ff41] mb-6"
      style={{ fontFamily: "Oswald, sans-serif", color: "#7a9070" }}>
      <ChevronLeft className="w-4 h-4" />
      BACK TO BLOG
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  ARTICLE METADATA BAR                                               */
/* ------------------------------------------------------------------ */
export function ArticleMetadata({
  date, readTime, category, author, heatLevel,
}: {
  date: string; readTime: number; category: string; author: string; heatLevel?: HeatLevel;
}) {
  const CATEGORY_LABELS: Record<string, string> = {
    market_trends: "MARKET INTEL", character_spotlight: "CHARACTER PROFILE",
    grading_guide: "GRADING GUIDE", set_breakdown: "SET ANALYSIS",
    investment_strategy: "INVESTMENT GUIDE", collecting_tips: "COLLECTOR TIPS",
    nlf_news: "NLF NEWS", behind_the_scenes: "BEHIND THE SCENES",
    card_history: "CARD HISTORY", sports_crossover: "SPORTS CROSSOVER",
  };

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs mb-6"
      style={{ fontFamily: "Oswald, sans-serif", color: "#7a9070" }}>
      <span className="uppercase tracking-widest">{date}</span>
      <span style={{ color: "#2a2a40" }}>|</span>
      <span className="flex items-center gap-1">
        <Clock className="w-3 h-3" /> {readTime} MIN READ
      </span>
      <span style={{ color: "#2a2a40" }}>|</span>
      <span className="uppercase tracking-widest" style={{ color: "#00ff41" }}>
        {CATEGORY_LABELS[category] || category.toUpperCase()}
      </span>
      {heatLevel && (
        <>
          <span style={{ color: "#2a2a40" }}>|</span>
          <HeatBadge level={heatLevel} />
        </>
      )}
      <span style={{ color: "#2a2a40" }}>|</span>
      <span className="uppercase tracking-widest">{author}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TAGS SECTION                                                       */
/* ------------------------------------------------------------------ */
export function TagsSection({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 my-8 pt-6"
      style={{ borderTop: "1px solid #2a2a40" }}>
      <span className="text-xs font-bold uppercase tracking-widest mr-2"
        style={{ fontFamily: "Oswald, sans-serif", color: "#00ff41" }}>
        TAGGED:
      </span>
      {tags.map((tag) => (
        <span key={tag} className="px-3 py-1 rounded text-xs"
          style={{ background: "#141420", color: "#c0d8b8", border: "1px solid #2a2a40" }}>
          {tag}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GREEN DIVIDER                                                      */
/* ------------------------------------------------------------------ */
export function GreenDivider() {
  return <div className="w-full h-px my-8" style={{ background: "rgba(0,255,65,0.3)" }} />;
}
