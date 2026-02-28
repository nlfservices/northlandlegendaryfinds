/**
 * FAQ Page - Frequently asked questions about repacks and the store
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    category: "About Our Repacks",
    questions: [
      {
        q: "What is a trading card repack?",
        a: "A repack is a curated selection of trading cards hand-picked from various premium sets and sealed in a custom pack. Our repacks feature cards from official Topps releases including Chrome, Sapphire, Mint, and more. Each pack is designed to deliver maximum value and excitement with guaranteed hits.",
      },
      {
        q: "What does 'guaranteed hit' mean?",
        a: "Every NLF repack is guaranteed to contain at least one premium chase card. This can include autographed cards, relic/memorabilia cards, numbered parallel cards (/99, /50, /25, /10, /5, or even 1/1), refractors, or other high-value inserts. You will never receive a pack without a hit.",
      },
      {
        q: "Are the cards in your repacks authentic?",
        a: "Absolutely. 100% of our cards are authentic, officially licensed Topps trading cards. We source directly from hobby boxes and never deal in counterfeits or reproductions. Every card is inspected for quality before being included in a repack.",
      },
      {
        q: "How many cards are in each repack?",
        a: "The exact number of cards varies by product, but each repack is designed to deliver exceptional value. Our $100 repacks include a generous selection of base cards, inserts, and at least one guaranteed hit card.",
      },
      {
        q: "Why are repacks limited to 500 packs?",
        a: "We limit our production runs to maintain quality and exclusivity. With only 500 packs per product, we can ensure every single pack meets our high standards. Once a run sells out, it's gone forever.",
      },
    ],
  },
  {
    category: "Ordering & Payment",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay through our secure Shopify checkout.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All payments are processed through Shopify's PCI-compliant payment system. We never store your credit card information on our servers.",
      },
      {
        q: "Can I cancel or modify my order?",
        a: "Orders can be cancelled or modified within 1 hour of placement, provided they haven't been shipped yet. Contact us immediately at info@northlandlegendaryfinds.com if you need to make changes.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How much does shipping cost?",
        a: "We offer free shipping on orders over $199. For orders under $199, flat-rate shipping is $8.99 for standard delivery within the continental United States.",
      },
      {
        q: "How long does shipping take?",
        a: "Orders are processed and shipped within 24 hours of purchase. Standard shipping typically takes 3-5 business days. Expedited shipping options are available at checkout.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we ship within the United States only. International shipping will be available in the future. Sign up for our newsletter to be notified when international shipping launches.",
      },
      {
        q: "How are the cards packaged for shipping?",
        a: "All orders are shipped in rigid mailers with bubble wrap protection. Cards are sealed in our custom NLF holographic mylar bags and placed in a protective top loader or card saver before being packed for shipping.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "Due to the nature of trading card repacks, all sales are final once the pack has been opened. Unopened packs may be returned within 14 days of delivery for a full refund. The pack must be in its original sealed condition.",
      },
      {
        q: "What if my order arrives damaged?",
        a: "If your order arrives damaged, please contact us within 48 hours of delivery with photos of the damage. We will either replace the item or issue a full refund at our discretion.",
      },
      {
        q: "How long do refunds take to process?",
        a: "Refunds are processed within 3-5 business days of receiving the returned item. The refund will be credited to your original payment method.",
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
        </div>
      </section>
    </div>
  );
}
