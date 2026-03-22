/**
 * eBay Price Comps Panel - AI-Powered Market Price Estimator
 * Uses LLM intelligence to estimate trading card market values.
 * Falls back to live eBay API when production keys are configured.
 * Designed to be used as a tab panel inside AdminDashboard.
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
  TrendingDown, DollarSign, BarChart3, AlertTriangle,
  Wifi, WifiOff, Brain, Sparkles, ArrowUpRight,
  ArrowDownRight, Minus, Info, Zap
} from "lucide-react";
import { useState } from "react";

const GRADE_OPTIONS = [
  { value: "all", label: "All Grades" },
  { value: "AGS 10", label: "AGS 10 (Gem Mint)" },
  { value: "AGS 9.5", label: "AGS 9.5 (Mint+)" },
  { value: "AGS 9", label: "AGS 9 (Mint)" },
  { value: "CGC 10", label: "CGC 10 (Pristine)" },
  { value: "CGC 9.5", label: "CGC 9.5 (Gem Mint)" },
  { value: "CGC 9", label: "CGC 9 (Mint)" },
  { value: "PSA 10", label: "PSA 10 (Gem Mint)" },
  { value: "PSA 9", label: "PSA 9 (Mint)" },
  { value: "PSA 8", label: "PSA 8 (NM-MT)" },
  { value: "PSA 7", label: "PSA 7 (NM)" },
  { value: "BGS 10", label: "BGS 10 (Pristine)" },
  { value: "BGS 9.5", label: "BGS 9.5 (Gem Mint)" },
  { value: "BGS 9", label: "BGS 9 (Mint)" },
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

const TREND_CONFIG = {
  rising: { icon: ArrowUpRight, color: "text-green-400", label: "Rising", bg: "bg-green-500/10" },
  stable: { icon: Minus, color: "text-blue-400", label: "Stable", bg: "bg-blue-500/10" },
  declining: { icon: ArrowDownRight, color: "text-red-400", label: "Declining", bg: "bg-red-500/10" },
  volatile: { icon: Zap, color: "text-yellow-400", label: "Volatile", bg: "bg-yellow-500/10" },
};

const CONFIDENCE_CONFIG = {
  high: { color: "border-green-500/50 text-green-400", label: "High Confidence" },
  medium: { color: "border-yellow-500/50 text-yellow-400", label: "Medium Confidence" },
  low: { color: "border-red-500/50 text-red-400", label: "Low Confidence" },
};

export default function EbayCompsPanel({ initialQuery }: { initialQuery?: string } = {}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [activeQuery, setActiveQuery] = useState(initialQuery || "");
  const [grade, setGrade] = useState("all");
  const [sort, setSort] = useState("price");
  const [limit, setLimit] = useState(50);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const [mode, setMode] = useState<"ai" | "ebay">("ai");

  // Connection test - determines if eBay API is available
  const { data: connectionStatus } = trpc.ebay.testConnection.useQuery(undefined, {
    retry: false,
    staleTime: 30 * 60 * 1000,
  });

  const ebayAvailable = connectionStatus?.success && connectionStatus.environment === "production";

  // AI price estimate query
  const {
    data: aiResult,
    isLoading: isAiLoading,
    error: aiError,
    refetch: aiRefetch,
  } = trpc.ebay.aiEstimate.useQuery(
    {
      query: activeQuery,
      grade: grade !== "all" ? grade : undefined,
    },
    {
      enabled: mode === "ai" && hasSearched && activeQuery.length > 0,
      retry: false,
      staleTime: 10 * 60 * 1000,
    }
  );

  // eBay live search query (only when production API is available)
  const {
    data: ebayResult,
    isLoading: isEbayLoading,
    error: ebayError,
    refetch: ebayRefetch,
  } = trpc.ebay.searchComps.useQuery(
    {
      query: activeQuery,
      grade: grade !== "all" ? grade : undefined,
      sort,
      limit,
    },
    {
      enabled: mode === "ebay" && ebayAvailable === true && hasSearched && activeQuery.length > 0,
      retry: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  const isSearching = mode === "ai" ? isAiLoading : isEbayLoading;
  const searchError = mode === "ai" ? aiError : ebayError;

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

  const handleQuickSearch = (example: string) => {
    setSearchQuery(example);
    setActiveQuery(example);
    setHasSearched(true);
  };

  const estimate = aiResult?.estimate;
  const trendConfig = estimate ? TREND_CONFIG[estimate.marketTrend] : null;
  const confidenceConfig = estimate ? CONFIDENCE_CONFIG[estimate.confidence] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Price Comps
          </h2>
          <p className="text-muted-foreground text-sm">
            {mode === "ai"
              ? "AI-powered market price estimates for trading cards"
              : "Live eBay listing prices for trading cards"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setMode("ai")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                mode === "ai"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              AI Estimate
            </button>
            <button
              onClick={() => {
                if (!ebayAvailable) {
                  toast.info("eBay production API not configured. Using AI estimates.");
                  return;
                }
                setMode("ebay");
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                mode === "ebay"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              } ${!ebayAvailable ? "opacity-50" : ""}`}
            >
              <Wifi className="w-3.5 h-3.5" />
              Live eBay
            </button>
          </div>
          {/* Status Badge */}
          {mode === "ai" ? (
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              <Brain className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          ) : connectionStatus?.success ? (
            <Badge variant="outline" className={
              connectionStatus.environment === "sandbox"
                ? "border-yellow-500/50 text-yellow-400"
                : "border-green-500/50 text-green-400"
            }>
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

      {/* AI Mode Info Banner */}
      {mode === "ai" && !hasSearched && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-purple-300 font-semibold text-sm">AI Market Intelligence</p>
            <p className="text-purple-300/70 text-sm mt-1">
              Get instant price estimates powered by AI trained on trading card market data.
              Includes price ranges, market trends, comparable sales, and pricing factors.
              {!ebayAvailable && " Live eBay data will be available once production API keys are configured."}
            </p>
          </div>
        </div>
      )}

      {/* eBay Sandbox Warning */}
      {mode === "ebay" && connectionStatus?.environment === "sandbox" && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-yellow-400 font-semibold text-sm">Sandbox Mode</p>
            <p className="text-yellow-400/70 text-sm mt-1">
              Using eBay Sandbox API — results are test data only. Switch to AI Estimate mode
              for market intelligence, or configure production keys for live data.
            </p>
          </div>
        </div>
      )}

      {/* Search Controls */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5" />
            {mode === "ai" ? "Estimate Card Value" : "Search eBay Listings"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter card name (e.g., Spider-Man 2025 Chrome Refractor)"
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
              ) : mode === "ai" ? (
                <Brain className="w-4 h-4 mr-2" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {mode === "ai" ? "Estimate" : "Search"}
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
            {mode === "ebay" && (
              <>
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
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ===== AI ESTIMATE RESULTS ===== */}
      {mode === "ai" && estimate && !isAiLoading && (
        <>
          {/* Price Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="pt-4 pb-4 text-center">
                <TrendingDown className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Low Estimate</p>
                <p className="text-2xl font-bold text-green-400">
                  ${estimate.estimatedLow.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="pt-4 pb-4 text-center">
                <BarChart3 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Average</p>
                <p className="text-2xl font-bold text-blue-400">
                  ${estimate.estimatedAverage.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardContent className="pt-4 pb-4 text-center">
                <DollarSign className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Median</p>
                <p className="text-2xl font-bold text-purple-400">
                  ${estimate.estimatedMedian.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="pt-4 pb-4 text-center">
                <TrendingUp className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">High Estimate</p>
                <p className="text-2xl font-bold text-red-400">
                  ${estimate.estimatedHigh.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Market Context Row */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className={confidenceConfig?.color}>
              {confidenceConfig?.label}
            </Badge>
            {trendConfig && (
              <Badge variant="outline" className={`${trendConfig.color} border-current/50`}>
                <trendConfig.icon className="w-3 h-3 mr-1" />
                Market {trendConfig.label}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {estimate.grade}
            </Badge>
            <span className="text-xs text-muted-foreground ml-auto">
              AI Estimate &middot; {new Date(aiResult.generatedAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Market Analysis */}
          {estimate.notes && (
            <Card className="border-border">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold mb-1">Market Analysis</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {estimate.notes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Factors */}
          {estimate.factors.length > 0 && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  Pricing Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {estimate.factors.map((factor, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparable Sales Estimates */}
          {estimate.comparables.length > 0 && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Comparable Estimates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {estimate.comparables.map((comp, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">
                          {comp.description}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1.5">
                          {comp.condition}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-primary shrink-0 ml-4">
                        ${comp.estimatedPrice.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search on eBay Link */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground max-w-lg">
              {estimate.disclaimer}
            </p>
            <a
              href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(activeQuery + (grade !== "all" ? ` ${grade}` : ""))}&_sacat=183050&LH_Sold=1&LH_Complete=1`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="shrink-0">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                View on eBay
              </Button>
            </a>
          </div>
        </>
      )}

      {/* ===== EBAY LIVE RESULTS ===== */}
      {mode === "ebay" && ebayResult && (
        <>
          {/* Price Summary */}
          {ebayResult.priceSummary && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="border-green-500/20 bg-green-500/5">
                <CardContent className="pt-4 pb-4 text-center">
                  <TrendingDown className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Low</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${ebayResult.priceSummary.low.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="pt-4 pb-4 text-center">
                  <BarChart3 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Average</p>
                  <p className="text-2xl font-bold text-blue-400">
                    ${ebayResult.priceSummary.average.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-purple-500/20 bg-purple-500/5">
                <CardContent className="pt-4 pb-4 text-center">
                  <DollarSign className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Median</p>
                  <p className="text-2xl font-bold text-purple-400">
                    ${ebayResult.priceSummary.median.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-red-500/20 bg-red-500/5">
                <CardContent className="pt-4 pb-4 text-center">
                  <TrendingUp className="w-5 h-5 text-red-400 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">High</p>
                  <p className="text-2xl font-bold text-red-400">
                    ${ebayResult.priceSummary.high.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="pt-4 pb-4 text-center">
                  <Search className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Listings</p>
                  <p className="text-2xl font-bold text-foreground">
                    {ebayResult.priceSummary.count}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Info */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {ebayResult.items.length} of {ebayResult.total} active listings
              {grade !== "all" && ` for "${grade}"`}
            </p>
            <Badge variant="outline" className="text-xs">
              Active Listing Prices
            </Badge>
          </div>

          {/* Results Grid */}
          {ebayResult.items.length > 0 && (
            <div className="grid gap-3">
              {ebayResult.items.map((item) => (
                <Card
                  key={item.itemId}
                  className="border-border hover:border-primary/30 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No Image
                          </div>
                        )}
                      </div>
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
                            <Badge key={opt} variant="outline" className="text-xs">
                              {opt.replace("_", " ")}
                            </Badge>
                          ))}
                          <span className="text-xs text-muted-foreground">
                            Seller: {item.seller}
                            {item.sellerFeedback !== "N/A" && ` (${item.sellerFeedback}%)`}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <a href={item.itemUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
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

          {/* Empty eBay Results */}
          {ebayResult.items.length === 0 && (
            <Card className="border-border">
              <CardContent className="pt-12 pb-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Listings Found</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  No active eBay listings match your search. Try the AI Estimate mode for
                  market intelligence.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Error State */}
      {searchError && !isSearching && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-semibold">
              {mode === "ai" ? "Estimation Failed" : "Search Failed"}
            </p>
            <p className="text-red-400/70 text-sm mt-1">
              {searchError.message || "Something went wrong. Please try again."}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => mode === "ai" ? aiRefetch() : ebayRefetch()}
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
            {mode === "ai" ? (
              <>
                <div className="relative mx-auto mb-4 w-12 h-12">
                  <Brain className="w-12 h-12 text-purple-400 animate-pulse" />
                  <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
                </div>
                <p className="text-muted-foreground">Analyzing market data...</p>
                <p className="text-xs text-muted-foreground/60 mt-1">AI is estimating prices based on market intelligence</p>
              </>
            ) : (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">Searching eBay listings...</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && (
        <Card className="border-border border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="relative mx-auto mb-4 w-16 h-16">
              <Brain className="w-16 h-16 text-primary/30" />
              <Sparkles className="w-5 h-5 text-purple-400 absolute -top-1 -right-1" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Market Price Comps</h3>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-4">
              Search for any trading card to get AI-powered price estimates.
              Get low, average, median, and high estimates with market trends,
              pricing factors, and comparable card values.
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
                  onClick={() => handleQuickSearch(example)}
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
