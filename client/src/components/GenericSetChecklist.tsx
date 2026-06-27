/**
 * Generic Set Checklist & Odds Component
 * Renders checklist and odds data for any set using the standard data format
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Trophy, Target, Star, Layers, Sparkles, BookOpen
} from "lucide-react";
import type { SetChecklistData } from "@/data/setChecklists";

interface Props {
  data: SetChecklistData;
}

function OddsTable({ rows, title }: { 
  rows: { name: string; odds: string; sku: string }[];
  title: string;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card/50">
      <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="text-left p-3 font-semibold">Parallel / Insert</th>
              <th className="text-center p-3 font-semibold w-24">Odds</th>
              <th className="text-center p-3 font-semibold w-28">SKU</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className={`border-b border-border/30 ${idx % 2 === 0 ? '' : 'bg-muted/5'} hover:bg-muted/15 transition-colors`}>
                <td className="p-3 font-medium">{row.name}</td>
                <td className="p-3 text-center font-mono text-xs">{row.odds}</td>
                <td className="p-3 text-center text-xs text-muted-foreground">{row.sku}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InsertTable({ inserts }: { inserts: { name: string; cardCount: string; odds: string }[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card/50">
      <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-purple-900/30 to-transparent">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Inserts & Hits
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="text-left p-3 font-semibold">Insert Set</th>
              <th className="text-center p-3 font-semibold w-24">Cards</th>
              <th className="text-center p-3 font-semibold w-24">Odds</th>
            </tr>
          </thead>
          <tbody>
            {inserts.map((ins, idx) => (
              <tr key={idx} className={`border-b border-border/30 ${idx % 2 === 0 ? '' : 'bg-muted/5'} hover:bg-muted/15 transition-colors`}>
                <td className="p-3 font-medium">{ins.name}</td>
                <td className="p-3 text-center text-xs">
                  <Badge variant="outline" className="text-[10px]">{ins.cardCount}</Badge>
                </td>
                <td className="p-3 text-center font-mono text-xs">{ins.odds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChecklistGrid({ cards, title, icon: Icon }: {
  cards: { num: number; name: string }[];
  title: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card/50">
      <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
          <Badge variant="secondary" className="text-[10px]">{cards.length} cards</Badge>
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
        {cards.map((card) => (
          <div key={card.num} className="flex items-center gap-3 px-4 py-2 border-b border-border/20 hover:bg-muted/10 transition-colors">
            <span className="text-xs font-mono text-muted-foreground w-8 shrink-0">#{card.num}</span>
            <span className="text-sm font-medium">{card.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GenericSetChecklist({ data }: Props) {
  const [activeTab, setActiveTab] = useState("odds");

  // Split base cards into sections if tiers exist
  const cardSections: { name: string; cards: { num: number; name: string }[] }[] = data.tiers 
    ? data.tiers.map((tier, idx) => {
        const startIdx = data.tiers!.slice(0, idx).reduce((sum, t) => sum + t.count, 0);
        return {
          name: tier.name,
          cards: data.baseCards.slice(startIdx, startIdx + tier.count),
        };
      })
    : data.sections 
      ? data.sections
      : [{ name: `Base Cards (${data.baseCardCount} cards)`, cards: data.baseCards }];

  return (
    <div className="space-y-8">
      {/* Set Overview Banner */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-purple-900/10 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/15 border border-primary/30 shrink-0">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold">{data.setName}</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              {data.description}
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border">
                <Layers className="w-3 h-3 text-primary" /> {data.baseCardCount} Base Cards
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border">
                <Target className="w-3 h-3 text-blue-400" /> {data.parallels.length} Parallels
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border">
                <Sparkles className="w-3 h-3 text-purple-400" /> {data.inserts.length} Insert Sets
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border">
                <BookOpen className="w-3 h-3 text-emerald-400" /> {data.releaseInfo}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="odds" className="gap-1.5">
            <Target className="w-3.5 h-3.5" /> Pull Rates & Odds
          </TabsTrigger>
          <TabsTrigger value="checklist" className="gap-1.5">
            <Star className="w-3.5 h-3.5" /> Full Checklist
          </TabsTrigger>
        </TabsList>

        {/* ODDS TAB */}
        <TabsContent value="odds" className="mt-6 space-y-6">
          <OddsTable rows={data.parallels} title="Base Card Parallels" />
          <InsertTable inserts={data.inserts} />
        </TabsContent>

        {/* CHECKLIST TAB */}
        <TabsContent value="checklist" className="mt-6 space-y-6">
          {cardSections.map((section, idx) => (
            <ChecklistGrid 
              key={idx}
              cards={section.cards}
              title={section.name || `Section ${idx + 1}`}
              icon={idx === 0 ? Star : Layers}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
