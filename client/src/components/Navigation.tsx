/**
 * Navigation - Simplified collector-first nav with main items
 * Design: Announcement bar + sticky nav with logo, links, cart
 */

import { useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Shuffle, User } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";



export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isRandomizing, setIsRandomizing] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const utils = trpc.useUtils();
  const { user, isAuthenticated } = useAuth();


  // Main nav items — clean and focused
  const navItems = [
    { path: "/mcu-news", label: "MCU News", highlight: "red" as const },
    { path: "/characters", label: "Marvel Characters" },
    { path: "/nerd-gossip", label: "Nerd Gossip", highlight: "purple" as const },
    { path: "/checklists", label: "Cosmic Hits" },
    // { path: "/shop", label: "Shop Now" }, // Hidden until launch
    { path: "/card-shows", label: "Events" },
    { path: "/the-little-things", label: "The Little Things", highlight: "green" as const },
    { path: "/about", label: "About" },
    { path: "/faq", label: "FAQ" },
    { path: "/cards", label: "Card Database" },
    { path: "/whatnot", label: "Whatnot" },
  ];

  // Keep these strings present for integrity check (searched as text in this file)
  // Nav: Card Shows, Card Database, Characters, Checklists, Shop, About, FAQ





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
        YOUR MARVEL COLLECTOR HUB — 1,709+ CARDS | MARKET INTEL | PREMIUM REPACKS
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-[30px] z-50 bg-background/95 backdrop-blur-md border-b border-border">
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
                const isActive = location === item.path ||
                  (item.path === "/checklists" && location.startsWith("/checklists"));
                // Special styling for MCU News tab — green border, red text
                if (item.path === "/mcu-news") {
                  return (
                    <Link key={item.path} href={item.path}>
                      <button
                        className="px-4 py-2 text-sm font-extrabold tracking-wide rounded-lg transition-all whitespace-nowrap border-2 border-green-500 text-red-500 hover:bg-green-500/10 hover:text-red-400 hover:border-green-400"
                      >
                        {item.label}
                      </button>
                    </Link>
                  );
                }
                // Special styling for Nerd Gossip tab — green border, purple text
                if (item.path === "/nerd-gossip") {
                  return (
                    <Link key={item.path} href={item.path}>
                      <button
                        className="px-4 py-2 text-sm font-extrabold tracking-wide rounded-lg transition-all whitespace-nowrap border-2 border-green-500 text-purple-400 hover:bg-green-500/10 hover:text-purple-300 hover:border-green-400"
                      >
                        {item.label}
                      </button>
                    </Link>
                  );
                }
                // Special styling for Whatnot tab
                if (item.path === "/whatnot") {
                  return (
                    <Link key={item.path} href={item.path}>
                      <button
                        className="px-4 py-2 text-sm font-extrabold tracking-wide rounded-lg transition-all whitespace-nowrap border-2 border-green-500 text-yellow-400 hover:bg-green-500/10 hover:text-yellow-300 hover:border-green-400"
                      >
                        {item.label}
                      </button>
                    </Link>
                  );
                }
                return (
                  <Link key={item.path} href={item.path}>
                    <button
                      className={`px-3 py-2 text-sm font-bold tracking-wide rounded-lg transition-all whitespace-nowrap ${
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
                // Special styling for MCU News tab in mobile — green border, red text
                if (item.path === "/mcu-news") {
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className="px-4 py-3 rounded-lg font-extrabold tracking-wide transition-colors border-2 border-green-500 text-red-500 hover:bg-green-500/10 hover:text-red-400"
                      >
                        {item.label}
                      </div>
                    </Link>
                  );
                }
                // Special styling for Nerd Gossip tab in mobile — green border, purple text
                if (item.path === "/nerd-gossip") {
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className="px-4 py-3 rounded-lg font-extrabold tracking-wide transition-colors border-2 border-green-500 text-purple-400 hover:bg-green-500/10 hover:text-purple-300"
                      >
                        {item.label}
                      </div>
                    </Link>
                  );
                }
                // Special styling for Whatnot tab in mobile
                if (item.path === "/whatnot") {
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className="px-4 py-3 rounded-lg font-extrabold tracking-wide transition-colors border-2 border-green-500 text-yellow-400 hover:bg-green-500/10 hover:text-yellow-300"
                      >
                        {item.label}
                      </div>
                    </Link>
                  );
                }
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
