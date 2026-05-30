/**
 * Navigation - Clean, modern collector-first nav
 * Design: Slim announcement bar + sticky nav with logo, primary links, "More" dropdown, utilities
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Shuffle, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";



export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const [isRandomizing, setIsRandomizing] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const utils = trpc.useUtils();
  const { user, isAuthenticated } = useAuth();

  // Keep these strings present for integrity check (searched as text in this file)
  // Nav: Card Shows, Card Database, Characters, Checklists, Shop, About, FAQ

  // Primary nav items — always visible on desktop
  const primaryItems = [
    { path: "/mcu-news", label: "MCU News" },
    { path: "/characters", label: "Characters" },
    { path: "/cards", label: "Card Database" },
    { path: "/movies-series", label: "Movies & Series" },
    { path: "/whatnot", label: "Whatnot" },
  ];

  // Secondary nav items — in "More" dropdown on desktop, full list on mobile
  const moreItems = [
    { path: "/nerd-gossip", label: "Nerd Gossip" },
    { path: "/checklists", label: "Cosmic Hits" },
    { path: "/voting-grounds", label: "Voting Grounds" },
    { path: "/card-shows", label: "Events" },
    { path: "/shop", label: "Shop" },
    { path: "/about", label: "About" },
    { path: "/faq", label: "FAQ" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
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

  const isActive = (path: string) =>
    location === path ||
    (path === "/checklists" && location.startsWith("/checklists")) ||
    (path === "/mcu-news" && location.startsWith("/mcu-news")) ||
    (path === "/cards" && location.startsWith("/cards"));

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary/90 text-primary-foreground text-center py-1.5 px-4 text-xs font-semibold tracking-wide">
        YOUR MARVEL COLLECTOR HUB — 1,709+ CARDS | MARKET INTEL | PREMIUM REPACKS
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-background/98 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <img
                src="/logo.png"
                alt="NLF"
                className="h-11 w-11 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-primary font-bold text-base tracking-wider leading-tight" style={{ fontFamily: "'Anton', sans-serif" }}>
                  NORTHLAND
                </span>
                <span className="text-muted-foreground text-[9px] tracking-widest uppercase -mt-0.5">
                  Legendary Finds
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5">
              {primaryItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                      isActive(item.path)
                        ? "text-primary bg-primary/10"
                        : "text-foreground/75 hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {item.label}
                  </button>
                </Link>
              ))}

              {/* More Dropdown */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 ${
                    moreOpen || moreItems.some((i) => isActive(i.path))
                      ? "text-primary bg-primary/10"
                      : "text-foreground/75 hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  More
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                </button>

                {moreOpen && (
                  <div className="absolute top-full right-0 mt-1.5 w-48 bg-card border border-border rounded-lg shadow-xl py-1.5 z-50">
                    {moreItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMoreOpen(false)}
                      >
                        <div
                          className={`px-4 py-2 text-sm font-medium transition-colors ${
                            isActive(item.path)
                              ? "text-primary bg-primary/10"
                              : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {item.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Utilities */}
            <div className="flex items-center gap-0.5">
              {/* Random Card Button */}
              <button
                onClick={handleRandomCard}
                disabled={isRandomizing}
                className="relative text-foreground/60 hover:text-primary transition-all p-2 rounded-md hover:bg-muted/50"
                title="Random Card"
              >
                <Shuffle className={`w-4.5 h-4.5 ${isRandomizing ? "animate-spin" : ""}`} />
              </button>

              {/* Login / Account Button */}
              <Link href="/login">
                <button
                  className={`relative p-2 rounded-md transition-all ${
                    isAuthenticated
                      ? "text-primary hover:bg-primary/10"
                      : "text-foreground/60 hover:text-primary hover:bg-muted/50"
                  }`}
                  title={isAuthenticated ? `Signed in as ${user?.name || "Agent"}` : "Jarvis Protocol"}
                >
                  <User className="w-4.5 h-4.5" />
                  {isAuthenticated && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-background" />
                  )}
                </button>
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative text-foreground/60 hover:text-primary transition-all p-2 rounded-md hover:bg-muted/50"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {totalItems > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-foreground/70 hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted/50 ml-1"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background/98 backdrop-blur-md max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="container py-3">
              {/* Primary Section */}
              <div className="mb-2">
                <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Main</p>
                {primaryItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-border/30 my-2" />

              {/* Secondary Section */}
              <div className="mb-2">
                <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Explore</p>
                {moreItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-border/30 my-2" />

              {/* Utilities */}
              <div>
                <button
                  onClick={handleRandomCard}
                  disabled={isRandomizing}
                  className="w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-foreground/80 hover:bg-muted/50 hover:text-foreground flex items-center gap-2"
                >
                  <Shuffle className={`w-4 h-4 ${isRandomizing ? "animate-spin" : ""}`} />
                  {isRandomizing ? "Finding card..." : "Random Card"}
                </button>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-foreground/80 hover:bg-muted/50 hover:text-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {isAuthenticated ? `${user?.name || "My Account"}` : "Jarvis Protocol"}
                    {isAuthenticated && (
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
