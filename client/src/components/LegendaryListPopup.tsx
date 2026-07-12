import { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import LegendaryListForm from "./LegendaryListForm";
import { useLocation } from "wouter";

/**
 * Legendary List Popup
 * 
 * Desktop: Slide-in box in bottom-right corner
 * Mobile: Bottom sheet that can be expanded/closed
 * 
 * Display rules:
 * - Triggers after 40s OR 50% scroll (whichever first)
 * - Once per 10 days per visitor
 * - Not after subscribe
 * - Not on cart/checkout/login/account pages
 * - Not while cookie consent is showing
 * - Session dismissal tracking
 */

const STORAGE_KEYS = {
  subscribed: "nlf-legendary-list-subscribed",
  lastShown: "nlf-legendary-list-last-shown",
  sessionDismissed: "nlf-legendary-list-session-dismissed",
};

const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

// Pages where popup should NOT show
const EXCLUDED_PATHS = ["/cart", "/checkout", "/login", "/account", "/matrix-portal"];

export default function LegendaryListPopup() {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const triggerFiredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [location] = useLocation();

  /**
   * Check if popup should be shown based on all display rules
   */
  const shouldShow = useCallback((): boolean => {
    // Already subscribed
    if (localStorage.getItem(STORAGE_KEYS.subscribed)) return false;

    // Session dismissed
    if (sessionStorage.getItem(STORAGE_KEYS.sessionDismissed)) return false;

    // Shown within last 10 days
    const lastShown = localStorage.getItem(STORAGE_KEYS.lastShown);
    if (lastShown && Date.now() - parseInt(lastShown, 10) < TEN_DAYS_MS) return false;

    // Excluded pages
    if (EXCLUDED_PATHS.some(path => location.startsWith(path))) return false;

    // Cookie consent still showing
    const cookieConsent = localStorage.getItem("nlf-cookie-consent");
    if (!cookieConsent) return false; // Cookie notice hasn't been dismissed yet

    return true;
  }, [location]);

  /**
   * Show the popup with animation
   */
  const showPopup = useCallback(() => {
    if (triggerFiredRef.current) return;
    if (!shouldShow()) return;

    triggerFiredRef.current = true;
    setVisible(true);
    localStorage.setItem(STORAGE_KEYS.lastShown, Date.now().toString());

    // Track view
    try {
      const key = `nlf-ll-popup-view-${new Date().toISOString().slice(0, 10)}`;
      const count = parseInt(localStorage.getItem(key) || "0", 10);
      localStorage.setItem(key, (count + 1).toString());
    } catch {}

    // Animate in after a frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimateIn(true);
      });
    });
  }, [shouldShow]);

  /**
   * Close the popup
   */
  const handleClose = () => {
    setAnimateIn(false);
    sessionStorage.setItem(STORAGE_KEYS.sessionDismissed, "true");

    // Track close
    try {
      const key = `nlf-ll-popup-close-${new Date().toISOString().slice(0, 10)}`;
      const count = parseInt(localStorage.getItem(key) || "0", 10);
      localStorage.setItem(key, (count + 1).toString());
    } catch {}

    setTimeout(() => setVisible(false), 300);
  };

  /**
   * Handle successful form submission
   */
  const handleSuccess = () => {
    // Keep showing success message for a moment, then hide
    setTimeout(() => {
      setAnimateIn(false);
      setTimeout(() => setVisible(false), 300);
    }, 4000);
  };

  /**
   * Setup triggers: 40s timer + 50% scroll
   */
  useEffect(() => {
    if (triggerFiredRef.current) return;
    if (!shouldShow()) return;

    // Timer trigger: 40 seconds
    timerRef.current = setTimeout(() => {
      showPopup();
    }, 40000);

    // Scroll trigger: 50% of page
    const handleScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrollPercent >= 0.5) {
        showPopup();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showPopup, shouldShow]);

  // Re-check on route change
  useEffect(() => {
    if (visible && EXCLUDED_PATHS.some(path => location.startsWith(path))) {
      setAnimateIn(false);
      setTimeout(() => setVisible(false), 300);
    }
  }, [location, visible]);

  if (!visible) return null;

  return (
    <>
      {/* ==================== DESKTOP: Slide-in bottom-right ==================== */}
      <div
        className={`
          hidden md:block fixed bottom-6 right-6 z-[9998]
          w-[380px] max-h-[calc(100vh-100px)] overflow-y-auto
          bg-card border border-border rounded-xl shadow-2xl shadow-black/40
          transition-all duration-300 ease-out
          ${animateIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
        `}
        role="dialog"
        aria-label="Join the Legendary List"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-5 py-3 flex items-center justify-between rounded-t-xl z-10">
          <h3
            className="text-lg font-bold"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            JOIN THE <span className="text-primary">LEGENDARY LIST</span>
          </h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close signup form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Get early access to premium drops, chase reveals, giveaways, live-show alerts, and collector-only offers.
          </p>
          <LegendaryListForm variant="popup" source="popup-slide-in" onSuccess={handleSuccess} />
        </div>
      </div>

      {/* ==================== MOBILE: Bottom sheet ==================== */}
      <div
        className={`
          md:hidden fixed bottom-0 left-0 right-0 z-[9998]
          transition-all duration-300 ease-out
          ${animateIn ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
        `}
        role="dialog"
        aria-label="Join the Legendary List"
      >
        {/* Collapsed state (teaser) */}
        {!mobileExpanded && (
          <div className="bg-card border-t border-border shadow-2xl shadow-black/60 px-4 py-3 safe-bottom">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ fontFamily: "'Anton', sans-serif" }}>
                  JOIN THE <span className="text-primary">LEGENDARY LIST</span>
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Early access to drops, giveaways & more
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setMobileExpanded(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold"
                >
                  Join
                </button>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expanded state (full form) */}
        {mobileExpanded && (
          <div className="bg-card border-t border-border shadow-2xl shadow-black/60 max-h-[85vh] overflow-y-auto safe-bottom">
            {/* Handle bar */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-muted rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 py-2 flex items-center justify-between">
              <h3
                className="text-lg font-bold"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                JOIN THE <span className="text-primary">LEGENDARY LIST</span>
              </h3>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label="Close signup form"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 pb-6">
              <p className="text-sm text-muted-foreground mb-4">
                Get early access to premium drops, chase reveals, giveaways, live-show alerts, and collector-only offers.
              </p>
              <LegendaryListForm variant="popup" source="popup-mobile-sheet" onSuccess={handleSuccess} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
