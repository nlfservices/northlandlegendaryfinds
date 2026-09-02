/**
 * One World Under Doom — research stub for the 2026 Topps Chrome Marvel Comics
 * insert family. Lives under the shared Chrome 2026 master-set catalog,
 * not as an isolated Doom database.
 */
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import SEO, { breadcrumbJsonLd, organizationJsonLd } from "@/components/SEO";
import {
  CARD_DATABASE_PATH,
  CHROME_2026_SET_PATH,
  DOOM_HISTORY_PATH,
  MINT_2025_SET_PATH,
  OWUD_FACTS,
  OWUD_PATH,
} from "@/data/doomComicCuts";

const SEO_TITLE = "One World Under Doom — 2026 Chrome insert (research)";
const SEO_DESCRIPTION =
  "Research stub for the 2026 Topps Chrome Marvel Comics One World Under Doom insert family. Reported official hobby odds 1:6. Full card-by-card checklist not yet ingested. Nested under the Chrome 2026 set catalog.";

export default function OneWorldUnderDoom() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        path={OWUD_PATH}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Card Database", url: CARD_DATABASE_PATH },
            { name: "2026 Topps Chrome Marvel Comics", url: CHROME_2026_SET_PATH },
            { name: "One World Under Doom", url: OWUD_PATH },
          ]),
          organizationJsonLd(),
        ]}
      />

      <article className="container max-w-3xl py-10 lg:py-14">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={CARD_DATABASE_PATH} className="transition-colors hover:text-foreground">
            Card Database
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={CHROME_2026_SET_PATH} className="transition-colors hover:text-foreground">
            2026 Topps Chrome Marvel Comics
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">One World Under Doom</span>
        </nav>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
            Coming / research
          </span>
          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
            {OWUD_FACTS.set}
          </span>
        </div>

        <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl">
          <span className="text-primary">One World Under Doom</span>{" "}
          <span className="text-foreground">insert family</span>
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          Catalog placement for the {OWUD_FACTS.insertFamily} insert under the
          official {OWUD_FACTS.set} set — the shared master-set catalog, not an
          isolated Doctor Doom database.
        </p>

        <aside className="mb-8 rounded-xl border border-green-500/25 bg-card/50 p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
            Reported official hobby sheet
          </p>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Set</dt>
              <dd className="font-semibold text-foreground">{OWUD_FACTS.set}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Insert family</dt>
              <dd className="font-semibold text-foreground">{OWUD_FACTS.insertFamily}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Reported hobby odds</dt>
              <dd className="font-semibold text-foreground">{OWUD_FACTS.hobbyOdds}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Card-by-card checklist</dt>
              <dd className="font-semibold text-foreground">Not yet ingested — research stub</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Odds are the official hobby-sheet rate recorded for this insert family
            alongside Fanfare, Icons, Future Stars, Meanwhile, and The Beyond. NLF
            is not inventing a full OWUD checklist or a box print run here.
          </p>
        </aside>

        <div className="prose prose-invert mb-8 max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          <h2>Where this sits in the catalog</h2>
          <p>
            Inserts belong under their official Topps set. One World Under Doom is a{" "}
            {OWUD_FACTS.set} insert family. Doctor Doom Authentic Comic Cuts (DD-CC)
            belong under{" "}
            <Link href={MINT_2025_SET_PATH}>2025 Topps Marvel Mint</Link>. Same
            monarch in the hobby conversation. Two official houses.
          </p>
          <p>
            The Chrome 2026 hobby sheet also lists other insert families at the
            same {OWUD_FACTS.hobbyOdds} hobby rate:{" "}
            {OWUD_FACTS.siblingInsertsAtSameHobbyOdds.join(", ")}.{" "}
            {OWUD_FACTS.otherHobbyInsertsOnSheet[0].name} is listed at{" "}
            {OWUD_FACTS.otherHobbyInsertsOnSheet[0].hobbyOdds}. Those groups belong
            on the{" "}
            <Link href={CHROME_2026_SET_PATH}>2026 Chrome Marvel Comics set page</Link>{" "}
            as the master catalog is filled in — not on a private Doom-only list.
          </p>
          <p>
            Chrome 2026 base already separates <strong>Doctor Doom</strong> from{" "}
            <strong>Doom 2099</strong>. This stub does the same. OWUD is framed
            here as a Victor von Doom–era insert family name from the official
            sheet. Doom 2099 remains its own checklist line on the set page.
          </p>
        </div>

        <ul className="space-y-3 text-sm">
          <li>
            <Link href={CHROME_2026_SET_PATH} className="font-semibold text-green-400 hover:text-green-300">
              Open the 2026 Topps Chrome Marvel Comics set
            </Link>
          </li>
          <li>
            <Link href={DOOM_HISTORY_PATH} className="font-semibold text-emerald-300 hover:text-emerald-200">
              Doctor Doom HISTORY — Mint Comic Cuts companion
            </Link>
          </li>
        </ul>

        <p className="mt-10 border-t border-border/50 pt-6 text-xs leading-relaxed text-muted-foreground">
          Independent NLF write-up — not an official Topps or Marvel statement.
          Research stub only. Information page — no commerce, no invented odds, no
          card-by-card OWUD list until the official checklist is ingested into the
          shared set catalog.
        </p>
      </article>
    </div>
  );
}
