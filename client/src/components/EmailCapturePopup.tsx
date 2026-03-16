import { useEffect, useState, useRef, useCallback } from "react";
import { X, Loader2, CheckCircle, GripHorizontal } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Captain America Shield-Style Email Capture Popup
 * 
 * Design: Circular concentric rings like Captain America's shield.
 * - Outer ring: thick green border
 * - Middle ring: green nebula space background
 * - Inner ring: thick green border
 * - Center circle: NLF logo
 * Text: green with white fill (white text with green stroke/shadow)
 * Fully draggable.
 */

const NEBULA_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/shield-nebula-bg_11372b2d.png";
const NLF_LOGO = "/logo.png";

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

  // Set initial position to bottom-left
  useEffect(() => {
    if (isOpen && !initialized) {
      const x = 20;
      const y = window.innerHeight - 420;
      setPosition({ x, y });
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  // Mouse drag
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
      const size = 380;
      newX = Math.max(0, Math.min(window.innerWidth - size, newX));
      newY = Math.max(0, Math.min(window.innerHeight - size, newY));
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

  // Touch drag
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
      const size = 380;
      newX = Math.max(0, Math.min(window.innerWidth - size, newX));
      newY = Math.max(0, Math.min(window.innerHeight - size, newY));
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

  const SHIELD_SIZE = 380;

  return (
    <div
      ref={popupRef}
      className="fixed z-50 animate-in fade-in zoom-in-95 duration-500"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: isDragging ? "none" : "auto",
        width: SHIELD_SIZE,
        height: SHIELD_SIZE,
      }}
    >
      {/* === CAPTAIN AMERICA SHIELD STRUCTURE === */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden"
        style={{
          boxShadow: "0 0 40px rgba(34,197,94,0.4), 0 0 80px rgba(34,197,94,0.15), 0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        {/* OUTER RING — thick green border */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(135deg, #16a34a, #22c55e, #15803d, #22c55e)",
            padding: 0,
          }}
        />

        {/* FIRST SPACE RING — nebula background (between outer and middle green) */}
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            top: 12,
            left: 12,
            right: 12,
            bottom: 12,
          }}
        >
          <img
            src={NEBULA_BG}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.8)" }}
          />
        </div>

        {/* MIDDLE GREEN RING */}
        <div
          className="absolute rounded-full"
          style={{
            top: 55,
            left: 55,
            right: 55,
            bottom: 55,
            background: "linear-gradient(135deg, #16a34a, #22c55e, #15803d)",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.3), 0 0 15px rgba(34,197,94,0.3)",
          }}
        />

        {/* INNER SPACE RING — nebula background */}
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            top: 65,
            left: 65,
            right: 65,
            bottom: 65,
          }}
        >
          <img
            src={NEBULA_BG}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.7) saturate(1.2)" }}
          />
        </div>

        {/* INNER GREEN RING */}
        <div
          className="absolute rounded-full"
          style={{
            top: 108,
            left: 108,
            right: 108,
            bottom: 108,
            background: "linear-gradient(135deg, #16a34a, #22c55e, #15803d)",
            boxShadow: "inset 0 0 8px rgba(0,0,0,0.3), 0 0 12px rgba(34,197,94,0.3)",
          }}
        />

        {/* CENTER CIRCLE — NLF Logo */}
        <div
          className="absolute rounded-full overflow-hidden flex items-center justify-center"
          style={{
            top: 118,
            left: 118,
            right: 118,
            bottom: 118,
            background: "radial-gradient(circle, #0a1a0a 0%, #0d2818 50%, #061210 100%)",
          }}
        >
          <img
            src={NLF_LOGO}
            alt="NLF"
            className="w-full h-full object-contain p-2"
            style={{ filter: "drop-shadow(0 0 8px rgba(34,197,94,0.5))" }}
          />
        </div>

        {/* === CONTENT OVERLAY === */}
        {/* Drag handle at top */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center gap-1 cursor-grab active:cursor-grabbing"
          style={{ height: 50, borderRadius: "50% 50% 0 0" }}
        >
          <GripHorizontal className="w-3 h-3 text-white/60" />
          <span className="text-[8px] font-bold text-white/60 uppercase tracking-widest select-none">
            Drag
          </span>
          <GripHorizontal className="w-3 h-3 text-white/60" />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-12 z-20 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all"
          aria-label="Close popup"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Text content in the first space ring area */}
        <div className="absolute z-10 flex flex-col items-center" style={{ top: 16, left: 20, right: 20 }}>
          {/* Title in the top arc area */}
          <h3
            className="text-center font-black leading-none mt-1"
            style={{
              fontSize: "13px",
              color: "#ffffff",
              WebkitTextStroke: "1px #22c55e",
              textShadow: "0 0 8px rgba(34,197,94,0.6), 0 2px 4px rgba(0,0,0,0.5)",
              fontFamily: "'Anton', sans-serif",
              letterSpacing: "0.15em",
            }}
          >
            {isExitIntent ? "WAIT! DON'T GO!" : "STAY IN THE LOOP"}
          </h3>
        </div>

        {/* Bottom content area — email form in the lower space ring */}
        {submitted ? (
          <div className="absolute z-10 flex flex-col items-center" style={{ bottom: 20, left: 30, right: 30 }}>
            <CheckCircle className="w-8 h-8 text-green-400 mb-1" />
            <p
              className="text-center font-black text-sm"
              style={{
                color: "#ffffff",
                WebkitTextStroke: "0.5px #22c55e",
                textShadow: "0 0 6px rgba(34,197,94,0.5)",
              }}
            >
              YOU'RE IN!
            </p>
          </div>
        ) : (
          <div className="absolute z-10 flex flex-col items-center" style={{ bottom: 14, left: 40, right: 40 }}>
            <p
              className="text-center mb-2 leading-tight"
              style={{
                fontSize: "9px",
                color: "#ffffff",
                textShadow: "0 0 4px rgba(34,197,94,0.4), 0 1px 2px rgba(0,0,0,0.6)",
                fontWeight: 600,
              }}
            >
              {isExitIntent
                ? "Get notified on new drops!"
                : "Join for launch updates & exclusive drops"
              }
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-1.5" style={{ maxWidth: 200 }}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribeMutation.isPending}
                className="w-full px-2.5 py-1.5 rounded-full text-[11px] text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors disabled:opacity-50"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "2px solid #22c55e",
                  backdropFilter: "blur(4px)",
                }}
              />
              
              <button
                type="submit"
                disabled={subscribeMutation.isPending || !email.trim()}
                className="w-full font-bold py-1.5 rounded-full transition-all disabled:opacity-50 text-[11px] hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #22c55e)",
                  color: "#ffffff",
                  border: "2px solid #15803d",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  boxShadow: "0 0 12px rgba(34,197,94,0.3)",
                }}
              >
                {subscribeMutation.isPending ? (
                  <span className="flex items-center justify-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Joining...
                  </span>
                ) : (
                  "SUBSCRIBE"
                )}
              </button>
            </form>

            <p
              className="text-center mt-0.5"
              style={{
                fontSize: "7px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              We respect your privacy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
