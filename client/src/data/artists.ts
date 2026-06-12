export type TierName = "Latverian Sovereign" | "Infinity" | "Uru" | "Vibranium" | "Adamantium";

export type CategoryName = "Comic Book Artist Autographs" | "Sketch Card Artists";

export interface Artist {
  name: string;
  tier: TierName;
  category: CategoryName;
  sets: string[];
}

export interface TierInfo {
  name: TierName;
  level: number;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  icon: string;
  description: string;
}

export const TIERS: TierInfo[] = [
  {
    name: "Latverian Sovereign",
    level: 5,
    color: "#FFD700",
    bgColor: "rgba(255, 215, 0, 0.08)",
    borderColor: "rgba(255, 215, 0, 0.4)",
    glowColor: "rgba(255, 215, 0, 0.3)",
    icon: "👑",
    description: "The absolute pinnacle — legendary artists whose work defines the Marvel trading card hobby.",
  },
  {
    name: "Infinity",
    level: 4,
    color: "#C77DFF",
    bgColor: "rgba(199, 125, 255, 0.08)",
    borderColor: "rgba(199, 125, 255, 0.4)",
    glowColor: "rgba(199, 125, 255, 0.3)",
    icon: "💎",
    description: "Elite-tier artists with massive collector demand and iconic runs on Marvel titles.",
  },
  {
    name: "Uru",
    level: 3,
    color: "#00D4FF",
    bgColor: "rgba(0, 212, 255, 0.08)",
    borderColor: "rgba(0, 212, 255, 0.4)",
    glowColor: "rgba(0, 212, 255, 0.3)",
    icon: "⚡",
    description: "High-demand artists known for stunning cover art and premium card work.",
  },
  {
    name: "Vibranium",
    level: 2,
    color: "#00FF88",
    bgColor: "rgba(0, 255, 136, 0.08)",
    borderColor: "rgba(0, 255, 136, 0.4)",
    glowColor: "rgba(0, 255, 136, 0.3)",
    icon: "🛡️",
    description: "Established professionals with strong followings and consistent collector appeal.",
  },
  {
    name: "Adamantium",
    level: 1,
    color: "#A8B2C1",
    bgColor: "rgba(168, 178, 193, 0.08)",
    borderColor: "rgba(168, 178, 193, 0.4)",
    glowColor: "rgba(168, 178, 193, 0.3)",
    icon: "🔩",
    description: "Talented artists building their reputation in the Topps Marvel trading card universe.",
  },
];

export const ARTISTS: Artist[] = [
  // === COMIC BOOK ARTIST AUTOGRAPHS (30 artists) ===
  // Tier 5 - Latverian Sovereign (Legends)
  { name: "Frank Miller", tier: "Latverian Sovereign", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Jack Kirby", tier: "Latverian Sovereign", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Bill Sienkiewicz", tier: "Latverian Sovereign", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Arthur Adams", tier: "Latverian Sovereign", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },

  // Tier 4 - Infinity (Elite)
  { name: "Jim Cheung", tier: "Infinity", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Adi Granov", tier: "Infinity", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Marc Silvestri", tier: "Infinity", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Greg Capullo", tier: "Infinity", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "InHyuk Lee", tier: "Infinity", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Esad Ribić", tier: "Infinity", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },

  // Tier 3 - Uru (High Demand)
  { name: "Adam Kubert", tier: "Uru", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Steve McNiven", tier: "Uru", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Mark Brooks", tier: "Uru", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Lucio Parrillo", tier: "Uru", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Ryan Stegman", tier: "Uru", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Ed McGuinness", tier: "Uru", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Greg Horn", tier: "Uru", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Mike Zeck", tier: "Uru", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },

  // Tier 2 - Vibranium (Established)
  { name: "Derrick Chew", tier: "Vibranium", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Joshua Cassara", tier: "Vibranium", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Mark Bagley", tier: "Vibranium", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Mike Mayhew", tier: "Vibranium", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Steve Epting", tier: "Vibranium", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Ariel Diaz", tier: "Vibranium", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "E.M. Gist", tier: "Vibranium", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },

  // Tier 1 - Adamantium (Rising)
  { name: "Mike McKone", tier: "Adamantium", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Paul Pelletier", tier: "Adamantium", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Ryan Brown", tier: "Adamantium", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Scott Williams", tier: "Adamantium", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Whilce Portacio", tier: "Adamantium", category: "Comic Book Artist Autographs", sets: ["2025 Topps Finest Fantastic Four"] },

  // === SKETCH CARD ARTISTS (116 artists) ===
  // Tier 5 - Latverian Sovereign
  { name: "Emrah Cildir", tier: "Latverian Sovereign", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },

  // Tier 4 - Infinity
  { name: "Hector Barros", tier: "Infinity", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Alcione Silva", tier: "Infinity", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Mirko Di Noia", tier: "Infinity", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Gabriel Tardivo", tier: "Infinity", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Fabio Ramacci", tier: "Infinity", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Marco Carrillo", tier: "Infinity", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Gary Shipman", tier: "Infinity", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Rich Hennemann", tier: "Infinity", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },

  // Tier 3 - Uru
  { name: "Elvin A Hernandez", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Rodel Martin", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Angelo De Capua", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Leon Braojos", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Andy Tiu", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Stephane Leonardi", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Benjamin Lombart", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Gabe Farber", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Matt Stewart", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Roy Cover", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Darrin Pepe", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Jason Sobol", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Tim Shinn", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Rebeca Louro", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Bete Rodrigues", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "George Vega", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Rustico Limosinero", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Jojo Hilario", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Nick Sutphin", tier: "Uru", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },

  // Tier 2 - Vibranium
  { name: "A jhay", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Aaron Roberts Art", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Adam Fields", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Alessandro Micelli", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Ariel Aguire", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Ariel Mamani", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Bella Rachlin", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Carlo Allen Victoria", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Chris Foreman", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Chris Meeks", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Daniel Farruggia", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Daniel Riveron", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "David Lee", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Débora Centeio", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Dexter Wee", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Don Nguyen", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Dove McHargue", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Dylan Riley", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Eddie Rhodes III", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Edward Santia", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Emmanuel Villafaña \"EMMVILL\"", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Eric Lehtonen", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Ernest Romero", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Frank A. Kadar", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Gilbert Perez Art", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Greg Kirkpatrick", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Greg Treize", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Ian M Sateikis", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Jason Christner", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Jason Queen", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Jason Rodriguez", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Jay Peteranetz", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Jessica Hickman", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Jezreel L Rojales", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Jiaxin \"YinShan\" Sun", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Jim O'Riley", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "John Pleak", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "John-Paul Howard", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "JohnruzelJimenez", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Josh Nuñez", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Kenny Calderon", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Kevin Norman", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Larry Santiago", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Lee Lightfoot", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Loc Nguyen", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Marcia Dye", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Marcus D. Newsome", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Marlo Martos", tier: "Vibranium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },

  // Tier 1 - Adamantium
  { name: "Aditya Chandra", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Al Stefano", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Allenser", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Ash", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "BLANCAS", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Carlton", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Chao", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Chenduz", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Clark", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Court", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Danny", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "DMN", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "DRE", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Duke", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "DYJ", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Eric", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Fresia", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Getatom", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "IQ", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Isiah Xavier Bradley", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Joseph Grotesque", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Lucas", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Macklin", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Matthew Lopez", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Michael Mastermaker", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "NerP", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Nick Gribbon", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Niño John Benitez", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Noval Hernawan", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Patricio Carrasco", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Peejay Catacutan", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Richard E. Valbuena (Richval)", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Ronel Gravo", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "romo namli", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Ryan Finley", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Sherwin Santiago", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Takkun", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "TOMA", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "Vicente Moavero", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
  { name: "ジェイソン (Jason)", tier: "Adamantium", category: "Sketch Card Artists", sets: ["2025 Topps Finest Fantastic Four"] },
];

export function getTierInfo(tierName: TierName): TierInfo {
  return TIERS.find(t => t.name === tierName)!;
}

export function getArtistsByCategory(category: CategoryName): Artist[] {
  return ARTISTS.filter(a => a.category === category);
}

export function getArtistsByTier(tier: TierName): Artist[] {
  return ARTISTS.filter(a => a.tier === tier);
}
