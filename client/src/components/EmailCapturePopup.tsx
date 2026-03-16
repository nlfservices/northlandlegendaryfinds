import { useEffect, useState, useRef, useCallback } from "react";
import { X, Loader2, CheckCircle, Mail, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Smart Email Capture Popup Component — Draggable, Bottom-Left Default
 * 
 * Behavior:
 * - Shows 2 seconds after page load on first visit
 * - Draggable — grab the header bar to reposition anywhere on screen
 * - If closed without submitting -> doesn't show again
 * - If closed without submitting AND user tries to leave -> shows exit-intent popup
 * - Uses localStorage to remember user's choice
 * - Never shows to users who already submitted
 * - Submits email to GoHighLevel CRM via tRPC + notifies admin
 * 
 * Style: Orange background with green border
 */

export default function EmailCapturePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExitIntent, setIsExitIntent] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Dragging state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  const subscribeMutation = trpc.public.subscribe.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      localStorage.setItem("nlf_email_submitted", "true");
      localStorage.setItem("nlf_popup_closed", "permanent");
      toast.success(data.message);
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  // Set initial position to bottom-left when popup opens
  useEffect(() => {
    if (isOpen && !initialized) {
      const x = 24; // 24px from left
      const y = window.innerHeight - 320; // near bottom
      setPosition({ x, y });
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { ...position };
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      
      let newX = posStartRef.current.x + dx;
      let newY = posStartRef.current.y + dy;

      // Constrain to viewport
      const popupWidth = popupRef.current?.offsetWidth || 340;
      const popupHeight = popupRef.current?.offsetHeight || 300;
      newX = Math.max(0, Math.min(window.innerWidth - popupWidth, newX));
      newY = Math.max(0, Math.min(window.innerHeight - popupHeight, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Touch drag handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    posStartRef.current = { ...position };
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.x;
      const dy = touch.clientY - dragStartRef.current.y;
      
      let newX = posStartRef.current.x + dx;
      let newY = posStartRef.current.y + dy;

      const popupWidth = popupRef.current?.offsetWidth || 340;
      const popupHeight = popupRef.current?.offsetHeight || 300;
      newX = Math.max(0, Math.min(window.innerWidth - popupWidth, newX));
      newY = Math.max(0, Math.min(window.innerHeight - popupHeight, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    const hasClosedPopup = localStorage.getItem("nlf_popup_closed");
    const hasSubmitted = localStorage.getItem("nlf_email_submitted");

    if (hasSubmitted || hasClosedPopup === "permanent") {
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

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
    <div
      ref={popupRef}
      className="fixed z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: isDragging ? "none" : "auto",
      }}
    >
      <div className="relative w-80 rounded-xl shadow-2xl shadow-black/60 overflow-hidden border-2 border-green-500"
        style={{ backgroundColor: "#E87A1E" }}
      >
        {/* Draggable header bar */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="flex items-center justify-between px-4 py-2 cursor-grab active:cursor-grabbing border-b border-green-500/50"
          style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
        >
          <div className="flex items-center gap-2">
            <GripHorizontal className="w-4 h-4 text-green-300" />
            <span className="text-xs font-bold text-green-300 uppercase tracking-wider select-none">
              Drag to move
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-green-300 hover:text-white transition-colors p-0.5"
            aria-label="Close popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {submitted ? (
            /* Success state */
            <div className="py-2 text-center">
              <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">
                You're In!
              </h3>
              <p className="text-white/80 text-sm">
                Welcome to the NLF community! We'll keep you posted.
              </p>
            </div>
          ) : (
            /* Form state */
            <>
              {/* Header with icon */}
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 border border-green-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {isExitIntent ? "Wait — Stay in the Loop!" : "Stay in the Loop"}
                  </h3>
                  <p className="text-sm text-white/80 mt-0.5">
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
                  className="w-full px-3 py-2.5 bg-black/30 border-2 border-green-500 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300 transition-colors disabled:opacity-50"
                />
                
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending || !email.trim()}
                  className="w-full font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 border-2 border-green-500 text-white hover:brightness-110"
                  style={{ backgroundColor: "#1a7a2e" }}
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
              <p className="text-[11px] text-white/60 mt-3 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
