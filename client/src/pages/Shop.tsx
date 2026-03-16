/**
 * Shop Page - Products organized by product lines
 * Design: Product lines as sections with category filters
 */

import { useState } from "react";
import { products, getProductLines } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Zap, Clock } from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

type Filter = "all" | "repacks" | "sealed" | "variant-series" | "snap-collection" | "multiverse-vault";

export default function Shop() {
  const [filter, setFilter] = useState<Filter>("all");
  const productLines = getProductLines();

  const filteredProducts = products.filter((p) => {
    if (filter === "all") return true;
    if (filter === "repacks") return p.isRepack;
    if (filter === "sealed") return !p.isRepack;
    if (filter === "variant-series") return p.productLine === "variant-series";
    if (filter === "snap-collection") return p.productLine === "snap-collection";
    if (filter === "multiverse-vault") return p.productLine === "multiverse-vault";
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All Products" },
    { key: "variant-series", label: "Variant Series" },
    { key: "snap-collection", label: "Snap Collection" },
    { key: "multiverse-vault", label: "Multiverse Vault" },
    { key: "sealed", label: "Sealed Boxes" },
  ];

  // Group filtered products by product line for organized display
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

      {/* Filters + Grid */}
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
              {/* THE VARIANT SERIES */}
              {variantProducts.length > 0 && (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full">
                        <Zap className="w-3.5 h-3.5 text-primary" />
                        <span className="text-primary text-xs font-bold">AVAILABLE MARCH 27TH</span>
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                      THE <span className="text-primary">VARIANT</span> SERIES
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">Our flagship Marvel repack line — launching March 27th</p>
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
