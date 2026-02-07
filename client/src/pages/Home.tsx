/**
 * Homepage - Hit Parade Collection inspired layout with NLF cosmic branding
 * Design: Product-focused e-commerce homepage with bold typography
 * Colors: Green, Purple, Teal, Gold from NLF logo
 */

import { ShoppingCart, Star, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full width with cosmic background */}
      <section className="relative h-[600px] flex items-center justify-center space-bg overflow-hidden">
        {/* Decorative orbital rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-[800px] h-[800px] border-2 border-accent rounded-full orbit-ring"></div>
        </div>
        
        <div className="container relative z-10 text-center">
          <div className="inline-block px-6 py-2 bg-primary/20 border border-primary rounded-full mb-6">
            <span className="text-primary font-bold tracking-wider text-sm">
              ⚡ PREMIUM TOPPS TRADING CARDS
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 glow-green">
            LEGENDARY
            <br />
            <span className="gradient-text">FINDS AWAIT</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover premium <span className="text-primary font-bold">Marvel</span> and{" "}
            <span className="text-secondary font-bold">Star Wars</span> trading card repacks.
            <br />
            100% authentic Topps cards with guaranteed hits in every box.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marvel">
              <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 glow-green">
                <ShoppingCart className="mr-2" />
                Shop Marvel
              </Button>
            </Link>
            <Link href="/star-wars">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-secondary text-secondary hover:bg-secondary/10">
                <ShoppingCart className="mr-2" />
                Shop Star Wars
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-y border-border">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">387+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Unique Cards</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">100%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Authentic</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">6</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Premium Sets</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">Fast</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Shipping</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products - Marvel */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-primary mb-4">
              TRENDING MARVEL REPACKS
            </h2>
            <p className="text-muted-foreground text-lg">
              Our most popular Marvel trading card collections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product Card 1 */}
            <div className="bg-card rounded-lg overflow-hidden glow-purple hover:scale-105 transition-transform">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <div className="text-6xl">🦸</div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">Topps Chrome Marvel</h3>
                <p className="text-sm text-muted-foreground mb-4">120 premium chrome cards</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">$149.95</span>
                  <Button className="bg-primary hover:bg-primary/90">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="bg-card rounded-lg overflow-hidden glow-purple hover:scale-105 transition-transform">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <div className="text-6xl">⚡</div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">Comic Book Heroes</h3>
                <p className="text-sm text-muted-foreground mb-4">147 cards spanning 50 years</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">$129.95</span>
                  <Button className="bg-primary hover:bg-primary/90">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="bg-card rounded-lg overflow-hidden glow-purple hover:scale-105 transition-transform">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <div className="text-6xl">💎</div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">Marvel Mint Collection</h3>
                <p className="text-sm text-muted-foreground mb-4">120 pristine graded cards</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">$199.95</span>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Card 4 */}
            <div className="bg-card rounded-lg overflow-hidden glow-purple hover:scale-105 transition-transform">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <div className="text-6xl">🎯</div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">Legendary Case Hits</h3>
                <p className="text-sm text-muted-foreground mb-4">Guaranteed autographs</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">$549.95</span>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/marvel">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                View All Marvel Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Blocks */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 glow-green">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">100% Authentic</h3>
              <p className="text-muted-foreground">
                Every card is verified authentic from official Topps releases. No counterfeits, ever.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 glow-teal">
                <Star className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Guaranteed Hits</h3>
              <p className="text-muted-foreground">
                Expertly curated repack boxes with guaranteed chase cards and autographs in every pack.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 glow-gold">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Investment Grade</h3>
              <p className="text-muted-foreground">
                Build a collection that appreciates over time with premium cards from the hottest sets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Star Wars Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-secondary mb-4">
              STAR WARS COLLECTION
            </h2>
            <p className="text-muted-foreground text-lg">
              Premium Topps Star Wars trading cards from a galaxy far, far away
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Star Wars Product 1 */}
            <div className="bg-card rounded-lg overflow-hidden glow-teal hover:scale-105 transition-transform">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <div className="text-6xl">🚀</div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">Chrome Star Wars</h3>
                <p className="text-sm text-muted-foreground mb-4">Premium chrome finish cards</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-secondary">$149.95</span>
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Star Wars Product 2 */}
            <div className="bg-card rounded-lg overflow-hidden glow-teal hover:scale-105 transition-transform">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <div className="text-6xl">⚔️</div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">Chrome Galaxy</h3>
                <p className="text-sm text-muted-foreground mb-4">Galactic heroes and villains</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-secondary">$129.95</span>
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Star Wars Product 3 */}
            <div className="bg-card rounded-lg overflow-hidden glow-teal hover:scale-105 transition-transform">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <div className="text-6xl">💫</div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">Chrome Sapphire</h3>
                <p className="text-sm text-muted-foreground mb-4">Ultra-premium sapphire edition</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">$299.95</span>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/star-wars">
              <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                View All Star Wars Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-4">BECOME AN INSIDER</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Sign up to be the first to know about new releases, exclusive drops, and special offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
              Sign Up
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
