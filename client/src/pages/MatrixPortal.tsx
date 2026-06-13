/**
 * Matrix Portal - Hidden admin entry point with 3-step security
 * Step 1: 6-digit PIN with individual boxes and IP lockout
 * Step 2: Username + Password form (standalone, no OAuth)
 * Step 3: Redirect to /admin dashboard
 *
 * URL: /matrix (hidden from Google via robots.txt, not linked on site)
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

// localStorage key for PIN verification — survives page navigation
// Expires after 30 minutes via a timestamp check
const MATRIX_VERIFIED_KEY = "matrix_gate_verified";
const MATRIX_VERIFIED_EXPIRY_KEY = "matrix_gate_verified_expiry";
const MATRIX_VERIFY_TTL_MS = 30 * 60 * 1000; // 30 minutes

function setMatrixVerified() {
  localStorage.setItem(MATRIX_VERIFIED_KEY, "true");
  localStorage.setItem(MATRIX_VERIFIED_EXPIRY_KEY, String(Date.now() + MATRIX_VERIFY_TTL_MS));
}

function getMatrixVerified(): boolean {
  const verified = localStorage.getItem(MATRIX_VERIFIED_KEY);
  if (verified !== "true") return false;
  const expiry = Number(localStorage.getItem(MATRIX_VERIFIED_EXPIRY_KEY) ?? "0");
  if (Date.now() > expiry) {
    localStorage.removeItem(MATRIX_VERIFIED_KEY);
    localStorage.removeItem(MATRIX_VERIFIED_EXPIRY_KEY);
    return false;
  }
  return true;
}

function clearMatrixVerified() {
  localStorage.removeItem(MATRIX_VERIFIED_KEY);
  localStorage.removeItem(MATRIX_VERIFIED_EXPIRY_KEY);
}

// ==================== STEP 2b: FORCE PASSWORD CHANGE ====================

function ChangePasswordForm({ displayName, onSuccess }: { displayName: string; onSuccess: () => void }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const changePassword = trpc.matrix.changeAdminPassword.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await changePassword.mutateAsync({ newPassword });
      if (result.success) {
        toast.success("Password updated. Welcome to the dashboard!");
        onSuccess();
      } else {
        toast.error(result.message || "Failed to change password.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error changing password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.05)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.5) 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
      </div>
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl shadow-primary/5">
          <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-muted-foreground font-mono">matrix://set-password</span>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-yellow-500/10 rounded-xl border border-yellow-500/20 flex items-center justify-center">
                <Lock className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-wider">Action Required</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Set New Password</h1>
                <p className="text-muted-foreground text-sm mt-1">Hi {displayName} — please set a permanent password to continue.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-sm font-medium text-foreground">New Password</Label>
                <div className="relative">
                  <Input id="new-password" type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 characters" autoFocus disabled={isLoading} className="bg-background border-border focus:border-primary pr-10" />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input id="confirm-password" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" disabled={isLoading} className="bg-background border-border focus:border-primary pr-10" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full gap-2" disabled={isLoading || newPassword.length < 8 || newPassword !== confirmPassword}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                {isLoading ? "Saving..." : "Set Password & Enter Dashboard"}
              </Button>
            </form>
            <div className="flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Password is stored securely with bcrypt hashing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== STEP 2: USERNAME/PASSWORD FORM ====================

function CredentialsForm({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const adminLogin = trpc.matrix.adminLogin.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setIsLoading(true);
    try {
      const result = await adminLogin.mutateAsync({ username: username.trim(), password });
      if (result.success) {
        if (result.mustChangePassword) {
          setDisplayName(result.displayName || username);
          setMustChangePassword(true);
        } else {
          toast.success(`Welcome back, ${result.displayName}!`);
          onSuccess();
        }
      } else {
        toast.error(result.message || "Invalid credentials.");
        setPassword("");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed. Please try again.");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  // Show force-change-password screen
  if (mustChangePassword) {
    return <ChangePasswordForm displayName={displayName} onSuccess={onSuccess} />;
  }

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
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl shadow-primary/5">
          {/* Header bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-muted-foreground font-mono">matrix://authenticate</span>
            </div>
          </div>
          <div className="p-8 space-y-6">
            {/* Icon & Title */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-green-400 uppercase tracking-wider">Step 1: Passed</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Admin Credentials</h1>
                <p className="text-muted-foreground text-sm mt-1">Enter your username and password</p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  autoFocus
                  disabled={isLoading}
                  className="bg-background border-border focus:border-primary font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="bg-background border-border focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isLoading || !username.trim() || !password}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                {isLoading ? "Verifying..." : "Access Dashboard"}
              </Button>
            </form>

            {/* Security note */}
            <div className="flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                All access attempts are logged and monitored
              </span>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={onBack}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3 h-3 inline mr-1" />
            Back to PIN entry
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN MATRIX PORTAL ====================

export default function MatrixPortal() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const bypassToken = searchParams.get("bypass");

  // Step 1: PIN verified state
  const [isPinVerified, setIsPinVerified] = useState(false);
  // Step 2: Credentials verified
  const [isCredVerified, setIsCredVerified] = useState(false);

  // PIN entry state
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutMinutes, setLockoutMinutes] = useState(0);
  const [bypassRequested, setBypassRequested] = useState(false);
  const [bypassLoading, setBypassLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyCode = trpc.matrix.verifyCode.useMutation();
  const requestBypass = trpc.matrix.requestBypass.useMutation();
  const verifyBypass = trpc.matrix.verifyBypass.useMutation();
  const checkStatus = trpc.matrix.checkStatus.useQuery(undefined, { retry: false });
  const checkAdminSession = trpc.matrix.checkAdminSession.useQuery(undefined, { retry: false });

  // On mount: check localStorage for PIN verification
  useEffect(() => {
    if (getMatrixVerified()) {
      setIsPinVerified(true);
    }
  }, []);

  // Check if admin session cookie is already valid (returning user)
  useEffect(() => {
    if (checkAdminSession.data?.valid) {
      setIsPinVerified(true);
      setIsCredVerified(true);
    }
  }, [checkAdminSession.data]);

  // Check lockout status on mount
  useEffect(() => {
    if (checkStatus.data?.locked) {
      setIsLockedOut(true);
      setLockoutMinutes(checkStatus.data.minutesRemaining);
    }
  }, [checkStatus.data]);

  // Handle bypass token in URL
  useEffect(() => {
    if (bypassToken && !isPinVerified) {
      verifyBypass.mutateAsync({ token: bypassToken }).then((result) => {
        if (result.success) {
          setMatrixVerified();
          setIsPinVerified(true);
          setIsLockedOut(false);
          toast.success("Bypass successful. Enter your credentials.");
          setLocation("/matrix", { replace: true });
        } else {
          toast.error(result.message);
        }
      });
    }
  }, [bypassToken]);

  // Auto-focus first input when on PIN step
  useEffect(() => {
    if (!isPinVerified && !isLockedOut) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isPinVerified, isLockedOut]);

  // Step 3: Redirect to /admin after credentials verified
  useEffect(() => {
    if (isCredVerified) {
      setLocation("/admin");
    }
  }, [isCredVerified, setLocation]);

  const submitPin = useCallback(
    async (code: string) => {
      if (isVerifying) return;
      setIsVerifying(true);
      try {
        const result = await verifyCode.mutateAsync({ code });
        if (result.success) {
          setMatrixVerified();
          setIsPinVerified(true);
        } else {
          setShake(true);
          setTimeout(() => {
            setShake(false);
            setDigits(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
          }, 500);
          if (result.locked) {
            setIsLockedOut(true);
            setLockoutMinutes(result.minutesRemaining ?? 15);
          } else {
            setAttemptsRemaining(result.attemptsRemaining ?? 0);
            toast.error(result.message || "Incorrect code.");
          }
        }
      } catch {
        toast.error("Connection error. Please try again.");
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } finally {
        setIsVerifying(false);
      }
    },
    [isVerifying, verifyCode]
  );

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, "").slice(-1);
      const newDigits = [...digits];
      newDigits[index] = digit;
      setDigits(newDigits);
      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      if (newDigits.join("").length === 6) {
        submitPin(newDigits.join(""));
      }
    },
    [digits, submitPin]
  );

  const handleDigitKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (digits[index]) {
          const newDigits = [...digits];
          newDigits[index] = "";
          setDigits(newDigits);
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          const newDigits = [...digits];
          newDigits[index - 1] = "";
          setDigits(newDigits);
        }
      } else if (e.key === "Enter") {
        const code = digits.join("");
        if (code.length === 6) submitPin(code);
      }
    },
    [digits, submitPin]
  );

  const handleDigitPaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (!pasted) return;
      const next = ["", "", "", "", "", ""];
      for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
      setDigits(next);
      const focusIdx = Math.min(pasted.length, 5);
      inputRefs.current[focusIdx]?.focus();
      if (pasted.length === 6) submitPin(pasted);
    },
    [submitPin]
  );

  const handleRequestBypass = async () => {
    setBypassLoading(true);
    try {
      const result = await requestBypass.mutateAsync();
      if (result.success) {
        setBypassRequested(true);
        toast.success("Bypass link sent to admin notifications.");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to send bypass link.");
    } finally {
      setBypassLoading(false);
    }
  };

  // ── Step 2: PIN passed, show credentials form ──
  if (isPinVerified && !isCredVerified) {
    return (
      <CredentialsForm
        onSuccess={() => setIsCredVerified(true)}
        onBack={() => {
          clearMatrixVerified();
          setIsPinVerified(false);
          setDigits(["", "", "", "", "", ""]);
        }}
      />
    );
  }

  // ── Step 3: Credentials verified, redirecting ──
  if (isCredVerified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground text-sm">Access verified. Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // ── Step 1: PIN entry ──
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
                <div
                  className={`flex justify-center gap-3 ${
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
                            ? "border-primary shadow-[0_0_12px_rgba(34,197,94,0.2)]"
                            : "border-border hover:border-primary/40"
                        }
                        focus:border-primary focus:shadow-[0_0_16px_rgba(34,197,94,0.3)]
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    />
                  ))}
                </div>

                {attemptsRemaining < 5 && (
                  <p className="text-center text-xs text-destructive">
                    {attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining
                  </p>
                )}

                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => submitPin(digits.join(""))}
                  disabled={isVerifying || digits.join("").length < 6}
                >
                  {isVerifying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  {isVerifying ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="text-center">
                  <button
                    onClick={handleRequestBypass}
                    disabled={bypassLoading || bypassRequested}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  >
                    {bypassRequested ? "Bypass link sent" : "Forgot PIN? Send bypass link"}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                All access attempts are logged and monitored
              </span>
            </div>
          </div>
        </div>
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
