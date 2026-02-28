/**
 * Marvel Category Page - Marvel products with themed hero
 */

import { getProductsByCategory } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const MARVEL_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/marvel-category-bg-H7jvz2QMRU6BGR7bwwNJ89.webp";

export default function Marvel() {
  const marvelProducts = getProductsByCategory("marvel");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={MARVEL_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="container relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            <span className="text-red-500">MARVEL</span> COLLECTION
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Premium Marvel trading card repacks and sealed products. From Topps Chrome to Marvel Mint — find your next legendary pull.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="container">
          <p className="text-sm text-muted-foreground mb-6">
            {marvelProducts.length} product{marvelProducts.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {marvelProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
