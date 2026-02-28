/**
 * Refund Policy Page
 */

export default function RefundPolicy() {
  return (
    <div className="min-h-screen">
      <section className="py-12 border-b border-border">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            REFUND <span className="text-primary">POLICY</span>
          </h1>
          <p className="text-muted-foreground">Last updated: February 28, 2026</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="prose prose-invert max-w-none space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Northland Legendary Finds, we want you to be completely satisfied with your purchase. Due to the nature of trading card repacks and sealed products, our refund policy has specific conditions based on the product type and condition.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Repack Products (NLF Variant, Shadows of the Force, etc.)</h2>
              <div className="bg-card rounded-xl border border-border p-6 space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Unopened repacks:</strong> May be returned within 14 days of delivery for a full refund. The pack must be in its original sealed condition with the NLF holographic seal intact and unbroken.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Opened repacks:</strong> All sales are final once a repack has been opened. We cannot accept returns on opened packs as we cannot verify the contents have not been altered. This is standard industry practice for all trading card repack products.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Sealed Products (Hobby Boxes, Blasters, etc.)</h2>
              <div className="bg-card rounded-xl border border-border p-6 space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Unopened sealed products:</strong> May be returned within 14 days of delivery in their original, factory-sealed condition for a full refund. Products must show no signs of tampering.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Opened sealed products:</strong> All sales are final once a sealed product has been opened.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Damaged or Defective Items</h2>
              <p className="text-muted-foreground leading-relaxed">
                If your order arrives damaged or defective, please contact us within 48 hours of delivery at <a href="mailto:info@nlfservices.com" className="text-primary hover:underline">info@nlfservices.com</a> with the following:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>Your order number</li>
                <li>Photos of the damaged item and packaging</li>
                <li>Description of the damage</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                We will either replace the item or issue a full refund at our discretion. Return shipping for damaged items will be covered by NLF.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">How to Request a Refund</h2>
              <p className="text-muted-foreground leading-relaxed">
                To initiate a return or refund, please email us at <a href="mailto:info@nlfservices.com" className="text-primary hover:underline">info@nlfservices.com</a> with your order number and reason for the return. We will provide you with return shipping instructions within 24 hours.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Refund Processing</h2>
              <p className="text-muted-foreground leading-relaxed">
                Once we receive and inspect the returned item, we will process your refund within 3-5 business days. The refund will be credited to your original payment method. Please allow an additional 5-10 business days for the refund to appear on your statement, depending on your financial institution.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Return Shipping</h2>
              <p className="text-muted-foreground leading-relaxed">
                Return shipping costs are the responsibility of the buyer unless the item arrived damaged or defective. We recommend using a trackable shipping service and purchasing shipping insurance for returns, as we cannot guarantee receipt of your returned item.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Questions?</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our refund policy, please contact us at <a href="mailto:info@nlfservices.com" className="text-primary hover:underline">info@nlfservices.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
