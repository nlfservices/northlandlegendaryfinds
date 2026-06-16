/**
 * Footer - NLF cosmic theme with all store links + newsletter signup
 */

import { Link } from "wouter";
import { Mail, Facebook, Instagram, Youtube } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={"https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/site-assets/NLF-Logo-MainLogo.png"}
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
              Premium Marvel trading card repacks with guaranteed hits. More fandoms coming soon.
            </p>
            <div className="flex gap-3">
              <a href="mailto:contact@nlfservices.com" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Email us">
                <Mail className="w-4 h-4" />
              </a>
              <a href="https://x.com/NorthlandFinds" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Follow us on X">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61575227498498" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Follow us on Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/northlandlegendaryfinds" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Follow us on Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://whatnot.com/invite/northlandfinds" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10 transition-all" title="Follow us on Whatnot">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/></svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2.5">
              <li><Link href="/checklists" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cosmic Hits</Link></li>
              <li><Link href="/characters" className="text-sm text-muted-foreground hover:text-primary transition-colors">Characters</Link></li>
              <li><Link href="/cards" className="text-sm text-muted-foreground hover:text-primary transition-colors">Card Database</Link></li>
              <li><Link href="/card-shows" className="text-sm text-muted-foreground hover:text-primary transition-colors">Card Shows</Link></li>
              <li><Link href="/whatnot" className="text-sm text-muted-foreground hover:text-primary transition-colors">Whatnot</Link></li>
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
              <li><Link href="/the-collector" className="text-sm text-muted-foreground hover:text-primary transition-colors">The Collector</Link></li>
              <li><Link href="/sitemap" className="text-sm text-muted-foreground hover:text-primary transition-colors">Site Map</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2.5">
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="col-span-2 md:col-span-1">
            <NewsletterSignup variant="footer" source="footer-newsletter" />
          </div>
        </div>

        {/* Social Follow Banners */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
            {/* Facebook Follow */}
            <a href="https://www.facebook.com/profile.php?id=61575227498498" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-all">
                <Facebook className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">Like us on Facebook</p>
                <p className="text-xs text-muted-foreground">Join the NLF community for news & drops</p>
              </div>
            </a>
            {/* Whatnot Follow */}
            <a href="https://whatnot.com/invite/northlandfinds" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <div className="bg-white rounded-lg p-1.5 shadow-sm">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-whatnot-qr_a49cbbc8.jpg"
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
          <p>6390 McKinley St NW, Anoka, MN 55303</p>
          <p>Premium Topps Trading Cards &bull; 100% Authentic &bull; Collector Owned & Operated</p>
        </div>
      </div>
    </footer>
  );
}
