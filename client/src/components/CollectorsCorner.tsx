/**
 * Collector's Corner — Appears on every MCU News article
 * 
 * Shows:
 * 1. Admin-managed affiliate/product links (matched by character tags or pinned)
 * 2. Default card site rotation when no affiliate links exist (COMC, MySlabs, eBay, Whatnot)
 * 3. Link to the card database for related characters
 * 
 * Future: When monetization is turned on, these become affiliate links with FTC disclosure
 */

import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ExternalLink, ShoppingBag, Layers, CreditCard, Sparkles } from "lucide-react";

// Default card sites shown when no affiliate links are configured
const DEFAULT_CARD_SITES = [
  {
    name: "COMC",
    url: "https://www.comc.com/Cards/Trading_Cards/Marvel",
    description: "Check Out My Cards — Browse singles",
    icon: "🃏",
  },
  {
    name: "MySlabs",
    url: "https://www.myslabs.com",
    description: "Track your graded card collection",
    icon: "📊",
  },
  {
    name: "eBay",
    url: "https://www.ebay.com/sch/i.html?_nkw=marvel+trading+cards",
    description: "Find deals on Marvel cards",
    icon: "🛒",
  },
  {
    name: "Whatnot",
    url: "https://www.whatnot.com/user/northlandlegendaryfinds",
    description: "Watch us rip live — free giveaways",
    icon: "🎬",
  },
];

type CollectorsCornerProps = {
  articleId: number;
  tags?: string[];
  relatedCharacters?: string[];
};

export default function CollectorsCorner({ articleId, tags, relatedCharacters }: CollectorsCornerProps) {
  const { data: affiliateLinks } = trpc.affiliateLinks.getForArticle.useQuery({
    articleId,
    tags,
    relatedCharacters,
  });

  const hasAffiliateLinks = affiliateLinks && affiliateLinks.length > 0;
  const hasAnyAffiliateContent = affiliateLinks?.some((l: { isAffiliate: boolean }) => l.isAffiliate);

  return (
    <div className="my-10 relative">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Collector's Corner</h3>
          <p className="text-xs text-muted-foreground">Resources for card collectors and Marvel fans</p>
        </div>
      </div>

      {/* FTC Disclosure — only shows when affiliate links are present */}
      {hasAnyAffiliateContent && (
        <p className="text-[10px] text-muted-foreground/70 mb-4 italic">
          Some links below are affiliate links. We may earn a small commission at no extra cost to you.
        </p>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {hasAffiliateLinks ? (
          // Show admin-managed affiliate/product links
          affiliateLinks.map((link: {
            id: number;
            name: string;
            url: string;
            imageUrl: string | null;
            category: string;
            retailer: string | null;
            priceDisplay: string | null;
            isAffiliate: boolean;
          }) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel={link.isAffiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}
              className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              {link.imageUrl ? (
                <img src={link.imageUrl} alt={link.name} className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{link.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {link.retailer && <span>{link.retailer}</span>}
                  {link.priceDisplay && <span className="text-primary font-bold">{link.priceDisplay}</span>}
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary flex-shrink-0 transition-colors" />
            </a>
          ))
        ) : (
          // Show default card sites when no affiliate links configured
          DEFAULT_CARD_SITES.map((site) => (
            <a
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-2xl">
                {site.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium group-hover:text-primary transition-colors">{site.name}</p>
                <p className="text-xs text-muted-foreground truncate">{site.description}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary flex-shrink-0 transition-colors" />
            </a>
          ))
        )}

        {/* Always show: Link to Card Database */}
        <Link
          href="/cards"
          className="group flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary">Browse Card Database</p>
            <p className="text-xs text-muted-foreground">1,709+ Marvel cards with values</p>
          </div>
          <CreditCard className="w-3.5 h-3.5 text-primary/50 flex-shrink-0" />
        </Link>
      </div>
    </div>
  );
}
