/**
 * Mobile Menu Component
 * Design: Slide-out mobile navigation menu
 */

import { Link, useLocation } from "wouter";
import { Home, Grid3x3, Users, ShoppingCart, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/sets", label: "Card Sets", icon: Grid3x3 },
  { path: "/characters", label: "Characters", icon: Users },
  // { path: "/shop", label: "Shop", icon: ShoppingCart }, // Hidden until launch
  { path: "/about", label: "About", icon: Info },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [location] = useLocation();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-64 bg-sidebar border-l border-sidebar-border z-50 md:hidden">
        <div className="p-4">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-sidebar-accent"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8 mt-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">NLF</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider">NORTHLAND</span>
              <span className="text-xs text-muted-foreground -mt-1">Legendary Finds</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
