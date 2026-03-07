/**
 * LivePackCounter - Real-time pack inventory display for public product pages
 * Fetches live data from the database instead of using static product data
 */
import { trpc } from "@/lib/trpc";
import { Package, TrendingDown, AlertTriangle } from "lucide-react";

interface LivePackCounterProps {
  /** The product slug to look up in the database */
  productSlug: string;
  /** Fallback inventory number from static product data */
  fallbackInventory?: number;
}

export default function LivePackCounter({ productSlug, fallbackInventory = 500 }: LivePackCounterProps) {
  const { data: dbProduct } = trpc.public.products.getBySlug.useQuery(
    { slug: productSlug },
    { refetchInterval: 30000 } // Refresh every 30 seconds for live feel
  );

  const totalPacks = dbProduct?.totalPacks || fallbackInventory;
  const packsRemaining = dbProduct?.packsRemaining ?? fallbackInventory;
  const packsSold = totalPacks - packsRemaining;
  const progressPercent = totalPacks > 0 ? Math.round((packsSold / totalPacks) * 100) : 0;
  const isSoldOut = packsRemaining <= 0 && totalPacks > 0;
  const isLow = packsRemaining > 0 && packsRemaining <= Math.ceil(totalPacks * 0.1);

  if (!dbProduct) {
    // Fallback to static data while loading
    return (
      <div className="bg-card border border-border rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold">Pack Inventory</span>
          </div>
          <span className="text-sm text-muted-foreground">{fallbackInventory} packs</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 mb-6 ${
      isSoldOut ? 'bg-red-500/5 border-red-500/30' :
      isLow ? 'bg-amber-500/5 border-amber-500/30' :
      'bg-card border-border'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isSoldOut ? (
            <AlertTriangle className="w-5 h-5 text-red-400" />
          ) : isLow ? (
            <TrendingDown className="w-5 h-5 text-amber-400" />
          ) : (
            <Package className="w-5 h-5 text-primary" />
          )}
          <span className="text-sm font-bold">
            {isSoldOut ? 'SOLD OUT' : isLow ? 'Almost Gone!' : 'Pack Inventory'}
          </span>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold ${
            isSoldOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-primary'
          }`} style={{ fontFamily: "'Anton', sans-serif" }}>
            {packsRemaining}
          </span>
          <span className="text-xs text-muted-foreground ml-1">/ {totalPacks}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isSoldOut ? 'bg-red-500' :
            isLow ? 'bg-amber-500' :
            'bg-gradient-to-r from-primary to-green-400'
          }`}
          style={{ width: `${Math.min(progressPercent, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{packsSold} sold</span>
        <span>{packsRemaining} remaining</span>
      </div>

      {isLow && !isSoldOut && (
        <p className="text-xs text-amber-400 mt-2 font-medium">
          Only {packsRemaining} packs left — grab yours before they're gone!
        </p>
      )}
    </div>
  );
}
