/**
 * User Invite System
 * - Admin/Super Admin/Owner can invite users by email with a pre-assigned role
 * - Sends an invitation email with a signup link
 * - When the invited user signs up, their role is auto-assigned
 */
import { z } from "zod";
import { router, adminProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { userInvites, users } from "../../drizzle/schema";
import { eq, and, gt, desc } from "drizzle-orm";
import crypto from "crypto";
import { ENV } from "../_core/env";

const ROLE_HIERARCHY = ["user", "subscriber", "admin", "super_admin", "owner"] as const;
type Role = typeof ROLE_HIERARCHY[number];

function canAssignRole(assignerRole: string, targetRole: string): boolean {
  const assignerIdx = ROLE_HIERARCHY.indexOf(assignerRole as Role);
  const targetIdx = ROLE_HIERARCHY.indexOf(targetRole as Role);
  // Can only assign roles strictly below your own level
  return assignerIdx > targetIdx;
}

async function sendInviteEmail(params: {
  toEmail: string;
  inviteToken: string;
  role: string;
  inviterName: string;
  personalMessage?: string;
  siteUrl: string;
}) {
  const { toEmail, inviteToken, role, inviterName, personalMessage, siteUrl } = params;
  const inviteUrl = `${siteUrl}/join?token=${inviteToken}`;
  const roleLabel = role.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase());

  const emailBody = `
You've been invited to join Northland Legendary Finds as a ${roleLabel}.

${personalMessage ? `Message from ${inviterName}: "${personalMessage}"\n\n` : ""}Click the link below to create your account. This invitation expires in 7 days.

${inviteUrl}

If you did not expect this invitation, you can safely ignore this email.

— The NLF Team
northlandlegendaryfinds.com
  `.trim();

  // Use GHL API to send email if available, otherwise log the invite link
  if (ENV.ghlApiKey) {
    try {
      const response = await fetch("https://services.leadconnectorhq.com/conversations/messages/outbound", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ENV.ghlApiKey}`,
          "Content-Type": "application/json",
          Version: "2021-04-15",
        },
        body: JSON.stringify({
          type: "Email",
          contactId: null,
          toEmail,
          subject: `You're invited to Northland Legendary Finds — ${roleLabel} Access`,
          message: emailBody,
          html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e5e7eb; padding: 40px; border-radius: 12px;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="color: #22c55e; font-size: 24px; margin: 0;">Northland Legendary Finds</h1>
    <p style="color: #9ca3af; margin: 8px 0 0;">Your Marvel Collector Hub</p>
  </div>
  <h2 style="color: #f9fafb; font-size: 20px;">You've been invited!</h2>
  <p style="color: #d1d5db; line-height: 1.6;">
    <strong>${inviterName}</strong> has invited you to join <strong>Northland Legendary Finds</strong> as a <strong style="color: #22c55e;">${roleLabel}</strong>.
  </p>
  ${personalMessage ? `<blockquote style="border-left: 3px solid #22c55e; padding-left: 16px; color: #9ca3af; font-style: italic;">"${personalMessage}"</blockquote>` : ""}
  <div style="text-align: center; margin: 32px 0;">
    <a href="${inviteUrl}" style="background: #22c55e; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Accept Invitation</a>
  </div>
  <p style="color: #6b7280; font-size: 14px; text-align: center;">This invitation expires in 7 days. If you didn't expect this, you can safely ignore it.</p>
  <hr style="border: none; border-top: 1px solid #1f2937; margin: 24px 0;" />
  <p style="color: #4b5563; font-size: 12px; text-align: center;">northlandlegendaryfinds.com</p>
</div>
          `,
        }),
      });
      if (!response.ok) {
        console.warn("[Invites] GHL email send failed:", await response.text());
      }
    } catch (err) {
      console.warn("[Invites] GHL email error:", err);
    }
  } else {
    // Fallback: log the invite link so admin can share it manually
    console.log(`[Invites] No email provider configured. Invite link for ${toEmail}: ${inviteUrl}`);
  }
}

export const invitesRouter = router({
  /** Create and send an invitation */
  create: adminProcedure
    .input(z.object({
      email: z.string().email(),
      role: z.enum(["subscriber", "admin", "super_admin", "user"]),
      message: z.string().max(500).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const inviterRole = ctx.user.role;

      // Role permission check
      if (!canAssignRole(inviterRole, input.role)) {
        throw new Error(`You cannot assign the role "${input.role}" — it is equal to or higher than your own role.`);
      }

      // Check if there's already a pending invite for this email
      const existing = await db
        .select()
        .from(userInvites)
        .where(and(
          eq(userInvites.email, input.email),
          eq(userInvites.accepted, false),
          gt(userInvites.expiresAt, new Date()),
        ))
        .limit(1);

      if (existing.length > 0) {
        throw new Error(`An active invitation already exists for ${input.email}. Revoke it first or wait for it to expire.`);
      }

      // Check if user already has an account
      const existingUser = await db
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser.length > 0) {
        // User already exists — just update their role directly
        await db
          .update(users)
          .set({ role: input.role })
          .where(eq(users.email, input.email));
        return { success: true, alreadyExists: true, message: `${input.email} already has an account. Their role has been updated to ${input.role}.` };
      }

      // Generate secure token
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await db.insert(userInvites).values({
        email: input.email,
        role: input.role,
        token,
        invitedByUserId: ctx.user.id,
        message: input.message,
        expiresAt,
        accepted: false,
      });

      const siteUrl = process.env.SITE_URL || "https://northlandlegendaryfinds.com";
      await sendInviteEmail({
        toEmail: input.email,
        inviteToken: token,
        role: input.role,
        inviterName: ctx.user.name || "The NLF Team",
        personalMessage: input.message,
        siteUrl,
      });

      return { success: true, alreadyExists: false, message: `Invitation sent to ${input.email}` };
    }),

  /** List all invitations */
  list: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const invites = await db
        .select()
        .from(userInvites)
        .orderBy(desc(userInvites.createdAt))
        .limit(100);
      return invites;
    }),

  /** Revoke a pending invitation */
  revoke: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.delete(userInvites).where(eq(userInvites.id, input.id));
      return { success: true };
    }),

  /** Resend an invitation email */
  resend: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const invite = await db
        .select()
        .from(userInvites)
        .where(eq(userInvites.id, input.id))
        .limit(1);

      if (!invite[0]) throw new Error("Invite not found");
      if (invite[0].accepted) throw new Error("This invite has already been accepted");

      // Extend expiry by 7 more days
      const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await db
        .update(userInvites)
        .set({ expiresAt: newExpiry })
        .where(eq(userInvites.id, input.id));

      const siteUrl = process.env.SITE_URL || "https://northlandlegendaryfinds.com";
      await sendInviteEmail({
        toEmail: invite[0].email,
        inviteToken: invite[0].token,
        role: invite[0].role,
        inviterName: ctx.user.name || "The NLF Team",
        personalMessage: invite[0].message ?? undefined,
        siteUrl,
      });

      return { success: true, message: `Invitation resent to ${invite[0].email}` };
    }),

  /** Get invite details by token (public — used on the /join page) */
  getByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const invite = await db
        .select({
          id: userInvites.id,
          email: userInvites.email,
          role: userInvites.role,
          accepted: userInvites.accepted,
          expiresAt: userInvites.expiresAt,
        })
        .from(userInvites)
        .where(eq(userInvites.token, input.token))
        .limit(1);

      if (!invite[0]) return null;
      if (invite[0].accepted) return { ...invite[0], expired: false, alreadyAccepted: true };
      if (new Date() > invite[0].expiresAt) return { ...invite[0], expired: true, alreadyAccepted: false };
      return { ...invite[0], expired: false, alreadyAccepted: false };
    }),
});
