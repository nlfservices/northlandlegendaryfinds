import { z } from "zod";
import { eq, desc, like, or, sql } from "drizzle-orm";
import { adminProcedure, ownerProcedure, superAdminProcedure, router, ROLE_LEVELS } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

// Roles that can be assigned (owner is never assignable via UI)
const ASSIGNABLE_ROLES = ["super_admin", "admin", "subscriber", "user"] as const;
type AssignableRole = typeof ASSIGNABLE_ROLES[number];

export const userManagementRouter = router({
  /** List all users with pagination and search */
  list: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(50),
      search: z.string().optional(),
      role: z.enum(["owner", "super_admin", "admin", "subscriber", "user", "all"]).default("all"),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const offset = (input.page - 1) * input.limit;

      let query = db.select().from(users).$dynamic();

      const conditions = [];
      if (input.search) {
        conditions.push(
          or(
            like(users.name, `%${input.search}%`),
            like(users.email, `%${input.search}%`),
          )
        );
      }
      if (input.role !== "all") {
        conditions.push(eq(users.role, input.role));
      }

      if (conditions.length > 0) {
        query = query.where(conditions.length === 1 ? conditions[0]! : sql`${conditions[0]} AND ${conditions[1]}`);
      }

      const allUsers = await query.orderBy(desc(users.createdAt)).limit(input.limit).offset(offset);

      // Count total
      const countResult = await db.select({ count: sql<number>`count(*)` }).from(users);
      const total = Number(countResult[0]?.count ?? 0);

      return {
        users: allUsers,
        total,
        page: input.page,
        limit: input.limit,
        totalPages: Math.ceil(total / input.limit),
      };
    }),

  /** Get a single user by ID */
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const result = await db.select().from(users).where(eq(users.id, input.id)).limit(1);
      if (!result[0]) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      return result[0];
    }),

  /** Assign a role to a user — owner role can never be assigned via this endpoint */
  assignRole: superAdminProcedure
    .input(z.object({
      userId: z.number(),
      role: z.enum(ASSIGNABLE_ROLES),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Fetch the target user
      const targetResult = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      const target = targetResult[0];
      if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      // Cannot change the owner's role — ever
      if (target.role === "owner") {
        throw new TRPCError({ code: "FORBIDDEN", message: "The Owner's role cannot be changed" });
      }

      // Super admins cannot assign super_admin role (only owner can)
      if (input.role === "super_admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only the Owner can assign Super Admin role" });
      }

      // Cannot assign a role higher than your own
      const callerLevel = ROLE_LEVELS[ctx.user.role] ?? 0;
      const targetLevel = ROLE_LEVELS[input.role] ?? 0;
      if (targetLevel >= callerLevel) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You cannot assign a role equal to or higher than your own" });
      }

      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
      return { success: true, userId: input.userId, newRole: input.role };
    }),

  /** Remove a user (soft delete by downgrading to 'user' role, or hard delete) */
  removeUser: superAdminProcedure
    .input(z.object({
      userId: z.number(),
      hardDelete: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const targetResult = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      const target = targetResult[0];
      if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      // Cannot remove the owner
      if (target.role === "owner") {
        throw new TRPCError({ code: "FORBIDDEN", message: "The Owner account cannot be removed" });
      }

      // Cannot remove someone with a higher or equal role
      const callerLevel = ROLE_LEVELS[ctx.user.role] ?? 0;
      const targetLevel = ROLE_LEVELS[target.role] ?? 0;
      if (targetLevel >= callerLevel) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You cannot remove a user with equal or higher role" });
      }

      if (input.hardDelete) {
        await db.delete(users).where(eq(users.id, input.userId));
        return { success: true, action: "deleted" };
      } else {
        // Soft: downgrade to 'user'
        await db.update(users).set({ role: "user" }).where(eq(users.id, input.userId));
        return { success: true, action: "downgraded" };
      }
    }),

  /** Get role summary stats */
  stats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, byRole: {} };

    const result = await db.select({
      role: users.role,
      count: sql<number>`count(*)`,
    }).from(users).groupBy(users.role);

    const byRole: Record<string, number> = {};
    let total = 0;
    for (const row of result) {
      byRole[row.role] = Number(row.count);
      total += Number(row.count);
    }

    return { total, byRole };
  }),
});
