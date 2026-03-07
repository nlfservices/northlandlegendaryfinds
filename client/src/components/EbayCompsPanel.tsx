/**
 * eBay Price Comps Panel - Embeddable admin component for checking market prices
 * Searches eBay active listings for trading card price intelligence
 * Designed to be used as a tab panel inside AdminDashboard
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search, Loader2, ExternalLink, TrendingUp,
  TrendingDown, DollarSign, BarChart3, AlertTriangle, Wifi, WifiOff
} from "lucide-react";
import { useState } from "react";

const GRADE_OPTIONS = [
  { value: "all", label: "All Grades" },
  { value: "PSA 10", label: "PSA 10 (Gem Mint)" },
  { value: "PSA 9", label: "PSA 9 (Mint)" },
  { value: "PSA 8", label: "PSA 8 (NM-MT)" },
  { value: "PSA 7", label: "PSA 7 (NM)" },
  { value: "BGS 10", label: "BGS 10 (Pristine)" },
  { value: "BGS 9.5", label: "BGS 9.5 (Gem Mint)" },
  { value: "BGS 9", label: "BGS 9 (Mint)" },
  { value: "CGC 10", label: "CGC 10 (Pristine)" },
  { value: "CGC 9.5", label: "CGC 9.5 (Gem Mint)" },
  { value: "CGC 9", label: "CGC 9 (Mint)" },
  { value: "SGC 10", label: "SGC 10 (Pristine)" },
  { value: "SGC 9.5", label: "SGC 9.5 (Gem Mint)" },
  { value: "SGC 9", label: "SGC 9 (Mint)" },
  { value: "raw", label: "Raw (Ungraded)" },
];

const SORT_OPTIONS = [
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "newlyListed", label: "Newly Listed" },
  { value: "endingSoonest", label: "Ending Soonest" },
];

export default function EbayCompsPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [grade, setGrade] = useState("all");
  const [sort, setSort] = useState("price");
  const [limit, setLimit] = useState(50);
  const [hasSearched, setHasSearched] = useState(false);

  // eBay search query
  const {
    data: searchResult,
    isLoading: isSearching,
    error: searchError,
    refetch,
  } = trpc.ebay.searchComps.useQuery(
    {
      query: activeQuery,
      grade: grade !== "all" ? grade : undefined,
      sort,
      limit,
    },
    {
      enabled: hasSearched && activeQuery.length > 0,
      retry: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Connection test
  const { data: connectionStatus } = trpc.ebay.testConnection.useQuery(undefined, {
    retry: false,
    staleTime: 30 * 60 * 1000,
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a card name to search");
      return;
    }
    setActiveQuery(searchQuery.trim());
    setHasSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with connection status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            eBay Price Comps
          </h2>
          <p className="text-muted-foreground text-sm">Search eBay for real-time trading card market prices</p>
        </div>
        <div>
          {connectionStatus?.success ? (
            <Badge
              variant="outline"
              className={
                connectionStatus.environment === "sandbox"
                  ? "border-yellow-500/50 text-yellow-400"
                  : "border-green-500/50 text-green-400"
              }
            >
              <Wifi className="w-3 h-3 mr-1" />
              {connectionStatus.environment === "sandbox" ? "Sandbox" : "Production"}
            </Badge>
          ) : (
            <Badge variant="outline" className="border-red-500/50 text-red-400">
              <WifiOff className="w-3 h-3 mr-1" /> Disconnected
            </Badge>
          )}
        </div>
      </div>

      {/* Sandbox Warning */}
      {connectionStatus?.environment === "sandbox" && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-yellow-400 font-semibold text-sm">Sandbox Mode</p>
            <p className="text-yellow-400/70 text-sm mt-1">
              Using eBay Sandbox API — results are test data only. Register the account
              deletion endpoint and unlock your production keyset to get real market data.
            </p>
          </div>
        </div>
      )}

      {/* Search Controls */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search eBay Listings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search card name (e.g., Spider-Man 2025 Chrome)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-11"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="h-11 px-6"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="w-48">
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Grade Filter" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Results" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 results</SelectItem>
                  <SelectItem value="50">50 results</SelectItem>
                  <SelectItem value="100">100 results</SelectItem>
                  <SelectItem value="200">200 results</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Summary */}
      {searchResult?.priceSummary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="pt-4 pb-4 text-center">
              <TrendingDown className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Low</p>
              <p className="text-2xl font-bold text-green-400">
                ${searchResult.priceSummary.low.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="pt-4 pb-4 text-center">
              <BarChart3 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-2xl font-bold text-blue-400">
                ${searchResult.priceSummary.avg.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-purple-500/20 bg-purple-500/5">
            <CardContent className="pt-4 pb-4 text-center">
              <DollarSign className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Median</p>
              <p className="text-2xl font-bold text-purple-400">
                ${searchResult.priceSummary.median.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="pt-4 pb-4 text-center">
              <TrendingUp className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">High</p>
              <p className="text-2xl font-bold text-red-400">
                ${searchResult.priceSummary.high.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-4 pb-4 text-center">
              <Search className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Listings</p>
              <p className="text-2xl font-bold text-foreground">
                {searchResult.priceSummary.count}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Info */}
      {hasSearched && searchResult && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {searchResult.items.length} of {searchResult.total} active listings
            {grade !== "all" && ` for "${grade}"`}
          </p>
          <Badge variant="outline" className="text-xs">
            Active Listing Prices
          </Badge>
        </div>
      )}

      {/* Error State */}
      {searchError && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-semibold">Search Failed</p>
            <p className="text-red-400/70 text-sm mt-1">
              {searchError.message || "Unable to fetch eBay listings. Please try again."}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-muted-foreground">Searching eBay listings...</p>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {searchResult && searchResult.items.length > 0 && !isSearching && (
        <div className="grid gap-3">
          {searchResult.items.map((item) => (
            <Card
              key={item.itemId}
              className="border-border hover:border-primary/30 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-medium text-sm leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-lg font-bold text-primary shrink-0">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.condition}
                      </Badge>
                      {item.buyingOptions.map((opt) => (
                        <Badge
                          key={opt}
                          variant="outline"
                          className="text-xs"
                        >
                          {opt.replace("_", " ")}
                        </Badge>
                      ))}
                      <span className="text-xs text-muted-foreground">
                        Seller: {item.seller}
                        {item.sellerFeedback !== "N/A" &&
                          ` (${item.sellerFeedback}%)`}
                      </span>
                    </div>
                  </div>

                  {/* eBay Link */}
                  <div className="shrink-0">
                    <a
                      href={item.itemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {hasSearched && searchResult && searchResult.items.length === 0 && !isSearching && (
        <Card className="border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Listings Found</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              No active eBay listings match your search. Try different keywords or
              remove the grade filter.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Initial State */}
      {!hasSearched && (
        <Card className="border-border border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <BarChart3 className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">eBay Market Price Comps</h3>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-4">
              Search for any trading card to see current eBay listing prices.
              Get low, average, median, and high prices from active listings
              to help price your inventory.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {[
                "Spider-Man 2025 Chrome",
                "Wolverine Marvel Chrome",
                "Venom PSA 10",
                "Iron Man Refractor",
                "Deadpool BGS 9.5",
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => {
                    setSearchQuery(example);
                    setActiveQuery(example);
                    setHasSearched(true);
                  }}
                  className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors border border-primary/20"
                >
                  {example}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
