import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { X, Loader2, CheckCircle, Gift, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Smart Email Capture Popup Component — Upgraded with Giveaway Hook
 * 
 * Dynamic messaging based on page context:
 * - MCU News pages → "Get insider card picks before prices spike"
 * - Card/Character pages → "Get alerts when this card trends"
 * - Default → "Enter our monthly giveaway"
 * 
 * Behavior:
 * - Shows 3 seconds after page load on first visit
 * - If user closes popup (X) -> stays dismissed for the entire session
 * - If user closed popup AND tries to leave the page (exit intent) -> shows ONE more time
 * - After exit intent is shown once, never shows again in that session
 * - Uses sessionStorage for per-session tracking + localStorage for permanent (subscribed) state
 * - Never shows to users who already submitted their email
 * - Submits email to GoHighLevel CRM via tRPC
 */

type PopupVariant = "giveaway" | "insider" | "alerts";

function getVariant(path: string): PopupVariant {
  if (path.startsWith("/mcu-news") || path.startsWith("/nerd-gossip")) return "insider";
  if (path.startsWith("/characters") || path.startsWith("/cards") || path.startsWith("/trending")) return "alerts";
  return "giveaway";
}

const VARIANT_CONFIG: Record<PopupVariant, {
  icon: typeof Gift;
  title: string;
  exitTitle: string;
  subtitle: string;
  exitSubtitle: string;
  buttonText: string;
  successMessage: string;
  socialProof: string;
}> = {
  giveaway: {
    icon: Gift,
    title: "Win Free Cards Every Month",
    exitTitle: "Wait — Free Cards!",
    subtitle: "Enter our monthly giveaway for graded slabs, sealed packs, gift cards, and more. Email = automatic entry.",
    exitSubtitle: "Don't miss this month's giveaway — graded slabs and sealed packs up for grabs!",
    buttonText: "Enter Giveaway",
    successMessage: "You're entered! Good luck this month. 🎉",
    socialProof: "Join to win free cards, gift cards & more",
  },
  insider: {
    icon: Sparkles,
    title: "Get Card Picks Before They Spike",
    exitTitle: "One More Thing —",
    subtitle: "We called the Wolverine card spike 3 weeks early. Get insider picks and market alerts before everyone else.",
    exitSubtitle: "Our last alert saved collectors $200+ on early pickups. Don't miss the next one.",
    buttonText: "Get Insider Picks",
    successMessage: "You're on the list! Next alert coming soon. 📈",
    socialProof: "Subscribers got 3-week early notice on last spike",
  },
  alerts: {
    icon: Trophy,
    title: "Track Cards That Matter",
    exitTitle: "Before You Go —",
    subtitle: "Get notified when Marvel cards trend, new sets drop, or prices move. No spam — just the cards you care about.",
    exitSubtitle: "Marvel Mint cards moved 40% last month. Get alerts before the next wave.",
    buttonText: "Get Card Alerts",
    successMessage: "Alerts activated! We'll keep you posted. 🔔",
    socialProof: "Marvel Mint up 40% since Doomsday announcement",
  },
};

export default function EmailCapturePopup() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExitIntent, setIsExitIntent] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const exitIntentShownRef = useRef(false);
  const dismissedRef = useRef(false);

  const variant = getVariant(location);
  const config = VARIANT_CONFIG[variant];
  const IconComponent = config.icon;

  const subscribeMutation = trpc.public.subscribe.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      localStorage.setItem("nlf_email_submitted", "true");
      sessionStorage.setItem("nlf_popup_subscribed", "true");
      toast.success(config.successMessage);
      // Auto-close after 4 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 4000);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  useEffect(() => {
    // Suppress popup entirely on landing pages (e.g., /free-credit) — it kills FB ad conversions
    if (location === "/free-credit") return;

    // Check if user has already submitted (permanent — never show again)
    const hasSubmitted = localStorage.getItem("nlf_email_submitted");
    if (hasSubmitted) return;

    // Check if popup was already dismissed this session
    const sessionDismissed = sessionStorage.getItem("nlf_popup_dismissed");
    const exitIntentUsed = sessionStorage.getItem("nlf_exit_intent_shown");

    if (sessionDismissed && exitIntentUsed) {
      // Both initial popup and exit intent already shown this session — done
      return;
    }

    if (sessionDismissed) {
      // Popup was dismissed but exit intent hasn't been shown yet
      dismissedRef.current = true;

      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !exitIntentShownRef.current) {
          exitIntentShownRef.current = true;
          sessionStorage.setItem("nlf_exit_intent_shown", "true");
          setIsExitIntent(true);
          setIsOpen(true);
        }
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden" && !exitIntentShownRef.current) {
          exitIntentShownRef.current = true;
          sessionStorage.setItem("nlf_exit_intent_shown", "true");
        }
      };

      document.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener("mouseleave", handleMouseLeave);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }

    // First visit this session — show popup after 3 seconds (slightly longer for less intrusion)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    dismissedRef.current = true;
    sessionStorage.setItem("nlf_popup_dismissed", "true");

    if (isExitIntent) {
      sessionStorage.setItem("nlf_exit_intent_shown", "true");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribeMutation.isPending) return;

    subscribeMutation.mutate({
      email: email.trim(),
      firstName: firstName.trim() || undefined,
      source: isExitIntent ? "exit-intent-popup" : `welcome-popup-${variant}`,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-5 sm:bottom-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="relative w-full sm:w-[420px] max-h-[90vh] overflow-y-auto bg-black/95 border border-green-500/40 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_15px_rgba(34,197,94,0.15)]" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        {/* Subtle green glow accent at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 rounded-t-2xl" />

        {/* Close button — large tap target for mobile */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 active:bg-white/30 transition-colors z-10"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="relative p-6 pt-7">
          {submitted ? (
            /* Success state */
            <div className="py-4 text-center">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                You're In!
              </h3>
              <p className="text-white/80 text-base">
                {config.successMessage}
              </p>
            </div>
          ) : (
            /* Form state */
            <>
              {/* Header with icon */}
              <div className="flex items-start gap-4 mb-5">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500/15 border border-green-500/30 rounded-xl flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1 pr-6">
                  <h3 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '-0.01em' }}>
                    {isExitIntent ? config.exitTitle : config.title}
                  </h3>
                  <p className="text-[15px] text-white/75 mt-1.5 leading-relaxed">
                    {isExitIntent ? config.exitSubtitle : config.subtitle}
                  </p>
                </div>
              </div>

              {/* Social proof badge */}
              <div className="flex items-center gap-2.5 mb-5 px-3.5 py-2 bg-green-500/10 border border-green-500/20 rounded-lg w-fit">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-black" />
                  <div className="w-5 h-5 rounded-full bg-emerald-400 border-2 border-black" />
                  <div className="w-5 h-5 rounded-full bg-teal-400 border-2 border-black" />
                </div>
                <span className="text-xs text-green-300/90 font-medium">
                  {config.socialProof}
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={subscribeMutation.isPending}
                  className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white text-[15px] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all disabled:opacity-50"
                />
                <input
                  type="email"
                  placeholder="Your best email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribeMutation.isPending}
                  className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white text-[15px] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all disabled:opacity-50"
                />
                
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending || !email.trim()}
                  className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 text-[15px] shadow-lg shadow-green-500/20"
                >
                  {subscribeMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Joining...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <IconComponent className="w-5 h-5" />
                      {config.buttonText}
                    </span>
                  )}
                </Button>
              </form>

              {/* Fine print */}
              <p className="text-xs text-white/40 mt-4 text-center">
                No spam. Unsubscribe anytime. We respect your inbox.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
