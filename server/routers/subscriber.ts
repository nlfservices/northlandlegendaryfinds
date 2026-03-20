/**
 * Subscriber Router — gated content for subscriber and admin roles
 * Provides early access repacks, exclusive checklists, and subscriber perks
 */
import { z } from "zod";
import { subscriberProcedure, publicProcedure, router } from "../_core/trpc";

/**
 * Exclusive checklists available only to subscribers
 * These contain detailed card breakdowns, estimated values, and tier info
 */
const exclusiveChecklists = [
  {
    id: "snap-collection-preview",
    title: "The Snap Collection — Full Checklist Preview",
    description: "Complete card-by-card breakdown of The Snap Collection with estimated values, parallel tiers, and hit ratios. See exactly what you're getting before anyone else.",
    cardCount: 150,
    category: "marvel" as const,
    productLine: "snap-collection",
    tiers: [
      { name: "Base Cards", count: 80, description: "Core set featuring iconic Snap moments" },
      { name: "Chrome Parallels", count: 30, description: "Refractor, Gold (/50), Red (/25), Superfractor (/1)" },
      { name: "Insert Cards", count: 25, description: "Snap Moment inserts, Infinity Stone chase cards" },
      { name: "Autographs", count: 10, description: "On-card autos from top Marvel artists" },
      { name: "Numbered Hits", count: 5, description: "Serial numbered /99, /50, /25, /10, /1" },
    ],
    estimatedValueRange: "$180 - $2,500+",
    hitRatio: "1 hit per 5 packs guaranteed",
    releaseDate: "2026-05-15T00:00:00Z",
    isNew: true,
  },
  {
    id: "mv-origins-preview",
    title: "Multiverse Vault: Origins — Full Checklist Preview",
    description: "Deep dive into the Origins set — first appearances, origin stories, and the rarest cards in the Multiverse Vault line. Includes estimated market values.",
    cardCount: 200,
    category: "marvel" as const,
    productLine: "multiverse-vault",
    tiers: [
      { name: "Base Cards", count: 100, description: "Origin story cards spanning the entire Marvel multiverse" },
      { name: "First Appearance Inserts", count: 40, description: "Commemorating first appearances of major characters" },
      { name: "Chrome Parallels", count: 30, description: "Refractor, Prism, Gold (/50), Black (/25), Superfractor (/1)" },
      { name: "Sketch Cards", count: 15, description: "Original 1/1 artist sketch cards" },
      { name: "Autographs", count: 10, description: "Certified autographs from Marvel creators" },
      { name: "Legendary Hits", count: 5, description: "Ultra-rare /10 and /1 cards with premium finishes" },
    ],
    estimatedValueRange: "$200 - $5,000+",
    hitRatio: "1 hit per 4 packs guaranteed",
    releaseDate: "2026-07-01T00:00:00Z",
    isNew: true,
  },
  {
    id: "mv-parallel-preview",
    title: "Multiverse Vault: Parallel Edition — Full Checklist Preview",
    description: "Every parallel variant mapped out with print runs, rarity tiers, and estimated secondary market values. The ultimate parallel collector's guide.",
    cardCount: 175,
    category: "marvel" as const,
    productLine: "multiverse-vault",
    tiers: [
      { name: "Base Parallels", count: 75, description: "Standard refractor parallels of the base set" },
      { name: "Numbered Parallels", count: 50, description: "Gold (/99), Red (/50), Blue (/25), Black (/10), Superfractor (/1)" },
      { name: "Prism Inserts", count: 25, description: "Special prism-finish insert set" },
      { name: "Dual Autographs", count: 15, description: "Dual-signed cards from Marvel artist pairs" },
      { name: "Patch Cards", count: 10, description: "Embedded fabric patch cards — extremely limited" },
    ],
    estimatedValueRange: "$250 - $8,000+",
    hitRatio: "1 hit per 3 packs guaranteed",
    releaseDate: "2026-08-15T00:00:00Z",
    isNew: false,
  },
  {
    id: "mv-legendary-preview",
    title: "Multiverse Vault: Legendary Drop — Full Checklist Preview",
    description: "The crown jewel of the Multiverse Vault. Every legendary-tier card detailed with provenance, estimated values, and what makes each one special.",
    cardCount: 125,
    category: "marvel" as const,
    productLine: "multiverse-vault",
    tiers: [
      { name: "Legendary Base", count: 50, description: "Premium base cards with holographic finish" },
      { name: "Graded Inserts", count: 25, description: "Pre-graded PSA/BGS cards included in packs" },
      { name: "1/1 Cards", count: 20, description: "True one-of-one cards — printing plates, superfractors" },
      { name: "Autograph Relics", count: 15, description: "Autographed cards with embedded relic pieces" },
      { name: "Ultra Legendary", count: 15, description: "The rarest cards in the entire NLF universe" },
    ],
    estimatedValueRange: "$500 - $15,000+",
    hitRatio: "1 hit per 2 packs guaranteed",
    releaseDate: "2026-10-01T00:00:00Z",
    isNew: false,
  },
];

/**
 * Early access products — upcoming drops that subscribers see first
 */
const earlyAccessProducts = [
  {
    id: "snap-collection-100",
    name: "The Snap Collection",
    subtitle: "100 Marvel Trading Card Repacks",
    price: 139,
    subscriberPrice: 119,
    savings: 20,
    packCount: 100,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-snap-collection-f4QERPq29N4pJDjofGfJDw.webp",
    description: "Be the first to grab The Snap Collection — 100 hand-curated packs featuring iconic Marvel moments. Subscribers get 48-hour early access + exclusive pricing.",
    publicLaunchDate: "2026-05-17T00:00:00Z",
    subscriberLaunchDate: "2026-05-15T00:00:00Z",
    features: [
      "48-hour early access before public launch",
      "$20 subscriber discount",
      "100 hand-curated Marvel trading card packs",
      "Themed around iconic Marvel moments and events",
      "Strong floor, better middle, healthy ceiling",
    ],
    status: "upcoming" as const,
  },
  {
    id: "snap-collection-500",
    name: "The Snap Collection",
    subtitle: "500 Marvel Trading Card Repacks",
    price: 139,
    subscriberPrice: 119,
    savings: 20,
    packCount: 500,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-snap-collection-f4QERPq29N4pJDjofGfJDw.webp",
    description: "The full 500-pack Snap Collection experience — subscribers get first dibs and exclusive pricing.",
    publicLaunchDate: "2026-05-17T00:00:00Z",
    subscriberLaunchDate: "2026-05-15T00:00:00Z",
    features: [
      "48-hour early access before public launch",
      "$20 subscriber discount",
      "500 hand-curated Marvel trading card packs",
      "Themed around iconic Marvel moments and events",
      "Strong floor, better middle, healthy ceiling",
    ],
    status: "upcoming" as const,
  },
  {
    id: "mv-origins-100",
    name: "Multiverse Vault: Origins",
    subtitle: "100 Marvel Trading Card Repacks",
    price: 139,
    subscriberPrice: 119,
    savings: 20,
    packCount: 100,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-mv-origins-Hy4dpNfeVzWEfn9T6vJBid.webp",
    description: "Multiverse Vault: Origins — origin stories and first appearances. Subscribers get early access and exclusive pricing.",
    publicLaunchDate: "2026-07-03T00:00:00Z",
    subscriberLaunchDate: "2026-07-01T00:00:00Z",
    features: [
      "48-hour early access before public launch",
      "$20 subscriber discount",
      "100 hand-curated Marvel trading card packs",
      "Origin stories and first appearance themed",
      "Strong floor, better middle, healthy ceiling",
    ],
    status: "upcoming" as const,
  },
  {
    id: "mv-origins-500",
    name: "Multiverse Vault: Origins",
    subtitle: "500 Marvel Trading Card Repacks",
    price: 139,
    subscriberPrice: 119,
    savings: 20,
    packCount: 500,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/product-mv-origins-Hy4dpNfeVzWEfn9T6vJBid.webp",
    description: "The full 500-pack Origins vault — subscribers get first dibs and exclusive pricing.",
    publicLaunchDate: "2026-07-03T00:00:00Z",
    subscriberLaunchDate: "2026-07-01T00:00:00Z",
    features: [
      "48-hour early access before public launch",
      "$20 subscriber discount",
      "500 hand-curated Marvel trading card packs",
      "Origin stories and first appearance themed",
      "Strong floor, better middle, healthy ceiling",
    ],
    status: "upcoming" as const,
  },
];

export const subscriberRouter = router({
  /**
   * Get subscriber hub overview — available to all authenticated users
   * Returns limited preview for non-subscribers, full content for subscribers
   */
  hubOverview: publicProcedure.query(({ ctx }) => {
    const isSubscriber = ctx.user?.role === "subscriber" || ctx.user?.role === "admin";

    return {
      isSubscriber,
      isAuthenticated: !!ctx.user,
      // Show counts and teasers to everyone
      earlyAccessCount: earlyAccessProducts.length,
      exclusiveChecklistCount: exclusiveChecklists.length,
      // Preview data for non-subscribers (limited info)
      earlyAccessPreview: earlyAccessProducts.map((p) => ({
        id: p.id,
        name: p.name,
        subtitle: p.subtitle,
        image: p.image,
        publicLaunchDate: p.publicLaunchDate,
        status: p.status,
      })),
      checklistPreview: exclusiveChecklists.map((c) => ({
        id: c.id,
        title: c.title,
        cardCount: c.cardCount,
        category: c.category,
        isNew: c.isNew,
      })),
    };
  }),

  /**
   * Get full early access products — subscriber only
   */
  earlyAccessProducts: subscriberProcedure.query(() => {
    return earlyAccessProducts;
  }),

  /**
   * Get full exclusive checklists list — subscriber only
   */
  exclusiveChecklists: subscriberProcedure.query(() => {
    return exclusiveChecklists;
  }),

  /**
   * Get a specific exclusive checklist by ID — subscriber only
   */
  checklistDetail: subscriberProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const checklist = exclusiveChecklists.find((c) => c.id === input.id);
      if (!checklist) {
        return null;
      }
      return checklist;
    }),

  /**
   * Get subscriber benefits summary — public (for marketing)
   */
  benefits: publicProcedure.query(() => {
    return {
      benefits: [
        {
          icon: "clock",
          title: "48-Hour Early Access",
          description: "Get first dibs on every new repack drop — 48 hours before the public launch.",
        },
        {
          icon: "tag",
          title: "Exclusive Pricing",
          description: "Save $20 on every repack purchase with subscriber-only pricing.",
        },
        {
          icon: "list",
          title: "Exclusive Checklists",
          description: "Full card-by-card breakdowns with estimated values, hit ratios, and tier details before anyone else sees them.",
        },
        {
          icon: "bell",
          title: "Priority Drop Alerts",
          description: "Get notified first when new products drop — never miss a limited release.",
        },
        {
          icon: "shield",
          title: "Subscriber Badge",
          description: "Stand out in the community with your exclusive subscriber badge.",
        },
        {
          icon: "gift",
          title: "Monthly Bonus Content",
          description: "Exclusive market insights, collecting tips, and behind-the-scenes content delivered monthly.",
        },
      ],
    };
  }),
});
