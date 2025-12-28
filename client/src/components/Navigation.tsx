/**
 * Navigation Component
 * Design: Bold sidebar-style navigation with comic book aesthetics
 * - Bebas Neue font for dramatic impact
 * - Dark background with purple accents
 * - Smooth hover effects
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Grid3x3, Users, ShoppingCart, Info, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/sets", label: "Card Sets", icon: Grid3x3 },
  { path: "/characters", label: "Characters", icon: Users },
  { path: "/shop", label: "Shop", icon: ShoppingCart },
  { path: "/about", label: "About", icon: Info },
];

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-sidebar/95 backdrop-blur-sm border-b border-sidebar-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all">
              <span className="text-2xl font-bold text-primary-foreground">NLF</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider text-foreground">
                NORTHLAND
              </span>
              <span className="text-sm text-muted-foreground -mt-1">
                Legendary Finds
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "text-sidebar-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-sidebar-accent"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </nav>
  );
}
