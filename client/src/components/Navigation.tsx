/**
 * Navigation - Giant Sports Cards inspired with NLF cosmic branding
 * Design: Announcement bar + sticky nav with logo, links, cart
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Shuffle, User, ChevronDown, BookOpen } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const MARKET_INTEL_PAGES = [
  { path: "/market-intel", label: "The Future of Marvel Cards" },
  { path: "/market-intel/2024-vs-2025-topps-marvel", label: "2024 vs 2025 Topps Marvel" },
  { path: "/market-intel/topps-vs-upper-deck-marvel", label: "Topps vs Upper Deck" },
  { path: "/market-intel/marvel-vs-pokemon-cards", label: "Marvel vs Pokémon Cards" },
  { path: "/market-intel/why-fanatics-trading-cards", label: "Why Fanatics Matters" },
  { path: "/market-intel/best-topps-marvel-cards", label: "Best Topps Marvel to Watch" },
];

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [marketIntelOpen, setMarketIntelOpen] = useState(false);
  const [mobileMarketIntelOpen, setMobileMarketIntelOpen] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const utils = trpc.useUtils();
  const { user, isAuthenticated } = useAuth();
  const marketIntelRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: "/shop", label: "Shop" },
    { path: "/cards", label: "Card Database" },
    { path: "/characters", label: "Characters" },
    { path: "/checklists", label: "Checklists" },
    { path: "/card-shows", label: "Card Shows" },
    { path: "/about", label: "About" },
    { path: "/transparency", label: "Transparency" },
    { path: "/faq", label: "FAQ" },
    { path: "/marvel-card-hub", label: "Card Hub" },
  ];

  const isMarketIntelActive = location.startsWith("/market-intel");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (marketIntelRef.current && !marketIntelRef.current.contains(event.target as Node)) {
        setMarketIntelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        LAUNCHING APRIL 27TH — FREE SHIPPING ON ORDERS OVER $199
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
                return (
                  <Link key={item.path} href={item.path}>
                    <button
                      className={`px-4 py-2 text-sm font-bold tracking-wide rounded-lg transition-all ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {item.label}
                    </button>
                  </Link>
                );
              })}

              {/* Market Intel Dropdown - Highlighted */}
              <div ref={marketIntelRef} className="relative">
                <button
                  onClick={() => setMarketIntelOpen(!marketIntelOpen)}
                  onMouseEnter={() => setMarketIntelOpen(true)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold tracking-wide rounded-lg transition-all ${
                    isMarketIntelActive
                      ? "text-primary bg-primary/15 ring-1 ring-primary/30"
                      : "text-primary bg-primary/5 hover:bg-primary/10 ring-1 ring-primary/20"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Market Intel
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${marketIntelOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {marketIntelOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 bg-popover border border-border rounded-lg shadow-xl overflow-hidden z-50"
                    onMouseLeave={() => setMarketIntelOpen(false)}
                  >
                    {MARKET_INTEL_PAGES.map((page, i) => {
                      const isActive = location === page.path;
                      return (
                        <Link
                          key={page.path}
                          href={page.path}
                          onClick={() => setMarketIntelOpen(false)}
                        >
                          <div
                            className={`px-4 py-3 text-sm transition-colors ${
                              i === 0
                                ? "font-bold border-b border-border"
                                : "font-medium"
                            } ${
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-popover-foreground hover:bg-primary/5 hover:text-primary"
                            }`}
                            style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}
                          >
                            {page.label}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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

              {/* Login / Account Button */}
              <Link href="/login">
                <button
                  className={`relative p-2 transition-all group ${
                    isAuthenticated
                      ? "text-primary"
                      : "text-foreground/70 hover:text-primary"
                  }`}
                  title={isAuthenticated ? `Signed in as ${user?.name || "Agent"}` : "Jarvis Protocol"}
                >
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isAuthenticated && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </button>
              </Link>

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
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={`px-4 py-3 rounded-lg font-bold tracking-wide transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </div>
                  </Link>
                );
              })}

              {/* Market Intel Mobile Dropdown */}
              <div>
                <button
                  onClick={() => setMobileMarketIntelOpen(!mobileMarketIntelOpen)}
                  className={`w-full px-4 py-3 rounded-lg font-bold tracking-wide transition-colors flex items-center justify-between ${
                    isMarketIntelActive
                      ? "bg-primary/10 text-primary"
                      : "text-primary hover:bg-primary/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Market Intel
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileMarketIntelOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileMarketIntelOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-4">
                    {MARKET_INTEL_PAGES.map((page) => {
                      const isActive = location === page.path;
                      return (
                        <Link
                          key={page.path}
                          href={page.path}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileMarketIntelOpen(false);
                          }}
                        >
                          <div
                            className={`px-3 py-2 rounded text-sm transition-colors ${
                              isActive
                                ? "text-primary font-bold"
                                : "text-foreground/70 hover:text-primary"
                            }`}
                            style={{ fontFamily: "'Inter', sans-serif", textTransform: "none" }}
                          >
                            {page.label}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Random Card in mobile menu */}
              <button
                onClick={handleRandomCard}
                disabled={isRandomizing}
                className="w-full px-4 py-3 rounded-lg font-bold tracking-wide transition-colors text-foreground/80 hover:bg-primary/5 hover:text-primary flex items-center gap-2"
              >
                <Shuffle className={`w-4 h-4 ${isRandomizing ? "animate-spin" : ""}`} />
                {isRandomizing ? "Finding card..." : "Random Card"}
              </button>
              {/* Jarvis Protocol in mobile menu */}
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="px-4 py-3 rounded-lg font-bold tracking-wide transition-colors text-foreground/80 hover:bg-primary/5 hover:text-primary flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {isAuthenticated ? `${user?.name || "My Account"}` : "Jarvis Protocol"}
                  {isAuthenticated && (
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
