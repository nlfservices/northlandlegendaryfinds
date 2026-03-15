import { useEffect, useState } from "react";
import { X, Loader2, CheckCircle, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Smart Email Capture Popup Component — Centered Modal with Green Theme
 * 
 * Behavior:
 * - Shows 3 seconds after page load on first visit
 * - Centered on screen with backdrop overlay (especially mobile-friendly)
 * - Green theme matching the site design
 * - If closed without submitting -> doesn't show again
 * - If closed without submitting AND user tries to leave -> shows exit-intent popup
 * - Uses localStorage to remember user's choice
 * - Never shows to users who already submitted
 * - Submits email to GoHighLevel CRM via tRPC + notifies admin
 */

export default function EmailCapturePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExitIntent, setIsExitIntent] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = trpc.public.subscribe.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      localStorage.setItem("nlf_email_submitted", "true");
      localStorage.setItem("nlf_popup_closed", "permanent");
      toast.success(data.message);
      // Auto-close after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
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
      if (e.clientY <= 0 && hasClosedPopup === "temporary") {
        setIsExitIntent(true);
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
    localStorage.setItem("nlf_popup_closed", "temporary");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribeMutation.isPending) return;

    subscribeMutation.mutate({
      email: email.trim(),
      source: isExitIntent ? "exit-intent-popup" : "welcome-popup",
    });
  };

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
            /* Success state */
            <div className="py-4 text-center">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-green-400 mb-2">
                You're In!
              </h3>
              <p className="text-green-200/70 text-sm">
                Welcome to the NLF community! We'll keep you posted on launches and exclusive drops.
              </p>
            </div>
          ) : (
            /* Form state */
            <>
              {/* Icon badge */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-green-400" />
                </div>
              </div>

              {/* Header text - centered */}
              <div className="text-center mb-5">
                <h3 className="text-xl font-bold text-white leading-tight mb-2">
                  {isExitIntent ? "Wait — Don't Miss Out!" : "Join the Collectors Club"}
                </h3>
                <p className="text-sm text-green-200/70 leading-relaxed">
                  {isExitIntent 
                    ? "Get notified when we drop new products and exclusive packs!"
                    : "Be the first to know about new product launches, exclusive drops, and collector deals."
                  }
                </p>
              </div>

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
                  className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50 text-sm shadow-lg shadow-green-500/25"
                >
                  {subscribeMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subscribing...
                    </span>
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
