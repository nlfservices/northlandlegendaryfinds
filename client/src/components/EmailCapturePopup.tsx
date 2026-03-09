import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Smart Email Capture Popup Component
 * 
 * Behavior:
 * - Shows 2 seconds after page load on first visit
 * - If closed without submitting -> doesn't show again
 * - If closed without submitting AND user tries to leave -> shows exit-intent popup
 * - Uses localStorage to remember user's choice
 * - Never shows to users who already submitted
 * 
 * To integrate GoHighLevel:
 * Replace the placeholder form with your GHL embed code in the form section
 */

export default function EmailCapturePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExitIntent, setIsExitIntent] = useState(false);

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
    
    // TODO: Replace with actual GoHighLevel form submission
    // For now, just mark as submitted and close
    localStorage.setItem("nlf_email_submitted", "true");
    localStorage.setItem("nlf_popup_closed", "permanent");
    setIsOpen(false);
    
    // Show success message
    alert("Thank you for subscribing! Check your email for your discount code.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-br from-purple-900/90 to-black border-2 border-green-500/30 rounded-xl shadow-2xl animate-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close popup"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon/Logo */}
          <div className="mb-4">
            <div className="inline-block p-4 bg-green-500/10 rounded-full">
              <span className="text-5xl">🎁</span>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-3xl font-bold text-green-400 mb-2">
            {isExitIntent ? "Wait! Don't Miss Out!" : "Welcome to NLF!"}
          </h2>
          
          <p className="text-lg text-gray-300 mb-6">
            {isExitIntent 
              ? "Get 10% off your first order before you go!"
              : "Join our legendary collectors community and get 10% off your first repack!"
            }
          </p>

          {/* Form - PLACEHOLDER FOR GOHIGHLEVEL */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg transition-all transform hover:scale-105"
            >
              Get My 10% Discount
            </Button>
          </form>

          {/* Fine print */}
          <p className="text-xs text-gray-500 mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>

        </div>
      </div>
    </div>
  );
}
