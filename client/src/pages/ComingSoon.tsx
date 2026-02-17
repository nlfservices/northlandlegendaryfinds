import { useEffect, useState, FormEvent } from "react";

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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("https://api.leadconnectorhq.com/widget/form/5SL68SbkAFgq85FPiJw6", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          email: formData.email,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ firstName: "", lastName: "", phone: "", email: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Target date: Friday, March 13th, 2026 at 7:00 PM Central Time
    // Central Time is UTC-6 (CST) or UTC-5 (CDT)
    // March 13, 2026 will be in CDT (Daylight Saving Time)
    // 7:00 PM CDT = 8:00 PM EDT = 12:00 AM UTC (next day)
    const targetDate = new Date("2026-03-14T00:00:00Z"); // March 14 midnight UTC = March 13 7pm Central

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
      {/* 3D Comets - Marvel (Left) */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`marvel-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${Math.random() * 30}%`,
            top: `${Math.random() * 100}%`,
            animation: `cometLeft ${3 + Math.random() * 2}s ease-in infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        >
          <div className="relative">
            {/* Comet head */}
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 shadow-[0_0_20px_rgba(255,0,0,0.8)]" />
            {/* Comet trail */}
            <div className="absolute top-1/2 left-full w-32 h-1 -translate-y-1/2 bg-gradient-to-r from-red-500/80 via-yellow-500/40 to-transparent blur-sm" />
          </div>
        </div>
      ))}

      {/* 3D Comets - Star Wars (Right) */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`starwars-${i}`}
          className="absolute pointer-events-none"
          style={{
            right: `${Math.random() * 30}%`,
            top: `${Math.random() * 100}%`,
            animation: `cometRight ${3 + Math.random() * 2}s ease-in infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        >
          <div className="relative">
            {/* Comet head */}
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-white shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
            {/* Comet trail */}
            <div className="absolute top-1/2 right-full w-32 h-1 -translate-y-1/2 bg-gradient-to-l from-blue-400/80 via-white/40 to-transparent blur-sm" />
          </div>
        </div>
      ))}
      {/* Distant Planets */}
      {/* Large purple planet - top left */}
      <div className="absolute top-[5%] left-[8%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-purple-600/30 to-purple-900/20 blur-sm opacity-40 animate-pulse" style={{ animationDuration: '8s' }} />
      
      {/* Medium blue planet with ring - top right */}
      <div className="absolute top-[15%] right-[12%] pointer-events-none">
        <div className="relative w-24 h-24 md:w-36 md:h-36">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-blue-700/20 blur-sm opacity-50" />
          {/* Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-12 md:w-56 md:h-16 rounded-full border-2 border-blue-300/20 rotate-[25deg] blur-[1px]" />
        </div>
      </div>
      
      {/* Small red planet - bottom left */}
      <div className="absolute bottom-[20%] left-[15%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-red-500/25 to-red-900/15 blur-sm opacity-35 animate-pulse" style={{ animationDuration: '6s' }} />
      
      {/* Tiny distant planet - middle right */}
      <div className="absolute top-[45%] right-[20%] w-12 h-12 rounded-full bg-gradient-to-br from-teal-400/20 to-teal-700/10 blur-sm opacity-30" />
      
      {/* Large gas giant - bottom right (partial view) */}
      <div className="absolute bottom-[-10%] right-[-5%] w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-orange-600/20 to-yellow-700/15 blur-md opacity-25" />

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

        {/* Email Capture */}
        <div className="max-w-md mx-auto">
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 font-oswald">
            Get notified when we launch + receive exclusive early access
          </p>
          
          {/* Custom Styled Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="px-4 py-2.5 bg-black/70 border border-[#00FF41]/30 rounded-lg text-[#00FF41] placeholder-gray-600 focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all text-sm"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="px-4 py-2.5 bg-black/70 border border-[#00FF41]/30 rounded-lg text-[#00FF41] placeholder-gray-600 focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all text-sm"
              />
            </div>
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/70 border border-[#00FF41]/30 rounded-lg text-[#00FF41] placeholder-gray-600 focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all text-sm"
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-black/70 border border-[#00FF41]/30 rounded-lg text-[#00FF41] placeholder-gray-600 focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-all text-sm"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#00FF41] to-green-500 text-black font-oswald font-bold rounded-lg hover:from-green-500 hover:to-[#00FF41] transition-all duration-300 shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? "SUBMITTING..." : "GET EARLY ACCESS"}
            </button>
            {submitStatus === "success" && (
              <p className="text-[#00FF41] text-sm text-center font-oswald">✓ You're on the list! Check your email.</p>
            )}
            {submitStatus === "error" && (
              <p className="text-red-400 text-sm text-center font-oswald">Something went wrong. Please try again.</p>
            )}
            <p className="text-xs text-gray-600 text-center">
              We'll never share your email. Unsubscribe anytime.
            </p>
          </form>
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
