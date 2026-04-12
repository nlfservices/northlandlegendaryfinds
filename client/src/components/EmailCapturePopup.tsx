import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { X, Loader2, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Smart Email Capture Popup Component — Bottom Left Corner Style
 * 
 * Behavior:
 * - Shows 2 seconds after page load on first visit
 * - If user closes popup (X or backdrop click) -> stays dismissed for the entire session
 * - If user closed popup AND tries to leave the page (exit intent) -> shows ONE more time
 * - After exit intent is shown once, never shows again in that session
 * - Uses sessionStorage for per-session tracking + localStorage for permanent (subscribed) state
 * - Never shows to users who already submitted their email
 * - Submits email to GoHighLevel CRM via tRPC + notifies admin
 */

export default function EmailCapturePopup() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExitIntent, setIsExitIntent] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const exitIntentShownRef = useRef(false);
  const dismissedRef = useRef(false);

  const subscribeMutation = trpc.public.subscribe.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      localStorage.setItem("nlf_email_submitted", "true");
      sessionStorage.setItem("nlf_popup_subscribed", "true");
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
      // Set up exit intent listener only
      dismissedRef.current = true;

      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !exitIntentShownRef.current) {
          exitIntentShownRef.current = true;
          sessionStorage.setItem("nlf_exit_intent_shown", "true");
          setIsExitIntent(true);
          setIsOpen(true);
        }
      };

      // Also handle mobile: beforeunload / visibilitychange as exit intent
      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden" && !exitIntentShownRef.current) {
          // Can't show popup when hidden, but mark it so it shows on return
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

    // First visit this session — show popup after 2 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    dismissedRef.current = true;

    // Mark as dismissed for this session
    sessionStorage.setItem("nlf_popup_dismissed", "true");

    if (isExitIntent) {
      // Exit intent was shown and closed — mark it so it never shows again this session
      sessionStorage.setItem("nlf_exit_intent_shown", "true");
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

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="relative w-80 sm:w-96 bg-green-600 border-4 border-black rounded-xl shadow-2xl shadow-black/60">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-5">
          {submitted ? (
            /* Success state */
            <div className="py-2 text-center">
              <CheckCircle className="w-12 h-12 text-white mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                You're In!
              </h3>
              <p className="text-white/90 text-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
                Welcome to the NLF community! We'll keep you posted.
              </p>
            </div>
          ) : (
            /* Form state */
            <>
              {/* Header with icon */}
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-black/20 border-2 border-black/40 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                    {isExitIntent ? "Wait — Stay in the Loop!" : "Stay in the Loop"}
                  </h3>
                  <p className="text-sm text-white/90 mt-0.5" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
                    {isExitIntent 
                      ? "Get notified when we drop new products!"
                      : "Join our collectors community for launch updates and exclusive drops."
                    }
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribeMutation.isPending}
                  className="w-full px-3 py-2.5 bg-white border-2 border-black/30 rounded-lg text-black text-sm placeholder-gray-500 focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                />
                
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending || !email.trim()}
                  className="w-full bg-black hover:bg-black/80 text-white font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 border-2 border-black"
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
              <p className="text-[11px] text-white/70 mt-3 text-center" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
                We respect your privacy. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
