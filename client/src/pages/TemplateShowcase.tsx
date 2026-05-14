/**
 * Template Showcase — Preview all 5 article template layouts with placeholder content
 * Admin-only page for reference when choosing templates for new articles
 */

import { useState } from "react";
import { ArrowLeft, Layout, Newspaper, Target, Clock, Hash } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArticleTemplateRenderer, type ArticleTemplate } from "@/components/ArticleTemplates";

const SAMPLE_CONTENT = `The Marvel Cinematic Universe continues to evolve at a breathtaking pace. With Phase 6 now in full swing, the multiverse saga is reaching its climax in ways that fans have been anticipating for years. The convergence of heroes, villains, and alternate realities creates a narrative tapestry unlike anything seen before in cinema history.

The trading card market has responded to these developments with unprecedented enthusiasm. Collectors are scrambling to secure key cards before the next wave of announcements drives prices even higher. Understanding the intersection of MCU storytelling and card market dynamics is essential for any serious collector in 2026.

## The Current State of the MCU

Marvel Studios has entered its most ambitious phase yet. With multiple interconnected projects releasing simultaneously across film, television, and streaming platforms, the narrative complexity has reached new heights. Kevin Feige's master plan is finally coming into focus, and the implications for both storytelling and the collectibles market are enormous.

The confirmed cast for upcoming projects reads like a who's who of Hollywood talent. New additions alongside returning favorites create a dynamic that keeps audiences engaged and collectors speculating about which characters will see the biggest screen time increases.

## Key Characters to Watch

Several characters are positioned for breakout moments in the coming months. Their increased prominence in the MCU directly correlates with trading card market movement, making them essential targets for forward-thinking collectors.

The data shows a clear pattern: characters announced for major roles in tentpole films see an average 35-50% increase in their premium card values within 30 days of confirmation. This window of opportunity is narrow but highly profitable for those who act decisively.

## Market Analysis and Trends

The 2026 trading card market is characterized by several key trends. Premium parallels and numbered inserts continue to outperform base cards by significant margins. The shift toward modern chrome and refractor technology has created a two-tier market where high-end products command increasingly premium prices.

Vintage cards from the 1990s are experiencing a renaissance driven by nostalgia and the MCU's incorporation of characters from that era. Sets like the 1992 Marvel Masterpieces and 1994 Flair Marvel are seeing renewed interest as collectors seek out affordable entry points with significant upside potential.

## Investment Strategy for Collectors

Building a profitable Marvel card portfolio requires a disciplined approach. Diversification across eras, characters, and product types reduces risk while maintaining exposure to potential breakout performers. The key is identifying undervalued characters before their MCU prominence is officially confirmed.

Dollar-cost averaging into premium products during quiet periods between major announcements is a proven strategy. When the market heats up around release dates, having already secured positions at lower prices provides significant advantage over reactive buyers.

## What Comes Next

The road ahead is filled with both certainty and speculation. Confirmed projects provide a roadmap for near-term card market movement, while rumors and leaks create speculative opportunities for those willing to take calculated risks. The intersection of entertainment news and collectibles market analysis has never been more relevant.

For collectors who stay informed, maintain discipline, and act on conviction, the current environment offers generational opportunities. The MCU's continued expansion ensures that the Marvel trading card market will remain dynamic and profitable for years to come.

#### Market Signal

Premium Marvel card values are trending upward across all major product lines. Chrome refractors, numbered parallels, and autograph cards are leading the charge with 25-40% gains year-over-year on confirmed MCU characters.`;

const TEMPLATES: { id: ArticleTemplate; name: string; icon: any; description: string }[] = [
  { id: "classic", name: "Classic", icon: Newspaper, description: "Standard linear layout with hero image, flowing content, and mid-article banners" },
  { id: "magazine", name: "Magazine", icon: Layout, description: "Pull quotes, alternating section backgrounds, decorative icons, and visual variety" },
  { id: "spotlight", name: "Spotlight", icon: Target, description: "Two-column with sticky sidebar showing characters, market impact, and article navigation" },
  { id: "timeline", name: "Timeline", icon: Clock, description: "Visual timeline with colored node markers, connecting lines, and chronological flow" },
  { id: "listicle", name: "Listicle", icon: Hash, description: "Numbered cards with color-coded rank badges, gradient backgrounds, and summary box" },
];

export default function TemplateShowcase() {
  const [activeTemplate, setActiveTemplate] = useState<ArticleTemplate>("magazine");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold">Article Template Showcase</h1>
                <p className="text-xs text-muted-foreground">Preview all 5 layouts with sample content</p>
              </div>
            </div>
          </div>

          {/* Template Selector Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {TEMPLATES.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTemplate(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTemplate === t.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Template Description */}
      <div className="container py-6">
        <div className="bg-card/50 border border-border/50 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            {(() => {
              const t = TEMPLATES.find((t) => t.id === activeTemplate)!;
              const Icon = t.icon;
              return (
                <>
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">{t.name} Template</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{t.description}</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Template Render */}
        <div className="max-w-5xl mx-auto">
          <ArticleTemplateRenderer
            template={activeTemplate}
            content={SAMPLE_CONTENT}
            title="Sample Article: The Future of Marvel Trading Cards in 2026"
            featuredImageUrl="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/mcu-intel-card-market-Lt56dsta4y7Hzfj6pzAysR.webp"
            category="analysis"
            cardMarketImpact="Premium Marvel card values are trending upward across all major product lines. Chrome refractors, numbered parallels, and autograph cards are leading the charge with 25-40% gains year-over-year on confirmed MCU characters."
            tags={["Marvel Cards", "Investment", "MCU Phase 6", "Collecting Guide", "Market Analysis"]}
            excerpt="A comprehensive look at the current state of Marvel trading cards and what collectors need to know heading into the second half of 2026."
          />
        </div>
      </div>
    </div>
  );
}
