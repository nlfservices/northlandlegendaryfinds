/**
 * FAQ Page - Frequently asked questions about repacks and the store
 * 
 * Design: NLF Cosmic theme — black bg, green (#00FF41) accents, purple highlights
 * Updated: Reflects one-touch/graded card format, Stripe checkout, live pack counter,
 * checklist transparency, Whatnot compliance, and live show format
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";

const faqs = [
  {
    category: "About Our Repacks",
    questions: [
      {
        q: "What is a trading card repack?",
        a: "A repack is a curated selection of trading cards hand-picked from various premium sets and sealed in a custom pack. Our repacks feature cards from official Topps releases including Chrome, Sapphire, Mint, and more. Most of our repacks include either a one-touch magnetic case card or a professionally graded card (PSA, SGC, or BGS), giving you premium-protected hits right out of the pack.",
      },
      {
        q: "What does 'guaranteed hit' mean?",
        a: "Every NLF repack is guaranteed to contain at least one premium chase card. Most of our packs include a card in a one-touch magnetic holder or a professionally graded slab. Hits can include autographed cards, relic/memorabilia cards, numbered parallel cards (/99, /50, /25, /10, /5, or even 1/1), refractors, or other high-value inserts. You will never receive a pack without a hit.",
      },
      {
        q: "What is a one-touch card?",
        a: "A one-touch is a premium magnetic card holder that provides superior protection and display quality. When we say a repack includes a one-touch card, it means you're getting a notable card already secured in a high-quality magnetic case — ready to display or add to your collection immediately. These are typically our best pulls from hobby box breaks.",
      },
      {
        q: "Do your repacks include graded cards?",
        a: "Yes! Many of our repacks include professionally graded cards from PSA, SGC, or BGS. Graded cards have been authenticated and assigned a condition grade by a third-party grading service, which adds both credibility and value. Check each product page for specifics on what's included.",
      },
      {
        q: "Are the cards in your repacks authentic?",
        a: "Absolutely. 100% of our cards are authentic, officially licensed Topps trading cards. We source directly from hobby boxes and never deal in counterfeits or reproductions. Every card is inspected for quality before being included in a repack. All graded cards come with their original certification from PSA, SGC, or BGS.",
      },
      {
        q: "Why are repacks limited to 500 packs?",
        a: "We limit our production runs to maintain quality and exclusivity. With only 500 packs per series, we can ensure every single pack meets our high standards. You can track exactly how many packs remain in real time on each product page — once a run sells out, it's gone forever and the series is retired.",
      },
      {
        q: "What sets are the cards pulled from?",
        a: "Our repacks feature cards from premium Topps releases including Topps Chrome Marvel, Chrome Sapphire, Marvel Mint, and other high-end sets. The specific sets vary by product — check each product page and the full checklist for details on every card included in the series.",
      },
    ],
  },
  {
    category: "Checklists & Transparency",
    questions: [
      {
        q: "How can I see what's in a repack series?",
        a: "Every repack series has a full public checklist available on our website. The checklist shows every card in the series — including card name, set, year, parallel type, tier (chase, hit, or base), and card condition. Visit the Checklists page or click 'View Full Checklist' on any product page to see the complete breakdown.",
      },
      {
        q: "How do I know which cards have been pulled?",
        a: "Our checklists update in real time. When a card is pulled during a live show, it's marked as pulled on the checklist with the date and stream name. You can see exactly which cards are still available and which have already been claimed. The live pack counter on each product page also shows how many packs remain.",
      },
      {
        q: "What is the live pack counter?",
        a: "The live pack counter is displayed on each product page and shows exactly how many packs remain out of the total run (e.g., '450 of 500 remaining'). It updates automatically as packs are sold and opened during live shows, so you always know the current inventory status.",
      },
      {
        q: "Are you compliant with Whatnot's repack rules?",
        a: "Yes. We follow all Whatnot Professionally Sealed Surprise Products guidelines. This includes publishing a full checklist before sales begin, disclosing all card details (year, name, variation, condition), never advertising estimated values or floor/ceiling comparisons, and finalizing our checklists before the first pack is sold. Visit our Transparency page for full details on our compliance practices.",
      },
      {
        q: "Why don't you show card values on the checklist?",
        a: "Per Whatnot's marketplace rules and our commitment to transparency, we do not display estimated values, floor/ceiling ranges, or value comparisons on our checklists. Card values fluctuate constantly and displaying them could be misleading. Instead, we provide all the factual details you need — card name, set, year, parallel, and condition — so you can research current market values yourself through eBay sold listings or other pricing tools.",
      },
    ],
  },
  {
    category: "Live Shows & Whatnot",
    questions: [
      {
        q: "Where do you sell your repacks?",
        a: "We sell repacks through our website (northlandlegendaryfinds.com) and on Whatnot, the leading live auction platform for trading cards. During Whatnot live shows, packs are opened in real time so you can watch your pulls happen live. Follow us on Whatnot to get notified when we go live.",
      },
      {
        q: "How do live shows work?",
        a: "During a live show on Whatnot, we open repack packs in real time on camera. You purchase a pack, and we break it open live so you can see exactly what you get. All pulls are logged to our checklist system immediately, and the live pack counter updates in real time. It's the most transparent way to experience trading card repacks.",
      },
      {
        q: "How many packs do you open per show?",
        a: "The number of packs opened varies by show. We track packs opened per show in our system, so you can see the history of each series on the checklist page. A typical show might open 30–60 packs, but it depends on demand and the energy of the stream.",
      },
      {
        q: "Can I buy packs outside of live shows?",
        a: "Yes! Packs are available for purchase directly on our website anytime inventory is available. You don't have to wait for a live show to buy — but watching the live breaks is half the fun!",
      },
    ],
  },
  {
    category: "Ordering & Payment",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), Apple Pay, and Google Pay through our secure Stripe-powered checkout. All transactions are encrypted and PCI-compliant.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All payments are processed through Stripe, one of the world's most trusted payment processors. We never store your credit card information on our servers. Every transaction is encrypted with industry-standard SSL/TLS security.",
      },
      {
        q: "Can I cancel my order?",
        a: "If you need to cancel, contact us immediately at info@nlfservices.com. We process orders quickly (same-day before 2 PM CST), so cancellation is not guaranteed. If a cancellation is granted before shipment, a 15% cancellation fee will apply. Orders that have already shipped cannot be cancelled.",
      },
      {
        q: "Do you offer pre-orders?",
        a: "Yes, some products may be available for pre-order before their official release. You can sign up with the 'Notify Me' button on any upcoming product page to be alerted when it becomes available. All pre-order sales are final. Pricing is set at the time of purchase and will not be adjusted for market fluctuations.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How much does shipping cost?",
        a: "Shipping rates are zone-based from our Midwest facility. Zone 1 (Midwest) starts at just $5.99 with 1–2 day delivery. Zone 2 is $7.99 (2–3 days), Zone 3 is $9.99 (3–4 days), Zone 4 is $11.99 (4–5 days), and Zone 5 (Alaska/Hawaii) is $14.99 (5–10 days). FREE shipping on all orders over $199 within the contiguous US!",
      },
      {
        q: "How fast will I receive my order?",
        a: "We process and ship all in-stock orders placed before 2:00 PM CST the same business day. Midwest customers (Zone 1) can receive orders in as little as 1–2 business days. Even our furthest contiguous US customers (Zone 4) typically receive orders within 4–5 business days. Check our Shipping page for a full zone map.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we ship within the United States only. International shipping will be available in the future. Sign up for our newsletter to be notified when international shipping launches.",
      },
      {
        q: "How are the cards packaged for shipping?",
        a: "All orders are shipped in rigid mailers with bubble wrap protection. One-touch cards and graded slabs are individually wrapped for extra protection. Cards are sealed in our custom NLF holographic mylar bags and placed in protective top loaders or card savers before being packed. Sealed hobby boxes are shipped in double-walled corrugated boxes for maximum protection.",
      },
      {
        q: "Can I upgrade to faster shipping?",
        a: "Yes! We offer USPS Priority Mail (2–3 days), UPS 2nd Day Air, and UPS Next Day Air as upgraded options at checkout. Rates are calculated based on weight and destination.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy on repacks?",
        a: "All repack sales are final — no returns, no exchanges, no exceptions. This applies to both opened and unopened repack products. Due to the nature of mystery/repack products, we cannot accept returns as the integrity of the product cannot be verified once it leaves our facility. This is standard industry practice across all major trading card retailers.",
      },
      {
        q: "Can I return a sealed hobby box?",
        a: "All sales are final. Under rare circumstances, returns of factory-sealed product may be considered on a case-by-case basis, subject to a 15% restocking fee. The product must be in its original, factory-sealed condition with no signs of tampering, returned within 7 days, and pre-approved by our team. Opened sealed products cannot be returned.",
      },
      {
        q: "What if my order arrives damaged?",
        a: "If your order arrives damaged, DO NOT open the items. Contact us within 48 hours of delivery at info@nlfservices.com with your order number, photos of the damage (both item and packaging), and a description of the issue. We will review your claim and respond within 24 hours. Opening damaged items may void our ability to provide a resolution.",
      },
      {
        q: "What if I received the wrong item?",
        a: "If we made an error with your order, contact us immediately at info@nlfservices.com with your order number and photos. We will correct the mistake at no cost to you. This is the only exception to our all-sales-final policy.",
      },
      {
        q: "Why is the return policy so strict?",
        a: "Trading card repacks and mystery products are unique — once a pack leaves our facility, we have no way to verify the contents haven't been altered. This policy protects both our customers and our business, and is the same standard used by every major trading card retailer in the industry including Blowout Cards, Giant Sports Cards, and Hit Parade.",
      },
    ],
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            FREQUENTLY ASKED <span className="text-primary">QUESTIONS</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about NLF trading card repacks
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="space-y-10">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="text-2xl font-bold mb-4 text-primary" style={{ fontFamily: "'Anton', sans-serif" }}>
                  {section.category}
                </h2>
                <div className="space-y-2">
                  {section.questions.map((item, i) => {
                    const key = `${section.category}-${i}`;
                    const isOpen = openItems.has(key);
                    return (
                      <div
                        key={key}
                        className="bg-card rounded-xl border border-border overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-bold pr-4">{item.q}</span>
                          <ChevronDown
                            className={`w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5">
                            <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            <Link href="/checklists">
              <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors cursor-pointer text-center">
                <div className="text-2xl mb-2">📋</div>
                <h4 className="font-bold text-sm">View Checklists</h4>
                <p className="text-xs text-muted-foreground mt-1">See every card in our series</p>
              </div>
            </Link>
            <Link href="/transparency">
              <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors cursor-pointer text-center">
                <div className="text-2xl mb-2">🛡️</div>
                <h4 className="font-bold text-sm">Transparency Policy</h4>
                <p className="text-xs text-muted-foreground mt-1">Our compliance commitment</p>
              </div>
            </Link>
            <Link href="/shipping">
              <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors cursor-pointer text-center">
                <div className="text-2xl mb-2">🚚</div>
                <h4 className="font-bold text-sm">Shipping Zones</h4>
                <p className="text-xs text-muted-foreground mt-1">Zone map & delivery times</p>
              </div>
            </Link>
          </div>

          {/* Still have questions */}
          <div className="mt-8 bg-muted/20 rounded-xl border border-border p-6 text-center">
            <h3 className="font-bold text-lg mb-2">Still Have Questions?</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Can't find the answer you're looking for? Our team is happy to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:info@nlfservices.com"
                className="inline-block bg-primary text-primary-foreground font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Email Us
              </a>
              <Link href="/shipping">
                <span className="inline-block border border-primary text-primary font-bold px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer">
                  View Shipping Zones
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
