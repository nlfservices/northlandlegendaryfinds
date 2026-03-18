/**
 * Session Manager Hook
 * - Tracks user activity (mouse, keyboard, scroll, touch)
 * - Warns before session timeout (15 min inactivity, or 7 days with Remember Me)
 * - Polls server to verify session is still valid (single-session enforcement)
 * - Logs out user if session is invalidated or inactive too long
 */
import { useEffect, useRef, useCallback, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE_MS = 2 * 60 * 1000; // Warn 2 minutes before timeout
const SESSION_POLL_INTERVAL_MS = 60 * 1000; // Check session every 60 seconds
const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
const THROTTLE_MS = 30_000; // Only update activity timestamp every 30s

export function useSessionManager() {
  const { isAuthenticated, logout } = useAuth();
  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef(false);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastThrottledRef = useRef<number>(0);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Session validation query - only runs when authenticated
  const sessionCheck = trpc.auth.me.useQuery(undefined, {
    enabled: false, // Manual polling only
    retry: false,
  });

  const handleSessionExpired = useCallback((reason: string) => {
    setSessionExpired(true);
    toast.error(reason, {
      duration: 10000,
      description: "You will be redirected to the login page.",
    });
    // Small delay so user can see the message
    setTimeout(() => {
      logout();
    }, 2000);
  }, [logout]);

  const resetTimers = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;

    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (warningIdRef.current) clearTimeout(warningIdRef.current);

    // Set warning timer
    warningIdRef.current = setTimeout(() => {
      if (!warningShownRef.current) {
        warningShownRef.current = true;
        toast.warning("Session expiring soon", {
          description: "You'll be logged out in 2 minutes due to inactivity. Move your mouse or press a key to stay logged in.",
          duration: 30000,
        });
      }
    }, INACTIVITY_TIMEOUT_MS - WARNING_BEFORE_MS);

    // Set timeout timer
    timeoutIdRef.current = setTimeout(() => {
      handleSessionExpired("Session expired due to inactivity");
    }, INACTIVITY_TIMEOUT_MS);
  }, [handleSessionExpired]);

  const handleActivity = useCallback(() => {
    if (!isAuthenticated || sessionExpired) return;

    const now = Date.now();
    // Throttle activity updates
    if (now - lastThrottledRef.current < THROTTLE_MS) return;
    lastThrottledRef.current = now;

    resetTimers();
  }, [isAuthenticated, sessionExpired, resetTimers]);

  // Set up activity listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial timer setup
    resetTimers();

    // Add activity listeners
    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (warningIdRef.current) clearTimeout(warningIdRef.current);
    };
  }, [isAuthenticated, handleActivity, resetTimers]);

  // Session polling - check if session is still valid on server
  useEffect(() => {
    if (!isAuthenticated) return;

    pollIdRef.current = setInterval(async () => {
      try {
        const result = await sessionCheck.refetch();
        if (result.error) {
          // Session invalidated (another login or admin deactivation)
          handleSessionExpired("Your session has been ended. You may have logged in from another device.");
        }
      } catch {
        // Network error - don't log out, just skip this poll
      }
    }, SESSION_POLL_INTERVAL_MS);

    return () => {
      if (pollIdRef.current) clearInterval(pollIdRef.current);
    };
  }, [isAuthenticated, sessionCheck, handleSessionExpired]);

  return { sessionExpired };
}
