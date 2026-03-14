/**
 * Cart Page - Full cart view with checkout
 */

import { Link } from "wouter";
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { SHOPIFY_STORE } from "@/lib/products";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    if (items.length > 0) {
      window.open(`https://${SHOPIFY_STORE}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            YOUR <span className="text-primary">CART</span>
          </h1>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="w-20 h-20 text-muted-foreground/20 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Add some legendary finds to get started
              </p>
              <Link href="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 font-bold">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-6 bg-card rounded-xl p-6 border border-border"
                  >
                    <Link href={`/product/${item.product.slug}`}>
                      <div className="w-28 h-28 rounded-lg overflow-hidden bg-muted flex-shrink-0 cursor-pointer">
                        <img
                          src={item.product.image}
                           alt={item.product.name}
                           loading="lazy"
                           decoding="async"
                           width={96}
                           height={96}
                           className="w-full h-full object-contain p-2"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product.slug}`}>
                        <h3 className="font-bold text-lg hover:text-primary transition-colors cursor-pointer">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.product.subtitle}</p>
                      <p className="text-primary font-bold text-xl mt-2">
                        ${item.product.price.toFixed(2)}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-bold w-10 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-4">
                  <Link href="/shop">
                    <Button variant="outline" className="border-border">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>{totalPrice >= 199 ? "FREE" : "Calculated at checkout"}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {totalPrice < 199 && (
                    <p className="text-xs text-muted-foreground mb-4 text-center">
                      Add ${(199 - totalPrice).toFixed(2)} more for free shipping!
                    </p>
                  )}

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 mb-4"
                  >
                    Proceed to Checkout
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secure checkout powered by Shopify</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
