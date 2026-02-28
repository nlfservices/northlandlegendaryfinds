import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

/**
 * Standalone Email Subscription Page
 * Uses the same GHL iframe embed as the ComingSoon page for reliable form submission
 */

export default function Subscribe() {
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [formLoaded, setFormLoaded] = useState(false);

  // Load the GHL form via iframe
  useEffect(() => {
    const container = formContainerRef.current;
    if (!container) return;

    const checkFormLoaded = setInterval(() => {
      const iframe = container.querySelector("iframe");
      if (iframe) {
        setFormLoaded(true);
        clearInterval(checkFormLoaded);
      }
    }, 500);

    const timeout = setTimeout(() => {
      clearInterval(checkFormLoaded);
      setFormLoaded(true);
    }, 10000);

    return () => {
      clearInterval(checkFormLoaded);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black">
      {/* Header with Logo */}
      <div className="container py-8">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <img 
              src="/NLF-Logo-MainLogo.png" 
              alt="NLF Logo" 
              className="w-12 h-12"
            />
            <div>
              <div className="text-2xl font-bold text-green-400">NORTHLAND</div>
              <div className="text-sm text-gray-400">Legendary Finds</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content */}
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <div className="max-w-2xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-block p-6 bg-green-500/10 rounded-full mb-6">
              <span className="text-7xl">🎁</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-green-400 mb-4 drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]">
              Join the Legends
            </h1>
            
            <p className="text-2xl text-gray-300 mb-8">
              Get <span className="text-green-400 font-bold">10% off</span> your first repack + exclusive collector perks
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            <div className="bg-purple-900/30 border border-green-500/30 rounded-lg p-6">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-bold text-green-400 mb-2">Early Access</h3>
              <p className="text-gray-400 text-sm">Be first to know about new drops and limited releases</p>
            </div>

            <div className="bg-purple-900/30 border border-green-500/30 rounded-lg p-6">
              <div className="text-3xl mb-3">💎</div>
              <h3 className="text-lg font-bold text-green-400 mb-2">Exclusive Deals</h3>
              <p className="text-gray-400 text-sm">Subscriber-only discounts and special offers</p>
            </div>

            <div className="bg-purple-900/30 border border-green-500/30 rounded-lg p-6">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-lg font-bold text-green-400 mb-2">Behind the Scenes</h3>
              <p className="text-gray-400 text-sm">Watch live box openings and repack reveals</p>
            </div>

            <div className="bg-purple-900/30 border border-green-500/30 rounded-lg p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-bold text-green-400 mb-2">Priority Access</h3>
              <p className="text-gray-400 text-sm">First dibs on ultra-rare Galactic Legends boxes</p>
            </div>
          </div>

          {/* GHL Form - Same iframe approach as ComingSoon page */}
          <div className="bg-gradient-to-br from-purple-900/50 to-black border-2 border-green-500/30 rounded-xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-center text-green-400 mb-6">Sign Up for Early Access</h3>
            
            <div className="ghl-dark-wrapper rounded-xl overflow-hidden">
              <div
                ref={formContainerRef}
                className="ghl-form-container"
              >
                <iframe
                  src="https://api.leadconnectorhq.com/widget/form/5SL68SbkAFgq85FPiJw6"
                  style={{ width: "100%", border: "none", overflow: "hidden" }}
                  scrolling="no"
                  id="subscribe-inline-5SL68SbkAFgq85FPiJw6"
                  data-layout='{"id":"INLINE"}'
                  data-trigger-type="alwaysShow"
                  data-trigger-value=""
                  data-activation-type="alwaysActivated"
                  data-activation-value=""
                  data-deactivation-type="neverDeactivate"
                  data-deactivation-value=""
                  data-form-name="Form 0"
                  data-height="600"
                  data-layout-iframe-id="subscribe-inline-5SL68SbkAFgq85FPiJw6"
                  data-form-id="5SL68SbkAFgq85FPiJw6"
                  title="Subscribe Form"
                ></iframe>
              </div>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              We respect your privacy. Unsubscribe anytime. No spam, ever.
            </p>
          </div>

          {/* Social Proof */}
          <div className="text-center mt-8 text-gray-400">
            <p className="text-sm">
              Join <span className="text-green-400 font-bold">500+</span> collectors already in our community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
