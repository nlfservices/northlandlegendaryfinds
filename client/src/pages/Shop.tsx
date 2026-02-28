/**
 * Shop Page - All products grid with category filters
 * Design: Giant Sports Cards inspired dark grid layout
 */

import { useState } from "react";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

type Filter = "all" | "marvel" | "starwars" | "repacks" | "sealed";

export default function Shop() {
  const [filter, setFilter] = useState<Filter>("all");

  const filteredProducts = products.filter((p) => {
    if (filter === "all") return true;
    if (filter === "marvel") return p.category === "marvel";
    if (filter === "starwars") return p.category === "starwars";
    if (filter === "repacks") return p.isRepack;
    if (filter === "sealed") return !p.isRepack;
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All Products" },
    { key: "repacks", label: "Repacks" },
    { key: "sealed", label: "Sealed Product" },
    { key: "marvel", label: "Marvel" },
    { key: "starwars", label: "Star Wars" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            <span className="text-primary">SHOP</span> ALL
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse our complete collection of premium trading card products
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

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

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
