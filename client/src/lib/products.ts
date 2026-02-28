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
    name: "NLF Variant",
    subtitle: "Marvel Trading Card Repack",
    category: "marvel",
    price: 100,
    image: CDN.nlfPack,
    images: [CDN.nlfPack],
    description: "The NLF Variant is our flagship Marvel trading card repack, packed with premium cards from the hottest Topps releases. Every pack is hand-curated to deliver maximum value and excitement. Featuring cards from Topps Chrome Marvel, Marvel Mint, and more — each pack is a unique experience with guaranteed hits.",
    features: [
      "Hand-curated premium Marvel trading cards",
      "Guaranteed hit in every pack (auto, relic, or numbered card)",
      "Cards from Topps Chrome, Marvel Mint, and other premium sets",
      "Limited to 500 packs — once they're gone, they're gone",
      "Sealed in custom NLF holographic mylar bag",
      "Perfect for collectors and investors alike",
    ],
    badge: "LAUNCH EXCLUSIVE",
    badgeColor: "green",
    inStock: true,
    inventory: 500,
    isRepack: true,
    isComingSoon: false,
    shopifyUrl: `https://${SHOPIFY_STORE}/products/nlf-variant`,
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
    description: "Shadows of the Force is our premium Star Wars trading card repack, featuring the most sought-after cards from across the galaxy. From classic trilogy heroes to modern era favorites, every pack delivers a curated selection of premium Topps Star Wars cards with guaranteed hits.",
    features: [
      "Hand-curated premium Star Wars trading cards",
      "Guaranteed hit in every pack (auto, relic, or numbered card)",
      "Cards from Topps Chrome Star Wars and other premium sets",
      "Limited to 500 packs — once they're gone, they're gone",
      "Sealed in custom NLF holographic mylar bag",
      "From the original trilogy to the latest releases",
    ],
    badge: "LAUNCH EXCLUSIVE",
    badgeColor: "cyan",
    inStock: true,
    inventory: 500,
    isRepack: true,
    isComingSoon: false,
    shopifyUrl: `https://${SHOPIFY_STORE}/products/shadows-of-the-force`,
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
  return products.filter((p) => p.isRepack);
}
