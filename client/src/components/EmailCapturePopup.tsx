import { useEffect, useState, useCallback, useRef } from "react";
import { X, Loader2, CheckCircle, Mail, Sparkles, Gift, Zap, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import confetti from "canvas-confetti";

/**
 * Smart Email Capture Popup Component — Centered Modal with Green Theme
 * 
 * Behavior:
 * - Shows 3 seconds after page load on first visit
 * - Centered on screen with backdrop overlay (especially mobile-friendly)
 * - Green theme matching the site design
 * - If closed without submitting -> doesn't show again for this session
 * - If closed without submitting AND user tries to leave -> shows exit-intent with discount offer
 * - Confetti celebration on successful subscription
 * - Uses localStorage to remember user's choice
 * - Never shows to users who already submitted
 * - Submits email to GoHighLevel CRM via tRPC + notifies admin
 */

const DISCOUNT_CODE = "LEGENDARY10";

function fireConfetti() {
  // First burst - green themed from left
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { x: 0.3, y: 0.5 },
    colors: ["#22c55e", "#4ade80", "#86efac", "#10b981", "#34d399", "#fbbf24", "#f59e0b"],
    startVelocity: 35,
    gravity: 0.8,
    ticks: 150,
  });

  // Second burst - from right
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { x: 0.7, y: 0.5 },
    colors: ["#22c55e", "#4ade80", "#86efac", "#10b981", "#34d399", "#fbbf24", "#f59e0b"],
    startVelocity: 35,
    gravity: 0.8,
    ticks: 150,
  });

  // Delayed center burst with stars
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors: ["#22c55e", "#fbbf24", "#ffffff"],
      shapes: ["star"],
      startVelocity: 25,
      gravity: 0.6,
      ticks: 120,
    });
  }, 200);
}

export default function EmailCapturePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExitIntent, setIsExitIntent] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasTriggeredConfetti = useRef(false);

  const subscribeMutation = trpc.public.subscribe.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      localStorage.setItem("nlf_email_submitted", "true");
      localStorage.setItem("nlf_popup_closed", "permanent");
      toast.success(data.message);

      // Fire confetti celebration
      if (!hasTriggeredConfetti.current) {
        hasTriggeredConfetti.current = true;
        fireConfetti();
      }

      // Auto-close after 5 seconds (longer to enjoy the confetti + see discount)
      setTimeout(() => {
        setIsOpen(false);
      }, 5000);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  useEffect(() => {
    // Check if user has already interacted with popup
    const hasClosedPopup = localStorage.getItem("nlf_popup_closed");
    const hasSubmitted = localStorage.getItem("nlf_email_submitted");

    // Don't show if user already submitted or permanently closed
    if (hasSubmitted || hasClosedPopup === "permanent") {
      return;
    }

    // Show popup after 3 seconds on first visit
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top of page (navigating away)
      const currentState = localStorage.getItem("nlf_popup_closed");
      if (e.clientY <= 0 && currentState === "temporary") {
        setIsExitIntent(true);
        setShowDiscount(true);
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as temporarily closed (will show exit intent)
    const current = localStorage.getItem("nlf_popup_closed");
    if (current !== "permanent") {
      localStorage.setItem("nlf_popup_closed", "temporary");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribeMutation.isPending) return;

    subscribeMutation.mutate({
      email: email.trim(),
      source: isExitIntent ? "exit-intent-popup" : "welcome-popup",
    });
  };

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(DISCOUNT_CODE).then(() => {
      setCopied(true);
      toast.success("Discount code copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  if (!isOpen) return null;

  return (
    /* Backdrop overlay - click to close */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      {/* Modal card - stop propagation so clicking inside doesn't close */}
      <div
        className="relative w-full max-w-sm bg-gradient-to-br from-green-950 via-green-900/95 to-emerald-950 border border-green-500/40 rounded-2xl shadow-[0_0_60px_rgba(34,197,94,0.15)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative glow effect */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-green-400/20 via-transparent to-emerald-400/10 pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 text-green-300/60 hover:text-white transition-colors p-1 rounded-full hover:bg-green-800/50"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="relative p-6">
          {submitted ? (
            /* Success state with confetti celebration */
            <div className="py-4 text-center">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <PartyPopper className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-green-400 mb-2">
                Welcome to the Legend!
              </h3>
              <p className="text-green-200/70 text-sm mb-4">
                You're officially part of the NLF community. Check your inbox for a welcome surprise.
              </p>

              {/* Discount code reveal */}
              <div className="bg-black/30 border border-green-500/30 rounded-xl p-4">
                <p className="text-xs text-green-300/60 mb-2 uppercase tracking-wider font-semibold">Your exclusive welcome gift</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-lg">10% OFF</span>
                  <span className="text-green-200/70 text-sm">your first order</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/15 border border-green-500/30 rounded-lg hover:bg-green-500/25 transition-colors group"
                >
                  <span className="font-mono font-bold text-green-400 tracking-widest">{DISCOUNT_CODE}</span>
                  <span className="text-xs text-green-300/50 group-hover:text-green-300/80 transition-colors">
                    {copied ? "Copied!" : "Click to copy"}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* Form state */
            <>
              {/* Icon badge */}
              <div className="flex justify-center mb-4">
                <div className={`w-14 h-14 border rounded-xl flex items-center justify-center ${
                  showDiscount 
                    ? "bg-yellow-500/20 border-yellow-500/30" 
                    : "bg-green-500/20 border-green-500/30"
                }`}>
                  {showDiscount ? (
                    <Zap className="w-7 h-7 text-yellow-400" />
                  ) : (
                    <Sparkles className="w-7 h-7 text-green-400" />
                  )}
                </div>
              </div>

              {/* Header text - centered */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white leading-tight mb-2">
                  {showDiscount ? "Wait — Here's 10% Off!" : "Join the Collectors Club"}
                </h3>
                <p className="text-sm text-green-200/70 leading-relaxed">
                  {showDiscount 
                    ? "Before you go — subscribe now and get an exclusive 10% discount on your first order. Don't miss this deal!"
                    : "Be the first to know about new product launches, exclusive drops, and collector deals."
                  }
                </p>
              </div>

              {/* Discount badge for exit intent */}
              {showDiscount && (
                <div className="flex items-center justify-center gap-2 mb-4 py-2 px-4 bg-yellow-500/10 border border-yellow-500/25 rounded-lg mx-auto">
                  <Gift className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span className="text-yellow-400 font-bold text-sm">Use code</span>
                  <span className="font-mono font-bold text-yellow-300 bg-yellow-500/15 px-2 py-0.5 rounded text-sm">{DISCOUNT_CODE}</span>
                  <span className="text-yellow-400 font-bold text-sm">at checkout</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500/50" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={subscribeMutation.isPending}
                    className="w-full pl-10 pr-4 py-3 bg-black/30 border border-green-500/30 rounded-xl text-white text-sm placeholder-green-300/30 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30 transition-all disabled:opacity-50"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending || !email.trim()}
                  className={`w-full font-bold py-3 rounded-xl transition-all disabled:opacity-50 text-sm shadow-lg ${
                    showDiscount 
                      ? "bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/25" 
                      : "bg-green-500 hover:bg-green-400 text-black shadow-green-500/25"
                  }`}
                >
                  {subscribeMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subscribing...
                    </span>
                  ) : showDiscount ? (
                    "Claim My 10% Off"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>

              {/* Fine print */}
              <p className="text-[11px] text-green-300/40 mt-4 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
