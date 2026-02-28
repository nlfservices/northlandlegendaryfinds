import { useState, useEffect, useRef } from "react";
import { trackLead } from "@/lib/fbPixel";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Inject dark theme CSS into the GHL iframe once it loads
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const injectStyles = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        const style = iframeDoc.createElement("style");
        style.textContent = `
          body, .hl_wrapper, form, .fb-form {
            background: transparent !important;
            color: #00FF41 !important;
            font-family: 'Oswald', sans-serif !important;
          }
          label, .form-label, .hl_form-label {
            color: #00FF41 !important;
            font-size: 12px !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
          }
          input, select, textarea, .hl_input, .form-control {
            background: rgba(0,0,0,0.7) !important;
            border: 1px solid rgba(0,255,65,0.3) !important;
            border-radius: 8px !important;
            color: #00FF41 !important;
            padding: 10px 16px !important;
            font-size: 14px !important;
          }
          input:focus, select:focus, textarea:focus {
            border-color: #00FF41 !important;
            box-shadow: 0 0 10px rgba(0,255,65,0.3) !important;
            outline: none !important;
          }
          input::placeholder, textarea::placeholder {
            color: #555 !important;
          }
          button[type="submit"], .hl_cta_btn, .btn-primary, .submit-button {
            background: linear-gradient(to right, #00FF41, #22c55e) !important;
            color: #000 !important;
            font-weight: 700 !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 24px !important;
            font-size: 14px !important;
            text-transform: uppercase !important;
            letter-spacing: 2px !important;
            cursor: pointer !important;
            box-shadow: 0 0 20px rgba(0,255,65,0.3) !important;
          }
          button[type="submit"]:hover, .hl_cta_btn:hover, .btn-primary:hover {
            box-shadow: 0 0 30px rgba(0,255,65,0.5) !important;
          }
          .hl_form-group, .form-group {
            margin-bottom: 12px !important;
          }
          /* Hide consent checkboxes text styling */
          .hl_form-check-label, .form-check-label {
            color: #888 !important;
            font-size: 10px !important;
          }
          a {
            color: #a855f7 !important;
          }
          /* Required asterisk */
          .text-danger, .required {
            color: #00FF41 !important;
          }
          /* Privacy links */
          .hl-text-center a, .text-center a {
            color: #a855f7 !important;
            font-size: 11px !important;
          }
        `;
        iframeDoc.head.appendChild(style);

        // Also add Oswald font
        const fontLink = iframeDoc.createElement("link");
        fontLink.href = "https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap";
        fontLink.rel = "stylesheet";
        iframeDoc.head.appendChild(fontLink);

        // Track form submission via message event
        // GHL forms redirect after submission, so we detect URL change
      } catch (e) {
        // Cross-origin restriction - can't inject CSS
        // The iframe will show with default GHL styling
        console.log("Could not inject styles into GHL iframe (cross-origin)");
      }
    };

    iframe.addEventListener("load", injectStyles);
    return () => iframe.removeEventListener("load", injectStyles);
  }, []);

  // Listen for form submission events from GHL
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // GHL sends a message when form is submitted
      if (event.data && (event.data.type === "form-submitted" || event.data === "form_submitted")) {
        trackLead('Early Access Signup', 'Coming Soon');
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    // Target date: Friday, March 13th, 2026 at 7:00 PM Central Time
    // March is in CDT (UTC-5), so 7pm CDT = midnight UTC March 14
    const targetDate = new Date("2026-03-14T00:00:00Z");

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent"></div>
      
      {/* Animated stars */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="mb-8 sm:mb-12">
          <img
            src="/mylar-bags/origin.png"
            alt="Northland Legendary Finds"
            className="w-48 sm:w-64 md:w-80 h-auto mx-auto drop-shadow-[0_0_30px_rgba(0,255,65,0.3)]"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bebas text-white mb-4 tracking-wider">
          SOMETHING <span className="text-[#00FF41]">LEGENDARY</span>
        </h1>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bebas text-white mb-6 tracking-wider">
          IS <span className="text-purple-500">COMING</span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 sm:mb-16 font-oswald">
          Marvel & Star Wars Trading Card Repacks
        </p>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-8 mb-12 sm:mb-16 max-w-3xl mx-auto">
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HOURS", value: timeLeft.hours },
            { label: "MINUTES", value: timeLeft.minutes },
            { label: "SECONDS", value: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-gradient-to-br from-purple-900/40 to-black border border-[#00FF41]/30 rounded-lg p-4 sm:p-6 md:p-8 backdrop-blur-sm"
            >
              <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bebas text-[#00FF41] mb-2 drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="text-xs sm:text-sm md:text-base font-oswald text-gray-400 tracking-widest">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Launch Date */}
        <div className="mb-12 sm:mb-16">
          <p className="text-xl sm:text-2xl md:text-3xl font-bebas text-white mb-2">
            LAUNCHING
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bebas text-[#00FF41] tracking-wider">
            FRIDAY, MARCH 13TH, 2026
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-oswald text-purple-400 mt-2">
            7:00 PM CENTRAL TIME
          </p>
        </div>

        {/* Email Capture - GHL Iframe Embed */}
        <div className="max-w-md mx-auto">
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 font-oswald">
            Get notified when we launch + receive exclusive early access
          </p>
          
          {/* GHL Form Embed - Actual iframe for reliable submission */}
          <div className="rounded-xl overflow-hidden border border-[#00FF41]/20 bg-black/50 backdrop-blur-sm">
            <iframe
              ref={iframeRef}
              src="https://api.leadconnectorhq.com/widget/form/5SL68SbkAFgq85FPiJw6"
              style={{ width: "100%", height: "500px", border: "none" }}
              id="inline-5SL68SbkAFgq85FPiJw6"
              data-layout='{"id":"INLINE"}'
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Form 0"
              data-height="500"
              data-layout-iframe-id="inline-5SL68SbkAFgq85FPiJw6"
              data-form-id="5SL68SbkAFgq85FPiJw6"
              title="Early Access Signup"
            ></iframe>
          </div>
          
          <p className="text-xs text-gray-600 text-center mt-3">
            We'll never share your email. Unsubscribe anytime.
          </p>
        </div>

        {/* Social Proof */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-purple-500/20">
          <p className="text-sm sm:text-base text-gray-400 font-oswald">
            Premium Topps Chrome Marvel & Star Wars Cards
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Professionally curated repacks • Transparent odds • Collector-focused
          </p>
        </div>
      </div>
    </div>
  );
}
