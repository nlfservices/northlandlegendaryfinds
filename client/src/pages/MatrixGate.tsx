/**
 * Matrix Gate - Hidden admin portal access code entry
 * 
 * A sleek, minimal PIN entry screen. No indication this is an admin portal.
 * After correct code entry, shows the full admin dashboard.
 * 
 * Security: IP-based lockout after 5 failed attempts (30 min)
 */

import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import AdminDashboard from "./AdminDashboard";

export default function MatrixGate() {
  const [code, setCode] = useState("");
  const [granted, setGranted] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check lockout status on load
  const { data: status, isLoading: statusLoading } = trpc.matrix.status.useQuery(undefined, {
    refetchInterval: 60000, // Refresh lockout status every minute
  });

  const verify = trpc.matrix.verify.useMutation({
    onSuccess: () => {
      setGranted(true);
      setError("");
      // Store in sessionStorage so refreshing the page within the same session keeps access
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

  // Check sessionStorage on mount
  useEffect(() => {
    if (sessionStorage.getItem("matrix_granted") === "1") {
      setGranted(true);
    }
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (!granted && !statusLoading && !status?.locked) {
      inputRef.current?.focus();
    }
  }, [granted, statusLoading, status?.locked]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isVerifying) return;
    setIsVerifying(true);
    setError("");
    verify.mutate({ code: code.trim() });
  };

  // If access already granted, show the admin dashboard
  if (granted) {
    return <AdminDashboard />;
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
          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-red-500/50 rounded-full transition-all duration-1000"
              style={{ width: `${Math.max(5, (status.remainingMinutes / 30) * 100)}%` }}
            />
          </div>
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

          {/* Code input - styled as a minimal dark input */}
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

          {/* Submit button - very subtle */}
          <Button
            type="submit"
            disabled={!code.trim() || isVerifying}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 h-10"
            variant="outline"
          >
            {isVerifying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
