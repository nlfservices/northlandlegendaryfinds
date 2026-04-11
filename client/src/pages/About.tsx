/**
 * About Page — Founder Story with Family Photos
 * Narrative arc: The Hustle → The Builder → The Next Chapter → The Mission → The Why
 * Photo-rich, story-driven layout with alternating image/text sections
 */

import { Heart, Star, Users, ArrowRight, Play, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";

// ── CDN Photo URLs ──────────────────────────────────────────────────────────
const PHOTOS = {
  // Hero — family together
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/3ofUs-StarWarsStarCruiser_8441a617.jpg",
  // Founders — couple shot
  founders: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/KayaandINLFVegasRetreat_ce081be8.jpg",
  // Father & son — warm, direct
  fatherSon: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/MeandtheBoy_0a66ac02.jpg",
  // Boxing back in the day
  boxing: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Boxingbackintheday_82250df8.jpg",
  // Landon with Marvel heroes
  landonIronman: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Landon&Ironman_2dfee5df.jpg",
  landonSpiderman: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Landon&Spiderman_17eb7847.jpg",
  landonThor: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Landon&Thor_c8979307.jpg",
  landonCaptain: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Landon&CaptainAMerica_bf78548f.jpg",
  landonBlackWidow: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/LittleCaptain-withBlackwidow_0b3fd4cb.jpg",
  landonWaspAntman: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/LandonwithWaspandAntman_d0f5f14b.jpg",
  // Star Wars adventures
  starWarsCruise: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Landon-StarWarsCruiseship_d84f63dd.jpg",
  mamaStarWars: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Landon&Mama-StarWarsCruiseship_80ff6cc5.jpg",
  // Card shows & hobby
  mnCardShow: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/MNSportsCardShow_ce3636af.jpg",
  toysForTots: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Northland-StarWarsToysforTots3_b11fe6fe.jpg",
  // Sweet moments
  landonReading: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/Landonreading_7b5a53c1.jpg",
  landonSpidermanSchool: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/LandonSpiderman-1stdayofschool_751d4404.jpg",
  // Lifestyle
  avengersdinner: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/AvengersCruiseDinner_12826755.jpg",
  disneyYucatan: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/DisneyMagic-Yucatan_a9013dd4.webp",
};

export default function About() {
  return (
    <div className="min-h-screen">
      <SEO
        title="About Northland Legendary Finds — Our Story"
        description="From humble beginnings in Minnesota to building a successful fence company to launching a Marvel trading card business with his 8-year-old son. Meet the family behind Northland Legendary Finds."
        path="/about"
        jsonLd={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "About", url: "/about" }])}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO: Family Photo + Headline
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[550px] lg:min-h-[650px] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={PHOTOS.hero}
            alt="The family behind Northland Legendary Finds"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
        </div>

        <div className="container relative z-10 py-16">
          <div className="max-w-2xl">
            <p className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-3">
              Our Story
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] mb-5">
              <span className="text-primary">BUILT BY A FAN.</span>
              <br />
              <span className="text-white">RUN BY A FAMILY.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl">
              From humble beginnings in Minnesota to building a successful business — and now starting 
              a brand-new chapter ripping cards with my 8-year-old son.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — THE HUSTLE: Where It All Started
          Image RIGHT, text LEFT
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <p className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-3">Chapter One</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">THE HUSTLE</h2>
              <div className="space-y-5 text-gray-300 text-lg leading-relaxed">
                <p>
                  I grew up with my father in Section 8 housing in Minnesota. We didn't have much, 
                  but even then my old man would find the time to drop me off at the local card show.
                </p>
                <p>
                  That's where I learned to wheel and deal. Trading sports cards at the typical strip 
                  mall card shop, figuring out what things were worth, negotiating with guys twice my 
                  age. I never knew it at the time, but those tables taught me skills I still use in 
                  business today.
                </p>
                <p>
                  Maybe that's the kind of drive you get from growing up the way I did — that push 
                  to do better for your own family one day.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <img
                src={PHOTOS.boxing}
                alt="Back in the day — the hustle years"
                className="relative rounded-xl w-full aspect-[4/3] object-cover shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-300 italic">Back in the day</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — THE BUILDER: Northland Fence
          Image LEFT, text RIGHT
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-card/50 border-y border-border/50">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-3 bg-gradient-to-br from-amber-500/20 via-transparent to-primary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <img
                src={PHOTOS.founders}
                alt="Kaya and I — Northland Legendary Finds Vegas Retreat"
                className="relative rounded-xl w-full aspect-[4/3] object-cover shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-300 italic">The team behind NLF</p>
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <p className="text-amber-400 font-bold text-sm tracking-[0.2em] uppercase mb-3">Chapter Two</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">THE BUILDER</h2>
              <div className="space-y-5 text-gray-300 text-lg leading-relaxed">
                <p>
                  That hustle never left me. I took the same energy from the card shop and built 
                  <strong className="text-white"> Northland Fence</strong> — starting in a rented garage 
                  with nothing but a truck and a dream.
                </p>
                <p>
                  We grew it into one of the <strong className="text-white">largest residential fence 
                  installers in Minnesota</strong>. Not by cutting corners. By showing up every day and treating 
                  every customer like they were our only one.
                </p>
                <p className="text-amber-400/90 italic border-l-4 border-amber-500/50 pl-5">
                  "My wife thinks I'm crazy but that's no different than us running our business 
                  in a garage we rented."
                </p>
                <p>
                  Now my daughter and her husband run Northland Fence. They earned it. And it freed me up for something I'd been thinking about for years.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — THE NEXT CHAPTER: Father & Son
          Image RIGHT, text LEFT — emotional core
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <p className="text-red-400 font-bold text-sm tracking-[0.2em] uppercase mb-3">Chapter Three</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">THE NEXT CHAPTER</h2>
              <div className="space-y-5 text-gray-300 text-lg leading-relaxed">
                <p>
                  My son Landon is 8 years old. He's obsessed with Marvel and Star Wars — just like 
                  his old man. It started with me buying him the same action figures I once played with 
                  from my older brothers, hunting them down at nostalgia toy stores together.
                </p>
                <p>
                  From there it was lightsaber battles in the house — I'm sure the neighbors got a 
                  good laugh out of that one. And now, it's ripping cards together. Watching him light 
                  up over a pull is the same feeling I had at that strip mall card shop all those years ago.
                </p>
                <p className="text-red-400/90 italic border-l-4 border-red-500/50 pl-5 text-xl font-medium">
                  "Unlike my father, I plan on doing everything I can to improve my boy's life."
                </p>
                <p>
                  That's what Northland Legendary Finds is. It's not just a card business. It's a 
                  father and son building something together — and inviting you to be part of it.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-br from-red-500/20 via-transparent to-primary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <img
                src={PHOTOS.fatherSon}
                alt="Me and Landon — the heart of NLF"
                className="relative rounded-xl w-full aspect-[4/3] object-cover shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <p className="text-sm text-gray-300 italic">Me and the boy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — OUT OF THIS WORLD MOMENTS: Photo Gallery
          Grid of Landon with Marvel heroes & Star Wars characters
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-card/50 border-y border-border/50">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-purple-400 font-bold text-sm tracking-[0.2em] uppercase mb-3">The Superfan</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">OUT OF THIS WORLD MOMENTS</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Marvel heroes and Star Wars legends — Landon doesn't just watch, he lives it. 
              Every convention, every character meet, every premiere. This is what it's all about.
            </p>
          </div>

          {/* Photo grid — 3 columns on desktop, 2 on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { src: PHOTOS.landonIronman, alt: "Landon meeting Iron Man", label: "Iron Man" },
              { src: PHOTOS.landonSpiderman, alt: "Landon with Spider-Man", label: "Spider-Man" },
              { src: PHOTOS.landonThor, alt: "Landon with Thor", label: "Thor" },
              { src: PHOTOS.landonCaptain, alt: "Landon with Captain America", label: "Captain America" },
              { src: PHOTOS.landonBlackWidow, alt: "Little Captain with Black Widow", label: "Black Widow" },
              { src: PHOTOS.landonWaspAntman, alt: "Landon with Wasp and Ant-Man", label: "Wasp & Ant-Man" },
            ].map((photo, i) => (
              <div key={i} className="relative group overflow-hidden rounded-xl aspect-[3/4]">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {photo.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 — THE MISSION: Cards as a Hobby
          Full-width statement + side-by-side images
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-3">Chapter Four</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">THE MISSION</h2>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Cards used to be about the hobby — trading with your friends, chasing your favorite 
              characters, the thrill of a good pull. Somewhere along the way, it became all about 
              "investment" and flipping for profit.
            </p>
            <p className="text-primary text-xl font-bold mt-6 max-w-2xl mx-auto">
              We're bringing the hobby back.
            </p>
          </div>

          {/* Two images side by side — card show + community */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="relative group overflow-hidden rounded-xl">
              <img
                src={PHOTOS.mnCardShow}
                alt="Minnesota Sports Card Show"
                className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-lg">MN Sports Card Show</p>
                <p className="text-gray-300 text-sm">Where the community comes together</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-xl">
              <img
                src={PHOTOS.toysForTots}
                alt="Northland Star Wars Toys for Tots"
                className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-lg">Giving Back</p>
                <p className="text-gray-300 text-sm">Star Wars Toys for Tots</p>
              </div>
            </div>
          </div>

          {/* Mission pillars */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-card border border-border/50 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">YouTube Rips</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Father-son card ripping sessions with giveaways. Real reactions, real pulls, real fun.
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-purple-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Whatnot Streams</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Live card breaks where the community picks, watches, and wins together.
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-amber-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Repacks</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                No filler, no junk. Every card hand-selected from authentic Topps releases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7 — ADVENTURES: Star Wars + Family Life
          Horizontal scroll / gallery feel
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-card/50 border-y border-border/50">
        <div className="container max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-cyan-400 font-bold text-sm tracking-[0.2em] uppercase mb-3">Beyond the Cards</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">FAMILY ADVENTURES</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We don't just collect — we live it. Star Wars cruises, Marvel dinners, 
              conventions, and everything in between.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { src: PHOTOS.starWarsCruise, alt: "Landon on Star Wars Cruise", label: "Star Wars Cruise" },
              { src: PHOTOS.avengersdinner, alt: "Avengers Cruise Dinner", label: "Avengers Dinner" },
              { src: PHOTOS.landonReading, alt: "Landon reading", label: "Quiet Moments" },
              { src: PHOTOS.landonSpidermanSchool, alt: "Landon Spider-Man first day of school", label: "1st Day of School" },
            ].map((photo, i) => (
              <div key={i} className="relative group overflow-hidden rounded-xl aspect-square">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-sm font-bold">{photo.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8 — THE WHY: Emotional Close
          Full-width cinematic statement
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container relative z-10 max-w-4xl text-center">
          <p className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-6">The Why</p>
          
          <blockquote className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-8">
            <span className="text-white">"Unlike my father, I plan on doing </span>
            <span className="text-primary">everything I can</span>
            <span className="text-white"> to improve my boy's life."</span>
          </blockquote>

          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-4">
            That's the whole story. Everything else — the cards, the streams, the business — 
            is just the vehicle. The destination is building something meaningful with my family 
            and sharing it with yours.
          </p>

          <p className="text-primary text-2xl sm:text-3xl font-bold mt-10">
            Let's nerd out together. See you soon.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 9 — CTA: Join Us
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 border-t border-border/50">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">COME HANG WITH US</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Whether you're a lifelong collector or just getting started — we'd love to have you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8">
                <Package className="w-5 h-5 mr-2" />
                Browse Repacks
              </Button>
            </Link>
            <Link href="/whatnot">
              <Button size="lg" variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10 font-bold text-lg px-8">
                <Star className="w-5 h-5 mr-2" />
                Watch Us Live on Whatnot
              </Button>
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-8">
            Questions? Email us at{" "}
            <a href="mailto:contact@nlfservices.com" className="text-primary hover:underline">
              contact@nlfservices.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
