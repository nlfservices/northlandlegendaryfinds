/**
 * Card Sets Page
 * Design: Overview of all three Marvel trading card sets
 * - Grid layout with set details
 * - Links to individual set pages
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "wouter";

const cardSets = [
  {
    id: "chrome",
    name: "Topps Chrome Marvel",
    description: "Premium chrome finish cards featuring modern Marvel heroes and villains with stunning refractor technology. Cards numbered 1-200 with special insert sets.",
    cardCount: 120,
    range: "CHROME-081 to CHROME-200",
    icon: Shield,
    color: "primary",
    features: [
      "Chrome refractor finish",
      "Modern character roster",
      "Parallel variations",
      "Premium card stock"
    ]
  },
  {
    id: "comic-book-heroes",
    name: "2025 Topps Marvel Comic Book Heroes",
    description: "Spanning Marvel's rich history from 1975 to 2025, this comprehensive set celebrates iconic heroes across four distinct eras of comic book excellence.",
    cardCount: 147,
    range: "CBH-001 to CBH-147",
    icon: TrendingUp,
    color: "secondary",
    features: [
      "Four era groupings (1975, 1976, 2000's, 2025)",
      "Classic and modern heroes",
      "Comic book artwork",
      "Artist autograph cards"
    ]
  },
  {
    id: "marvel-mint",
    name: "Topps Marvel Mint",
    description: "Pristine cards organized by rarity tiers: Bronze, Silver, Gold, and Platinum. Each tier features progressively more iconic and valuable characters.",
    cardCount: 120,
    range: "MINT-001 to MINT-120",
    icon: Sparkles,
    color: "accent",
    features: [
      "Four rarity tiers",
      "Premium Platinum tier",
      "Gambit's Deck playing cards",
      "SDCC exclusive Doctor Doom"
    ]
  }
];

export default function CardSets() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('/banners/marvel_heroes_banner.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            CARD SETS
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our complete collection of <span className="text-primary font-semibold">387 Marvel trading cards</span> across three premium Topps sets. Each set offers unique artwork, character rosters, and collecting opportunities.
          </p>
        </div>
      </section>

      {/* Card Sets Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {cardSets.map((set, index) => {
              const Icon = set.icon;
              const isEven = index % 2 === 0;
              
              return (
                <Card 
                  key={set.id}
                  className={`group relative overflow-hidden bg-card/50 backdrop-blur border-2 border-${set.color}/30 hover:border-${set.color} transition-all hover:shadow-2xl hover:shadow-${set.color}/30`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-${isEven ? 'r' : 'l'} from-${set.color}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <CardContent className="p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div className={isEven ? "" : "md:order-2"}>
                        <div className={`w-20 h-20 bg-${set.color}/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-10 h-10 text-${set.color}`} />
                        </div>
                        
                        <h2 className="text-4xl font-bold mb-4">{set.name}</h2>
                        
                        <div className="flex items-center space-x-4 mb-6">
                          <span className={`text-3xl font-bold text-${set.color}`}>
                            {set.cardCount} Cards
                          </span>
                          <span className="text-muted-foreground">
                            {set.range}
                          </span>
                        </div>
                        
                        <p className="text-lg text-muted-foreground mb-6">
                          {set.description}
                        </p>
                        
                        <Link href={`/sets/${set.id}`}>
                          <Button 
                            size="lg" 
                            className={`bg-${set.color} hover:bg-${set.color}/90`}
                          >
                            View Full Set
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </Button>
                        </Link>
                      </div>
                      
                      <div className={isEven ? "" : "md:order-1"}>
                        <div className="bg-card/80 rounded-lg p-6 border border-border">
                          <h3 className="text-xl font-bold mb-4">Set Features</h3>
                          <ul className="space-y-3">
                            {set.features.map((feature, i) => (
                              <li key={i} className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full bg-${set.color} mt-2`} />
                                <span className="text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              COLLECTION STATS
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">387</div>
              <div className="text-muted-foreground">Total Cards</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-secondary mb-2">273</div>
              <div className="text-muted-foreground">Unique Characters</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">3</div>
              <div className="text-muted-foreground">Premium Sets</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Authentic</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 border-2 border-primary/50">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                EXPLORE THE CHARACTER DATABASE
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Browse all 273 unique Marvel characters and see which cards feature your favorite heroes and villains.
              </p>
              <Link href="/characters">
                <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                  Browse Characters
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
