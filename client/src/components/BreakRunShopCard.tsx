/**
 * Infinity Packs-style shop card for a Whatnot-only break run.
 * Odds, packs left, checklist, pack art — Whatnot spots only.
 */

import { Link } from "wouter";
import { ExternalLink, Package } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  CHECKLIST_COMING_SOON,
  type BreakOddsTier,
  type BreakRun,
  type BreakRunStatus,
  ctaForRun,
  packsLeftLabel,
  packsLeftPercent,
  statusChipLabel,
} from "@/data/breakRuns";

const TIER_DOT: Record<BreakOddsTier["id"], string> = {
  common: "bg-zinc-400",
  chase: "bg-cyan-400",
  grail: "bg-amber-400",
  super_grail: "bg-fuchsia-400",
};

const STATUS_CHIP: Record<BreakRunStatus, string> = {
  upcoming: "border-cyan-400/40 bg-cyan-400/15 text-cyan-300",
  live: "border-emerald-400/50 bg-emerald-400/20 text-emerald-300",
  sold_out: "border-zinc-500/40 bg-zinc-500/15 text-zinc-400",
};

export function ExampleChip() {
  return (
    <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-400/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
      EXAMPLE
    </span>
  );
}

export function BreakStatusChip({ status }: { status: BreakRunStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${STATUS_CHIP[status]}`}
    >
      {status === "live" && (
        <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
      )}
      {statusChipLabel(status)}
    </span>
  );
}

function PackArtSlot({ run }: { run: BreakRun }) {
  if (run.pack_art_url) {
    return (
      <img
        src={run.pack_art_url}
        alt={run.pack_art_alt}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.18),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.16),transparent_50%),linear-gradient(160deg,#09090b,#111827)]"
      aria-label={run.pack_art_alt}
    >
      <Package className="h-10 w-10 text-white/25" />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
        Art hidden
      </span>
    </div>
  );
}

function OddsTable({ odds }: { odds: BreakOddsTier[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/80">
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 bg-muted/40 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <span>Tier</span>
        <span className="text-right">Qty</span>
        <span className="text-right">%</span>
        <span className="text-right">Value</span>
      </div>
      {odds.map((tier) => (
        <div
          key={tier.id}
          className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 border-t border-border/60 px-3 py-2 text-sm"
        >
          <span className="flex items-center gap-2 font-medium">
            <span className={`h-2 w-2 rounded-full ${TIER_DOT[tier.id]}`} />
            {tier.label}
          </span>
          <span className="text-right tabular-nums text-muted-foreground">{tier.qty}</span>
          <span className="text-right tabular-nums font-semibold">{tier.percent}%</span>
          <span className="text-right tabular-nums text-muted-foreground">{tier.value_band}</span>
        </div>
      ))}
    </div>
  );
}

function BreakCta({ run }: { run: BreakRun }) {
  const cta = ctaForRun(run);
  if (!cta.href) return null;

  const shared =
    "w-full font-bold transition-all hover:scale-[1.01] sm:w-auto";

  if (cta.kind === "sold_out") {
    return (
      <Button
        asChild
        variant="outline"
        size="lg"
        className={`${shared} border-zinc-600/50 text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-300`}
      >
        <a href={cta.href} target="_blank" rel="noopener noreferrer">
          {cta.label}
        </a>
      </Button>
    );
  }

  if (cta.kind === "live") {
    return (
      <Button asChild size="lg" className={`${shared} bg-emerald-500 text-black hover:bg-emerald-400`}>
        <a href={cta.href} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          {cta.label}
        </a>
      </Button>
    );
  }

  return (
    <Button asChild size="lg" className={`${shared} bg-primary text-primary-foreground hover:bg-primary/90`}>
      <a href={cta.href} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="mr-2 h-4 w-4" />
        {cta.label}
      </a>
    </Button>
  );
}

type CardProps = {
  run: BreakRun;
  variant: "compact" | "full";
};

export default function BreakRunShopCard({ run, variant }: CardProps) {
  const remainingPct = packsLeftPercent(run);

  const body = (
    <>
      <div className="flex gap-4">
        <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 sm:h-44 sm:w-28">
          <PackArtSlot run={run} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {run.example && <ExampleChip />}
            <BreakStatusChip status={run.break_status} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {run.tier_label}
            </span>
          </div>
          <h2
            className={`font-bold leading-none ${variant === "full" ? "text-3xl sm:text-4xl" : "text-2xl"}`}
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            {run.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{run.blurb}</p>
          <div className="mt-3">
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Packs left{run.example ? " — EXAMPLE" : ""}
              </span>
              <span className="text-sm font-bold tabular-nums">{packsLeftLabel(run)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${run.break_status === "sold_out" ? "bg-zinc-500" : "bg-primary"}`}
                style={{ width: `${remainingPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {variant === "full" && (
        <>
          <div className="mt-6">
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Odds{run.example ? " — EXAMPLE" : ""}
            </h3>
            <OddsTable odds={run.odds} />
          </div>

          <Accordion type="single" collapsible className="mt-4 rounded-xl border border-border px-3">
            <AccordionItem value="checklist" className="border-0">
              <AccordionTrigger className="text-sm font-bold uppercase tracking-wider hover:no-underline">
                {CHECKLIST_COMING_SOON}
              </AccordionTrigger>
              <AccordionContent>
                {run.checklist.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Coming soon.</p>
                ) : (
                  <ul className="space-y-2">
                    {run.checklist.map((item) => (
                      <li
                        key={item.name}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span>{item.name}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {item.tier.replace(/_/g, " ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-6">
            <BreakCta run={run} />
          </div>
        </>
      )}
    </>
  );

  const shellClass =
    "block rounded-2xl border border-border bg-card/90 p-5 shadow-[0_0_40px_rgba(16,185,129,0.06)] transition-colors sm:p-6";

  if (variant === "compact") {
    return (
      <Link href={`/breaks/${run.run_slug}`} className={`${shellClass} hover:border-primary/40`}>
        {body}
      </Link>
    );
  }

  return <div className={shellClass}>{body}</div>;
}
