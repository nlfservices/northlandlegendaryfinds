/**
 * Activity Logger Service
 * Logs all auth-related events for audit trail
 * Non-blocking — failures are logged but never throw
 */
import type { Request } from "express";
import type { User } from "../drizzle/schema";
import * as db from "./db";

export type ActivityAction =
  | "login"
  | "login_failed"
  | "logout"
  | "session_invalidated"
  | "user_role_changed"
  | "user_deactivated"
  | "user_activated"
  | "user_created"
  | "password_reset_requested"
  | "password_reset_completed"
  | "account_locked"
  | "admin_action";

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress ?? "unknown";
}

function getUserAgent(req: Request): string {
  return req.headers["user-agent"] ?? "unknown";
}

/**
 * Log an activity event. Non-blocking — errors are caught and logged.
 */
export async function logActivity(params: {
  user: User | { id: number; email: string | null; name: string | null };
  action: ActivityAction;
  details?: Record<string, unknown>;
  req?: Request;
}): Promise<void> {
  const { user, action, details, req } = params;

  try {
    await db.logActivity({
      userId: user.id,
      userEmail: user.email ?? "unknown",
      userName: (user.name as string) ?? "unknown",
      action,
      details: details ? JSON.stringify(details) : null,
      ipAddress: req ? getClientIp(req) : null,
      userAgent: req ? getUserAgent(req) : null,
    });
  } catch (error) {
    console.error("[ActivityLogger] Failed to log activity:", action, error);
  }
}

/**
 * Log a login event
 */
export async function logLogin(user: User, req: Request): Promise<void> {
  await logActivity({
    user,
    action: "login",
    details: { loginMethod: user.loginMethod },
    req,
  });
}

/**
 * Log a logout event
 */
export async function logLogout(user: User, req: Request): Promise<void> {
  await logActivity({
    user,
    action: "logout",
    req,
  });
}

/**
 * Log a session invalidation (kicked by another login)
 */
export async function logSessionInvalidated(user: User, req?: Request): Promise<void> {
  await logActivity({
    user,
    action: "session_invalidated",
    details: { reason: "new_login_from_another_device" },
    req,
  });
}

/**
 * Log a role change
 */
export async function logRoleChange(
  targetUser: User,
  oldRole: string,
  newRole: string,
  adminUser: User,
  req: Request
): Promise<void> {
  await logActivity({
    user: targetUser,
    action: "user_role_changed",
    details: {
      oldRole,
      newRole,
      changedBy: adminUser.email,
      changedByUserId: adminUser.id,
    },
    req,
  });
}

/**
 * Log account activation/deactivation
 */
export async function logActiveStatusChange(
  targetUser: User,
  isActive: boolean,
  adminUser: User,
  req: Request
): Promise<void> {
  await logActivity({
    user: targetUser,
    action: isActive ? "user_activated" : "user_deactivated",
    details: {
      changedBy: adminUser.email,
      changedByUserId: adminUser.id,
    },
    req,
  });
}
