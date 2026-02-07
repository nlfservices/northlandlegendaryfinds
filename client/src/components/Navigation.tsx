/**
 * Navigation Component - Hit Parade inspired with NLF cosmic branding
 * Design: Sticky header with logo, menu, search, cart
 * Colors: Deep purple background with green accents from logo
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { path: "/marvel", label: "Marvel" },
    { path: "/star-wars", label: "Star Wars" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm font-bold tracking-wide">
        🚀 FREE SHIPPING ON ORDERS OVER $199 | USE CODE: LEGENDARY
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-sidebar border-b border-sidebar-border shadow-lg">
        <div className="container">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <img 
                src="/logo.png" 
                alt="Northland Legendary Finds" 
                className="h-16 w-16 object-contain group-hover:scale-110 transition-transform"
              />
              <div className="hidden md:flex flex-col">
                <span className="text-primary font-bold text-xl tracking-wider glow-green">
                  NORTHLAND
                </span>
                <span className="text-sidebar-foreground text-xs -mt-1">
                  Legendary Finds
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant="ghost"
                      className={`text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent font-bold tracking-wide ${
                        isActive ? "text-primary bg-sidebar-accent" : ""
                      }`}
                    >
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-sidebar-foreground hover:text-primary transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>

              {/* Cart */}
              <Link href="/cart">
                <button className="relative text-sidebar-foreground hover:text-primary transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-sidebar-foreground hover:text-primary transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar (Expandable) */}
          {searchOpen && (
            <div className="pb-4">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-6 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-sidebar-border">
            <div className="container py-4 space-y-2">
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
                          ? "bg-sidebar-accent text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary"
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
