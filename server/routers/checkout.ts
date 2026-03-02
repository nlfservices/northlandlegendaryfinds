import Stripe from "stripe";
import { z } from "zod";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { orders, repackProducts, users } from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia" as any,
});

// Product definitions for Stripe checkout (maps static product IDs to pricing)
const PRODUCT_PRICES: Record<string, { name: string; priceInCents: number; description: string }> = {
  "nlf-variant": {
    name: "NLF Variant — Marvel Trading Card Repack",
    priceInCents: 10000, // $100.00
    description: "Hand-curated premium Marvel trading card repack with guaranteed hit. Limited to 500 packs.",
  },
  "shadows-of-the-force": {
    name: "Shadows of the Force — Star Wars Trading Card Repack",
    priceInCents: 10000, // $100.00
    description: "Premium Star Wars trading card repack with guaranteed hit. Limited to 500 packs.",
  },
};

export const checkoutRouter = router({
  /** Create a Stripe Checkout Session for a product */
  createSession: publicProcedure
    .input(
      z.object({
        productSlug: z.string(),
        quantity: z.number().int().min(1).max(5).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const productInfo = PRODUCT_PRICES[input.productSlug];
      if (!productInfo) {
        throw new Error(`Product not found: ${input.productSlug}`);
      }

      const origin = ctx.req.headers.origin || ctx.req.headers.referer?.replace(/\/$/, "") || "https://northlandlegendaryfinds.com";

      // Build metadata for webhook
      const metadata: Record<string, string> = {
        product_slug: input.productSlug,
        quantity: input.quantity.toString(),
      };

      if (ctx.user) {
        metadata.user_id = ctx.user.id.toString();
        metadata.customer_email = ctx.user.email || "";
        metadata.customer_name = ctx.user.name || "";
      }

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: productInfo.name,
                description: productInfo.description,
              },
              unit_amount: productInfo.priceInCents,
            },
            quantity: input.quantity,
          },
        ],
        allow_promotion_codes: true,
        shipping_address_collection: {
          allowed_countries: ["US"],
        },
        metadata,
        client_reference_id: ctx.user?.id?.toString() || undefined,
        success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/product/${input.productSlug}`,
      };

      // Prefill email if user is logged in
      if (ctx.user?.email) {
        sessionParams.customer_email = ctx.user.email;
      }

      const session = await stripe.checkout.sessions.create(sessionParams);

      return { url: session.url };
    }),

  /** Get order by Stripe session ID (for success page) */
  getOrderBySession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.stripeSessionId, input.sessionId))
        .limit(1);

      return result.length > 0 ? result[0] : null;
    }),

  /** Get current user's orders */
  myOrders: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id))
      .orderBy(desc(orders.createdAt));
  }),

  /** Admin: Get all orders */
  allOrders: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }),

  /** Admin: Update order status (shipped, tracking, etc.) */
  updateOrderStatus: adminProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled", "refunded"]),
        trackingNumber: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: Record<string, unknown> = {
        status: input.status,
      };

      if (input.trackingNumber !== undefined) {
        updateData.trackingNumber = input.trackingNumber;
      }
      if (input.notes !== undefined) {
        updateData.notes = input.notes;
      }
      if (input.status === "shipped") {
        updateData.shippedAt = new Date();
      }

      await db.update(orders).set(updateData).where(eq(orders.id, input.orderId));

      return { success: true };
    }),
});
