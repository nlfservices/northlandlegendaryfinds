/**
 * Footer - NLF cosmic theme with all store links
 */

import { Link } from "wouter";
import { Mail, Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="NLF"
                className="h-12 w-12 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-primary font-bold tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>
                  NORTHLAND
                </span>
                <span className="text-[10px] text-muted-foreground tracking-widest uppercase -mt-0.5">
                  Legendary Finds
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Premium Marvel trading card repacks with guaranteed hits. Star Wars collection dropping June 2026.
            </p>
            <div className="flex gap-3">
              <a href="mailto:info@nlfservices.com" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2.5">
              <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/marvel" className="text-sm text-muted-foreground hover:text-primary transition-colors">Marvel</Link></li>
              <li><Link href="/star-wars" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">Star Wars (June 2026)</Link></li>
              <li><Link href="/checklists" className="text-sm text-muted-foreground hover:text-primary transition-colors">Checklists</Link></li>
              <li><Link href="/characters" className="text-sm text-muted-foreground hover:text-primary transition-colors">Characters</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Info</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/transparency" className="text-sm text-muted-foreground hover:text-primary transition-colors">Transparency</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2.5">
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link></li>
              <li><Link href="/demo-reveal" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">Digital Pack Reveal</Link></li>
            </ul>
          </div>
        </div>

        {/* Whatnot QR Code Banner */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://www.whatnot.com/user/northlandfinds" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <div className="bg-white rounded-lg p-1.5 shadow-sm">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/whatnot-qr-1_5cdbb693.png"
                  alt="Scan to follow us on Whatnot"
                  className="w-16 h-16"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-purple-400 group-hover:text-purple-300 transition-colors">Follow us on Whatnot</p>
                <p className="text-xs text-muted-foreground">Scan QR or click to watch live streams</p>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground/60 gap-2">
          <p>&copy; {new Date().getFullYear()} Northland Legendary Finds. All rights reserved.</p>
          <p>Premium Topps Trading Cards &bull; 100% Authentic &bull; Collector Owned & Operated</p>
        </div>
      </div>
    </footer>
  );
}
