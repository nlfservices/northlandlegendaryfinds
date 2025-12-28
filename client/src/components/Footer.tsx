/**
 * Footer Component
 * Design: Site-wide footer with links and branding
 */

import { Link } from "wouter";
import { Mail, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">NLF</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-wider">NORTHLAND</span>
                <span className="text-xs text-muted-foreground -mt-1">Legendary Finds</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Premium Marvel trading card repacks from collectors, for collectors. Featuring Topps Chrome, Comic Book Heroes, and Marvel Mint collections.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/sets" className="text-muted-foreground hover:text-primary transition-colors">
                  Card Sets
                </Link>
              </li>
              <li>
                <Link href="/characters" className="text-muted-foreground hover:text-primary transition-colors">
                  Characters
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Card Sets */}
          <div>
            <h3 className="font-bold mb-4">Card Sets</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sets/chrome" className="text-muted-foreground hover:text-primary transition-colors">
                  Topps Chrome
                </Link>
              </li>
              <li>
                <Link href="/sets/comic-book-heroes" className="text-muted-foreground hover:text-primary transition-colors">
                  Comic Book Heroes
                </Link>
              </li>
              <li>
                <Link href="/sets/marvel-mint" className="text-muted-foreground hover:text-primary transition-colors">
                  Marvel Mint
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 Northland Legendary Finds. All rights reserved.</p>
          <p className="mt-4 md:mt-0">
            Premium Marvel Trading Cards • 100% Authentic
          </p>
        </div>
      </div>
    </footer>
  );
}
