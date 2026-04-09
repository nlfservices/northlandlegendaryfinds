/**
 * Loyalty Program Router
 * Handles enrollment, points management, tier calculations, and reward redemptions
 */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import {
  loyaltyMembers,
  loyaltyTransactions,
  loyaltyRewards,
  loyaltyRedemptions,
} from "../../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { createGHLContact } from "../ghl";
import { nanoid } from "nanoid";

// ============================================================
// TIER CONFIGURATION
// ============================================================

export const TIER_CONFIG = {
  collector: { name: "Collector", minPoints: 0, color: "#6B7280", icon: "🃏" },
  silver: { name: "Silver", minPoints: 500, color: "#9CA3AF", icon: "🥈" },
  gold: { name: "Gold", minPoints: 2000, color: "#F59E0B", icon: "🥇" },
  legendary: { name: "Legendary", minPoints: 5000, color: "#8B5CF6", icon: "⚡" },
} as const;

export const TIER_ORDER = ["collector", "silver", "gold", "legendary"] as const;
type TierName = (typeof TIER_ORDER)[number];

export const POINTS_CONFIG = {
  /** Points per dollar spent */
  perDollar: 10,
  /** Bonus for signing up */
  signupBonus: 50,
  /** Bonus for newsletter subscription */
  newsletterBonus: 50,
  /** Bonus for Whatnot referral */
  referralBonus: 100,
  /** Bonus for social media follow */
  socialFollowBonus: 25,
  /** Birthday bonus */
  birthdayBonus: 200,
  /** Referrer bonus when someone they referred signs up */
  referrerBonus: 75,
} as const;

export const TIER_PERKS: Record<TierName, string[]> = {
  collector: [
    "Earn 10 points per $1 spent",
    "Birthday bonus points",
    "Access to members-only drawings",
    "Early notifications on new drops",
  ],
  silver: [
    "Everything in Collector tier",
    "1.25x points multiplier",
    "Free shipping on orders over $150",
    "Exclusive Silver-tier monthly drawing",
    "Early access to new products (12hr head start)",
  ],
  gold: [
    "Everything in Silver tier",
    "1.5x points multiplier",
    "Free shipping on orders over $99",
    "Exclusive Gold-tier monthly drawing",
    "Early access to new products (24hr head start)",
    "Priority customer support",
  ],
  legendary: [
    "Everything in Gold tier",
    "2x points multiplier",
    "Free shipping on ALL orders",
    "Exclusive Legendary-tier monthly drawing",
    "48hr early access to ALL drops",
    "Annual exclusive repack (free)",
    "Direct line to NLF team",
    "Name on the Legendary Wall of Fame",
  ],
};

/**
 * Calculate tier based on lifetime points
 */
function calculateTier(lifetimePoints: number): TierName {
  if (lifetimePoints >= TIER_CONFIG.legendary.minPoints) return "legendary";
  if (lifetimePoints >= TIER_CONFIG.gold.minPoints) return "gold";
  if (lifetimePoints >= TIER_CONFIG.silver.minPoints) return "silver";
  return "collector";
}

/**
 * Get points multiplier for a tier
 */
function getPointsMultiplier(tier: TierName): number {
  switch (tier) {
    case "legendary": return 2.0;
    case "gold": return 1.5;
    case "silver": return 1.25;
    default: return 1.0;
  }
}

/**
 * Generate a unique referral code
 */
function generateReferralCode(): string {
  return `NLF-${nanoid(8).toUpperCase()}`;
}

// ============================================================
// PUBLIC ROUTES (no auth required)
// ============================================================

export const loyaltyPublicRouter = router({
  /** Get tier configuration and perks (for landing page) */
  getTierInfo: publicProcedure.query(() => {
    return {
      tiers: TIER_ORDER.map((tier) => ({
        id: tier,
        ...TIER_CONFIG[tier],
        perks: TIER_PERKS[tier],
      })),
      pointsConfig: POINTS_CONFIG,
    };
  }),

  /** Enroll in the loyalty program (email-based, no auth required) */
  enroll: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string().min(1).max(100).optional(),
        lastName: z.string().max(100).optional(),
        birthday: z
          .string()
          .regex(/^\d{2}\/\d{2}$/, "Birthday must be MM/DD format")
          .optional(),
        referralCode: z.string().max(20).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Check if already enrolled
      const existing = await db
        .select()
        .from(loyaltyMembers)
        .where(eq(loyaltyMembers.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        return {
          success: true,
          isExisting: true,
          member: {
            id: existing[0].id,
            tier: existing[0].tier,
            pointsBalance: existing[0].pointsBalance,
            referralCode: existing[0].referralCode,
          },
        };
      }

      // Validate referral code if provided
      let referrerId: number | null = null;
      if (input.referralCode) {
        const referrer = await db
          .select()
          .from(loyaltyMembers)
          .where(eq(loyaltyMembers.referralCode, input.referralCode))
          .limit(1);
        if (referrer.length > 0) {
          referrerId = referrer[0].id;
        }
      }

      const referralCode = generateReferralCode();

      // Create the member
      const [newMember] = await db.insert(loyaltyMembers).values({
        email: input.email,
        firstName: input.firstName || null,
        lastName: input.lastName || null,
        birthday: input.birthday || null,
        referralCode,
        referredBy: input.referralCode || null,
        pointsBalance: POINTS_CONFIG.signupBonus,
        lifetimePoints: POINTS_CONFIG.signupBonus,
        tier: "collector",
        status: "active",
      });

      const memberId = newMember.insertId;

      // Log signup bonus transaction
      await db.insert(loyaltyTransactions).values({
        memberId,
        type: "signup_bonus",
        points: POINTS_CONFIG.signupBonus,
        balanceAfter: POINTS_CONFIG.signupBonus,
        description: "Welcome bonus for joining NLF Rewards!",
      });

      // Award referrer bonus if applicable
      if (referrerId) {
        const referrer = await db
          .select()
          .from(loyaltyMembers)
          .where(eq(loyaltyMembers.id, referrerId))
          .limit(1);

        if (referrer.length > 0) {
          const newBalance = referrer[0].pointsBalance + POINTS_CONFIG.referrerBonus;
          const newLifetime = referrer[0].lifetimePoints + POINTS_CONFIG.referrerBonus;
          const newTier = calculateTier(newLifetime);

          await db
            .update(loyaltyMembers)
            .set({
              pointsBalance: newBalance,
              lifetimePoints: newLifetime,
              tier: newTier,
            })
            .where(eq(loyaltyMembers.id, referrerId));

          await db.insert(loyaltyTransactions).values({
            memberId: referrerId,
            type: "referral",
            points: POINTS_CONFIG.referrerBonus,
            balanceAfter: newBalance,
            description: `Referral bonus: ${input.firstName || input.email} joined using your code!`,
            referenceId: String(memberId),
            referenceType: "referral",
          });
        }
      }

      // Create GHL contact with loyalty tag
      try {
        const ghlResult = await createGHLContact({
          email: input.email,
          firstName: input.firstName || undefined,
          lastName: input.lastName || undefined,
          tags: ["loyalty-member", "collector-tier"],
          source: "NLF Loyalty Program",
        });

        if (ghlResult.success && ghlResult.contactId) {
          await db
            .update(loyaltyMembers)
            .set({ ghlContactId: ghlResult.contactId })
            .where(eq(loyaltyMembers.id, memberId));
        }
      } catch (e) {
        console.error("[Loyalty] GHL sync failed:", e);
      }

      return {
        success: true,
        isExisting: false,
        member: {
          id: memberId,
          tier: "collector" as const,
          pointsBalance: POINTS_CONFIG.signupBonus,
          referralCode,
        },
      };
    }),

  /** Look up member status by email (public, limited info) */
  checkStatus: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const member = await db
        .select({
          id: loyaltyMembers.id,
          firstName: loyaltyMembers.firstName,
          tier: loyaltyMembers.tier,
          pointsBalance: loyaltyMembers.pointsBalance,
          lifetimePoints: loyaltyMembers.lifetimePoints,
          referralCode: loyaltyMembers.referralCode,
          joinedAt: loyaltyMembers.joinedAt,
        })
        .from(loyaltyMembers)
        .where(eq(loyaltyMembers.email, input.email))
        .limit(1);

      if (member.length === 0) {
        return { enrolled: false as const };
      }

      const m = member[0];
      const currentTier = m.tier as TierName;
      const currentTierIndex = TIER_ORDER.indexOf(currentTier);
      const nextTier = currentTierIndex < TIER_ORDER.length - 1 ? TIER_ORDER[currentTierIndex + 1] : null;
      const pointsToNextTier = nextTier ? TIER_CONFIG[nextTier].minPoints - m.lifetimePoints : 0;

      return {
        enrolled: true as const,
        member: {
          ...m,
          tierConfig: TIER_CONFIG[currentTier],
          perks: TIER_PERKS[currentTier],
          nextTier: nextTier
            ? {
                name: TIER_CONFIG[nextTier].name,
                pointsNeeded: Math.max(0, pointsToNextTier),
                minPoints: TIER_CONFIG[nextTier].minPoints,
              }
            : null,
        },
      };
    }),

  /** Get available rewards (public view) */
  getRewards: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const rewards = await db
      .select()
      .from(loyaltyRewards)
      .where(eq(loyaltyRewards.isActive, true))
      .orderBy(loyaltyRewards.pointsCost);

    return rewards;
  }),
});

// ============================================================
// PROTECTED ROUTES (require auth)
// ============================================================

export const loyaltyProtectedRouter = router({
  /** Get full member dashboard data */
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const email = ctx.user.email;
    if (!email) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "No email associated with account" });
    }

    const member = await db
      .select()
      .from(loyaltyMembers)
      .where(eq(loyaltyMembers.email, email))
      .limit(1);

    if (member.length === 0) {
      return { enrolled: false as const };
    }

    const m = member[0];
    const currentTier = m.tier as TierName;
    const currentTierIndex = TIER_ORDER.indexOf(currentTier);
    const nextTier = currentTierIndex < TIER_ORDER.length - 1 ? TIER_ORDER[currentTierIndex + 1] : null;

    // Get recent transactions
    const recentTransactions = await db
      .select()
      .from(loyaltyTransactions)
      .where(eq(loyaltyTransactions.memberId, m.id))
      .orderBy(desc(loyaltyTransactions.createdAt))
      .limit(20);

    // Get available rewards for their tier
    const availableRewards = await db
      .select()
      .from(loyaltyRewards)
      .where(eq(loyaltyRewards.isActive, true))
      .orderBy(loyaltyRewards.pointsCost);

    // Get their redemptions
    const redemptions = await db
      .select()
      .from(loyaltyRedemptions)
      .where(eq(loyaltyRedemptions.memberId, m.id))
      .orderBy(desc(loyaltyRedemptions.createdAt))
      .limit(10);

    return {
      enrolled: true as const,
      member: {
        id: m.id,
        email: m.email,
        firstName: m.firstName,
        lastName: m.lastName,
        tier: currentTier,
        tierConfig: TIER_CONFIG[currentTier],
        perks: TIER_PERKS[currentTier],
        pointsBalance: m.pointsBalance,
        lifetimePoints: m.lifetimePoints,
        referralCode: m.referralCode,
        birthday: m.birthday,
        joinedAt: m.joinedAt,
        nextTier: nextTier
          ? {
              name: TIER_CONFIG[nextTier].name,
              pointsNeeded: Math.max(0, TIER_CONFIG[nextTier].minPoints - m.lifetimePoints),
              minPoints: TIER_CONFIG[nextTier].minPoints,
            }
          : null,
        multiplier: getPointsMultiplier(currentTier),
      },
      recentTransactions,
      availableRewards: availableRewards.filter((r) => {
        const tierIndex = TIER_ORDER.indexOf(r.minTier as TierName);
        return tierIndex <= currentTierIndex;
      }),
      redemptions,
    };
  }),

  /** Redeem a reward */
  redeemReward: protectedProcedure
    .input(z.object({ rewardId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const email = ctx.user.email;
      if (!email) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No email associated with account" });
      }

      const member = await db
        .select()
        .from(loyaltyMembers)
        .where(eq(loyaltyMembers.email, email))
        .limit(1);

      if (member.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Not a loyalty member" });
      }

      const m = member[0];

      const reward = await db
        .select()
        .from(loyaltyRewards)
        .where(eq(loyaltyRewards.id, input.rewardId))
        .limit(1);

      if (reward.length === 0 || !reward[0].isActive) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Reward not available" });
      }

      const r: typeof reward[number] = reward[0];

      // Check tier requirement
      const memberTierIndex = TIER_ORDER.indexOf(m.tier as TierName);
      const requiredTierIndex = TIER_ORDER.indexOf(r.minTier as TierName);
      if (memberTierIndex < requiredTierIndex) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Requires ${TIER_CONFIG[r.minTier as TierName].name} tier or higher`,
        });
      }

      // Check points
      if (m.pointsBalance < r.pointsCost) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Not enough points. Need ${r.pointsCost}, have ${m.pointsBalance}`,
        });
      }

      // Check max redemptions
      if (r.maxRedemptions && r.redemptionCount >= r.maxRedemptions) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Reward is sold out" });
      }

      const newBalance = m.pointsBalance - r.pointsCost;

      // Deduct points
      await db
        .update(loyaltyMembers)
        .set({ pointsBalance: newBalance })
        .where(eq(loyaltyMembers.id, m.id));

      // Log transaction
      await db.insert(loyaltyTransactions).values({
        memberId: m.id,
        type: "redemption",
        points: -r.pointsCost,
        balanceAfter: newBalance,
        description: `Redeemed: ${r.name}`,
        referenceId: String(r.id),
        referenceType: "reward",
      });

      // Create redemption record
      const code = r.rewardType === "discount_code" ? `NLF-${nanoid(8).toUpperCase()}` : undefined;

      await db.insert(loyaltyRedemptions).values({
        memberId: m.id,
        rewardId: r.id,
        pointsSpent: r.pointsCost,
        status: "pending",
        code,
      });

      // Increment redemption count
      await db
        .update(loyaltyRewards)
        .set({ redemptionCount: sql`${loyaltyRewards.redemptionCount} + 1` })
        .where(eq(loyaltyRewards.id, r.id));

      return {
        success: true,
        code,
        reward: r.name,
        pointsSpent: r.pointsCost,
        newBalance,
      };
    }),
});

// ============================================================
// ADMIN ROUTES
// ============================================================

export const loyaltyAdminRouter = router({
  /** Get all loyalty members with stats */
  getMembers: protectedProcedure
    .input(
      z.object({
        tier: z.enum(["collector", "silver", "gold", "legendary"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const conditions = [];
      if (input?.tier) {
        conditions.push(eq(loyaltyMembers.tier, input.tier));
      }

      const members = await db
        .select()
        .from(loyaltyMembers)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(loyaltyMembers.lifetimePoints))
        .limit(input?.limit ?? 50)
        .offset(input?.offset ?? 0);

      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(loyaltyMembers)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      return {
        members,
        total: countResult.count,
      };
    }),

  /** Manually adjust a member's points (admin only) */
  adjustPoints: protectedProcedure
    .input(
      z.object({
        memberId: z.number(),
        points: z.number(), // positive to add, negative to deduct
        reason: z.string().min(1).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const member = await db
        .select()
        .from(loyaltyMembers)
        .where(eq(loyaltyMembers.id, input.memberId))
        .limit(1);

      if (member.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
      }

      const m = member[0];
      const newBalance = Math.max(0, m.pointsBalance + input.points);
      const newLifetime = input.points > 0 ? m.lifetimePoints + input.points : m.lifetimePoints;
      const newTier = calculateTier(newLifetime);

      await db
        .update(loyaltyMembers)
        .set({
          pointsBalance: newBalance,
          lifetimePoints: newLifetime,
          tier: newTier,
        })
        .where(eq(loyaltyMembers.id, m.id));

      await db.insert(loyaltyTransactions).values({
        memberId: m.id,
        type: "admin_adjustment",
        points: input.points,
        balanceAfter: newBalance,
        description: `Admin adjustment: ${input.reason}`,
        referenceType: "admin",
      });

      return {
        success: true,
        newBalance,
        newLifetime,
        newTier,
      };
    }),

  /** Manage rewards (create/update) */
  upsertReward: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        pointsCost: z.number().min(1),
        minTier: z.enum(["collector", "silver", "gold", "legendary"]),
        rewardType: z.enum([
          "discount_code", "free_shipping", "exclusive_repack",
          "drawing_entry", "early_access", "merch", "custom",
        ]),
        rewardValue: z.string().optional(),
        imageUrl: z.string().optional(),
        isActive: z.boolean().default(true),
        maxRedemptions: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      if (input.id) {
        await db
          .update(loyaltyRewards)
          .set({
            name: input.name,
            description: input.description || null,
            pointsCost: input.pointsCost,
            minTier: input.minTier,
            rewardType: input.rewardType,
            rewardValue: input.rewardValue || null,
            imageUrl: input.imageUrl || null,
            isActive: input.isActive,
            maxRedemptions: input.maxRedemptions || null,
          })
          .where(eq(loyaltyRewards.id, input.id));

        return { success: true, id: input.id };
      }

      const [result] = await db.insert(loyaltyRewards).values({
        name: input.name,
        description: input.description || null,
        pointsCost: input.pointsCost,
        minTier: input.minTier,
        rewardType: input.rewardType,
        rewardValue: input.rewardValue || null,
        imageUrl: input.imageUrl || null,
        isActive: input.isActive,
        maxRedemptions: input.maxRedemptions || null,
      });

      return { success: true, id: result.insertId };
    }),

  /** Get loyalty program stats */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const [totalMembers] = await db
      .select({ count: sql<number>`count(*)` })
      .from(loyaltyMembers);

    const tierCounts = await db
      .select({
        tier: loyaltyMembers.tier,
        count: sql<number>`count(*)`,
      })
      .from(loyaltyMembers)
      .groupBy(loyaltyMembers.tier);

    const [totalPointsIssued] = await db
      .select({
        total: sql<number>`COALESCE(SUM(CASE WHEN ${loyaltyTransactions.points} > 0 THEN ${loyaltyTransactions.points} ELSE 0 END), 0)`,
      })
      .from(loyaltyTransactions);

    const [totalRedemptions] = await db
      .select({ count: sql<number>`count(*)` })
      .from(loyaltyRedemptions);

    return {
      totalMembers: totalMembers.count,
      tierBreakdown: Object.fromEntries(
        TIER_ORDER.map((t) => [t, tierCounts.find((tc: { tier: string; count: number }) => tc.tier === t)?.count ?? 0])
      ),
      totalPointsIssued: totalPointsIssued.total,
      totalRedemptions: totalRedemptions.count,
    };
  }),
});
