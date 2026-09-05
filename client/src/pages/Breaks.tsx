/**
 * Break-run index — scannable Whatnot-only shop cards.
 * Header is left alone; this page is linked from Shop + footer.
 */

import { Link } from "wouter";
import SEO, { breadcrumbJsonLd, organizationJsonLd } from "@/components/SEO";
import BreakRunShopCard, { BreakStatusChip, ExampleChip } from "@/components/BreakRunShopCard";
import {
  BREAK_STATUS_CHIPS,
  EXAMPLE_ODDS_LINE,
  INDEX_HEADER_CHIP,
  listBreakRuns,
} from "@/data/breakRuns";

export default function Breaks() {
  const runs = listBreakRuns();

  return (
    <div className="min-h-screen">
      <SEO
        title="Break Runs — Whatnot Only"
        description="NLF break runs: odds, packs left, checklist. Spots on Whatnot only — not a store."
        path="/breaks"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Breaks", url: "/breaks" },
          ]),
          organizationJsonLd(),
        ]}
      />

      <section className="border-b border-border py-12 sm:py-16">
        <div className="container max-w-4xl">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            {INDEX_HEADER_CHIP}
          </p>
          <h1
            className="text-5xl leading-none sm:text-6xl"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            BREAK <span className="text-primary">RUNS</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {EXAMPLE_ODDS_LINE}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <ExampleChip />
            {BREAK_STATUS_CHIPS.map((chip) => (
              <BreakStatusChip key={chip.id} status={chip.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container max-w-4xl space-y-4">
          {runs.map((run) => (
            <BreakRunShopCard key={run.run_slug} run={run} variant="compact" />
          ))}
        </div>
      </section>

      <section className="border-t border-border py-10">
        <div className="container max-w-4xl text-sm text-muted-foreground">
          <Link href="/shop" className="hover:text-primary">
            Shop
          </Link>
          <span className="mx-2">·</span>
          <Link href="/whatnot" className="hover:text-primary">
            Whatnot
          </Link>
        </div>
      </section>
    </div>
  );
}
