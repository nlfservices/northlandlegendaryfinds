/**
 * The Little Things â€” Community / Journey / Giveaway Page
 * Personal, authentic, fun â€” about the hobby, family, and community
 * Giveaway entry via email signup, personal narrative, community highlights
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Heart, Gift, Users, Star, Trophy, Sparkles, Quote,
  ArrowRight, Coffee, Gamepad2, PartyPopper, Camera,
} from "lucide-react";
import SEO, { breadcrumbJsonLd } from "@/components/SEO";
import { Link } from "wouter";

const HERO_IMAGE = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/the-little-things-hero-KDPMJF4QvdHs4YvLtvykDf.webp";
const NLF_LOGO = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-logo-green-ciGKXnqvbdFkQwjAUHWAqf.webp";

export default function TheLittleThings() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribe = trpc.public.subscribe.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      if (data.isDuplicate) {
        toast.info("You're already on the list! We'll keep you posted.");
      } else {
        toast.success("You're in! Welcome to the journey. ðŸŽ‰");
      }
    },
    onError: (err: any) => {
      if (err.message?.includes("already")) {
        toast.info("You're already on the list! We'll keep you posted.");
        setSubmitted(true);
      } else {
        toast.error("Something went wrong. Try again?");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribe.mutate({
      email: email.trim(),
      firstName: firstName.trim() || undefined,
      source: "the-little-things",
    });
  };

  return (
    <>
      <SEO
        title="The Little Things â€” Our Journey, Giveaways & Community"
        description="Join the Northland Legendary Finds family. Giveaways, father-son card rips, embarrassing my wife at card shows, and building a community around the little things that make this hobby legendary."
        path="/the-little-things"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "The Little Things", url: "/the-little-things" },
        ])}
      />

      <div className="min-h-screen">
        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-[500px] lg:min-h-[650px] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={HERO_IMAGE} alt="Father and son opening Marvel cards together" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          <div className="container relative z-10 py-12 lg:py-0">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-4 border-green-500/40 text-green-400 px-4 py-1.5 text-sm">
                <Heart className="w-3.5 h-3.5 mr-1.5 fill-green-400" />
                IT'S NOT JUST ABOUT THE CARDS
              </Badge>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-5 leading-[0.9] text-white"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                THE LITTLE
                <br />
                <span className="text-green-400">THINGS</span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed mb-8 max-w-xl">
                This isn't just a card shop. It's a journey â€” ripping packs with my son, 
                embarrassing my wife at every card show we attend, and building something 
                with all of you. Come along for the ride.
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-yellow-400" />
                  <span>Monthly Giveaways</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Growing Community</span>
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-purple-400" />
                  <span>Behind the Scenes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== THE STORY SECTION ===== */}
        <section className="py-16 lg:py-24">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                WHY WE DO THIS
              </h2>
              <div className="w-20 h-1 bg-green-500 mx-auto rounded-full" />
            </div>

            <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
              <div className="flex gap-4 items-start">
                <Quote className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
                <p>
                  Look â€” I'm not going to pretend this is some polished corporate thing. 
                  It started with me and my son sitting at the kitchen table, ripping packs, 
                  and losing our minds over a holographic Spider-Man. That's it. That was the moment.
                </p>
              </div>

              <p className="pl-12">
                My wife thinks I'm insane. She's probably right. But she also can't stop laughing 
                when I drag her to card shows and make her hold up slabs for photos. She's a good sport. 
                Most of the time. I plan on continuing to embarrass her publicly, so if you're here for 
                that content â€” you're in the right place.
              </p>

              <p className="pl-12">
                But here's the real thing: this hobby brought me closer to my kid. It gave us something 
                to geek out about together. And now it's connecting us with all of you â€” people who get 
                excited about the same stuff. Whether you're collecting with your son, your daughter, 
                your buddy, your partner, or just yourself â€” this is for you.
              </p>

              <div className="pl-12 p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-300 font-medium">
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  The cards are cool. The community is cooler. The memories? That's the legendary part.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== GIVEAWAY SECTION ===== */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-green-950/20 to-transparent">
          <div className="container max-w-5xl">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-yellow-500/40 text-yellow-400 px-4 py-1.5">
                <Trophy className="w-3.5 h-3.5 mr-1.5" />
                FREE STUFF. SERIOUSLY.
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                GIVEAWAYS & DROPS
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Every month we give away cards, packs, and NLF merch to our community. 
                No purchase necessary. Just be part of the journey.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Giveaway Card 1 */}
              <div className="p-6 bg-card border border-border rounded-xl hover:border-green-500/40 transition-colors">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Monthly Card Giveaway</h3>
                <p className="text-gray-400 text-sm">
                  Graded slabs, raw singles, sealed packs â€” we rotate what we give away 
                  every month. Subscribers get automatic entry.
                </p>
              </div>

              {/* Giveaway Card 2 */}
              <div className="p-6 bg-card border border-border rounded-xl hover:border-green-500/40 transition-colors">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <PartyPopper className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Live Show Drops</h3>
                <p className="text-gray-400 text-sm">
                  Every Whatnot stream, we drop free cards throughout the show. 
                  Just show up, hang out, and you might walk away with something legendary.
                </p>
              </div>

              {/* Giveaway Card 3 */}
              <div className="p-6 bg-card border border-border rounded-xl hover:border-green-500/40 transition-colors">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Community Milestones</h3>
                <p className="text-gray-400 text-sm">
                  When we hit subscriber milestones, we celebrate with bonus giveaways. 
                  The bigger we grow, the more we give back.
                </p>
              </div>
            </div>

            {/* Email Signup for Giveaway */}
            <div className="max-w-xl mx-auto">
              <div className="p-8 bg-card border border-green-500/30 rounded-2xl text-center">
                <img src={NLF_LOGO} alt="NLF" className="w-14 h-14 mx-auto mb-4 rounded-lg" />
                <h3 className="text-xl font-bold mb-2">Join the Journey</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Drop your email to get giveaway entries, behind-the-scenes updates, 
                  and first dibs on new drops. No spam. Just the good stuff.
                </p>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                      type="text"
                      placeholder="First name (optional)"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-background border-border"
                    />
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background border-border"
                    />
                    <Button
                      type="submit"
                      disabled={subscribe.isPending}
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-6 text-lg"
                    >
                      {subscribe.isPending ? (
                        "Joining..."
                      ) : (
                        <>
                          <Gift className="w-5 h-5 mr-2" />
                          Count Me In
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      By signing up you agree to occasional emails. Unsubscribe anytime.
                    </p>
                  </form>
                ) : (
                  <div className="py-6">
                    <PartyPopper className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-green-400 font-bold text-lg">You're in! ðŸŽ‰</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Welcome to the family. Keep an eye on your inbox.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== THE JOURNEY HIGHLIGHTS ===== */}
        <section className="py-16 lg:py-24">
          <div className="container max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                COME ALONG FOR THE RIDE
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Here's what you're signing up for. Fair warning â€” it's not always pretty, 
                but it's always real.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Highlight 1 */}
              <div className="group p-6 bg-card border border-border rounded-xl hover:border-yellow-500/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gamepad2 className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Father-Son Pack Rips</h3>
                    <p className="text-gray-400 text-sm">
                      My kid's reaction to pulling a hit is worth more than the card itself. 
                      We share the best ones here.
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlight 2 */}
              <div className="group p-6 bg-card border border-border rounded-xl hover:border-red-500/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Embarrassing My Wife</h3>
                    <p className="text-gray-400 text-sm">
                      She didn't sign up for this. But she's here now. And yes, there will 
                      be photos. And yes, she will be annoyed. Content gold.
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlight 3 */}
              <div className="group p-6 bg-card border border-border rounded-xl hover:border-green-500/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Coffee className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Card Show Adventures</h3>
                    <p className="text-gray-400 text-sm">
                      We hit local shows, conventions, and meetups. Sometimes we find 
                      treasure. Sometimes we just eat overpriced hot dogs. Both are content.
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlight 4 */}
              <div className="group p-6 bg-card border border-border rounded-xl hover:border-blue-500/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Community Wins</h3>
                    <p className="text-gray-400 text-sm">
                      When you pull a hit, we celebrate with you. When you win a giveaway, 
                      we share it. This is YOUR community too.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section className="py-16 lg:py-20">
          <div className="container max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              READY TO JOIN?
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Whether you're a seasoned collector or just getting started â€” 
              whether you're here for the cards, the giveaways, or just to watch me 
              embarrass my wife â€” you're welcome here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/giveaway">
                <Button size="lg" className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-6 text-lg">
                  <Gift className="w-5 h-5 mr-2" />
                  See Current Giveaways
                </Button>
              </Link>
              <Link href="/mcu-news">
                <Button size="lg" variant="outline" className="border-green-500/40 text-green-400 hover:bg-green-500/10 font-bold px-8 py-6 text-lg">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Read Latest News
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

