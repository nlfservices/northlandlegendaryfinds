/**
 * Star Wars Category Page - Product listing with filters
 * Design: Hit Parade inspired product grid with teal/cyan accents
 */

import { useState } from "react";
import { ShoppingCart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock product data based on the Star Wars checklists provided
const products = [
  {
    id: 1,
    name: "2025 Topps Chrome Star Wars",
    description: "Premium chrome cards from the latest Star Wars set",
    price: 149.95,
    image: "🚀",
    category: "Chrome",
    inStock: true,
  },
  {
    id: 2,
    name: "Chrome Galaxy Hobby Box",
    description: "Galactic heroes and villains with refractor technology",
    price: 129.95,
    image: "⚔️",
    category: "Chrome Galaxy",
    inStock: true,
  },
  {
    id: 3,
    name: "Chrome Sapphire Star Wars",
    description: "Ultra-premium sapphire edition with stunning parallels",
    price: 299.95,
    image: "💫",
    category: "Sapphire",
    inStock: true,
  },
  {
    id: 4,
    name: "Star Wars Legendary Case Hits",
    description: "Guaranteed autographs from the Star Wars universe",
    price: 549.95,
    image: "🎯",
    category: "Case Hits",
    inStock: true,
  },
  {
    id: 5,
    name: "Star Wars Graded Collection",
    description: "PSA 10 graded cards from premium Star Wars sets",
    price: 349.95,
    image: "⭐",
    category: "Graded",
    inStock: true,
  },
  {
    id: 6,
    name: "Autograph Series Box",
    description: "Multiple Star Wars autographed cards guaranteed",
    price: 449.95,
    image: "✍️",
    category: "Autographs",
    inStock: false,
  },
  {
    id: 7,
    name: "Vintage Star Wars Repack",
    description: "Classic cards from the original trilogy era",
    price: 199.95,
    image: "📜",
    category: "Vintage",
    inStock: true,
  },
  {
    id: 8,
    name: "Star Wars Mega Box",
    description: "Over 200 cards spanning all Star Wars eras",
    price: 279.95,
    image: "📦",
    category: "Mega Box",
    inStock: true,
  },
];

const categories = ["All", "Chrome", "Chrome Galaxy", "Sapphire", "Case Hits", "Graded", "Autographs", "Vintage", "Mega Box"];

export default function StarWars() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0; // featured
  });

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[300px] flex items-center justify-center space-bg overflow-hidden">
        <div className="container relative z-10 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 text-secondary glow-teal">
            STAR WARS COLLECTION
          </h1>
          <p className="text-xl text-muted-foreground">
            Premium Topps Star Wars trading cards from a galaxy far, far away
          </p>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="bg-card border-y border-border sticky top-[88px] z-40">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-muted-foreground" />
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" : ""}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-lg overflow-hidden glow-teal hover:scale-105 transition-transform"
              >
                {/* Product Image */}
                <div className="aspect-square bg-muted flex items-center justify-center relative">
                  <div className="text-8xl">{product.image}</div>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <span className="text-destructive font-bold text-xl">OUT OF STOCK</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="text-xs text-secondary font-bold mb-2 uppercase tracking-wide">
                    {product.category}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-secondary">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-8">
            WHY CHOOSE OUR STAR WARS REPACKS?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-secondary">🎯 Guaranteed Hits</h3>
              <p className="text-muted-foreground">
                Every box includes guaranteed chase cards, inserts, or autographs from your favorite characters.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-3 text-secondary">✅ 100% Authentic</h3>
              <p className="text-muted-foreground">
                All cards are verified authentic from official Topps Star Wars releases. Licensed and genuine.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-3 text-secondary">🌌 All Eras Covered</h3>
              <p className="text-muted-foreground">
                From the original trilogy to the latest series, we have cards spanning the entire Star Wars saga.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-3 text-secondary">🚀 Fast Shipping</h3>
              <p className="text-muted-foreground">
                Orders ship within 24 hours. Free shipping on orders over $199 with tracking included.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
