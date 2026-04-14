import { useState, useRef, useEffect } from "react";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * GHL Form ID for hidden iframe dual-capture
 */
const GHL_FORM_URL = "https://api.leadconnectorhq.com/widget/form/5SL68SbkAFgq85FPiJw6";

type NewsletterVariant = "section" | "footer" | "sidebar";

interface NewsletterSignupProps {
  variant?: NewsletterVariant;
  source?: string;
  /** Override headline */
  headline?: string;
  /** Override subtext */
  subtext?: string;
}

/**
 * Reusable Newsletter Signup Component with GHL hidden iframe dual-capture
 * 
 * Three variants:
 * - "section": Full-width homepage section with large heading
 * - "footer": Compact inline form for the footer
 * - "sidebar": Card-style widget for product/content pages
 * 
 * Dual capture:
 * 1. tRPC mutation → GHL API + admin notification (primary)
 * 2. Hidden iframe POST → GHL form (backup/redundancy)
 */
export default function NewsletterSignup({
  variant = "section",
  source,
  headline,
  subtext,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const defaultSource = variant === "footer"
    ? "footer-newsletter"
    : variant === "sidebar"
    ? "sidebar-newsletter"
    : "homepage-newsletter";

  const subscribeMutation = trpc.public.subscribe.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      toast.success(data.message);
      // Fire Facebook Pixel Lead event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: "Newsletter Signup",
          content_category: source || defaultSource,
        });
      }
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  /**
   * Submit to GHL hidden iframe as backup capture
   * Creates a hidden form targeting the iframe and POSTs the data
   */
  const submitToGHLIframe = (emailVal: string, firstNameVal: string) => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;

      // Create a temporary form targeting the hidden iframe
      const tempForm = document.createElement("form");
      tempForm.method = "POST";
      tempForm.action = GHL_FORM_URL;
      tempForm.target = "ghl-newsletter-iframe";
      tempForm.style.display = "none";

      // Add email field
      const emailInput = document.createElement("input");
      emailInput.type = "hidden";
      emailInput.name = "email";
      emailInput.value = emailVal;
      tempForm.appendChild(emailInput);

      // Add first name field if provided
      if (firstNameVal) {
        const nameInput = document.createElement("input");
        nameInput.type = "hidden";
        nameInput.name = "first_name";
        nameInput.value = firstNameVal;
        tempForm.appendChild(nameInput);
      }

      // Add form ID
      const formIdInput = document.createElement("input");
      formIdInput.type = "hidden";
      formIdInput.name = "formId";
      formIdInput.value = "5SL68SbkAFgq85FPiJw6";
      tempForm.appendChild(formIdInput);

      // Add location ID
      const locationInput = document.createElement("input");
      locationInput.type = "hidden";
      locationInput.name = "locationId";
      locationInput.value = "KFJlOhDocOFLVA5rLqVh";
      tempForm.appendChild(locationInput);

      document.body.appendChild(tempForm);
      tempForm.submit();

      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(tempForm);
      }, 2000);
    } catch (err) {
      console.warn("[Newsletter] GHL iframe submit failed:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribeMutation.isPending) return;

    const emailVal = email.trim();
    const firstNameVal = firstName.trim();

    // 1. Primary: tRPC mutation → GHL API + admin notification
    subscribeMutation.mutate({
      email: emailVal,
      firstName: firstNameVal || undefined,
      source: source || defaultSource,
    });

    // 2. Backup: Submit to GHL hidden iframe
    submitToGHLIframe(emailVal, firstNameVal);
  };

  // ==================== SECTION VARIANT ====================
  if (variant === "section") {
    return (
      <>
        {/* Hidden GHL iframe */}
        <iframe
          ref={iframeRef}
          name="ghl-newsletter-iframe"
          style={{ display: "none" }}
          title="Newsletter form"
          aria-hidden="true"
        />

        <section className="relative py-16 lg:py-20 overflow-hidden">
          {/* NLF Green Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-950 via-green-950/95 to-green-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-800/15 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
          <div className="container max-w-2xl text-center relative z-10">
            <h2
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {headline || (
                <>
                  JOIN THE <span className="text-primary">NLF NEWSLETTER</span>
                </>
              )}
            </h2>
            <p className="text-muted-foreground text-lg mb-2">
              {subtext ||
                "Get notified about new repack drops, exclusive offers, and Topps trading card products."}
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              Sign up and get{" "}
              <strong className="text-primary">10% off</strong> your first order
            </p>

            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 className="w-12 h-12 text-primary" />
                <p className="text-lg font-bold text-primary">
                  You're on the list!
                </p>
                <p className="text-muted-foreground">
                  Watch your inbox for exclusive drops and offers.
                </p>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
              >
                <input
                  type="text"
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="flex-shrink-0 w-full sm:w-36 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={subscribeMutation.isPending}
                  className="bg-primary hover:bg-primary/90 font-bold text-lg px-8 py-3 shadow-lg shadow-primary/20"
                >
                  {subscribeMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </>
    );
  }

  // ==================== FOOTER VARIANT ====================
  if (variant === "footer") {
    return (
      <>
        <iframe
          ref={iframeRef}
          name="ghl-newsletter-iframe-footer"
          style={{ display: "none" }}
          title="Newsletter form"
          aria-hidden="true"
        />

        <div className="w-full">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-3">
            <Mail className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            {headline || "NLF Newsletter"}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            {subtext ||
              "New drops, exclusive offers & collector tips."}
          </p>

          {submitted ? (
            <div className="flex items-center gap-2 py-2">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <p className="text-sm text-primary font-medium">
                You're on the list!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary"
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
                  "Subscribe"
                )}
              </Button>
            </form>
          )}
        </div>
      </>
    );
  }

  // ==================== SIDEBAR VARIANT ====================
  return (
    <>
      <iframe
        ref={iframeRef}
        name="ghl-newsletter-iframe-sidebar"
        style={{ display: "none" }}
        title="Newsletter form"
        aria-hidden="true"
      />

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-bold text-sm">
            {headline || "JOIN THE NLF NEWSLETTER"}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          {subtext ||
            "Get notified about new repack drops, exclusive offers, and Topps trading card products."}
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-3">
            <CheckCircle2 className="w-8 h-8 text-primary" />
            <p className="text-sm font-bold text-primary">You're on the list!</p>
            <p className="text-xs text-muted-foreground">Watch your inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <input
              type="text"
              placeholder="First name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary"
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary"
            />
            <Button
              type="submit"
              size="sm"
              disabled={subscribeMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 font-bold"
            >
              {subscribeMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>
        )}
        <p className="text-[10px] text-muted-foreground mt-3 text-center">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </>
  );
}
