/**
 * Product Data Store - NLF E-Commerce
 * All product data for the storefront
 * Shopify store: f1ipn9-h0.myshopify.com
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: "marvel" | "starwars";
  price: number;
  comparePrice?: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  badge?: string;
  badgeColor?: string;
  inStock: boolean;
  inventory: number;
  isRepack: boolean;
  isComingSoon: boolean;
  shopifyUrl?: string;
  /** UTC ISO string — product cannot be purchased before this date */
  launchDate?: string;
  /** Database product slug (if different from frontend slug) for live pack counter */
  dbSlug?: string;
}

// CDN URLs
const CDN = {
  nlfPack: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/xYmShpBhbXYuurgy.jpg",
  toppsChrome: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/jdWyPiUVXDVdmyzj.jpg",
  toppsSapphireEd: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/YyWKnervcebTDXGJ.webp",
  toppsMint: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/AMhakRyQCtQiiBVc.jpg",
  toppsSapphireBox: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/QHvSDpUNxByvEZDk.jpg",
  nlfLogo: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/rwZcaJaSCFxygqjF.png",
};

export const SHOPIFY_STORE = "f1ipn9-h0.myshopify.com";

export const products: Product[] = [
  // ===== LAUNCH PRODUCTS (March 13, 2026) =====
  {
    id: "nlf-variant",
    slug: "nlf-variant",
    dbSlug: "nlf-marvel-500-whatnot",
    name: "NLF Variant",
    subtitle: "Marvel Trading Card Repack",
    category: "marvel",
    price: 100,
    image: CDN.nlfPack,
    images: [CDN.nlfPack],
    description: "The NLF Variant is our flagship Marvel trading card repack, built around three promises: a strong floor (every pack delivers real, collectible value — no junk filler), a better middle (your average NLF pack is loaded with cards most competitors would call hits), and a healthy ceiling (legitimate chase cards worth serious money). Featuring cards from Topps Chrome Marvel, Marvel Mint, and more — each pack is hand-curated from premium sets to deliver a consistently great experience.",
    features: [
      "Strong floor — every card in every pack has real collectible value",
      "Better middle — average packs loaded with quality, not filler",
      "Healthy ceiling — real chase cards: autos, numbered parallels, graded slabs",
      "Cards from Topps Chrome, Marvel Mint, and other premium sets",
      "Limited to 500 packs — once they're gone, they're gone",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "LAUNCH EXCLUSIVE",
    badgeColor: "green",
    inStock: true,
    inventory: 500,
    isRepack: true,
    isComingSoon: false,
    shopifyUrl: `https://${SHOPIFY_STORE}/products/nlf-variant`,
    // Available March 13, 2026 at 7:00 PM Central (CDT = UTC-5)
    launchDate: "2026-03-14T00:00:00Z",
  },
  {
    id: "shadows-of-the-force",
    slug: "shadows-of-the-force",
    name: "Shadows of the Force",
    subtitle: "Star Wars Trading Card Repack",
    category: "starwars",
    price: 100,
    image: CDN.nlfPack,
    images: [CDN.nlfPack],
    description: "Shadows of the Force is our premium Star Wars trading card repack, launching June 2026 to coincide with The Mandalorian & Grogu theatrical release. Built with the same NLF philosophy: strong floor (every card has real value), better middle (quality cards throughout, not filler), and healthy ceiling (graded slabs, autos, and numbered parallels in the mix). Every pack delivers a curated selection of premium Topps Star Wars cards.",
    features: [
      "Strong floor — every card in every pack has real collectible value",
      "Better middle — quality cards throughout, not filler with one hit",
      "Healthy ceiling — graded slabs, autos, and numbered parallels",
      "Cards from Topps Chrome Star Wars and other premium sets",
      "Limited to 500 packs — once they're gone, they're gone",
      "Sealed in custom NLF holographic mylar bag",
      "Timed with The Mandalorian & Grogu movie release",
    ],
    badge: "COMING JUNE 2026",
    badgeColor: "cyan",
    inStock: false,
    inventory: 0,
    isRepack: true,
    isComingSoon: true,
  },

  // ===== NEW PACK SERIES (Placeholder details — to be updated later) =====
  {
    id: "nlf-100-card",
    slug: "nlf-100-card",
    dbSlug: "nlf-marvel-100-series",
    name: "NLF 100-Card Series",
    subtitle: "100 Marvel Cards — $100",
    category: "marvel",
    price: 100,
    image: CDN.nlfPack,
    images: [CDN.nlfPack],
    description: "The NLF 100-Card Series delivers 100 hand-curated Marvel trading cards for $100. Built around our three promises: a strong floor (every card has real collectible value), a better middle (quality cards throughout, not filler), and a healthy ceiling (real chase cards worth serious money). Cards from Topps Chrome Marvel, Marvel Mint, and other premium sets.",
    features: [
      "100 hand-curated Marvel trading cards per pack",
      "Strong floor — every card has real collectible value",
      "Better middle — quality cards throughout, not filler",
      "Healthy ceiling — real chase cards: autos, numbered parallels, graded slabs",
      "Cards from Topps Chrome, Marvel Mint, and other premium sets",
      "Limited to 500 packs — once they're gone, they're gone",
    ],
    badge: "COMING SOON",
    badgeColor: "purple",
    inStock: false,
    inventory: 500,
    isRepack: true,
    isComingSoon: true,
    shopifyUrl: `https://${SHOPIFY_STORE}/products/nlf-100-card`,
  },
  {
    id: "nlf-50-card",
    slug: "nlf-50-card",
    dbSlug: "nlf-marvel-50-series",
    name: "NLF 50-Card Series",
    subtitle: "50 Premium Marvel Cards — $100",
    category: "marvel",
    price: 100,
    image: CDN.nlfPack,
    images: [CDN.nlfPack],
    description: "The NLF 50-Card Series packs 50 premium Marvel trading cards into a $100 repack — higher card-for-card value with every pull. Built around our three promises: a strong floor (every card has real collectible value), a better middle (loaded with quality hits), and a healthy ceiling (legitimate chase cards worth serious money). Cards from Topps Chrome Marvel, Marvel Mint, and other premium sets.",
    features: [
      "50 premium Marvel trading cards per pack",
      "Higher card-for-card value — every card hits harder",
      "Strong floor — every card has real collectible value",
      "Better middle — loaded with quality hits",
      "Healthy ceiling — legitimate chase cards worth serious money",
      "Limited to 500 packs — once they're gone, they're gone",
    ],
    badge: "COMING SOON",
    badgeColor: "blue",
    inStock: false,
    inventory: 500,
    isRepack: true,
    isComingSoon: true,
    shopifyUrl: `https://${SHOPIFY_STORE}/products/nlf-50-card`,
  },

  // ===== COMING SOON PRODUCTS =====
  {
    id: "topps-marvel-chrome",
    slug: "topps-marvel-chrome",
    name: "2025 Topps Marvel Chrome",
    subtitle: "Hobby Box",
    category: "marvel",
    price: 499.95,
    image: CDN.toppsChrome,
    images: [CDN.toppsChrome],
    description: "The 2025 Topps Marvel Chrome Hobby Box delivers premium chromium trading cards featuring your favorite Marvel heroes and villains. Look for ultra-rare Indestructible cards, autographs, and stunning refractor parallels.",
    features: [
      "Official Topps licensed Marvel trading cards",
      "Chrome technology with stunning refractor finishes",
      "Look for autographs and sketch cards",
      "Ultra-rare Indestructible parallel chase cards",
      "8 packs per box, 4 cards per pack",
    ],
    badge: "COMING SOON",
    badgeColor: "purple",
    inStock: false,
    inventory: 0,
    isRepack: false,
    isComingSoon: true,
  },
  {
    id: "topps-chrome-sapphire",
    slug: "topps-chrome-sapphire",
    name: "2025 Topps Chrome Sapphire",
    subtitle: "Marvel Sapphire Edition",
    category: "marvel",
    price: 899.95,
    image: CDN.toppsSapphireBox,
    images: [CDN.toppsSapphireBox, CDN.toppsSapphireEd],
    description: "The ultra-premium 2025 Topps Chrome Sapphire Edition features exclusive sapphire-finish cards you won't find anywhere else. Look for Infinite Sapphire inserts, autographs, and sketches in this highly limited release.",
    features: [
      "Exclusive Sapphire Edition chromium finish",
      "Look for Infinite Sapphire insert cards",
      "Autographs and sketch cards available",
      "Highly limited production run",
      "32 cards total, 8 packs per box",
      "Premium collector's item",
    ],
    badge: "COMING SOON",
    badgeColor: "blue",
    inStock: false,
    inventory: 0,
    isRepack: false,
    isComingSoon: true,
  },
  {
    id: "topps-marvel-mint",
    slug: "topps-marvel-mint",
    name: "2025 Topps Marvel Mint",
    subtitle: "Hobby Box",
    category: "marvel",
    price: 649.95,
    image: CDN.toppsMint,
    images: [CDN.toppsMint],
    description: "The 2025 Topps Marvel Mint Hobby Box guarantees one encased card per box. Featuring stunning mint-condition cards with premium finishes, this set is perfect for serious collectors looking for investment-grade cards.",
    features: [
      "One encased card guaranteed per box",
      "Premium mint-condition cards",
      "Official Topps licensed Marvel product",
      "Investment-grade collectible cards",
      "Stunning premium card finishes",
    ],
    badge: "COMING SOON",
    badgeColor: "gold",
    inStock: false,
    inventory: 0,
    isRepack: false,
    isComingSoon: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: "marvel" | "starwars"): Product[] {
  return products.filter((p) => p.category === category);
}

export function getInStockProducts(): Product[] {
  return products.filter((p) => p.inStock);
}

export function getComingSoonProducts(): Product[] {
  return products.filter((p) => p.isComingSoon);
}

export function getRepackProducts(): Product[] {
  return products.filter((p) => p.isRepack && !p.isComingSoon);
}

export function getComingSoonRepacks(): Product[] {
  return products.filter((p) => p.isRepack && p.isComingSoon);
}
