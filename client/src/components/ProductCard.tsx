/**
 * ProductCard - Reusable product card for shop grids
 * Design: Dark card with hover glow, badge, price, add to cart
 */

import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "wouter";
import type { Product } from "@/lib/products";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured }: ProductCardProps) {
  const { addItem } = useCart();

  const badgeColors: Record<string, string> = {
    green: "bg-green-500 text-black",
    cyan: "bg-cyan-500 text-black",
    purple: "bg-purple-500 text-white",
    blue: "bg-blue-500 text-white",
    gold: "bg-amber-500 text-black",
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      addItem(product);
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.info("This product is coming soon! Sign up for notifications.");
    }
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <div
        className={`group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer ${
          featured ? "hover:shadow-[0_0_30px_rgba(0,255,65,0.15)]" : "hover:shadow-lg"
        }`}
      >
        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
              badgeColors[product.badgeColor || "green"]
            }`}
          >
            {product.badge}
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-muted text-muted-foreground px-4 py-2 rounded-lg font-bold text-sm">
                COMING SOON
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.subtitle}
          </p>
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {product.isRepack && (
            <p className="text-xs text-primary/80 mb-3">
              Limited to {product.inventory} packs
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className={
                product.inStock
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {product.inStock ? "Add" : "Soon"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
