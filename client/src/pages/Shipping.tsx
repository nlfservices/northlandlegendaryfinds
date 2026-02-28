/**
 * Shipping & Returns Page
 */

import { Package, Truck, Clock, Shield, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Shipping() {
  return (
    <div className="min-h-screen">
      <section className="py-12 border-b border-border">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            SHIPPING & <span className="text-primary">RETURNS</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Fast, secure shipping with transparent return policies
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-4xl">
          {/* Shipping Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <Truck className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-1">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders over $199</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <Clock className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-1">Ships in 24 Hours</h3>
              <p className="text-sm text-muted-foreground">Fast processing guaranteed</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <Shield className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-1">Secure Packaging</h3>
              <p className="text-sm text-muted-foreground">Cards protected in transit</p>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-primary">SHIPPING</span> INFORMATION
              </h2>
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Domestic Shipping (United States)</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Package className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong className="text-foreground">Standard Shipping:</strong> $8.99 flat rate, 3-5 business days (FREE on orders over $199)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Package className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong className="text-foreground">Priority Shipping:</strong> $14.99, 2-3 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Package className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong className="text-foreground">Express Shipping:</strong> $24.99, 1-2 business days</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">International Shipping</h3>
                  <p className="text-muted-foreground">International shipping is not currently available. We plan to offer international shipping in the future. Sign up for our newsletter to be notified.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Order Processing</h3>
                  <p className="text-muted-foreground">All orders are processed within 24 hours of purchase (excluding weekends and holidays). You will receive a shipping confirmation email with tracking information once your order has shipped.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Packaging</h3>
                  <p className="text-muted-foreground">All cards are sealed in our custom NLF holographic mylar bags and placed in protective top loaders or card savers. Orders are shipped in rigid mailers with bubble wrap protection to ensure your cards arrive in pristine condition.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                <span className="text-primary">RETURN</span> POLICY
              </h2>
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Unopened Repacks</h3>
                  <p className="text-muted-foreground">Unopened, sealed repacks may be returned within 14 days of delivery for a full refund. The pack must be in its original sealed condition with the NLF holographic seal intact. Return shipping is the responsibility of the buyer.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Opened Repacks</h3>
                  <p className="text-muted-foreground">Due to the nature of trading card repacks, all sales are final once a pack has been opened. We cannot accept returns on opened packs as we cannot verify the contents have not been altered.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Sealed Products (Hobby Boxes)</h3>
                  <p className="text-muted-foreground">Sealed hobby boxes may be returned within 14 days of delivery in their original, unopened condition for a full refund. Return shipping is the responsibility of the buyer.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Damaged Items</h3>
                  <p className="text-muted-foreground">If your order arrives damaged, please contact us within 48 hours of delivery at info@nlfservices.com with photos of the damage. We will replace the item or issue a full refund at our discretion.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Refund Processing</h3>
                  <p className="text-muted-foreground">Refunds are processed within 3-5 business days of receiving the returned item. The refund will be credited to your original payment method. Please allow an additional 5-10 business days for the refund to appear on your statement.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-4">Have questions about shipping or returns?</p>
            <Link href="/contact">
              <button className="text-primary font-bold hover:underline">Contact Us</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
