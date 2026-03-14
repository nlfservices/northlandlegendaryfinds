/**
 * Privacy Policy Page
 */

import SEO, { schemas } from "@/components/SEO";

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Privacy Policy"
        description="Privacy policy for Northland Legendary Finds. Learn how we collect, use, and protect your personal information."
        path="/privacy"
        noIndex
        jsonLd={schemas.breadcrumbList([{"name":"Home","url":"/"},{"name":"Privacy Policy","url":"/privacy"}])}
      />
      <section className="py-12 border-b border-border">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            PRIVACY <span className="text-primary">POLICY</span>
          </h1>
          <p className="text-muted-foreground">Last updated: February 28, 2026</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="prose prose-invert max-w-none space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-3">Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number. We refer to this information as "Order Information." We also automatically collect certain information when you visit the Site, including your IP address, browser type, operating system, referring URLs, and information about how you interact with the Site.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to communicate with you, screen our orders for potential risk or fraud, and provide you with information or advertising relating to our products or services (with your consent).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Sharing Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Shopify to power our online store. We also use Google Analytics to help us understand how our customers use the Site. We may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant, or other lawful request for information we receive, or to otherwise protect our rights.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you are a California resident, the California Consumer Privacy Act (CCPA) provides you with specific rights regarding your personal information. You have the right to request that we disclose certain information to you about our collection and use of your personal information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information. We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to track the activity on our Site and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Changes</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time in order to reflect changes to our practices or for other operational, legal, or regulatory reasons.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by email at info@nlfservices.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
