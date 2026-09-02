/**
 * Per-video SEO landing page. Layout is chosen by a stable round-robin
 * (see videoTemplates.ts). Shared chrome stays consistent; structure varies.
 */

import { useState } from "react";
import { Link, useRoute } from "wouter";
import { ChevronRight, Youtube } from "lucide-react";
import SEO, { breadcrumbJsonLd, organizationJsonLd } from "@/components/SEO";
import {
  getVideoById,
  hasVideoDetailPage,
  videoDetailPath,
  youtubeEmbedUrl,
  type VideoEntry,
} from "@/data/videos";
import { loreCompanionForVideo } from "@/data/doomComicCuts";
import { templateIdForVideoId, type VideoTemplateId } from "@/data/videoTemplates";

function metaDescriptionFor(video: VideoEntry): string {
  return `${video.character} ${video.parallel} from ${video.setFilter}. Watch the NLF video and see the real card showcase.`;
}

function YoutubePlayer({ video, bleed = false }: { video: VideoEntry; bleed?: boolean }) {
  return (
    <div className={bleed ? "w-full bg-black" : "w-full overflow-hidden rounded-xl border border-green-500/20 bg-black shadow-lg shadow-green-950/30"}>
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`${youtubeEmbedUrl(video.youtubeId)}?rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function SpecsChips({ video }: { video: VideoEntry }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded border border-green-500/40 bg-green-500/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-green-400">
        {video.character}
      </span>
      <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
        {video.parallel}
      </span>
      <span className="rounded border border-border/60 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
        {video.setFilter}
      </span>
      {video.printRun && (
        <span className="rounded border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
          {video.printRun}
        </span>
      )}
      {video.cardNumber && (
        <span className="rounded border border-border/60 px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
          {video.cardNumber}
        </span>
      )}
    </div>
  );
}

function CardShowcase({
  video,
  showImage,
  onImageError,
  variant = "large",
}: {
  video: VideoEntry;
  showImage: boolean;
  onImageError: () => void;
  variant?: "large" | "slim" | "strip" | "sidebar" | "framed" | "hero" | "filmstrip";
}) {
  const frame =
    variant === "framed" || variant === "hero"
      ? "border-2 border-amber-400/40 bg-gradient-to-b from-card to-black/40 p-3 sm:p-4 shadow-xl shadow-amber-950/20"
      : variant === "filmstrip"
        ? "border border-green-500/30 bg-black/50 p-2"
        : "border border-green-500/20 bg-card/60 p-4 sm:p-5";

  const imgClass =
    variant === "slim" || variant === "filmstrip"
      ? "max-h-56 w-full object-contain"
      : variant === "strip" || variant === "sidebar"
        ? "w-full object-contain"
        : "mx-auto max-h-[520px] w-full object-contain";

  return (
    <aside className={`rounded-xl ${frame}`}>
      {showImage && video.cardImageUrl && (
        <div className="mb-4 overflow-hidden rounded-lg bg-black/40">
          <img
            src={video.cardImageUrl}
            alt={`${video.character} ${video.parallel} card from ${video.setFilter}`}
            className={imgClass}
            onError={onImageError}
          />
        </div>
      )}
      <SpecsChips video={video} />
      {video.populationLabel && (
        <p className="mt-3 text-sm font-semibold text-foreground">{video.populationLabel}</p>
      )}
      {(video.hobbyOdds || video.sdccOdds) && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Reported checklist odds
          {video.hobbyOdds ? ` · hobby ${video.hobbyOdds}` : ""}
          {video.sdccOdds ? ` · SDCC ${video.sdccOdds}` : ""}
          . Not a sealed Topps print-run claim.
        </p>
      )}
    </aside>
  );
}

function SeoBody({ video, dense = false }: { video: VideoEntry; dense?: boolean }) {
  return (
    <div className={dense ? "max-w-3xl" : "max-w-3xl"}>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-green-400">About this card</h2>
      <p className={`text-muted-foreground ${dense ? "text-[15px] leading-7" : "text-base leading-relaxed"}`}>
        {video.seoDescription}
      </p>
    </div>
  );
}

function VideoBreadcrumb({ video }: { video: VideoEntry }) {
  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
      <ChevronRight className="h-3 w-3" />
      <Link href="/videos" className="transition-colors hover:text-foreground">Videos</Link>
      <ChevronRight className="h-3 w-3" />
      <span className="font-medium text-foreground">{video.character} {video.parallel}</span>
    </nav>
  );
}

function VideoBackLinks({ video }: { video: VideoEntry }) {
  const lore = loreCompanionForVideo(video.id);
  return (
    <div className="flex flex-wrap items-center gap-4 pt-2">
      <Link href="/videos" className="inline-flex items-center gap-1 text-sm font-semibold text-green-400 transition-colors hover:text-green-300">
        Back to Videos
        <ChevronRight className="h-4 w-4" />
      </Link>
      {video.setSlug && (
        <Link
          href={`/cards/${video.setSlug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
        >
          View {video.setFilter}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
      {lore && (
        <Link
          href={lore.href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-green-400 transition-colors hover:text-green-300"
        >
          {lore.label}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function PageHeader({ video, minimal = false }: { video: VideoEntry; minimal?: boolean }) {
  return (
    <header className={minimal ? "mb-6" : "mb-8"}>
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-4 py-1.5">
        <Youtube className="h-4 w-4 text-primary" />
        <span className="text-sm font-bold tracking-wide text-primary">NLF VIDEO</span>
      </div>
      <h1 className={minimal ? "text-3xl font-bold leading-tight sm:text-4xl" : "text-4xl font-bold leading-[0.95] sm:text-5xl"}>
        <span className="text-primary">{video.character}</span>{" "}
        <span className="text-foreground">{video.parallel}</span>
      </h1>
      {!minimal && (
        <p className="mt-3 text-lg text-muted-foreground">{video.setFilter}</p>
      )}
    </header>
  );
}

function VideoChrome({ video, children }: { video: VideoEntry; children: React.ReactNode }) {
  const path = videoDetailPath(video.id);
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${video.character} ${video.parallel} — ${video.setFilter} Video`}
        description={metaDescriptionFor(video)}
        path={path}
        image={video.cardImageUrl}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Videos", url: "/videos" },
            { name: `${video.character} ${video.parallel}`, url: path },
          ]),
          organizationJsonLd(),
        ]}
      />
      {children}
    </div>
  );
}

function LayoutVideoTopCardUnder({ video, showImage, onImageError }: LayoutProps) {
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <PageHeader video={video} />
      <div className="space-y-8">
        <YoutubePlayer video={video} />
        <CardShowcase video={video} showImage={showImage} onImageError={onImageError} />
        <SeoBody video={video} />
        <VideoBackLinks video={video} />
      </div>
    </div>
  );
}

function LayoutCardHeroFirst({ video, showImage, onImageError }: LayoutProps) {
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <PageHeader video={video} />
      <div className="space-y-8">
        <CardShowcase video={video} showImage={showImage} onImageError={onImageError} variant="hero" />
        <YoutubePlayer video={video} />
        <SeoBody video={video} />
        <VideoBackLinks video={video} />
      </div>
    </div>
  );
}

function LayoutTwoColumnSplit({ video, showImage, onImageError }: LayoutProps) {
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <PageHeader video={video} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <YoutubePlayer video={video} />
        <CardShowcase video={video} showImage={showImage} onImageError={onImageError} />
      </div>
      <div className="mt-10 space-y-6">
        <SeoBody video={video} />
        <VideoBackLinks video={video} />
      </div>
    </div>
  );
}

function LayoutCardLeftStrip({ video, showImage, onImageError }: LayoutProps) {
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <PageHeader video={video} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
        <CardShowcase video={video} showImage={showImage} onImageError={onImageError} variant="strip" />
        <YoutubePlayer video={video} />
      </div>
      <div className="mt-10 space-y-6">
        <SeoBody video={video} />
        <VideoBackLinks video={video} />
      </div>
    </div>
  );
}

function LayoutVideoFullBleed({ video, showImage, onImageError }: LayoutProps) {
  return (
    <>
      <YoutubePlayer video={video} bleed />
      <div className="container py-8 lg:py-12">
        <VideoBreadcrumb video={video} />
        <PageHeader video={video} />
        <CardShowcase video={video} showImage={showImage} onImageError={onImageError} variant="slim" />
        <div className="mt-10 space-y-6">
          <SeoBody video={video} />
          <VideoBackLinks video={video} />
        </div>
      </div>
    </>
  );
}

function LayoutBodyIntroFirst({ video, showImage, onImageError }: LayoutProps) {
  const lead = video.seoDescription?.split(/(?<=\.)\s+/)[0] ?? video.description;
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <PageHeader video={video} />
      <p className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">{lead}</p>
      <YoutubePlayer video={video} />
      <div className="mt-8">
        <CardShowcase video={video} showImage={showImage} onImageError={onImageError} />
      </div>
      <div className="mt-10 space-y-6">
        <SeoBody video={video} />
        <VideoBackLinks video={video} />
      </div>
    </div>
  );
}

function LayoutGalleryTheater({ video, showImage, onImageError }: LayoutProps) {
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <PageHeader video={video} />
      <div className="mx-auto mb-8 max-w-xl">
        <CardShowcase video={video} showImage={showImage} onImageError={onImageError} variant="framed" />
      </div>
      <div className="rounded-2xl border border-green-500/20 bg-black/70 p-2 sm:p-4">
        <YoutubePlayer video={video} bleed />
      </div>
      <div className="mt-6">
        <SpecsChips video={video} />
      </div>
      <div className="mt-10 space-y-6">
        <SeoBody video={video} />
        <VideoBackLinks video={video} />
      </div>
    </div>
  );
}

function LayoutStickyCardSidebar({ video, showImage, onImageError }: LayoutProps) {
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <PageHeader video={video} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <CardShowcase video={video} showImage={showImage} onImageError={onImageError} variant="sidebar" />
        </div>
        <div className="space-y-8">
          <YoutubePlayer video={video} />
          <SeoBody video={video} />
          <VideoBackLinks video={video} />
        </div>
      </div>
    </div>
  );
}

function LayoutVideoQuoteCard({ video, showImage, onImageError }: LayoutProps) {
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <PageHeader video={video} />
      <YoutubePlayer video={video} />
      <blockquote className="my-8 border-l-4 border-green-500 bg-green-500/10 px-5 py-4">
        <p className="text-xl font-bold text-foreground">
          {video.printRun || "1/1"} — {video.populationLabel || video.parallel}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {video.character} · {video.setFilter}
          {video.cardNumber ? ` · ${video.cardNumber}` : ""}
        </p>
      </blockquote>
      <CardShowcase video={video} showImage={showImage} onImageError={onImageError} />
      <div className="mt-10 space-y-6">
        <SeoBody video={video} />
        <VideoBackLinks video={video} />
      </div>
    </div>
  );
}

function LayoutMinimalBadge({ video, showImage, onImageError }: LayoutProps) {
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <PageHeader video={video} minimal />
      <div className="relative mb-8">
        {video.printRun && (
          <div className="absolute -top-3 right-3 z-10 rounded-full border border-amber-400/50 bg-amber-400 px-3 py-1 text-xs font-black tracking-wide text-black">
            {video.printRun}
          </div>
        )}
        <CardShowcase video={video} showImage={showImage} onImageError={onImageError} />
      </div>
      <YoutubePlayer video={video} />
      <div className="mt-10 space-y-6">
        <SeoBody video={video} dense />
        <VideoBackLinks video={video} />
      </div>
    </div>
  );
}

function LayoutStackedDossier({ video, showImage, onImageError }: LayoutProps) {
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <div className="mb-8 rounded-xl border border-green-500/25 bg-card/40 px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">Collector dossier</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{video.title}</h1>
        <div className="mt-3">
          <SpecsChips video={video} />
        </div>
      </div>
      <YoutubePlayer video={video} />
      <div className="mt-8">
        <CardShowcase video={video} showImage={showImage} onImageError={onImageError} />
      </div>
      <div className="mt-10 space-y-6">
        <SeoBody video={video} />
        <VideoBackLinks video={video} />
      </div>
    </div>
  );
}

function LayoutCinemaMarquee({ video, showImage, onImageError }: LayoutProps) {
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <h1 className="mb-8 text-center text-4xl font-black uppercase tracking-tight sm:text-6xl">
        <span className="text-primary">{video.character}</span>
        <span className="mt-2 block text-2xl font-bold normal-case tracking-normal text-muted-foreground sm:text-3xl">
          {video.parallel} · {video.setLabel}
        </span>
      </h1>
      <YoutubePlayer video={video} />
      <div className="mt-8">
        <CardShowcase video={video} showImage={showImage} onImageError={onImageError} variant="filmstrip" />
      </div>
      <div className="mt-10 space-y-6">
        <SeoBody video={video} />
        <VideoBackLinks video={video} />
      </div>
    </div>
  );
}

function LayoutArchiveCase({ video, showImage, onImageError }: LayoutProps) {
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <PageHeader video={video} />
      <div className="rounded-2xl border border-amber-400/30 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_70%)] p-4 sm:p-8">
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Relic case</p>
        <CardShowcase video={video} showImage={showImage} onImageError={onImageError} variant="framed" />
      </div>
      <div className="mt-6">
        <SpecsChips video={video} />
      </div>
      <div className="mt-8">
        <YoutubePlayer video={video} />
      </div>
      <div className="mt-10 space-y-6">
        <SeoBody video={video} />
        <VideoBackLinks video={video} />
      </div>
    </div>
  );
}

function LayoutCollectorSpread({ video, showImage, onImageError }: LayoutProps) {
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <PageHeader video={video} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
        <div className="space-y-4">
          <CardShowcase video={video} showImage={showImage} onImageError={onImageError} />
        </div>
        <YoutubePlayer video={video} />
      </div>
      <div className="mt-10 space-y-6">
        <SeoBody video={video} />
        <VideoBackLinks video={video} />
      </div>
    </div>
  );
}

function LayoutInvertedStack({ video, showImage, onImageError }: LayoutProps) {
  const lead = video.seoDescription?.split(/(?<=\.)\s+/).slice(0, 2).join(" ") ?? video.description;
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <div className="mb-8 text-center">
        <p className="text-6xl font-black text-amber-300">{video.printRun || "1/1"}</p>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">{video.populationLabel}</p>
      </div>
      <h1 className="mb-4 text-center text-3xl font-bold sm:text-4xl">{video.title}</h1>
      <p className="mx-auto mb-8 max-w-3xl text-center text-muted-foreground">{lead}</p>
      <CardShowcase video={video} showImage={showImage} onImageError={onImageError} />
      <div className="mt-8">
        <YoutubePlayer video={video} />
      </div>
      <div className="mt-10 space-y-6">
        <SeoBody video={video} />
        <VideoBackLinks video={video} />
      </div>
    </div>
  );
}

function LayoutFramedRelic({ video, showImage, onImageError }: LayoutProps) {
  return (
    <div className="container py-10 lg:py-14">
      <VideoBreadcrumb video={video} />
      <PageHeader video={video} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,260px)_1fr]">
        <CardShowcase video={video} showImage={showImage} onImageError={onImageError} variant="sidebar" />
        <div className="space-y-8">
          <YoutubePlayer video={video} />
          <SeoBody video={video} dense />
          <VideoBackLinks video={video} />
        </div>
      </div>
    </div>
  );
}

type LayoutProps = {
  video: VideoEntry;
  showImage: boolean;
  onImageError: () => void;
};

const LAYOUTS: Record<VideoTemplateId, (props: LayoutProps) => JSX.Element> = {
  videoTopCardUnder: LayoutVideoTopCardUnder,
  cardHeroFirst: LayoutCardHeroFirst,
  twoColumnSplit: LayoutTwoColumnSplit,
  cardLeftStrip: LayoutCardLeftStrip,
  videoFullBleed: LayoutVideoFullBleed,
  bodyIntroFirst: LayoutBodyIntroFirst,
  galleryTheater: LayoutGalleryTheater,
  stickyCardSidebar: LayoutStickyCardSidebar,
  videoQuoteCard: LayoutVideoQuoteCard,
  minimalBadge: LayoutMinimalBadge,
  stackedDossier: LayoutStackedDossier,
  cinemaMarquee: LayoutCinemaMarquee,
  archiveCase: LayoutArchiveCase,
  collectorSpread: LayoutCollectorSpread,
  invertedStack: LayoutInvertedStack,
  framedRelic: LayoutFramedRelic,
};

export default function VideoDetail() {
  const [, params] = useRoute("/videos/:slug");
  const slug = params?.slug ?? "";
  const video = getVideoById(slug);
  const [cardBroken, setCardBroken] = useState(false);

  if (!video || !hasVideoDetailPage(video)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Youtube className="h-16 w-16 text-green-500/30" />
        <h1 className="text-2xl font-bold">Video not found</h1>
        <Link href="/videos" className="font-semibold text-green-400 hover:text-green-300">
          Back to Videos
        </Link>
      </div>
    );
  }

  const template = templateIdForVideoId(video.id);
  const Layout = LAYOUTS[template];
  const showImage = Boolean(video.cardImageUrl) && !cardBroken;

  return (
    <VideoChrome video={video}>
      <Layout video={video} showImage={showImage} onImageError={() => setCardBroken(true)} />
    </VideoChrome>
  );
}
