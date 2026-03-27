/**
 * Shop Page - Pyramid layout with Gambit's Deck featured at the top
 * Design: Featured hero product → Variant Series → Coming Soon tiers
 */

import { useState } from "react";
import { products, getFeaturedProduct } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Zap, Clock, Eye, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

type Filter = "all" | "repacks" | "sealed" | "gambit-deck" | "variant-series" | "snap-collection" | "multiverse-vault";

export default function Shop() {
  const [filter, setFilter] = useState<Filter>("all");
  const featuredProduct = getFeaturedProduct();

  const filteredProducts = products.filter((p) => {
    if (filter === "all") return true;
    if (filter === "repacks") return p.isRepack;
    if (filter === "sealed") return !p.isRepack;
    if (filter === "gambit-deck") return p.productLine === "gambit-deck";
    if (filter === "variant-series") return p.productLine === "variant-series";
    if (filter === "snap-collection") return p.productLine === "snap-collection";
    if (filter === "multiverse-vault") return p.productLine === "multiverse-vault";
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All Products" },
    { key: "gambit-deck", label: "Gambit's Deck" },
    { key: "variant-series", label: "Variant Series" },
    { key: "snap-collection", label: "Snap Collection" },
    { key: "multiverse-vault", label: "Multiverse Vault" },
    { key: "sealed", label: "Sealed Boxes" },
  ];

  // Group filtered products by product line for organized display
  const gambitProducts = filteredProducts.filter(p => p.productLine === "gambit-deck");
  const variantProducts = filteredProducts.filter(p => p.productLine === "variant-series");
  const snapProducts = filteredProducts.filter(p => p.productLine === "snap-collection");
  const mvProducts = filteredProducts.filter(p => p.productLine === "multiverse-vault");
  const sealedProducts = filteredProducts.filter(p => !p.isRepack);

  // For "all" view, show organized sections. For filtered, show flat grid.
  const showSections = filter === "all";

  return (
    <div className="min-h-screen">
      <SEO
        title="Shop Premium Marvel Trading Card Repacks"
        description="Browse our collection of premium Marvel trading card repacks. Strong floor, loaded middle, healthy ceiling. Featuring Topps Chrome, Comic Book Heroes, and Marvel Mint."
        path="/shop"
        jsonLd={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Shop", url: "/shop" }])}
      />
      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            <span className="text-primary">SHOP</span> ALL
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse our complete collection of premium Marvel trading card repacks
          </p>
        </div>
      </section>

      {/* ===== PYRAMID TOP: GAMBIT'S DECK FEATURED HERO ===== */}
      {showSections && featuredProduct && (
        <section className="py-12 md:py-16 relative overflow-hidden">
          {/* Magenta/purple gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-950/30 via-background to-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[120px]" />

          <div className="container relative z-10">
            {/* Featured badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-fuchsia-500/15 border border-fuchsia-500/30 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
                <span className="text-fuchsia-400 text-sm font-bold tracking-wide">FEATURED — PREVIEW OUR CHECKLIST SYSTEM</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-fuchsia-400">GAMBIT'S</span> DECK
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                52 single-card Marvel packs themed after Gambit's legendary playing cards. 
                The only NLF set with a pre-revealed checklist — see exactly what you're chasing.
              </p>
            </div>

            {/* Hero product card — centered, larger */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600/40 via-purple-600/40 to-fuchsia-600/40 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative bg-card border-2 border-fuchsia-500/30 rounded-2xl overflow-hidden">
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-fuchsia-600 text-white text-xs font-bold tracking-wider rounded-full shadow-lg">
                      DROPPING MAY 22
                    </span>
                  </div>

                  {/* Product Image */}
                  <Link href={`/product/${featuredProduct.slug}`}>
                    <div className="aspect-[3/4] overflow-hidden cursor-pointer">
                      <img
                        src={featuredProduct.image}
                        alt={featuredProduct.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>
                      {featuredProduct.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">{featuredProduct.subtitle}</p>
                    
                    {/* Card tier breakdown */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-fuchsia-950/50 border border-fuchsia-500/20 rounded-lg p-2 text-center">
                        <div className="text-fuchsia-400 text-xs font-bold">ACES</div>
                        <div className="text-[10px] text-muted-foreground">The Chase</div>
                      </div>
                      <div className="bg-purple-950/50 border border-purple-500/20 rounded-lg p-2 text-center">
                        <div className="text-purple-400 text-xs font-bold">FACE</div>
                        <div className="text-[10px] text-muted-foreground">The Hits</div>
                      </div>
                      <div className="bg-slate-800/50 border border-slate-600/20 rounded-lg p-2 text-center">
                        <div className="text-slate-300 text-xs font-bold">NUMBER</div>
                        <div className="text-[10px] text-muted-foreground">The Base</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl font-bold text-primary">${featuredProduct.price}</div>
                      <div className="text-sm text-muted-foreground">{featuredProduct.packCount} packs</div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-2">
                      <Link href={`/product/${featuredProduct.slug}`}>
                        <Button className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold">
                          View Product
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link href={`/checklist/${featuredProduct.checklistSlug || featuredProduct.dbSlug}`}>
                        <Button variant="outline" className="w-full border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-500/10 hover:text-fuchsia-300">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Full Checklist
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist preview callout */}
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-card/50 border border-fuchsia-500/20 rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="text-fuchsia-400 font-bold">Why preview the checklist?</span> — We believe in full transparency. 
                  See every card in the set before you buy. This is how all NLF checklists work — 
                  Gambit's Deck is the first to go live.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== PYRAMID MIDDLE & BOTTOM: FILTERS + PRODUCT LINES ===== */}
      <section className="py-10">
        <div className="container">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all ${
                  filter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>

          {showSections ? (
            <div className="space-y-16">
              {/* GAMBIT'S DECK (in grid form when scrolled past hero) */}
              {gambitProducts.length > 0 && (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                        <span className="text-fuchsia-400 text-xs font-bold">DROPPING MAY 22ND</span>
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                      <span className="text-fuchsia-400">GAMBIT'S</span> DECK
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">52 single-card packs — the only set with a pre-revealed checklist</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {gambitProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* THE VARIANT SERIES */}
              {variantProducts.length > 0 && (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full">
                        <Zap className="w-3.5 h-3.5 text-primary" />
                        <span className="text-primary text-xs font-bold">AVAILABLE APRIL 27TH</span>
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                      THE <span className="text-primary">VARIANT</span> SERIES
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">Our flagship Marvel repack line — launching April 27th</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {variantProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* THE SNAP COLLECTION */}
              {snapProducts.length > 0 && (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400 text-xs font-bold">COMING SOON</span>
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                      THE <span className="text-cyan-400">SNAP</span> COLLECTION
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">Iconic Marvel moments in every pack</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {/* Deduplicate — show one card per unique name */}
                    {snapProducts
                      .filter((p, i, arr) => arr.findIndex(x => x.name === p.name) === i)
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </div>
              )}

              {/* MULTIVERSE VAULT */}
              {mvProducts.length > 0 && (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-purple-400 text-xs font-bold">COMING SOON</span>
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                      <span className="text-purple-400">MULTIVERSE</span> VAULT
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">Deep cuts from across the Marvel multiverse</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {/* Deduplicate — show one card per unique name */}
                    {mvProducts
                      .filter((p, i, arr) => arr.findIndex(x => x.name === p.name) === i)
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </div>
              )}

              {/* SEALED BOXES */}
              {sealedProducts.length > 0 && (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400 text-xs font-bold">COMING SOON</span>
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                      <span className="text-amber-400">SEALED</span> BOXES
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">Factory-sealed Topps hobby boxes</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {sealedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Filtered flat grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts
                .filter((p, i, arr) => {
                  // For coming soon lines, deduplicate by name
                  if (p.isComingSoon) return arr.findIndex(x => x.name === p.name) === i;
                  return true;
                })
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl font-bold text-muted-foreground mb-2">No products found</p>
              <p className="text-muted-foreground">Try a different filter</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
