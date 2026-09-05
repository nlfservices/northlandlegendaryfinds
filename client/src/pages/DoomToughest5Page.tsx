/**
 * Doctor Doom toughest /5 — scannable research countdown.
 * Hero + census, how-we-rank, sister /25 callout, editorial note,
 * countdown #10→#1, then ranking table, then HMs. Not an SEO essay.
 */
import { Link } from "wouter";
import { ChevronRight, ExternalLink } from "lucide-react";
import SEO, { breadcrumbJsonLd, faqJsonLd, organizationJsonLd } from "@/components/SEO";
import {
  DOOM_CHARACTER_PATH,
  DOOM_TOUGHEST5_PATH,
  DOOM_TOUGHEST5_SEED,
  DOOM_TOUGHEST_2425_PATH,
  RANK_CHIPS,
  countdownCards,
  hasCardImage,
  hmLabel,
  rankLabel,
  rankingTableCards,
  type DoomToughest5Card,
  type DoomToughest5HonorableMention,
} from "@/data/doomToughest5";

const seed = DOOM_TOUGHEST5_SEED;

export default function DoomToughest5Page() {
  const excludeChip = `Exclude: ${seed.census.exclude.join(" · ")}`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seed.seo.title}
        description={seed.seo.meta}
        path={DOOM_TOUGHEST5_PATH}
        type="article"
        noSuffix
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Card Database", url: "/cards" },
            { name: "Doctor Doom", url: DOOM_CHARACTER_PATH },
            { name: "Toughest /5", url: DOOM_TOUGHEST5_PATH },
          ]),
          organizationJsonLd(),
          faqJsonLd(seed.faq.map((item) => ({ question: item.q, answer: item.a }))),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: seed.seo.h1,
            description: seed.seo.meta,
            author: { "@type": "Organization", name: "NLF Team" },
          },
        ]}
      />

      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.12),transparent_70%)]" />

        <article className="container relative z-10 max-w-6xl py-8 lg:py-12">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/cards" className="transition-colors hover:text-foreground">
              Card Database
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={DOOM_CHARACTER_PATH} className="transition-colors hover:text-foreground">
              Doctor Doom
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">Toughest /5</span>
          </nav>

          <header className="mb-10">
            <div className="mb-4 flex flex-wrap gap-2">
              {seed.seo.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 font-mono text-xs font-semibold text-green-300"
                >
                  {chip}
                </span>
              ))}
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-[0.95] sm:text-4xl lg:text-5xl">
              <span className="text-primary">The 10 Toughest Doctor Doom</span>{" "}
              <span className="text-foreground">/5 Topps Marvel Cards to Pull</span>
            </h1>
            <p className="mb-6 max-w-3xl text-base text-muted-foreground sm:text-lg">
              {seed.seo.subtitle}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 font-mono text-sm font-bold text-green-300">
                {seed.census.issues} /5 issues
              </span>
              <span className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 font-mono text-sm font-bold text-green-300">
                {seed.census.physical} physical
              </span>
              <span className="rounded-xl border border-border/70 bg-card/50 px-4 py-2 text-sm text-muted-foreground">
                {excludeChip}
              </span>
            </div>
          </header>

          <section className="mb-10 scroll-mt-24">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
              How we rank
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {RANK_CHIPS.map((chip, index) => (
                <span
                  key={chip}
                  className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300"
                >
                  {index + 1}. {chip}
                </span>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {seed.intro.beats.map((beat) => (
                <p
                  key={beat}
                  className="rounded-xl border border-green-500/20 bg-card/50 px-4 py-3 text-sm text-muted-foreground"
                >
                  {beat}
                </p>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{seed.intro.researchNote}</p>
          </section>

          <aside className="mb-8 rounded-xl border border-green-500/25 bg-green-500/5 px-4 py-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
              Sister countdown
            </p>
            <p className="mb-3 text-sm text-muted-foreground">{seed.sister.body}</p>
            <Link href={DOOM_TOUGHEST_2425_PATH} className={linkChipClass}>
              {seed.sister.label}
            </Link>
          </aside>

          <aside className="mb-10 rounded-xl border border-amber-400/35 bg-amber-400/5 px-4 py-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Editorial note
            </p>
            <p className="text-sm text-muted-foreground">{seed.editorialNote}</p>
          </aside>

          <section className="mb-12 scroll-mt-24">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
              Countdown
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
              {countdownCards().map((card) => (
                <FindThisCard key={card.id} card={card} badge={rankLabel(card.rank, card.tied)} />
              ))}
            </div>
          </section>

          <section className="mb-12 scroll-mt-24">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
              Full ranking
            </p>
            <div className="overflow-x-auto rounded-xl border border-green-500/20">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-green-500/10 text-[11px] uppercase tracking-wider text-green-300">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Rank</th>
                    <th className="px-3 py-2 font-semibold">Card #</th>
                    <th className="px-3 py-2 font-semibold">Set</th>
                    <th className="px-3 py-2 font-semibold">Name</th>
                    <th className="px-3 py-2 font-semibold">Type</th>
                    <th className="px-3 py-2 font-semibold">Parallel</th>
                    <th className="px-3 py-2 font-semibold">Serial</th>
                    <th className="px-3 py-2 font-semibold">Pop</th>
                    <th className="px-3 py-2 font-semibold">Published odds</th>
                    <th className="px-3 py-2 font-semibold">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingTableCards().map((card) => (
                    <tr key={card.id} className="border-t border-border/50 bg-card/40">
                      <td className="px-3 py-3 font-mono font-bold text-green-300">
                        {rankLabel(card.rank, card.tied)}
                      </td>
                      <td className="px-3 py-3 font-mono">{card.cardNumber}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{card.set}</td>
                      <td className="px-3 py-3 font-semibold text-foreground">{card.name}</td>
                      <td className="px-3 py-3">{card.type}</td>
                      <td className="px-3 py-3">{card.parallel}</td>
                      <td className="px-3 py-3 font-mono">{card.serial}</td>
                      <td className="px-3 py-3 font-mono">{card.pop}</td>
                      <td className="px-3 py-3 font-semibold">{card.publishedOdds}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{card.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12 scroll-mt-24">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
              Honorable mentions
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
              {seed.honorableMentions.map((card) => (
                <FindThisCard key={card.id} card={card} badge={hmLabel(card.hm)} />
              ))}
            </div>
          </section>

          {seed.sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-8 scroll-mt-24">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
                {section.title}
              </p>
              <p className="max-w-3xl text-sm text-muted-foreground">{section.body}</p>
            </section>
          ))}

          <section className="mb-12 scroll-mt-24">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
              FAQ
            </p>
            <div className="flex flex-wrap gap-3">
              {seed.faq.map((item) => (
                <div
                  key={item.q}
                  className="max-w-sm rounded-xl border border-green-500/20 bg-card/50 px-4 py-3"
                >
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-green-300">
                    {item.q}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <p className="mb-8 text-xs leading-relaxed text-muted-foreground">
            Independent NLF write-up — not official Topps or Marvel. Published Hobby and Value
            figures are cited as printed. Population measures scarcity; pull odds measure
            difficulty. Inventory Bot: no NLF listings and no card images.
          </p>

          <nav className="flex flex-wrap gap-2">
            <Link href={DOOM_CHARACTER_PATH} className={linkChipClass}>
              Doctor Doom rarity hub
            </Link>
            <Link href={DOOM_TOUGHEST_2425_PATH} className={linkChipClass}>
              Toughest /24 & /25
            </Link>
          </nav>
        </article>
      </div>
    </div>
  );
}

function FindThisCard({
  card,
  badge,
}: {
  card: DoomToughest5Card | DoomToughest5HonorableMention;
  badge: string;
}) {
  const imageUrl = card.imageUrl;
  const showImage = hasCardImage(imageUrl);

  return (
    <article id={card.id} className="rounded-xl border border-green-500/20 bg-card/50 p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-green-300">
          {badge}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{card.cardNumber}</span>
        <span className="rounded-full border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground">
          {card.type}
        </span>
        {card.multiCharacter && (
          <span className="rounded-full border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground">
            Multi-character
          </span>
        )}
      </div>

      {showImage && (
        <div className="mb-4 overflow-hidden rounded-lg border border-green-500/20 bg-black/60">
          <img
            src={imageUrl}
            alt={`${card.year} ${card.set} ${card.cardNumber} ${card.name} ${card.parallel} ${card.serial}`}
            className="mx-auto max-h-72 w-full object-contain"
          />
        </div>
      )}

      <h2 className="mb-1 text-lg font-bold leading-tight text-foreground">{card.name}</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        {card.set} · {card.parallel} · {card.serial}
      </p>

      <dl className="mb-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">Pop</dt>
          <dd className="font-mono font-semibold">{card.pop}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">Type</dt>
          <dd className="font-semibold">{card.type}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Published odds
          </dt>
          <dd className="font-semibold">{card.publishedOdds}</dd>
        </div>
      </dl>

      {card.notes ? <p className="mb-3 text-xs text-muted-foreground">{card.notes}</p> : null}

      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-green-400">
        Find this card
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={card.market.ebayLive}
          target="_blank"
          rel="noopener noreferrer"
          className={marketChipClass}
        >
          eBay live <ExternalLink className="h-3 w-3" />
        </a>
        <a
          href={card.market.ebaySold}
          target="_blank"
          rel="noopener noreferrer"
          className={marketChipClass}
        >
          eBay sold <ExternalLink className="h-3 w-3" />
        </a>
        <a
          href={card.market.comc}
          target="_blank"
          rel="noopener noreferrer"
          className={marketChipClass}
        >
          COMC <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
}

const marketChipClass =
  "inline-flex items-center gap-1 rounded-full border border-border/70 px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:border-green-500/40 hover:text-green-300";

const linkChipClass =
  "rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300 transition-colors hover:border-green-400/50 hover:text-green-200";
