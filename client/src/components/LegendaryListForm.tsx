import { useState, useRef } from "react";
import { ArrowRight, Loader2, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";

/**
 * GHL Form ID for hidden iframe dual-capture
 */
const GHL_FORM_URL = "https://api.leadconnectorhq.com/widget/form/5SL68SbkAFgq85FPiJw6";

type LegendaryListVariant = "popup" | "section" | "footer" | "article-end";

interface LegendaryListFormProps {
  variant?: LegendaryListVariant;
  source?: string;
  /** Callback when form is successfully submitted */
  onSuccess?: () => void;
}

/**
 * Legendary List Signup Form
 * 
 * Fields: First Name (required), Email (required), Phone (optional), SMS consent checkbox
 * Integrates with GHL CRM via tRPC + hidden iframe backup
 * Tracks consent status, source page, and submission metadata
 */
export default function LegendaryListForm({
  variant = "section",
  source,
  onSuccess,
}: LegendaryListFormProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [smsOptedIn, setSmsOptedIn] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: string; email?: string; phone?: string }>({});
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Honeypot field for spam protection
  const [honeypot, setHoneypot] = useState("");

  const defaultSource = source || `${variant}-legendary-list`;

  const subscribeMutation = trpc.public.subscribe.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setSmsOptedIn(smsConsent);
      // Mark as subscribed in localStorage
      localStorage.setItem("nlf-legendary-list-subscribed", "true");
      localStorage.setItem("nlf-legendary-list-date", Date.now().toString());
      // Fire Facebook Pixel Lead event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: "Legendary List Signup",
          content_category: source || defaultSource,
        });
      }
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  /**
   * Submit to GHL hidden iframe as backup capture
   */
  const submitToGHLIframe = (emailVal: string, firstNameVal: string, phoneVal?: string) => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const tempForm = document.createElement("form");
      tempForm.method = "POST";
      tempForm.action = GHL_FORM_URL;
      tempForm.target = `ghl-legendary-${variant}-iframe`;
      tempForm.style.display = "none";

      const emailInput = document.createElement("input");
      emailInput.type = "hidden";
      emailInput.name = "email";
      emailInput.value = emailVal;
      tempForm.appendChild(emailInput);

      if (firstNameVal) {
        const nameInput = document.createElement("input");
        nameInput.type = "hidden";
        nameInput.name = "first_name";
        nameInput.value = firstNameVal;
        tempForm.appendChild(nameInput);
      }

      if (phoneVal) {
        const phoneInput = document.createElement("input");
        phoneInput.type = "hidden";
        phoneInput.name = "phone";
        phoneInput.value = phoneVal;
        tempForm.appendChild(phoneInput);
      }

      const formIdInput = document.createElement("input");
      formIdInput.type = "hidden";
      formIdInput.name = "formId";
      formIdInput.value = "5SL68SbkAFgq85FPiJw6";
      tempForm.appendChild(formIdInput);

      const locationInput = document.createElement("input");
      locationInput.type = "hidden";
      locationInput.name = "locationId";
      locationInput.value = "KFJlOhDocOFLVA5rLqVh";
      tempForm.appendChild(locationInput);

      document.body.appendChild(tempForm);
      tempForm.submit();
      setTimeout(() => document.body.removeChild(tempForm), 2000);
    } catch (err) {
      console.warn("[LegendaryList] GHL iframe submit failed:", err);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { firstName?: string; email?: string; phone?: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Only validate phone if entered
    if (phone.trim()) {
      const phoneClean = phone.replace(/[\s\-\(\)\.]/g, "");
      if (phoneClean.length < 10 || !/^\+?\d{10,15}$/.test(phoneClean)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    // If SMS consent is checked but no phone number
    if (smsConsent && !phone.trim()) {
      newErrors.phone = "Phone number is required for text alerts";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honeypot) return;

    if (!validateForm()) return;
    if (subscribeMutation.isPending) return;

    const emailVal = email.trim().toLowerCase();
    const firstNameVal = firstName.trim();
    const phoneVal = phone.trim() || undefined;

    // Track form submission event
    trackEvent("form_submit");

    // Primary: tRPC mutation → GHL API
    subscribeMutation.mutate({
      email: emailVal,
      firstName: firstNameVal,
      phone: phoneVal,
      preferredContact: smsConsent ? "both" : "email",
      source: source || defaultSource,
    });

    // Backup: Submit to GHL hidden iframe
    submitToGHLIframe(emailVal, firstNameVal, phoneVal);
  };

  /** Track form analytics events */
  const trackEvent = (event: string) => {
    try {
      const key = `nlf-ll-${event}-${new Date().toISOString().slice(0, 10)}`;
      const count = parseInt(localStorage.getItem(key) || "0", 10);
      localStorage.setItem(key, (count + 1).toString());
    } catch {}
  };

  // ==================== SUCCESS STATE ====================
  if (submitted) {
    const isCompact = variant === "popup" || variant === "footer";
    return (
      <div className={`flex flex-col items-center gap-3 ${isCompact ? "py-4" : "py-6"}`}>
        <CheckCircle2 className={`text-primary ${isCompact ? "w-10 h-10" : "w-14 h-14"}`} />
        <p className={`font-bold text-primary ${isCompact ? "text-base" : "text-xl"}`}>
          You're on the Legendary List.
        </p>
        <p className={`text-muted-foreground text-center ${isCompact ? "text-xs" : "text-sm"}`}>
          Watch your inbox for new drops, chase reveals, giveaways, and collector-only updates.
        </p>
        {smsOptedIn && (
          <div className="flex items-center gap-2 mt-1">
            <MessageSquare className="w-4 h-4 text-primary" />
            <p className={`text-primary font-medium ${isCompact ? "text-xs" : "text-sm"}`}>
              VIP text alerts are now active.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ==================== FORM FIELDS (shared) ====================
  const inputBaseClass = "w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";
  const inputErrorClass = "border-red-500 focus:ring-red-500/50 focus:border-red-500";
  const labelClass = "block text-xs font-medium text-muted-foreground mb-1.5";
  const errorClass = "text-xs text-red-400 mt-1";

  const formFields = (
    <>
      {/* Honeypot - hidden from users */}
      <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
        <input
          type="text"
          name="website_url"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* First Name */}
      <div>
        <label htmlFor={`ll-firstname-${variant}`} className={labelClass}>First Name *</label>
        <input
          id={`ll-firstname-${variant}`}
          type="text"
          placeholder="Your first name"
          value={firstName}
          onChange={(e) => { setFirstName(e.target.value); if (errors.firstName) setErrors(prev => ({ ...prev, firstName: undefined })); }}
          required
          className={`${inputBaseClass} ${errors.firstName ? inputErrorClass : ""}`}
          autoComplete="given-name"
        />
        {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor={`ll-email-${variant}`} className={labelClass}>Email Address *</label>
        <input
          id={`ll-email-${variant}`}
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: undefined })); }}
          required
          className={`${inputBaseClass} ${errors.email ? inputErrorClass : ""}`}
          autoComplete="email"
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      {/* Phone (optional) */}
      <div>
        <label htmlFor={`ll-phone-${variant}`} className={labelClass}>Mobile Number <span className="text-muted-foreground/60">— Optional</span></label>
        <input
          id={`ll-phone-${variant}`}
          type="tel"
          placeholder="(555) 123-4567"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined })); }}
          className={`${inputBaseClass} ${errors.phone ? inputErrorClass : ""}`}
          autoComplete="tel"
        />
        {errors.phone && <p className={errorClass}>{errors.phone}</p>}
      </div>

      {/* SMS Consent Checkbox */}
      <div className="flex items-start gap-3 pt-1">
        <input
          id={`ll-sms-${variant}`}
          type="checkbox"
          checked={smsConsent}
          onChange={(e) => setSmsConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary/50 accent-primary cursor-pointer flex-shrink-0"
        />
        <label htmlFor={`ll-sms-${variant}`} className="text-sm text-muted-foreground cursor-pointer leading-snug">
          Send me VIP text alerts about new drops, live shows, giveaways, and special offers.
        </label>
      </div>
    </>
  );

  const submitButton = (
    <Button
      type="submit"
      size="lg"
      disabled={subscribeMutation.isPending}
      className="w-full bg-primary hover:bg-primary/90 font-bold text-base py-3.5 shadow-lg shadow-primary/20 tracking-wide"
    >
      {subscribeMutation.isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          JOIN THE LEGENDARY LIST
          <ArrowRight className="w-5 h-5 ml-2" />
        </>
      )}
    </Button>
  );

  const disclaimer = (
    <p className="text-[11px] text-muted-foreground/70 leading-relaxed mt-3">
      By submitting this form, you agree to receive email updates from Northland Legendary Finds.
      If you opt in to text messages, you agree to receive recurring automated marketing texts.
      Consent is not a condition of purchase. Message and data rates may apply. Reply STOP to unsubscribe.{" "}
      <Link href="/privacy" className="text-primary/80 hover:text-primary underline">Privacy Policy</Link>
      {" "}&{" "}
      <Link href="/terms" className="text-primary/80 hover:text-primary underline">Terms</Link>.
    </p>
  );

  const hiddenIframe = (
    <iframe
      ref={iframeRef}
      name={`ghl-legendary-${variant}-iframe`}
      style={{ display: "none" }}
      title="Signup form"
      aria-hidden="true"
    />
  );

  // ==================== POPUP VARIANT (compact) ====================
  if (variant === "popup") {
    return (
      <>
        {hiddenIframe}
        <form onSubmit={handleSubmit} className="space-y-3 relative">
          {formFields}
          {submitButton}
          {disclaimer}
        </form>
      </>
    );
  }

  // ==================== SECTION VARIANT (full-width, above footer) ====================
  if (variant === "section") {
    return (
      <>
        {hiddenIframe}
        <section className="relative py-16 lg:py-20 overflow-hidden">
          {/* NLF Green Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-950 via-green-950/95 to-green-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-800/15 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

          <div className="container max-w-md text-center relative z-10">
            <h2
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              JOIN THE <span className="text-primary">LEGENDARY LIST</span>
            </h2>
            <p className="text-muted-foreground text-base mb-8">
              Get early access to premium drops, chase reveals, giveaways, live-show alerts, and collector-only offers.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 text-left relative">
              {formFields}
              <div className="pt-2">
                {submitButton}
              </div>
              {disclaimer}
            </form>
          </div>
        </section>
      </>
    );
  }

  // ==================== FOOTER VARIANT (compact card) ====================
  if (variant === "footer") {
    return (
      <>
        {hiddenIframe}
        <div className="w-full">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
            Join the Legendary List
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Early access to drops, chase reveals & collector-only offers.
          </p>
          <form onSubmit={handleSubmit} className="space-y-2 relative">
            {/* Honeypot */}
            <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
              <input type="text" name="website_url" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary"
              autoComplete="given-name"
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary"
              autoComplete="email"
            />
            <Button
              type="submit"
              size="sm"
              disabled={subscribeMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 font-bold text-xs"
            >
              {subscribeMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "JOIN THE LIST"
              )}
            </Button>
            <p className="text-[9px] text-muted-foreground/60 leading-tight">
              No spam. Unsubscribe anytime.{" "}
              <Link href="/privacy" className="underline">Privacy</Link>
            </p>
          </form>
        </div>
      </>
    );
  }

  // ==================== ARTICLE-END VARIANT ====================
  return (
    <>
      {hiddenIframe}
      <div className="bg-card/50 border border-border rounded-xl p-6 md:p-8 mt-12">
        <div className="max-w-md mx-auto text-center">
          <h3
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            JOIN THE <span className="text-primary">LEGENDARY LIST</span>
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Get early access to premium drops, chase reveals, giveaways, live-show alerts, and collector-only offers.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 text-left relative">
            {formFields}
            <div className="pt-2">
              {submitButton}
            </div>
            {disclaimer}
          </form>
        </div>
      </div>
    </>
  );
}
