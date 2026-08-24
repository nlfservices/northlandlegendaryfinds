import { mediaUrl } from "../lib/mediaUrl";

export const HERO_BG = mediaUrl("/manus-storage/doomsday-hero-banner_8bef00bd.jpg");
export const NLF_PACK = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-nlf-variant-2CkMPP3CsZhFkFXpzSuZkV.webp";
export const TRUST_BG = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/trust-section-bg-kwnjuLkybJ2rqpCpEwiChw.webp";

// Character card images
export const DOOM_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-card-LTiPEJkmSfYjTgipmotMso.webp";
export const IRON_MAN_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/armored-hero-card-SdisyrpGhXuzM9QzK4oy8L.webp";
export const SPIDER_MAN_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/web-hero-card-nnb4jySYxm85VCLBiavLYC.webp";
export const FF_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/fantastic-four-card-hj632KBGq5hHBqFr24T7Bg.webp";
export const BLACK_PANTHER_CARD = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/black-panther-card-8p85njMmcGx6FSvhe3Txjb.webp";

// Legacy Legends card images
export const LEGACY_HOPKINS_ODIN = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hopkins-odin-5PmHir8t54fyriEVpZF3Tj.webp";
export const LEGACY_MCKELLEN_MAGNETO = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/mckellen-magneto-N8g4KBYRkiGLYhftfknYBc.webp";
export const LEGACY_STEWART_PROFX = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/stewart-professor-x-QoEpAmXirvvLiCbPvb8gyG.webp";
export const LEGACY_BLACK_PANTHER = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/black-panther-card-HTGdTwE7FjM5GKsJFH6VNw.webp";
export const LEGACY_RDJ_IRON_MAN = "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/rdj-iron-man-legacy-QegKWDGfdcUe8NRevdJ5GF.webp";

// Legacy Legends data — expansion-ready array
export const LEGACY_LEGENDS = [
  {
    id: "boseman",
    actorName: "Chadwick Boseman",
    characterName: "Black Panther",
    badge: "No Autograph Exists",
    badgeColor: "from-purple-500 to-purple-700",
    badgeTextColor: "text-purple-100",
    borderColor: "border-purple-500/40",
    glowColor: "shadow-purple-500/30",
    accentColor: "text-purple-400",
    image: LEGACY_BLACK_PANTHER,
    note: "Academy Award nominee. Howard University graduate. Brought Black Panther to life and inspired a generation — his 'Wakanda Forever' became a global symbol of strength. Passed away in 2020 at 43 after a private battle with cancer. No autograph card will ever exist.",
  },
  {
    id: "hopkins",
    actorName: "Anthony Hopkins",
    characterName: "Odin",
    badge: "Debut Auto",
    badgeColor: "from-amber-500 to-yellow-600",
    badgeTextColor: "text-amber-950",
    borderColor: "border-amber-500/40",
    glowColor: "shadow-amber-500/30",
    accentColor: "text-amber-400",
    image: LEGACY_HOPKINS_ODIN,
    note: "Academy Award winner for The Silence of the Lambs and The Father. Knighted by Queen Elizabeth II. From Hannibal Lecter to the All-Father of Asgard — at 88, Sir Anthony Hopkins is one of the greatest actors who ever lived. His first-ever Marvel autograph card.",
  },
  {
    id: "mckellen",
    actorName: "Ian McKellen",
    characterName: "Magneto",
    badge: "Awaiting Debut Auto",
    badgeColor: "from-red-500 to-red-700",
    badgeTextColor: "text-red-100",
    borderColor: "border-red-500/40",
    glowColor: "shadow-red-500/30",
    accentColor: "text-red-400",
    image: LEGACY_MCKELLEN_MAGNETO,
    note: "Six-time Olivier Award winner. Knighted for services to the performing arts. Defined Gandalf and Magneto for an entire generation. Sir Ian McKellen has been a titan of stage and screen for over 60 years — and a fearless advocate for equality. No Marvel autograph card exists yet — collectors are hoping for a debut auto in a future Topps set.",
  },
  {
    id: "stewart",
    actorName: "Patrick Stewart",
    characterName: "Professor X",
    badge: "Awaiting Debut Auto",
    badgeColor: "from-blue-500 to-cyan-600",
    badgeTextColor: "text-blue-100",
    borderColor: "border-blue-500/40",
    glowColor: "shadow-blue-500/30",
    accentColor: "text-blue-400",
    image: LEGACY_STEWART_PROFX,
    note: "Legendary Royal Shakespeare Company actor. Knighted in 2010. Made Captain Picard and Professor X two of the most iconic characters in pop culture history. Sir Patrick Stewart brings gravitas to everything he touches — from Star Trek to the X-Men. No Marvel autograph card exists yet — collectors are hoping for a debut auto in a future Topps set.",
  },
  {
    id: "downey",
    actorName: "Robert Downey Jr.",
    characterName: "Iron Man / Doctor Doom",
    badge: "Awaiting Debut Auto",
    badgeColor: "from-red-500 to-amber-600",
    badgeTextColor: "text-red-100",
    borderColor: "border-red-500/40",
    glowColor: "shadow-red-500/30",
    accentColor: "text-red-400",
    image: LEGACY_RDJ_IRON_MAN,
    note: "Academy Award winner for Oppenheimer. Launched the entire MCU as Tony Stark in 2008 and defined a generation of superhero cinema across 11 films. His 'I am Iron Man' became the most iconic line in Marvel history. Now returning as Doctor Doom in Avengers: Doomsday — the only actor to play both the MCU's greatest hero and its greatest villain. No Marvel autograph card exists yet — collectors are hoping for a debut auto in a future Topps set.",
  },
];
