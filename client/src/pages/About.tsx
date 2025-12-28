/**
 * About Page
 */

import { Card, CardContent } from "@/components/ui/card";
import { Shield, Sparkles, TrendingUp, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
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
            ABOUT US
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Premium Marvel trading card repacks from collectors, for collectors
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur border-2 border-primary/30 mb-12">
              <CardContent className="p-12">
                <h2 className="text-4xl font-bold mb-6 text-center">
                  OUR MISSION
                </h2>
                <p className="text-lg text-muted-foreground text-center mb-6">
                  Northland Legendary Finds was founded by passionate Marvel collectors who understand the thrill of discovering rare cards. We specialize in curating premium repack boxes featuring cards from Topps Chrome Marvel, Comic Book Heroes, and Marvel Mint collections.
                </p>
                <p className="text-lg text-muted-foreground text-center">
                  Every repack is carefully assembled to ensure collectors receive authentic, high-quality cards with guaranteed hits. Whether you're completing your collection or hunting for that elusive chase card, we're here to help you find your legendary cards.
                </p>
              </CardContent>
            </Card>

            {/* Values Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-card/50 backdrop-blur border-2 border-primary/30">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">100% Authentic</h3>
                  <p className="text-muted-foreground">
                    Every card is verified authentic from official Topps releases. We never sell counterfeits or reproductions.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-2 border-secondary/30">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Expert Curation</h3>
                  <p className="text-muted-foreground">
                    Our team of collectors carefully curates each repack to ensure exciting pulls and fair value.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-2 border-accent/30">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Collector First</h3>
                  <p className="text-muted-foreground">
                    We're collectors ourselves and treat every customer with the respect and service we'd want.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Our Collection */}
            <Card className="bg-card/50 backdrop-blur border-2 border-primary/30 mb-12">
              <CardContent className="p-12">
                <h2 className="text-4xl font-bold mb-6 text-center">
                  OUR COLLECTION
                </h2>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-5xl font-bold text-primary mb-2">387</div>
                    <div className="text-muted-foreground">Total Cards</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-secondary mb-2">273</div>
                    <div className="text-muted-foreground">Unique Characters</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-accent mb-2">3</div>
                    <div className="text-muted-foreground">Premium Sets</div>
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <span className="font-semibold">Topps Chrome Marvel</span>
                    <span className="text-primary">120 cards (CHROME-081 to CHROME-200)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <span className="font-semibold">Comic Book Heroes</span>
                    <span className="text-secondary">147 cards (CBH-001 to CBH-147)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <span className="font-semibold">Marvel Mint</span>
                    <span className="text-accent">120 cards (MINT-001 to MINT-120)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <Card className="bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 border-2 border-primary/50">
              <CardContent className="p-12 text-center">
                <Mail className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-4xl font-bold mb-4">
                  GET IN TOUCH
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Questions about our cards or repacks? We'd love to hear from you!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/characters">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Browse Characters
                    </Button>
                  </Link>
                  <Link href="/sets">
                    <Button size="lg" variant="outline">
                      View Card Sets
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
