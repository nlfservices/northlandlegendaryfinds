/**
 * Terms of Service Page
 */

export default function Terms() {
  return (
    <div className="min-h-screen">
      <section className="py-12 border-b border-border">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            TERMS OF <span className="text-primary">SERVICE</span>
          </h1>
          <p className="text-muted-foreground">Last updated: February 28, 2026</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="prose prose-invert max-w-none space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-3">1. Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                This website is operated by Northland Legendary Finds ("NLF," "we," "us," or "our"). Throughout the site, the terms "you" and "your" refer to you as the user. By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service"), including those additional terms and conditions and policies referenced herein.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">2. Online Store Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority and have given us your consent to allow any of your minor dependents to use this site. You may not use our products for any illegal or unauthorized purpose, nor may you, in the use of the Service, violate any laws in your jurisdiction.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">3. Products and Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                NLF sells trading card repack products and sealed trading card products. All products are described as accurately as possible. However, due to the nature of trading card repacks, the specific cards included in each pack will vary. We guarantee that each repack will contain the minimum value and hit guarantees as described in the product listing. Product images are for illustration purposes and may not represent the exact cards included in your pack.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">4. Pricing and Payment</h2>
              <p className="text-muted-foreground leading-relaxed">
                Prices for our products are subject to change without notice. We reserve the right to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service. All payments are processed securely through Shopify Payments.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">5. Returns and Refunds</h2>
              <p className="text-muted-foreground leading-relaxed">
                Unopened, sealed products may be returned within 14 days of delivery for a full refund. Due to the nature of trading card repacks, all sales are final once a pack has been opened. For damaged items, please contact us within 48 hours of delivery. Full details are available on our Shipping & Returns page.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">6. Accuracy of Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are not responsible if information made available on this site is not accurate, complete, or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions. Any reliance on the material on this site is at your own risk.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no case shall NLF, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort, strict liability, or otherwise.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">8. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the United States.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">9. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                Questions about the Terms of Service should be sent to us at info@northlandlegendaryfinds.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
