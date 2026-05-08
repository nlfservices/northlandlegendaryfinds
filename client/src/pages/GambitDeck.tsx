/**
 * 2025 Topps Marvel Mint Gambit Chrome Deck - Dedicated page with interactive card gallery
 */
import { Link } from "wouter";
import { ArrowLeft, TrendingUp, ExternalLink, Facebook, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import GambitDeckGallery from "@/components/GambitDeckGallery";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

const FEATURED_IMG = "/manus-storage/gambit-deck-hero-v3_1d67a2a4.png";

export default function GambitDeck() {
  return (
    <div className="min-h-screen">
      <SEO
        title="2025 Topps Marvel Mint Gambit Chrome Deck — The All-Star Game of Marvel Cards"
        description="The complete guide to the 52-card Gambit Chrome Deck from 2025 Topps Marvel Mint. See every card, top eBay sales ($2,000+ Aces), pull odds, and which characters are confirmed for Avengers: Doomsday."
        path="/gambit-deck"
        image={FEATURED_IMG}
        type="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "MCU News", url: "/mcu-news" },
            { name: "Gambit Chrome Deck Guide", url: "/gambit-deck" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "2025 Topps Marvel Mint Gambit Chrome Deck: The All-Star Game of Marvel Cards",
            description: "Complete guide to the 52-card Gambit Chrome Deck with prices, gallery, and MCU connections.",
            image: FEATURED_IMG,
            datePublished: "2026-05-08T12:00:00Z",
            author: { "@type": "Organization", name: "NLF Team" },
          },
        ]}
      />

      {/* Back nav */}
      <div className="border-b border-border bg-card/30">
        <div className="container max-w-5xl py-3">
          <Link href="/mcu-news" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to MCU News
          </Link>
        </div>
      </div>

      <article className="container max-w-5xl py-8 lg:py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full border bg-primary/20 text-primary border-primary/30">
              Card Market
            </span>
            <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
              Collecting Guide
            </span>
            <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
              Gambit Deck
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            The 2025 Topps Marvel Mint Gambit Chrome Deck: The All-Star Game of Marvel Cards
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            52 double-sided chrome playing cards. Every heavy hitter in the Marvel Universe. Numbered to just 99. Here's why collectors are calling it the greatest Marvel card insert ever made.
          </p>
        </header>

        {/* Card Market Impact */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-8 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-primary mb-1">Card Market Impact</h4>
            <p className="text-sm text-foreground">
              Complete set valued at $20,000+. Spider-Man Ace sold for $2,500. Doctor Doom and Gambit Aces at $1,400 each. With 16+ characters confirmed for Avengers: Doomsday, prices are positioned to spike when trailers drop.
            </p>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-xl overflow-hidden mb-8 border border-border">
          <img src={FEATURED_IMG} alt="2025 Topps Marvel Mint Gambit Chrome Deck" className="w-full h-auto" />
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground mb-12">
          <p>
            If the Marvel trading card world had an All-Star Game — a single product that brought together every heavy hitter, every fan favorite, every legend — it would be the <strong>2025 Topps Marvel Mint Gambit's Deck</strong>. This 52-card chrome playing card set is the crown jewel of the entire Marvel Mint release, and the secondary market has spoken: these cards are commanding serious money.
          </p>
          <p>
            Think of it like the NFL Pro Bowl roster or MLB All-Star starting lineup. Every card in this deck represents a character who earned their spot through decades of comic book dominance. From the Ace of Spades (Gambit himself) to the 2 of Hearts (Jubilee), every single card is a double-sided chrome masterpiece numbered to just 99 copies.
          </p>

          <h2>Why This Set Is Different</h2>
          <p>
            Most trading card inserts give you a random assortment of characters on standard cardstock. The Gambit Deck is something else entirely. Each card is a fully encased, double-sided chrome playing card with holographic effects, ornate gold and black borders, and that unmistakable pink/magenta energy that channels Gambit's kinetic powers. These aren't cards you throw in a binder — they're display pieces.
          </p>
          <p>
            The genius of the design is the playing card hierarchy. Just like a real deck, the Aces are the most valuable, followed by Kings, Queens, Jacks, and number cards. Topps assigned characters based on their Marvel Universe status, creating a natural tier system that the market has validated with real dollars.
          </p>
        </div>

        {/* Mid-Article Whatnot Banner */}
        <div className="my-8 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
          <div className="py-6 px-4 sm:px-6 bg-yellow-500/5 border-l-4 border-yellow-500 rounded-r-lg">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Tv className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <p className="font-bold text-foreground text-base sm:text-lg mb-1">
                  We give away Gambit Deck cards on our Whatnot streams
                </p>
                <p className="text-sm text-muted-foreground">
                  New to Whatnot? Get <span className="text-yellow-400 font-semibold">$15 off</span> your first purchase. No strings attached.
                </p>
              </div>
              <a
                href="https://northlandlegendaryfinds.com/whatnot"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-lg transition-all hover:scale-[1.02] flex-shrink-0 whitespace-nowrap"
              >
                Watch Free
              </a>
            </div>
          </div>
        </div>

        {/* The Aces Section */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground mb-8">
          <h2>The Aces: Marvel's Mount Rushmore</h2>
          <p>
            The four Aces represent the absolute pinnacle of Marvel fandom, and the prices reflect it:
          </p>
        </div>

        {/* Aces Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-primary/10">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Card</th>
                <th className="px-4 py-3 text-left font-bold">Character</th>
                <th className="px-4 py-3 text-left font-bold">Base /99 Sale</th>
                <th className="px-4 py-3 text-left font-bold">Why They're the Ace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-card/50"><td className="px-4 py-3">Ace of Hearts</td><td className="px-4 py-3 font-bold">Spider-Man</td><td className="px-4 py-3 text-primary font-bold">$2,500</td><td className="px-4 py-3 text-muted-foreground">Marvel's most popular character, period</td></tr>
              <tr><td className="px-4 py-3">Ace of Spades</td><td className="px-4 py-3 font-bold">Gambit</td><td className="px-4 py-3 text-primary font-bold">$1,400</td><td className="px-4 py-3 text-muted-foreground">The deck's namesake — the Ragin' Cajun himself</td></tr>
              <tr className="bg-card/50"><td className="px-4 py-3">King of Clubs</td><td className="px-4 py-3 font-bold">Doctor Doom</td><td className="px-4 py-3 text-primary font-bold">$1,400</td><td className="px-4 py-3 text-muted-foreground">The MCU's next big villain — Robert Downey Jr.</td></tr>
              <tr><td className="px-4 py-3">Ace of Clubs</td><td className="px-4 py-3 font-bold">Wolverine</td><td className="px-4 py-3 text-primary font-bold">$1,975</td><td className="px-4 py-3 text-muted-foreground">The most collected X-Man of all time</td></tr>
              <tr className="bg-card/50"><td className="px-4 py-3">Ace of Diamonds</td><td className="px-4 py-3 font-bold">Magneto</td><td className="px-4 py-3 text-primary font-bold">$599+</td><td className="px-4 py-3 text-muted-foreground">The Master of Magnetism</td></tr>
            </tbody>
          </table>
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground mb-8">
          <p>
            Let that sink in. A single base Spider-Man Ace of Hearts — numbered to 99 — sold for <strong>$2,500</strong>. The Doctor Doom King of Clubs hit <strong>$1,400</strong>. And Gambit's own Ace of Spades commanded <strong>$1,400</strong>. These aren't Superfractors or graded slabs — these are raw base cards from a 99-copy print run.
          </p>

          <h2>Top Recent eBay Sales</h2>
          <p>
            Here are real, verified sold listings from eBay. These are the prices collectors are actually paying for Gambit Deck cards right now:
          </p>
        </div>

        {/* Real eBay Sales Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-yellow-500/10">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Card</th>
                <th className="px-4 py-3 text-left font-bold">Sold Price</th>
                <th className="px-4 py-3 text-left font-bold">Date</th>
                <th className="px-4 py-3 text-left font-bold">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-card/50">
                <td className="px-4 py-3 font-medium">Spider-Man — Ace of Hearts #H-A /99</td>
                <td className="px-4 py-3 text-yellow-400 font-bold">$2,500</td>
                <td className="px-4 py-3 text-muted-foreground">Apr 22, 2025</td>
                <td className="px-4 py-3"><a href="https://www.ebay.com/itm/236722459537" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">View Sale</a></td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Doctor Doom — King of Clubs #C-K /99</td>
                <td className="px-4 py-3 text-yellow-400 font-bold">$1,400</td>
                <td className="px-4 py-3 text-muted-foreground">Feb 18, 2025</td>
                <td className="px-4 py-3"><a href="https://www.ebay.com/itm/358204510372" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">View Sale</a></td>
              </tr>
              <tr className="bg-card/50">
                <td className="px-4 py-3 font-medium">Gambit — Ace of Spades #S-A /99</td>
                <td className="px-4 py-3 text-yellow-400 font-bold">$1,400</td>
                <td className="px-4 py-3 text-muted-foreground">Mar 27, 2025</td>
                <td className="px-4 py-3"><a href="https://www.ebay.com/itm/188174554741" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">View Sale</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground mb-8">
          <p>
            That's <strong>$5,300 in confirmed sales</strong> across just three cards. The complete 52-card base set (all /99) carries an estimated value north of <strong>$20,000</strong>. Even the lowest-value cards in the deck are selling for $200+. There is no "junk" in this deck.
          </p>

          <h2>The Avengers: Doomsday Connection</h2>
          <p>
            Here's where it gets really interesting for collectors thinking ahead. A massive number of characters in the Gambit Deck are <strong>confirmed to appear in Avengers: Doomsday</strong> (December 2026) and <strong>Spider-Man: Brand New Day</strong> (July 2026). When those movies drop trailers and hit theaters, demand for these cards will spike.
          </p>
        </div>

        {/* Doomsday Connection Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
            <h3 className="font-bold text-lg mb-3 text-blue-400">Confirmed for Avengers: Doomsday</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Spider-Man</strong> (Ace of Hearts) — Tom Holland</li>
              <li><strong className="text-foreground">Wolverine</strong> (Ace of Clubs) — Hugh Jackman</li>
              <li><strong className="text-foreground">Doctor Doom</strong> (King of Clubs) — Robert Downey Jr.</li>
              <li><strong className="text-foreground">Captain America</strong> (10 of Spades) — Chris Evans</li>
              <li><strong className="text-foreground">Thor</strong> (10 of Clubs) — Chris Hemsworth</li>
              <li><strong className="text-foreground">Hulk</strong> (9 of Clubs) — Mark Ruffalo</li>
              <li><strong className="text-foreground">Doctor Strange</strong> (9 of Hearts) — Benedict Cumberbatch</li>
              <li><strong className="text-foreground">Loki</strong> (8 of Clubs) — Tom Hiddleston</li>
              <li><strong className="text-foreground">Magneto</strong> (Ace of Diamonds) — Ian McKellen</li>
              <li><strong className="text-foreground">Cyclops</strong> (King of Diamonds) — confirmed</li>
              <li><strong className="text-foreground">Jean Grey</strong> (Queen of Spades) — confirmed</li>
              <li><strong className="text-foreground">Storm</strong> (Queen of Clubs) — Halle Berry</li>
              <li><strong className="text-foreground">Professor X</strong> (King of Hearts) — Patrick Stewart</li>
              <li><strong className="text-foreground">Scarlet Witch</strong> (8 of Diamonds) — rumored return</li>
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
            <h3 className="font-bold text-lg mb-3 text-red-400">Spider-Man: Brand New Day</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Spider-Man</strong> (Ace of Hearts) — Tom Holland</li>
              <li><strong className="text-foreground">Daredevil</strong> (8 of Spades) — Charlie Cox rumored</li>
              <li><strong className="text-foreground">Venom</strong> (7 of Clubs) — possible appearance</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-red-500/20">
              <p className="text-xs text-muted-foreground">
                That's <strong className="text-foreground">16+ characters</strong> from the Gambit Deck appearing in upcoming MCU films. When those trailers drop, collectors who already own these cards will be sitting on gold.
              </p>
            </div>
          </div>
        </div>

        {/* CARD GALLERY / SLIDESHOW */}
        <GambitDeckGallery />

        {/* Pull Odds Section */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground mb-8">
          <h2>Pull Odds: What You're Up Against</h2>
          <p>
            If you're ripping Marvel Mint boxes hoping to pull one of these, here's what you're dealing with:
          </p>
        </div>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Insert</th>
                <th className="px-4 py-3 text-left font-bold">Odds (per pack)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-card/50"><td className="px-4 py-3">Gambit's Deck Chrome Card</td><td className="px-4 py-3 font-medium">1:4</td></tr>
              <tr><td className="px-4 py-3">Gambit's Deck Superfractor</td><td className="px-4 py-3 font-medium text-yellow-400">1:360</td></tr>
              <tr className="bg-card/50"><td className="px-4 py-3">Chrome Autographs</td><td className="px-4 py-3 font-medium">1:24</td></tr>
              <tr><td className="px-4 py-3">Sketch Cards</td><td className="px-4 py-3 font-medium">1:26</td></tr>
              <tr className="bg-card/50"><td className="px-4 py-3">Dr. Doom Comic Cuts</td><td className="px-4 py-3 font-medium">1:61</td></tr>
              <tr><td className="px-4 py-3">Stan Lee Cut Signature</td><td className="px-4 py-3 font-medium text-red-400">1:15,701</td></tr>
            </tbody>
          </table>
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground mb-8">
          <p>
            You'll pull a base Gambit Deck card roughly every 4 packs — but getting the specific character you want from a 52-card set? That's where the hunt gets real.
          </p>

          <h2>Why Collectors Are Obsessed</h2>
          <p>
            The Gambit Deck has captured the Marvel collecting community unlike anything since the original 1990s Marvel Masterpieces. Here's why:
          </p>
          <p>
            <strong>The completionist challenge.</strong> Building the full 52-card set is a legitimate grail quest. With only 99 copies of each card, finding all 52 requires patience, deep pockets, and connections across the hobby.
          </p>
          <p>
            <strong>The display factor.</strong> These aren't cards that sit in a box. Collectors are building custom displays, shadow boxes, and wall-mounted cases to show off their Gambit Deck collections. The chrome finish and playing card design make them conversation pieces.
          </p>
          <p>
            <strong>The investment angle.</strong> With Avengers: Doomsday releasing in December 2026, cards featuring confirmed cast members are positioned to appreciate significantly. Smart collectors are acquiring now before the marketing machine drives casual fans into the market.
          </p>
        </div>

        {/* Whatnot CTA */}
        <div className="bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 border-2 border-yellow-500/40 rounded-xl p-6 sm:p-8 mb-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">See These Cards Live on Our Whatnot Streams</h3>
          <p className="text-muted-foreground mb-5 max-w-lg mx-auto">
            We always have Gambit Deck cards in our giveaways. Come hang out, watch us crack packs, and you might walk away with one of these for free. No purchase necessary — we give away cards to everyone watching.
          </p>
          <a
            href="https://northlandlegendaryfinds.com/whatnot"
            className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-lg transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-[1.02]"
          >
            Watch Us Live — Free Giveaways Every Show
          </a>
          <p className="text-xs text-muted-foreground mt-3">New to Whatnot? Get $15 off your first purchase just for signing up.</p>
        </div>

        {/* Sources */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary" />
            Sources & References
          </h3>
          <div className="space-y-2">
            <a href="https://www.pricecharting.com/console/marvel-2025-topps-mint-gambit%27s-deck" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1">
              <span className="underline-offset-2 hover:underline">PriceCharting — Marvel 2025 Topps Mint Gambit's Deck Prices</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50" />
            </a>
            <a href="https://www.ebay.com/sch/i.html?_nkw=2025+topps+marvel+mint+gambit+deck" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1">
              <span className="underline-offset-2 hover:underline">eBay — 2025 Topps Marvel Mint Gambit Deck Sold Listings</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50" />
            </a>
            <a href="https://www.topps.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1">
              <span className="underline-offset-2 hover:underline">Topps Official — 2025 Marvel Mint Product Page</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50" />
            </a>
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50 rounded-xl border border-border p-6 mb-6">
          <div>
            <h3 className="font-bold mb-1">Want more MCU News?</h3>
            <p className="text-sm text-muted-foreground">Browse all our articles or check out the card database.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/mcu-news">
              <Button variant="outline" size="sm">All Articles</Button>
            </Link>
            <Link href="/cards">
              <Button size="sm">Card Database</Button>
            </Link>
          </div>
        </div>

        {/* Facebook Follow */}
        <div className="bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 flex-shrink-0">
              <Facebook className="w-7 h-7 text-white" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="font-bold text-lg mb-1">Follow NLF on Facebook</h3>
              <p className="text-sm text-muted-foreground">Get breaking MCU news, card market updates, and exclusive drops in your feed.</p>
            </div>
            <a
              href="https://www.facebook.com/profile.php?id=61575227498498"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 flex-shrink-0"
            >
              <Facebook className="w-5 h-5" />
              Like Our Page
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
