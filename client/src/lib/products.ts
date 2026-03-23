/**
 * Product Data Store - NLF E-Commerce
 * All product data for the storefront
 *
 * Product Lines:
 * 1. The Variant Series (launching April 27, 2026)
 *    - Cosmic Drop (500 packs)
 *    - Chrome Edition (100 packs)
 * 2. The Snap Collection (Coming Soon)
 *    - 100-pack + 500-pack versions
 * 3. Multiverse Vault (Coming Soon)
 *    - Origins (100pk + 500pk)
 *    - Parallel Edition (100pk + 500pk)
 *    - Legendary Drop (100pk + 500pk)
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: "marvel" | "starwars";
  /** Product line grouping for shop display */
  productLine?: "variant-series" | "snap-collection" | "multiverse-vault";
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
  /** Pack count for display */
  packCount?: number;
}

// CDN URLs for product images
const CDN = {
  // Existing generated images (will be updated with series-specific ones)
  cosmicDrop: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-nlf-variant-2CkMPP3CsZhFkFXpzSuZkV.webp",
  chromeEdition: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-100-pack-LsACR5odDHrd8r7na6iEeJ.webp",
  snapCollection: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-snap-collection-f4QERPq29N4pJDjofGfJDw.webp",
  mvOrigins: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-mv-origins-Hy4dpNfeVzWEfn9T6vJBid.webp",
  mvParallel: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-mv-parallel-Jbn7zBa6fvERbhh2RRhg66.webp",
  mvLegendary: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-mv-legendary-CR5tFH2VEfA8tsmNqDGf6V.webp",
  // Topps box images
  toppsChrome: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/jdWyPiUVXDVdmyzj.jpg",
  toppsSapphireEd: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/YyWKnervcebTDXGJ.webp",
  toppsMint: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/AMhakRyQCtQiiBVc.jpg",
  toppsSapphireBox: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/QHvSDpUNxByvEZDk.jpg",
  nlfLogo: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/rwZcaJaSCFxygqjF.png",
};

export const SHOPIFY_STORE = "f1ipn9-h0.myshopify.com";

export const products: Product[] = [
  // ===================================================================
  // THE VARIANT SERIES — Launching Sunday, April 27, 2026
  // ===================================================================
  {
    id: "variant-cosmic-drop",
    slug: "variant-cosmic-drop",
    dbSlug: "nlf-marvel-500-whatnot",
    name: "Variant Series: Cosmic Drop",
    subtitle: "500 Marvel Trading Card Repacks",
    category: "marvel",
    productLine: "variant-series",
    price: 139,
    packCount: 500,
    image: CDN.cosmicDrop,
    images: [CDN.cosmicDrop],
    description: "The Cosmic Drop is our flagship Marvel trading card repack — 500 hand-curated packs built around three promises: a strong floor (every pack delivers real, collectible value — no junk filler), a better middle (your average pack is loaded with cards most competitors would call hits), and a healthy ceiling (legitimate chase cards worth serious money). Featuring cards from Topps Chrome Marvel, Marvel Mint, and more.",
    features: [
      "Strong floor — every card in every pack has real collectible value",
      "Better middle — average packs loaded with quality, not filler",
      "Healthy ceiling — real chase cards: autos, numbered parallels, graded slabs",
      "Cards from Topps Chrome, Marvel Mint, and other premium sets",
      "Limited to 500 packs — once they're gone, they're gone",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "DROPPING APR 27",
    badgeColor: "cyan",
    inStock: true,
    inventory: 500,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-04-28T00:00:00Z",
  },
  {
    id: "variant-chrome-edition",
    slug: "variant-chrome-edition",
    dbSlug: "nlf-marvel-100-series",
    name: "Variant Series: Chrome Edition",
    subtitle: "100 Marvel Trading Card Repacks",
    category: "marvel",
    productLine: "variant-series",
    price: 139,
    packCount: 100,
    image: CDN.chromeEdition,
    images: [CDN.chromeEdition],
    description: "The Chrome Edition is a limited 100-pack Marvel repack series focused on premium chrome cards. Every pack delivers the NLF standard: strong floor, better middle, healthy ceiling. Featuring hand-selected cards from Topps Chrome Marvel and other premium chromium sets.",
    features: [
      "100 hand-curated Marvel chrome trading card packs",
      "Strong floor — every card has real collectible value",
      "Better middle — quality cards throughout, not filler",
      "Healthy ceiling — real chase cards: autos, numbered parallels, graded slabs",
      "Focused on premium Topps Chrome Marvel cards",
      "Limited to 100 packs — ultra-exclusive drop",
    ],
    badge: "LAUNCH EXCLUSIVE",
    badgeColor: "green",
    inStock: true,
    inventory: 100,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-04-28T00:00:00Z",
  },
  {
    id: "variant-gambits-deck",
    slug: "variant-gambits-deck",
    dbSlug: "nlf-marvel-52-singles",
    name: "Gambit's Deck — 52 Singles",
    subtitle: "52 Single-Card Marvel Packs",
    category: "marvel",
    productLine: "variant-series",
    price: 139,
    packCount: 52,
    image: CDN.chromeEdition,
    images: [CDN.chromeEdition],
    description: "52 single-card Marvel packs themed after Gambit's legendary playing cards. Each pack contains one card — Aces are the chase, Face cards are the hits, and Number cards form the base. Collect the full deck. 4 suits, 13 ranks, 52 cards — every card in the deck is a Marvel collectible.",
    features: [
      "52 single-card packs — one card per pack, collect the full deck",
      "4 Aces (Chase tier) — the most valuable cards in the deck",
      "12 Face cards (Hit tier) — Kings, Queens, and Jacks",
      "36 Number cards (Base tier) — 10 through 2 across all suits",
      "Themed after Gambit's iconic playing cards",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "DROPPING APR 27",
    badgeColor: "magenta",
    inStock: true,
    inventory: 52,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-04-28T00:00:00Z",
  },

  // ===================================================================
  // THE SNAP COLLECTION — Coming Soon
  // ===================================================================
  {
    id: "snap-collection-100",
    slug: "snap-collection-100",
    name: "The Snap Collection",
    subtitle: "100 Marvel Trading Card Repacks",
    category: "marvel",
    productLine: "snap-collection",
    price: 139,
    packCount: 100,
    image: CDN.snapCollection,
    images: [CDN.snapCollection],
    description: "The Snap Collection brings together the most iconic moments in Marvel history. 100 hand-curated packs featuring cards that capture the universe-altering events, legendary heroes, and infamous villains. Built with the NLF standard: strong floor, better middle, healthy ceiling.",
    features: [
      "100 hand-curated Marvel trading card packs",
      "Themed around iconic Marvel moments and events",
      "Strong floor — every card has real collectible value",
      "Better middle — quality cards throughout, not filler",
      "Healthy ceiling — real chase cards worth serious money",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "COMING SOON",
    badgeColor: "cyan",
    inStock: false,
    inventory: 0,
    isRepack: true,
    isComingSoon: true,
  },
  {
    id: "snap-collection-500",
    slug: "snap-collection-500",
    name: "The Snap Collection",
    subtitle: "500 Marvel Trading Card Repacks",
    category: "marvel",
    productLine: "snap-collection",
    price: 139,
    packCount: 500,
    image: CDN.snapCollection,
    images: [CDN.snapCollection],
    description: "The Snap Collection 500-pack edition — the full experience. 500 hand-curated packs featuring cards that capture the universe-altering events, legendary heroes, and infamous villains. Built with the NLF standard: strong floor, better middle, healthy ceiling.",
    features: [
      "500 hand-curated Marvel trading card packs",
      "Themed around iconic Marvel moments and events",
      "Strong floor — every card has real collectible value",
      "Better middle — quality cards throughout, not filler",
      "Healthy ceiling — real chase cards worth serious money",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "COMING SOON",
    badgeColor: "cyan",
    inStock: false,
    inventory: 0,
    isRepack: true,
    isComingSoon: true,
  },

  // ===================================================================
  // MULTIVERSE VAULT — Coming Soon
  // ===================================================================
  {
    id: "mv-origins-100",
    slug: "mv-origins-100",
    name: "Multiverse Vault: Origins",
    subtitle: "100 Marvel Trading Card Repacks",
    category: "marvel",
    productLine: "multiverse-vault",
    price: 139,
    packCount: 100,
    image: CDN.mvOrigins,
    images: [CDN.mvOrigins],
    description: "Multiverse Vault: Origins digs deep into the Marvel multiverse — 100 packs featuring origin stories, first appearances, and the characters that started it all. Built with the NLF standard: strong floor, better middle, healthy ceiling.",
    features: [
      "100 hand-curated Marvel trading card packs",
      "Origin stories and first appearance themed cards",
      "Strong floor — every card has real collectible value",
      "Better middle — quality cards throughout, not filler",
      "Healthy ceiling — real chase cards worth serious money",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "COMING SOON",
    badgeColor: "purple",
    inStock: false,
    inventory: 0,
    isRepack: true,
    isComingSoon: true,
  },
  {
    id: "mv-origins-500",
    slug: "mv-origins-500",
    name: "Multiverse Vault: Origins",
    subtitle: "500 Marvel Trading Card Repacks",
    category: "marvel",
    productLine: "multiverse-vault",
    price: 139,
    packCount: 500,
    image: CDN.mvOrigins,
    images: [CDN.mvOrigins],
    description: "Multiverse Vault: Origins 500-pack edition — the full vault experience. 500 packs featuring origin stories, first appearances, and the characters that started it all. Built with the NLF standard: strong floor, better middle, healthy ceiling.",
    features: [
      "500 hand-curated Marvel trading card packs",
      "Origin stories and first appearance themed cards",
      "Strong floor — every card has real collectible value",
      "Better middle — quality cards throughout, not filler",
      "Healthy ceiling — real chase cards worth serious money",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "COMING SOON",
    badgeColor: "purple",
    inStock: false,
    inventory: 0,
    isRepack: true,
    isComingSoon: true,
  },
  {
    id: "mv-parallel-100",
    slug: "mv-parallel-100",
    name: "Multiverse Vault: Parallel Edition",
    subtitle: "100 Marvel Trading Card Repacks",
    category: "marvel",
    productLine: "multiverse-vault",
    price: 139,
    packCount: 100,
    image: CDN.mvParallel,
    images: [CDN.mvParallel],
    description: "Multiverse Vault: Parallel Edition — 100 packs loaded with parallel variants, refractors, and numbered cards from across the Marvel multiverse. Built with the NLF standard: strong floor, better middle, healthy ceiling.",
    features: [
      "100 hand-curated Marvel trading card packs",
      "Focused on parallel variants and refractors",
      "Strong floor — every card has real collectible value",
      "Better middle — quality cards throughout, not filler",
      "Healthy ceiling — numbered parallels and rare variants",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "COMING SOON",
    badgeColor: "purple",
    inStock: false,
    inventory: 0,
    isRepack: true,
    isComingSoon: true,
  },
  {
    id: "mv-parallel-500",
    slug: "mv-parallel-500",
    name: "Multiverse Vault: Parallel Edition",
    subtitle: "500 Marvel Trading Card Repacks",
    category: "marvel",
    productLine: "multiverse-vault",
    price: 139,
    packCount: 500,
    image: CDN.mvParallel,
    images: [CDN.mvParallel],
    description: "Multiverse Vault: Parallel Edition 500-pack — the full parallel experience. 500 packs loaded with parallel variants, refractors, and numbered cards from across the Marvel multiverse. Built with the NLF standard: strong floor, better middle, healthy ceiling.",
    features: [
      "500 hand-curated Marvel trading card packs",
      "Focused on parallel variants and refractors",
      "Strong floor — every card has real collectible value",
      "Better middle — quality cards throughout, not filler",
      "Healthy ceiling — numbered parallels and rare variants",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "COMING SOON",
    badgeColor: "purple",
    inStock: false,
    inventory: 0,
    isRepack: true,
    isComingSoon: true,
  },
  {
    id: "mv-legendary-100",
    slug: "mv-legendary-100",
    name: "Multiverse Vault: Legendary Drop",
    subtitle: "100 Marvel Trading Card Repacks",
    category: "marvel",
    productLine: "multiverse-vault",
    price: 139,
    packCount: 100,
    image: CDN.mvLegendary,
    images: [CDN.mvLegendary],
    description: "Multiverse Vault: Legendary Drop — 100 packs featuring the most legendary cards in the Marvel universe. Premium hits, graded slabs, and cards that define collections. Built with the NLF standard: strong floor, better middle, healthy ceiling.",
    features: [
      "100 hand-curated Marvel trading card packs",
      "Premium legendary-tier cards and hits",
      "Strong floor — every card has real collectible value",
      "Better middle — quality cards throughout, not filler",
      "Healthy ceiling — graded slabs and premium chase cards",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "COMING SOON",
    badgeColor: "purple",
    inStock: false,
    inventory: 0,
    isRepack: true,
    isComingSoon: true,
  },
  {
    id: "mv-legendary-500",
    slug: "mv-legendary-500",
    name: "Multiverse Vault: Legendary Drop",
    subtitle: "500 Marvel Trading Card Repacks",
    category: "marvel",
    productLine: "multiverse-vault",
    price: 139,
    packCount: 500,
    image: CDN.mvLegendary,
    images: [CDN.mvLegendary],
    description: "Multiverse Vault: Legendary Drop 500-pack — the ultimate vault experience. 500 packs featuring the most legendary cards in the Marvel universe. Premium hits, graded slabs, and cards that define collections. Built with the NLF standard: strong floor, better middle, healthy ceiling.",
    features: [
      "500 hand-curated Marvel trading card packs",
      "Premium legendary-tier cards and hits",
      "Strong floor — every card has real collectible value",
      "Better middle — quality cards throughout, not filler",
      "Healthy ceiling — graded slabs and premium chase cards",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "COMING SOON",
    badgeColor: "purple",
    inStock: false,
    inventory: 0,
    isRepack: true,
    isComingSoon: true,
  },

  // ===================================================================
  // TOPPS HOBBY BOXES — Coming Soon
  // ===================================================================
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
    inStock: true,
    inventory: 0,
    isRepack: false,
    isComingSoon: false,
    launchDate: "2026-04-28T00:00:00Z",
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
    inStock: true,
    inventory: 0,
    isRepack: false,
    isComingSoon: false,
    launchDate: "2026-04-28T00:00:00Z",
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
    inStock: true,
    inventory: 0,
    isRepack: false,
    isComingSoon: false,
    launchDate: "2026-04-28T00:00:00Z",
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

/** Get products by product line */
export function getProductsByLine(line: Product["productLine"]): Product[] {
  return products.filter((p) => p.productLine === line);
}

/** Get unique product lines with their products */
export function getProductLines() {
  return [
    {
      id: "variant-series",
      name: "The Variant Series",
      tagline: "Our flagship Marvel repack line — launching April 27th",
      products: getProductsByLine("variant-series"),
      available: true,
    },
    {
      id: "snap-collection",
      name: "The Snap Collection",
      tagline: "Iconic Marvel moments in every pack",
      products: getProductsByLine("snap-collection"),
      available: false,
    },
    {
      id: "multiverse-vault",
      name: "Multiverse Vault",
      tagline: "Deep cuts from across the Marvel multiverse",
      products: getProductsByLine("multiverse-vault"),
      available: false,
    },
  ];
}
