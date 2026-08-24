/**
 * Shared 6-digit Matrix PIN form.
 * Same boxes, lockout, and verifyCode path as /matrix.
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Shield,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Terminal,
  Send,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

const MATRIX_VERIFIED_KEY = "matrix_gate_verified";
const MATRIX_VERIFIED_EXPIRY_KEY = "matrix_gate_verified_expiry";
const MATRIX_VERIFY_TTL_MS = 30 * 60 * 1000;

function setMatrixVerified() {
  localStorage.setItem(MATRIX_VERIFIED_KEY, "true");
  localStorage.setItem(MATRIX_VERIFIED_EXPIRY_KEY, String(Date.now() + MATRIX_VERIFY_TTL_MS));
}

export default function MatrixPinForm({ onSuccess }: { onSuccess: () => void }) {
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
  const checkStatus = trpc.matrix.checkStatus.useQuery(undefined, { retry: false });

  useEffect(() => {
    if (checkStatus.data?.locked) {
      setIsLockedOut(true);
      setLockoutMinutes(checkStatus.data.minutesRemaining);
    }
  }, [checkStatus.data]);

  useEffect(() => {
    if (!isLockedOut) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isLockedOut]);

  const submitPin = useCallback(
    async (code: string) => {
      if (isVerifying) return;
      setIsVerifying(true);
      try {
        const result = await verifyCode.mutateAsync({ code });
        if (result.success) {
          setMatrixVerified();
          onSuccess();
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
    [isVerifying, verifyCode, onSuccess]
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
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
              <div className="space-y-5">
                <div className={`flex justify-center gap-3 ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
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
                  {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
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
