/**
 * Matrix Gate - Hidden admin portal access code entry
 * 
 * A sleek, minimal PIN entry screen. No indication this is an admin portal.
 * After correct code entry, shows the full admin dashboard.
 * 
 * Security: IP-based lockout after 5 failed attempts (30 min)
 * Forgot PIN: Sends a one-time bypass link to admin email (15 min expiry)
 */

import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, ShieldAlert, ShieldCheck, Mail, CheckCircle2 } from "lucide-react";
import AdminDashboard from "./AdminDashboard";

export default function MatrixGate() {
  const [code, setCode] = useState("");
  const [granted, setGranted] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [bypassSent, setBypassSent] = useState(false);
  const [bypassError, setBypassError] = useState("");
  const [checkingBypass, setCheckingBypass] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check lockout status on load
  const { data: status, isLoading: statusLoading } = trpc.matrix.status.useQuery(undefined, {
    refetchInterval: 60000,
  });

  const verify = trpc.matrix.verify.useMutation({
    onSuccess: () => {
      setGranted(true);
      setError("");
      sessionStorage.setItem("matrix_granted", "1");
    },
    onError: (err) => {
      setError(err.message);
      setCode("");
      inputRef.current?.focus();
    },
    onSettled: () => {
      setIsVerifying(false);
    },
  });

  const requestBypass = trpc.matrix.requestBypass.useMutation({
    onSuccess: () => {
      setBypassSent(true);
      setBypassError("");
    },
    onError: (err) => {
      setBypassError(err.message);
    },
  });

  const verifyBypass = trpc.matrix.verifyBypass.useMutation({
    onSuccess: () => {
      setGranted(true);
      setCheckingBypass(false);
      sessionStorage.setItem("matrix_granted", "1");
      // Clean the URL
      window.history.replaceState({}, "", window.location.pathname);
    },
    onError: (err) => {
      setCheckingBypass(false);
      setError(err.message);
      // Clean the URL
      window.history.replaceState({}, "", window.location.pathname);
    },
  });

  // Check sessionStorage on mount
  useEffect(() => {
    if (sessionStorage.getItem("matrix_granted") === "1") {
      setGranted(true);
    }
  }, []);

  // Check for bypass token in URL on mount
  useEffect(() => {
    if (granted) return;
    const params = new URLSearchParams(window.location.search);
    const bypassToken = params.get("bypass");
    if (bypassToken) {
      setCheckingBypass(true);
      verifyBypass.mutate({ token: bypassToken });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-focus input
  useEffect(() => {
    if (!granted && !statusLoading && !status?.locked && !checkingBypass) {
      inputRef.current?.focus();
    }
  }, [granted, statusLoading, status?.locked, checkingBypass]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isVerifying) return;
    setIsVerifying(true);
    setError("");
    verify.mutate({ code: code.trim() });
  };

  const handleForgotPin = () => {
    setBypassError("");
    setBypassSent(false);
    requestBypass.mutate({ origin: window.location.origin });
  };

  // If access already granted, show the admin dashboard
  if (granted) {
    return <AdminDashboard />;
  }

  // Checking bypass token from URL
  if (checkingBypass) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-500 mx-auto mb-3" />
          <p className="text-zinc-600 text-sm">Verifying access link...</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (statusLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
      </div>
    );
  }

  // Locked out state
  if (status?.locked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Access Locked</h1>
          <p className="text-zinc-500 text-sm mb-4">
            Too many failed attempts. Try again in {status.remainingMinutes} minute{status.remainingMinutes !== 1 ? "s" : ""}.
          </p>
          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden mb-6">
            <div 
              className="h-full bg-red-500/50 rounded-full transition-all duration-1000"
              style={{ width: `${Math.max(5, (status.remainingMinutes / 30) * 100)}%` }}
            />
          </div>
          {/* Forgot PIN available even when locked out */}
          <ForgotPinSection
            bypassSent={bypassSent}
            bypassError={bypassError}
            isPending={requestBypass.isPending}
            onRequest={handleForgotPin}
          />
        </div>
      </div>
    );
  }

  // Bypass sent confirmation
  if (bypassSent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Access Link Sent</h2>
          <p className="text-zinc-500 text-sm mb-1">
            A one-time access link has been sent to the administrator.
          </p>
          <p className="text-zinc-600 text-xs mb-6">
            The link expires in 15 minutes and can only be used once.
          </p>
          <Button
            onClick={() => {
              setBypassSent(false);
              setError("");
            }}
            variant="outline"
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800 text-xs"
          >
            Back to code entry
          </Button>
        </div>
      </div>
    );
  }

  // Access code entry
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <form onSubmit={handleSubmit} className="text-center">
          {/* Minimal lock icon */}
          <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-8">
            <Lock className="w-6 h-6 text-zinc-500" />
          </div>

          {/* Code input */}
          <div className="relative mb-4">
            <Input
              ref={inputRef}
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              placeholder="Enter access code"
              className="bg-zinc-950 border-zinc-800 text-white text-center text-lg tracking-[0.3em] placeholder:tracking-normal placeholder:text-zinc-700 placeholder:text-sm h-12 focus:border-zinc-600 focus:ring-0"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-400 text-xs mb-4 animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={!code.trim() || isVerifying}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 h-10 mb-4"
            variant="outline"
          >
            {isVerifying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </Button>

          {/* Forgot PIN link */}
          <ForgotPinSection
            bypassSent={bypassSent}
            bypassError={bypassError}
            isPending={requestBypass.isPending}
            onRequest={handleForgotPin}
          />
        </form>
      </div>
    </div>
  );
}

// ==================== FORGOT PIN SECTION ====================

function ForgotPinSection({
  bypassSent,
  bypassError,
  isPending,
  onRequest,
}: {
  bypassSent: boolean;
  bypassError: string;
  isPending: boolean;
  onRequest: () => void;
}) {
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={onRequest}
        disabled={isPending || bypassSent}
        className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
      >
        {isPending ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="w-3 h-3" />
            Forgot PIN?
          </>
        )}
      </button>
      {bypassError && (
        <p className="text-red-400 text-xs mt-2 animate-in fade-in">
          {bypassError}
        </p>
      )}
    </div>
  );
}
