/**
 * Public Checklists Page - Browse all product checklists
 * The HIGHLIGHT feature of the site - builds trust through transparency
 * 
 * Logic:
 * - Gambit's Deck: Always visible (transparency preview)
 * - Products with launch dates: Checklist unlocks 1 week before launch
 * - Coming Soon products: Shown as locked with no reveal date
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  ListChecks, ArrowRight, Package, Zap, Radio,
  CheckCircle2, Circle, Loader2, TrendingUp, Eye,
  Lock, Clock
} from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";
import { products as frontendProducts } from "@/lib/products";
import { useMemo } from "react";

/** Slugs that are always revealed regardless of date */
const ALWAYS_REVEALED_SLUGS: string[] = [];

/** Check if a product's checklist is unlocked (1 week before launch or always revealed) */
function isChecklistUnlocked(product: { dbSlug?: string; checklistSlug?: string; launchDate?: string; isComingSoon: boolean }): boolean {
  const slug = product.dbSlug || product.checklistSlug || "";
  if (ALWAYS_REVEALED_SLUGS.includes(slug)) return true;
  if (product.isComingSoon || !product.launchDate) return false;
  
  const launchDate = new Date(product.launchDate);
  const oneWeekBefore = new Date(launchDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  return new Date() >= oneWeekBefore;
}

/** Get the reveal date (1 week before launch) */
function getRevealDate(launchDate?: string): Date | null {
  if (!launchDate) return null;
  const launch = new Date(launchDate);
  return new Date(launch.getTime() - 7 * 24 * 60 * 60 * 1000);
}

/** Format date for display */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function Checklists() {
  const { data: dbProducts, isLoading } = trpc.public.products.list.useQuery();

  // Get all repack products from frontend data (includes all product lines, even coming soon)
  const allRepacks = useMemo(() => frontendProducts.filter(p => p.isRepack), []);

  // Deduplicate by product line — show one card per product line
  const productLines = useMemo(() => {
    const seen = new Set<string>();
    const result: typeof allRepacks = [];
    
    for (const product of allRepacks) {
      const lineKey = product.productLine || product.id;
      if (!seen.has(lineKey)) {
        seen.add(lineKey);
        result.push(product);
      }
    }
    return result;
  }, [allRepacks]);

  // Count unlocked vs total
  const unlockedCount = productLines.filter(p => isChecklistUnlocked(p)).length;

  const categoryColors: Record<string, string> = {
    marvel: "from-red-600 to-red-800",
    starwars: "from-cyan-600 to-blue-800",
    sports: "from-green-600 to-green-800",
    pokemon: "from-yellow-600 to-amber-800",
    other: "from-purple-600 to-purple-800",
  };

  const categoryLabels: Record<string, string> = {
    marvel: "Marvel",
    starwars: "Star Wars",
    sports: "Sports",
    pokemon: "Pokemon",
    other: "Other",
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Card Set Checklists"
        description="Complete checklists for all Marvel trading card sets included in Northland Legendary Finds repacks. Track your collection progress."
        path="/checklists"
        jsonLd={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Checklists", url: "/checklists" }])}
      />
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide">FULL TRANSPARENCY</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              PRODUCT <span className="text-primary">CHECKLISTS</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every NLF repack has a full checklist published before launch. Browse below to see what's inside 
              each set. Checklists are revealed one week before their launch date.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-y border-border">
        <div className="container py-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary" style={{ fontFamily: "'Anton', sans-serif" }}>
                {unlockedCount} / {productLines.length}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Checklists Revealed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400" style={{ fontFamily: "'Anton', sans-serif" }}>100%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Published Before Launch</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Anton', sans-serif" }}>FULL</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Transparency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gambit Preview Banner — hidden until checklists are revealed */}

      {/* Product Grid */}
      <section className="py-12 lg:py-16">
        <div className="container">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productLines.map(product => {
                const unlocked = isChecklistUnlocked(product);
                const dbProduct = dbProducts?.find(
                  (p: any) => p.slug === product.dbSlug || p.slug === product.checklistSlug
                );
                return (
                  <ChecklistCard
                    key={product.id}
                    product={product}
                    dbProduct={dbProduct}
                    unlocked={unlocked}
                    categoryColors={categoryColors}
                    categoryLabels={categoryLabels}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHY WE PUBLISH <span className="text-primary">CHECKLISTS</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Full Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Every card is listed before you buy. Know exactly what's possible in every pack.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="font-bold mb-2">Live Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track pack openings live during streams. See what's still available in real-time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-bold mb-2">Collector Confidence</h3>
              <p className="text-sm text-muted-foreground">
                See exactly what's in every set before you buy. Full transparency builds trust.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChecklistCard({ product, dbProduct, unlocked, categoryColors, categoryLabels }: {
  product: any;
  dbProduct: any;
  unlocked: boolean;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
}) {
  const slug = product.dbSlug || product.checklistSlug || product.slug;
  const revealDate = getRevealDate(product.launchDate);
  const launchDate = product.launchDate ? new Date(product.launchDate) : null;

  // For unlocked products, fetch stats
  const { data: stats } = trpc.public.products.stats.useQuery(
    { id: dbProduct?.id },
    { enabled: !!dbProduct && unlocked }
  );

  const progressPercent = stats?.totalPacks ? Math.round(((stats.totalPacks - stats.packsRemaining) / stats.totalPacks) * 100) : 0;

  // Unlocked card — clickable link to checklist
  if (unlocked) {
    return (
      <Link href={`/checklist/${slug}`}>
        <Card className="group hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden h-full">
          {/* Category Banner */}
          <div className={`h-2 bg-gradient-to-r ${categoryColors[product.category] || categoryColors.other}`} />
          
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {categoryLabels[product.category] || product.category}
                  </Badge>
                  <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                    <Eye className="w-3 h-3 mr-1" /> Viewable
                  </Badge>
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {product.productLine === "gambit-deck" ? "Gambit's Deck" : product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{product.subtitle}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
            )}

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Checklist</span>
                <span className="font-bold">{stats?.totalChecklist || dbProduct?.totalChecklist || "—"} cards</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Packs</span>
                <span className="font-bold text-primary">{product.packCount || stats?.totalPacks || "—"}</span>
              </div>

              {stats?.totalPacks ? (
                <>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    {progressPercent}% opened
                  </div>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Locked card — not clickable
  return (
    <Card className="overflow-hidden h-full opacity-80 relative">
      {/* Category Banner */}
      <div className={`h-2 bg-gradient-to-r ${categoryColors[product.category] || categoryColors.other} opacity-50`} />
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {categoryLabels[product.category] || product.category}
              </Badge>
              <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400">
                <Lock className="w-3 h-3 mr-1" /> Locked
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-muted-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{product.subtitle}</p>
          </div>
          <Lock className="w-5 h-5 text-muted-foreground/50 shrink-0 mt-1" />
        </div>

        {/* Lock message */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">Checklist Coming Soon</span>
          </div>
          {revealDate ? (
            <p className="text-xs text-muted-foreground">
              Full checklist reveals on <span className="font-semibold text-foreground">{formatDate(revealDate)}</span> — one week before launch.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Full checklist will be published one week before launch. Stay tuned!
            </p>
          )}
        </div>

        {/* Basic info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Packs</span>
            <span className="font-bold">{product.packCount || "TBA"}</span>
          </div>
          {launchDate ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Launch Date</span>
              <span className="font-bold">{formatDate(launchDate)}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Launch Date</span>
              <span className="font-bold text-muted-foreground">Coming Soon</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price</span>
            <span className="font-bold">${product.price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
