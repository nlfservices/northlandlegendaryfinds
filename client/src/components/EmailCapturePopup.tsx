import { useEffect, useState, useRef, useCallback } from "react";
import { X, Loader2, CheckCircle, Mail, GripHorizontal } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Shield-Shaped Email Capture Popup — Draggable, Bottom-Left Default
 * 
 * Design: Medieval/fantasy shield silhouette inspired by the NLF dragon shield logo.
 * Uses an SVG-based shield shape with green border and orange fill.
 * Fully draggable via the top grip area.
 */

// Shield SVG path — classic pointed-bottom heraldic shield
const SHIELD_PATH = "M 10,2 C 10,2 50,0 150,0 C 250,0 290,2 290,2 C 292,2 298,4 298,12 L 298,160 C 298,200 260,260 150,310 C 40,260 2,200 2,160 L 2,12 C 2,4 8,2 10,2 Z";

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
      const x = 20;
      const y = window.innerHeight - 440;
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
      const popupWidth = popupRef.current?.offsetWidth || 320;
      const popupHeight = popupRef.current?.offsetHeight || 420;
      newX = Math.max(0, Math.min(window.innerWidth - popupWidth, newX));
      newY = Math.max(0, Math.min(window.innerHeight - popupHeight, newY));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Touch drag handlers
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
      const popupWidth = popupRef.current?.offsetWidth || 320;
      const popupHeight = popupRef.current?.offsetHeight || 420;
      newX = Math.max(0, Math.min(window.innerWidth - popupWidth, newX));
      newY = Math.max(0, Math.min(window.innerHeight - popupHeight, newY));
      setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => setIsDragging(false);

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

    if (hasSubmitted || hasClosedPopup === "permanent") return;

    const timer = setTimeout(() => setIsOpen(true), 2000);

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
        width: 300,
      }}
    >
      {/* Shield container */}
      <div className="relative" style={{ width: 300, height: 420 }}>
        {/* SVG Shield Background */}
        <svg
          viewBox="0 0 300 315"
          className="absolute inset-0 w-full"
          style={{ height: 420, filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}
          preserveAspectRatio="none"
        >
          {/* Outer glow */}
          <defs>
            <filter id="shield-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Green border (thicker stroke) */}
          <path
            d={SHIELD_PATH}
            fill="none"
            stroke="#22c55e"
            strokeWidth="5"
            filter="url(#shield-glow)"
          />
          {/* Orange fill */}
          <path
            d={SHIELD_PATH}
            fill="#E87A1E"
            stroke="#22c55e"
            strokeWidth="3"
          />
        </svg>

        {/* Draggable grip area at top of shield */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center gap-2 cursor-grab active:cursor-grabbing pt-3 pb-1"
          style={{ height: 40 }}
        >
          <GripHorizontal className="w-4 h-4 text-green-300/80" />
          <span className="text-[10px] font-bold text-green-300/80 uppercase tracking-widest select-none">
            Drag
          </span>
          <GripHorizontal className="w-4 h-4 text-green-300/80" />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-6 z-20 text-green-300/70 hover:text-white transition-colors"
          aria-label="Close popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content overlay — positioned inside the shield */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-10 pt-10 pb-16">
          {submitted ? (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">You're In!</h3>
              <p className="text-white/80 text-sm">
                Welcome to the NLF community!
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center w-full">
              {/* Shield emblem / mail icon */}
              <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-3">
                <Mail className="w-6 h-6 text-green-300" />
              </div>

              {/* Title */}
              <h3
                className="text-lg font-bold text-white mb-1 leading-tight"
                style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.05em" }}
              >
                {isExitIntent ? "WAIT!" : "STAY IN"}
              </h3>
              <h3
                className="text-lg font-bold text-white mb-2 leading-tight"
                style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "0.05em" }}
              >
                {isExitIntent ? "STAY IN THE LOOP!" : "THE LOOP"}
              </h3>

              <p className="text-xs text-white/80 mb-4 leading-relaxed max-w-[180px]">
                {isExitIntent
                  ? "Get notified when we drop new products!"
                  : "Join our collectors community for launch updates & exclusive drops."
                }
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-2.5 max-w-[200px]">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribeMutation.isPending}
                  className="w-full px-3 py-2 bg-black/30 border-2 border-green-500 rounded-lg text-white text-xs placeholder-white/50 focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300 transition-colors disabled:opacity-50"
                />
                
                <button
                  type="submit"
                  disabled={subscribeMutation.isPending || !email.trim()}
                  className="w-full font-bold py-2 rounded-lg transition-all disabled:opacity-50 border-2 border-green-500 text-white text-sm hover:brightness-110"
                  style={{ backgroundColor: "#1a7a2e" }}
                >
                  {subscribeMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Subscribing...
                    </span>
                  ) : (
                    "SUBSCRIBE"
                  )}
                </button>
              </form>

              <p className="text-[9px] text-white/50 mt-2">
                We respect your privacy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
