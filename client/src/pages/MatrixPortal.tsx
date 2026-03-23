/**
 * Matrix Portal - Hidden admin entry point with 3-layer security
 * Layer 1: Access code gate (this page)
 * Layer 2: OAuth authentication (after code verified)
 * Layer 3: Admin role check (AdminDashboard component)
 * 
 * URL: /matrix (hidden from Google via robots.txt)
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link, useLocation, useSearch } from "wouter";
import {
  Shield,
  Lock,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Terminal,
  Eye,
  EyeOff,
  KeyRound,
  Send,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// localStorage key for access code verification (persists for 1 hour)
const MATRIX_VERIFIED_KEY = "matrix_gate_verified";
const MATRIX_VERIFIED_EXPIRY_KEY = "matrix_gate_verified_expiry";
const MATRIX_SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour

function setMatrixVerified() {
  localStorage.setItem(MATRIX_VERIFIED_KEY, "true");
  localStorage.setItem(MATRIX_VERIFIED_EXPIRY_KEY, String(Date.now() + MATRIX_SESSION_DURATION_MS));
}

function isMatrixVerified(): boolean {
  const verified = localStorage.getItem(MATRIX_VERIFIED_KEY);
  const expiry = localStorage.getItem(MATRIX_VERIFIED_EXPIRY_KEY);
  if (verified !== "true" || !expiry) return false;
  if (Date.now() > Number(expiry)) {
    // Expired — clear it
    localStorage.removeItem(MATRIX_VERIFIED_KEY);
    localStorage.removeItem(MATRIX_VERIFIED_EXPIRY_KEY);
    return false;
  }
  return true;
}

export default function MatrixPortal() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const bypassToken = searchParams.get("bypass");

  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutMinutes, setLockoutMinutes] = useState(0);
  const [bypassRequested, setBypassRequested] = useState(false);
  const [bypassLoading, setBypassLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const verifyCode = trpc.matrix.verifyCode.useMutation();
  const verifyBypass = trpc.matrix.verifyBypass.useMutation();
  const requestBypass = trpc.matrix.requestBypass.useMutation();
  const { data: lockStatus } = trpc.matrix.checkStatus.useQuery();

  // Check localStorage for previous verification (persists for 1 hour)
  useEffect(() => {
    if (isMatrixVerified()) {
      setIsVerified(true);
    }
  }, []);

  // Check lockout status on load
  useEffect(() => {
    if (lockStatus?.locked) {
      setIsLockedOut(true);
      setLockoutMinutes(lockStatus.minutesRemaining);
    }
  }, [lockStatus]);

  // Handle bypass token in URL
  useEffect(() => {
    if (bypassToken && !isVerified) {
      handleBypassVerification(bypassToken);
    }
  }, [bypassToken]);

  // Auto-focus input
  useEffect(() => {
    if (!isVerified && !isLockedOut && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVerified, isLockedOut]);

  async function handleBypassVerification(token: string) {
    try {
      const result = await verifyBypass.mutateAsync({ token });
      if (result.success) {
        setMatrixVerified();
        setIsVerified(true);
        setIsLockedOut(false);
        toast.success("Bypass successful. Access granted.");
        // Clean the URL
        setLocation("/matrix", { replace: true });
      } else {
        toast.error(result.message);
      }
    } catch (e: any) {
      toast.error("Bypass verification failed.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || isVerifying || isLockedOut) return;

    setIsVerifying(true);
    try {
      const result = await verifyCode.mutateAsync({ code: code.trim() });

      if (result.success) {
        setMatrixVerified();
        setIsVerified(true);
        toast.success("Access granted. Session active for 1 hour.");
      } else {
        setCode("");
        if (result.locked) {
          setIsLockedOut(true);
          setLockoutMinutes(result.minutesRemaining || 15);
        } else {
          setAttemptsRemaining(result.attemptsRemaining || 0);
          toast.error(result.message);
        }
      }
    } catch (e: any) {
      toast.error("Verification failed. Try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleRequestBypass() {
    setBypassLoading(true);
    try {
      const result = await requestBypass.mutateAsync();
      if (result.success) {
        setBypassRequested(true);
        toast.success("Bypass link sent! Check your notifications.");
      } else {
        toast.error(result.message);
      }
    } catch (e: any) {
      toast.error("Failed to send bypass link.");
    } finally {
      setBypassLoading(false);
    }
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Layer 1 passed — now check Layer 2 (OAuth) and Layer 3 (admin role)
  if (isVerified) {
    // Not logged in — redirect to OAuth
    if (!user) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="max-w-md w-full mx-4 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/30">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Layer 1: Passed</h2>
              <p className="text-muted-foreground text-sm">Access code verified. Now authenticate to continue.</p>
            </div>
            <div className="space-y-3">
              <a href={getLoginUrl()}>
                <Button size="lg" className="w-full gap-2">
                  <Lock className="w-4 h-4" />
                  Authenticate via Jarvis Protocol
                </Button>
              </a>
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 mt-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Logged in but not admin
    if (user.role !== "admin") {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="max-w-md w-full mx-4 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center border-2 border-destructive/30">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
              <p className="text-muted-foreground text-sm">Your account does not have admin privileges.</p>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Site
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    // All 3 layers passed — redirect to admin dashboard
    // Use useEffect to avoid calling setLocation during render
    return <MatrixRedirect />;
  }

  // Layer 1: Access Code Gate
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.05)_0%,_transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        {/* Terminal-style header */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl shadow-primary/5">
          {/* Header bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-muted-foreground font-mono">matrix://secure-access</span>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Icon & Title */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center">
                <Terminal className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Matrix Access</h1>
                <p className="text-muted-foreground text-sm mt-1">Enter your access code to proceed</p>
              </div>
            </div>

            {isLockedOut ? (
              /* Lockout State */
              <div className="space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <h3 className="font-bold text-destructive mb-1">Access Locked</h3>
                  <p className="text-sm text-muted-foreground">
                    Too many failed attempts. Try again in{" "}
                    <span className="text-destructive font-bold">{lockoutMinutes}</span> minute{lockoutMinutes !== 1 ? "s" : ""}.
                  </p>
                </div>

                {/* Forgot PIN / Bypass */}
                {!bypassRequested ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground hover:text-primary"
                    onClick={handleRequestBypass}
                    disabled={bypassLoading}
                  >
                    {bypassLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Forgot PIN? Send bypass link
                  </Button>
                ) : (
                  <div className="text-center text-sm text-green-400">
                    <p>Bypass link sent to admin notifications.</p>
                    <p className="text-muted-foreground text-xs mt-1">Check your email or notification center.</p>
                  </div>
                )}
              </div>
            ) : (
              /* Code Entry Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    type={showCode ? "text" : "password"}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter access code..."
                    className="pl-10 pr-10 h-12 font-mono text-lg tracking-widest bg-background border-border focus:border-primary"
                    autoComplete="off"
                    disabled={isVerifying}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 font-bold tracking-wide gap-2"
                  disabled={!code.trim() || isVerifying}
                >
                  {isVerifying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  {isVerifying ? "Verifying..." : "Verify Access"}
                </Button>

                {/* Attempts indicator */}
                {attemptsRemaining < 5 && (
                  <p className="text-center text-xs text-yellow-400">
                    {attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining before lockout
                  </p>
                )}

                {/* Forgot PIN link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleRequestBypass}
                    disabled={bypassLoading || bypassRequested}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {bypassRequested
                      ? "Bypass link sent — check notifications"
                      : bypassLoading
                      ? "Sending..."
                      : "Forgot PIN? Send bypass link"}
                  </button>
                </div>
              </form>
            )}

            {/* Security notice */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-border">
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                All access attempts are logged and monitored
              </span>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-4">
          <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-3 h-3 inline mr-1" />
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Separate component to handle redirect after all layers pass
 * This avoids calling setLocation during render
 */
function MatrixRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/admin");
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground text-sm">Access verified. Loading admin panel...</p>
      </div>
    </div>
  );
}
