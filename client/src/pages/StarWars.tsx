/**
 * Star Wars Category Page - Multiverse Vault Repack Products
 */

import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Target, Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const products = [
  {
    id: "starwars-entry-vault",
    name: "Entry Vault",
    price: 75,
    runSize: 100,
    positioning: "Entry level collection",
    tiers: [
      { name: "Floor", percent: "40%", packs: 40 },
      { name: "Strong Floor", percent: "30%", packs: 30 },
      { name: "Heat", percent: "20%", packs: 20 },
      { name: "Chaser", percent: "10%", packs: 10 },
    ],
    emoji: "🌟",
  },
  {
    id: "starwars-core-vault",
    name: "Core Vault",
    price: 150,
    runSize: 100,
    positioning: "Core collection tier",
    tiers: [
      { name: "Premium Floor", percent: "30%", packs: 30 },
      { name: "Strong Premium", percent: "30%", packs: 30 },
      { name: "Heat", percent: "25%", packs: 25 },
      { name: "Nuclear Chaser", percent: "15%", packs: 15 },
    ],
    emoji: "⚔️",
  },
  {
    id: "starwars-prime-vault",
    name: "Prime Vault",
    price: 300,
    runSize: 100,
    positioning: "Premium collection tier",
    badge: "BEST VALUE",
    tiers: [
      { name: "Premium Floor", percent: "28%", packs: 28 },
      { name: "Strong Premium", percent: "27%", packs: 27 },
      { name: "Major Heat", percent: "25%", packs: 25 },
      { name: "Elite Chaser", percent: "20%", packs: 20 },
    ],
    emoji: "🚀",
  },
  {
    id: "starwars-premium-vault",
    name: "Premium Vault",
    price: 500,
    runSize: 100,
    positioning: "High-end collection tier",
    tiers: [
      { name: "Premium Floor", percent: "32%", packs: 32 },
      { name: "Strong Premium", percent: "28%", packs: 28 },
      { name: "Grail Hits", percent: "24%", packs: 24 },
      { name: "Omega Chaser", percent: "16%", packs: 16 },
    ],
    emoji: "🛸",
  },
  {
    id: "starwars-legendary-vault",
    name: "Legendary Vault",
    price: 1000,
    runSize: 100,
    positioning: "Ultra-exclusive collection tier",
    badge: "PRESTIGE",
    tiers: [
      { name: "Elite Floor", percent: "35%", packs: 35 },
      { name: "Strong Elite", percent: "25%", packs: 25 },
      { name: "Grail Centerpiece", percent: "25%", packs: 25 },
      { name: "Legendary Chase", percent: "15%", packs: 15 },
    ],
    emoji: "🌌",
  },
];

export default function StarWars() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleAddToCart = (productName: string) => {
    toast.info(`"${productName}" - Shopify integration coming soon!`);
  };

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[350px] md:h-[400px] flex items-center justify-center space-bg overflow-hidden py-12 md:py-0">
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 glow-teal px-4">
            STAR WARS COLLECTION
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Premium Topps Star Wars trading card repacks with guaranteed hits
          </p>
          <p className="text-sm text-muted-foreground mt-4 px-4">
            All products feature 100-box run sizes • Transparent odds
          </p>
          <p className="text-xs text-muted-foreground mt-3 max-w-3xl mx-auto px-4">
            As of February 2026, the Multiverse Vault Star Wars Series has been finalized. The number of boxes (100 per product) and items will not be changed.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-card rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                  selectedProduct === product.id
                    ? "border-accent glow-teal"
                    : "border-border"
                }`}
                onClick={() => setSelectedProduct(product.id)}
              >
                <div className="relative p-6 bg-gradient-to-br from-sidebar/50 to-sidebar">
                  {product.badge && (
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                      {product.badge}
                    </div>
                  )}
                  <div className="text-6xl mb-4">{product.emoji}</div>
                  <h3 className="text-3xl font-bold mb-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-accent glow-teal">
                      \${product.price}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>Run Size: {product.runSize} boxes</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs">{product.positioning}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">
                    Tier Distribution
                  </h4>
                  <div className="space-y-3">
                    {product.tiers.map((tier, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-accent"></div>
                          <span className="font-medium">{tier.name}</span>
                          <span className="text-muted-foreground">({tier.percent})</span>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-3">
                  <Button
                    className="w-full bg-accent hover:bg-accent/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.name);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Link href={`/starwars/${product.id}/checklist`}>
                    <Button variant="outline" className="w-full">
                      View Checklist (1-100)
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            WHY CHOOSE MULTIVERSE VAULT?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Guaranteed Hits</h3>
              <p className="text-muted-foreground">
                Every box includes guaranteed chase cards, inserts, or autographs. No empty boxes ever.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">100% Authentic</h3>
              <p className="text-muted-foreground">
                All cards are verified authentic from official Topps releases. We never sell counterfeits.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-2">Curated Selection</h3>
              <p className="text-muted-foreground">
                Carefully selected cards from the most popular and sought-after Topps Star Wars sets.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Transparent Odds</h3>
              <p className="text-muted-foreground">
                Full tier breakdowns published for every product. Complete transparency in our repack process.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
