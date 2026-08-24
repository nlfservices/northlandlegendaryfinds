/**
 * Step 2 of /admin: email + password after a successful Matrix PIN.
 * Calls trpc.matrix.adminLogin. Dark background, green accents.
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Shield,
  Lock,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import { useState } from "react";

export default function AdminCredentialsForm({
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
  const [resetBusy, setResetBusy] = useState(false);

  const adminLogin = trpc.matrix.adminLogin.useMutation();
  const requestReset = trpc.matrix.requestPasswordReset.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setIsLoading(true);
    try {
      const result = await adminLogin.mutateAsync({ username: username.trim(), password });
      if (result.success) {
        toast.success(`Welcome back, ${result.displayName}!`);
        onSuccess();
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
              <span className="text-xs text-muted-foreground font-mono">matrix://authenticate</span>
            </div>
          </div>
          <div className="p-8 space-y-6">
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
                <p className="text-muted-foreground text-sm mt-1">Enter your email and password</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <Input
                  id="username"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@nlfservices.com"
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
              <button
                type="button"
                onClick={async () => {
                  if (!username.trim()) {
                    toast.error("Enter your email first.");
                    return;
                  }
                  setResetBusy(true);
                  try {
                    const result = await requestReset.mutateAsync({ email: username.trim() });
                    toast.success(result.message || "If that account exists, we sent a reset link.");
                  } catch {
                    toast.success("If that account exists, we sent a reset link.");
                  } finally {
                    setResetBusy(false);
                  }
                }}
                disabled={isLoading || resetBusy}
                className="w-full text-sm text-primary hover:text-green-400 transition-colors disabled:opacity-50"
              >
                {resetBusy ? "Sending reset link..." : "Forgot password?"}
              </button>
            </form>

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
