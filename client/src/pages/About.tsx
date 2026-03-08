/**
 * About Page - Company information and mission
 */

import { Shield, Star, TrendingUp, Package } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center space-bg overflow-hidden">
        <div className="container relative z-10 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 glow-green">
            ABOUT US
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trusted source for premium Marvel trading card repacks — Star Wars collection coming June 2026
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-8 text-primary">
            OUR MISSION
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 leading-relaxed">
            At Northland Legendary Finds, we're passionate collectors who understand the thrill of the hunt. 
            Our mission is to bring that excitement to every collector by building repacks around three promises: 
            a strong floor (every pack delivers real value), a better middle (quality cards throughout, not filler), 
            and a healthy ceiling (legitimate chase cards in the mix). We believe in authenticity, transparency, 
            and delivering a consistently great experience on every single pack.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-lg glow-purple">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">100% Authentic</h3>
              <p className="text-muted-foreground">
                Every card we sell is verified authentic from official Topps releases. 
                We never sell counterfeits or unauthorized reproductions.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg glow-teal">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Better Middle</h3>
              <p className="text-muted-foreground">
                Where competitors stuff packs with filler, we load quality. Your average NLF pack 
                is packed with cards most sellers would consider hits.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg glow-gold">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Strong Floor</h3>
              <p className="text-muted-foreground">
                No junk filler, no worthless base cards. Every single card in every pack 
                has real, collectible value. We'd rather make fewer packs than dilute quality.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg glow-purple">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Healthy Ceiling</h3>
              <p className="text-muted-foreground">
                Real chase cards worth real money — numbered parallels, autos, and 
                professionally graded slabs are always in the mix.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-8">
            OUR STORY
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Northland Legendary Finds was born from a passion for collecting and a desire to share 
              that passion with fellow enthusiasts. As lifelong collectors of Marvel and Star Wars memorabilia, 
              we understand the excitement of opening a pack and discovering something special.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              We started with a simple goal: create trading card repacks that deliver a consistently great experience. 
              Strong floor, better middle, healthy ceiling — every pack built to exceed expectations, not just hit a card count.
            </p>
            <p className="text-lg text-muted-foreground">
              Today, we're proud to serve collectors across the country, helping them build amazing collections 
              while ensuring every box delivers the thrill we all love. Whether you're a seasoned collector or 
              just starting your journey, we're here to make your collecting experience legendary.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-4">GET IN TOUCH</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions? Want to learn more about our repacks? We'd love to hear from you!
          </p>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Email: <a href="mailto:info@nlfservices.com" className="text-primary hover:underline">info@nlfservices.com</a>
            </p>
            <p className="text-muted-foreground">
              Follow us on social media for the latest drops and exclusive offers
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
