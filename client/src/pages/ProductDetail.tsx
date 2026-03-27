/**
 * ProductDetail - Individual product page with Stripe checkout
 * Design: Large image left, details right, Buy Now with Stripe, features list
 * Launch gating: Products with a launchDate show a countdown + Notify Me form until launch
 */

import { useParams, Link } from "wouter";
import { CreditCard, ArrowLeft, Shield, Star, Package, Check, AlertCircle, Loader2, Clock, Zap, Bell, Mail, CheckCircle2, ListChecks, TrendingUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductBySlug, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import LivePackCounter from "@/components/LivePackCounter";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";
import { useAuth } from "@/_core/hooks/useAuth";
import SEO, { productJsonLd, breadcrumbJsonLd } from "@/components/SEO";

function NotifyMeForm({ productSlug }: { productSlug: string }) {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = trpc.public.launch.subscribe.useMutation({
    onSuccess: (data) => {
      setSubscribed(true);
      if (data.alreadySubscribed) {
        toast.success("You're already on the list! We'll notify you at launch.");
      } else {
        toast.success("You're in! We'll email you when this product drops.");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    subscribe.mutate({
      email: email.trim(),
      productSlug,
      source: "product-page",
    });
  };

  if (subscribed) {
    return (
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 text-center">
        <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
        <p className="text-primary font-bold text-sm">You're on the list!</p>
        <p className="text-xs text-muted-foreground mt-1">
          We'll send a notification to <strong className="text-foreground">{email}</strong> when this product goes live.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-primary" />
        <span className="text-sm font-bold">Get Notified at Launch</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Enter your email and we'll let you know the moment this product is available.
      </p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
        <Button
          type="submit"
          disabled={subscribe.isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 whitespace-nowrap"
        >
          {subscribe.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Bell className="w-4 h-4 mr-1.5" />
              Notify Me
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function LaunchCountdownBlock({ launchDateUtc, productSlug }: { launchDateUtc: string; productSlug: string }) {
  const { days, hours, minutes, seconds, isLaunched } = useLaunchCountdown(launchDateUtc);

  if (isLaunched) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="mb-8 space-y-4">
      {/* Countdown banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-primary font-bold text-sm uppercase tracking-wider">
            Available April 27th at 7:00 PM CT
          </span>
        </div>

        {/* Countdown digits */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {[
            { value: days, label: "DAYS" },
            { value: hours, label: "HRS" },
            { value: minutes, label: "MIN" },
            { value: seconds, label: "SEC" },
          ].map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-3">
              <div className="bg-background/80 border border-primary/20 rounded-lg px-3 py-2 min-w-[60px]">
                <div
                  className="text-2xl md:text-3xl font-bold text-primary tabular-nums"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  {pad(unit.value)}
                </div>
                <div className="text-[10px] text-muted-foreground tracking-wider">{unit.label}</div>
              </div>
              {i < 3 && <span className="text-primary/50 text-2xl font-bold">:</span>}
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          This product drops <strong className="text-foreground">Sunday, April 27th, 2026</strong> at 7:00 PM Central Time.
        </p>
      </div>

      {/* Notify Me form */}
      <NotifyMeForm productSlug={productSlug} />

      {/* Disabled Buy Now button */}
      <Button
        disabled
        size="lg"
        className="w-full bg-muted text-muted-foreground font-bold text-lg py-6 cursor-not-allowed"
      >
        <Clock className="w-5 h-5 mr-2" />
        Available April 27th
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Checkout will be enabled when the countdown reaches zero.
      </p>
    </div>
  );
}

function ChecklistPreview({ checklistSlug, productName }: { checklistSlug: string; productName: string }) {
  // First get the product from DB to get its ID
  const { data: dbProduct, isLoading: productLoading } = trpc.public.products.getBySlug.useQuery(
    { slug: checklistSlug },
    { enabled: !!checklistSlug }
  );

  // Then fetch the checklist using the product ID
  const { data: checklist, isLoading: checklistLoading } = trpc.public.checklist.getByProduct.useQuery(
    { productId: dbProduct?.id! },
    { enabled: !!dbProduct?.id }
  );

  const isLoading = productLoading || checklistLoading;

  // Group by tier
  const grouped = useMemo(() => {
    if (!checklist) return {};
    const groups: Record<string, typeof checklist> = {};
    for (const item of checklist) {
      if (!groups[item.tier]) groups[item.tier] = [];
      groups[item.tier].push(item);
    }
    return groups;
  }, [checklist]);

  const tierOrder = ["chase", "hit", "base", "bonus"];
  const tierLabels: Record<string, string> = {
    chase: "Chase Cards",
    hit: "Hit Cards",
    base: "Base Cards",
    bonus: "Bonus Cards",
  };
  const tierColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    chase: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", icon: "text-amber-400" },
    hit: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30", icon: "text-purple-400" },
    base: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", icon: "text-blue-400" },
    bonus: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", icon: "text-green-400" },
  };

  const CARD_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='64' fill='%23333'%3E%3Crect width='48' height='64' rx='4' fill='%231a1a2e'/%3E%3Ctext x='24' y='36' text-anchor='middle' fill='%23555' font-size='10'%3E?%3C/text%3E%3C/svg%3E";

  if (isLoading) {
    return (
      <section className="py-16 border-t border-border">
        <div className="container">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!checklist || checklist.length === 0) return null;

  return (
    <section className="py-16 border-t border-border">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ListChecks className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                FULL <span className="text-primary">CHECKLIST</span>
              </h2>
            </div>
            <p className="text-muted-foreground">
              Every card in {productName} — {checklist.length} total cards across {Object.keys(grouped).length} tiers
            </p>
          </div>
          <Link href={`/checklist/${checklistSlug}`}>
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              <Eye className="w-4 h-4 mr-2" />
              Full Details
            </Button>
          </Link>
        </div>

        {/* Tier Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {tierOrder.map(tier => {
            const items = grouped[tier];
            if (!items || items.length === 0) return null;
            const colors = tierColors[tier];
            return (
              <div key={tier} className={`${colors.bg} border ${colors.border} rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-bold ${colors.text}`} style={{ fontFamily: "'Anton', sans-serif" }}>
                  {items.length}
                </div>
                <div className="text-sm text-muted-foreground">{tierLabels[tier]}</div>
              </div>
            );
          })}
        </div>

        {/* Checklist by Tier */}
        <div className="space-y-6">
          {tierOrder.map(tier => {
            const items = grouped[tier];
            if (!items || items.length === 0) return null;
            const colors = tierColors[tier];
            return (
              <div key={tier}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center`}>
                    {tier === 'chase' && <TrendingUp className={`w-4 h-4 ${colors.icon}`} />}
                    {tier === 'hit' && <Zap className={`w-4 h-4 ${colors.icon}`} />}
                    {tier === 'base' && <Package className={`w-4 h-4 ${colors.icon}`} />}
                    {tier === 'bonus' && <Eye className={`w-4 h-4 ${colors.icon}`} />}
                  </div>
                  <h3 className="text-lg font-bold">{tierLabels[tier]}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}>
                    {items.length} cards
                  </span>
                </div>
                <div className="grid gap-1.5">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card border-border hover:border-primary/20 transition-all"
                    >
                      <img
                        src={item.imageUrl || CARD_PLACEHOLDER}
                        alt={item.cardName}
                        className="w-10 h-14 object-cover rounded-md border border-border shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">
                          {item.cardName}
                          {item.parallel && (
                            <span className="text-primary ml-1.5 text-xs font-normal">({item.parallel})</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-x-1.5">
                          {item.cardSet && <span>{item.cardSet}</span>}
                          {item.cardYear && <span>· {item.cardYear}</span>}
                          {item.cardNumber && <span>· #{item.cardNumber}</span>}
                          {item.cardCondition && <span>· {item.cardCondition}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA to full checklist page */}
        <div className="mt-8 text-center">
          <Link href={`/checklist/${checklistSlug}`}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              <ListChecks className="w-5 h-5 mr-2" />
              View Full Checklist with Pull Tracking
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const [quantity, setQuantity] = useState(1);

  // Determine if the product has a future launch date
  const hasLaunchGate = product?.launchDate
    ? new Date() < new Date(product.launchDate)
    : false;

  // Fetch live pack data for repack products (only if they have a dbSlug, meaning they exist in the DB)
  const dbSlugToQuery = product?.dbSlug || slug || "";
  const { data: dbProduct } = trpc.public.products.getBySlug.useQuery(
    { slug: dbSlugToQuery },
    { enabled: !!product?.isRepack && !product?.isComingSoon && !!product?.dbSlug, refetchInterval: 30000 }
  );
  const livePacksRemaining = dbProduct?.packsRemaining ?? product?.inventory ?? 0;
  const liveTotalPacks = dbProduct?.totalPacks ?? product?.inventory ?? 0;
  const isSoldOut = product?.isRepack && !product?.isComingSoon && liveTotalPacks > 0 && livePacksRemaining <= 0;

  const createSession = trpc.checkout.createSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("Redirecting to secure checkout...");
        window.open(data.url, "_blank");
      }
    },
    onError: (error) => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Link href="/shop">
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBuyNow = () => {
    if (!product.inStock || hasLaunchGate) return;
    createSession.mutate({
      productSlug: product.slug,
      quantity,
    });
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <SEO
        title={product.name}
        description={product.description.substring(0, 155)}
        path={`/product/${product.slug}`}
        image={product.image}
        type="product"
        jsonLd={[
          productJsonLd({
            name: product.name,
            description: product.description,
            image: product.image,
            price: product.price,
            availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `/product/${product.slug}`,
            sku: product.slug,
          }),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Shop", url: "/shop" },
            { name: product.name, url: `/product/${product.slug}` },
          ]),
        ]}
      />
      {/* Breadcrumb */}
      <div className="container py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-8">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Image */}
            <div className="relative">
              <div className="sticky top-24 bg-card rounded-2xl border border-border overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center p-8">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    width={600}
                    height={600}
                    className="max-w-full max-h-full object-contain drop-shadow-[0_0_30px_rgba(0,255,65,0.1)]"
                  />
                </div>
                {product.badge && (
                  <div className="absolute top-4 left-4 px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {product.badge}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="py-4">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                {product.subtitle}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.comparePrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.comparePrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Live Pack Counter */}
              {product.isRepack && !product.isComingSoon && product.dbSlug && (
                <LivePackCounter productSlug={product.dbSlug} fallbackInventory={product.inventory} />
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {product.inStock && !hasLaunchGate ? (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-green-400 font-bold">
                      In Stock — Limited packs remaining
                    </span>
                  </>
                ) : product.inStock && hasLaunchGate ? (
                  <>
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary font-bold">
                      Drops April 27th — packs available at launch
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-amber-400 font-bold">Coming Soon</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Launch countdown + Notify Me (shown before launch date) */}
              {product.inStock && hasLaunchGate && product.launchDate && (
                <LaunchCountdownBlock launchDateUtc={product.launchDate} productSlug={product.slug} />
              )}

              {/* Buy Now with Stripe (shown after launch date, not sold out) */}
              {product.inStock && !hasLaunchGate && (
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-3 text-lg font-bold hover:bg-muted transition-colors"
                      >
                        −
                      </button>
                      <span className="px-4 py-3 text-lg font-bold min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(5, quantity + 1))}
                        className="px-4 py-3 text-lg font-bold hover:bg-muted transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <Button
                      onClick={handleBuyNow}
                      disabled={createSession.isPending}
                      size="lg"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6"
                    >
                      {createSession.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Buy Now — ${(product.price * quantity).toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Secure checkout powered by Stripe. Opens in a new tab.
                  </p>
                </div>
              )}

              {!product.inStock && (
                <div className="mb-8">
                  <Button size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg py-6" onClick={() => toast.info("Notification feature coming soon!")}>
                    Notify Me When Available
                  </Button>
                </div>
              )}

              {/* Sold Out State - shown when all packs are gone */}
              {isSoldOut && !hasLaunchGate && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                  <p className="text-red-400 font-bold text-lg mb-1">SOLD OUT</p>
                  <p className="text-sm text-muted-foreground">All {liveTotalPacks} packs have been sold. This series is complete!</p>
                  <Link href="/checklists">
                    <Button variant="outline" className="mt-3 border-red-500/30 text-red-400 hover:bg-red-500/10">
                      View Complete Checklist
                    </Button>
                  </Link>
                </div>
              )}

              {/* Features */}
              <div className="bg-card rounded-xl border border-border p-6 mb-8">
                <h3 className="font-bold text-lg mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-card rounded-lg border border-border">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">100% Authentic</p>
                </div>
                <div className="text-center p-3 bg-card rounded-lg border border-border">
                  <Star className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Full Checklist</p>
                </div>
                <div className="text-center p-3 bg-card rounded-lg border border-border">
                  <Package className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Hand-Curated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist Preview — only for products with a checklistSlug */}
      {product.checklistSlug && (
        <ChecklistPreview checklistSlug={product.checklistSlug} productName={product.name} />
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Anton', sans-serif" }}>
              YOU MAY ALSO <span className="text-primary">LIKE</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
