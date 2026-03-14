/**
 * Star Wars Category Page - Coming June 2026 with Mandalorian movie tie-in
 */

import { getProductsByCategory } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Calendar, Film, Sparkles } from "lucide-react";

const STARWARS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/starwars-category-bg-WqLKRyttqRtq3ztxa82myb.webp";

export default function StarWars() {
  const starWarsProducts = getProductsByCategory("starwars");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={STARWARS_BG} alt="" className="w-full h-full object-cover" loading="eager" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="container relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/15 border border-cyan-500/30 rounded-full mb-6">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-bold tracking-wide">COMING JUNE 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            <span className="text-cyan-400">STAR WARS</span> COLLECTION
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Premium Star Wars trading card repacks featuring the most sought-after cards from across the galaxy. Launching this summer to coincide with The Mandalorian &amp; Grogu theatrical release.
          </p>
        </div>
      </section>

      {/* Coming Soon Announcement */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="bg-card/80 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 lg:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                  <span className="text-cyan-400">SHADOWS OF</span>
                  <br />
                  THE FORCE
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Our premium Star Wars trading card repack is currently in grading with AGS, CGC, and PSA. We're timing the release with The Mandalorian &amp; Grogu movie this summer for maximum excitement. Every pack will include professionally graded slabs and guaranteed hits.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                      <Film className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-sm text-gray-300">Timed with The Mandalorian &amp; Grogu release</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-sm text-gray-300">Includes AGS, CGC & PSA graded slabs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-sm text-gray-300">Limited to 500 packs — sign up for early access</span>
                  </div>
                </div>
                <Link href="/subscribe">
                  <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                    Get Notified
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Product Card Preview */}
              <div>
                {starWarsProducts.length > 0 ? (
                  <ProductCard product={starWarsProducts[0]} />
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl border border-cyan-500/10 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-cyan-400/30" style={{ fontFamily: "'Anton', sans-serif" }}>JUNE</p>
                      <p className="text-6xl font-bold text-cyan-400/20" style={{ fontFamily: "'Anton', sans-serif" }}>2026</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA to Marvel */}
      <section className="py-12 border-t border-border">
        <div className="container text-center">
          <p className="text-muted-foreground text-lg mb-4">
            Can't wait? Check out our Marvel repacks — available now!
          </p>
          <Link href="/marvel">
            <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
              Shop Marvel Repacks
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
