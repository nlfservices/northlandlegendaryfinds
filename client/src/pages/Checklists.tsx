/**
 * Public Checklists Page - Browse all product checklists
 * The HIGHLIGHT feature of the site - builds trust through transparency
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  ListChecks, ArrowRight, Package, Zap, Radio,
  CheckCircle2, Circle, Loader2, TrendingUp, Eye
} from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

export default function Checklists() {
  const { data: products, isLoading } = trpc.public.products.list.useQuery();

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
              Get a glimpse of what's inside our repacks. Browse the Gambit's Deck checklist below to see 
              the quality and variety of cards we include. More checklists will be revealed at launch.
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
                {products?.filter(p => p.slug === "nlf-marvel-52-singles").length || 0}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Preview Checklists</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400" style={{ fontFamily: "'Anton', sans-serif" }}>100%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Published Checklists</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Anton', sans-serif" }}>FULL</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Transparency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 lg:py-16">
        <div className="container">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-20">
              <ListChecks className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Checklists Coming Soon</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Product checklists will be published here before launch. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter(product => product.slug === "nlf-marvel-52-singles")
                .map(product => (
                  <ProductChecklistCard key={product.id} product={product} categoryColors={categoryColors} categoryLabels={categoryLabels} />
                ))}
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

function ProductChecklistCard({ product, categoryColors, categoryLabels }: {
  product: any;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
}) {
  const { data: stats } = trpc.public.products.stats.useQuery({ id: product.id });

  const progressPercent = stats?.totalPacks ? Math.round(((stats.totalPacks - stats.packsRemaining) / stats.totalPacks) * 100) : 0;

  return (
    <Link href={`/checklist/${product.slug}`}>
      <Card className="group hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden h-full">
        {/* Category Banner */}
        <div className={`h-2 bg-gradient-to-r ${categoryColors[product.category] || categoryColors.other}`} />
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant="outline" className="mb-2 text-xs">
                {categoryLabels[product.category] || product.category}
              </Badge>
              {product.isWhatnotExclusive && (
                <Badge variant="outline" className="ml-2 mb-2 text-xs border-purple-500/50 text-purple-400">
                  <Radio className="w-3 h-3 mr-1" /> Whatnot Exclusive
                </Badge>
              )}
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{product.name}</h3>
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
              <span className="font-bold">{stats?.totalChecklist || 0} cards</span>
            </div>
            {/* Pulled stat hidden pre-launch */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Packs Remaining</span>
              <span className="font-bold text-primary">{stats?.packsRemaining || product.packsRemaining} / {stats?.totalPacks || product.totalPacks}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {progressPercent}% opened
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
