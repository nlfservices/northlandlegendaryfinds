/**
 * Navigation - Giant Sports Cards inspired with NLF cosmic branding
 * Design: Announcement bar + sticky nav with logo, links, cart
 */

import { useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Shuffle, Crown } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const utils = trpc.useUtils();
  const { user } = useAuth();

  const navItems = [
    { path: "/shop", label: "Shop" },
    { path: "/cards", label: "Card Database" },
    { path: "/characters", label: "Characters" },
    { path: "/checklists", label: "Checklists" },
    { path: "/about", label: "About" },
    { path: "/transparency", label: "Transparency" },
    { path: "/card-shows", label: "Card Shows" },
    { path: "/subscribers", label: "The Vault", icon: "crown" },
    { path: "/faq", label: "FAQ" },
  ];

  const handleRandomCard = useCallback(async () => {
    if (isRandomizing) return;
    setIsRandomizing(true);
    try {
      const result = await utils.public.marvel.randomCard.fetch();
      if (result) {
        setLocation(`/cards/${result.setSlug}/${result.cardNumber}`);
        setMobileMenuOpen(false);
      } else {
        toast.error("No cards found in the database");
      }
    } catch (err) {
      toast.error("Failed to get a random card. Please try again.");
    } finally {
      setIsRandomizing(false);
    }
  }, [isRandomizing, utils, setLocation]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm font-bold tracking-wide">
        LAUNCHING MARCH 27TH — FREE SHIPPING ON ORDERS OVER $199
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <img
                src="/logo.png"
                alt="NLF"
                className="h-14 w-14 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-primary font-bold text-lg tracking-wider leading-tight" style={{ fontFamily: "'Anton', sans-serif" }}>
                  NORTHLAND
                </span>
                <span className="text-muted-foreground text-[10px] tracking-widest uppercase -mt-0.5">
                  Legendary Finds
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location === item.path;
                const isVault = item.icon === "crown";
                return (
                  <Link key={item.path} href={item.path}>
                    <button
                      className={`px-4 py-2 text-sm font-bold tracking-wide rounded-lg transition-all flex items-center gap-1.5 ${
                        isActive
                          ? isVault ? "text-[oklch(0.75_0.15_85)] bg-[oklch(0.75_0.15_85/0.1)]" : "text-primary bg-primary/10"
                          : isVault ? "text-[oklch(0.75_0.15_85/0.8)] hover:text-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.75_0.15_85/0.1)]" : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {isVault && <Crown className="w-3.5 h-3.5" />}
                      {item.label}
                    </button>
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-1">
              {/* Random Card Button */}
              <button
                onClick={handleRandomCard}
                disabled={isRandomizing}
                className="relative text-foreground/70 hover:text-primary transition-all p-2 group"
                title="Random Card"
              >
                <Shuffle className={`w-5 h-5 ${isRandomizing ? "animate-spin" : "group-hover:scale-110 transition-transform"}`} />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative text-foreground hover:text-primary transition-colors p-2"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-foreground hover:text-primary transition-colors p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="container py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location === item.path;
                const isVault = item.icon === "crown";
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={`px-4 py-3 rounded-lg font-bold tracking-wide transition-colors flex items-center gap-2 ${
                        isActive
                          ? isVault ? "bg-[oklch(0.75_0.15_85/0.1)] text-[oklch(0.75_0.15_85)]" : "bg-primary/10 text-primary"
                          : isVault ? "text-[oklch(0.75_0.15_85/0.8)] hover:bg-[oklch(0.75_0.15_85/0.1)] hover:text-[oklch(0.75_0.15_85)]" : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      {isVault && <Crown className="w-4 h-4" />}
                      {item.label}
                    </div>
                  </Link>
                );
              })}
              {/* Random Card in mobile menu */}
              <button
                onClick={handleRandomCard}
                disabled={isRandomizing}
                className="w-full px-4 py-3 rounded-lg font-bold tracking-wide transition-colors text-foreground/80 hover:bg-primary/5 hover:text-primary flex items-center gap-2"
              >
                <Shuffle className={`w-4 h-4 ${isRandomizing ? "animate-spin" : ""}`} />
                {isRandomizing ? "Finding card..." : "Random Card"}
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
