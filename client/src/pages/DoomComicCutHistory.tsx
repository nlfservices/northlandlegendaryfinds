/**
 * Doctor Doom HISTORY — storyline companion to 2025 Topps Marvel Mint
 * Authentic Comic Cuts (DD-CC). Insert-family lore page, not a Doom-only DB.
 */
import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, ShieldAlert, Youtube } from "lucide-react";
import SEO, { breadcrumbJsonLd, organizationJsonLd } from "@/components/SEO";
import {
  CARD_DATABASE_PATH,
  CHROME_2026_SET_PATH,
  DOOM_CARD_IMAGE,
  DOOM_CHARACTER_PATH,
  DOOM_HISTORY_PATH,
  DOOM_VIDEO_PATH,
  DOOM_YOUTUBE_ID,
  MINT_2025_SET_PATH,
  MINT_COMIC_CUT_FACTS,
  OWUD_PATH,
  VIDEOS_PATH,
} from "@/data/doomComicCuts";
import { youtubeEmbedUrl } from "@/data/videos";

const SEO_TITLE = "Doctor Doom History — 2025 Marvel Mint Comic Cuts (DD-CC)";
const SEO_DESCRIPTION =
  "Curated Doctor Doom lore companion to 2025 Topps Marvel Mint Authentic Comic Cuts (DD-CC). Victor von Doom, Latveria, Secret Wars context, MCU-era notes, and reported checklist facts. Independent NLF write-up.";

export default function DoomComicCutHistory() {
  const [showHero, setShowHero] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        path={DOOM_HISTORY_PATH}
        image={DOOM_CARD_IMAGE}
        type="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Card Database", url: CARD_DATABASE_PATH },
            { name: "2025 Topps Marvel Mint", url: MINT_2025_SET_PATH },
            { name: "Comic Cuts", url: DOOM_HISTORY_PATH },
            { name: "Doctor Doom History", url: DOOM_HISTORY_PATH },
          ]),
          organizationJsonLd(),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: SEO_TITLE,
            description: SEO_DESCRIPTION,
            image: DOOM_CARD_IMAGE,
            author: { "@type": "Organization", name: "NLF Team" },
          },
        ]}
      />

      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.12),transparent_70%)]" />

        <article className="container relative z-10 max-w-5xl py-10 lg:py-14">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={CARD_DATABASE_PATH} className="transition-colors hover:text-foreground">
              Card Database
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={MINT_2025_SET_PATH} className="transition-colors hover:text-foreground">
              2025 Topps Marvel Mint
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-muted-foreground">Comic Cuts</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">Doctor Doom History</span>
          </nav>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              Insert-family companion
            </span>
            <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
              {MINT_COMIC_CUT_FACTS.set}
            </span>
            <span className="rounded-full border border-border/60 px-3 py-1 font-mono text-xs text-muted-foreground">
              {MINT_COMIC_CUT_FACTS.cardNumber}
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-6xl">
            <span className="text-primary">DOCTOR DOOM</span>{" "}
            <span className="text-foreground">HISTORY</span>
          </h1>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            The storyline companion to {MINT_COMIC_CUT_FACTS.set}{" "}
            {MINT_COMIC_CUT_FACTS.insertFamily} — Victor von Doom, sealed into
            unique 1/1 comic panels. Not a standalone Doom database. Nested under
            the official Mint set and the DD-CC insert family.
          </p>

          {showHero && (
            <div className="mb-10 overflow-hidden rounded-xl border border-green-500/20 bg-black/50 shadow-lg shadow-green-950/30">
              <img
                src={DOOM_CARD_IMAGE}
                alt="2025 Topps Marvel Mint Doctor Doom Authentic Comic Cut 1/1 (DD-CC)"
                className="mx-auto max-h-[560px] w-full object-contain"
                onError={() => setShowHero(false)}
              />
            </div>
          )}

          <ReportedFacts />

          <div className="prose prose-invert prose-lg mb-12 max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:leading-relaxed prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <h2>Why these Comic Cuts matter</h2>
            <p>
              Most chase cards reprint a photo. {MINT_COMIC_CUT_FACTS.insertFamily} do something
              colder and more collector-specific: they take a piece of published Marvel
              comic art — ink that already lived on a newsstand or in a long box — and
              seal it into a 2025 Topps Marvel Mint card. Each Doctor Doom cut is a
              unique 1/1 panel in an encased, one-touch-style holder, the way Topps
              Ripped describes the insert. You are not hunting a parallel rainbow. You
              are hunting a sliver of comic history with Victor von Doom&apos;s iron
              mask still on it.
            </p>
            <p>
              That is why Doom dominates this conversation. Victor von Doom is
              Latveria&apos;s iron monarch: scientist, sorcerer, head of state, and the
              Fantastic Four&apos;s longest-running intellectual rival. For more than
              sixty years, artists have drawn the same silhouette — steel faceplate,
              green cloak, armored hands — through college grudges, castle sieges,
              cosmic coups, and every era of Marvel continuity that collectors still
              argue about. When Topps cut authentic published pages into Mint, Doom
              was never going to be a cameo. He is the monarch the insert was built
              to crown.
            </p>
            <p>
              This page sits under the official set, not beside it. The product is{" "}
              {MINT_COMIC_CUT_FACTS.set}. The insert family is{" "}
              {MINT_COMIC_CUT_FACTS.insertFamily} ({MINT_COMIC_CUT_FACTS.cardNumber}).
              Reported checklist notes put about {MINT_COMIC_CUT_FACTS.uniquePanels} unique
              Doctor Doom Comic Cut 1/1 panels in the release, with hobby odds near{" "}
              {MINT_COMIC_CUT_FACTS.hobbyOdds} and SDCC near {MINT_COMIC_CUT_FACTS.sdccOdds}.
              Those are reported checklist figures, not a sealed Topps box print-run
              claim — NLF does not invent total box counts. The cuts are also distinct
              from the separate SDCC Chrome Doctor Doom cards. If you came here from
              the filmed 1/1, stay with the insert family. The lore is the spine. The
              card is the artifact.
            </p>

            <h2>First appearance era — Fantastic Four #5 (1962)</h2>
            <p>
              The debut frame is not subtle, and it does not need to be. Fantastic
              Four #5, cover-dated July 1962, is the issue collectors use to date
              Doctor Doom&apos;s entrance into Marvel history. Stan Lee and Jack Kirby
              introduce Victor von Doom as more than a masked strongman. He is Reed
              Richards&apos; opposite number: a mind that could have stood with the
              smartest man in the room, and a pride that would rather rule the room
              than share it.
            </p>
            <p>
              The college-era wound is the origin collectors still recite. Victor and
              Reed as students. An experiment that goes wrong. A face scarred — in
              some tellings more by humiliation than by fire — and a mask that becomes
              a second skin. Whether a given Comic Cut panel shows the laboratory, the
              first armored stride, or a later castle balcony, the visual contract is
              the same one Kirby locked in: iron armor, green cloak, and a metal face
              that refuses to be read as a man asking for sympathy.
            </p>
            <p>
              That through-line is why DD-CC cards photograph the way they do. You can
              change the inker, the decade, the costume trim, even the amount of
              cloak in the panel, and a collector still says “Doom” in under a second.
              The rivalry with Reed Richards and the Fantastic Four begins in that
              1962 frame and never really ends. Sue, Johnny, and Ben are not guest
              stars in Victor&apos;s life; they are the family he cannot out-think
              cleanly and cannot stop measuring himself against. Mint did not invent
              that tension. It cut it out of paper that already carried it.
            </p>
            <p>
              One collector caution, because this page is tied to a real filmed card:
              NLF&apos;s video of a Doctor Doom Comic Cut 1/1 does not assign a
              specific issue or page to that panel. Do not let a first-appearance
              essay become a fake attribution. Fantastic Four #5 frames the era. It
              does not automatically label the slab on the table.
            </p>

            <h2>Latveria and the classic Fantastic Four fights</h2>
            <p>
              Doom is not a drifter in a helmet. He is a head of state. Latveria is
              the small European nation he rules as monarch, laboratory, and
              fortress — a country drawn small on the map and enormous in Marvel
              politics. The genius-monarch motif is the whole joke and the whole
              threat: Victor can design a time platform, debate the laws of magic,
              and still have to sign the paperwork of a sovereign who expects the
              world to treat him as a peer of nations, not a supervillain with a
              castle hobby.
            </p>
            <p>
              Classic Fantastic Four stories keep returning to that country the way
              westerns return to the same dusty street. The Four cross a border they
              were not invited to cross. Servo-Guards — Latveria&apos;s armored
              automatons — meet them in courtyards and corridors. Doom watches from a
              throne, a balcony, or a monitor wall, already three moves ahead and
              still furious that Reed might find a fourth. You do not need a forged
              issue number to recognize the beat. If a Comic Cut shows green-cloaked
              armor against castle stone, robot soldiers, or a Latverian banner, you
              are looking at the FF-foil loop that defined Doom for decades.
            </p>
            <p>
              Servo-Guard imagery matters to collectors because it is Doom&apos;s
              industrial signature. These are not generic robots. They are the
              standing army of a monarch who would rather mass-produce loyalty than
              ask for it. Latverian streets, iron crests, and those blank-faced
              sentries show up across eras of Fantastic Four storytelling for a
              reason: they prove Victor is not hiding in a sewer. He built a state
              that looks like him.
            </p>
            <p>
              High-level, that is the accurate read. Doom as sovereign. Reed as the
              only intellect Victor will admit might match him. The Four as the
              recurring disruption of a country that wants to be left alone to
              perfect itself. This page will not invent issue numbers for the
              specific filmed 1/1 panel. If the art on a given DD-CC shows
              Latverian or Servo-Guard-style imagery, treat it as a classic FF-foil
              beat — not as a claimed citation until the page itself is identified.
            </p>

            <h2>Secret Wars and the peaks collectors already know</h2>
            <p>
              Ask a room of Marvel collectors why Doctor Doom panels feel like event
              cards even when the insert is “only” a comic cut, and someone will say
              Secret Wars. The 1984–85 Jim Shooter / Mike Zeck saga is the first
              peak most people mean: the Beyonder, Battleworld, heroes and villains
              dumped onto a patchwork planet, and Doom doing the most Doom thing
              imaginable — stealing a god&apos;s power and wearing it like a second
              crown. That story is why a generation learned to read Victor as more
              than the Fantastic Four&apos;s monthly problem. He is the man who will
              take the biggest prize in the room because he believes it was always
              his.
            </p>
            <p>
              The 2015 Secret Wars revival, with Jonathan Hickman&apos;s long build
              and Doom as God Emperor of a new Battleworld, is the second peak
              collectors name without being prompted. Same monarch, larger board.
              Continents stitched from dying universes. A throne that is also a
              confession: Victor will save creation if saving it means he gets to
              rule it. Those two Secret Wars eras are why Doom art saturates chase
              culture. They are the mythology beats people recognize from long boxes,
              trade paperbacks, and every “greatest villain” list that still puts
              the iron mask near the top.
            </p>
            <p>
              That is lore context for why Doctor Doom panels dominate Comic Cut
              chases. It is not a claim about the specific filmed 1/1. NLF&apos;s
              Videos SEO for that card is explicit: no specific issue or page is
              assigned to that cut, and the listing does not hang Secret Wars or
              Battleworld on the panel. If a collector later identifies the page,
              the catalog can say so. Until then, Secret Wars stays where it belongs
              on this companion page — as the reason Doom&apos;s published history is
              deep enough to support roughly two hundred unique 1/1s without
              repeating a single photo shoot.
            </p>

            <h2>Movie era — Fantastic Four on screen, Doomsday on the horizon</h2>
            <p>
              Comic Cuts are printed history. The MCU is the other half of why
              collectors are staring at Doom right now, and it belongs on this
              spine as research context — not as a second product, and not as
              invented box-office math.
            </p>
            <p>
              <em>The Fantastic Four: First Steps</em> (2025) brought Reed, Sue,
              Johnny, and Ben into the current Marvel Studios continuity. For anyone
              who collects Doom, that is not a side quest. The Four are the foil
              family. When the MCU finally stages Mister Fantastic as a public
              genius and a husband and a teammate, it restages the oldest Doom
              argument in a new accent: Victor versus Reed, monarch versus explorer,
              control versus curiosity. NLF is not assigning First Steps a dollar
              figure here. The useful fact for this page is narrative. The classic
              rivalry now has a live-action household the rest of the MCU can walk
              into.
            </p>
            <p>
              <em>Avengers: Doomsday</em> is the film collectors are actually
              circling on the calendar. Reports place it in December 2026, with
              Robert Downey Jr. as Doctor Doom — a confirmed MCU-era casting that
              flipped the hobby&apos;s Doom conversation from “someday” to “this
              cycle.” Trade coverage has discussed scarred-face imagery, armor
              reveals, and Latveria-flavored marketing language. Treat those as
              reports. Trailers and official stills move. This write-up will not
              freeze a rumor as a plot point, and it will not invent opening-weekend
              numbers that do not belong on a Comic Cuts companion page.
            </p>
            <p>
              What the movie era does change is the collector weather around Mint.
              A sealed 1960s-to-modern comic panel of Victor von Doom is no longer
              only a comic-history flex. It is also the character the MCU is
              currently building toward, sitting in the same release year window as
              First Steps and the Doomsday run-up. That is why this HISTORY page
              mentions the films and still refuses to become a ticket stub. The
              artifact is the DD-CC. The films explain why more people suddenly
              know the monarch&apos;s name.
            </p>
            <p>
              Keep the products in their official houses. Mint 2025 holds Authentic
              Comic Cuts. 2026 Topps Chrome Marvel Comics holds its own Doom-related
              insert families, including One World Under Doom, on the shared Chrome
              2026 set catalog — not on an isolated Doom database. Movie heat is a
              weather system. Insert families stay under their official sets.
            </p>

            <h2>Through-line to Mint Comic Cuts</h2>
            <p>
              Stretch a line from Fantastic Four #5 through Latverian throne rooms,
              Servo-Guard courtyards, two Secret Wars coronations, and the MCU&apos;s
              current Doom weather, and you get the reason {MINT_COMIC_CUT_FACTS.uniquePanels}{" "}
              unique {MINT_COMIC_CUT_FACTS.cardNumber} panels can exist without
              feeling like filler. Decades of published Doom art — different
              pencilers, different decades, the same iron monarch — become a chase
              that is literally finite. Each cut is unique sealed published Marvel
              comic art. There is no second copy of that exact rectangle of page.
            </p>
            <p>
              Collector framing, then, is simple. You are not completing a 200-card
              base set. You are encountering one of about two hundred one-of-one
              Doom pages that Topps cut for this Mint insert family. Reported
              checklist odds sit near {MINT_COMIC_CUT_FACTS.hobbyOdds} hobby and{" "}
              {MINT_COMIC_CUT_FACTS.sdccOdds} SDCC. The holder is encased /
              one-touch style as Topps Ripped describes. The insert is a flagship
              Mint chase, and it is not the same product as the separate SDCC Chrome
              Doctor Doom cards. If you want the official set checklist and the rest
              of the 2025 Marvel Mint insert neighborhood, that lives on the{" "}
              <Link href={MINT_2025_SET_PATH}>2025 Topps Marvel Mint</Link> catalog
              page. This HISTORY page is the storyline companion sitting next to
              that family — not a replacement for it.
            </p>
            <p>
              NLF filmed one of those 1/1s. The video walks the card the way
              collectors do: light on the slab, armor in the panel, no fake issue
              stamp. Watch that, then come back here for the decades that made a
              green cloak worth cutting out of a comic in the first place.
            </p>
          </div>

          <DisambiguationBox />
          <VideoCompanion />
          <CtaStrip />

          <p className="mt-10 border-t border-border/50 pt-6 text-xs leading-relaxed text-muted-foreground">
            Independent NLF write-up — not an official Topps or Marvel statement.
            Set facts are cited as reported checklist figures. Odds are pull odds,
            not prices, and not a sealed box print-run claim. Movie-era notes are
            research context only.
          </p>
        </article>
      </div>
    </div>
  );
}

function ReportedFacts() {
  return (
    <aside className="mb-10 rounded-xl border border-green-500/25 bg-card/50 p-5 sm:p-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
        Reported checklist — {MINT_COMIC_CUT_FACTS.set}
      </p>
      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <Fact label="Official set" value={MINT_COMIC_CUT_FACTS.set} />
        <Fact label="Insert family" value={`${MINT_COMIC_CUT_FACTS.insertFamily} / ${MINT_COMIC_CUT_FACTS.cardNumber}`} />
        <Fact label="Unique Doom panels" value={`${MINT_COMIC_CUT_FACTS.uniquePanels} Doctor Doom Comic Cut 1/1s`} />
        <Fact label="Reported hobby odds" value={MINT_COMIC_CUT_FACTS.hobbyOdds} />
        <Fact label="Reported SDCC odds" value={MINT_COMIC_CUT_FACTS.sdccOdds} />
        <Fact label="Format" value="Unique sealed published Marvel comic art, encased / one-touch style" />
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Distinct from separate SDCC Chrome Doctor Doom cards. Independent NLF
        write-up — not an official Topps or Marvel statement. Total box print run
        unknown; not invented here.
      </p>
    </aside>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function DisambiguationBox() {
  return (
    <aside className="mb-10 rounded-xl border border-amber-400/35 bg-amber-400/5 p-5 sm:p-6">
      <div className="mb-2 flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-300" />
        <h2 className="text-lg font-bold text-amber-200">Not Doom 2099</h2>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        This page is classic <strong className="text-foreground">Doctor Doom — Victor von Doom</strong>,
        monarch of Latveria, Fantastic Four rival since 1962. It is not Doom 2099.
        Do not conflate the two. In the 2026 Topps Chrome Marvel Comics master-set
        catalog they even sit as separate base characters. Comic Cuts DD-CC and
        this HISTORY companion are Victor. If you are looking for the 2099
        character, that belongs on the Chrome 2026 set page as its own checklist
        line — not here.
      </p>
    </aside>
  );
}

function VideoCompanion() {
  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Youtube className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-green-400">
          NLF video companion
        </h2>
      </div>
      <div className="overflow-hidden rounded-xl border border-green-500/20 bg-black shadow-lg shadow-green-950/30">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`${youtubeEmbedUrl(DOOM_YOUTUBE_ID)}?rel=0&modestbranding=1`}
            title="2025 Topps Marvel Mint Doctor Doom 1/1 Comic Cut"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Prefer the full Videos landing page?{" "}
        <Link href={DOOM_VIDEO_PATH} className="font-semibold text-green-400 hover:text-green-300">
          Open the Doctor Doom Comic Cut 1/1 detail
        </Link>
        .
      </p>
    </section>
  );
}

function CtaStrip() {
  return (
    <section className="rounded-xl border border-green-500/25 bg-card/40 p-5 sm:p-6">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-green-400">
        Keep reading the catalog
      </h2>
      <ul className="space-y-3 text-sm">
        <li>
          <Link href={DOOM_VIDEO_PATH} className="font-semibold text-green-400 hover:text-green-300">
            Watch the NLF video
          </Link>
          <span className="text-muted-foreground"> — filmed look at a DD-CC 1/1.</span>
        </li>
        <li>
          <Link href={MINT_2025_SET_PATH} className="font-semibold text-emerald-300 hover:text-emerald-200">
            Browse 2025 Marvel Mint checklist
          </Link>
          <span className="text-muted-foreground"> — official set page for this insert family.</span>
        </li>
        <li>
          <Link href={VIDEOS_PATH} className="font-semibold text-green-400 hover:text-green-300">
            All NLF Videos
          </Link>
        </li>
        <li>
          <Link href={OWUD_PATH} className="font-semibold text-emerald-300 hover:text-emerald-200">
            2026 Chrome — One World Under Doom (research)
          </Link>
          <span className="text-muted-foreground">
            {" "}
            — insert family under{" "}
            <Link href={CHROME_2026_SET_PATH} className="text-emerald-300 hover:text-emerald-200">
              2026 Topps Chrome Marvel Comics
            </Link>
            , not a separate Doom database.
          </span>
        </li>
        <li>
          <Link href={DOOM_CHARACTER_PATH} className="text-muted-foreground hover:text-foreground">
            Character directory: Doctor Doom
          </Link>
          <span className="text-muted-foreground"> — secondary. This page stands alone.</span>
        </li>
      </ul>
    </section>
  );
}
