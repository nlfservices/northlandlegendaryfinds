/**
 * Footer Component - NLF cosmic theme
 * Design: Site-wide footer with links and branding
 */

import { Link } from "wouter";
import { Mail, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-sidebar border-t border-sidebar-border mt-auto">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/logo.png" 
                alt="Northland Legendary Finds" 
                className="h-12 w-12 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-wider text-primary glow-green">NORTHLAND</span>
                <span className="text-xs text-sidebar-foreground -mt-1">Legendary Finds</span>
              </div>
            </div>
            <p className="text-sidebar-foreground/80 mb-4">
              Premium Marvel and Star Wars trading card repacks from collectors, for collectors. 
              100% authentic Topps cards with guaranteed hits in every box.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:info@northlandlegendaryfinds.com" className="text-sidebar-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-sidebar-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-sidebar-foreground hover:text-secondary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-sidebar-foreground hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-sidebar-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sidebar-foreground/80 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/marvel" className="text-sidebar-foreground/80 hover:text-primary transition-colors">
                  Marvel
                </Link>
              </li>
              <li>
                <Link href="/star-wars" className="text-sidebar-foreground/80 hover:text-secondary transition-colors">
                  Star Wars
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sidebar-foreground/80 hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sidebar-foreground/80 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="text-sidebar-foreground/80 hover:text-green-400 transition-colors font-semibold">
                  📧 Join Newsletter
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop By Category */}
          <div>
            <h3 className="font-bold mb-4 text-sidebar-foreground">Shop By Category</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sidebar-foreground/80">Chrome Collections</span>
              </li>
              <li>
                <span className="text-sidebar-foreground/80">Graded Cards</span>
              </li>
              <li>
                <span className="text-sidebar-foreground/80">Autograph Series</span>
              </li>
              <li>
                <span className="text-sidebar-foreground/80">Vintage Repacks</span>
              </li>
              <li>
                <span className="text-sidebar-foreground/80">Case Hits</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sidebar-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-sidebar-foreground/60">
          <p>© 2025 Northland Legendary Finds. All rights reserved.</p>
          <p className="mt-4 md:mt-0">
            Premium Topps Trading Cards • 100% Authentic • Free Shipping Over $199
          </p>
        </div>
      </div>
    </footer>
  );
}
