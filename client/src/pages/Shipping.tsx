/**
 * Shipping & Delivery Page
 * 
 * Design: NLF Cosmic theme — black bg, green (#00FF41) accents, purple highlights
 * Features: Color-coded US shipping map with zone-based pricing
 * Midwest = cheapest + fastest (home base advantage)
 * Industry-standard policies modeled after Blowout Cards, Giant Sports Cards, Hit Parade
 */

import { Package, Truck, Clock, Shield, Zap, AlertTriangle, MapPin } from "lucide-react";
import { Link } from "wouter";
import USShippingMap from "../components/USShippingMap";

export default function Shipping() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            SHIPPING & <span className="text-primary">DELIVERY</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Fast, secure shipping from the heart of the Midwest
          </p>
        </div>
      </section>

      {/* Shipping Highlights */}
      <section className="py-10">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl border border-border p-5 text-center group hover:border-primary/40 transition-colors">
              <Truck className="w-9 h-9 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-base mb-1">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders over $199</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 text-center group hover:border-primary/40 transition-colors">
              <Zap className="w-9 h-9 text-amber-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-base mb-1">Same-Day Processing</h3>
              <p className="text-sm text-muted-foreground">Orders before 2 PM CST</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 text-center group hover:border-primary/40 transition-colors">
              <MapPin className="w-9 h-9 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-base mb-1">Midwest Advantage</h3>
              <p className="text-sm text-muted-foreground">Cheapest rates, fastest delivery</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 text-center group hover:border-primary/40 transition-colors">
              <Shield className="w-9 h-9 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-base mb-1">Secure Packaging</h3>
              <p className="text-sm text-muted-foreground">Cards protected in transit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Map Section */}
      <section className="py-10">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
            <span className="text-primary">SHIPPING</span> ZONES
          </h2>
          <p className="text-muted-foreground mb-6">
            We ship from the Midwest, giving our neighbors the fastest delivery times and lowest rates. 
            Hover over any state to see estimated transit time and shipping cost.
          </p>
          
          <USShippingMap />

          {/* Free shipping callout */}
          <div className="mt-6 bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-start gap-3">
            <Package className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary">FREE SHIPPING on all orders over $199!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Applies to all zones within the contiguous United States. Zone-based rates shown above apply to orders under $199.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Shipping Info */}
      <section className="py-10">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
            <span className="text-primary">SHIPPING</span> DETAILS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Processing */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h3 className="font-bold text-lg">Order Processing</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  All in-stock orders placed before <strong className="text-foreground">2:00 PM CST</strong> are 
                  processed and shipped the same business day. Orders placed after 2:00 PM CST or on weekends and 
                  holidays will ship the next business day.
                </p>
                <p>
                  You will receive a shipping confirmation email with tracking information once your order has been 
                  processed and handed off to the carrier.
                </p>
              </div>
            </div>

            {/* Carriers */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-6 h-6 text-primary" />
                <h3 className="font-bold text-lg">Shipping Carriers</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Continental US:</strong> We ship via USPS and UPS Ground. 
                  Transit times shown on the map above are estimates based on standard ground shipping from our 
                  Midwest facility.
                </p>
                <p>
                  <strong className="text-foreground">Alaska & Hawaii:</strong> Shipped via USPS Priority Mail. 
                  Individual rates may vary based on weight and destination. Free shipping threshold does not apply 
                  to non-contiguous states.
                </p>
              </div>
            </div>

            {/* Upgraded Shipping */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-amber-400" />
                <h3 className="font-bold text-lg">Expedited Options</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Need your cards faster? Upgraded shipping options are available at checkout:
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">›</span>
                    <span><strong className="text-foreground">USPS Priority Mail:</strong> 2–3 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">›</span>
                    <span><strong className="text-foreground">UPS 2nd Day Air:</strong> 2 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">›</span>
                    <span><strong className="text-foreground">UPS Next Day Air:</strong> 1 business day</span>
                  </li>
                </ul>
                <p className="text-xs italic">
                  Expedited rates are calculated at checkout based on weight and destination.
                </p>
              </div>
            </div>

            {/* Packaging */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
                <h3 className="font-bold text-lg">Packaging & Protection</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Every order is packaged with care to ensure your cards arrive in pristine condition:
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">›</span>
                    <span>Cards sealed in custom NLF holographic mylar bags</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">›</span>
                    <span>Placed in protective top loaders or card savers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">›</span>
                    <span>Shipped in rigid mailers with bubble wrap protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">›</span>
                    <span>Sealed hobby boxes shipped in double-walled corrugated boxes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Rate Table */}
      <section className="py-10">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
            <span className="text-primary">RATE</span> SUMMARY
          </h2>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-bold text-foreground">Zone</th>
                    <th className="text-left p-4 font-bold text-foreground">Coverage</th>
                    <th className="text-left p-4 font-bold text-foreground">Transit Time</th>
                    <th className="text-left p-4 font-bold text-foreground">Rate (Under $199)</th>
                    <th className="text-left p-4 font-bold text-foreground">Rate ($199+)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#00FF41" }} />
                        <span className="font-bold text-primary">Zone 1</span>
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">Midwest (MN, WI, IA, IL, IN, MI, OH, ND, SD, NE, KS, MO)</td>
                    <td className="p-4 text-foreground font-semibold">1–2 days</td>
                    <td className="p-4 text-foreground font-semibold">$5.99</td>
                    <td className="p-4 text-primary font-bold">FREE</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#00CC33" }} />
                        <span className="font-bold" style={{ color: "#00CC33" }}>Zone 2</span>
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">MT, WY, CO, OK, AR, KY, TN, WV, PA, NY</td>
                    <td className="p-4 text-foreground font-semibold">2–3 days</td>
                    <td className="p-4 text-foreground font-semibold">$7.99</td>
                    <td className="p-4 text-primary font-bold">FREE</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#0099AA" }} />
                        <span className="font-bold" style={{ color: "#0099AA" }}>Zone 3</span>
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">TX, South, Northeast, Mountain West, FL</td>
                    <td className="p-4 text-foreground font-semibold">3–4 days</td>
                    <td className="p-4 text-foreground font-semibold">$9.99</td>
                    <td className="p-4 text-primary font-bold">FREE</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#7B2FBE" }} />
                        <span className="font-bold" style={{ color: "#7B2FBE" }}>Zone 4</span>
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">AZ, NV, CA, OR, WA</td>
                    <td className="p-4 text-foreground font-semibold">4–5 days</td>
                    <td className="p-4 text-foreground font-semibold">$11.99</td>
                    <td className="p-4 text-primary font-bold">FREE</td>
                  </tr>
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#5A1E8E" }} />
                        <span className="font-bold" style={{ color: "#5A1E8E" }}>Zone 5</span>
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">Alaska, Hawaii (USPS)</td>
                    <td className="p-4 text-foreground font-semibold">5–10 days</td>
                    <td className="p-4 text-foreground font-semibold">$14.99</td>
                    <td className="p-4 text-muted-foreground text-xs">Free shipping not available*</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-border bg-muted/10">
              <p className="text-xs text-muted-foreground">
                * Free shipping applies to orders over $199 within the contiguous United States (Zones 1–4). 
                Alaska and Hawaii orders are shipped via USPS and rates may vary by weight. Transit times are 
                estimates in business days and do not include weekends or holidays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery & Damaged Items */}
      <section className="py-10">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Info */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Delivery Information
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  You will receive an order confirmation with tracking details via email after your order has been 
                  processed and shipped. Once a package is in transit, we cannot make changes to the shipment.
                </p>
                <p>
                  UPS does not count Saturday and Sunday as official transit days. Please consider this when placing 
                  your order, especially if you need delivery by a specific date.
                </p>
              </div>
            </div>

            {/* Damaged Items */}
            <div className="bg-card rounded-xl border border-amber-500/30 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Damaged Shipments
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Please examine your order carefully upon arrival to confirm it is accurate and undamaged. 
                  If there are any issues with your shipment:
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">1.</span>
                    <span><strong className="text-foreground">DO NOT open the items</strong> — we may be unable to provide resolution if items are opened</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">2.</span>
                    <span>Contact us within <strong className="text-foreground">48 hours</strong> of delivery at{" "}
                      <a href="mailto:info@nlfservices.com" className="text-primary hover:underline">info@nlfservices.com</a>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">3.</span>
                    <span>Include photos of the damaged item and packaging along with your order number</span>
                  </li>
                </ul>
                <p className="text-xs italic mt-2">
                  We will replace the item or work with you on a resolution at our discretion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* International */}
      <section className="py-10 border-t border-border">
        <div className="container max-w-5xl">
          <div className="bg-muted/20 rounded-xl border border-border p-6 text-center">
            <h3 className="font-bold text-lg mb-2">International Shipping</h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              We currently ship within the United States only. International shipping is coming soon. 
              Sign up for our newsletter to be the first to know when we expand our shipping reach.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10">
        <div className="container max-w-5xl text-center">
          <p className="text-muted-foreground mb-4">Have questions about shipping or delivery?</p>
          <Link href="/contact">
            <button className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Contact Us
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
