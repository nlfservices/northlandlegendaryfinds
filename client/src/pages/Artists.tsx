/**
 * Artists Directory — Tiered directory of Topps Marvel trading card artists
 * Design: Dark cosmic theme matching NLF site, tier-based cards with glow effects
 * Comic Book Auto artists show portrait + short bio; Sketch Card artists show initials
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ARTISTS, TIERS, type TierName, type CategoryName } from "@/data/artists";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Palette, Pen } from "lucide-react";

const TIER_ORDER: TierName[] = [
  "Latverian Sovereign",
  "Infinity",
  "Uru",
  "Vibranium",
  "Adamantium",
];

// Portrait CDN URLs for comic book auto artists (same as ArtistProfile.tsx)
const ARTIST_PORTRAITS: Record<string, string> = {
  "adam-kubert": "/manus-storage/Adam_Kubert_607d5cb7.jpg",
  "adi-granov": "/manus-storage/Adi_Granov_83c8e824.png",
  "ariel-diaz": "/manus-storage/Ariel_Diaz_3d5b8c24.jpg",
  "arthur-adams": "/manus-storage/Arthur_Adams_eba1c546.jpg",
  "bill-sienkiewicz": "/manus-storage/Bill_Sienkiewicz_3d8019d7.jpg",
  "derrick-chew": "/manus-storage/Derrick_Chew_f8803e35.jpg",
  "e-m-gist": "/manus-storage/EM_Gist_eb42aedb.jpg",
  "ed-mcguinness": "/manus-storage/Ed_McGuinness_34d7e34c.jpg",
  "esad-ribic": "/manus-storage/Esad_Ribic_1251c1e2.jpg",
  "frank-miller": "/manus-storage/Frank_Miller_c0fd0a06.jpg",
  "greg-capullo": "/manus-storage/Greg_Capullo_1546ec44.jpg",
  "greg-horn": "/manus-storage/Greg_Horn_99abd35d.jpg",
  "inhyuk-lee": "/manus-storage/InHyuk_Lee_b420a27e.jpg",
  "jack-kirby": "/manus-storage/Jack_Kirby_031fb58d.jpg",
  "jim-cheung": "/manus-storage/Jim_Cheung_7c1030e9.jpg",
  "joshua-cassara": "/manus-storage/Joshua_Cassara_8f83fd81.jpg",
  "lucio-parrillo": "/manus-storage/Lucio_Parrillo_3bfec929.jpg",
  "marc-silvestri": "/manus-storage/Marc_Silvestri_aaa4d95e.jpg",
  "mark-bagley": "/manus-storage/Mark_Bagley_eb05c78b.jpg",
  "mark-brooks": "/manus-storage/Mark_Brooks_1f0e2187.jpg",
  "mike-mayhew": "/manus-storage/Mike_Mayhew_a5bd6816.jpg",
  "mike-mckone": "/manus-storage/Mike_McKone_151227f1.jpg",
  "mike-zeck": "/manus-storage/Mike_Zeck_f04a2656.jpg",
  "paul-pelletier": "/manus-storage/Paul_Pelletier_36b7b54f.jpg",
  "ryan-stegman": "/manus-storage/Ryan_Stegman_38906a3d.jpg",
  "scott-williams": "/manus-storage/Steve_Epting_1b6ba6d2.jpg",
  "steve-epting": "/manus-storage/Steve_Epting_1b6ba6d2.jpg",
  "steve-mcniven": "/manus-storage/Steve_McNiven_e2325a28.png",
  "whilce-portacio": "/manus-storage/Mark_Brooks_1f0e2187.jpg",
  "ryan-brown": "/manus-storage/Ryan_Stegman_38906a3d.jpg",

  // Sketch Card Artists with portraits
  "emrah-cildir": "/manus-storage/Emrah_Cildir_2eb60a98.jpg",
  "hector-barros": "/manus-storage/Hector_Barros_921672e7.jpg",
  "fabio-ramacci": "/manus-storage/Fabio_Ramacci_26d70f7f.jpg",
  "gary-shipman": "/manus-storage/Gary_Shipman_2dc4383d.jpg",
  "rich-hennemann": "/manus-storage/Rich_Hennemann_83e0c92a.jpg",
  "elvin-a-hernandez": "/manus-storage/Elvin_Hernandez_b2cf4b3c.jpg",
  "stephane-leonardi": "/manus-storage/Stephane_Leonardi_ddb33320.png",
  "matt-stewart": "/manus-storage/Matt_Stewart_3fe6bebb.jpg",
  "darrin-pepe": "/manus-storage/Darrin_Pepe_ecca3397.jpg",
  "jason-sobol": "/manus-storage/Jason_Sobol_451eb91b.jpg",
  "george-vega": "/manus-storage/George_Vega_f8726b04.jpg",
  "rustico-limosinero": "/manus-storage/Rustico_Limosinero_3a09f69c.jpg",
  "adam-fields": "/manus-storage/Adam_Fields_6c2eefdd.png",
  "bella-rachlin": "/manus-storage/Bella_Rachlin_36a5f44a.jpg",
  "chris-foreman": "/manus-storage/Chris_Foreman_7f88d709.png",
  "chris-meeks": "/manus-storage/Chris_Meeks_6a5a85a4.jpg",
  "daniel-riveron": "/manus-storage/Daniel_Riveron_26018781.jpg",
  "dove-mchargue": "/manus-storage/Dove_McHargue_94443885.jpg",
  "eddie-rhodes-iii": "/manus-storage/Eddie_Rhodes_III_97925a96.jpg",
  "eric-lehtonen": "/manus-storage/Eric_Lehtonen_2fb9f11c.jpg",
  "greg-kirkpatrick": "/manus-storage/Greg_Kirkpatrick_4c398a80.jpg",
  "jason-christner": "/manus-storage/Jason_Christner_26752b70.jpg",
  "jason-rodriguez": "/manus-storage/Jason_Rodriguez_98aad7b8.jpg",
  "jay-peteranetz": "/manus-storage/Jay_Peteranetz_7135dea3.jpg",
  "loc-nguyen": "/manus-storage/Loc_Nguyen_3a154d5d.jpg",
  "chenduz": "/manus-storage/Chenduz_d3cc74cd.jpg",
  "nick-gribbon": "/manus-storage/Nick_Gribbon_a1c1acfb.jpg",
  "peejay-catacutan": "/manus-storage/Peejay_Catacutan_93c09c7f.jpg",
  "ryan-finley": "/manus-storage/Ryan_Finley_db8737cb.jpg",
  "sherwin-santiago": "/manus-storage/Sherwin_Santiago_c3f03bc8.jpg",
};

// Short bios for comic book auto artists
const ARTIST_SHORT_BIOS: Record<string, string> = {
  "frank-miller": "Legendary writer-artist who redefined Daredevil and created Sin City.",
  "jack-kirby": "The King of Comics — co-creator of the Fantastic Four, X-Men, Captain America, and hundreds more.",
  "bill-sienkiewicz": "Avant-garde painter who revolutionized comic art with New Mutants and Elektra: Assassin.",
  "arthur-adams": "Fan-favorite artist celebrated for his ultra-detailed linework and iconic X-Men covers.",
  "jim-cheung": "Elite Marvel artist known for Young Avengers and Infinity — a master of clean, dynamic superhero art.",
  "adi-granov": "Photorealistic painter who defined the modern Iron Man look — his armor designs inspired the MCU films.",
  "marc-silvestri": "Co-founder of Image Comics and legendary X-Men artist — one of the most influential creators of the 1990s.",
  "greg-capullo": "Spawn and Batman artist — one of the most popular and recognizable styles in modern comics.",
  "inhyuk-lee": "Korean cover artist whose hyper-detailed digital paintings are among the most collected in modern Marvel.",
  "esad-ribic": "Painterly European master — his Thor: God of Thunder run is considered one of Marvel's greatest modern achievements.",
  "adam-kubert": "Second-generation Marvel legend — his X-Men and Wolverine work defined the character for a generation.",
  "steve-mcniven": "Civil War and Old Man Logan artist — his clean, cinematic style defines modern Marvel storytelling.",
  "mark-brooks": "Acclaimed cover artist and interior penciler known for his elegant, detailed style across X-Men and Avengers.",
  "lucio-parrillo": "Italian painter celebrated for his dramatic, painted covers — one of the most distinctive styles in modern comics.",
  "ryan-stegman": "Superior Spider-Man and Venom artist — his kinetic, expressive style brings Marvel's most intense stories to life.",
  "ed-mcguinness": "Hulk and Superman artist known for his bold, cartoonish style that makes every character look impossibly powerful.",
  "greg-horn": "Photorealistic digital painter whose Marvel covers are among the most iconic of the 2000s.",
  "mike-zeck": "Classic Marvel artist — his Secret Wars and Kraven's Last Hunt work are among the most beloved stories in Marvel history.",
  "derrick-chew": "Rising star cover artist whose vibrant, detailed style has made him one of Marvel's most popular variant cover artists.",
  "joshua-cassara": "X-Men and Wolverine artist whose gritty, detailed style brings Marvel's most intense stories to life.",
  "mark-bagley": "Ultimate Spider-Man artist — his record-breaking run with Brian Michael Bendis defined a generation of Marvel readers.",
  "mike-mayhew": "Painted cover artist known for his stunning, realistic portrayals of Marvel's most iconic characters.",
  "steve-epting": "Captain America: The Winter Soldier artist — his cinematic, realistic style helped define the modern Marvel aesthetic.",
  "ariel-diaz": "Contemporary artist known for dynamic, expressive work across Marvel's superhero catalog.",
  "e-m-gist": "Acclaimed painter and illustrator known for hauntingly beautiful covers across Marvel and beyond.",
  "mike-mckone": "Teen Titans and Amazing Spider-Man artist known for his clean, expressive superhero style.",
  "paul-pelletier": "Veteran Marvel artist known for his work on Annihilation, Guardians of the Galaxy, and Fantastic Four.",
  "ryan-brown": "Classic TMNT and Marvel artist known for his energetic, fun style across action and adventure titles.",
  "scott-williams": "Master inker whose work over Jim Lee and other top pencilers defined the look of 1990s Marvel.",
  "whilce-portacio": "X-Factor and Uncanny X-Men artist — one of the founders of Image Comics and a legend of 1990s Marvel.",
};

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[éèêë]/g, "e")
    .replace(/[áàâä]/g, "a")
    .replace(/[íìîï]/g, "i")
    .replace(/[óòôö]/g, "o")
    .replace(/[úùûü]/g, "u")
    .replace(/ć/g, "c")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function Artists() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | CategoryName>("All");
  const [activeTier, setActiveTier] = useState<"All" | TierName>("All");

  const filtered = useMemo(() => {
    return ARTISTS.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || a.category === activeCategory;
      const matchesTier = activeTier === "All" || a.tier === activeTier;
      return matchesSearch && matchesCategory && matchesTier;
    });
  }, [search, activeCategory, activeTier]);

  const grouped = useMemo(() => {
    const map: Record<TierName, typeof filtered> = {} as Record<TierName, typeof filtered>;
    for (const tier of TIER_ORDER) {
      map[tier] = filtered.filter((a) => a.tier === tier);
    }
    return map;
  }, [filtered]);

  const totalArtists = ARTISTS.length;
  const comicArtists = ARTISTS.filter(a => a.category === "Comic Book Artist Autographs").length;
  const sketchArtists = ARTISTS.filter(a => a.category === "Sketch Card Artists").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-black via-[#0a0a1a] to-background border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(199,125,255,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,212,255,0.1),transparent_60%)]" />
        <div className="container relative z-10 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
            <Palette className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-bold tracking-widest uppercase">NLF Artist Directory</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-white">
            THE ARTISTS BEHIND<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#C77DFF] to-[#00D4FF]">
              THE CARDS
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
            Every sketch, every signature, every brushstroke. The definitive tier guide to Topps Marvel trading card artists — ranked by collector demand and hobby impact.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="text-center">
              <div className="text-3xl font-black text-white">{totalArtists}</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Total Artists</div>
            </div>
            <div className="w-px bg-white/10 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-black text-[#C77DFF]">{comicArtists}</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Comic Book Autos</div>
            </div>
            <div className="w-px bg-white/10 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-black text-[#00D4FF]">{sketchArtists}</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Sketch Card Artists</div>
            </div>
            <div className="w-px bg-white/10 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-black text-[#FFD700]">5</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Tiers</div>
            </div>
          </div>

          {/* Tier Legend */}
          <div className="flex flex-wrap justify-center gap-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold cursor-pointer transition-all"
                style={{
                  borderColor: tier.borderColor,
                  backgroundColor: activeTier === tier.name ? tier.bgColor : "transparent",
                  color: tier.color,
                  boxShadow: activeTier === tier.name ? `0 0 12px ${tier.glowColor}` : "none",
                }}
                onClick={() => setActiveTier(activeTier === tier.name ? "All" : tier.name)}
              >
                <span>{tier.icon}</span>
                <span>{tier.name}</span>
                <span className="opacity-60 text-xs">({getArtistsByTierCount(tier.name)})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-white/10">
        <div className="container py-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search artists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
            />
          </div>
          <div className="flex gap-2">
            {(["All", "Comic Book Artist Autographs", "Sketch Card Artists"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  activeCategory === cat
                    ? "bg-primary text-black border-primary"
                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat === "Comic Book Artist Autographs" && <Pen className="w-3.5 h-3.5" />}
                {cat === "Sketch Card Artists" && <Palette className="w-3.5 h-3.5" />}
                {cat === "All" ? "All" : cat === "Comic Book Artist Autographs" ? "Comic Autos" : "Sketch Cards"}
              </button>
            ))}
          </div>
          <div className="text-white/40 text-sm ml-auto">
            {filtered.length} artist{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Artist Grid by Tier */}
      <div className="container py-12 space-y-16">
        {TIER_ORDER.map((tierName) => {
          const tierArtists = grouped[tierName];
          if (tierArtists.length === 0) return null;
          const tier = TIERS.find(t => t.name === tierName)!;

          return (
            <section key={tierName}>
              {/* Tier Header */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-xl border"
                  style={{
                    borderColor: tier.borderColor,
                    backgroundColor: tier.bgColor,
                    boxShadow: `0 0 20px ${tier.glowColor}`,
                  }}
                >
                  <span className="text-2xl">{tier.icon}</span>
                  <div>
                    <div className="font-black text-xl tracking-tight" style={{ color: tier.color }}>
                      {tier.name}
                    </div>
                    <div className="text-white/50 text-xs">{tier.description}</div>
                  </div>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{ color: tier.color, backgroundColor: tier.bgColor, border: `1px solid ${tier.borderColor}` }}
                >
                  {tierArtists.length} artist{tierArtists.length !== 1 ? "s" : ""}
                </div>
                <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${tier.borderColor}, transparent)` }} />
              </div>

              {/* Artist Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {tierArtists.map((artist) => {
                  const slug = nameToSlug(artist.name);
                  const isComicAuto = artist.category === "Comic Book Artist Autographs";
                  const portrait = ARTIST_PORTRAITS[slug];
                  const shortBio = ARTIST_SHORT_BIOS[slug];
                  const hasProfile = isComicAuto;
                  const hasPortrait = !!portrait;

                  const cardContent = (
                    <div
                      className="group relative rounded-xl border p-4 transition-all duration-200 h-full"
                      style={{
                        borderColor: tier.borderColor,
                        backgroundColor: tier.bgColor,
                        cursor: hasProfile ? "pointer" : "default",
                      }}
                      onMouseEnter={(e) => {
                        if (hasProfile) {
                          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${tier.glowColor}`;
                          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      }}
                    >
                      {/* Tier icon badge */}
                      <div className="absolute top-2 right-2 text-sm opacity-60">{tier.icon}</div>

                      {/* Portrait or initials avatar */}
                      {hasPortrait ? (
                        <div
                          className={`${isComicAuto ? 'w-16 h-16' : 'w-12 h-12'} rounded-full overflow-hidden mb-3 border-2`}
                          style={{ borderColor: tier.borderColor }}
                        >
                          <img
                            src={portrait}
                            alt={artist.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black mb-3"
                          style={{ backgroundColor: tier.bgColor, border: `2px solid ${tier.borderColor}`, color: tier.color }}
                        >
                          {artist.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="font-bold text-white text-sm leading-tight mb-2">{artist.name}</div>

                      {/* Short bio for comic auto artists */}
                      {isComicAuto && shortBio && (
                        <p className="text-white/50 text-xs leading-relaxed mb-2 line-clamp-3">{shortBio}</p>
                      )}

                      <Badge
                        className="text-xs px-2 py-0.5 border-0"
                        style={{
                          backgroundColor: isComicAuto
                            ? "rgba(199,125,255,0.15)"
                            : "rgba(0,212,255,0.15)",
                          color: isComicAuto ? "#C77DFF" : "#00D4FF",
                        }}
                      >
                        {isComicAuto ? "Comic Auto" : "Sketch Card"}
                      </Badge>

                      {artist.sets.length > 0 && (
                        <div className="mt-2 text-white/30 text-xs truncate" title={artist.sets.join(", ")}>
                          {artist.sets[0]}
                        </div>
                      )}

                      {/* "View Profile" hint for comic auto artists */}
                      {hasProfile && (
                        <div
                          className="mt-3 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: tier.color }}
                        >
                          View Profile →
                        </div>
                      )}
                    </div>
                  );

                  return hasProfile ? (
                    <Link key={artist.name} href={`/artists/${slug}`} className="block">
                      {cardContent}
                    </Link>
                  ) : (
                    <div key={artist.name}>
                      {cardContent}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-24 text-white/30">
            <Palette className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <div className="text-xl font-semibold">No artists found</div>
            <div className="text-sm mt-2">Try adjusting your search or filters</div>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="border-t border-white/10 py-8 text-center text-white/30 text-sm">
        <p>Artist tiers reflect collector demand and hobby impact — not official Topps rankings.</p>
        <p className="mt-1">All artists are officially licensed by Topps for Marvel trading cards.</p>
      </div>
    </div>
  );
}

function getArtistsByTierCount(tier: TierName): number {
  return ARTISTS.filter(a => a.tier === tier).length;
}
