import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { X, Loader2, CheckCircle, Gift, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Email Capture Popup — Homepage Only with Last-Chance Confirmation
 * 
 * Behavior:
 * - ONLY shows on the homepage (/)
 * - Shows 3 seconds after page load on first visit
 * - When user clicks X, shows a "last chance" confirmation before fully dismissing
 * - After dismissal, never shows again in that session
 * - Never shows to users who already submitted their email
 * - Submits email to GoHighLevel CRM via tRPC
 */

export default function EmailCapturePopup() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showLastChance, setShowLastChance] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = trpc.public.subscribe.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      localStorage.setItem("nlf_email_submitted", "true");
      sessionStorage.setItem("nlf_popup_subscribed", "true");
      toast.success("You're entered! Good luck this month. 🎉");
      setTimeout(() => {
        setIsOpen(false);
      }, 4000);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  useEffect(() => {
    // ONLY show on homepage
    if (location !== "/") return;

    // Check if user has already submitted (permanent — never show again)
    const hasSubmitted = localStorage.getItem("nlf_email_submitted");
    if (hasSubmitted) return;

    // Check if popup was already dismissed this session
    const sessionDismissed = sessionStorage.getItem("nlf_popup_dismissed");
    if (sessionDismissed) return;

    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [location]);

  const handleClose = () => {
    if (!showLastChance && !submitted) {
      // First close attempt — show last chance message
      setShowLastChance(true);
    } else {
      // Second close (from last chance) or after submit — fully dismiss
      setIsOpen(false);
      sessionStorage.setItem("nlf_popup_dismissed", "true");
    }
  };

  const handleDismissForReal = () => {
    setIsOpen(false);
    sessionStorage.setItem("nlf_popup_dismissed", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribeMutation.isPending) return;

    subscribeMutation.mutate({
      email: email.trim(),
      firstName: firstName.trim() || undefined,
      source: showLastChance ? "homepage-popup-last-chance" : "homepage-popup-giveaway",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-5 sm:bottom-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="relative w-full sm:w-[420px] max-h-[90vh] overflow-y-auto bg-black/95 border border-green-500/40 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_15px_rgba(34,197,94,0.15)]" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        {/* Subtle green glow accent at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 rounded-t-2xl" />

        {/* Close button */}
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
                You're entered! Good luck this month. 🎉
              </p>
            </div>
          ) : showLastChance ? (
            /* Last Chance state — shown when user tries to close */
            <>
              <div className="flex items-start gap-4 mb-5">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/15 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1 pr-6">
                  <h3 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '-0.01em' }}>
                    Wait — Free Cards!
                  </h3>
                  <p className="text-[15px] text-white/75 mt-1.5 leading-relaxed">
                    We give away graded slabs, sealed packs, and gift cards every month. One email = automatic entry. Sure you want to miss out?
                  </p>
                </div>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-2.5 mb-5 px-3.5 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg w-fit">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-black" />
                  <div className="w-5 h-5 rounded-full bg-emerald-400 border-2 border-black" />
                  <div className="w-5 h-5 rounded-full bg-teal-400 border-2 border-black" />
                </div>
                <span className="text-xs text-yellow-300/90 font-medium">
                  500+ collectors already entered this month
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
                      <Gift className="w-5 h-5" />
                      Last Chance — Enter Giveaway
                    </span>
                  )}
                </Button>
              </form>

              {/* No thanks link */}
              <button
                onClick={handleDismissForReal}
                className="w-full text-center text-xs text-white/40 hover:text-white/60 mt-4 transition-colors cursor-pointer"
              >
                No thanks, I don't want free cards
              </button>
            </>
          ) : (
            /* Initial state — giveaway offer */
            <>
              <div className="flex items-start gap-4 mb-5">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500/15 border border-green-500/30 rounded-xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1 pr-6">
                  <h3 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '-0.01em' }}>
                    Win Free Cards Every Month
                  </h3>
                  <p className="text-[15px] text-white/75 mt-1.5 leading-relaxed">
                    Enter our monthly giveaway for graded slabs, sealed packs, gift cards, and more. Email = automatic entry.
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
                  Join to win free cards, gift cards & more
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
                      <Gift className="w-5 h-5" />
                      Enter Giveaway
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
