import { mediaUrl } from "../lib/mediaUrl";
import { ArrowRight, Zap, BookOpen, Search, Heart, Lightbulb, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import DoomsdaySection from "@/components/DoomsdaySection";
import MCUCountdown from "@/components/MCUCountdown";
import { trpc } from "@/lib/trpc";
import { IRON_MAN_CARD, FF_CARD, BLACK_PANTHER_CARD } from "./homeShared";

// Card of the Day homepage widget — shows today's featured card with link to full page
function CardOfTheDayWidget() {
  const { data: todayCard, isLoading } = trpc.cardOfTheDay.getTodaysCard.useQuery();

  if (isLoading || !todayCard) return null;

  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <section className="relative py-14 lg:py-16 overflow-hidden">
      {/* Deep gold/amber background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950 via-amber-950/95 to-amber-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-800/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          {/* Left: Card Image */}
          <div className="flex justify-center">
            <Link href={`/card-of-the-day/${dateStr}`}>
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-3 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                <img
                  src={mediaUrl(todayCard.frontImageUrl || '')}
                  alt={`${todayCard.characterName} - Card of the Day`}
                  className="relative w-64 sm:w-72 rounded-xl shadow-2xl shadow-amber-900/40 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Right: Info */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full mb-4">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-xs font-bold tracking-wider uppercase">Card of the Day</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">{todayCard.characterName}</h2>
            <p className="text-amber-200/80 text-sm mb-1">
              {todayCard.setLabel || todayCard.setName} &bull; #{todayCard.cardNumber}
            </p>
            <p className="text-amber-200/80 text-sm mb-4">
              {todayCard.parallelType} &bull; {todayCard.gradingCompany} {todayCard.cgcGrade}
            </p>
            {todayCard.buzzNote && (
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto lg:mx-0 line-clamp-2">
                {todayCard.buzzNote}
              </p>
            )}
            <Link href={`/card-of-the-day/${dateStr}`}>
              <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300">
                View Today's Card
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Latest MCU News section — auto-populated from published articles
function LatestMCUNews() {
  const { data: articles = [], isLoading } = trpc.articles.list.useQuery({ limit: 3 });

  if (isLoading || articles.length === 0) return null;

  function formatDate(timestamp: number | null): string {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const CATEGORY_COLORS: Record<string, string> = {
    movie_news: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    show_news: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    casting: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    card_market: "bg-primary/20 text-primary border-primary/30",
    release_dates: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    rumors: "bg-red-500/20 text-red-400 border-red-500/30",
    analysis: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };

  const CATEGORY_LABELS: Record<string, string> = {
    movie_news: "Movies",
    show_news: "Shows",
    casting: "Casting",
    card_market: "Card Market",
    release_dates: "Releases",
    rumors: "Rumors",
    analysis: "Analysis",
  };

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      {/* Dark red/crimson background */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950 via-red-950/95 to-red-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-800/15 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/15 border border-red-500/30 rounded-full mb-4">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-bold tracking-wide">BREAKING NEWS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            LATEST <span className="text-red-400">MCU NEWS</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Stay up to date with the biggest stories from the Marvel Cinematic Universe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {articles.map((article: any) => (
            <Link key={article.id} href={`/mcu-news/${article.slug}`}>
              <div className="group relative bg-card/80 backdrop-blur-sm border border-red-500/20 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 h-full">
                {/* Image */}
                {article.featuredImageUrl && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={mediaUrl(article.featuredImageUrl)}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${CATEGORY_COLORS[article.category] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                        {CATEGORY_LABELS[article.category] || article.category}
                      </span>
                    </div>
                  </div>
                )}
                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(article.publishedAt)}
                    </span>
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read More <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/mcu-news">
            <Button size="lg" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold">
              View All MCU News
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomeStory() {
  return (
    <>
      {/* ===== 4. NEW TO COLLECTING? — BEGINNER WELCOME ===== */}
      <section id="new-to-collecting" className="relative py-16 lg:py-20 overflow-hidden">
        {/* Deep Green Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-950 via-green-950/95 to-green-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-800/15 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full mb-4">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-bold tracking-wide">WELCOME</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              NEW TO <span className="text-primary">COLLECTING?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              You don't need to be an expert. If you love Marvel, you already belong here. Trading cards are just another way to connect with the characters and stories you care about — and we'll help you get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Step 1: Pick Your Fandom */}
            <div className="bg-card/80 border border-border rounded-xl p-8 text-center hover:border-primary/30 transition-all group">
              <div className="w-16 h-16 bg-primary/15 border-2 border-primary/40 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                PICK YOUR <span className="text-primary">FANDOM</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Are you an Iron Man fan? A Spider-Man loyalist? Love the Fantastic Four? Start by exploring the characters you already know and love — we have profiles, backstories, and every card they appear on.
              </p>
              <Link href="/characters">
                <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold">
                  Explore Characters <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Step 2: Learn the Basics */}
            <div className="bg-card/80 border border-border rounded-xl p-8 text-center hover:border-cyan-500/30 transition-all group">
              <div className="w-16 h-16 bg-cyan-500/15 border-2 border-cyan-500/40 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                LEARN THE <span className="text-cyan-400">BASICS</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                What's a base card? What makes a card rare? How do card sets work? Our blog breaks it all down in plain language — no confusing hobby jargon, just clear answers for curious fans.
              </p>
              <Link href="/the-collector">
                <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-bold">
                  Read The Collector <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Step 3: Browse the Cards */}
            <div className="bg-card/80 border border-border rounded-xl p-8 text-center hover:border-amber-500/30 transition-all group">
              <div className="w-16 h-16 bg-amber-500/15 border-2 border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                BROWSE THE <span className="text-amber-400">CARDS</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                See what's out there. We've cataloged every card from the 2025 Topps Marvel sets — over 1,700 cards you can search by character, set, or rarity. It's like window shopping, but for trading cards.
              </p>
              <Link href="/cards">
                <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 font-bold">
                  Card Database <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4b. COLLECTOR'S JOURNEY — REWRITTEN FOR FANS ===== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        {/* Deep Black Background */}
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-4">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide">WHY PEOPLE COLLECT</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
              IT STARTS WITH <span className="text-primary">A STORY</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Nobody wakes up one day and says "I'm going to collect trading cards." It starts with something else — a movie, a comic, a character that stuck with you. Here's how most people find their way here.
            </p>
          </div>

          {/* Alternating image-text layout with character cards */}
          <div className="space-y-16 max-w-6xl mx-auto">
            {/* Row 1: Image Left, Text Right — Iron Man */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-6 bg-red-500/10 rounded-3xl blur-2xl group-hover:bg-red-500/15 transition-all" />
                  <img
                    src={IRON_MAN_CARD}
                    alt="Iron Man trading card"
                    className="relative w-56 sm:w-64 rounded-xl shadow-2xl shadow-red-500/20 rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                  <span className="text-red-400">"I GREW UP</span> ON THIS"
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Maybe you read Iron Man comics as a kid. Maybe you watched the MCU movies with your family. Maybe your child just discovered Spider-Man and now you're both hooked. That connection to the characters is where it all begins — and trading cards are a way to hold onto it.
                </p>
                <Link href="/characters">
                  <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold">
                    Meet the Characters <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Row 2: Text Left, Image Right — Fantastic Four */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left order-2 lg:order-1">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                  <span className="text-blue-400">"WE DO THIS</span> TOGETHER"
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The best part isn't the cards themselves — it's opening packs with your kids, arguing about who's the strongest Avenger with your friends, or going to a card show and meeting people who love the same stuff you do. Collecting is social, and it's way more fun with other people.
                </p>
                <Link href="/card-shows">
                  <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-bold">
                    Find Card Shows Near You <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center order-1 lg:order-2">
                <div className="relative group">
                  <div className="absolute -inset-6 bg-blue-500/10 rounded-3xl blur-2xl group-hover:bg-blue-500/15 transition-all" />
                  <img
                    src={FF_CARD}
                    alt="Fantastic Four trading card"
                    className="relative w-56 sm:w-64 rounded-xl shadow-2xl shadow-blue-500/20 rotate-[3deg] group-hover:rotate-0 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Image Left, Text Right — Black Panther */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-6 bg-purple-500/10 rounded-3xl blur-2xl group-hover:bg-purple-500/15 transition-all" />
                  <img
                    src={BLACK_PANTHER_CARD}
                    alt="Black Panther trading card"
                    className="relative w-56 sm:w-64 rounded-xl shadow-2xl shadow-purple-500/20 rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                  <span className="text-purple-400">"I WANT TO</span> LEARN MORE"
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Once you start, you'll want to know more — which cards are rare, what different sets exist, which ones feature your favorite characters. We built free tools to help: a searchable card database, market price tracking, and articles that explain everything in plain English. No gatekeeping here.
                </p>
                <Link href="/cards">
                  <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 font-bold">
                    Explore Card Database <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5. MCU COUNTDOWN — DOOMSDAY & SPIDER-MAN ===== */}
      <MCUCountdown />

      {/* ===== 5b. DOOMSDAY — CHARACTER INTEL HUB ===== */}
      <DoomsdaySection />

      {/* ===== 5c. LATEST MCU NEWS — AUTO-POPULATED ===== */}
      <LatestMCUNews />

      {/* ===== 5d. CARD OF THE DAY — DAILY FEATURED CARD ===== */}
      <CardOfTheDayWidget />
    </>
  );
}
