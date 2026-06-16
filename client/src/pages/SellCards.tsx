/**
 * Sell Your Cards — NLF buying page
 * Topps Marvel numbered & numbered autograph cards ONLY.
 * No bulk, no base, no refractors.
 *
 * Design: dark Marvel aesthetic, green primary, Anton headings.
 * Form: name / phone / email + card details + multi-photo upload.
 */

import {
  useState, useRef, useCallback
} from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

import {
  Upload,
  X,
  CheckCircle2,
  Mail,
  Camera,
  Shield,
  Zap,
  Star,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PhotoPreview {
  id: string;
  dataUrl: string;
  base64: string;
  contentType: string;
  name: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_PHOTOS = 8;
const MAX_FILE_SIZE_MB = 8;

const TOPPS_SETS = [
  "Topps Chrome Marvel",
  "Topps Marvel Mint",
  "Topps Marvel Comic Book Heroes (CBH)",
  "Topps Marvel Masterpieces",
  "Topps Marvel Inception",
  "Topps Marvel Finest",
  "Topps Marvel Sapphire",
  "Topps Marvel Luminance",
  "Topps Marvel Transcendent",
  "Topps Marvel Definitive",
  "Other Topps Marvel Set",
];

const CONDITIONS = [
  "Raw (ungraded)",
  "PSA 10",
  "PSA 9",
  "PSA 8",
  "PSA 7",
  "BGS 10 / Pristine",
  "BGS 9.5 / Gem Mint",
  "BGS 9",
  "CGC 10",
  "CGC 9.5",
  "CGC 9",
  "SGC 10",
  "SGC 9.5",
  "SGC 9",
  "Other",
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function SellCards() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardYear, setCardYear] = useState("");
  const [cardSetName, setCardSetName] = useState("");
  const [condition, setCondition] = useState("");
  const [isAutograph, setIsAutograph] = useState(false);
  const [askingPrice, setAskingPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // tRPC mutation
  const submitMutation = trpc.sellCards.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (err) => {
      toast.error("Something went wrong. Please try again or email us directly.");
      console.error("[SellCards] Submit error:", err);
    },
  });

  // ─── Photo handling ────────────────────────────────────────────────────────

  const processFile = useCallback(
    (file: File): Promise<PhotoPreview | null> => {
      return new Promise((resolve) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file.`);
          return resolve(null);
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          toast.error(`${file.name} is too large (max ${MAX_FILE_SIZE_MB}MB).`);
          return resolve(null);
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          // Extract base64 part (after "data:image/...;base64,")
          const base64 = dataUrl.split(",")[1];
          resolve({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            dataUrl,
            base64,
            contentType: file.type,
            name: file.name,
          });
        };
        reader.readAsDataURL(file);
      });
    },
    []
  );

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files);
      const remaining = MAX_PHOTOS - photos.length;
      if (remaining <= 0) {
        toast.error(`Maximum ${MAX_PHOTOS} photos allowed.`);
        return;
      }
      const toProcess = arr.slice(0, remaining);
      const results = await Promise.all(toProcess.map(processFile));
      const valid = results.filter(Boolean) as PhotoPreview[];
      setPhotos((prev) => [...prev, ...valid]);
    },
    [photos.length, processFile]
  );

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  // ─── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in your name and email.");
      return;
    }
    if (!cardName.trim() || !cardNumber.trim()) {
      toast.error("Please fill in the card name and card number.");
      return;
    }
    submitMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      cardName: cardName.trim(),
      cardNumber: cardNumber.trim(),
      cardYear: cardYear.trim() || undefined,
      setName: cardSetName.trim() || undefined,
      condition: condition || undefined,
      isAutograph,
      askingPrice: askingPrice.trim() || undefined,
      notes: notes.trim() || undefined,
      photos: photos.map((p) => ({ data: p.base64, contentType: p.contentType })),
    });
  };

  // ─── Success screen ────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center py-20">
          <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1
            className="text-4xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            WE GOT IT.
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            Your submission is in. We review every inquiry personally — expect
            an email within <strong className="text-foreground">24–48 hours</strong>.
          </p>
          <p className="text-muted-foreground mb-8">
            If your card is a strong fit, we move fast. Numbered Topps Marvel
            is exactly what we're after.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" className="inline-block">
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </a>
            <a href="/mcu-news" className="inline-block">
              <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                Browse MCU News
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main page ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-b border-border/50">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container relative z-10 py-16 lg:py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/25 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs font-bold tracking-widest uppercase">
                NLF Buying Program
              </span>
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] mb-6 text-foreground"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              SELL YOUR
              <br />
              <span className="text-primary">TOPPS MARVEL</span>
              <br />
              CARDS TO US.
            </h1>

            <p className="text-xl text-muted-foreground mb-4 max-w-2xl leading-relaxed">
              We buy <strong className="text-foreground">Topps Marvel numbered cards</strong> and{" "}
              <strong className="text-foreground">numbered autograph cards</strong> — the ones that
              actually matter. If it's got a print run stamped on it, we want to hear about it.
            </p>

            {/* What we buy / don't buy */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8 mb-10">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                <p className="text-primary font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> We Buy
                </p>
                <ul className="space-y-1.5 text-sm text-foreground/80">
                  <li className="flex items-center gap-2"><span className="text-primary">✓</span> Numbered cards (/99, /50, /25, /10, /5, 1/1)</li>
                  <li className="flex items-center gap-2"><span className="text-primary">✓</span> Numbered autograph cards</li>
                  <li className="flex items-center gap-2"><span className="text-primary">✓</span> Graded or raw — doesn't matter</li>
                  <li className="flex items-center gap-2"><span className="text-primary">✓</span> All Topps Marvel sets (Chrome, Mint, CBH, etc.)</li>
                </ul>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5">
                <p className="text-destructive font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <X className="w-4 h-4" /> We Don't Buy
                </p>
                <ul className="space-y-1.5 text-sm text-foreground/50">
                  <li className="flex items-center gap-2"><span className="text-destructive/70">✗</span> Base cards (unnumbered)</li>
                  <li className="flex items-center gap-2"><span className="text-destructive/70">✗</span> Refractors without a print run</li>
                  <li className="flex items-center gap-2"><span className="text-destructive/70">✗</span> Bulk lots</li>
                  <li className="flex items-center gap-2"><span className="text-destructive/70">✗</span> Non-Topps brands (Panini, Upper Deck, etc.)</li>
                </ul>
              </div>
            </div>

            {/* Quick contact */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <a
                href="mailto:contact@northlandlegendaryfinds.com"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 text-primary" />
                contact@northlandlegendaryfinds.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORM + SIDEBAR ── */}
      <section className="container py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">

          {/* ── FORM (2/3) ── */}
          <div className="lg:col-span-2">
            <h2
              className="text-3xl font-bold text-foreground mb-2"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              SUBMIT YOUR CARD
            </h2>
            <p className="text-muted-foreground mb-8">
              Fill this out and we'll reach out within 24–48 hours with an offer or follow-up questions.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* ── CONTACT INFO ── */}
              <fieldset className="space-y-5">
                <legend className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-2 w-full mb-4">
                  Your Contact Info
                </legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground/80 text-sm font-medium">
                      Full Name <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Tony Stark"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-muted/30 border-border/60 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground/80 text-sm font-medium">
                      Phone Number <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(218) 555-0100"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-muted/30 border-border/60 focus:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/80 text-sm font-medium">
                    Email Address <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-muted/30 border-border/60 focus:border-primary"
                  />
                </div>
              </fieldset>

              {/* ── CARD DETAILS ── */}
              <fieldset className="space-y-5">
                <legend className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-2 w-full mb-4">
                  Card Details
                </legend>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="text-foreground/80 text-sm font-medium">
                      Card Name / Character <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="cardName"
                      placeholder="e.g. Spider-Man, Doctor Doom"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      className="bg-muted/30 border-border/60 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-foreground/80 text-sm font-medium">
                      Card Number / Print Run <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="e.g. /25, 07/10, 1/1"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="bg-muted/30 border-border/60 focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      The serial number stamped on the card
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardYear" className="text-foreground/80 text-sm font-medium">
                      Year
                    </Label>
                    <Input
                      id="cardYear"
                      placeholder="e.g. 2024"
                      value={cardYear}
                      onChange={(e) => setCardYear(e.target.value)}
                      className="bg-muted/30 border-border/60 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setName" className="text-foreground/80 text-sm font-medium">
                      Set Name
                    </Label>
                    <select
                      id="setName"
                      value={cardSetName}
                      onChange={(e) => setCardSetName(e.target.value)}
                      className="w-full h-10 rounded-md border border-border/60 bg-muted/30 px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select a set...</option>
                      {TOPPS_SETS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition" className="text-foreground/80 text-sm font-medium">
                      Condition / Grade
                    </Label>
                    <select
                      id="condition"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full h-10 rounded-md border border-border/60 bg-muted/30 px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select condition...</option>
                      {CONDITIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="askingPrice" className="text-foreground/80 text-sm font-medium">
                      Asking Price (optional)
                    </Label>
                    <Input
                      id="askingPrice"
                      placeholder="e.g. $250 or best offer"
                      value={askingPrice}
                      onChange={(e) => setAskingPrice(e.target.value)}
                      className="bg-muted/30 border-border/60 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Autograph checkbox */}
                <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/15 rounded-lg">
                  <Checkbox
                    id="isAutograph"
                    checked={isAutograph}
                    onCheckedChange={(v) => setIsAutograph(!!v)}
                    className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div>
                    <Label
                      htmlFor="isAutograph"
                      className="text-foreground font-medium cursor-pointer"
                    >
                      This is an autograph card ✍️
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Numbered autos are our #1 priority — check this if it has a signature
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-foreground/80 text-sm font-medium">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any other details — centering, surface issues, cert number, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="bg-muted/30 border-border/60 focus:border-primary resize-none"
                  />
                </div>
              </fieldset>

              {/* ── PHOTO UPLOAD ── */}
              <fieldset className="space-y-4">
                <legend className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-2 w-full mb-4">
                  Card Photos
                </legend>

                <p className="text-sm text-muted-foreground">
                  Upload up to <strong className="text-foreground">{MAX_PHOTOS} photos</strong>. Front and back preferred.
                  Phone camera shots are totally fine — just make sure the serial number is visible.
                </p>

                {/* Drop zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => photos.length < MAX_PHOTOS && fileInputRef.current?.click()}
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                    ${dragOver
                      ? "border-primary bg-primary/10 scale-[1.01]"
                      : photos.length >= MAX_PHOTOS
                      ? "border-border/30 opacity-50 cursor-not-allowed"
                      : "border-border/40 hover:border-primary/60 hover:bg-primary/5"
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && addFiles(e.target.files)}
                  />
                  <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium mb-1">
                    {dragOver ? "Drop photos here" : "Tap to add photos"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WEBP — max {MAX_FILE_SIZE_MB}MB each · {photos.length}/{MAX_PHOTOS} uploaded
                  </p>
                  {photos.length < MAX_PHOTOS && (
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-primary/40 text-primary hover:bg-primary/10"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      >
                        <Upload className="w-3.5 h-3.5 mr-2" />
                        Choose Photos
                      </Button>
                    </div>
                  )}
                </div>

                {/* Photo grid */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border/40">
                        <img
                          src={photo.dataUrl}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                        >
                          <X className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    ))}
                    {/* Add more slot */}
                    {photos.length < MAX_PHOTOS && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-border/40 hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Upload className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </fieldset>

              {/* ── DISCLAIMER ── */}
              <div className="flex gap-3 p-4 bg-muted/20 border border-border/40 rounded-lg text-xs text-muted-foreground">
                <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p>
                  Submitting this form does not guarantee a purchase. We'll review your card and
                  reach out with an offer or follow-up questions. All offers are final and at NLF's
                  discretion. We only buy <strong className="text-foreground">Topps Marvel numbered and numbered autograph cards</strong>.
                </p>
              </div>

              {/* ── SUBMIT ── */}
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.01]"
              >
                {submitMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Submit My Card
                    <ChevronRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* ── SIDEBAR (1/3) ── */}
          <aside className="space-y-6">

            {/* Why sell to NLF */}
            <div className="bg-card border border-border/50 rounded-xl p-6">
              <h3
                className="text-lg font-bold text-foreground mb-4"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                WHY SELL TO NLF?
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    icon: <Zap className="w-4 h-4 text-primary" />,
                    title: "Fast Response",
                    body: "We review every submission personally. You'll hear back within 24–48 hours.",
                  },
                  {
                    icon: <Shield className="w-4 h-4 text-primary" />,
                    title: "Collector-to-Collector",
                    body: "We're not a faceless corporation. We're collectors who know what these cards are worth.",
                  },
                  {
                    icon: <Star className="w-4 h-4 text-primary" />,
                    title: "Fair Offers",
                    body: "We price based on real market data — eBay sold comps, Card Ladder, and our own experience.",
                  },
                  {
                    icon: <CheckCircle2 className="w-4 h-4 text-primary" />,
                    title: "No Pressure",
                    body: "You're never obligated to accept. If our offer doesn't work for you, no hard feelings.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* What we're looking for */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <h3
                className="text-sm font-bold text-primary uppercase tracking-widest mb-4"
              >
                WHAT WE'RE HUNTING
              </h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                {[
                  "SuperFractors & 1/1s",
                  "Numbered autos /10 and under",
                  "CGC / PSA 10 graded hits",
                  "Black Wave & Gold parallels",
                  "Key character cards (Doom, Wolverine, Spider-Man)",
                  "Avengers: Doomsday era releases",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-primary text-xs">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct contact + network message */}
            <div className="bg-card border border-border/50 rounded-xl p-6">
              <h3
                className="text-sm font-bold text-foreground uppercase tracking-widest mb-4"
              >
                REACH US DIRECTLY
              </h3>
              <a
                href="mailto:contact@northlandlegendaryfinds.com"
                className="flex items-center gap-2 text-sm text-primary hover:underline mb-4"
              >
                <Mail className="w-4 h-4" />
                contact@northlandlegendaryfinds.com
              </a>
              <div className="border-t border-border/40 pt-4 mt-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-semibold">Can't help with your card?</span>{" "}
                  No worries — if it's outside what we buy, our network of collectors and dealers might be able to. Submit the form anyway and we'll point you in the right direction.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
