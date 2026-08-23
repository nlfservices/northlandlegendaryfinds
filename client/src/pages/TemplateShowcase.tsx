/**
 * Template Showcase â€” Preview all 10 article template layouts with sample content
 * Admin-only page for reviewing and choosing templates. Includes print/PDF export.
 */

import { useState } from "react";
import {
  ArrowLeft, Layout, Newspaper, Target, Clock, Hash, Film, FileText,
  User, Tv, BookOpen, Printer, ChevronDown, ChevronUp, Eye, Star
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArticleTemplateRenderer,
  ALL_TEMPLATE_NAMES,
  type ArticleTemplate
} from "@/components/ArticleTemplates";

// â”€â”€â”€ Sample content for each template category â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SAMPLE_CONTENT_GENERAL = `The Marvel Cinematic Universe continues to evolve at a breathtaking pace. With Phase 6 now in full swing, the multiverse saga is reaching its climax in ways that fans have been anticipating for years.

> "The best Marvel cards are the ones that tell a story â€” and right now, every character has a story worth collecting."

The trading card market has responded to these developments with unprecedented enthusiasm. Collectors are scrambling to secure key cards before the next wave of announcements drives prices even higher.

## The Current State of the MCU

Marvel Studios has entered its most ambitious phase yet. With multiple interconnected projects releasing simultaneously across film, television, and streaming platforms, the narrative complexity has reached new heights.

The confirmed cast for upcoming projects reads like a who's who of Hollywood talent. New additions alongside returning favorites create a dynamic that keeps audiences engaged and collectors speculating.

## Key Characters to Watch

Several characters are positioned for breakout moments in the coming months. Their increased prominence in the MCU directly correlates with trading card market movement.

The data shows a clear pattern: characters announced for major roles in tentpole films see an average 35-50% increase in their premium card values within 30 days of confirmation.

## Market Analysis and Trends

The 2026 trading card market is characterized by several key trends. Premium parallels and numbered inserts continue to outperform base cards by significant margins.

Vintage cards from the 1990s are experiencing a renaissance driven by nostalgia and the MCU's incorporation of characters from that era. Sets like the 1992 Marvel Masterpieces are seeing renewed interest.

## Investment Strategy for Collectors

Building a profitable Marvel card portfolio requires a disciplined approach. Diversification across eras, characters, and product types reduces risk while maintaining exposure to potential breakout performers.

Dollar-cost averaging into premium products during quiet periods between major announcements is a proven strategy.

## What Comes Next

The road ahead is filled with both certainty and speculation. Confirmed projects provide a roadmap for near-term card market movement, while rumors and leaks create speculative opportunities.

For collectors who stay informed, maintain discipline, and act on conviction, the current environment offers generational opportunities.`;

const SAMPLE_CONTENT_CHARACTER = `Robert Downey Jr. brought Tony Stark to life in a way that defined an era of cinema. His portrayal of the genius billionaire philanthropist set the gold standard for superhero performances and launched the MCU into the cultural stratosphere.

> "I am Iron Man." â€” Three words that changed cinema forever.

The trading card market reflects this legacy in a powerful way. RDJ-era Iron Man cards remain among the most sought-after in the entire Topps Marvel catalog.

## The Actor Behind the Armor

Robert Downey Jr.'s journey to becoming Iron Man is as compelling as the character himself. After a career resurgence in the mid-2000s, his casting as Tony Stark in 2008 was considered a risk that paid off beyond anyone's wildest expectations.

His improvisational style, wit, and genuine charisma translated perfectly to the screen, creating a character that audiences worldwide fell in love with immediately.

## Card Market Cross-Reference

The Topps Marvel Chrome set features multiple RDJ-era Iron Man cards that have seen extraordinary appreciation. The base chrome parallel and refractor variants are particularly sought after by collectors who want to own a piece of MCU history.

Autograph cards featuring RDJ's signature command premium prices in the secondary market, with PSA 10 examples regularly fetching four figures at auction.

## Legacy and Impact

Tony Stark's sacrifice in Avengers: Endgame created one of cinema's most emotional moments. The character's arc from self-centered weapons manufacturer to selfless hero resonates with audiences of all ages.

This emotional connection drives collector demand in a way that purely fictional characters cannot match â€” every card is a piece of a story that genuinely moved people.

## What Collectors Should Know

For serious MCU card collectors, RDJ Iron Man cards represent a blue-chip investment. The combination of cultural significance, limited supply of high-grade examples, and enduring fan demand creates a strong foundation for long-term value.`;

const SAMPLE_CONTENT_DISNEY = `Disney Parks have been transforming their Marvel experience at an extraordinary pace. From the immersive Avengers Campus at Disneyland to the upcoming expansions at Walt Disney World, the intersection of Marvel storytelling and theme park magic has never been more exciting.

## Avengers Campus: The Crown Jewel

Avengers Campus at Disney California Adventure opened in 2021 and immediately became one of the most popular lands in any Disney park worldwide. The attention to detail is extraordinary â€” every corner tells a story, every cast member is in character.

The centerpiece attraction, WEB SLINGERS: A Spider-Man Adventure, uses cutting-edge technology to put guests in the role of a new recruit helping Spider-Man collect his out-of-control Spider-Bots. It's interactive, replayable, and genuinely thrilling.

## Guardians of the Galaxy: Cosmic Rewind

The Guardians of the Galaxy: Cosmic Rewind attraction at EPCOT represents a new category of Disney attraction â€” the "reverse launch" coaster that takes guests on an intergalactic chase through the cosmos.

The pre-show featuring the Collector (played by Benicio del Toro) sets up a narrative that perfectly captures the spirit of the Guardians films. It's one of the most technically impressive attractions ever built.

## What's Coming Next

Disney has announced significant Marvel expansions across multiple parks. The details are still emerging, but the commitment to bringing the full MCU experience to guests worldwide is clear and substantial.

## The Card Connection

Theme park experiences drive Marvel fandom in powerful ways. Kids who experience Avengers Campus become lifelong Marvel fans â€” and many of them become card collectors. The pipeline from park visitor to card collector is real and growing.`;

const SAMPLE_CONTENT_COLLECTOR = `The Amazing Spider-Man #1 from 1963 is one of the most iconic comic books ever published. It introduced the world to Peter Parker's solo adventures and established the template for what a Marvel superhero story could be. Today, high-grade copies command extraordinary prices at auction.

> "With great power comes great responsibility." â€” The line that defined a hero and a generation of readers.

For Marvel card collectors, understanding the comics that inspired the cards is essential context for appreciating what makes certain cards truly special.

## The Comics That Started It All

Stan Lee and Steve Ditko created something timeless with their early Spider-Man stories. The combination of relatable teenage protagonist, witty dialogue, and genuinely challenging villains set a new standard for superhero storytelling.

The visual language established in those early comics â€” the web-swinging poses, the expressive costume, the dynamic action sequences â€” directly influenced how Spider-Man appears on trading cards decades later.

## Most Loved Marvel Comics Series

Collectors and readers consistently rank certain series as the pinnacle of Marvel storytelling. The Infinity Gauntlet, Civil War, House of M, and Secret Invasion all appear repeatedly on best-of lists. These stories directly inspired MCU films and drove card market interest.

## The Card-to-Comic Connection

Topps Marvel card sets frequently draw inspiration from specific comic storylines. Understanding which comics inspired which card designs helps collectors appreciate the depth of what they're collecting.

The 2025 Topps Marvel Chrome set features artwork directly inspired by classic comic panels, making each card a miniature piece of comic art history.

## Building a Complementary Collection

Many serious collectors pursue both comics and cards simultaneously. The two collecting hobbies complement each other beautifully â€” comics provide the narrative context, cards provide the portable, displayable art.

Starting with key first appearances in both formats is a proven strategy for building a collection with both sentimental and investment value.`;

// â”€â”€â”€ Template definitions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const TEMPLATES: {
  id: ArticleTemplate;
  name: string;
  icon: any;
  description: string;
  bestFor: string;
  content: string;
  category: string;
  cardMarketImpact?: string;
}[] = [
  {
    id: "classic",
    name: "1. Classic",
    icon: Newspaper,
    description: "Clean linear flow â€” hero image, flowing paragraphs, mid-article banners. The reliable workhorse.",
    bestFor: "Movie news, general MCU updates, release date announcements",
    content: SAMPLE_CONTENT_GENERAL,
    category: "movie_news",
    cardMarketImpact: "Premium Marvel card values trending upward 25-40% YoY on confirmed MCU characters.",
  },
  {
    id: "magazine",
    name: "2. Magazine",
    icon: Layout,
    description: "Pull quotes, alternating section backgrounds, decorative icons. Feels like a premium print magazine.",
    bestFor: "In-depth analysis, market trends, feature stories",
    content: SAMPLE_CONTENT_GENERAL,
    category: "analysis",
    cardMarketImpact: "Chrome refractors and numbered parallels leading the market with 35-50% gains.",
  },
  {
    id: "spotlight",
    name: "3. Spotlight",
    icon: Target,
    description: "Two-column layout with sticky sidebar showing characters, market impact, and article navigation.",
    bestFor: "Character deep-dives, set breakdowns, collector guides",
    content: SAMPLE_CONTENT_GENERAL,
    category: "character_spotlight",
    cardMarketImpact: "Key character cards seeing 40-60% appreciation on MCU confirmation news.",
  },
  {
    id: "timeline",
    name: "4. Timeline",
    icon: Clock,
    description: "Visual timeline with colored node markers and connecting lines. Perfect for chronological stories.",
    bestFor: "MCU release schedules, character history, card market evolution",
    content: SAMPLE_CONTENT_GENERAL,
    category: "release_dates",
  },
  {
    id: "listicle",
    name: "5. Listicle",
    icon: Hash,
    description: "Numbered cards with color-coded rank badges and gradient backgrounds. Highly shareable format.",
    bestFor: "Top 10 lists, best cards, best actors, most watched shows",
    content: SAMPLE_CONTENT_GENERAL,
    category: "analysis",
    cardMarketImpact: "Top-ranked characters consistently outperform the broader market.",
  },
  {
    id: "cinematic",
    name: "6. Cinematic",
    icon: Film,
    description: "Full-bleed hero image, film-strip perforations, dramatic scene markers. Dark and moody.",
    bestFor: "Movie reviews, trailer breakdowns, cinematic moments",
    content: SAMPLE_CONTENT_GENERAL,
    category: "movie_news",
  },
  {
    id: "dossier",
    name: "7. Dossier",
    icon: FileText,
    description: "Intel briefing style with classified header, subject lines, and numbered sections. Unique and bold.",
    bestFor: "Rumors, casting news, behind-the-scenes intel, speculation",
    content: SAMPLE_CONTENT_GENERAL,
    category: "rumors",
  },
  {
    id: "character_profile",
    name: "8. Character Profile",
    icon: User,
    description: "Hero card banner with actor bio panel and card cross-reference sidebar. Two-column layout.",
    bestFor: "Actor profiles, character spotlights, best MCU actors articles",
    content: SAMPLE_CONTENT_CHARACTER,
    category: "best_actors",
    cardMarketImpact: "RDJ Iron Man cards remain blue-chip investments with consistent demand.",
  },
  {
    id: "disney_experience",
    name: "9. Disney Experience",
    icon: Tv,
    description: "Vibrant adventure-style layout with colorful gradient sections. Bright and energetic.",
    bestFor: "Disney Parks rides, Disney+ shows, kids Marvel content, family experiences",
    content: SAMPLE_CONTENT_DISNEY,
    category: "disney_parks",
  },
  {
    id: "collector_spotlight",
    name: "10. Collector Spotlight",
    icon: BookOpen,
    description: "Amber/gold aesthetic with card market impact panel, pull quotes, and centered section dividers.",
    bestFor: "Comics deep-dives, card collecting guides, what kids love, collector tips",
    content: SAMPLE_CONTENT_COLLECTOR,
    category: "comics_spotlight",
    cardMarketImpact: "Spider-Man first appearance comics and cards both seeing strong collector demand in 2026.",
  },
];

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function TemplateShowcase() {
  const [activeTemplate, setActiveTemplate] = useState<ArticleTemplate>("classic");
  const [showAll, setShowAll] = useState(false);

  const active = TEMPLATES.find((t) => t.id === activeTemplate)!;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          body { background: white !important; color: black !important; }
        }
      `}</style>

      {/* â”€â”€ Header â”€â”€ */}
      <div className="border-b border-border/50 bg-card/50 sticky top-0 z-50 no-print">
        <div className="container py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <Link href="/matrix">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold">Article Template Showcase</h1>
                <p className="text-xs text-muted-foreground">10 distinct layouts â€” click any template to preview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
                {showAll ? <ChevronUp className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showAll ? "Single View" : "Show All 10"}
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print / Save PDF
              </Button>
            </div>
          </div>

          {/* Template Selector Tabs */}
          {!showAll && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {TEMPLATES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate(t.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      activeTemplate === t.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* â”€â”€ Show All Mode â”€â”€ */}
      {showAll ? (
        <div className="container py-8 space-y-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2">All 10 Article Templates</h2>
            <p className="text-muted-foreground">Each template creates a completely different reading experience. Use Print / Save PDF to export.</p>
          </div>
          {TEMPLATES.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div key={t.id} className={idx > 0 ? "print-break" : ""}>
                {/* Template header */}
                <div className="bg-card border border-border rounded-2xl p-5 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl font-black">{t.name} Template</h2>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                          Position {idx + 1} in rotation
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{t.description}</p>
                      <p className="text-xs text-primary/80 mt-1">
                        <Star className="w-3 h-3 inline mr-1" />
                        Best for: {t.bestFor}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Template render */}
                <div className="max-w-5xl mx-auto border border-border/30 rounded-2xl p-6 bg-card/20">
                  <ArticleTemplateRenderer
                    template={t.id}
                    content={t.content}
                    title={`Sample: ${t.name} Template â€” Marvel MCU Article`}
                    featuredImageUrl="https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/mcu-intel-card-market-Lt56dsta4y7Hzfj6pzAysR.webp"
                    category={t.category}
                    cardMarketImpact={t.cardMarketImpact}
                    tags={["Marvel Cards", "MCU", "Collecting", "2026", "Topps"]}
                    excerpt="A comprehensive look at the current state of Marvel trading cards and what collectors need to know heading into the second half of 2026."
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* â”€â”€ Single Template View â”€â”€ */
        <div className="container py-6">
          {/* Active template info card */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-8">
            <div className="flex items-start gap-4">
              {(() => {
                const Icon = active.icon;
                return (
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                );
              })()}
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-black">{active.name} Template</h2>
                  <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                    {TEMPLATES.findIndex(t => t.id === activeTemplate) + 1} of 10
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mt-1">{active.description}</p>
                <p className="text-xs text-primary/80 mt-1">
                  <Star className="w-3 h-3 inline mr-1" />
                  Best for: {active.bestFor}
                </p>
              </div>
            </div>
          </div>

          {/* Template render */}
          <div className="max-w-5xl mx-auto">
            <ArticleTemplateRenderer
              template={activeTemplate}
              content={active.content}
              title={`Sample: ${active.name} Template â€” Marvel MCU Article`}
              featuredImageUrl="https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/mcu-intel-card-market-Lt56dsta4y7Hzfj6pzAysR.webp"
              category={active.category}
              cardMarketImpact={active.cardMarketImpact}
              tags={["Marvel Cards", "MCU", "Collecting", "2026", "Topps"]}
              excerpt="A comprehensive look at the current state of Marvel trading cards and what collectors need to know heading into the second half of 2026."
            />
          </div>
        </div>
      )}
    </div>
  );
}

