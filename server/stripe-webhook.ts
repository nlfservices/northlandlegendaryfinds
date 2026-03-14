import Stripe from "stripe";
import type { Express, Request, Response } from "express";
import express from "express";
import { getDb } from "./db";
import { orders, users, repackProducts } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia" as any,
});

/**
 * Register the Stripe webhook route on the Express app.
 * MUST be registered BEFORE express.json() middleware to get raw body.
 */
export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!sig || !webhookSecret) {
        console.error("[Stripe Webhook] Missing signature or webhook secret");
        return res.status(400).json({ error: "Missing signature or webhook secret" });
      }

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
      }

      // Handle test events for webhook verification
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutCompleted(session);
            break;
          }
          case "payment_intent.succeeded": {
            console.log(`[Stripe Webhook] Payment intent succeeded: ${(event.data.object as any).id}`);
            break;
          }
          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
      } catch (err: any) {
        console.error(`[Stripe Webhook] Error handling ${event.type}:`, err);
        // Still return 200 to acknowledge receipt — Stripe will retry otherwise
      }

      res.json({ received: true });
    }
  );
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  const metadata = session.metadata || {};
  const productSlug = metadata.product_slug;
  const quantity = parseInt(metadata.quantity || "1", 10);
  const userId = metadata.user_id ? parseInt(metadata.user_id, 10) : null;

  // Find the product by slug
  let productId: number | null = null;
  if (productSlug) {
    const productResult = await db
      .select()
      .from(repackProducts)
      .where(eq(repackProducts.slug, productSlug))
      .limit(1);
    if (productResult.length > 0) {
      productId = productResult[0].id;
    }
  }

  // Extract shipping address
  // Note: shipping_details exists on Stripe Session but may not be in the installed type definitions
  const sessionAny = session as any;
  let shippingAddress = null;
  if (sessionAny.shipping_details?.address) {
    shippingAddress = {
      name: sessionAny.shipping_details.name,
      line1: sessionAny.shipping_details.address.line1,
      line2: sessionAny.shipping_details.address.line2,
      city: sessionAny.shipping_details.address.city,
      state: sessionAny.shipping_details.address.state,
      postalCode: sessionAny.shipping_details.address.postal_code,
      country: sessionAny.shipping_details.address.country,
    };
  }

  // Create the order record
  await db.insert(orders).values({
    userId: userId,
    stripeSessionId: session.id,
    stripePaymentIntentId: (session.payment_intent as string) || null,
    productId: productId || 0,
    quantity: quantity,
    amountCents: session.amount_total || 0,
    currency: session.currency || "usd",
    status: "paid",
    customerEmail: session.customer_details?.email || metadata.customer_email || null,
    customerName: session.customer_details?.name || metadata.customer_name || null,
    shippingAddress: shippingAddress,
    paidAt: new Date(),
  });

  // Update Stripe customer ID on user if available
  if (userId && session.customer) {
    await db
      .update(users)
      .set({ stripeCustomerId: session.customer as string })
      .where(eq(users.id, userId));
  }

  console.log(
    `[Stripe Webhook] Order created for session ${session.id} — product: ${productSlug}, amount: $${((session.amount_total || 0) / 100).toFixed(2)}`
  );
}
