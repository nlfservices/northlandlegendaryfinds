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
    <div className="fixed bottom-3 left-3 right-3 sm:right-auto sm:left-4 sm:bottom-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="relative w-full sm:w-96 max-h-[85vh] overflow-y-auto bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 border-2 border-green-400/30 rounded-xl shadow-2xl shadow-black/60">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        {/* Close button — large tap target for mobile */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white/80 hover:text-white hover:bg-black/50 active:bg-black/60 transition-colors z-10"
          aria-label="Close popup"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="relative p-5">
          {submitted ? (
            /* Success state */
            <div className="py-3 text-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                You're In!
              </h3>
              <p className="text-white/90 text-sm">
                {config.successMessage}
              </p>
            </div>
          ) : (
            /* Form state */
            <>
              {/* Header with icon */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-11 h-11 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {isExitIntent ? config.exitTitle : config.title}
                  </h3>
                  <p className="text-sm text-white/85 mt-1 leading-snug">
                    {isExitIntent ? config.exitSubtitle : config.subtitle}
                  </p>
                </div>
              </div>

              {/* Social proof badge */}
              <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-white/10 border border-white/15 rounded-lg w-fit">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-green-400 border border-white/30" />
                  <div className="w-5 h-5 rounded-full bg-emerald-400 border border-white/30" />
                  <div className="w-5 h-5 rounded-full bg-teal-400 border border-white/30" />
                </div>
                <span className="text-[11px] text-white/80 font-medium">
                  {config.socialProof}
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <input
                  type="text"
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={subscribeMutation.isPending}
                  className="w-full px-3 py-2.5 bg-white/95 border border-white/30 rounded-lg text-black text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all disabled:opacity-50"
                />
                <input
                  type="email"
                  placeholder="Your best email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribeMutation.isPending}
                  className="w-full px-3 py-2.5 bg-white/95 border border-white/30 rounded-lg text-black text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all disabled:opacity-50"
                />
                
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending || !email.trim()}
                  className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 text-sm"
                >
                  {subscribeMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Joining...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      {config.buttonText}
                    </span>
                  )}
                </Button>
              </form>

              {/* Fine print */}
              <p className="text-[11px] text-white/60 mt-3 text-center">
                No spam. Unsubscribe anytime. We respect your inbox.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
