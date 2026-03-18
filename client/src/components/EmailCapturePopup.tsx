import { useEffect, useState } from "react";
import { X, Loader2, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import HoneypotField from "@/components/HoneypotField";

/**
 * Smart Email Capture Popup Component — Top Right Corner Style
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
  const [honeypot, setHoneypot] = useState("");

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
    // Bot protection
    if (honeypot) {
      setSubmitted(true);
      return;
    }
    if (!email.trim() || subscribeMutation.isPending) return;

    subscribeMutation.mutate({
      email: email.trim(),
      source: isExitIntent ? "exit-intent-popup" : "welcome-popup",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="relative w-80 bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-xl shadow-2xl shadow-black/50">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-5">
          {submitted ? (
            /* Success state */
            <div className="py-2 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-green-400 mb-1">
                You're In!
              </h3>
              <p className="text-gray-400 text-sm">
                Welcome to the NLF community! We'll keep you posted.
              </p>
            </div>
          ) : (
            /* Form state */
            <>
              {/* Header with icon */}
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/15 border border-primary/30 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {isExitIntent ? "Wait — Stay in the Loop!" : "Stay in the Loop"}
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {isExitIntent 
                      ? "Get notified when we drop new products!"
                      : "Join our collectors community for launch updates and exclusive drops."
                    }
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <HoneypotField value={honeypot} onChange={setHoneypot} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribeMutation.isPending}
                  className="w-full px-3 py-2.5 bg-black/50 border border-green-500/20 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
                />
                
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending || !email.trim()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 rounded-lg transition-all disabled:opacity-50"
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
              <p className="text-[11px] text-gray-600 mt-3 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
