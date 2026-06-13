/**
 * Matrix Portal - Hidden admin entry point with 3-layer security
 * Layer 1: Access code gate (this page) — 6-digit PIN with individual boxes
 * Layer 2: OAuth authentication (after code verified)
 * Layer 3: Admin role check (AdminDashboard component)
 *
 * URL: /matrix (hidden from Google via robots.txt)
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link, useLocation, useSearch } from "wouter";
import {
  Shield,
  Lock,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Terminal,
  Send,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

// Session storage key for access code verification
const MATRIX_VERIFIED_KEY = "matrix_gate_verified";

// Roles that are allowed into the admin dashboard
const ADMIN_ROLES = ["owner", "super_admin", "admin"] as const;
type AdminRole = (typeof ADMIN_ROLES)[number];
function isAdminRole(role: string | undefined | null): role is AdminRole {
  return ADMIN_ROLES.includes(role as AdminRole);
}

export default function MatrixPortal() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const bypassToken = searchParams.get("bypass");

  // 6-digit PIN state — each digit stored separately
  const [digits, setDigits] = useState<string[]>(["" ,"", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutMinutes, setLockoutMinutes] = useState(0);
  const [bypassRequested, setBypassRequested] = useState(false);
  const [bypassLoading, setBypassLoading] = useState(false);
  // Shake animation on wrong PIN
  const [shake, setShake] = useState(false);

  // Refs for each digit input
  const inputRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null, null, null]);

  const verifyCode = trpc.matrix.verifyCode.useMutation();
  const verifyBypass = trpc.matrix.verifyBypass.useMutation();
  const requestBypass = trpc.matrix.requestBypass.useMutation();
  const { data: lockStatus } = trpc.matrix.checkStatus.useQuery();

  // Check session storage for previous verification
  useEffect(() => {
    const verified = sessionStorage.getItem(MATRIX_VERIFIED_KEY);
    if (verified === "true") {
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

  // Auto-focus first digit on mount
  useEffect(() => {
    if (!isVerified && !isLockedOut) {
      inputRefs.current[0]?.focus();
    }
  }, [isVerified, isLockedOut]);

  async function handleBypassVerification(token: string) {
    try {
      const result = await verifyBypass.mutateAsync({ token });
      if (result.success) {
        sessionStorage.setItem(MATRIX_VERIFIED_KEY, "true");
        setIsVerified(true);
        setIsLockedOut(false);
        toast.success("Bypass successful. Access granted.");
        // Clean the URL
        setLocation("/matrix", { replace: true });
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Bypass verification failed.");
    }
  }

  const submitCode = useCallback(async (fullCode: string) => {
    if (isVerifying || isLockedOut) return;
    setIsVerifying(true);
    try {
      const result = await verifyCode.mutateAsync({ code: fullCode });
      if (result.success) {
        sessionStorage.setItem(MATRIX_VERIFIED_KEY, "true");
        setIsVerified(true);
        toast.success("Access granted.");
      } else {
        // Wrong code — shake and clear
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setDigits(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }, 500);
        if (result.locked) {
          setIsLockedOut(true);
          setLockoutMinutes(result.minutesRemaining || 15);
        } else {
          setAttemptsRemaining(result.attemptsRemaining || 0);
          toast.error(result.message);
        }
      }
    } catch {
      toast.error("Verification failed. Try again.");
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  }, [isVerifying, isLockedOut, verifyCode]);

  function handleDigitChange(index: number, value: string) {
    // Only accept digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    if (digit) {
      // Advance to next box
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else {
        // Last digit entered — auto-submit
        const fullCode = newDigits.join("");
        if (fullCode.length === 6) {
          submitCode(fullCode);
        }
      }
    }
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        // Clear current box
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      } else if (index > 0) {
        // Move back and clear previous
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      const fullCode = digits.join("");
      if (fullCode.length === 6) {
        submitCode(fullCode);
      }
    }
  }

  function handleDigitPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    const nextEmpty = pasted.length < 6 ? pasted.length : 5;
    inputRefs.current[nextEmpty]?.focus();
    if (pasted.length === 6) {
      submitCode(pasted);
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
    } catch {
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

    // Logged in but not an admin-tier role
    if (!isAdminRole(user.role)) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="max-w-md w-full mx-4 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center border-2 border-destructive/30">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
              <p className="text-muted-foreground text-sm">
                Your account does not have admin privileges.
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Current role: <span className="font-mono text-foreground">{user.role ?? "none"}</span>
              </p>
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

  // Layer 1: Access Code Gate — 6-digit PIN entry
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
        {/* Terminal-style card */}
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
                <p className="text-muted-foreground text-sm mt-1">Enter your 6-digit access code</p>
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
                    <span className="text-destructive font-bold">{lockoutMinutes}</span>{" "}
                    minute{lockoutMinutes !== 1 ? "s" : ""}.
                  </p>
                </div>
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
              /* 6-Digit PIN Entry */
              <div className="space-y-5">
                {/* PIN boxes */}
                <div
                  className={`flex justify-center gap-3 transition-transform ${
                    shake ? "animate-[shake_0.4s_ease-in-out]" : ""
                  }`}
                >
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      onPaste={handleDigitPaste}
                      onFocus={(e) => e.target.select()}
                      disabled={isVerifying}
                      autoComplete="off"
                      className={`
                        w-12 h-14 text-center text-xl font-bold font-mono rounded-xl border-2
                        bg-background text-foreground
                        transition-all duration-150 outline-none
                        ${
                          digit
                            ? "border-primary shadow-[0_0_12px_rgba(34,197,94,0.25)]"
                            : "border-border"
                        }
                        focus:border-primary focus:shadow-[0_0_12px_rgba(34,197,94,0.35)]
                        disabled:opacity-50 disabled:cursor-not-allowed
                        caret-transparent
                      `}
                    />
                  ))}
                </div>

                {/* Verifying spinner */}
                {isVerifying && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Verifying...</span>
                  </div>
                )}

                {/* Attempts indicator */}
                {attemptsRemaining < 5 && !isVerifying && (
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
                    className="text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  >
                    {bypassRequested
                      ? "Bypass link sent — check notifications"
                      : bypassLoading
                      ? "Sending..."
                      : "Forgot PIN? Send bypass link"}
                  </button>
                </div>
              </div>
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
