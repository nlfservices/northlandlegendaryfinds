/**
 * Doctor Doom Card Research v1 — scannable rarity hub.
 * Renders /data/doom/rarity-index.json. Not an SEO essay. Not the Comic Cut HISTORY lane.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ShieldAlert } from "lucide-react";
import {
  DOOM_RARITY_INDEX_PATH,
  chipHref,
  formatPhysical,
  identityPageHref,
  isDoomRarityIndex,
  isMethodExamplePull,
  setPageLabel,
  type ConfidenceLevel,
  type DoomRarityIndex,
} from "@/data/doomRarity";

const CONFIDENCE_TONE: Record<ConfidenceLevel, string> = {
  Official: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300",
  Calculated: "border-sky-500/35 bg-sky-500/10 text-sky-300",
  Estimated: "border-amber-400/35 bg-amber-400/10 text-amber-300",
};

export default function DoomRarityHub() {
  const [index, setIndex] = useState<DoomRarityIndex | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(DOOM_RARITY_INDEX_PATH)
      .then((res) => {
        if (!res.ok) throw new Error(`rarity-index ${res.status}`);
        return res.json();
      })
      .then((data: unknown) => {
        if (cancelled) return;
        if (!isDoomRarityIndex(data)) throw new Error("rarity-index shape");
        setIndex(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) return null;

  if (!index) {
    return (
      <section id="rarity-hub" className="mb-10 scroll-mt-24">
        <p className="text-sm text-muted-foreground">Loading rarity snapshot…</p>
      </section>
    );
  }

  const { links } = index;

  return (
    <section
      id="rarity-hub"
      className="mb-10 scroll-mt-24 rounded-2xl border border-green-500/25 bg-card/40 p-5 sm:p-6"
    >
      <aside className="mb-5 rounded-xl border border-amber-400/35 bg-amber-400/5 px-4 py-3">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-amber-200">{index.provisional_banner}</strong>
            {" "}
            {index.benchmark.research_progress_note}
          </p>
        </div>
      </aside>

      <header className="mb-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
          Card Research v1 · {index.source.status.replace("_", " ")}
        </p>
        <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
          Doctor Doom rarity hub
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {index.identity_rules.include.join(" / ")} only. Census stays here
          {" — "}
          Comic Cut history stays on its own lane.
        </p>
        <div className="flex flex-wrap gap-2">
          {index.ui_chips.map((chip) => {
            const href = chipHref(chip, links);
            const chipClass = `rounded-full border px-3 py-1 font-mono text-xs font-semibold ${CONFIDENCE_TONE[chip.confidence]}`;
            const body = (
              <>
                <span className="text-[10px] uppercase tracking-wider opacity-80">{chip.label}</span>
                {" · "}
                {chip.value}
              </>
            );
            return href ? (
              <Link key={chip.label} href={href} className={`${chipClass} hover:border-green-400/50`}>
                {body}
              </Link>
            ) : (
              <span key={chip.label} className={chipClass}>
                {body}
              </span>
            );
          })}
        </div>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {index.identity_rules.include.map((name) => (
          <span
            key={name}
            className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300"
          >
            {name}
          </span>
        ))}
        {index.identity_rules.exclude.map((name) => {
          const href = identityPageHref(name);
          const chipClass =
            "rounded-full border border-border/70 px-3 py-1 text-xs font-semibold text-muted-foreground";
          return href ? (
            <Link key={name} href={href} className={`${chipClass} hover:border-amber-400/50 hover:text-amber-200`}>
              Not {name}
            </Link>
          ) : (
            <span key={name} className={chipClass}>
              Not {name}
            </span>
          );
        })}
      </div>
      <p className="mb-6 text-xs text-muted-foreground">{index.identity_rules.notes}</p>

      <dl className="mb-6 grid gap-2 sm:grid-cols-3">
        {(Object.entries(index.confidence_defs) as [ConfidenceLevel, string][]).map(
          ([level, meaning]) => (
            <div key={level} className="rounded-xl border border-border/60 bg-background/40 p-3">
              <dt>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${CONFIDENCE_TONE[level]}`}>
                  {level}
                </span>
              </dt>
              <dd className="mt-2 text-xs text-muted-foreground">{meaning}</dd>
            </div>
          )
        )}
      </dl>

      <nav className="mb-6 flex flex-wrap gap-2">
        <a href="#rarity-tiers" className={jumpChipClass}>Tiers</a>
        <a href="#rarity-sapphire" className={jumpChipClass}>Sapphire #28</a>
        <a href="#rarity-pulls" className={jumpChipClass}>Hardest pulls</a>
        <a href="#rarity-families" className={jumpChipClass}>Families</a>
        <Link href={links.comic_cuts_history} className={jumpChipClass}>
          Comic Cut history
        </Link>
      </nav>

      <section id="rarity-tiers" className="mb-6 scroll-mt-24">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400">Tiers</p>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-background/60 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-semibold">Tier</th>
                <th className="px-3 py-2 font-semibold">Distinct</th>
                <th className="px-3 py-2 font-semibold">Physical</th>
                <th className="px-3 py-2 font-semibold">Confidence</th>
                <th className="px-3 py-2 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {index.tiers.map((tier) => (
                <tr key={tier.id} className="border-t border-border/50">
                  <td className="px-3 py-2 font-medium text-foreground">{tier.label}</td>
                  <td className="px-3 py-2 font-mono text-foreground">{tier.distinct}</td>
                  <td className="px-3 py-2 font-mono text-foreground">
                    {formatPhysical(tier.physical)}
                  </td>
                  <td className="px-3 py-2">
                    <ConfidencePill level={tier.confidence} />
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{tier.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="rarity-sapphire" className="mb-6 scroll-mt-24">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
          2026 Chrome Sapphire · base #28
        </p>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-background/60 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-semibold">Parallel</th>
                <th className="px-3 py-2 font-semibold">Serial</th>
                <th className="px-3 py-2 font-semibold">Pack odds</th>
                <th className="px-3 py-2 font-semibold">Scope</th>
              </tr>
            </thead>
            <tbody>
              {index.sapphire_2026_odds.map((row) => (
                <tr key={`${row.parallel}-${row.serial}`} className="border-t border-border/50">
                  <td className="px-3 py-2 font-medium text-foreground">{row.parallel}</td>
                  <td className="px-3 py-2 font-mono text-foreground">{row.serial}</td>
                  <td className="px-3 py-2 font-mono text-foreground">{row.pack_odds}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {row.odds_scope ?? "parallel"}
                    {" · "}
                    <ConfidencePill level={row.confidence} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {index.specific_card_estimates.map((row) => (
            <div key={row.card} className="rounded-xl border border-border/60 bg-background/40 p-3">
              <p className="text-sm font-semibold text-foreground">{row.card}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{row.formula}</p>
              <p className="mt-1 text-sm text-foreground">
                {row.estimate} <ConfidencePill level={row.confidence} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="rarity-pulls" className="mb-6 scroll-mt-24">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
          Hardest pulls
        </p>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-background/60 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-semibold">Set / card</th>
                <th className="px-3 py-2 font-semibold">Parallel</th>
                <th className="px-3 py-2 font-semibold">Odds</th>
                <th className="px-3 py-2 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {index.key_pulls.map((pull) => {
                const method = isMethodExamplePull(pull);
                return (
                  <tr
                    key={`${pull.set}-${pull.card}-${pull.parallel}`}
                    className={`border-t border-border/50 ${method ? "bg-amber-400/5" : ""}`}
                  >
                    <td className="px-3 py-2">
                      {method && (
                        <span className="mb-1 mr-2 inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                          Method example
                        </span>
                      )}
                      <p className="font-medium text-foreground">{pull.card}</p>
                      <p className="text-xs text-muted-foreground">{pull.set}</p>
                    </td>
                    <td className="px-3 py-2 font-mono text-foreground">{pull.parallel}</td>
                    <td className="px-3 py-2 font-mono text-xs text-foreground">{pull.print_or_odds}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{pull.notes ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section id="rarity-families" className="mb-6 scroll-mt-24">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400">Families</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {index.families.map((family) => (
            <div key={family.id} className="rounded-xl border border-green-500/20 bg-background/40 p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">{family.label}</h3>
                <ConfidencePill level={family.confidence} />
              </div>
              <p className="text-xs text-muted-foreground">{family.rule}</p>
              {family.approx_unique != null && (
                <p className="mt-2 font-mono text-xs text-foreground">~{family.approx_unique} unique</p>
              )}
              {family.exact_count_aug26 != null && (
                <p className="mt-2 font-mono text-xs text-foreground">
                  {family.exact_count_aug26} exact · Aug 26
                </p>
              )}
              {family.notes && <p className="mt-2 text-xs text-muted-foreground">{family.notes}</p>}
              {family.catalog && (
                <a
                  href={family.catalog}
                  className="mt-3 inline-block text-xs font-semibold text-green-300 hover:text-green-200"
                >
                  Catalog JSON
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
          Open blockers
        </p>
        <p className="mb-2 text-xs text-muted-foreground">{index.open_tiers.notes}</p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {index.open_tiers.blockers.map((blocker) => (
            <li key={blocker} className="flex gap-2">
              <span className="text-amber-300">·</span>
              <span>{blocker}</span>
            </li>
          ))}
        </ul>
      </section>

      <nav className="flex flex-wrap gap-2">
        {links.set_pages.map((href) => (
          <Link key={href} href={href} className={linkChipClass}>
            {setPageLabel(href)}
          </Link>
        ))}
        <Link href={links.comic_cuts_history} className={linkChipClass}>
          Comic Cut history
        </Link>
        <a href={links.comic_cuts_catalog} className={linkChipClass}>
          Comic Cut catalog
        </a>
      </nav>
    </section>
  );
}

function ConfidencePill({ level }: { level: ConfidenceLevel }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${CONFIDENCE_TONE[level]}`}>
      {level}
    </span>
  );
}

const jumpChipClass =
  "rounded-full border border-border/70 px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:border-green-500/40 hover:text-green-300";

const linkChipClass =
  "rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300 transition-colors hover:border-green-400/50 hover:text-green-200";
