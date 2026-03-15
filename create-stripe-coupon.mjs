import Stripe from "stripe";
import dotenv from "dotenv";
import { resolve } from "path";

// Load env from the project
dotenv.config({ path: resolve("/home/ubuntu/northland-legendary-finds/.env") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createLegendary10Coupon() {
  try {
    // Step 1: Create a 10% off coupon
    console.log("Creating 10% off coupon...");
    const coupon = await stripe.coupons.create({
      percent_off: 10,
      duration: "once", // One-time use per customer
      name: "LEGENDARY10 - 10% Off First Order",
      metadata: {
        source: "email_popup",
        description: "Welcome discount for new email subscribers",
      },
    });
    console.log("✅ Coupon created:", coupon.id);

    // Step 2: Create a promotion code "LEGENDARY10" linked to the coupon
    console.log("Creating promotion code LEGENDARY10...");
    const promoCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: "LEGENDARY10",
      active: true,
      metadata: {
        source: "email_popup",
        description: "10% off first order for email subscribers",
      },
    });
    console.log("✅ Promotion code created:", promoCode.code, "(ID:", promoCode.id, ")");

    console.log("\n🎉 Done! LEGENDARY10 promo code is now active in Stripe.");
    console.log("Coupon ID:", coupon.id);
    console.log("Promo Code:", promoCode.code);
    console.log("Discount: 10% off (one-time use)");
  } catch (error) {
    if (error.code === "resource_already_exists") {
      console.log("⚠️ Promotion code LEGENDARY10 already exists in Stripe.");
    } else {
      console.error("❌ Error:", error.message);
    }
  }
}

createLegendary10Coupon();
