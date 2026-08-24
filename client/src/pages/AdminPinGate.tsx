/**
 * PIN gate in front of /admin.
 * Step 1: Matrix 6-digit PIN
 * Step 2: email/password (adminLogin)
 * Step 3: AdminDashboard after adminLogin (or an already-valid returning session)
 */
import { lazy, Suspense, useCallback, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import MatrixPinForm from "@/components/admin/MatrixPinForm";
import AdminCredentialsForm from "@/components/admin/AdminCredentialsForm";
import AdminResetPasswordForm from "@/components/admin/AdminResetPasswordForm";

const AdminDashboard = lazy(() => import("./AdminDashboard"));

const ALLOWED_ADMIN_ROLES = ["owner", "super_admin", "admin"];

function GateLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">Checking access...</p>
      </div>
    </div>
  );
}

export default function AdminPinGate() {
  const { user, loading: authLoading, refresh } = useAuth();
  const session = trpc.matrix.checkAdminSession.useQuery(undefined, { retry: false });
  const [pinPassed, setPinPassed] = useState(false);
  const [credsPassed, setCredsPassed] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("reset");
  });

  const returningUser =
    Boolean(session.data?.valid) || Boolean(user && ALLOWED_ADMIN_ROLES.includes(user.role));
  const allowed = returningUser || credsPassed;

  const handlePinSuccess = useCallback(() => {
    setPinPassed(true);
  }, []);

  const handleLoginSuccess = useCallback(async () => {
    setCredsPassed(true);
    setResetToken(null);
    await Promise.all([session.refetch(), refresh()]);
  }, [session, refresh]);

  const clearResetFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.delete("reset");
    const next = url.pathname + (url.search ? url.search : "");
    window.history.replaceState({}, "", next);
  }, []);

  const handleResetSuccess = useCallback(
    async (grantedSession: boolean) => {
      clearResetFromUrl();
      setResetToken(null);
      if (grantedSession) {
        setCredsPassed(true);
        await Promise.all([session.refetch(), refresh()]);
      } else {
        setPinPassed(true);
      }
    },
    [clearResetFromUrl, session, refresh]
  );

  if (authLoading || session.isLoading) {
    return <GateLoader />;
  }

  if (resetToken) {
    return (
      <AdminResetPasswordForm
        token={resetToken}
        onSuccess={handleResetSuccess}
        onCancel={() => {
          clearResetFromUrl();
          setResetToken(null);
          setPinPassed(true);
        }}
      />
    );
  }

  if (allowed) {
    return (
      <Suspense fallback={<GateLoader />}>
        <AdminDashboard />
      </Suspense>
    );
  }

  if (pinPassed) {
    return (
      <AdminCredentialsForm
        onSuccess={handleLoginSuccess}
        onBack={() => setPinPassed(false)}
      />
    );
  }

  return <MatrixPinForm onSuccess={handlePinSuccess} />;
}
