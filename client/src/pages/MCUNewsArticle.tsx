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
