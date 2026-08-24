/**
 * MCU News - News, Rumors & Card Market Impact Hub
 * A content-rich page with featured articles, category filters, MCU timeline, and card market analysis
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Newspaper, TrendingUp, Calendar, Users, Film, Tv, MessageSquare,
  Search, ChevronRight, Clock, Tag, ExternalLink, Sparkles, Zap,
  ArrowRight, Filter, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import SEO, { breadcrumbJsonLd, collectionPageJsonLd, organizationJsonLd } from "@/components/SEO";
import FanVoting from "@/components/FanVoting";
import { SafeImage, HULK_PLACEHOLDER } from "@/components/SafeImage";
