/**
 * Graded Inventory Page
 * Showcases all CGC and AGS graded/submitted cards with filters and stats
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, ArrowLeft, Award, Shield, Star, TrendingUp,
  Filter, X, ChevronLeft, ChevronRight
} from "lucide-react";

// Grade color coding
function getGradeColor(grade: string | null): string {
  if (!grade) return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  if (grade === "GEM MINT 10" || grade === "PRISTINE 10") return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
  if (grade === "MINT+ 9.5") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  if (grade === "9") return "bg-blue-500/20 text-blue-300 border-blue-500/40";
  if (grade === "8.5") return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
  if (grade === "8") return "bg-purple-500/20 text-purple-300 border-purple-500/40";
  return "bg-zinc-500/20 text-zinc-300 border-zinc-500/40";
}

function getGradeLabel(grade: string | null): string {
  if (!grade) return "Awaiting Grade";
  return grade;
}

export default function GradedInventory() {
  const [company, setCompany] = useState<string>("");
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [setFilter, setSetFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const { data: stats } = trpc.public.graded.stats.useQuery();
  const { data: gradeDistribution } = trpc.public.graded.gradeDistribution.useQuery();
  const { data: gradedSets } = trpc.public.graded.sets.useQuery();

  const { data: cards, isLoading } = trpc.public.graded.list.useQuery({
    gradingCompany: company || undefined,
    grade: gradeFilter || undefined,
    cardSet: setFilter || undefined,
    search: searchQuery || undefined,
    limit: pageSize,
    offset: page * pageSize,
  });

  const hasFilters = company || gradeFilter || setFilter || searchQuery;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-background to-primary/10" />
        <div className="container relative py-12 lg:py-16">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-yellow-500/15 border border-yellow-500/30">
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">Graded Inventory</h1>
              <p className="text-muted-foreground mt-1">
                Our professionally graded card collection — CGC & AGS certified
              </p>
            </div>
          </div>

          {/* Stats Row */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
              <StatCard label="Total Cards" value={stats.total.toLocaleString()} icon={<Shield className="w-4 h-4" />} />
              <StatCard label="CGC Graded" value={stats.cgc.toLocaleString()} icon={<Award className="w-4 h-4" />} accent="blue" />
              <StatCard label="AGS Submitted" value={stats.ags.toLocaleString()} icon={<Award className="w-4 h-4" />} accent="purple" />
              <StatCard label="GEM MINT 10" value={stats.gem10.toLocaleString()} icon={<Star className="w-4 h-4" />} accent="yellow" />
              <StatCard label="PRISTINE 10" value={stats.pristine10.toLocaleString()} icon={<Star className="w-4 h-4" />} accent="emerald" />
              <StatCard label="Characters" value={(stats as any).uniqueCharacters?.toLocaleString() ?? "—"} icon={<TrendingUp className="w-4 h-4" />} accent="pink" />
            </div>
          )}
        </div>
      </div>

      <div className="container pb-16">
        {/* Grade Distribution */}
        {gradeDistribution && gradeDistribution.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Grade Distribution</h2>
            <div className="flex flex-wrap gap-2">
              {gradeDistribution.map(({ grade, count }) => (
                <button
                  key={grade}
                  onClick={() => {
                    setGradeFilter(gradeFilter === grade ? "" : grade);
                    setPage(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                    gradeFilter === grade
                      ? "bg-primary text-primary-foreground border-primary"
                      : getGradeColor(grade === "Awaiting Grade" ? null : grade)
                  } hover:scale-105`}
                >
                  {grade} <span className="opacity-70 ml-1">({count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by character name..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              className="pl-9 bg-card"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Company filter */}
          <div className="flex gap-2">
            <Button
              variant={company === "" ? "default" : "outline"}
              size="sm"
              onClick={() => { setCompany(""); setPage(0); }}
            >
              All
            </Button>
            <Button
              variant={company === "CGC" ? "default" : "outline"}
              size="sm"
              onClick={() => { setCompany(company === "CGC" ? "" : "CGC"); setPage(0); }}
            >
              CGC
            </Button>
            <Button
              variant={company === "AGS" ? "default" : "outline"}
              size="sm"
              onClick={() => { setCompany(company === "AGS" ? "" : "AGS"); setPage(0); }}
            >
              AGS
            </Button>
          </div>

          {/* Set filter */}
          {gradedSets && gradedSets.length > 0 && (
            <select
              value={setFilter}
              onChange={(e) => { setSetFilter(e.target.value); setPage(0); }}
              className="h-9 rounded-md border border-border bg-card px-3 text-sm"
            >
              <option value="">All Sets</option>
              {gradedSets.map(s => (
                <option key={s.name} value={s.name}>{s.name} ({s.count})</option>
              ))}
            </select>
          )}

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setCompany(""); setGradeFilter(""); setSetFilter(""); setSearchQuery(""); setPage(0); }}
              className="text-muted-foreground"
            >
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
        </div>

        {/* Card Table */}
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Company</th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Grade</th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Character</th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground hidden sm:table-cell">#</th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground hidden md:table-cell">Set</th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Parallel</th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Numbered</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td colSpan={7} className="p-3"><div className="h-5 bg-muted animate-pulse rounded" /></td>
                    </tr>
                  ))
                ) : cards && cards.length > 0 ? (
                  cards.map((card, idx) => (
                    <tr key={card.id} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/5'}`}>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={card.gradingCompany === 'CGC' ? 'border-blue-500/50 text-blue-400' : 'border-purple-500/50 text-purple-400'}
                        >
                          {card.gradingCompany}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-bold border ${getGradeColor(card.grade)}`}>
                          {getGradeLabel(card.grade)}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{card.cardName}</td>
                      <td className="p-3 text-sm text-muted-foreground font-mono hidden sm:table-cell">{card.cardNumber || "—"}</td>
                      <td className="p-3 text-sm text-muted-foreground hidden md:table-cell max-w-[200px] truncate">{card.cardSet || "—"}</td>
                      <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">{card.parallel || card.subset || "—"}</td>
                      <td className="p-3 text-sm hidden lg:table-cell">
                        {card.numberedTo ? (
                          <Badge variant="secondary" className="text-xs">/{card.numberedTo}</Badge>
                        ) : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      No graded cards found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} • Showing {cards?.length ?? 0} cards
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={(cards?.length ?? 0) < pageSize}
              onClick={() => setPage(p => p + 1)}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== STAT CARD ====================

function StatCard({ label, value, icon, accent }: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  const accentColors: Record<string, string> = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
    emerald: "text-emerald-400",
    pink: "text-pink-400",
  };

  return (
    <div className="p-4 rounded-lg bg-card border border-border">
      <div className={`flex items-center gap-1.5 text-xs ${accent ? accentColors[accent] : 'text-muted-foreground'} mb-1`}>
        {icon}
        <span className="uppercase tracking-wide font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
