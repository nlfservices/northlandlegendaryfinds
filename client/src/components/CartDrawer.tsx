/**
 * CartDrawer - Slide-out cart panel
 * Design: Dark overlay with green-accented cart items
 */

import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { SHOPIFY_STORE } from "@/lib/products";
import { useLocation } from "wouter";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isOpen, setIsOpen, clearCart } = useCart();
  const [, setLocation] = useLocation();

  if (!isOpen) return null;

  const handleCheckout = () => {
    // Build Shopify checkout URL with all cart items
    // Format: /cart/VARIANT_ID:QUANTITY,VARIANT_ID:QUANTITY
    // Since we don't have variant IDs yet, redirect to Shopify store
    if (items.length > 0) {
      window.open(`https://${SHOPIFY_STORE}`, "_blank");
    }
  };

  const handleViewCart = () => {
    setIsOpen(false);
    setLocation("/cart");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col shadow-2xl shadow-primary/10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold tracking-wide">YOUR CART</h2>
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-bold text-muted-foreground mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground/70 mb-6">
                Add some legendary finds to get started
              </p>
              <Button
                onClick={() => { setIsOpen(false); setLocation("/shop"); }}
                className="bg-primary hover:bg-primary/90"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 bg-card rounded-lg p-4 border border-border"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.product.image}
                       alt={item.product.name}
                       loading="lazy"
                       decoding="async"
                       width={80}
                       height={80}
                       className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.product.subtitle}
                    </p>
                    <p className="text-primary font-bold mt-1">
                      ${item.product.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-2xl font-bold text-primary">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping & taxes calculated at checkout
            </p>
            <Button
              onClick={handleCheckout}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg"
            >
              Checkout
            </Button>
            <div className="flex gap-3">
              <Button
                onClick={handleViewCart}
                variant="outline"
                className="flex-1 border-border"
              >
                View Cart
              </Button>
              <Button
                onClick={clearCart}
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
