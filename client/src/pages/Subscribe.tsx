import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

/**
 * Standalone Email Subscription Page
 * 
 * Can be accessed at /subscribe
 * Perfect for:
 * - Social media links
 * - Footer links
 * - Email signatures
 * - QR codes at events
 * 
 * To integrate GoHighLevel:
 * Replace the placeholder form with your GHL embed code
 */

export default function Subscribe() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Replace with actual GoHighLevel form submission
    localStorage.setItem("nlf_email_submitted", "true");
    localStorage.setItem("nlf_popup_closed", "permanent");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto animate-in zoom-in duration-500" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-green-400 mb-4">
            You're In!
          </h1>
          
          <p className="text-xl text-gray-300 mb-6">
            Check your email for your <span className="text-green-400 font-bold">10% discount code</span>
          </p>

          <div className="bg-purple-900/30 border border-green-500/30 rounded-lg p-6 mb-8">
            <p className="text-gray-300 mb-4">
              Welcome to the Northland Legendary Finds community! You'll receive:
            </p>
            <ul className="text-left text-gray-400 space-y-2">
              <li>✅ Exclusive early access to new drops</li>
              <li>✅ Special collector-only deals</li>
              <li>✅ Behind-the-scenes repack content</li>
              <li>✅ First dibs on limited edition boxes</li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link href="/marvel">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg">
                Shop Marvel Repacks
              </Button>
            </Link>
            
            <Link href="/star-wars">
              <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-lg">
                Star Wars — Coming June 2026
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10">
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Form Section - PLACEHOLDER FOR GOHIGHLEVEL */}
          <div className="bg-gradient-to-br from-purple-900/50 to-black border-2 border-green-500/30 rounded-xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="collector@example.com"
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors text-lg"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 text-lg rounded-lg transition-all transform hover:scale-105"
              >
                Get My 10% Discount Code
              </Button>

              <p className="text-xs text-center text-gray-500">
                We respect your privacy. Unsubscribe anytime. No spam, ever.
              </p>
            </form>

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
