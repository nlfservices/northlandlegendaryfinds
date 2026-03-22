/**
 * SlabPackChecklist - Public checklist page for a slab pack
 * Shows all cards in the pack organized by rarity tier
 * Available cards shown in color, claimed cards grayed out with CLAIMED badge
 */
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Crown, Star, Layers, ArrowLeft, Package, CheckCircle2 } from "lucide-react";

const TIER_ORDER = ["grail", "chase", "lineup"] as const;
const TIER_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string; desc: string }> = {
  grail: { label: "GRAIL", icon: <Crown className="w-5 h-5" />, color: "text-red-400 border-red-500/30", desc: "Ultra-rare hits" },
  chase: { label: "CHASE", icon: <Star className="w-5 h-5" />, color: "text-amber-400 border-amber-500/30", desc: "Uncommon pulls" },
  lineup: { label: "LINEUP", icon: <Layers className="w-5 h-5" />, color: "text-blue-400 border-blue-500/30", desc: "Base card pool" },
};

export default function SlabPackChecklist() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = trpc.slabPacks.checklist.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl font-bold mb-2">Pack Not Found</p>
          <Link href="/shop"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop</Button></Link>
        </div>
      </div>
    );
  }

  const { pack, cards, stats } = data;
  const groupedCards = TIER_ORDER.map(tier => ({
    tier,
    ...TIER_LABELS[tier],
    cards: cards.filter(c => c.tier === tier),
  })).filter(g => g.cards.length > 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Shop
            </Button>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">{pack.name}</h1>
          {pack.description && <p className="text-muted-foreground mt-2">{pack.description}</p>}

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-500/10">
              {stats.available} Available
            </Badge>
            <Badge variant="outline" className="text-red-400 border-red-500/30 bg-red-500/10">
              {stats.claimed} Claimed
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              {stats.total} Total
            </Badge>
          </div>
        </div>

        {/* Card tiers */}
        {groupedCards.map(group => (
          <div key={group.tier} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`flex items-center gap-2 ${group.color}`}>
                {group.icon}
                <h2 className="text-xl font-bold">{group.label}</h2>
              </div>
              <span className="text-sm text-muted-foreground">{group.desc}</span>
              <span className="text-sm text-muted-foreground ml-auto">
                {group.cards.filter(c => c.status === "available").length}/{group.cards.length} remaining
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.cards.map(card => {
                const isClaimed = card.status === "claimed";
                return (
                  <Card key={card.id} className={`transition-all ${isClaimed ? "opacity-50 grayscale" : "hover:border-primary/30"}`}>
                    <CardContent className="py-3">
                      <div className="flex items-center gap-3">
                        {card.frontImageUrl ? (
                          <img src={card.frontImageUrl} alt={card.cardName}
                            className={`w-12 h-16 rounded object-cover ${isClaimed ? "grayscale" : ""}`} />
                        ) : (
                          <div className="w-12 h-16 rounded bg-muted flex items-center justify-center">
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold truncate">{card.cardName}</p>
                            {isClaimed && (
                              <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px] shrink-0">
                                <CheckCircle2 className="w-3 h-3 mr-0.5" /> CLAIMED
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {card.cardSet || ''} {card.cardNumber ? `#${card.cardNumber}` : ""}
                            {card.parallel ? ` · ${card.parallel}` : ""}
                          </p>
                          {card.grade && (
                            <p className="text-xs text-muted-foreground">{card.gradingCompany || ''} {card.grade}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
