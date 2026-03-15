/**
 * Character Page - SEO-optimized individual character pages
 * Features: Quick Answer box, author byline, TOC, 1000+ word LLM-generated history,
 * key facts sidebar, card gallery across sets, FAQ section, LLMO-optimized structure
 * Content is generated on-demand and cached in the database
 */

import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, BookOpen, Sparkles, Shield, Zap, Users,
  Calendar, Pen, Layers, ChevronRight, Loader2, RefreshCw,
  ExternalLink, List, Clock, User, HelpCircle
} from "lucide-react";
import SEO, { breadcrumbJsonLd, articleJsonLd, faqJsonLd } from "@/components/SEO";
import { Streamdown } from "streamdown";

const PLACEHOLDER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk_9ebdacfa.png";

/** Extract H2 headings from markdown for Table of Contents */
function extractTocFromMarkdown(md: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  const lines = md.split("\n");
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)/);
    if (match) {
      const text = match[1].replace(/[*_`]/g, "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      headings.push({ id, text });
    }
  }
  return headings;
}

export default function CharacterPage() {
  const [, params] = useRoute("/characters/:slug");
  const slug = params?.slug || "";

  const { data, isLoading, error } = trpc.public.marvel.getCharacter.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const generateContent = trpc.public.marvel.generateCharacterContent.useMutation();
  const utils = trpc.useUtils();

  const [isGenerating, setIsGenerating] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Auto-generate content if not available (only trigger once)
  useEffect(() => {
    if (data && !data.content && !isGenerating && !hasTriggered && !generateContent.isPending) {
      setIsGenerating(true);
      setHasTriggered(true);
      generateContent.mutate(
        { slug },
        {
          onSuccess: () => {
            utils.public.marvel.getCharacter.invalidate({ slug });
            setIsGenerating(false);
          },
          onError: () => {
            setIsGenerating(false);
          },
        }
      );
    }
  }, [data?.content, slug, hasTriggered]);

  // Reset trigger when slug changes
  useEffect(() => {
    setHasTriggered(false);
    setIsGenerating(false);
  }, [slug]);

  // Group cards by set
  const cardsBySet = useMemo(() => {
    if (!data?.cards) return [];
    const groups: Record<string, { setName: string; setSlug: string; cards: typeof data.cards }> = {};
    for (const card of data.cards) {
      const key = card.setName || "Unknown Set";
      if (!groups[key]) {
        groups[key] = { setName: key, setSlug: card.setSlug || "", cards: [] };
      }
      groups[key].cards.push(card);
    }
    return Object.values(groups);
  }, [data?.cards]);

  // Parse key facts
  const keyFacts = useMemo(() => {
    if (!data?.content?.keyFacts) return null;
    try {
      return typeof data.content.keyFacts === "string"
        ? JSON.parse(data.content.keyFacts)
        : data.content.keyFacts;
    } catch {
      return null;
    }
  }, [data?.content?.keyFacts]);

  // Pick the best representative image
  const characterImage = useMemo(() => {
    if (!data?.cards?.length) return PLACEHOLDER_IMG;
    const charWords = data.characterName.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const matchingCard = data.cards.find(c => {
      if (!c.imageUrl) return false;
      const filename = c.imageUrl.split('/').pop()?.toLowerCase() || '';
      return charWords.some(w => filename.includes(w));
    });
    if (matchingCard?.imageUrl) return matchingCard.imageUrl;
    const firstWithImage = data.cards.find(c => c.imageUrl);
    return firstWithImage?.imageUrl || PLACEHOLDER_IMG;
  }, [data?.cards, data?.characterName]);

  // Extract TOC from markdown
  const toc = useMemo(() => {
    if (!data?.content?.historyMarkdown) return [];
    return extractTocFromMarkdown(data.content.historyMarkdown);
  }, [data?.content?.historyMarkdown]);

  // Build SEO keywords (must be before early returns)
  const seoKeywords = useMemo(() => {
    if (!data) return [];
    const kw = [
      data.characterName,
      `${data.characterName} trading cards`,
      `${data.characterName} Marvel cards`,
      `${data.characterName} 2025 Topps`,
      "Marvel trading cards",
      "card checklist",
      "Northland Legendary Finds",
    ];
    if (keyFacts?.teams) kw.push(...keyFacts.teams);
    if (keyFacts?.notablePowers) kw.push(...keyFacts.notablePowers.slice(0, 3));
    return kw;
  }, [data?.characterName, keyFacts]);

  // Build FAQ schema targeting "People Also Ask" questions (must be before early returns)
  const characterFaqs = useMemo(() => {
    if (!data) return [];
    const faqs: { question: string; answer: string }[] = [];
    faqs.push({
      question: `How many ${data.characterName} trading cards are in the 2025 Topps Marvel sets?`,
      answer: `${data.characterName} appears on ${data.cardCount} trading cards across ${cardsBySet.length} different 2025 Topps Marvel sets at Northland Legendary Finds${cardsBySet.length > 0 ? `, including ${cardsBySet.map(s => s.setName).join(", ")}` : ""}. Each card features unique artwork and multiple parallel versions for collectors.`,
    });
    if (keyFacts?.firstAppearance) {
      faqs.push({
        question: `When did ${data.characterName} first appear in Marvel Comics?`,
        answer: `${data.characterName} first appeared in ${keyFacts.firstAppearance}${keyFacts.creators ? `, created by ${keyFacts.creators}` : ""}. This debut is a key milestone for collectors tracking ${data.characterName}'s trading card history.`,
      });
    }
    if (keyFacts?.notablePowers?.length) {
      faqs.push({
        question: `What are ${data.characterName}'s powers and abilities?`,
        answer: `${data.characterName}'s notable powers and abilities include ${keyFacts.notablePowers.join(", ")}. These iconic abilities are frequently featured across ${data.characterName}'s trading card artwork in 2025 Topps sets.`,
      });
    }
    if (keyFacts?.teams?.length) {
      faqs.push({
        question: `What Marvel teams is ${data.characterName} a member of?`,
        answer: `${data.characterName} is a member of ${keyFacts.teams.join(", ")}. Many of these team affiliations are represented in special insert and subset cards available at Northland Legendary Finds.`,
      });
    }
    faqs.push({
      question: `What are the best ${data.characterName} cards to collect in 2025?`,
      answer: `The most sought-after ${data.characterName} cards in 2025 include numbered parallels from Topps Chrome (/199, /99, /25, /5, and 1/1 Superfractors), Marvel Mint refractors, and special insert cards. Check the full ${data.characterName} card checklist at Northland Legendary Finds for the complete breakdown.`,
    });
    faqs.push({
      question: `Are ${data.characterName} trading cards a good investment?`,
      answer: `${data.characterName} trading cards, especially low-numbered parallels and graded copies (PSA 10, CGC 10), have shown strong collector demand. The 2025 Topps sets offer multiple parallel tiers, making them accessible for both casual collectors and serious investors. Visit Northland Legendary Finds for current availability and pricing.`,
    });
    return faqs;
  }, [data, keyFacts, cardsBySet]);

  // Estimate word count (must be before early returns)
  const wordCount = useMemo(() => {
    if (!data?.content?.historyMarkdown) return undefined;
    return data.content.historyMarkdown.split(/\s+/).length;
  }, [data?.content?.historyMarkdown]);

  // Build all JSON-LD schemas (must be before early returns)
  const metaDesc = useMemo(() => {
    if (!data) return "";
    return data.content?.metaDescription ||
      `Explore ${data.characterName}'s complete trading card history at Northland Legendary Finds. ${data.cardCount} cards across ${cardsBySet.length} sets with parallel breakdowns, collecting tips, and character history.`;
  }, [data, cardsBySet.length]);

  const jsonLdSchemas = useMemo(() => {
    if (!data) return [];
    const slug_ = params?.slug || "";
    const schemas: Record<string, unknown>[] = [
      breadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Characters", url: "/characters" },
        { name: data.characterName, url: `/characters/${slug_}` },
      ]),
    ];
    if (data.content?.historyMarkdown) {
      schemas.push(
        articleJsonLd({
          title: `${data.characterName} - Complete Marvel Trading Card History & Collector's Guide | Northland Legendary Finds`,
          description: metaDesc,
          url: `/characters/${slug_}`,
          image: characterImage,
          datePublished: "2025-03-15",
          dateModified: new Date().toISOString().split("T")[0],
          keywords: seoKeywords,
          wordCount,
          about: {
            name: data.characterName,
            description: metaDesc,
          },
        })
      );
    }
    if (characterFaqs.length > 0) {
      schemas.push(faqJsonLd(characterFaqs));
    }
    return schemas;
  }, [data, params?.slug, metaDesc, characterImage, seoKeywords, characterFaqs, wordCount]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-12 w-96 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Character Not Found</h1>
          <p className="text-muted-foreground">The character you're looking for doesn't exist in our database.</p>
          <Link href="/characters">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse All Characters
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${data.characterName} - Marvel Trading Cards & Character History | Northland Legendary Finds`}
        description={metaDesc}
        path={`/characters/${slug}`}
        image={characterImage}
        type="article"
        jsonLd={jsonLdSchemas}
      >
        <meta name="keywords" content={seoKeywords.join(", ")} />
        <meta name="article:section" content="Marvel Trading Cards" />
        <meta name="article:tag" content={data.characterName} />
        <meta property="og:article:section" content="Marvel Trading Cards" />
      </SEO>

      {/* Hero Section */}
      <section className="relative border-b border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="container max-w-6xl relative py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/characters" className="hover:text-foreground transition-colors">Characters</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{data.characterName}</span>
          </nav>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Character Image */}
            <div className="w-32 h-44 md:w-40 md:h-56 flex-shrink-0 rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/10">
              <img
                src={characterImage}
                alt={`${data.characterName} 2025 Topps Marvel trading card - Northland Legendary Finds`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Character Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                {data.characterName}
              </h1>
              {keyFacts?.realName && keyFacts.realName !== data.characterName && (
                <p className="text-lg text-muted-foreground mb-4">
                  Real Name: <span className="text-foreground">{keyFacts.realName}</span>
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="border-primary/40 text-primary">
                  <Layers className="w-3 h-3 mr-1" />
                  {data.cardCount} Cards
                </Badge>
                <Badge variant="outline" className="border-blue-500/40 text-blue-400">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {cardsBySet.length} Sets
                </Badge>
                {keyFacts?.firstAppearance && (
                  <Badge variant="outline" className="border-amber-500/40 text-amber-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {keyFacts.firstAppearance}
                  </Badge>
                )}
              </div>
              {keyFacts?.notablePowers && keyFacts.notablePowers.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {keyFacts.notablePowers.slice(0, 6).map((power: string, i: number) => (
                    <Badge key={i} className="bg-primary/10 text-primary border-primary/20 text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      {power}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Author Byline & Last Updated */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/30 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>By <strong className="text-foreground">Northland Legendary Finds</strong> &middot; Collecting Since 1993</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-6xl py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Article Content - Left 2/3 */}
          <div className="lg:col-span-2">

            {/* Quick Answer Box - AEO/GEO/AIO Optimization */}
            {data.content?.historyMarkdown && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-primary mb-1">Quick Answer</h2>
                    <p className="text-sm text-foreground leading-relaxed">
                      {data.characterName} has <strong>{data.cardCount} trading cards</strong> across{" "}
                      <strong>{cardsBySet.length} sets</strong> in the 2025 Topps Marvel lineup
                      {cardsBySet.length > 0 && (
                        <>, including {cardsBySet.slice(0, 3).map(s => s.setName).join(", ")}{cardsBySet.length > 3 ? `, and ${cardsBySet.length - 3} more` : ""}</>
                      )}.
                      {keyFacts?.firstAppearance && (
                        <> First appearing in {keyFacts.firstAppearance}, {data.characterName} remains one of Marvel's most collected characters.</>
                      )}
                      {" "}Browse the complete checklist and parallel breakdown below at Northland Legendary Finds.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Table of Contents */}
            {toc.length > 3 && (
              <nav className="bg-card border border-border rounded-xl p-5 mb-8">
                <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <List className="w-4 h-4 text-primary" />
                  In This Article
                </h2>
                <ol className="space-y-1.5 text-sm">
                  {toc.map((item, i) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <span className="text-primary/50 text-xs font-mono w-5">{i + 1}.</span>
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Content Loading / Generation State */}
            {(!data.content || isGenerating || generateContent.isPending) && (
              <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Generating Character History
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Our AI is writing a comprehensive history of {data.characterName}. 
                  This takes about 10-15 seconds...
                </p>
              </div>
            )}

            {/* Error State */}
            {generateContent.isError && !data.content && (
              <div className="bg-card border border-destructive/30 rounded-xl p-8 text-center space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Content Generation Failed
                </h3>
                <p className="text-muted-foreground">
                  We couldn't generate the character history. Please try again.
                </p>
                <Button
                  onClick={() => {
                    setIsGenerating(true);
                    generateContent.mutate(
                      { slug },
                      {
                        onSuccess: () => {
                          utils.public.marvel.getCharacter.invalidate({ slug });
                          setIsGenerating(false);
                        },
                        onError: () => setIsGenerating(false),
                      }
                    );
                  }}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            )}

            {/* Generated Article */}
            {data.content?.historyMarkdown && (
              <article className="prose prose-invert prose-lg max-w-none
                prose-headings:text-foreground prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border/30 prose-h2:pb-2
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-strong:text-foreground
                prose-li:text-muted-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              ">
                <Streamdown>{data.content.historyMarkdown}</Streamdown>
              </article>
            )}

            {/* FAQ Section - Targeting "People Also Ask" */}
            {data.content?.historyMarkdown && characterFaqs.length > 0 && (
              <section className="mt-12 pt-8 border-t border-border/30">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-primary" />
                  Frequently Asked Questions About {data.characterName}
                </h2>
                <div className="space-y-4">
                  {characterFaqs.map((faq, i) => (
                    <details
                      key={i}
                      className="bg-card border border-border rounded-xl group"
                      open={i === 0}
                    >
                      <summary className="p-4 cursor-pointer text-foreground font-medium hover:text-primary transition-colors list-none flex items-center justify-between">
                        <span>{faq.question}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                      </summary>
                      <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Internal Links Section */}
            {data.content?.historyMarkdown && (
              <section className="mt-8 pt-6 border-t border-border/30">
                <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Continue Exploring at Northland Legendary Finds</h3>
                <div className="flex flex-wrap gap-2">
                  <Link href="/characters">
                    <Badge variant="outline" className="hover:border-primary/40 hover:text-primary transition-colors cursor-pointer">
                      Browse All 880+ Characters
                    </Badge>
                  </Link>
                  <Link href="/cards">
                    <Badge variant="outline" className="hover:border-primary/40 hover:text-primary transition-colors cursor-pointer">
                      Full Card Database
                    </Badge>
                  </Link>
                  <Link href="/checklists">
                    <Badge variant="outline" className="hover:border-primary/40 hover:text-primary transition-colors cursor-pointer">
                      Set Checklists
                    </Badge>
                  </Link>
                  <Link href="/graded">
                    <Badge variant="outline" className="hover:border-primary/40 hover:text-primary transition-colors cursor-pointer">
                      Graded Card Inventory
                    </Badge>
                  </Link>
                  <Link href="/shop">
                    <Badge variant="outline" className="hover:border-primary/40 hover:text-primary transition-colors cursor-pointer">
                      Shop Repack Packs
                    </Badge>
                  </Link>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Right 1/3 */}
          <aside className="space-y-6">
            {/* Key Facts Card */}
            {keyFacts && (
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Key Facts
                </h3>
                <dl className="space-y-3 text-sm">
                  {keyFacts.realName && (
                    <div>
                      <dt className="text-muted-foreground font-medium">Real Name</dt>
                      <dd className="text-foreground">{keyFacts.realName}</dd>
                    </div>
                  )}
                  {keyFacts.firstAppearance && (
                    <div>
                      <dt className="text-muted-foreground font-medium">First Appearance</dt>
                      <dd className="text-foreground">{keyFacts.firstAppearance}</dd>
                    </div>
                  )}
                  {keyFacts.creators && (
                    <div>
                      <dt className="text-muted-foreground font-medium">Creators</dt>
                      <dd className="text-foreground">{keyFacts.creators}</dd>
                    </div>
                  )}
                  {keyFacts.teams && keyFacts.teams.length > 0 && (
                    <div>
                      <dt className="text-muted-foreground font-medium flex items-center gap-1">
                        <Users className="w-3 h-3" /> Teams
                      </dt>
                      <dd className="flex flex-wrap gap-1 mt-1">
                        {keyFacts.teams.map((team: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {team}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Card Gallery by Set */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Trading Cards ({data.cardCount})
              </h3>
              {cardsBySet.map((group) => (
                <div key={group.setName} className="space-y-2">
                  <Link
                    href={`/cards/${group.setSlug}`}
                    className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    {group.setName}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <div className="grid grid-cols-3 gap-2">
                    {group.cards.slice(0, 6).map((card: any) => (
                      <Link
                        key={card.id}
                        href={`/cards/${group.setSlug}/${card.cardNumber}`}
                      >
                        <div
                          className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors group cursor-pointer"
                          title={`${card.characterName} #${card.cardNumber} - ${card.cardType || "Base"}`}
                        >
                          <img
                            src={card.imageUrl || PLACEHOLDER_IMG}
                            alt={`${card.characterName} #${card.cardNumber} ${group.setName} trading card - Northland Legendary Finds`}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                            <p className="text-[10px] text-white/80 truncate">
                              #{card.cardNumber}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {group.cards.length > 6 && (
                    <p className="text-xs text-muted-foreground">
                      +{group.cards.length - 6} more cards in this set
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Browse More Characters */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">Explore More</h3>
              <div className="space-y-2">
                <Link href="/characters">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Browse All Characters
                  </Button>
                </Link>
                <Link href="/cards">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Layers className="w-4 h-4 mr-2" />
                    Card Database
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Shop Packs
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Characters Section */}
        <RelatedCharactersSection slug={slug} characterName={data.characterName} />
      </div>
    </div>
  );
}

/** Related Characters grid component */
function RelatedCharactersSection({ slug, characterName }: { slug: string; characterName: string }) {
  const { data: related, isLoading } = trpc.public.marvel.relatedCharacters.useQuery(
    { slug, limit: 12 },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <section className="mt-12 pt-8 border-t border-border/50">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Related Characters
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2.5/3.5] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!related || related.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border/50">
      <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        <Users className="w-6 h-6 text-primary" />
        Related Characters
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Characters who appear alongside {characterName} across multiple card sets at Northland Legendary Finds
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {related.map((char) => (
          <Link key={char.slug} href={`/characters/${char.slug}`}>
            <div className="group cursor-pointer">
              <div className="relative aspect-[2.5/3.5] rounded-xl overflow-hidden border-2 border-border/50 group-hover:border-primary/60 transition-all duration-300 shadow-md group-hover:shadow-primary/20 group-hover:shadow-lg">
                <img
                  src={char.imageUrl || PLACEHOLDER_IMG}
                  alt={`${char.characterName} Marvel trading card - Northland Legendary Finds`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-2">
                  <p className="text-white text-xs font-bold truncate">
                    {char.characterName}
                  </p>
                  <p className="text-white/60 text-[10px]">
                    {char.cardCount} cards &middot; {char.sharedSets} shared {char.sharedSets === 1 ? 'set' : 'sets'}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
