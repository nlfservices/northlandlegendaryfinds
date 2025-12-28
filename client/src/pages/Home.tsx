/**
 * Homepage - Northland Legendary Finds
 * Design: Comic Book Noir Meets Modern Collecting
 * - Full-screen hero with dramatic Marvel imagery
 * - Floating card showcases with depth
 * - Bold typography and vibrant accents
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, TrendingUp, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/banners/marvel_heroes_leaders_banner.png')",
            filter: "brightness(0.4)",
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/50 rounded-full px-6 py-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Premium Marvel Trading Cards</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold leading-none">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                LEGENDARY
              </span>
              <br />
              <span className="text-foreground">FINDS AWAIT</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Discover rare Marvel trading cards from <span className="text-primary font-semibold">Topps Chrome</span>, 
              <span className="text-secondary font-semibold"> Comic Book Heroes</span>, and 
              <span className="text-accent font-semibold"> Marvel Mint</span> collections.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sets">
                <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50">
                  Explore Card Sets
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/characters">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-primary/50 hover:bg-primary/10">
                  Browse Characters
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">387</div>
                <div className="text-sm text-muted-foreground">Trading Cards</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary">3</div>
                <div className="text-sm text-muted-foreground">Premium Sets</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent">100+</div>
                <div className="text-sm text-muted-foreground">Characters</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Card Sets */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              FEATURED COLLECTIONS
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore our premium Marvel trading card sets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Topps Chrome Marvel */}
            <Card className="group relative overflow-hidden bg-card/50 backdrop-blur border-2 border-primary/30 hover:border-primary transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8 relative z-10">
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-3">TOPPS CHROME</h3>
                <p className="text-muted-foreground mb-6">
                  120 premium chrome cards featuring modern Marvel heroes and villains with stunning refractor technology.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">120 Cards</span>
                  <Link href="/sets/chrome">
                    <Button variant="ghost" className="group-hover:text-primary">
                      View Set <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Comic Book Heroes */}
            <Card className="group relative overflow-hidden bg-card/50 backdrop-blur border-2 border-secondary/30 hover:border-secondary transition-all hover:shadow-2xl hover:shadow-secondary/30 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8 relative z-10">
                <div className="w-16 h-16 bg-secondary/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-3xl font-bold mb-3">COMIC BOOK HEROES</h3>
                <p className="text-muted-foreground mb-6">
                  147 cards spanning Marvel's rich history from 1975 to 2025, celebrating iconic heroes across generations.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-secondary">147 Cards</span>
                  <Link href="/sets/comic-book-heroes">
                    <Button variant="ghost" className="group-hover:text-secondary">
                      View Set <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Marvel Mint */}
            <Card className="group relative overflow-hidden bg-card/50 backdrop-blur border-2 border-accent/30 hover:border-accent transition-all hover:shadow-2xl hover:shadow-accent/30 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8 relative z-10">
                <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-3xl font-bold mb-3">MARVEL MINT</h3>
                <p className="text-muted-foreground mb-6">
                  120 pristine cards organized by rarity tiers: Bronze, Silver, Gold, and Platinum featuring Marvel's elite.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">120 Cards</span>
                  <Link href="/sets/marvel-mint">
                    <Button variant="ghost" className="group-hover:text-accent">
                      View Set <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              WHY COLLECTORS CHOOSE US
            </h2>
            <p className="text-xl text-muted-foreground">
              Premium quality, authentic cards, expert curation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">100% Authentic</h3>
              <p className="text-muted-foreground">
                Every card is verified authentic from official Topps releases. No counterfeits, ever.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold">Curated Repacks</h3>
              <p className="text-muted-foreground">
                Expertly curated repack boxes with guaranteed hits and chase cards in every pack.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Investment Grade</h3>
              <p className="text-muted-foreground">
                Track market values and build a collection that appreciates over time.
              </p>
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
                START YOUR COLLECTION TODAY
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of collectors discovering rare Marvel trading cards. Browse our complete catalog of 387 cards across three premium sets.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/characters">
                  <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                    Browse All Characters
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-primary/50">
                    Shop Repacks
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
