/**
 * Forgot-password reset form for /admin?reset=TOKEN
 * Dark background, green accents. Calls matrix.resetPassword.
 */
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Lock, Shield } from "lucide-react";
import { useState } from "react";

export default function AdminResetPasswordForm({
  token,
  onSuccess,
  onCancel,
}: {
  token: string;
  onSuccess: (grantedSession: boolean) => void;
  onCancel: () => void;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const resetPassword = trpc.matrix.resetPassword.useMutation();

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
      const result = await resetPassword.mutateAsync({ token, newPassword });
      if (result.success) {
        toast.success(result.message || "Password updated.");
        onSuccess(Boolean(result.grantedSession));
      } else {
        toast.error(result.message || "This reset link is invalid or expired.");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not reset password.");
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
              <span className="text-xs text-muted-foreground font-mono">matrix://reset-password</span>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-green-400 uppercase tracking-wider">Set new password</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
                <p className="text-muted-foreground text-sm mt-1">Choose a new admin password (min 8 characters)</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reset-new-password" className="text-sm font-medium text-foreground">
                  New password
                </Label>
                <Input
                  id="reset-new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoFocus
                  disabled={isLoading}
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reset-confirm-password" className="text-sm font-medium text-foreground">
                  Confirm new password
                </Label>
                <Input
                  id="reset-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  disabled={isLoading}
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isLoading || newPassword.length < 8 || newPassword !== confirmPassword}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {isLoading ? "Saving..." : "Set new password"}
              </Button>
            </form>

            <div className="flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">This reset link can be used once</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}
