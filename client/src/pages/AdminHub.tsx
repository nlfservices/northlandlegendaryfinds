/**
 * Admin Hub - Central command center for NLF admin operations
 * Organized into sections: Upload & Import, Products, Content, Operations, Digital Packs, Tools
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getLoginUrl } from "@/const";
import {
  Package, ListChecks, Zap, Radio, Plus, ArrowLeft, Loader2,
  ShoppingBag, Boxes, Hammer, BarChart3, FileSpreadsheet, Flame,
  Upload, FileUp, Sparkles, Eye, Newspaper, Trophy, Layers,
  CreditCard, Settings, ExternalLink, Grid3X3, ClipboardList
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface HubCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  tab?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

interface HubSection {
  title: string;
  description: string;
  cards: HubCard[];
}

const SECTIONS: HubSection[] = [
  {
    title: "Upload & Import",
    description: "Add cards and import checklists from spreadsheets",
    cards: [
      {
        title: "Upload Excel Checklist",
        description: "Import your NLF pack checklist from an Excel spreadsheet (.xlsx). Auto-detects columns and maps tiers.",
        icon: <FileUp className="w-6 h-6" />,
        tab: "checklist-sheet",
        badge: "Spreadsheet",
      },
      {
        title: "Add Cards Manually",
        description: "Add individual cards to a product checklist with full details — character, set, grade, parallel, and value.",
        icon: <Plus className="w-6 h-6" />,
        tab: "checklist-sheet",
      },
      {
        title: "CSV / Clipboard Import",
        description: "Paste card data from a spreadsheet or import a CSV file directly into the checklist.",
        icon: <ClipboardList className="w-6 h-6" />,
        tab: "checklist-sheet",
      },
    ],
  },
  {
    title: "Products & Inventory",
    description: "Manage your repack products, inventory, and pack building",
    cards: [
      {
        title: "Products",
        description: "Create, edit, and manage your repack product lines. Set pricing, pack counts, and Whatnot series.",
        icon: <Package className="w-6 h-6" />,
        tab: "products",
      },
      {
        title: "Inventory Manager",
        description: "Track your raw card inventory, graded slabs, and supplies across all storage locations.",
        icon: <Boxes className="w-6 h-6" />,
        tab: "inventory",
      },
      {
        title: "Repack Builder",
        description: "Build and assign packs from your inventory. Drag cards into packs with tier balancing.",
        icon: <Hammer className="w-6 h-6" />,
        tab: "repack-builder",
      },
    ],
  },
  {
    title: "Checklists & Pull Tracking",
    description: "Manage checklists, log pulls during shows, and track what's been opened",
    cards: [
      {
        title: "Checklist Sheet",
        description: "Full spreadsheet view of all cards in a product. Filter, sort, search, and manage card statuses.",
        icon: <FileSpreadsheet className="w-6 h-6" />,
        tab: "checklist-sheet",
        badge: "Main View",
        badgeVariant: "default",
      },
      {
        title: "Checklists",
        description: "View and manage checklist cards by product. Edit individual card details and images.",
        icon: <ListChecks className="w-6 h-6" />,
        tab: "checklists",
      },
      {
        title: "Pull Logger",
        description: "Log card pulls during live Whatnot shows. Quick-pull interface with real-time pack tracking.",
        icon: <Zap className="w-6 h-6" />,
        tab: "pulls",
      },
    ],
  },
  {
    title: "Shows & Orders",
    description: "Manage Whatnot shows, customer orders, and fulfillment",
    cards: [
      {
        title: "Shows",
        description: "Schedule and manage your Whatnot live shows. Track show dates, products, and pack allocations.",
        icon: <Radio className="w-6 h-6" />,
        tab: "shows",
      },
      {
        title: "Orders",
        description: "View and fulfill customer orders. Update tracking numbers and manage shipping status.",
        icon: <ShoppingBag className="w-6 h-6" />,
        tab: "orders",
      },
    ],
  },
  {
    title: "Content Management",
    description: "Manage articles, rankings, and market intelligence content",
    cards: [
      {
        title: "MCU Intel Articles",
        description: "Write and publish Marvel news articles, set reviews, and market analysis for the MCU Intel section.",
        icon: <Newspaper className="w-6 h-6" />,
        tab: "articles",
      },
      {
        title: "Top 5 Rankings",
        description: "Update the weekly Top 5 Marvel card rankings displayed on the homepage.",
        icon: <Trophy className="w-6 h-6" />,
        tab: "top5",
      },
    ],
  },
  {
    title: "Digital Slab Packs",
    description: "Manage digital pack products, cards, and the reveal experience",
    cards: [
      {
        title: "Slab Pack Manager",
        description: "Create and manage digital slab packs. Add cards with images, set tiers, and configure pricing.",
        icon: <Sparkles className="w-6 h-6" />,
        tab: "slab-packs",
        badge: "Coming May 2026",
        badgeVariant: "secondary",
      },
      {
        title: "Preview Reveal Demo",
        description: "See the immersive card reveal experience with the 3D video animation and Doctor Doom card.",
        icon: <Eye className="w-6 h-6" />,
        href: "/demo-reveal",
      },
    ],
  },
  {
    title: "Tools & Analytics",
    description: "Market research tools and pricing analytics",
    cards: [
      {
        title: "eBay Comps",
        description: "Search eBay sold listings for comparable sales. Research card values and market trends.",
        icon: <BarChart3 className="w-6 h-6" />,
        tab: "ebay-comps",
      },
    ],
  },
];

function HubCardComponent({ card, onNavigateToTab }: { card: HubCard; onNavigateToTab: (tab: string) => void }) {
  const content = (
    <Card className="group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 cursor-pointer h-full">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <span className="text-primary">{card.icon}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">{card.title}</h3>
              {card.badge && (
                <Badge variant={card.badgeVariant || "outline"} className="text-[10px] px-1.5 py-0">
                  {card.badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
          </div>
          {card.href && <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />}
        </div>
      </CardContent>
    </Card>
  );

  if (card.href) {
    return (
      <Link href={card.href}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={() => card.tab && onNavigateToTab(card.tab)}>
      {content}
    </div>
  );
}

export default function AdminHub() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  const handleNavigateToTab = (tab: string) => {
    // Navigate to the admin dashboard with the tab as a query param
    setLocation(`/matrix/dashboard?tab=${tab}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-12 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in as an admin to access this page.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/">
                <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Site</Button>
              </Link>
              <a href={getLoginUrl()}>
                <Button>Log In</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/matrix">
              <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Matrix</Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="font-bold text-lg">NLF Command Center</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/matrix/dashboard">
              <Button variant="outline" size="sm">
                <Grid3X3 className="w-4 h-4 mr-1" /> Full Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{user.name || user.email}</span>
              <Badge variant="outline" className="border-primary/50 text-primary">Admin</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hub Content */}
      <div className="container py-8 space-y-10">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">Welcome back, {user.name?.split(' ')[0] || 'Admin'}</h2>
            <p className="text-muted-foreground text-sm">Manage your products, upload checklists, track pulls, and run your card business from here.</p>
          </div>
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
        </div>

        {/* Sections */}
        {SECTIONS.map((section, i) => (
          <div key={i}>
            <div className="mb-4">
              <h3 className="text-lg font-bold">{section.title}</h3>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.cards.map((card, j) => (
                <HubCardComponent key={j} card={card} onNavigateToTab={handleNavigateToTab} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
