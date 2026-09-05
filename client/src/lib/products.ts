/**
 * Product Data Store - NLF E-Commerce
 * All product data for the storefront
 *
 * Product Lines:
 * 1. The Variant Series (launching May 21, 2026)
 *    - Cosmic Drop (500 packs)
 *    - Chrome Edition (100 packs)
 * 2. The Snap Collection (launching May 21, 2026)
 *    - 100-pack + 500-pack versions
 * 3. Multiverse Vault (launching May 21, 2026)
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
  productLine?: "gambit-deck" | "variant-series" | "snap-collection" | "multiverse-vault";
  /** Link to the checklist page for this product */
  checklistSlug?: string;
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
  cosmicDrop: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-nlf-variant-2CkMPP3CsZhFkFXpzSuZkV.webp",
  chromeEdition: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-100-pack-LsACR5odDHrd8r7na6iEeJ.webp",
  snapCollection: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-snap-collection-f4QERPq29N4pJDjofGfJDw.webp",
  mvOrigins: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-mv-origins-Hy4dpNfeVzWEfn9T6vJBid.webp",
  mvParallel: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-mv-parallel-Jbn7zBa6fvERbhh2RRhg66.webp",
  mvLegendary: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-mv-legendary-CR5tFH2VEfA8tsmNqDGf6V.webp",
  // Topps box images
  toppsChrome: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/jdWyPiUVXDVdmyzj.jpg",
  toppsSapphireEd: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/YyWKnervcebTDXGJ.webp",
  toppsMint: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/AMhakRyQCtQiiBVc.jpg",
  toppsSapphireBox: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/QHvSDpUNxByvEZDk.jpg",
  nlfLogo: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/rwZcaJaSCFxygqjF.png",
  gambitDeck: "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/gambit-deck-52-singles-agMj46W47777xcjTUjBw5L.webp",
};

export const SHOPIFY_STORE = "f1ipn9-h0.myshopify.com";

export const products: Product[] = [
  // ===================================================================
  // GAMBIT'S DECK — 52 Singles — Launching May 21, 2026
  // ===================================================================
  {
    id: "gambit-deck-52",
    slug: "gambit-deck-52",
    dbSlug: "nlf-marvel-52-singles",
    name: "Topps Marvel Mint Collection",
    subtitle: "52 Premium Marvel Mint Packs — Complete Gambit Set Inside",
    category: "marvel",
    productLine: "gambit-deck",
    price: 600,
    packCount: 52,
    image: CDN.gambitDeck,
    images: [CDN.gambitDeck],
    description: "52 premium packs featuring cards from the 2025 Topps Marvel Mint collection. Includes a complete Gambit set among other great cards from one of Topps' most sought-after Marvel releases. Each pack contains one card — Aces are the chase, Face cards are the hits, and Number cards form the base. This is the only NLF set with a pre-revealed checklist — see exactly what you're chasing before you buy.",
    features: [
      "52 premium packs from 2025 Topps Marvel Mint",
      "Complete Gambit set included among other great cards",
      "Playing card theme: Aces = chase, Face cards = hits, Number cards = base",
      "Full checklist revealed before launch — see what you're chasing",
      "Sealed in custom NLF holographic mylar bag",
      "Limited to 52 packs — collect the full deck",
    ],
    badge: "DROPPING MAY 21",
    badgeColor: "magenta",
    inStock: true,
    inventory: 52,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-05-21T00:00:00Z",
    checklistSlug: "nlf-marvel-52-singles",
  },

  // ===================================================================
  // THE VARIANT SERIES — Launching May 21, 2026
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
    description: "The Cosmic Drop is our flagship Marvel trading card repack — 500 hand-curated packs featuring numbered parallels, inserts, and graded slabs from Topps Chrome Marvel, Marvel Mint, and more. Every pack has a published checklist so you know exactly what's possible.",
    features: [
      "Every card from authentic 2025 Topps Marvel releases",
      "Numbered parallels, inserts, and graded slabs included",
      "Full checklist published — see every possible card",
      "Cards from Topps Chrome, Marvel Mint, and other premium sets",
      "Limited to 500 packs — once they're gone, they're gone",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "DROPPING MAY 21",
    badgeColor: "cyan",
    inStock: true,
    inventory: 500,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-05-21T00:00:00Z",
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
    description: "The Chrome Edition is a limited 100-pack Marvel repack series focused on premium chrome cards. Featuring hand-selected cards from Topps Chrome Marvel and other premium chromium sets. Full checklist published so you know exactly what's possible.",
    features: [
      "100 hand-curated Marvel chrome trading card packs",
      "Every card from authentic 2025 Topps Marvel releases",
      "Numbered parallels, inserts, and graded slabs included",
      "Full checklist published — see every possible card",
      "Focused on premium Topps Chrome Marvel cards",
      "Limited to 100 packs — ultra-exclusive drop",
    ],
    badge: "DROPPING MAY 21",
    badgeColor: "green",
    inStock: true,
    inventory: 100,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-05-21T00:00:00Z",
  },

  // ===================================================================
  // THE SNAP COLLECTION — Launching May 21, 2026
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
    description: "The Snap Collection brings together the most iconic moments in Marvel history. 100 hand-curated packs featuring cards that capture the universe-altering events, legendary heroes, and infamous villains. Full checklist published so you know exactly what's possible.",
    features: [
      "100 hand-curated Marvel trading card packs",
      "Themed around iconic Marvel moments and events",
      "Every card from authentic 2025 Topps Marvel releases",
      "Numbered parallels, inserts, and graded slabs included",
      "Full checklist published — see every possible card",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "DROPPING MAY 21",
    badgeColor: "cyan",
    inStock: true,
    inventory: 100,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-05-21T00:00:00Z",
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
    description: "The Snap Collection 500-pack edition — the full experience. 500 hand-curated packs featuring cards that capture the universe-altering events, legendary heroes, and infamous villains. Full checklist published so you know exactly what's possible.",
    features: [
      "500 hand-curated Marvel trading card packs",
      "Themed around iconic Marvel moments and events",
      "Every card from authentic 2025 Topps Marvel releases",
      "Numbered parallels, inserts, and graded slabs included",
      "Full checklist published — see every possible card",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "DROPPING MAY 21",
    badgeColor: "cyan",
    inStock: true,
    inventory: 500,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-05-21T00:00:00Z",
  },

  // ===================================================================
  // MULTIVERSE VAULT — Launching May 21, 2026
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
    description: "Multiverse Vault: Origins digs deep into the Marvel multiverse — 100 packs featuring origin stories, first appearances, and the characters that started it all. Full checklist published so you know exactly what's possible.",
    features: [
      "100 hand-curated Marvel trading card packs",
      "Origin stories and first appearance themed cards",
      "Every card from authentic 2025 Topps Marvel releases",
      "Numbered parallels, inserts, and graded slabs included",
      "Full checklist published — see every possible card",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "DROPPING MAY 21",
    badgeColor: "purple",
    inStock: true,
    inventory: 100,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-05-21T00:00:00Z",
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
    description: "Multiverse Vault: Origins 500-pack edition — the full vault experience. 500 packs featuring origin stories, first appearances, and the characters that started it all. Full checklist published so you know exactly what's possible.",
    features: [
      "500 hand-curated Marvel trading card packs",
      "Origin stories and first appearance themed cards",
      "Every card from authentic 2025 Topps Marvel releases",
      "Numbered parallels, inserts, and graded slabs included",
      "Full checklist published — see every possible card",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "DROPPING MAY 21",
    badgeColor: "purple",
    inStock: true,
    inventory: 500,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-05-21T00:00:00Z",
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
    description: "Multiverse Vault: Parallel Edition — 100 packs loaded with parallel variants, refractors, and numbered cards from across the Marvel multiverse. Full checklist published so you know exactly what's possible.",
    features: [
      "100 hand-curated Marvel trading card packs",
      "Focused on parallel variants and refractors",
      "Every card from authentic 2025 Topps Marvel releases",
      "Numbered parallels, inserts, and rare variants included",
      "Full checklist published — see every possible card",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "DROPPING MAY 21",
    badgeColor: "purple",
    inStock: true,
    inventory: 100,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-05-21T00:00:00Z",
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
    description: "Multiverse Vault: Parallel Edition 500-pack — the full parallel experience. 500 packs loaded with parallel variants, refractors, and numbered cards from across the Marvel multiverse. Full checklist published so you know exactly what's possible.",
    features: [
      "500 hand-curated Marvel trading card packs",
      "Focused on parallel variants and refractors",
      "Every card from authentic 2025 Topps Marvel releases",
      "Numbered parallels, inserts, and rare variants included",
      "Full checklist published — see every possible card",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "DROPPING MAY 21",
    badgeColor: "purple",
    inStock: true,
    inventory: 500,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-05-21T00:00:00Z",
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
    description: "Multiverse Vault: Legendary Drop — 100 packs featuring the most legendary cards in the Marvel universe. Premium hits, graded slabs, and cards that define collections. Full checklist published so you know exactly what's possible.",
    features: [
      "100 hand-curated Marvel trading card packs",
      "Premium legendary-tier cards and hits",
      "Every card from authentic 2025 Topps Marvel releases",
      "Numbered parallels, graded slabs, and premium cards included",
      "Full checklist published — see every possible card",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "DROPPING MAY 21",
    badgeColor: "purple",
    inStock: true,
    inventory: 100,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-05-21T00:00:00Z",
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
    description: "Multiverse Vault: Legendary Drop 500-pack — the ultimate vault experience. 500 packs featuring the most legendary cards in the Marvel universe. Premium hits, graded slabs, and cards that define collections. Full checklist published so you know exactly what's possible.",
    features: [
      "500 hand-curated Marvel trading card packs",
      "Premium legendary-tier cards and hits",
      "Every card from authentic 2025 Topps Marvel releases",
      "Numbered parallels, graded slabs, and premium cards included",
      "Full checklist published — see every possible card",
      "Sealed in custom NLF holographic mylar bag",
    ],
    badge: "DROPPING MAY 21",
    badgeColor: "purple",
    inStock: true,
    inventory: 500,
    isRepack: true,
    isComingSoon: false,
    launchDate: "2026-05-21T00:00:00Z",
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

/** Get the featured/flagship product (Topps Marvel Mint Collection) */
export function getFeaturedProduct(): Product | undefined {
  return products.find((p) => p.productLine === "gambit-deck");
}

/** Get unique product lines with their products */
export function getProductLines() {
  return [
    {
      id: "gambit-deck",
      name: "Topps Marvel Mint Collection",
      tagline: "52 premium packs with a complete Gambit set — the only set with a pre-revealed checklist",
      products: getProductsByLine("gambit-deck"),
      available: true,
    },
    {
      id: "variant-series",
      name: "The Variant Series",
      tagline: "Our flagship Marvel repack line — launching May 21st",
      products: getProductsByLine("variant-series"),
      available: true,
    },
    {
      id: "snap-collection",
      name: "The Snap Collection",
      tagline: "Iconic Marvel moments in every pack — launching May 21st",
      products: getProductsByLine("snap-collection"),
      available: true,
    },
    {
      id: "multiverse-vault",
      name: "Multiverse Vault",
      tagline: "Deep cuts from across the Marvel multiverse — launching May 21st",
      products: getProductsByLine("multiverse-vault"),
      available: true,
    },
  ];
}

