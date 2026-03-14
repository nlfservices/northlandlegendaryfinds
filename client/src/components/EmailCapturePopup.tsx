import { useEffect, useState } from "react";
import { X, Loader2, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Smart Email Capture Popup Component
 * 
 * Mobile: Full-width bottom sheet with backdrop overlay
 * Desktop: Top-right corner card (unchanged behavior)
 * 
 * Behavior:
 * - Shows 2 seconds after page load on first visit
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

    // Show popup after 2 seconds on first visit
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    // Exit intent detection (desktop only)
    const handleMouseLeave = (e: MouseEvent) => {
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
    localStorage.setItem("nlf_popup_closed", "temporary");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
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
    <>
      {/* Mobile: backdrop overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:pointer-events-none"
        onClick={handleBackdropClick}
      >
        {/* Mobile: bottom sheet | Desktop: top-right corner */}
        <div
          className="
            fixed z-50 pointer-events-auto
            bottom-0 left-0 right-0
            md:bottom-auto md:left-auto md:right-4 md:top-4
            animate-in slide-in-from-bottom duration-300
            md:slide-in-from-right
          "
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="
              relative bg-gradient-to-br from-gray-900 to-black
              border border-green-500/30 shadow-2xl shadow-black/50
              rounded-t-2xl
              md:rounded-xl md:w-80
            "
          >
            {/* Drag handle — mobile only */}
            <div className="flex justify-center pt-3 md:hidden">
              <div className="w-10 h-1 rounded-full bg-gray-600" />
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 md:top-3 md:right-3 w-8 h-8 md:w-auto md:h-auto flex items-center justify-center rounded-full bg-gray-800/50 md:bg-transparent text-gray-400 hover:text-white transition-colors"
              aria-label="Close popup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="px-5 pb-6 pt-3 md:p-5">
              {submitted ? (
                /* Success state */
                <div className="py-4 md:py-2 text-center">
                  <CheckCircle className="w-14 h-14 md:w-12 md:h-12 text-green-400 mx-auto mb-3" />
                  <h3 className="text-xl md:text-lg font-bold text-green-400 mb-1">
                    You're In!
                  </h3>
                  <p className="text-gray-400 text-base md:text-sm">
                    Welcome to the NLF community! We'll keep you posted.
                  </p>
                </div>
              ) : (
                /* Form state */
                <>
                  {/* Header with icon */}
                  <div className="flex items-start gap-3 mb-4 md:mb-3">
                    <div className="flex-shrink-0 w-12 h-12 md:w-10 md:h-10 bg-primary/15 border border-primary/30 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-base font-bold text-white leading-tight">
                        {isExitIntent ? "Wait — Stay in the Loop!" : "Stay in the Loop"}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1 md:mt-0.5">
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
                      autoComplete="email"
                      className="w-full px-4 py-3 md:px-3 md:py-2.5 bg-black/50 border border-green-500/20 rounded-lg text-white text-base md:text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-colors disabled:opacity-50"
                    />
                    
                    <Button
                      type="submit"
                      disabled={subscribeMutation.isPending || !email.trim()}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 md:py-2.5 text-base md:text-sm rounded-lg transition-all disabled:opacity-50 min-h-[48px] md:min-h-0"
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
                  <p className="text-xs md:text-[11px] text-gray-600 mt-3 text-center">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </>
              )}
            </div>

            {/* Safe area padding for phones with home indicator */}
            <div className="h-[env(safe-area-inset-bottom,0px)] md:hidden" />
          </div>
        </div>
      </div>
    </>
  );
}
