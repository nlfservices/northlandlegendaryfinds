/**
 * Star Wars Category Page - Star Wars products with themed hero
 */

import { getProductsByCategory } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const STARWARS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/starwars-category-bg-WqLKRyttqRtq3ztxa82myb.webp";

export default function StarWars() {
  const starWarsProducts = getProductsByCategory("starwars");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={STARWARS_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="container relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            <span className="text-cyan-400">STAR WARS</span> COLLECTION
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Premium Star Wars trading card repacks featuring the most sought-after cards from across the galaxy. From classic trilogy to modern era.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="container">
          <p className="text-sm text-muted-foreground mb-6">
            {starWarsProducts.length} product{starWarsProducts.length !== 1 ? "s" : ""}
          </p>
          {starWarsProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {starWarsProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl font-bold text-muted-foreground mb-2">Coming Soon</p>
              <p className="text-muted-foreground">Star Wars products will be available at launch</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
