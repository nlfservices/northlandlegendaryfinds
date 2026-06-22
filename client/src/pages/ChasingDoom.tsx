/**
 * Chasing Doom — Patrick's Origin Story & Road Trip Series
 * A father-son journey across America hunting Doctor Doom cards and toys.
 * Hidden page (no nav link) — direct URL access only while building.
 * Designed to eventually spin off to chasingdoom.com
 */

import { Heart, MapPin, Calendar, ArrowRight, Play } from "lucide-react";
import RoadTripTimeline from "@/components/RoadTripTimeline";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

// ── CDN Image URLs ──────────────────────────────────────────────────────────
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/chasing-doom-hero-Qpuj5b9HuAanLbKqnvjgaF.webp";

// Reuse family photos from About page
const PHOTOS = {
  fatherSon: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/MNSportsstore4_3c2e5a50.webp",
  hayride: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Landon&I-Hayride_a8eeed98.webp",
  family: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/3ofUs-StarWarsStarCruiser_8441a617.jpg",
  kayaAndPatrick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/KayaandINLFVegasRetreat_ce081be8.jpg",
  landonAssemble: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Landon-Assemble3_5789b932.jpg",
  kayaLandonSunflowers: "/manus-storage/kaya-landon-sunflowers_b86daef5.jpg",
  kayaBabyLandon: "/manus-storage/kaya-baby-landon-nf-shirt_b7dae711.jpg",
  kayaWorking: "/manus-storage/kaya-working-northland-fence_972cdf8b.jpg",
};

export default function ChasingDoom() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Chasing Doom — A Father & Son Journey Across America"
        description="Patrick sold his fence company, chose sobriety, and now he's on the road with his 8-year-old son Landon — chasing Doctor Doom cards, toys, and card stores across the country."
        path="/chasing-doom"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Chasing Doom", url: "/chasing-doom" },
        ])}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION — The Open Road
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[500px] lg:min-h-[600px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Doctor Doom cards and figures on a car dashboard, open highway ahead"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="container relative z-10 pb-12 lg:pb-16">
          <div className="max-w-3xl">
            <p className="text-green-400 font-bold text-sm tracking-[0.2em] uppercase mb-3">
              A New Chapter Begins
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.9] mb-5">
              <span className="text-green-400">CHASING</span>{" "}
              <span className="text-white">DOOM</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed max-w-2xl">
              A father and son. An open road. And every Doctor Doom card and toy 
              we can find along the way.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — THE PARALLEL: Victor, Robert, Patrick
          Full-width cinematic text block
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Three Men. One Story.</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Victor */}
            <div className="bg-card/60 border border-green-500/20 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-400">V</span>
              </div>
              <h3 className="text-lg font-bold text-green-400 mb-2">Victor Von Doom</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Came from nothing in a poor nation. Built an empire through sheer will. 
                Forged his own armor. Became something the world couldn't ignore.
              </p>
            </div>

            {/* Robert */}
            <div className="bg-card/60 border border-amber-500/20 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-400">R</span>
              </div>
              <h3 className="text-lg font-bold text-amber-400 mb-2">Robert Downey Jr.</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Built something iconic. Chose sobriety. Walked away from Iron Man. 
                Came back as something completely different — and more powerful.
              </p>
            </div>

            {/* Patrick */}
            <div className="bg-card/60 border border-primary/20 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">P</span>
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Patrick</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Built Northland Fence from a rented garage. Chose sobriety — coming up 
                on twenty years this September. Sold the company. Now on the road with his son.
              </p>
            </div>
          </div>

          <blockquote className="border-l-4 border-green-500/50 pl-6 py-2 text-xl text-gray-300 italic max-w-3xl mx-auto">
            "Victor came from nothing and built an empire. RDJ chose redemption and came back stronger. 
            I built fences for twenty years — physical ones and personal ones. Now I'm tearing them down."
          </blockquote>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — THE ORIGIN: Patrick's Story
          Image LEFT, text RIGHT
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-card/50 border-y border-border/50">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-br from-green-500/20 via-transparent to-primary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <img
                src={PHOTOS.hayride}
                alt="Patrick and Landon"
                className="relative rounded-xl w-full aspect-[3/4] object-cover object-top shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-300 italic">Where it all started</p>
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-green-400 font-bold text-sm tracking-[0.2em] uppercase mb-3">The Origin</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">FROM THE GROUND UP</h2>
              <div className="space-y-5 text-gray-300 text-lg leading-relaxed">
                <p>
                  I grew up in Section 8 housing in Minnesota. My old man didn't have much, but he'd 
                  drop me off at the local card show. That's where I learned to hustle — trading cards 
                  with guys twice my age, figuring out what things were worth before I could drive.
                </p>
                <p>
                  That same energy built <strong className="text-white">Northland Fence</strong> — 
                  starting in a rented garage with nothing but a truck and a dream. We grew it into one 
                  of the largest residential fence installers in Minnesota.
                </p>
                <p>
                  Like Victor Von Doom coming from Latveria with nothing, I built something from the 
                  ground up. And like RDJ, I chose sobriety. Coming up on twenty years this September — 
                  the same month Endgame re-releases in theaters.
                </p>
                <p className="text-green-400/90 italic border-l-4 border-green-500/50 pl-5">
                  That's not a coincidence. That's a celebration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — THE FAMILY: Laura, Kaya, Landon
          Text LEFT, image RIGHT
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <p className="text-red-400 font-bold text-sm tracking-[0.2em] uppercase mb-3">The Family</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">THE CREW</h2>
              <div className="space-y-5 text-gray-300 text-lg leading-relaxed">
                <p>
                  I met my wife Laura in 2008 — on Friday the 13th. Our first date was a double 
                  feature: <em>The Happening</em> and <em>The Incredible Hulk</em>. Yeah, the Hulk 
                  was there from the very beginning.
                </p>
                <p>
                  Kaya was 8 years old when I met her. I adopted her when she was 18. Now she's 26 
                  and runs Northland Fence after the sale. She earned it.
                </p>
                <p>
                  Landon is 8 — the same age Kaya was when I came into her life. He's obsessed with 
                  Doctor Doom, Marvel, and hunting toys at every store we pass. Laura? She's the 
                  <strong className="text-white"> Eye-Rolling Wife</strong> — and she's along for the ride 
                  whether she likes it or not.
                </p>
                <p className="text-red-400/90 italic border-l-4 border-red-500/50 pl-5">
                  "My wife thinks I'm crazy. But that's no different than when we ran the business 
                  out of a rented garage."
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-br from-red-500/20 via-transparent to-purple-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <img
                src={PHOTOS.family}
                alt="Patrick, Laura, and Landon — the family behind Chasing Doom"
                className="relative rounded-xl w-full aspect-[4/3] object-cover shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <p className="text-sm text-gray-300 italic">The whole crew</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3B — KAYA: The Legacy
          Image RIGHT, text LEFT
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-card/50 border-y border-border/50">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <p className="text-amber-400 font-bold text-sm tracking-[0.2em] uppercase mb-3">The Legacy</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">KAYA</h2>
              <div className="space-y-5 text-gray-300 text-lg leading-relaxed">
                <p>
                  She was 8 years old when I came into her life. I adopted her when she was 18. 
                  By 15, she was out in the shop <strong className="text-white">fabricating gates 
                  with the guys</strong> — not answering phones, not filing paperwork. Welding. Building.
                </p>
                <p>
                  From there she moved into admin and reception, then into sales, and eventually 
                  became the one building the systems the whole company ran on. I'm more risk-adverse — 
                  she's the one who brought the structure.
                </p>
                <p>
                  The truth is, <strong className="text-white">she left me in the dust</strong>. 
                  After my exit, Kaya stayed on in upper management running Northland Fence. 
                  She didn't inherit anything — she outgrew the guy who started it.
                </p>
                <p className="text-amber-400/90 italic border-l-4 border-amber-500/50 pl-5">
                  "I didn't hand her anything. She showed up at 15, outworked everyone, 
                  and now she runs the place better than I ever did."
                </p>
              </div>
            </div>

            {/* Images - stacked collage */}
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={PHOTOS.kayaLandonSunflowers}
                  alt="Kaya holding Landon in a sunflower field — Minnesota"
                  className="rounded-xl w-full aspect-[16/10] object-cover shadow-2xl"
                />
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <p className="text-xs text-gray-300">Kaya & Landon — Minnesota sunflower fields</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <img
                    src={PHOTOS.kayaBabyLandon}
                    alt="Kaya in Northland Fence shirt holding baby Landon and shipping packages"
                    className="rounded-lg w-full aspect-[3/4] object-cover shadow-xl"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
                    <p className="text-[10px] text-gray-300">Day one — baby Landon & the NF shirt</p>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={PHOTOS.kayaWorking}
                    alt="Kaya working at Northland Fence — shoveling dirt on a job site"
                    className="rounded-lg w-full aspect-[3/4] object-cover shadow-xl"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
                    <p className="text-[10px] text-gray-300">Earning it — on the job site</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3C — JIM: The Cutman
          Full-width character card
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-4xl">
          <div className="bg-gradient-to-br from-gray-800/60 via-card/80 to-gray-900/60 border border-gray-500/20 rounded-2xl p-8 lg:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Placeholder avatar */}
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-700/50 border-2 border-gray-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-4xl md:text-5xl font-bold text-gray-400">J</span>
              </div>
              
              {/* Text */}
              <div>
                <p className="text-gray-400 font-bold text-sm tracking-[0.2em] uppercase mb-2">The Enforcer</p>
                <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                  <span className="text-white">UNCLE JIM</span>
                </h3>
                <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                  <p>
                    My old boxing cutman and best friend. Jim still works at Northland Fence — 
                    he's been there since the beginning. Built like a tank, looks like 
                    <strong className="text-white">Bane from Batman</strong> crossed with a 
                    <strong className="text-white">mini Goldberg from WWE</strong>.
                  </p>
                  <p>
                    Landon calls him "Uncle Jim" — and sometimes just "Mini Goldberg" to his face. 
                    Jim doesn't mind. He's the kind of guy who'd take a punch for you and laugh about it after.
                  </p>
                </div>
                <p className="mt-4 text-gray-500 italic text-sm">
                  📸 Photos coming soon — stay tuned for the full Jim experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — THE MISSION: What Is Chasing Doom?
          Full-width centered
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-card/50 border-y border-border/50">
        <div className="container max-w-4xl text-center">
          <p className="text-purple-400 font-bold text-sm tracking-[0.2em] uppercase mb-3">The Mission</p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-8">WHAT IS CHASING DOOM?</h2>
          
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed text-left max-w-3xl mx-auto">
            <p>
              We're traveling across the country — hitting card stores, grading cards, learning the 
              business, and enjoying every mile of it as a family. Landon and I hunt for Doctor Doom 
              cards and toys at every stop. Laura rolls her eyes. We keep driving.
            </p>
            <p>
              This isn't a polished brand launch. It's a real journey unfolding in real time. We don't 
              know exactly where it goes. That's the point.
            </p>
            <p>
              Along the way, we're doing giveaways — targeting families like ours. Collectors with 
              kids. Dads and moms who are trying to share something they love with the next generation.
            </p>
          </div>

          {/* Three pillars */}
          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            <div className="bg-background/50 border border-border/50 rounded-xl p-6">
              <MapPin className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Card Store Visits</h3>
              <p className="text-gray-400 text-sm">Every city, every shop. Finding the hidden gems across America.</p>
            </div>
            <div className="bg-background/50 border border-border/50 rounded-xl p-6">
              <Play className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">The Hunt</h3>
              <p className="text-gray-400 text-sm">Doctor Doom cards, toys, and anything that catches Landon's eye.</p>
            </div>
            <div className="bg-background/50 border border-border/50 rounded-xl p-6">
              <Heart className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Family Giveaways</h3>
              <p className="text-gray-400 text-sm">Random giveaways to collector families. Because this hobby is better shared.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — THE SEPTEMBER MILESTONE
          Cinematic callout
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-4xl">
          <div className="bg-gradient-to-br from-green-500/10 via-card/80 to-purple-500/10 border border-green-500/20 rounded-2xl p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-green-400" />
              <p className="text-green-400 font-bold text-sm tracking-[0.2em] uppercase">September 2026</p>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold mb-6">
              Two Milestones. One Month.
            </h3>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                In September, Avengers: Endgame re-releases in theaters with new footage bridging 
                to Doomsday. RDJ returns as Doctor Doom.
              </p>
              <p>
                That same month, I hit twenty years sober.
              </p>
              <p>
                RDJ's sobriety story is one of the most well-known in Hollywood. He chose redemption. 
                He came back stronger. He's now playing the villain who wants to reshape the world.
              </p>
              <p className="text-green-400 font-bold text-xl">
                I chose sobriety. I built something. I sold it. And now I'm reshaping my life — 
                on the road with my son, chasing the same character RDJ is becoming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 — INTERACTIVE ROAD TRIP TIMELINE
          Visual tracker of the cross-country journey
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-card/50 border-y border-border/50">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-3">On The Road</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">TRIP UPDATES</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Follow our journey across America. Every stop, every find, every card store.
              Click a stop to see what we found.
            </p>
          </div>

          <RoadTripTimeline />

          <div className="mt-12 text-center">
            <Link href="/about">
              <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                Read Our Full Story <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
