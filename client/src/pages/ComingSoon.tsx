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

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const hiddenIframeRef = useRef<HTMLIFrameElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubmitError("Email is required");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Submit via hidden form to GHL
      const formData = new URLSearchParams();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("formId", "5SL68SbkAFgq85FPiJw6");
      formData.append("location_id", "KFJlOhDocOFLVA5rLqVh");

      // Method 1: Submit via hidden iframe to avoid CORS
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://backend.leadconnectorhq.com/forms/submit";
      form.target = "ghl-hidden-frame";
      form.style.display = "none";

      // Add all fields
      const fields = {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        email: email,
        formId: "5SL68SbkAFgq85FPiJw6",
        location_id: "KFJlOhDocOFLVA5rLqVh",
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      // Track with Facebook Pixel
      trackLead("Early Access Signup", "Coming Soon");

      // Show success after brief delay
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1500);
    } catch (error) {
      console.error("Form submission error:", error);
      setIsSubmitting(false);
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Hidden iframe for GHL form submission */}
      <iframe
        ref={hiddenIframeRef}
        name="ghl-hidden-frame"
        style={{ display: "none" }}
        title="Form submission target"
      />

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

        {/* Custom Email Capture Form */}
        <div className="max-w-lg mx-auto">
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 font-oswald">
            Get notified when we launch + receive exclusive early access
          </p>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* First Name & Last Name - side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-left text-[#00FF41]/70 text-[10px] uppercase tracking-[2px] font-oswald mb-1 ml-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full bg-black/70 border border-[#00FF41]/25 rounded-lg px-4 py-2.5 text-[#00FF41] text-sm font-oswald placeholder-gray-600 focus:border-[#00FF41]/70 focus:shadow-[0_0_12px_rgba(0,255,65,0.2)] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-left text-[#00FF41]/70 text-[10px] uppercase tracking-[2px] font-oswald mb-1 ml-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full bg-black/70 border border-[#00FF41]/25 rounded-lg px-4 py-2.5 text-[#00FF41] text-sm font-oswald placeholder-gray-600 focus:border-[#00FF41]/70 focus:shadow-[0_0_12px_rgba(0,255,65,0.2)] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-left text-[#00FF41]/70 text-[10px] uppercase tracking-[2px] font-oswald mb-1 ml-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full bg-black/70 border border-[#00FF41]/25 rounded-lg px-4 py-2.5 text-[#00FF41] text-sm font-oswald placeholder-gray-600 focus:border-[#00FF41]/70 focus:shadow-[0_0_12px_rgba(0,255,65,0.2)] focus:outline-none transition-all"
                />
              </div>

              {/* Email - Required */}
              <div>
                <label className="block text-left text-[#00FF41]/70 text-[10px] uppercase tracking-[2px] font-oswald mb-1 ml-1">
                  Email <span className="text-[#00FF41]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-black/70 border border-[#00FF41]/25 rounded-lg px-4 py-2.5 text-[#00FF41] text-sm font-oswald placeholder-gray-600 focus:border-[#00FF41]/70 focus:shadow-[0_0_12px_rgba(0,255,65,0.2)] focus:outline-none transition-all"
                />
              </div>

              {/* Error message */}
              {submitError && (
                <p className="text-red-400 text-xs text-center font-oswald">{submitError}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#00FF41] to-emerald-500 text-black font-bold py-3 px-6 rounded-lg text-sm uppercase tracking-[3px] font-oswald hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "🚀 Get Early Access"
                )}
              </button>
            </form>
          ) : (
            <div className="bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-[#00FF41] text-xl font-bebas tracking-wider mb-2">
                YOU'RE ON THE LIST!
              </h3>
              <p className="text-gray-300 text-sm font-oswald">
                We'll notify you when we launch. Get ready for something legendary.
              </p>
            </div>
          )}
          
          <p className="text-xs text-gray-600 text-center mt-3 font-oswald">
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
