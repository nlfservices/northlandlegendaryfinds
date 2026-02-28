import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

/**
 * Smart Email Capture Popup Component
 * Uses GHL iframe embed for reliable form submission
 * 
 * Behavior:
 * - Shows 2 seconds after page load on first visit
 * - If closed without submitting -> doesn't show again for this session
 * - If closed without submitting AND user tries to leave -> shows exit-intent popup
 * - Uses localStorage to remember user's choice
 * - Never shows to users who already submitted
 */

export default function EmailCapturePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExitIntent, setIsExitIntent] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

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

  // Listen for GHL form submission
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === "object") {
        if (
          event.data.type === "form-submitted" ||
          event.data.type === "hsFormCallback" ||
          event.data.eventName === "onFormSubmit" ||
          event.data.formSubmitted
        ) {
          localStorage.setItem("nlf_email_submitted", "true");
          localStorage.setItem("nlf_popup_closed", "permanent");
          setTimeout(() => setIsOpen(false), 2000);
        }
      }
      if (event.data === "form_submitted") {
        localStorage.setItem("nlf_email_submitted", "true");
        localStorage.setItem("nlf_popup_closed", "permanent");
        setTimeout(() => setIsOpen(false), 2000);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("nlf_popup_closed", "temporary");
  };

  const handleCloseForever = () => {
    setIsOpen(false);
    localStorage.setItem("nlf_popup_closed", "permanent");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-br from-purple-900/90 to-black border-2 border-green-500/30 rounded-xl shadow-2xl animate-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close popup"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Headline */}
          <h2 className="text-2xl font-bold text-green-400 mb-2 mt-2">
            {isExitIntent ? "Wait! Don't Miss Out!" : "Welcome to NLF!"}
          </h2>
          
          <p className="text-sm text-gray-300 mb-4">
            {isExitIntent 
              ? "Sign up for early access before you go!"
              : "Join our legendary collectors community for exclusive drops and deals!"
            }
          </p>

          {/* GHL Form - Same iframe approach as ComingSoon page */}
          <div className="ghl-dark-wrapper rounded-lg overflow-hidden">
            <div
              ref={formContainerRef}
              className="ghl-form-container"
            >
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/5SL68SbkAFgq85FPiJw6"
                style={{ width: "100%", border: "none", overflow: "hidden" }}
                scrolling="no"
                id="popup-inline-5SL68SbkAFgq85FPiJw6"
                data-layout='{"id":"INLINE"}'
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Form 0"
                data-height="600"
                data-layout-iframe-id="popup-inline-5SL68SbkAFgq85FPiJw6"
                data-form-id="5SL68SbkAFgq85FPiJw6"
                title="Email Signup"
              ></iframe>
            </div>
          </div>

          {/* Fine print */}
          <p className="text-xs text-gray-500 mt-3">
            We respect your privacy. Unsubscribe anytime.
          </p>

          <button
            onClick={handleCloseForever}
            className="text-xs text-gray-600 hover:text-gray-400 mt-2 underline underline-offset-2 transition-colors"
          >
            No thanks, don't show again
          </button>
        </div>
      </div>
    </div>
  );
}
