/**
 * Build Your Repack — Interactive community feedback page
 * Lets visitors vote on what they want inside NLF repacks
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { Package, Sparkles, Star, CheckCircle2, MessageSquare } from "lucide-react";

const FORMAT_OPTIONS = [
  {
    id: "single_slab" as const,
    title: "Single Graded Slab",
    description: "One premium graded card — guaranteed quality, guaranteed value.",
    icon: "🏆",
  },
  {
    id: "slab_and_packs" as const,
    title: "Slab + 2 Packs",
    description: "A graded card plus two sealed packs for the rip experience.",
    icon: "📦",
  },
  {
    id: "mystery_tier" as const,
    title: "Mystery Tier Box",
    description: "Multiple tiers at different price points — pick your level of risk.",
    icon: "🎰",
  },
  {
    id: "other" as const,
    title: "Something Else",
    description: "Got a better idea? Tell us in the suggestion box below.",
    icon: "💡",
  },
];

const PRICE_OPTIONS = [
  { id: "under_25" as const, label: "Under $25", description: "Entry level — great for new collectors" },
  { id: "25_50" as const, label: "$25 – $50", description: "Mid-range — solid value hits" },
  { id: "50_100" as const, label: "$50 – $100", description: "Premium — guaranteed heat" },
  { id: "100_plus" as const, label: "$100+", description: "High-end — chase cards and numbered parallels" },
];

const CHARACTER_OPTIONS = [
  "Doctor Doom", "Spider-Man", "Wolverine", "Iron Man", "Captain America",
  "Deadpool", "Venom", "Thor", "Black Panther", "Magneto",
  "Gambit", "Storm", "Hulk", "Loki", "Thanos",
];

const SET_OPTIONS = [
  "Topps Chrome Marvel 2024", "Topps Chrome Marvel 2026", "Topps Finest X-Men '97",
  "Topps Marvel Mint 2025", "Topps Brooklyn Collection", "Topps Finest Fantastic Four",
  "Topps Comic Book Heroes", "Marvel Masterpieces", "Any Vintage (pre-2000)",
];

const GRADED_OPTIONS = [
  { id: "graded" as const, label: "Graded Only", description: "PSA, CGC, or AGS slabs" },
  { id: "raw" as const, label: "Raw Only", description: "Ungraded cards — more cards for the money" },
  { id: "both" as const, label: "Mix of Both", description: "A graded card + raw hits" },
  { id: "no_preference" as const, label: "No Preference", description: "Surprise me" },
];

export default function BuildYourRepack() {
  const [step, setStep] = useState(1);
  const [format, setFormat] = useState<typeof FORMAT_OPTIONS[number]["id"] | null>(null);
  const [priceRange, setPriceRange] = useState<typeof PRICE_OPTIONS[number]["id"] | null>(null);
  const [characters, setCharacters] = useState<string[]>([]);
  const [sets, setSets] = useState<string[]>([]);
  const [gradedPreference, setGradedPreference] = useState<typeof GRADED_OPTIONS[number]["id"] | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.repackFeedback.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Thanks! Your feedback helps us build better repacks.");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const toggleCharacter = (char: string) => {
    setCharacters((prev) =>
      prev.includes(char) ? prev.filter((c) => c !== char) : [...prev, char]
    );
  };

  const toggleSet = (set: string) => {
    setSets((prev) =>
      prev.includes(set) ? prev.filter((s) => s !== set) : [...prev, set]
    );
  };

  const handleSubmit = () => {
    if (!format || !priceRange) return;
    submitMutation.mutate({
      format,
      priceRange,
      characters: characters.length > 0 ? characters : undefined,
      sets: sets.length > 0 ? sets : undefined,
      gradedPreference: gradedPreference || undefined,
      suggestion: suggestion.trim() || undefined,
      email: email.trim() || undefined,
    });
  };

  const canAdvance = () => {
    if (step === 1) return !!format;
    if (step === 2) return !!priceRange;
    if (step === 3) return true; // characters optional
    if (step === 4) return true; // sets optional
    if (step === 5) return true; // graded optional
    return true;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title="Thanks! | Build Your Repack | Northland Legendary Finds"
          description="Your feedback has been submitted. We're building repacks based on what the community wants."
          path="/build-your-repack"
        />
        <div className="container max-w-2xl py-20 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              YOU'RE IN THE VAULT
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Your feedback is locked in. We're building repacks based on what the community actually wants — not what we think you want.
            </p>
          </div>
          <Card className="bg-card/50 border-primary/20">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                {email ? "We'll notify you when repacks drop." : "Want to know when repacks launch?"}
              </p>
              {!email && (
                <div className="flex gap-2 max-w-sm mx-auto">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      if (email.trim()) toast.success("You're on the list!");
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Notify Me
                  </Button>
                </div>
              )}
              {email && (
                <p className="text-green-400 font-medium">You're on the list.</p>
              )}
            </CardContent>
          </Card>
          <div className="mt-8">
            <a href="/mcu-news" className="text-primary hover:underline text-sm">
              Read the latest MCU News while you wait →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Build Your Repack | Northland Legendary Finds"
        description="Help us design the perfect Marvel trading card repack. Tell us what format, price, characters, and sets you want inside."
        path="/build-your-repack"
      />

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.08),transparent_60%)]" />
        <div className="container relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-4">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-bold tracking-wide">COMMUNITY-BUILT</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            BUILD YOUR REPACK
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're designing our next repack series and we need your help. Tell us what you actually want inside — format, price, characters, sets. Your vote shapes what we build.
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="container max-w-2xl mb-8">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Step {step} of 6 {step <= 2 ? "(required)" : "(optional — skip if you want)"}
        </p>
      </div>

      {/* Step Content */}
      <div className="container max-w-2xl pb-20">
        {/* Step 1: Format */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-2">What format do you want?</h2>
            <p className="text-muted-foreground mb-6">Pick the repack style that excites you most.</p>
            <div className="grid gap-3">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFormat(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    format === opt.id
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border bg-card/50 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{opt.title}</p>
                      <p className="text-sm text-muted-foreground">{opt.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Price Range */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-2">What's your price range?</h2>
            <p className="text-muted-foreground mb-6">How much would you pay for a repack?</p>
            <div className="grid gap-3">
              {PRICE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPriceRange(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    priceRange === opt.id
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border bg-card/50 hover:border-primary/50"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-white">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">{opt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Characters */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-2">Which characters do you want?</h2>
            <p className="text-muted-foreground mb-6">Pick as many as you want (or skip this step).</p>
            <div className="flex flex-wrap gap-2">
              {CHARACTER_OPTIONS.map((char) => (
                <button
                  key={char}
                  onClick={() => toggleCharacter(char)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    characters.includes(char)
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-white"
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>
            {characters.length > 0 && (
              <p className="text-sm text-primary">{characters.length} selected</p>
            )}
          </div>
        )}

        {/* Step 4: Sets */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-2">Which sets interest you?</h2>
            <p className="text-muted-foreground mb-6">What card sets would make you buy a repack?</p>
            <div className="flex flex-wrap gap-2">
              {SET_OPTIONS.map((set) => (
                <button
                  key={set}
                  onClick={() => toggleSet(set)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    sets.includes(set)
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-white"
                  }`}
                >
                  {set}
                </button>
              ))}
            </div>
            {sets.length > 0 && (
              <p className="text-sm text-primary">{sets.length} selected</p>
            )}
          </div>
        )}

        {/* Step 5: Graded Preference */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-2">Graded or raw?</h2>
            <p className="text-muted-foreground mb-6">Do you want slabbed cards, raw cards, or both?</p>
            <div className="grid gap-3">
              {GRADED_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setGradedPreference(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    gradedPreference === opt.id
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border bg-card/50 hover:border-primary/50"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-white">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">{opt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Suggestion + Email */}
        {step === 6 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-2">Anything else?</h2>
            <p className="text-muted-foreground mb-6">Drop a suggestion or leave your email to get notified when repacks launch.</p>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Your suggestion (optional)
              </label>
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="What would make you buy a repack? Any specific cards you're chasing? Ideas for bonus items?"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-32"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground mt-1">{suggestion.length}/1000</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Email for launch notification (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">We'll only email you when repacks drop. No spam.</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="border-border"
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <div className="flex gap-2">
              {step > 2 && (
                <Button
                  variant="ghost"
                  onClick={() => setStep(step + 1)}
                  className="text-muted-foreground"
                >
                  Skip
                </Button>
              )}
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canAdvance()}
                className="bg-primary hover:bg-primary/90"
              >
                Next
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="bg-primary hover:bg-primary/90 px-8"
            >
              {submitMutation.isPending ? "Submitting..." : "Submit My Vote"}
            </Button>
          )}
        </div>

        {/* Trust element */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Star className="w-3 h-3" />
            <span>No account needed. No spam. Just building what you want.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
