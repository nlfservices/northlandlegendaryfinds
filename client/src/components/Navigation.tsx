/**
 * Navigation - Giant Sports Cards inspired with NLF cosmic branding
 * Design: Announcement bar + sticky nav with logo, links, cart
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();

  const navItems = [
    { path: "/shop", label: "Shop" },
    { path: "/cards", label: "Card Database" },
    { path: "/characters", label: "Characters" },
    { path: "/checklists", label: "Checklists" },
    { path: "/about", label: "About" },
    { path: "/transparency", label: "Transparency" },
    { path: "/faq", label: "FAQ" },
  ];

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
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
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
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
