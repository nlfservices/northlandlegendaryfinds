/**
 * Transparency & Compliance Page
 * Explains NLF's commitment to platform rules, Whatnot compliance,
 * and full transparency in repack products.
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  ShieldCheck, FileCheck, Eye, ListChecks, Radio,
  ArrowRight, CheckCircle2, Lock, Scale, Users,
  BookOpen, Zap, Package, AlertTriangle
} from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const PRINCIPLES = [
  {
    icon: ListChecks,
    title: "Complete Checklists Published",
    description: "Every repack series has a full checklist published before the first pack is opened. You can see exactly what cards are in the series — no hidden cards, no surprises about what's included.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: Eye,
    title: "Real-Time Pull Tracking",
    description: "Every card pulled is logged in real-time with the date, show, and pack number. Our checklist pages update live so you always know what's been pulled and what's still available.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Lock,
    title: "Finalized & Locked Series",
    description: "Once a series checklist is finalized, it is locked. The number of packs and individual items will not change. This is stated on every checklist page with the finalization date.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Scale,
    title: "No Value Manipulation",
    description: "We do not list estimated values, floor/ceiling prices, or value comparisons on our checklists. We believe the cards speak for themselves — you can research market values independently.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Users,
    title: "Live Stream Accountability",
    description: "All packs are opened live on Whatnot streams. Every pull is witnessed by the community in real-time. Our show history and pull logs are permanently recorded on this site.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: BookOpen,
    title: "Platform Rule Compliance",
    description: "We follow all Whatnot policies for Professionally Sealed Surprise Products. Our checklists include all required information: card year, player/character name, variation, condition, and series details.",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
];

const CHECKLIST_FIELDS = [
  { field: "Brand / Manufacturer", value: "Northland Legendary Finds", required: true },
  { field: "Product Title", value: "Listed on each product page", required: true },
  { field: "Series Name", value: "Listed on each product page", required: true },
  { field: "Item Condition", value: "Listed per card (Raw, Graded, etc.)", required: true },
  { field: "Quantity of Items", value: "Total card count displayed on checklist", required: true },
  { field: "Card Year", value: "Listed per card", required: true },
  { field: "Player / Card Name", value: "Listed per card", required: true },
  { field: "Variation / Parallel", value: "Listed per card (Base, Refractor, Gold /50, etc.)", required: true },
  { field: "Grade (if applicable)", value: "Listed per card when graded", required: true },
  { field: "Finalization Statement", value: "Date-stamped statement on each checklist", required: true },
];

export default function Transparency() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Pack Transparency & Pull Rates"
        description="Full transparency on Northland Legendary Finds pack contents and pull rates. Every pack opened on camera, every hit tracked and verified."
        path="/transparency"
        jsonLd={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Transparency", url: "/transparency" }])}
      />
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-transparent" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full mb-6">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-bold tracking-wide">TRANSPARENCY FIRST</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
              OUR COMMITMENT TO{" "}
              <span className="text-green-400">TRANSPARENCY</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              At Northland Legendary Finds, we believe the trading card repack industry needs more transparency, not less.
              We publish complete checklists, track every pull in real-time, and follow all platform rules — because
              trust is earned through actions, not promises. Our repacks are built on three principles: a strong floor,
              a better middle, and a healthy ceiling — and we give you the tools to verify it yourself.
            </p>
          </div>
        </div>
      </section>

      {/* Why Transparency Matters */}
      <section className="py-12 lg:py-16 border-t border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              WHY THIS MATTERS
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The repack market has a trust problem. Too many sellers hide what's in their packs, inflate values,
              or pad packs with worthless filler to hit a card count. We started NLF to do things differently. We build every series
              around a strong floor (every card has real value), a better middle (quality cards throughout, not one hit buried in junk),
              and a healthy ceiling (legitimate chase cards in the mix). Every decision
              we make is guided by one question: <strong className="text-foreground">"Would I buy this if I were the customer?"</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We comply with Whatnot's{" "}
              <a
                href="https://help.whatnot.com/hc/en-us/articles/39618879679757-Professionally-Sealed-Surprise-Products"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Professionally Sealed Surprise Products policy
              </a>{" "}
              and go beyond the minimum requirements. Here's exactly how we operate.
            </p>
          </div>

          {/* Principles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRINCIPLES.map((principle) => (
              <Card key={principle.title} className="bg-card/50 hover:border-primary/20 transition-colors">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 ${principle.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <principle.icon className={`w-6 h-6 ${principle.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{principle.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist Compliance Table */}
      <section className="py-12 lg:py-16 bg-card/30 border-y border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <FileCheck className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                CHECKLIST COMPLIANCE
              </h2>
            </div>
            <p className="text-muted-foreground mb-8">
              Every NLF checklist includes all fields required by Whatnot's Professionally Sealed Surprise Products policy
              for sports and trading cards. Here's what we publish for every series:
            </p>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-3 text-sm font-bold">Required Field</th>
                    <th className="text-left px-4 py-3 text-sm font-bold">How We Provide It</th>
                    <th className="text-center px-4 py-3 text-sm font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {CHECKLIST_FIELDS.map((row, i) => (
                    <tr key={row.field} className={i % 2 === 0 ? "bg-card/50" : ""}>
                      <td className="px-4 py-3 text-sm font-medium">{row.field}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{row.value}</td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                WHAT WE DON'T DO
              </h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Transparency isn't just about what we show — it's about what we refuse to do. These are industry
              practices we've committed to avoiding:
            </p>

            <div className="space-y-3">
              {[
                "We do NOT list estimated values, floor/ceiling prices, or value comparisons on checklists",
                "We do NOT change the contents of a series after it has been finalized",
                "We do NOT add or remove packs from a series after finalization",
                "We do NOT hide cards from the checklist — every possible pull is listed",
                "We do NOT use misleading terms like \"guaranteed hit\" without defining what qualifies",
                "We do NOT open packs off-camera — all pulls happen live on stream",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-red-400 text-xs font-bold">✕</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Verify */}
      <section className="py-12 lg:py-16 bg-card/30 border-y border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                VERIFY IT YOURSELF
              </h2>
            </div>
            <p className="text-muted-foreground mb-8">
              Don't take our word for it — we've built the tools for you to verify everything yourself:
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/checklists">
                <Card className="bg-card hover:border-green-500/30 transition-colors cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <ListChecks className="w-8 h-8 text-green-400 mb-3" />
                    <h3 className="font-bold mb-1">Browse Checklists</h3>
                    <p className="text-sm text-muted-foreground">View every card in every series with real-time pull status</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/whatnot">
                <Card className="bg-card hover:border-purple-500/30 transition-colors cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <Radio className="w-8 h-8 text-purple-400 mb-3" />
                    <h3 className="font-bold mb-1">Watch Live Shows</h3>
                    <p className="text-sm text-muted-foreground">See every pack opened live on Whatnot with real-time pull logging</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/cards">
                <Card className="bg-card hover:border-blue-500/30 transition-colors cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <Package className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="font-bold mb-1">Card Database</h3>
                    <p className="text-sm text-muted-foreground">Browse our complete card encyclopedia with set details and images</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/graded">
                <Card className="bg-card hover:border-amber-500/30 transition-colors cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <Zap className="w-8 h-8 text-amber-400 mb-3" />
                    <h3 className="font-bold mb-1">Graded Inventory</h3>
                    <p className="text-sm text-muted-foreground">See our graded card submissions and results — full transparency on what we own</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <ShieldCheck className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              QUESTIONS ABOUT OUR PROCESS?
            </h2>
            <p className="text-muted-foreground mb-6">
              We're happy to answer any questions about how we build our repacks, source our cards, or comply
              with platform rules. Reach out anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  Contact Us <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="outline" size="lg">
                  Read Our FAQ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
