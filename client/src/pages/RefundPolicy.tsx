/**
 * Refund Policy Page
 * 
 * Design: NLF Cosmic theme — black bg, green (#00FF41) accents, purple highlights
 * Policy: ALL SALES FINAL on repacks — industry standard per Blowout Cards, Giant Sports Cards, Hit Parade
 * Sealed products: rare exceptions with 15% restocking fee
 * Damaged items: report within 48 hours, DO NOT open
 */

import { AlertTriangle, ShieldX, Package, HelpCircle } from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Refund Policy"
        description="Refund and return policy for Northland Legendary Finds trading card repacks. Learn about our satisfaction guarantee and return process."
        path="/refund-policy"
        jsonLd={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Refund Policy", url: "/refund-policy" }])}
      />
      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            REFUND <span className="text-primary">POLICY</span>
          </h1>
          <p className="text-muted-foreground">Last updated: March 1, 2026</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-4xl space-y-10">

          {/* All Sales Final Banner */}
          <div className="bg-destructive/10 border border-destructive/40 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <ShieldX className="w-8 h-8 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-destructive mb-2">ALL SALES ARE FINAL</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Due to the volatility and fluctuating prices in the trading card market, <strong className="text-foreground">all sales are final</strong>. 
                  This is standard industry practice across all major trading card retailers. If the price of a product increases after your purchase, 
                  we will never attempt to increase your price. Conversely, if the price decreases after your purchase, no refund will be issued for 
                  the difference.
                </p>
              </div>
            </div>
          </div>

          {/* Repack Products */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              Repack Products — No Returns, No Exceptions
            </h2>
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">All repack purchases are final — opened or unopened.</strong> This includes all NLF repack products 
                such as NLF Variant, Shadows of the Force, and any future repack releases. Due to the nature of mystery/repack products, we cannot 
                accept returns under any circumstances.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By purchasing a repack product, you acknowledge and agree that:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">›</span>
                  <span>The contents of each repack are randomized and vary from pack to pack</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">›</span>
                  <span>Every pack contains a guaranteed hit, but the specific cards cannot be chosen or predicted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">›</span>
                  <span>The perceived value of cards is subjective and may differ from the purchase price</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">›</span>
                  <span>No refunds, returns, exchanges, or credits will be issued for repack products</span>
                </li>
              </ul>
              <div className="bg-muted/30 rounded-lg p-4 mt-4">
                <p className="text-xs text-muted-foreground italic">
                  This policy is consistent with industry standards set by leading trading card retailers including Blowout Cards, 
                  Giant Sports Cards, and Hit Parade. The nature of mystery/repack products makes returns impractical, as the 
                  integrity of the product cannot be verified once it leaves our facility.
                </p>
              </div>
            </div>
          </div>

          {/* Sealed Products */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Package className="w-6 h-6 text-purple-400" />
              Sealed Products (Hobby Boxes, Blasters)
            </h2>
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">All sales of sealed products are final.</strong> Under certain rare circumstances, 
                returns of factory-sealed product may be considered on a case-by-case basis, but will be subject to a 
                <strong className="text-foreground"> 15% restocking fee</strong>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                To be eligible for consideration, the product must be:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">›</span>
                  <span>In its original, factory-sealed condition with no signs of tampering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">›</span>
                  <span>Returned within 7 days of delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">›</span>
                  <span>Approved by NLF customer service prior to return shipment</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed text-sm">
                <strong className="text-foreground">Opened sealed products cannot be returned under any circumstances.</strong> Return 
                shipping costs are the responsibility of the buyer. We recommend using a trackable shipping service and purchasing 
                shipping insurance, as we cannot guarantee receipt of returned items.
              </p>
            </div>
          </div>

          {/* Damaged Items */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              Damaged or Incorrect Orders
            </h2>
            <div className="bg-card rounded-xl border border-amber-500/20 p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                The only exception to our all-sales-final policy is if <strong className="text-foreground">we make an error with your order</strong> or 
                your items arrive damaged due to shipping. In these cases:
              </p>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-sm font-bold text-amber-400 mb-2">IMPORTANT: DO NOT open damaged items</p>
                <p className="text-sm text-muted-foreground">
                  If your package appears damaged upon delivery, do not open the items. Opening damaged products may void 
                  our ability to provide a full resolution. Document the damage with photos first.
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To report a damaged or incorrect order:
              </p>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">1.</span>
                  <span>Contact us within <strong className="text-foreground">48 hours</strong> of delivery at{" "}
                    <a href="mailto:info@nlfservices.com" className="text-primary hover:underline">info@nlfservices.com</a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">2.</span>
                  <span>Include your order number, photos of the damage (both item and packaging), and a description of the issue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">3.</span>
                  <span>We will review your claim and respond within 24 hours with a resolution</span>
                </li>
              </ol>
              <p className="text-sm text-muted-foreground">
                At our discretion, we will either replace the item or work with you on an appropriate resolution. 
                Return shipping for verified damaged items will be covered by NLF.
              </p>
            </div>
          </div>

          {/* Cancellations */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Order Cancellations</h2>
            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                If you need to cancel an order before it has been shipped, contact us immediately at{" "}
                <a href="mailto:info@nlfservices.com" className="text-primary hover:underline">info@nlfservices.com</a>. 
                We process orders quickly, so cancellation is not guaranteed.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If a cancellation is granted before shipment, a <strong className="text-foreground">15% cancellation fee</strong> will 
                be deducted from your refund to cover processing and handling costs. Orders that have already shipped cannot be cancelled.
              </p>
            </div>
          </div>

          {/* Pre-Orders */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Pre-Orders</h2>
            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">All pre-order sales are final.</strong> Product pricing is determined at the time of 
                purchase and may change at any time before or after release. No refunds, credits, or price adjustments will be issued 
                for market fluctuations.
              </p>
            </div>
          </div>

          {/* Right to Refuse */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Right to Refuse or Cancel Orders</h2>
            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                Northland Legendary Finds reserves the right to refuse or cancel any order for any reason, including but not limited to: 
                limitations on quantities available for purchase, inaccuracies or errors in product or pricing information, or problems 
                identified through our efforts to prevent fraud or account abuse.
              </p>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-muted/20 rounded-xl border border-border p-6 text-center">
            <HelpCircle className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Questions About Our Policy?</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              If you have any questions about our refund policy, please don't hesitate to reach out.
            </p>
            <a
              href="mailto:info@nlfservices.com"
              className="inline-block bg-primary text-primary-foreground font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
