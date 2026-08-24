import { mediaUrl } from "../lib/mediaUrl";
import { Shield, Star, ArrowRight, Zap, BookOpen, Clock, Eye, HelpCircle, Gift, Users } from "lucide-react";
import LegendaryListForm from "@/components/LegendaryListForm";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getProductLines, getFeaturedProduct } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { TRUST_BG } from "./homeShared";

export default function HomeRest() {
  const productLines = getProductLines();
  const variantSeries = productLines.find(l => l.id === "variant-series");
  const gambitProduct = getFeaturedProduct();
  const comingSoonLines = productLines.filter(l => !l.available);

  return (
    <>
      {/* ===== WHATNOT SECTION MOVED TO POSITION 3 ===== */}

      {/* ===== 10. WHAT IS A REPACK? — SIMPLIFIED FOR BEGINNERS ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        {/* Deep Black Background */}
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full mb-4">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-bold tracking-wide">GOOD QUESTION</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHAT IS A <span className="text-primary">REPACK</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Think of it like a curated gift box of trading cards. Instead of buying a random pack from the store, you get a hand-picked selection that's been put together by someone who actually knows the cards. Every NLF repack includes a mix of common cards and rare ones — and we publish the full list of what could be inside so there are no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card/80 border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Hand-Picked Cards</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every pack is assembled by hand — not randomly generated. We choose cards that make the experience fun and worth your money.
              </p>
            </div>
            <div className="bg-card/80 border border-border rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Rare Cards Included</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every pack includes special cards — limited editions, rare versions, or professionally graded cards that have been verified by experts.
              </p>
            </div>
            <div className="bg-card/80 border border-border rounded-xl p-6 text-center hover:border-cyan-500/30 transition-colors">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">No Surprises</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We publish a full checklist for every pack so you can see exactly what's possible before you buy. Complete transparency — always.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 11. PRODUCT PYRAMID — REPACKS (SECONDARY) ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        {/* Deep Purple Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-purple-950/95 to-purple-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-800/15 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold">READY TO START COLLECTING?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              OUR <span className="text-primary">PACKS</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              When you're ready to start your collection, these hand-built packs are a great way to jump in
            </p>
          </div>

          {/* Pyramid Tier 1: Gambit's Deck — Featured at Top */}
          {gambitProduct && (
            <div className="max-w-xl mx-auto mb-8">
              <div className="text-center mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">Featured — See Every Card Before You Buy</span>
              </div>
              <Link href={`/product/${gambitProduct.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl border-2 border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-950/40 via-card to-purple-950/40 hover:border-fuchsia-400/60 transition-all duration-300 shadow-lg shadow-fuchsia-500/10 hover:shadow-fuchsia-500/20">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-500" />
                  <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative shrink-0">
                      <div className="absolute -inset-4 bg-fuchsia-500/15 rounded-full blur-2xl" />
                      <img
                        src={mediaUrl(gambitProduct.image)}
                        alt={gambitProduct.name}
                        className="relative w-40 h-40 sm:w-48 sm:h-48 object-contain drop-shadow-[0_0_20px_rgba(217,70,239,0.3)] group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-fuchsia-500/15 border border-fuchsia-500/30 rounded-full text-xs font-bold text-fuchsia-400 mb-3">
                        <Clock className="w-3 h-3" /> DROPPING MAY 22
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                        {gambitProduct.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        52 single-card packs themed after Gambit's playing cards. The full checklist is published — you can see every possible card before you buy.
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                        <span className="text-2xl font-bold text-fuchsia-400" style={{ fontFamily: "'Anton', sans-serif" }}>${gambitProduct.price}</span>
                        <span className="text-sm text-muted-foreground">52 packs</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-fuchsia-500/20 px-6 py-3 flex items-center justify-between bg-fuchsia-500/5">
                    <span
                      className="text-sm font-bold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1.5 cursor-pointer"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = '/checklist/nlf-marvel-52-singles'; }}
                    >
                      <Eye className="w-4 h-4" /> See the Full Checklist
                    </span>
                    <span className="text-sm font-bold text-primary flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      View Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Pyramid Tier 2: VARIANT SERIES Products Below */}
          {variantSeries && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Launching April 27th</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {variantSeries.products.map((product) => (
                  <ProductCard key={product.id} product={product} featured />
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/checklists">
              <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
                View Cosmic Hits
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 12. TRUST / WHY NLF ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        {/* Rich Gold/Amber Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950 via-amber-950/95 to-amber-950" />
        <div className="absolute inset-0">
          <img src={TRUST_BG} alt="" className="w-full h-full object-cover opacity-15" loading="lazy" decoding="async" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-800/15 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHY <span className="text-primary">NLF</span>?
            </h2>
            <p className="text-muted-foreground text-lg">
              What makes Northland Legendary Finds different
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">100% Real Cards</h3>
              <p className="text-sm text-muted-foreground">
                Every card comes from official Topps releases. No fakes, no knockoffs — guaranteed authentic.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-cyan-500/30 transition-colors">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Free Resources</h3>
              <p className="text-sm text-muted-foreground">
                Card database, character profiles, market prices, and beginner guides — all free, no account needed.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Full Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Every pack has a published checklist. You can see what's possible before you spend a dollar.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-purple-500/30 transition-colors">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Built by Fans</h3>
              <p className="text-sm text-muted-foreground">
                We're collectors and fans ourselves. This isn't a corporation — it's a passion project built for people like us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 13. COMING SOON PRODUCT LINES ===== */}
      {comingSoonLines.length > 0 && (
        <section className="relative py-16 lg:py-20 overflow-hidden">
          {/* Deep Black Background */}
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-cyan-400">COMING</span> SOON
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                More packs on the way. Sign up to be the first to know when they drop.
              </p>
            </div>

            <div className="space-y-12">
              {comingSoonLines.map((line) => (
                <div key={line.id}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                      {line.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">{line.tagline}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {line.products
                      .filter((p, i, arr) => arr.findIndex(x => x.name === p.name) === i)
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 14. JOIN OUR COMMUNITY ===== */}
      <section className="relative py-14 lg:py-18 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-background to-background" />
        <div className="container relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              JOIN THE <span className="text-blue-400">COMMUNITY</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay connected with fellow collectors. Get breaking MCU news, live stream alerts, and exclusive drops.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/northlandlegendaryfinds"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 group-hover:scale-110 transition-all">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">Facebook</h3>
              <p className="text-sm text-muted-foreground">Like our page for daily MCU news & card market updates</p>
              <span className="inline-block mt-3 text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">Like Page &rarr;</span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/northlandlegendaryfinds"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/10 transition-all"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 group-hover:scale-110 transition-all">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-pink-400 transition-colors">Instagram</h3>
              <p className="text-sm text-muted-foreground">Follow for card reveals, grading results & behind the scenes</p>
              <span className="inline-block mt-3 text-sm font-bold text-pink-400 group-hover:text-pink-300 transition-colors">Follow Us &rarr;</span>
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com/NorthlandFinds"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-gray-400/40 hover:shadow-lg hover:shadow-gray-400/10 transition-all"
            >
              <div className="w-16 h-16 bg-black border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-white/10 group-hover:scale-110 transition-all">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-white transition-colors">X (Twitter)</h3>
              <p className="text-sm text-muted-foreground">Breaking news, hot takes & collector community threads</p>
              <span className="inline-block mt-3 text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Follow Us &rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* ===== 15. LEGENDARY LIST SIGNUP ===== */}
      <LegendaryListForm variant="section" source="homepage-inline" />
    </>
  );
}
