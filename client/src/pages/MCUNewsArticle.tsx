/** * MCU News Article Detail Page
 * Full article view with markdown rendering, sources, related characters, and card market impact
 */

import { Link, useParams, useLocation } from "wouter";
import { useMemo } from "react";
import {
  ArrowLeft, Clock, Tag, ExternalLink, User,
  ChevronRight, Newspaper, Facebook, Tv,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import RichContent from "@/components/RichContent";
import SEO, { breadcrumbJsonLd, articleJsonLd, organizationJsonLd, faqJsonLd, itemListJsonLd, speakableJsonLd } from "@/components/SEO";
// FanVoting removed per user request
import CollectorsCorner from "@/components/CollectorsCorner";
import { ArticleTemplateRenderer, getArticleTemplate, type ArticleTemplate } from "@/components/ArticleTemplates";
import ShareButtons from "@/components/ShareButtons";
import ArticlePollWidget from "@/components/ArticlePollWidget";
import ArticlePollWidgetMini from "@/components/ArticlePollWidgetMini";
import RelatedArticles from "@/components/RelatedArticles";
import MCUCountdown from "@/components/MCUCountdown";
import LegendaryListForm from "@/components/LegendaryListForm";
import { SafeImage, HULK_PLACEHOLDER } from "@/components/SafeImage";

const CARD_MARKET_IMG = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/mcu-intel-card-market-Lt56dsta4y7Hzfj6pzAysR.webp";

function getWhoWouldWinTheme(slug: string) {
  return null;
}

export default function MCUNewsArticle() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <div className="min-h-screen">
      <p className="p-8 text-center">Loading article…</p>
    </div>
  );
}
