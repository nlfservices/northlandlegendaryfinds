/**
 * Research inventory grid for Doctor Doom Authentic Comic Cuts (DD-CC).
 * Fetches /comic-cuts/doom/catalog.json. Not a sales catalog.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";
import {
  DOOM_GALLERY_CATALOG_PATH,
  DOOM_HOT_LEADS,
  DOOM_VIDEO_PATH,
  MINT_2025_SET_PATH,
  MINT_COMIC_CUT_FACTS,
  hotLeadsForCut,
  isDoomComicCutCatalog,
  isLockedDoomCut,
  lockedBadgeLabel,
  padCutNum,
  visibleDoomCuts,
  type DoomComicCut,
  type DoomComicCutCatalog,
} from "@/data/doomComicCuts";

export default function DoomComicCutGallery() {
  const [catalog, setCatalog] = useState<DoomComicCutCatalog | null>(null);
  const [failed, setFailed] = useState(false);
  const [hiddenThumbs, setHiddenThumbs] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<DoomComicCut | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(DOOM_GALLERY_CATALOG_PATH)
      .then((res) => {
        if (!res.ok) throw new Error(`catalog ${res.status}`);
        return res.json();
      })
      .then((data: unknown) => {
        if (cancelled) return;
        if (!isDoomComicCutCatalog(data)) throw new Error("catalog shape");
        setCatalog(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) return null;

  if (!catalog) {
    return (
      <section id="research-inventory" className="mb-12 scroll-mt-24">
        <p className="text-sm text-muted-foreground">Loading research inventory…</p>
      </section>
    );
  }

  const cuts = visibleDoomCuts(catalog).filter((cut) => !hiddenThumbs.has(cut.num));

  return (
    <section
      id="research-inventory"
      className="mb-12 scroll-mt-24 rounded-xl border border-green-500/25 bg-card/40 p-5 sm:p-6"
    >
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
        Research inventory · {MINT_COMIC_CUT_FACTS.set} · {MINT_COMIC_CUT_FACTS.cardNumber}
      </p>
      <h2 className="mb-2 text-2xl font-bold text-foreground">
        {catalog.title || "Doctor Doom Authentic Comic Cuts"}
      </h2>
      <p className="mb-3 text-sm text-muted-foreground">
        {cuts.length} public thumbs{catalog.count_unique ? ` of ${catalog.count_unique}` : ""}.{" "}
        <strong className="text-foreground">Not a sales catalog.</strong>
      </p>
      {catalog.gaps?.length ? (
        <p className="mb-4 text-xs text-muted-foreground">
          Gaps (no public thumb): {catalog.gaps.map(padCutNum).join(" · ")}
        </p>
      ) : null}
      <div className="mb-5 flex flex-wrap gap-2">
        <Link
          href={MINT_2025_SET_PATH}
          className="rounded-full border border-green-500/30 px-3 py-1 text-xs font-semibold text-emerald-300 hover:text-emerald-200"
        >
          Mint 2025 set
        </Link>
        <Link
          href={DOOM_VIDEO_PATH}
          className="rounded-full border border-green-500/30 px-3 py-1 text-xs font-semibold text-green-400 hover:text-green-300"
        >
          Videos detail
        </Link>
      </div>

      <HotLeadsStrip
        cuts={cuts}
        onSelect={(num) => {
          const cut = cuts.find((item) => item.num === num);
          if (cut) setSelected(cut);
        }}
      />

      {cuts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No public thumbs available yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {cuts.map((cut) => (
            <li key={cut.num}>
              <button
                type="button"
                onClick={() => setSelected(cut)}
                className={`group flex w-full flex-col overflow-hidden rounded-lg border bg-black/40 text-left transition-colors hover:border-green-400/50 ${
                  isLockedDoomCut(cut)
                    ? "border-emerald-400/50"
                    : hotLeadsForCut(cut.num).length
                      ? "border-amber-400/40"
                      : "border-green-500/20"
                }`}
              >
                <div className="relative aspect-[3/4] bg-black/60">
                  <img
                    src={cut.thumb}
                    alt={`Doctor Doom Comic Cut ${padCutNum(cut.num)} research thumb`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    onError={() =>
                      setHiddenThumbs((prev) => {
                        const next = new Set(prev);
                        next.add(cut.num);
                        return next;
                      })
                    }
                  />
                  {lockedBadgeLabel(cut) && (
                    <span className="absolute left-1.5 top-1.5 rounded-full border border-emerald-300/60 bg-emerald-400 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
                      {lockedBadgeLabel(cut)}
                    </span>
                  )}
                </div>
                <div className="space-y-0.5 px-2 py-2">
                  <p className="font-mono text-xs font-bold text-green-300">
                    Cut {padCutNum(cut.num)}
                  </p>
                  <p className="text-[11px] capitalize text-muted-foreground">
                    {isLockedDoomCut(cut) ? "locked" : cut.status || "unidentified"}
                  </p>
                  {hotLeadsForCut(cut.num).map((lead) => (
                    <p key={lead.label} className="text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                      {lead.label}
                    </p>
                  ))}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {catalog.note && (
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{catalog.note}</p>
      )}

      {selected && (
        <ResearchNote
          cut={selected}
          onClose={() => setSelected(null)}
          onImageError={() => {
            setHiddenThumbs((prev) => new Set(prev).add(selected.num));
            setSelected(null);
          }}
        />
      )}
    </section>
  );
}

function HotLeadsStrip({
  cuts,
  onSelect,
}: {
  cuts: DoomComicCut[];
  onSelect: (num: number) => void;
}) {
  const present = new Set(cuts.map((cut) => cut.num));
  const lockedNums = new Set(cuts.filter(isLockedDoomCut).map((cut) => cut.num));
  const leads = DOOM_HOT_LEADS.filter((lead) => present.has(lead.num) && !lockedNums.has(lead.num));
  if (leads.length === 0) return null;

  return (
    <aside className="mb-6 rounded-lg border border-amber-400/30 bg-amber-400/5 p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
        Hot research leads
      </p>
      <p className="mb-3 text-xs text-muted-foreground">
        Working notes. Not locked IDs.
      </p>
      <ul className="space-y-3">
        {leads.map((lead) => (
          <li key={lead.num} className="text-sm leading-relaxed">
            <button
              type="button"
              onClick={() => onSelect(lead.num)}
              className="font-mono font-bold text-amber-200 hover:text-amber-100"
            >
              Cut {padCutNum(lead.num)}
            </button>
            <span className="text-muted-foreground"> — {lead.label}. {lead.note}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function ResearchNote({
  cut,
  onClose,
  onImageError,
}: {
  cut: DoomComicCut;
  onClose: () => void;
  onImageError: () => void;
}) {
  const image = cut.full || cut.thumb;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doom-cut-research-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-green-500/30 bg-background p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-green-400">
              Research note · not for sale
            </p>
            <h3 id="doom-cut-research-title" className="text-lg font-bold">
              Cut {padCutNum(cut.num)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close research note"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {image && (
          <img
            src={image}
            alt={`Doctor Doom Comic Cut ${padCutNum(cut.num)}`}
            className="mb-4 max-h-72 w-full object-contain"
            onError={onImageError}
          />
        )}
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">Status</dt>
            <dd className="capitalize text-foreground">
              {isLockedDoomCut(cut)
                ? `${lockedBadgeLabel(cut) ?? "Locked"}${cut.locked_issue ? ` — ${cut.locked_issue}` : ""}`
                : `${cut.status || "unidentified"} — no locked comic + page ID`}
            </dd>
          </div>
          {hotLeadsForCut(cut.num).map((lead) => (
            <div key={lead.label} className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-3">
              <dt className="text-xs font-bold uppercase tracking-wider text-amber-300">{lead.label}</dt>
              <dd className="mt-1 text-muted-foreground">{lead.note}</dd>
            </div>
          ))}
          {cut.clues && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Visual clues</dt>
              <dd className="text-muted-foreground">{cut.clues}</dd>
            </div>
          )}
          {cut.ruled_out && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Ruled out</dt>
              <dd className="text-muted-foreground">{cut.ruled_out}</dd>
            </div>
          )}
          {cut.next && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Next look</dt>
              <dd className="text-muted-foreground">{cut.next}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
