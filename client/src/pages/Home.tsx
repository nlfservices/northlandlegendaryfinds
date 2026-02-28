/**
 * Homepage - E-commerce storefront inspired by Giant Sports Cards & Hit Parade
 * Design: Hero with pack image, featured products, trust elements, FAQ preview
 */

import { ShoppingCart, Shield, Star, TrendingUp, Package, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { products, getRepackProducts, getComingSoonProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hero-banner-jniBj55ukeiEDpJxc2aLgB.webp";
const NLF_PACK = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/xYmShpBhbXYuurgy.jpg";
const NLF_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/rwZcaJaSCFxygqjF.png";
const TRUST_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/trust-section-bg-kwnjuLkybJ2rqpCpEwiChw.webp";

export default function Home() {
  const { addItem } = useCart();
  const repackProducts = getRepackProducts();
  const comingSoonProducts = getComingSoonProducts();

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div className="py-12 lg:py-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-bold tracking-wide">LAUNCHING MARCH 13, 2026</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-white">UNBOX THE</span>
                <br />
                <span className="text-primary">LEGENDARY</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-lg mb-8 leading-relaxed">
                Premium <strong className="text-primary">Marvel</strong> &amp; <strong className="text-cyan-400">Star Wars</strong> trading card repacks with guaranteed hits in every pack. Limited to 500 packs each.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 shadow-lg shadow-primary/20">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Shop Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold text-lg px-8 py-6">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Pack Image */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-8 bg-primary/10 rounded-full blur-3xl" />
                <img
                  src={NLF_PACK}
                  alt="NLF Repack"
                  className="relative w-80 xl:w-96 drop-shadow-[0_0_40px_rgba(0,255,65,0.2)] hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-card border-y border-border">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary" style={{ fontFamily: "'Anton', sans-serif" }}>500</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Packs Per Drop</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400" style={{ fontFamily: "'Anton', sans-serif" }}>100%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Authentic Topps</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400" style={{ fontFamily: "'Anton', sans-serif" }}>GUARANTEED</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Hits Every Pack</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400" style={{ fontFamily: "'Anton', sans-serif" }}>FREE</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Shipping Over $199</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED REPACKS ===== */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              <span className="text-primary">LAUNCH</span> EXCLUSIVE REPACKS
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hand-curated premium trading card repacks with guaranteed hits. Limited to 500 packs each — once they're gone, they're gone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {repackProducts.map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/shop">
              <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TRUST / WHY NLF ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={TRUST_BG} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-background/90" />
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHY <span className="text-primary">NLF</span>?
            </h2>
            <p className="text-muted-foreground text-lg">
              What sets Northland Legendary Finds apart from the rest
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">100% Authentic</h3>
              <p className="text-sm text-muted-foreground">
                Every card is verified authentic from official Topps releases. No counterfeits, ever.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-cyan-500/30 transition-colors">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Guaranteed Hits</h3>
              <p className="text-sm text-muted-foreground">
                Every repack includes guaranteed chase cards — autos, relics, or numbered parallels.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Investment Grade</h3>
              <p className="text-sm text-muted-foreground">
                Cards from premium sets that hold and appreciate in value over time.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-purple-500/30 transition-colors">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Fast & Secure</h3>
              <p className="text-sm text-muted-foreground">
                Orders ship within 24 hours with secure packaging and full tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMING SOON PRODUCTS ===== */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              <span className="text-purple-400">COMING</span> SOON
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Premium sealed products arriving soon. Sign up for notifications to be the first to know.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {comingSoonProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            JOIN THE <span className="text-primary">LEGEND</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Be the first to know about new drops, exclusive offers, and collector tips
          </p>
          <Link href="/subscribe">
            <Button size="lg" className="bg-primary hover:bg-primary/90 font-bold text-lg px-10 py-6">
              Sign Up for Early Access
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
