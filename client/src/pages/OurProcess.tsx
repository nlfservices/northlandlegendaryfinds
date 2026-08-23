/**
 * Our Process Page
 * Step-by-step walkthrough of how NLF builds repacks:
 * sourcing, sorting, grading, sealing, packaging, and random spot assignment.
 * Ends with a humorous Superman/DC joke about randomization fairness.
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Search, LayoutGrid, Award, Lock, Package, Shuffle,
  ArrowRight, CheckCircle2, ShieldCheck, Camera, Sparkles,
  ImageIcon
} from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const PROCESS_STEPS = [
  {
    step: 1,
    title: "Card Sourcing",
    subtitle: "Finding the Right Cards",
    description:
      "Every NLF repack starts with sourcing authentic cards from trusted distributors, hobby shops, and verified sellers. We focus exclusively on official Topps Marvel releases â€” no bootlegs, no reprints, no mystery sources. Each card is verified for authenticity before it ever touches our sorting table.",
    details: [
      "Sourced from authorized distributors and verified sellers",
      "100% authentic Topps Marvel releases only",
      "Each card individually verified before processing",
      "Graded cards sourced from CGC, AGS, PSA, and other top grading services",
    ],
    icon: Search,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    placeholder: "Photo: Card sourcing â€” boxes of authentic Topps Marvel product",
    image: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Comic_Book_Heroes_box_spotlight_215fa041_a537a3c5.webp",
    imageAlt: "Topps Comic Book Heroes Marvel Golden Anniversary box with Marvel heroes",
  },
  {
    step: 2,
    title: "Sorting & Organization",
    subtitle: "The Sorting Tables",
    description:
      "Once sourced, every card goes through our sorting process. We organize cards by set, character, parallel type, and condition. Our sorting tables are where the magic happens â€” this is where we build the tiers for each repack series. Chase cards, hit cards, and base cards are carefully categorized and cataloged.",
    details: [
      "Cards organized by set, character, and parallel type",
      "Tier assignment: Chase, Hit, and Base categories",
      "Every card cataloged with full details for the checklist",
      "Condition assessment for each individual card",
    ],
    icon: LayoutGrid,
    color: "text-green-400",
    bg: "bg-green-500/10",
    borderColor: "border-green-500/30",
    placeholder: "Photo: Sorting tables with cards organized by tier and set",
    image: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/SortingTable_08b58f63.png",
    imageAlt: "NLF sorting table covered with stacks of Marvel trading cards organized by set and tier",
  },
  {
    step: 3,
    title: "Grading & Quality Check",
    subtitle: "Every Card Inspected",
    description:
      "Quality is non-negotiable. Every card in an NLF repack is individually inspected. Graded cards come in official slabs from top grading services including CGC, AGS, PSA, and more. Raw cards are checked for centering, surface condition, corners, and edges. If a card doesn't meet our standards, it doesn't make the cut â€” period.",
    details: [
      "Cards graded by top services including CGC, AGS, PSA, and more",
      "Every graded card verified with official slab and cert number",
      "Raw cards inspected for centering, surface, corners, and edges",
      "Cards that don't meet standards are removed from the series",
      "Grade and condition recorded for every card on the checklist",
    ],
    icon: Award,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    placeholder: "Photo: Quality inspection â€” graded slabs and raw card evaluation",
    image: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/GradedCardsSorting_317a2d17.png",
    imageAlt: "Graded Marvel trading cards in CGC and AGS slabs being sorted and inspected on a table",
  },
  {
    step: 4,
    title: "Sealing the Hits",
    subtitle: "Tamper-Proof Packaging",
    description:
      "Every card is sealed in a custom NLF holographic mylar bag. This isn't just about presentation â€” it's about integrity. Once sealed, the contents cannot be tampered with or swapped. Each bag is heat-sealed and features our holographic NLF branding so you know it's authentic and untouched.",
    details: [
      "Custom NLF holographic mylar bags for every card",
      "Heat-sealed for tamper-proof protection",
      "Holographic branding ensures authenticity",
      "Contents cannot be viewed, swapped, or altered after sealing",
    ],
    icon: Lock,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    placeholder: "Photo: Sealing process â€” heat-sealing cards in NLF holographic mylar bags",
    image: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/1000036619_669cf912.jpg",
    imageAlt: "Hacona heat sealer on Marvel comic tablecloth used to seal NLF repack bags",
  },
  {
    step: 5,
    title: "Final Packaging",
    subtitle: "Ready for the Drop",
    description:
      "Sealed packs are organized, counted, and prepared for the drop. Each series has a fixed number of packs â€” once they're packaged, the series is finalized and locked. The checklist is published, the pack count is set, and nothing changes from this point forward.",
    details: [
      "Packs counted and organized for the series",
      "Series finalized â€” checklist locked with date stamp",
      "Pack inventory set and published on the product page",
      "Ready for live stream opening or direct purchase",
    ],
    icon: Package,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    placeholder: "Photo: Final packaging â€” sealed NLF packs organized and ready for drop",
    image: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/NLF-Series3_870f94b8.webp",
    imageAlt: "Northland Legendary Finds sealed repack pack with cosmic NLF branding ready for drop",
  },
];

export default function OurProcess() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Our Process â€” How We Build NLF Repacks"
        description="See exactly how Northland Legendary Finds builds every repack â€” from card sourcing and sorting to sealing, packaging, and random live stream spot assignment."
        path="/our-process"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Our Process", url: "/our-process" },
        ])}
      />

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold tracking-wide">BEHIND THE SCENES</span>
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              HOW WE BUILD{" "}
              <span className="text-primary">EVERY PACK</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              From card sourcing to your doorstep â€” here's the complete, unfiltered look at how every
              Northland Legendary Finds repack is built. No shortcuts, no secrets, no filler.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="absolute left-8 top-[280px] bottom-0 w-px bg-gradient-to-b from-border to-transparent hidden lg:block" />
                )}

                <div className={`mb-16 ${index % 2 === 0 ? "" : ""}`}>
                  {/* Step number badge */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl ${step.bg} border ${step.borderColor} flex items-center justify-center shrink-0`}
                    >
                      <span className={`text-2xl font-bold ${step.color}`}>{step.step}</span>
                    </div>
                    <div>
                      <Badge variant="outline" className={`${step.color} border-current mb-1`}>
                        STEP {step.step}
                      </Badge>
                      <h2
                        className="text-2xl sm:text-3xl font-bold"
                        style={{ fontFamily: "'Anton', sans-serif" }}
                      >
                        {step.title.toUpperCase()}
                      </h2>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Image placeholder */}
                    <div
                      className={`relative rounded-xl border-2 border-dashed ${step.borderColor} bg-card/30 overflow-hidden ${
                        index % 2 === 1 ? "lg:order-2" : ""
                      }`}
                    >
                      {step.image ? (
                      <img
                        src={step.image}
                        alt={step.imageAlt || step.placeholder}
                        className="w-full h-full object-cover aspect-[4/3]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="aspect-[4/3] flex flex-col items-center justify-center p-8 text-center">
                        <div className={`w-16 h-16 ${step.bg} rounded-full flex items-center justify-center mb-4`}>
                          <ImageIcon className={`w-8 h-8 ${step.color}`} />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium mb-2">
                          {step.placeholder}
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                          Image placeholder â€” replace with actual photo
                        </p>
                      </div>
                    )}
                    </div>

                    {/* Content */}
                    <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                      <h3 className="text-lg font-semibold text-muted-foreground mb-3">
                        {step.subtitle}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">{step.description}</p>

                      <div className="space-y-2">
                        {step.details.map((detail) => (
                          <div key={detail} className="flex items-start gap-3">
                            <CheckCircle2 className={`w-4 h-4 ${step.color} shrink-0 mt-0.5`} />
                            <span className="text-sm text-muted-foreground">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step 6: Random Spot Assignment â€” The Fun One */}
      <section className="py-12 lg:py-20 bg-card/30 border-y border-border relative overflow-hidden">
        {/* Subtle playing card pattern background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-10 left-10 text-8xl rotate-12">â™ </div>
          <div className="absolute top-20 right-20 text-7xl -rotate-6">â™¥</div>
          <div className="absolute bottom-10 left-1/4 text-9xl rotate-[-15deg]">â™¦</div>
          <div className="absolute bottom-20 right-10 text-8xl rotate-6">â™£</div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Step header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-fuchsia-400">6</span>
              </div>
              <div>
                <Badge variant="outline" className="text-fuchsia-400 border-fuchsia-400 mb-1">
                  THE FINAL STEP
                </Badge>
                <h2
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  RANDOM SPOT ASSIGNMENT
                </h2>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Live stream studio photo */}
              <div className="relative rounded-xl border-2 border-fuchsia-500/30 bg-card/30 overflow-hidden">
                <img
                  src="https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Studio_dbf83a8a.webp"
                  alt="NLF live stream studio setup with Marvel collectible figures and Northland Legendary Finds branding on screen"
                  className="w-full h-full object-cover aspect-[4/3]"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-3">
                  The Great Equalizer
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Here's where it all comes together. When packs are opened on live streams, spots are assigned
                  randomly. You don't get to pick your pack. You don't get to feel the weight. You don't get to
                  hold it up to the light. A random number generator assigns your spot, and that's what you get.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  This is the key to fairness. Random spots on streaming platforms make it virtually impossible
                  for anyone to gain an advantage. No one â€” not the seller, not the buyer, not the chat
                  moderator â€” knows which pack contains which card. The randomizer doesn't care about your
                  username, your purchase history, or how many fire emojis you spam in chat.
                </p>

                <div className="space-y-2">
                  {[
                    "Spots assigned by random number generator â€” no exceptions",
                    "Seller has zero knowledge of pack contents after sealing",
                    "No pack selection, no feeling, no peeking â€” pure randomization",
                    "Live on camera so the entire community can verify fairness",
                    "Stream recordings archived for full accountability",
                  ].map((detail) => (
                    <div key={detail} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* The Superman Joke */}
            <Card className="bg-gradient-to-r from-fuchsia-500/5 via-purple-500/5 to-blue-500/5 border-fuchsia-500/20 overflow-hidden">
              <CardContent className="pt-8 pb-8">
                <div className="max-w-2xl mx-auto text-center">
                  <div className="text-5xl mb-4">ðŸƒ</div>
                  <h3
                    className="text-xl sm:text-2xl font-bold mb-4"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    SO WHO HAS THE ADVANTAGE?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    With sealed packs, random spot assignment, and live stream accountability, the only person
                    who could possibly have an unfair advantage would need X-ray vision to see through our
                    holographic mylar bags.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-2">
                    And last time we checked, the only guy with X-ray vision is{" "}
                    <span className="font-bold text-blue-400">Superman</span>.
                  </p>
                  <p className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
                    AND WE DON'T SELL DC PRODUCTS.
                  </p>
                  <p className="text-sm text-muted-foreground/70 italic">
                    Sorry, Clark. This is a Marvel house. ðŸ•·ï¸
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Summary */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2
                className="text-2xl sm:text-3xl font-bold mb-4"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                THE NLF DIFFERENCE
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every step of our process is designed around one principle: you should never have to
                just trust us â€” you should be able to verify everything yourself.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Search,
                  label: "Verified Sources",
                  desc: "100% authentic Topps cards",
                  color: "text-blue-400",
                  bg: "bg-blue-500/10",
                },
                {
                  icon: Camera,
                  label: "Live on Camera",
                  desc: "Every pack opened on stream",
                  color: "text-green-400",
                  bg: "bg-green-500/10",
                },
                {
                  icon: Lock,
                  label: "Tamper-Proof",
                  desc: "Holographic sealed bags",
                  color: "text-purple-400",
                  bg: "bg-purple-500/10",
                },
                {
                  icon: Shuffle,
                  label: "Random Spots",
                  desc: "RNG-assigned, no exceptions",
                  color: "text-fuchsia-400",
                  bg: "bg-fuchsia-500/10",
                },
              ].map((item) => (
                <Card key={item.label} className="bg-card/50 text-center hover:border-primary/20 transition-colors">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <h3 className="font-bold mb-1">{item.label}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-card/30 border-t border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2
              className="text-2xl sm:text-3xl font-bold mb-4"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              READY TO SEE FOR YOURSELF?
            </h2>
            <p className="text-muted-foreground mb-6">
              Browse our checklists, watch our live streams, or check out the shop.
              Everything we do is built to be verified â€” not just believed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/shop">
                <Button size="lg">
                  Browse the Shop <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/checklists">
                <Button variant="outline" size="lg">
                  View Checklists
                </Button>
              </Link>
              <Link href="/transparency">
                <Button variant="outline" size="lg">
                  Transparency Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

