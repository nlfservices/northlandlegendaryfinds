/**
 * NLF Cosmic Hits - Checklists Page
 * Hit Parade-inspired simple layout: grid of series → modal with flat card list
 * Updated after each stream to show pulled status
 * 
 * NOTE: Currently showing Coming Soon with Variant Series product images.
 * No details, no prices, no checklists — just images and names.
 * The ProductCard and ChecklistModal components are preserved below
 * for when series are ready to be fully activated.
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, CheckCircle2, Sparkles, Eye, ListChecks, Rocket, Clock } from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";
import { useState, useMemo } from "react";

const COSMIC_DROP_IMG = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-nlf-variant-2CkMPP3CsZhFkFXpzSuZkV.webp";
const CHROME_EDITION_IMG = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-100-pack-LsACR5odDHrd8r7na6iEeJ.webp";

interface DbProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  totalPacks: number;
  packsRemaining: number;
  category: string;
  status: string;
  isWhatnotExclusive: boolean;
  whatnotSeriesName: string | null;
  sortOrder: number;
}

interface ChecklistItem {
  id: number;
  productId: number;
  cardName: string;
  cardSet: string | null;
  cardYear: string | null;
  cardNumber: string | null;
  parallel: string | null;
  tier: string;
  cardCondition: string | null;
  isPulled: boolean;
  estimatedValue: string | null;
  imageUrl: string | null;
  sortOrder: number;
}

const comingSoonSeries = [
  {
    name: "Variant Series: Cosmic Drop",
    image: COSMIC_DROP_IMG,
  },
  {
    name: "Variant Series: Chrome Edition",
    image: CHROME_EDITION_IMG,
  },
];

export default function Checklists() {
  return (
    <div className="min-h-screen">
      <SEO
        title="NLF Cosmic Hits | Checklists"
        description="Complete checklists for all NLF Cosmic Hits trading card series. Full transparency — see every card before you buy."
        path="/checklists"
        jsonLd={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "NLF Cosmic Hits", url: "/checklists" }])}
      />

      {/* Hero Section — clean and simple */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              NLF <span className="text-primary">COSMIC HITS</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every series. Every card. Full transparency.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Series Grid */}
      <section className="py-12 lg:py-16">
        <div className="container max-w-4xl">
          {/* Coming Soon Badge */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-bold tracking-wide">COMING SOON</span>
            </div>
          </div>

          {/* Series Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {comingSoonSeries.map((series) => (
              <div
                key={series.name}
                className="group bg-card border border-border rounded-xl overflow-hidden relative"
              >
                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 z-10 bg-black/20 flex items-end justify-center pb-6 pointer-events-none">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/90 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    <span className="text-xs font-bold text-black tracking-wide">COMING SOON</span>
                  </div>
                </div>

                {/* Product Image */}
                <div className="aspect-[3/4] bg-muted overflow-hidden">
                  <img
                    src={series.image}
                    alt={series.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Series Name Only — no details */}
                <div className="p-4">
                  <h3 className="font-bold text-lg" style={{ fontFamily: "'Anton', sans-serif" }}>
                    {series.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-1 text-sm">Full Transparency</h3>
              <p className="text-xs text-muted-foreground">Every card listed before you buy.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-bold mb-1 text-sm">Updated Live</h3>
              <p className="text-xs text-muted-foreground">Checklists updated after every stream.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-bold mb-1 text-sm">Verified Checklists</h3>
              <p className="text-xs text-muted-foreground">Every card authenticated and documented.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Product card in the grid — simple image + name + button (preserved for future use) */
function ProductCard({ product, onViewChecklist }: { product: DbProduct; onViewChecklist: () => void }) {
  const packsOpened = product.totalPacks - product.packsRemaining;
  const progressPercent = product.totalPacks > 0 ? Math.round((packsOpened / product.totalPacks) * 100) : 0;

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300">
      {/* Product Image */}
      {product.imageUrl && (
        <div className="aspect-square bg-muted overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground">{product.totalPacks} packs</span>
          {progressPercent > 0 && (
            <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
              {progressPercent}% opened
            </Badge>
          )}
        </div>

        <Button
          onClick={onViewChecklist}
          className="w-full"
          variant="default"
        >
          View Checklist
        </Button>
      </div>
    </div>
  );
}

/** Checklist modal — Hit Parade style flat list (preserved for future use) */
function ChecklistModal({ product, onClose }: { product: DbProduct; onClose: () => void }) {
  const { data: checklist, isLoading } = trpc.public.checklist.getByProduct.useQuery(
    { productId: product.id },
    { enabled: !!product.id }
  );

  // Group by tier for the "headlined by" section
  const chaseCards = useMemo(() => {
    if (!checklist) return [];
    return (checklist as ChecklistItem[]).filter(c => c.tier === "chase").slice(0, 5);
  }, [checklist]);

  const allCards = useMemo(() => {
    if (!checklist) return [];
    return checklist as ChecklistItem[];
  }, [checklist]);

  const pulledCount = useMemo(() => allCards.filter(c => c.isPulled).length, [allCards]);
  const availableCount = allCards.length - pulledCount;

  // Format a card into a single-line description (Hit Parade style)
  const formatCardLine = (item: ChecklistItem): string => {
    const parts: string[] = [];
    if (item.cardYear) parts.push(item.cardYear);
    if (item.cardSet) parts.push(item.cardSet);
    parts.push(item.cardName);
    if (item.parallel) parts.push(item.parallel);
    if (item.cardNumber) parts.push(`#${item.cardNumber}`);
    if (item.cardCondition) parts.push(item.cardCondition);
    return parts.join(" ");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
              {product.name}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span>{product.totalPacks} packs</span>
              <span>·</span>
              <span className="text-green-400">{availableCount} available</span>
              {pulledCount > 0 && (
                <>
                  <span>·</span>
                  <span className="text-muted-foreground">{pulledCount} pulled</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : allCards.length === 0 ? (
            <div className="text-center py-12">
              <ListChecks className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Checklist coming soon. Check back on launch day!</p>
            </div>
          ) : (
            <>
              {/* Description */}
              {product.description && (
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Headlined By */}
              {chaseCards.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-primary mb-3">
                    Headlined By:
                  </h3>
                  <div className="space-y-1.5">
                    {chaseCards.map(card => (
                      <div key={card.id} className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-sm font-medium">
                          {formatCardLine(card)}
                        </span>
                        {card.isPulled && (
                          <Badge variant="outline" className="text-[10px] border-red-500/50 text-red-400 ml-auto shrink-0">
                            PULLED
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-border my-6" />

              {/* Full Card List */}
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Full Checklist ({allCards.length} cards)
                </h3>
                <div className="space-y-1">
                  {allCards.map((card, index) => (
                    <div
                      key={card.id}
                      className={`flex items-center gap-2 py-1.5 px-2 rounded text-sm ${
                        card.isPulled
                          ? "bg-muted/30 text-muted-foreground line-through opacity-60"
                          : "hover:bg-muted/20"
                      }`}
                    >
                      <span className="text-muted-foreground text-xs w-6 shrink-0 text-right">
                        {index + 1}.
                      </span>
                      <span className="flex-1 min-w-0 truncate">
                        {formatCardLine(card)}
                      </span>
                      {card.isPulled && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 shrink-0">
          <p className="text-xs text-muted-foreground text-center">
            Checklists are updated after every stream. Cards marked as pulled have been opened live.
          </p>
        </div>
      </div>
    </div>
  );
}

