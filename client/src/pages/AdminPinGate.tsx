/**
 * PIN gate in front of /admin.
 * Reuses the Matrix 6-digit verifyCode path. After a correct PIN the
 * server sets the admin session cookies and AdminDashboard loads.
 */
import { lazy, Suspense, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import MatrixPinForm from "@/components/admin/MatrixPinForm";

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

  const allowedByRole = Boolean(user && ALLOWED_ADMIN_ROLES.includes(user.role));
  const allowedByMatrix = Boolean(session.data?.valid);
  const allowed = allowedByRole || allowedByMatrix;

  const handlePinSuccess = useCallback(async () => {
    await Promise.all([session.refetch(), refresh()]);
  }, [session, refresh]);

  if (authLoading || session.isLoading) {
    return <GateLoader />;
  }

  if (!allowed) {
    return <MatrixPinForm onSuccess={handlePinSuccess} />;
  }

  return (
    <Suspense fallback={<GateLoader />}>
      <AdminDashboard />
    </Suspense>
  );
}
