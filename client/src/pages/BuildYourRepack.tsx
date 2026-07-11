/**
 * Build Your Repack — Simple one-page form
 * Collects: name, email, phone, zip, favorite character, format, price, comments
 * Submits to GHL CRM + database with honeypot + math captcha
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import HoneypotField from "@/components/HoneypotField";
import { Package, CheckCircle2, ShieldCheck } from "lucide-react";

const FORMAT_OPTIONS = [
  { id: "single_slab" as const, label: "Single Graded Slab" },
  { id: "slab_and_packs" as const, label: "Slab + 2 Packs" },
  { id: "mystery_tier" as const, label: "Mystery Tier Box" },
  { id: "other" as const, label: "Something Else" },
];

const PRICE_OPTIONS = [
  { id: "under_25" as const, label: "Under $25" },
  { id: "25_50" as const, label: "$25 – $50" },
  { id: "50_100" as const, label: "$50 – $100" },
  { id: "100_plus" as const, label: "$100+" },
];

/** Generate a simple math challenge */
function generateMathChallenge() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b };
}

export default function BuildYourRepack() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [favoriteCharacter, setFavoriteCharacter] = useState("");
  const [format, setFormat] = useState<typeof FORMAT_OPTIONS[number]["id"] | null>(null);
  const [priceRange, setPriceRange] = useState<typeof PRICE_OPTIONS[number]["id"] | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Honeypot state
  const [honeypot, setHoneypot] = useState("");

  // Simple math captcha
  const [mathChallenge] = useState(() => generateMathChallenge());
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  const submitMutation = trpc.repackFeedback.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Thanks! Your feedback helps us build better repacks.");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Bot check
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    // Human verification
    if (parseInt(captchaAnswer, 10) !== mathChallenge.answer) {
      setCaptchaError(true);
      toast.error("Math answer is incorrect. Please try again.");
      return;
    }

    if (!format || !priceRange) {
      toast.error("Please select a format and price range.");
      return;
    }

    submitMutation.mutate({
      format,
      priceRange,
      suggestion: suggestion.trim() || undefined,
      email: email.trim() || undefined,
      firstName: firstName.trim() || undefined,
      phone: phone.trim() || undefined,
      zipCode: zipCode.trim() || undefined,
      favoriteCharacter: favoriteCharacter.trim() || undefined,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title="Thanks! | Build Your Repack | Northland Legendary Finds"
          description="Your feedback has been submitted."
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
              Your feedback is locked in. We're building repacks based on what the community actually wants.
            </p>
          </div>
          <Card className="bg-card/50 border-primary/20">
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                {email ? "We'll notify you when repacks drop. Keep an eye on your inbox." : "Thanks for helping shape the future of NLF repacks."}
              </p>
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
        description="Help us design the perfect Marvel trading card repack. Tell us what you want inside."
        path="/build-your-repack"
      />

      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
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
            We're building repacks and we need your help. Tell us what you want inside — takes less than a minute.
          </p>
        </div>
      </section>

      {/* Simple Form */}
      <div className="container max-w-xl pb-20">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Contact Info */}
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">Your Info</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Zip Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="12345"
                    maxLength={10}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favorite Character */}
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">Favorite Marvel Character</h2>
              <input
                type="text"
                value={favoriteCharacter}
                onChange={(e) => setFavoriteCharacter(e.target.value)}
                placeholder="e.g., Doctor Doom, Spider-Man, Wolverine..."
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </CardContent>
          </Card>

          {/* Format */}
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-lg font-bold text-white">What format do you want? *</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {FORMAT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormat(opt.id)}
                    className={`text-left px-4 py-3 rounded-lg border transition-all text-sm font-medium ${
                      format === opt.id
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Range */}
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-lg font-bold text-white">What price range? *</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRICE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPriceRange(opt.id)}
                    className={`text-center px-3 py-3 rounded-lg border transition-all text-sm font-medium ${
                      priceRange === opt.id
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-lg font-bold text-white">Comments / Suggestions</h2>
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="What cards do you want? What would make you buy a repack? Any ideas?"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                maxLength={1000}
              />
            </CardContent>
          </Card>

          {/* Human Verification */}
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Quick check:</span>
                <span className="text-lg text-white font-mono">
                  {mathChallenge.a} + {mathChallenge.b} =
                </span>
                <input
                  type="number"
                  value={captchaAnswer}
                  onChange={(e) => {
                    setCaptchaAnswer(e.target.value);
                    setCaptchaError(false);
                  }}
                  placeholder="?"
                  className={`w-16 px-3 py-2 bg-background border rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-primary ${
                    captchaError ? "border-red-500 ring-1 ring-red-500" : "border-border"
                  }`}
                />
              </div>
              {captchaError && (
                <p className="text-xs text-red-400 mt-2 ml-8">That's not right — try again.</p>
              )}
            </CardContent>
          </Card>

          {/* Honeypot */}
          <HoneypotField value={honeypot} onChange={setHoneypot} />

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitMutation.isPending || !format || !priceRange}
            className="w-full bg-primary hover:bg-primary/90 text-lg py-6 font-bold"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit My Feedback"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            No account needed. No spam. We just want to build what you actually want.
          </p>
        </form>
      </div>
    </div>
  );
}
