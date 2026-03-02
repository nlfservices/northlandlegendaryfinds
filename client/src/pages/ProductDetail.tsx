/**
 * ProductDetail - Individual product page with Stripe checkout
 * Design: Large image left, details right, Buy Now with Stripe, features list
 */

import { useParams, Link } from "wouter";
import { CreditCard, ArrowLeft, Shield, Star, Package, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductBySlug, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const [quantity, setQuantity] = useState(1);

  const createSession = trpc.checkout.createSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("Redirecting to secure checkout...");
        window.open(data.url, "_blank");
      }
    },
    onError: (error) => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Link href="/shop">
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBuyNow = () => {
    if (!product.inStock) return;
    createSession.mutate({
      productSlug: product.slug,
      quantity,
    });
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-8">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Image */}
            <div className="relative">
              <div className="sticky top-24 bg-card rounded-2xl border border-border overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center p-8">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain drop-shadow-[0_0_30px_rgba(0,255,65,0.1)]"
                  />
                </div>
                {product.badge && (
                  <div className="absolute top-4 left-4 px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {product.badge}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="py-4">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                {product.subtitle}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.comparePrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.comparePrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {product.inStock ? (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-green-400 font-bold">
                      In Stock — {product.inventory} packs remaining
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-amber-400 font-bold">Coming Soon</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Buy Now with Stripe */}
              {product.inStock && (
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-3 text-lg font-bold hover:bg-muted transition-colors"
                      >
                        −
                      </button>
                      <span className="px-4 py-3 text-lg font-bold min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(5, quantity + 1))}
                        className="px-4 py-3 text-lg font-bold hover:bg-muted transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <Button
                      onClick={handleBuyNow}
                      disabled={createSession.isPending}
                      size="lg"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6"
                    >
                      {createSession.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Buy Now — ${(product.price * quantity).toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Secure checkout powered by Stripe. Opens in a new tab.
                  </p>
                </div>
              )}

              {!product.inStock && (
                <div className="mb-8">
                  <Button size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg py-6" onClick={() => toast.info("Notification feature coming soon!")}>
                    Notify Me When Available
                  </Button>
                </div>
              )}

              {/* Features */}
              <div className="bg-card rounded-xl border border-border p-6 mb-8">
                <h3 className="font-bold text-lg mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-card rounded-lg border border-border">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">100% Authentic</p>
                </div>
                <div className="text-center p-3 bg-card rounded-lg border border-border">
                  <Package className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Ships in 24hrs</p>
                </div>
                <div className="text-center p-3 bg-card rounded-lg border border-border">
                  <Star className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Guaranteed Hits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Anton', sans-serif" }}>
              YOU MAY ALSO <span className="text-primary">LIKE</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
