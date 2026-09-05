/**
 * Jarvis Protocol - Branded Login/Signup Page
 * Marvel-themed authentication gateway with NLF cosmic styling
 * Two equal paths: New Users (Create Account) and Existing Users (Sign In)
 * Frames OAuth as "Secure Sign-In Partner" to hide Manus branding
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl, getSignUpUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Shield,
  Zap,
  Package,
  Star,
  Bell,
  ChevronRight,
  Lock,
  Fingerprint,
  ArrowLeft,
  LogOut,
  User,
  ShoppingBag,
  UserPlus,
  KeyRound,
} from "lucide-react";

const NLF_LOGO = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/site-assets/NLF-Logo-MainLogo.png";

const BENEFITS = [
  {
    icon: Package,
    title: "Faster Checkout",
    description: "Save your shipping and billing info for quick, seamless purchases on every drop.",
  },
  {
    icon: Bell,
    title: "Exclusive Drop Alerts",
    description: "Get notified first when new repack products go live — never miss a legendary pull.",
  },
  {
    icon: Star,
    title: "Collection Tracking",
    description: "Track your pulls, build wishlists, and monitor your Marvel card collection in one place.",
  },
  {
    icon: Zap,
    title: "Early Access",
    description: "Protocol members get priority access to limited edition repacks and special releases.",
  },
];

export default function JarvisProtocol() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-ping" />
            <div className="absolute inset-2 border-2 border-primary/60 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-primary/20 rounded-full flex items-center justify-center">
              <Fingerprint className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm tracking-wider uppercase">Initializing Protocol...</p>
        </div>
      </div>
    );
  }

  // Authenticated — show account dashboard
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container relative z-10 py-16 max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-8 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{user.name || "Agent"}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-green-400">Jarvis Protocol Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Your Account</h2>

              <Link href="/shop">
                <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-background hover:bg-primary/5 border border-border hover:border-primary/30 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">Browse Shop</p>
                    <p className="text-sm text-muted-foreground">Check out the latest drops and repacks</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </Link>

              <Link href="/cards">
                <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-background hover:bg-primary/5 border border-border hover:border-primary/30 transition-all group mt-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">Card Database</p>
                    <p className="text-sm text-muted-foreground">Explore the full Marvel card database</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </Link>

              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-background hover:bg-destructive/5 border border-border hover:border-destructive/30 transition-all group mt-6"
              >
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">Sign Out</p>
                  <p className="text-sm text-muted-foreground">Deactivate Jarvis Protocol on this device</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // Not authenticated — Two-path login page
  // ========================================
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.08)_0%,_transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            style={{ animation: "scanline 4s ease-in-out infinite" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>

      <div className="container relative z-10 py-12 lg:py-20">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          {/* Left Side — Branding & Benefits */}
          <div>
            {/* Protocol Header */}
            <div className="flex items-center gap-4 mb-6">
              <img src={NLF_LOGO} alt="NLF" className="w-16 h-16 object-contain" />
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-primary text-xs font-bold tracking-wider uppercase">System Online</span>
                </div>
                <h1
                  className="text-4xl sm:text-5xl font-bold text-foreground leading-tight"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  JARVIS<br />
                  <span className="text-primary">PROTOCOL</span>
                </h1>
              </div>
            </div>

            <p className="text-muted-foreground text-lg mb-10 max-w-md">
              Your secure gateway to the Northland Legendary Finds ecosystem. Sign in to unlock exclusive features and track your collection.
            </p>

            {/* Benefits */}
            <div className="space-y-5">
              {BENEFITS.map((benefit, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side — Two Login Options */}
          <div className="space-y-5">
            {/* ===== NEW USER CARD ===== */}
            <div className="bg-card border-2 border-primary/40 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
              {/* Card Header */}
              <div className="p-6 pb-4 bg-gradient-to-b from-primary/10 to-transparent">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">New Here?</h2>
                    <p className="text-primary text-sm font-medium">Create your free account</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Join the NLF community in seconds. Sign up with your email, Google, Facebook, Apple, or Microsoft account — no special account needed.
                </p>
              </div>

              <div className="p-6 pt-4">
                <Button
                  size="lg"
                  className="w-full h-14 text-base font-bold tracking-wide gap-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/25"
                  onClick={() => {
                    window.location.href = getSignUpUrl();
                  }}
                >
                  <UserPlus className="w-5 h-5" />
                  Create Account — It's Free
                  <ChevronRight className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex -space-x-1">
                    {["Google", "Facebook", "Apple", "Microsoft"].map((provider) => (
                      <div
                        key={provider}
                        className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground"
                        title={`Sign up with ${provider}`}
                      >
                        {provider[0]}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Sign up with Google, Facebook, Apple, Microsoft, or Email
                  </span>
                </div>
              </div>
            </div>

            {/* ===== EXISTING USER CARD ===== */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl shadow-black/10">
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center">
                    <KeyRound className="w-6 h-6 text-foreground/70" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Already a Member?</h2>
                    <p className="text-muted-foreground text-sm">Welcome back, Agent</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Sign in with the same method you used to create your account.
                </p>
              </div>

              <div className="p-6 pt-2">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-base font-bold tracking-wide gap-3 border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary rounded-xl"
                  onClick={() => {
                    window.location.href = getLoginUrl();
                  }}
                >
                  <Shield className="w-5 h-5" />
                  Sign In to Your Account
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Security & Trust */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Protected by <span className="text-foreground/70 font-medium">Secure Sign-In Partner</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-card border border-border">
                <Shield className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-[10px] text-muted-foreground leading-tight">256-bit<br />Encryption</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-card border border-border">
                <Lock className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-[10px] text-muted-foreground leading-tight">Zero Data<br />Sharing</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-card border border-border">
                <Fingerprint className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-[10px] text-muted-foreground leading-tight">Secure<br />Auth</p>
              </div>
            </div>

            {/* Help text */}
            <p className="text-center text-muted-foreground text-xs">
              Having trouble? Contact{" "}
              <a href="mailto:admin@nlfservices.com" className="text-primary hover:underline">
                admin@nlfservices.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

