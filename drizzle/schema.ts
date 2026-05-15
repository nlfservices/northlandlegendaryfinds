import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, bigint, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "subscriber"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  /** Stripe customer ID for payment processing */
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Repack products - each represents a repack series (e.g., "NLF Variant Vol. 1")
 */
export const repackProducts = mysqlTable("repack_products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  price: int("price"), // price in cents
  totalPacks: int("totalPacks").notNull().default(500),
  packsRemaining: int("packsRemaining").notNull().default(500),
  category: mysqlEnum("category", ["marvel", "starwars", "sports", "pokemon", "other"]).notNull().default("marvel"),
  status: mysqlEnum("status", ["draft", "active", "soldout", "archived"]).notNull().default("draft"),
  /** Whether this product is a Whatnot-exclusive */
  isWhatnotExclusive: boolean("isWhatnotExclusive").notNull().default(false),
  /** Whatnot series info - e.g., "500 Pack Series" */
  whatnotSeriesName: varchar("whatnotSeriesName", { length: 255 }),
  /** Packs per show for Whatnot exclusives */
  packsPerShow: int("packsPerShow"),
  /** Shopify checkout URL for website products */
  shopifyUrl: text("shopifyUrl"),
  /** Sort order for display */
  sortOrder: int("sortOrder").notNull().default(0),
  /** Date the checklist was finalized (Whatnot compliance) */
  checklistFinalizedAt: timestamp("checklistFinalizedAt"),
  /** Custom finalization statement (Whatnot compliance) */
  checklistStatement: text("checklistStatement"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RepackProduct = typeof repackProducts.$inferSelect;
export type InsertRepackProduct = typeof repackProducts.$inferInsert;

/**
 * Checklist items - individual cards that CAN be pulled from a repack product
 * Each row = one card in the checklist
 */
export const checklistItems = mysqlTable("checklist_items", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  /** Card player/character name */
  cardName: varchar("cardName", { length: 255 }).notNull(),
  /** Card set name (e.g., "2024 Topps Chrome") */
  cardSet: varchar("cardSet", { length: 255 }),
  /** Card year */
  cardYear: varchar("cardYear", { length: 10 }),
  /** Card number in the set */
  cardNumber: varchar("cardNumber", { length: 50 }),
  /** Parallel type (e.g., "Base", "Refractor", "Gold /50") */
  parallel: varchar("parallel", { length: 100 }),
  /** Tier for display grouping */
  tier: mysqlEnum("tier", ["chase", "hit", "base", "bonus"]).notNull().default("base"),
  /** Estimated value range (e.g., "$50-$100") — admin-only, hidden from public per Whatnot rules */
  estimatedValue: varchar("estimatedValue", { length: 50 }),
  /** Card condition (e.g., "Raw", "Near Mint", "Graded PSA 10") — Whatnot compliance */
  cardCondition: varchar("cardCondition", { length: 100 }),
  /** Whether this card has been pulled */
  isPulled: boolean("isPulled").notNull().default(false),
  /** Image URL of the card (optional) */
  imageUrl: text("imageUrl"),
  /** Sort order within tier */
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChecklistItem = typeof checklistItems.$inferSelect;
export type InsertChecklistItem = typeof checklistItems.$inferInsert;

/**
 * Pull records - tracks actual pulls with date, show, and pack info
 * This is the TRUST BUILDER - real-time proof of what was pulled
 */
export const pulls = mysqlTable("pulls", {
  id: int("id").autoincrement().primaryKey(),
  /** Which checklist item was pulled */
  checklistItemId: int("checklistItemId").notNull(),
  /** Which product this pull belongs to */
  productId: int("productId").notNull(),
  /** Which show this was pulled during (null = website sale) */
  showId: int("showId"),
  /** Pack number (e.g., pack #47 of 500) */
  packNumber: int("packNumber"),
  /** Name of the person who pulled it (optional, for privacy) */
  pulledBy: varchar("pulledBy", { length: 100 }),
  /** Additional notes about the pull */
  notes: text("notes"),
  /** Timestamp of the pull */
  pulledAt: timestamp("pulledAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Pull = typeof pulls.$inferSelect;
export type InsertPull = typeof pulls.$inferInsert;

/**
 * Whatnot shows - schedule and history of live streams
 */
export const shows = mysqlTable("shows", {
  id: int("id").autoincrement().primaryKey(),
  /** Show title (e.g., "NLF Variant Vol. 1 - Show #3") */
  title: varchar("title", { length: 255 }).notNull(),
  /** Which product this show features */
  productId: int("productId").notNull(),
  /** Show date/time (stored as UTC timestamp in ms) */
  showDate: bigint("showDate", { mode: "number" }).notNull(),
  /** Whatnot stream URL */
  whatnotUrl: text("whatnotUrl"),
  /** Show status */
  status: mysqlEnum("status", ["scheduled", "live", "completed", "cancelled"]).notNull().default("scheduled"),
  /** Number of packs opened during this show */
  packsOpened: int("packsOpened").notNull().default(0),
  /** Starting pack number for this show */
  startingPackNumber: int("startingPackNumber"),
  /** Notes about the show */
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Show = typeof shows.$inferSelect;
export type InsertShow = typeof shows.$inferInsert;

/**
 * Orders - tracks purchases made through Stripe checkout
 * Following Stripe best practices: store only Stripe IDs + fulfillment data
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  /** User who placed the order (null for guest checkout) */
  userId: int("userId"),
  /** Stripe checkout session ID */
  stripeSessionId: varchar("stripeSessionId", { length: 255 }).notNull().unique(),
  /** Stripe payment intent ID */
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  /** Which product was purchased */
  productId: int("productId").notNull(),
  /** Quantity purchased */
  quantity: int("quantity").notNull().default(1),
  /** Amount in cents (cached for quick display without Stripe API call) */
  amountCents: int("amountCents").notNull(),
  /** Currency code */
  currency: varchar("currency", { length: 3 }).notNull().default("usd"),
  /** Order status for fulfillment tracking */
  status: mysqlEnum("status", ["pending", "paid", "shipped", "delivered", "cancelled", "refunded"]).notNull().default("pending"),
  /** Customer email (for guest checkout or quick reference) */
  customerEmail: varchar("customerEmail", { length: 320 }),
  /** Customer name */
  customerName: varchar("customerName", { length: 255 }),
  /** Shipping address (JSON) */
  shippingAddress: json("shippingAddress"),
  /** Tracking number for shipment */
  trackingNumber: varchar("trackingNumber", { length: 255 }),
  /** Fulfillment notes */
  notes: text("notes"),
  /** When the payment was confirmed */
  paidAt: timestamp("paidAt"),
  /** When the order was shipped */
  shippedAt: timestamp("shippedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Card Sets - master reference of all card sets (e.g., "2025 Topps Chrome", "2025 Marvel Sapphire")
 */
export const cardSets = mysqlTable("card_sets", {
  id: int("id").autoincrement().primaryKey(),
  /** Set name (e.g., "2025 Topps Chrome") */
  name: varchar("name", { length: 255 }).notNull(),
  /** Short slug for URLs */
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  /** Year of the set */
  year: varchar("year", { length: 10 }),
  /** Manufacturer (e.g., "Topps", "Panini") */
  manufacturer: varchar("manufacturer", { length: 100 }),
  /** Category */
  category: mysqlEnum("category", ["marvel", "starwars", "sports", "pokemon", "other"]).notNull().default("marvel"),
  /** Total base cards in the set */
  totalBaseCards: int("totalBaseCards"),
  /** Image URL for the set */
  imageUrl: text("imageUrl"),
  /** Notes about the set */
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CardSet = typeof cardSets.$inferSelect;
export type InsertCardSet = typeof cardSets.$inferInsert;

/**
 * Inventory Cards - master inventory of every card you own
 * This is the single source of truth for what's in stock
 */
export const inventoryCards = mysqlTable("inventory_cards", {
  id: int("id").autoincrement().primaryKey(),
  /** Which set this card belongs to */
  cardSetId: int("cardSetId").notNull(),
  /** Character/Player name */
  cardName: varchar("cardName", { length: 255 }).notNull(),
  /** Card number in the set */
  cardNumber: varchar("cardNumber", { length: 50 }),
  /** Parallel/Variant type (e.g., "Base", "Refractor", "Gold /50", "Superfractor 1/1") */
  parallel: varchar("parallel", { length: 150 }),
  /** Serial number if numbered (e.g., "25" for /25) */
  serialNumber: varchar("serialNumber", { length: 20 }),
  /** Card condition */
  condition: mysqlEnum("condition", ["raw", "psa10", "psa9", "psa8", "psa7", "bgs10", "bgs9.5", "bgs9", "sgc10", "sgc9.5", "sgc9", "other"]).notNull().default("raw"),
  /** Grading company if graded */
  gradingCompany: varchar("gradingCompany", { length: 50 }),
  /** Grade value if graded */
  gradeValue: varchar("gradeValue", { length: 20 }),
  /** Quantity in stock (for non-unique cards) */
  quantity: int("quantity").notNull().default(1),
  /** Purchase price in cents */
  purchasePriceCents: int("purchasePriceCents"),
  /** Estimated market value in cents */
  estimatedValueCents: int("estimatedValueCents"),
  /** Where the card was acquired */
  source: varchar("source", { length: 255 }),
  /** Date acquired */
  acquiredAt: timestamp("acquiredAt"),
  /** Inventory status */
  status: mysqlEnum("status", ["in_stock", "allocated", "pulled", "sold", "traded", "grading"]).notNull().default("in_stock"),
  /** Which repack product this card is allocated to (null = unallocated) */
  allocatedToProductId: int("allocatedToProductId"),
  /** Which checklist item this maps to when allocated */
  checklistItemId: int("checklistItemId"),
  /** Tier assignment when allocated to a repack */
  allocatedTier: mysqlEnum("allocatedTier", ["chase", "hit", "base", "bonus"]),
  /** Image URL of the card */
  imageUrl: text("imageUrl"),
  /** Additional notes */
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InventoryCard = typeof inventoryCards.$inferSelect;
export type InsertInventoryCard = typeof inventoryCards.$inferInsert;

// ============================================================
// CARD ENCYCLOPEDIA - Complete card database from all sets
// ============================================================

/**
 * Marvel Card Sets - the 6 master sets from 2025toppsmarvelcards.com
 * Separate from cardSets (which is for inventory tracking)
 */
export const marvelSets = mysqlTable("marvel_sets", {
  id: int("id").autoincrement().primaryKey(),
  /** Original ID from source site */
  sourceId: int("sourceId"),
  /** Full set name (e.g., "2025 Topps Chrome") */
  name: varchar("name", { length: 255 }).notNull(),
  /** Short display name (e.g., "Chrome") */
  shortName: varchar("shortName", { length: 100 }),
  /** URL-friendly slug */
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  /** Release year */
  releaseYear: int("releaseYear"),
  /** Total cards in the set */
  totalCards: int("totalCards"),
  /** Description of the set */
  description: text("description"),
  /** Box/pack image URL */
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarvelSet = typeof marvelSets.$inferSelect;
export type InsertMarvelSet = typeof marvelSets.$inferInsert;

/**
 * Marvel Cards - every card in every set (the full encyclopedia)
 * 1,709 cards across 6 sets with subset/category info
 */
export const marvelCards = mysqlTable("marvel_cards", {
  id: int("id").autoincrement().primaryKey(),
  /** Which set this card belongs to */
  setId: int("setId").notNull(),
  /** Card number (e.g., "1", "AM-1", "CC-1") */
  cardNumber: varchar("cardNumber", { length: 50 }).notNull(),
  /** Character name (e.g., "Iron Man", "Spider-Man") */
  characterName: varchar("characterName", { length: 255 }).notNull(),
  /** Subset/category (e.g., "Base", "AIR MARVEL", "AVENGERS INFINITY") */
  cardType: varchar("cardType", { length: 255 }),
  /** Available parallels as comma-separated string */
  parallels: text("parallels"),
  /** Rarity info */
  rarity: varchar("rarity", { length: 100 }),
  /** Card image URL */
  imageUrl: text("imageUrl"),
  /** Back image URL */
  backImageUrl: text("back_image_url"),
  /** Card description */
  description: text("description"),
  /** Sort order for display */
  sortOrder: int("sortOrder").notNull().default(0),
  /** Source ID from the original site */
  sourceId: int("sourceId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MarvelCard = typeof marvelCards.$inferSelect;
export type InsertMarvelCard = typeof marvelCards.$inferInsert;

/**
 * Graded Cards - NLF's graded card inventory (CGC + AGS submissions)
 * Tracks every card sent for grading with results
 */
export const gradedCards = mysqlTable("graded_cards", {
  id: int("id").autoincrement().primaryKey(),
  /** Grading company (CGC, AGS, PSA, BGS, SGC) */
  gradingCompany: varchar("gradingCompany", { length: 20 }).notNull(),
  /** Grade received (e.g., "9", "9.5", "GEM MINT 10", or null if awaiting) */
  grade: varchar("grade", { length: 30 }),
  /** Numeric grade for sorting (e.g., 9.0, 9.5, 10.0) */
  gradeNumeric: decimal("gradeNumeric", { precision: 3, scale: 1 }),
  /** Autograph grade if applicable */
  autographGrade: varchar("autographGrade", { length: 30 }),
  /** Character/card name */
  cardName: varchar("cardName", { length: 255 }).notNull(),
  /** Card number in the set */
  cardNumber: varchar("cardNumber", { length: 50 }),
  /** Card set name (e.g., "2025 Topps Chrome", "2025 Marvel Comic Book Heroes") */
  cardSet: varchar("cardSet", { length: 255 }),
  /** Subset/insert name (e.g., "Golden Anniversary", "Base") */
  subset: varchar("subset", { length: 255 }),
  /** Parallel/variant (e.g., "Gold Refractor", "Electrum Refractor", "Blue Refractor") */
  parallel: varchar("parallel", { length: 255 }),
  /** Numbered to (e.g., 50, 75, 99, 199) */
  numberedTo: int("numberedTo"),
  /** CGC cert number or AGS submission ID */
  certNumber: varchar("certNumber", { length: 50 }),
  /** Invoice/submission number */
  invoiceNumber: varchar("invoiceNumber", { length: 50 }),
  /** Line item number within submission */
  lineItem: varchar("lineItem", { length: 20 }),
  /** Submission batch identifier (e.g., "CGC1A", "AGS1") */
  batchId: varchar("batchId", { length: 20 }),
  /** Status of the grading */
  status: mysqlEnum("status", ["submitted", "received", "grading", "shipped", "delivered"]).notNull().default("submitted"),
  /** Date received by grading company */
  receivedDate: timestamp("receivedDate"),
  /** Date shipped back */
  shippedDate: timestamp("shippedDate"),
  /** Declared value in cents */
  declaredValueCents: int("declaredValueCents"),
  /** Link to marvel_cards table if matched */
  marvelCardId: int("marvelCardId"),
  /** Error type if any */
  errorType: varchar("errorType", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GradedCard = typeof gradedCards.$inferSelect;
export type InsertGradedCard = typeof gradedCards.$inferInsert;

/**
 * Launch Subscribers - collects emails for product launch notifications
 * Users can subscribe to be notified when a product becomes available
 */
export const launchSubscribers = mysqlTable("launch_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  /** Email address */
  email: varchar("email", { length: 320 }).notNull(),
  /** Product slug (e.g., "nlf-variant") */
  productSlug: varchar("productSlug", { length: 255 }).notNull(),
  /** Optional: user ID if they were logged in */
  userId: int("userId"),
  /** Source of the subscription (product page, shop page, homepage, etc.) */
  source: varchar("source", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LaunchSubscriber = typeof launchSubscribers.$inferSelect;
export type InsertLaunchSubscriber = typeof launchSubscribers.$inferInsert;

/**
 * Character Content - SEO-optimized character history pages
 * Each row = one character's content for a specific set
 * Content is generated via LLM and cached here
 */
export const characterContent = mysqlTable("character_content", {
  id: int("id").autoincrement().primaryKey(),
  /** Character name exactly as it appears in marvel_cards */
  characterName: varchar("characterName", { length: 255 }).notNull(),
  /** URL-friendly slug (e.g., "iron-man", "spider-man") */
  slug: varchar("slug", { length: 255 }).notNull(),
  /** Which set this content is for (null = global/shared) */
  setId: int("setId"),
  /** Full history content in Markdown (1000+ words) */
  historyMarkdown: text("historyMarkdown"),
  /** Short summary for meta description (150-160 chars) */
  metaDescription: varchar("metaDescription", { length: 320 }),
  /** Key facts JSON: first appearance, creators, real name, etc. */
  keyFacts: json("keyFacts"),
  /** Whether content has been reviewed/approved */
  isApproved: boolean("isApproved").notNull().default(false),
  /** Content generation status */
  status: mysqlEnum("status", ["pending", "generating", "generated", "approved", "error"]).notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CharacterContent = typeof characterContent.$inferSelect;
export type InsertCharacterContent = typeof characterContent.$inferInsert;

/**
 * Card Detail Content - LLM-generated content for individual card pages
 * Each card gets a unique page with set-specific character context
 */
export const cardDetailContent = mysqlTable("card_detail_content", {
  id: int("id").autoincrement().primaryKey(),
  /** Reference to the marvel_cards row */
  cardId: int("cardId").notNull(),
  /** Set slug for URL routing (e.g., "2025-topps-chrome") */
  setSlug: varchar("setSlug", { length: 255 }).notNull(),
  /** Card number for URL routing (e.g., "1", "AV-9", "IM-1") */
  cardNumber: varchar("cardNumber", { length: 50 }).notNull(),
  /** LLM-generated content in Markdown (500-800 words) about the character in this set's context */
  contentMarkdown: text("contentMarkdown"),
  /** Short summary for meta description (150-160 chars) */
  metaDescription: varchar("metaDescription", { length: 320 }),
  /** Content generation status */
  status: mysqlEnum("status", ["pending", "generating", "generated", "error"]).notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CardDetailContent = typeof cardDetailContent.$inferSelect;
export type InsertCardDetailContent = typeof cardDetailContent.$inferInsert;


/**
 * Matrix Attempts - tracks failed access code attempts for IP lockout
 * After 5 failed attempts from the same IP, lock out for 15 minutes
 */
export const matrixAttempts = mysqlTable("matrix_attempts", {
  id: int("id").autoincrement().primaryKey(),
  /** IP address of the requester */
  ipAddress: varchar("ipAddress", { length: 45 }).notNull(),
  /** Number of failed attempts */
  failedAttempts: int("failedAttempts").notNull().default(0),
  /** When the lockout expires (null = not locked out) */
  lockedUntil: timestamp("lockedUntil"),
  /** Last attempt timestamp */
  lastAttemptAt: timestamp("lastAttemptAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MatrixAttempt = typeof matrixAttempts.$inferSelect;
export type InsertMatrixAttempt = typeof matrixAttempts.$inferInsert;

/**
 * Matrix Bypass Tokens - one-time use tokens for "Forgot PIN" bypass
 * Sent via notification email, expire after 15 minutes
 */
export const matrixBypassTokens = mysqlTable("matrix_bypass_tokens", {
  id: int("id").autoincrement().primaryKey(),
  /** The bypass token (UUID) */
  token: varchar("token", { length: 64 }).notNull().unique(),
  /** IP address that requested the bypass */
  requestedByIp: varchar("requestedByIp", { length: 45 }).notNull(),
  /** Whether the token has been used */
  isUsed: boolean("isUsed").notNull().default(false),
  /** When the token expires */
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MatrixBypassToken = typeof matrixBypassTokens.$inferSelect;
export type InsertMatrixBypassToken = typeof matrixBypassTokens.$inferInsert;

/**
 * MCU News Articles — news articles about MCU movies, shows, card market impact
 */
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  /** Article title */
  title: varchar("title", { length: 500 }).notNull(),
  /** URL-friendly slug */
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  /** Short excerpt for cards/previews (max 300 chars) */
  excerpt: text("excerpt"),
  /** Full article content in Markdown */
  contentMarkdown: text("contentMarkdown").notNull(),
  /** Featured image URL */
  featuredImageUrl: text("featuredImageUrl"),
  /** Article category */
  category: mysqlEnum("category", ["movie_news", "show_news", "casting", "card_market", "release_dates", "rumors", "analysis", "interactive_social", "nerd_gossip", "card_collectors"]).notNull().default("movie_news"),
  /** Tags as JSON array (e.g., ["Avengers", "Doomsday", "Doctor Doom"]) */
  tags: json("tags"),
  /** Card market impact note (e.g., "Doctor Doom cards up 40% since casting news") */
  cardMarketImpact: text("cardMarketImpact"),
  /** Related character names for cross-linking to character pages */
  relatedCharacters: json("relatedCharacters"),
  /** Source URLs for citations (JSON array of {title, url}) */
  sources: json("sources"),
  /** Whether the article is featured (shown prominently) */
  isFeatured: boolean("isFeatured").notNull().default(false),
  /** Whether the article is published */
  isPublished: boolean("isPublished").notNull().default(false),
  /** Author name */
  authorName: varchar("authorName", { length: 255 }).default("NLF Team"),
  /** Publish date (UTC timestamp in ms) */
  publishedAt: bigint("publishedAt", { mode: "number" }),
  /** Scheduled publish date (UTC timestamp in ms) — for auto-publish queue */
  scheduledAt: bigint("scheduledAt", { mode: "number" }),
  /** SEO meta description */
  metaDescription: varchar("metaDescription", { length: 320 }),
  /** Article template layout style (classic, magazine, spotlight, timeline, listicle) */
  templateLayout: mysqlEnum("templateLayout", ["classic", "magazine", "spotlight", "timeline", "listicle"]).default("classic"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Marvelous Top 5 — admin-managed weekly buzz rankings on the homepage
 * Each row is one ranked entry with character, backstory, card image, and sources
 */
export const top5BuzzItems = mysqlTable("top5_buzz_items", {
  id: int("id").autoincrement().primaryKey(),
  /** Rank position (1-5) */
  rank: int("rank").notNull(),
  /** Display title (e.g., "Spider-Man: Brand New Day") */
  title: varchar("title", { length: 500 }).notNull(),
  /** Character name (e.g., "Spider-Man") */
  character: varchar("character", { length: 255 }).notNull(),
  /** Short tagline (e.g., "The trailer just dropped — and the hype is unreal") */
  tagline: varchar("tagline", { length: 500 }).notNull(),
  /** Full backstory paragraph */
  backstory: text("backstory").notNull(),
  /** Card image URL from NLF database */
  cardImage: text("cardImage").notNull(),
  /** Front card image (uploaded by admin) */
  frontImage: text("frontImage"),
  /** Back card image (uploaded by admin, optional) */
  backImage: text("backImage"),
  /** Cosmic frame template key */
  frameTemplate: varchar("frameTemplate", { length: 100 }).default("marvel_mint_gold"),
  /** Card label (e.g., "2025 Topps Chrome #101") */
  cardLabel: varchar("cardLabel", { length: 255 }).notNull(),
  /** Card detail page link (e.g., "/cards/chrome/101") */
  cardLink: varchar("cardLink", { length: 500 }).notNull(),
  /** Source links as JSON array of {title, url} */
  sources: json("sources").notNull(),
  /** Heat level for visual badge */
  heatLevel: mysqlEnum("heatLevel", ["blazing", "hot", "rising"]).notNull().default("rising"),
  /** Category label (e.g., "Movie", "Movie / Comics") */
  category: varchar("category", { length: 100 }).notNull().default("Movie"),
  /** Whether this item is active (shown on homepage) */
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Top5BuzzItem = typeof top5BuzzItems.$inferSelect;
export type InsertTop5BuzzItem = typeof top5BuzzItems.$inferInsert;

// ==================== SHOW SUBMISSIONS ====================
export const showSubmissions = mysqlTable("show_submissions", {
  id: int("id").autoincrement().primaryKey(),
  showName: varchar("showName", { length: 255 }).notNull(),
  promoterName: varchar("promoterName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 500 }),
  venue: varchar("venue", { length: 255 }),
  address: varchar("address", { length: 500 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zipCode: varchar("zipCode", { length: 10 }),
  startDate: bigint("startDate", { mode: "number" }).notNull(),
  endDate: bigint("endDate", { mode: "number" }).notNull(),
  hours: varchar("hours", { length: 255 }),
  tableCount: int("tableCount"),
  admission: varchar("admission", { length: 100 }),
  description: text("description"),
  isRecurring: boolean("isRecurring").notNull().default(false),
  recurrenceNote: varchar("recurrenceNote", { length: 255 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).notNull().default("pending"),
  adminNotes: text("adminNotes"),
  submittedByUserId: int("submittedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ShowSubmission = typeof showSubmissions.$inferSelect;
export type InsertShowSubmission = typeof showSubmissions.$inferInsert;


/**
 * The Collector — Blog posts for NLF's SEO-driven content hub
 * Supports both AI-generated and manually authored articles
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  /** Article title */
  title: varchar("title", { length: 500 }).notNull(),
  /** URL-friendly slug */
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  /** Short excerpt for cards/previews (max 300 chars) */
  excerpt: text("excerpt"),
  /** Full article content in Markdown */
  contentMarkdown: text("contentMarkdown").notNull(),
  /** Featured image URL (AI-generated or uploaded) */
  featuredImageUrl: text("featuredImageUrl"),
  /** Article category */
  category: mysqlEnum("blog_category", [
    "market_trends", "character_spotlight", "grading_guide",
    "set_breakdown", "investment_strategy", "collecting_tips",
    "nlf_news", "behind_the_scenes", "card_history", "sports_crossover"
  ]).notNull().default("market_trends"),
  /** Tags as JSON array */
  tags: json("tags"),
  /** Whether the article was AI-generated or manually written */
  isAiGenerated: boolean("isAiGenerated").notNull().default(false),
  /** AI generation prompt used (for reference/regeneration) */
  aiPrompt: text("aiPrompt"),
  /** Whether the article is featured (shown prominently) */
  isFeatured: boolean("isFeatured").notNull().default(false),
  /** Whether the article is published */
  isPublished: boolean("isPublished").notNull().default(false),
  /** Author name */
  authorName: varchar("authorName", { length: 255 }).default("NLF Team"),
  /** Publish date (UTC timestamp in ms) */
  publishedAt: bigint("publishedAt", { mode: "number" }),
  /** Scheduled publish date (UTC timestamp in ms) — for auto-publish queue */
  scheduledAt: bigint("scheduledAt", { mode: "number" }),
  /** SEO meta description */
  metaDescription: varchar("metaDescription", { length: 320 }),
  /** SEO focus keyword */
  focusKeyword: varchar("focusKeyword", { length: 255 }),
  /** Internal links JSON array [{text, url}] for SEO interlinking */
  internalLinks: json("internalLinks"),
  /** Read time in minutes (calculated from content length) */
  readTimeMinutes: int("readTimeMinutes").default(5),
  /** View count for analytics */
  viewCount: int("viewCount").notNull().default(0),
  /** Layout template number (1-12) for ORDER 66 Blog Layout Engine */
  layoutTemplate: int("layoutTemplate").default(1),
  /** Template-specific layout data (stats, timeline, gallery, toc, comparison, profile, pullQuote, factBox, alertLevel, heatLevel) */
  layoutData: json("layoutData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// ============================================================
// LOYALTY PROGRAM - Points, Tiers, and Rewards
// ============================================================

/**
 * Loyalty Members - tracks enrolled members and their current status
 * Links to users table for authenticated members, or standalone for email-only signups
 */
export const loyaltyMembers = mysqlTable("loyalty_members", {
  id: int("id").autoincrement().primaryKey(),
  /** Linked user account (null for email-only signups) */
  userId: int("userId"),
  /** Email address (required for all members) */
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** First name */
  firstName: varchar("firstName", { length: 100 }),
  /** Last name */
  lastName: varchar("lastName", { length: 100 }),
  /** Current points balance */
  pointsBalance: int("pointsBalance").notNull().default(0),
  /** Lifetime points earned (never decreases) */
  lifetimePoints: int("lifetimePoints").notNull().default(0),
  /** Current tier */
  tier: mysqlEnum("tier", ["collector", "silver", "gold", "legendary"]).notNull().default("collector"),
  /** Member status */
  status: mysqlEnum("loyalty_status", ["active", "paused", "banned"]).notNull().default("active"),
  /** Birthday for birthday rewards (month/day only) */
  birthday: varchar("birthday", { length: 5 }),
  /** GHL contact ID for CRM sync */
  ghlContactId: varchar("ghlContactId", { length: 100 }),
  /** Referral code (unique per member) */
  referralCode: varchar("referralCode", { length: 20 }).unique(),
  /** Who referred this member (referral code of referrer) */
  referredBy: varchar("referredBy", { length: 20 }),
  /** Date they joined the loyalty program */
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LoyaltyMember = typeof loyaltyMembers.$inferSelect;
export type InsertLoyaltyMember = typeof loyaltyMembers.$inferInsert;

/**
 * Loyalty Transactions - full history of points earned and redeemed
 * Every point change is logged here for transparency
 */
export const loyaltyTransactions = mysqlTable("loyalty_transactions", {
  id: int("id").autoincrement().primaryKey(),
  /** Which member this transaction belongs to */
  memberId: int("memberId").notNull(),
  /** Type of transaction */
  type: mysqlEnum("transaction_type", [
    "purchase", "referral", "signup_bonus", "newsletter",
    "social_follow", "drawing_entry", "birthday_bonus",
    "admin_adjustment", "redemption", "tier_bonus"
  ]).notNull(),
  /** Points added (positive) or deducted (negative) */
  points: int("points").notNull(),
  /** Running balance after this transaction */
  balanceAfter: int("balanceAfter").notNull(),
  /** Description of the transaction */
  description: varchar("description", { length: 500 }),
  /** Reference ID (e.g., order ID, referral code, etc.) */
  referenceId: varchar("referenceId", { length: 255 }),
  /** Reference type (e.g., "order", "referral", "manual") */
  referenceType: varchar("referenceType", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;
export type InsertLoyaltyTransaction = typeof loyaltyTransactions.$inferInsert;

/**
 * Loyalty Rewards - available rewards members can redeem points for
 */
export const loyaltyRewards = mysqlTable("loyalty_rewards", {
  id: int("id").autoincrement().primaryKey(),
  /** Reward name */
  name: varchar("name", { length: 255 }).notNull(),
  /** Reward description */
  description: text("description"),
  /** Points cost to redeem */
  pointsCost: int("pointsCost").notNull(),
  /** Minimum tier required */
  minTier: mysqlEnum("min_tier", ["collector", "silver", "gold", "legendary"]).notNull().default("collector"),
  /** Reward type */
  rewardType: mysqlEnum("reward_type", [
    "discount_code", "free_shipping", "exclusive_repack",
    "drawing_entry", "early_access", "merch", "custom"
  ]).notNull(),
  /** Reward value (e.g., discount percentage, dollar amount in cents) */
  rewardValue: varchar("rewardValue", { length: 100 }),
  /** Image URL */
  imageUrl: text("imageUrl"),
  /** Whether this reward is currently available */
  isActive: boolean("isActive").notNull().default(true),
  /** Max redemptions (null = unlimited) */
  maxRedemptions: int("maxRedemptions"),
  /** Current redemption count */
  redemptionCount: int("redemptionCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LoyaltyReward = typeof loyaltyRewards.$inferSelect;
export type InsertLoyaltyReward = typeof loyaltyRewards.$inferInsert;

/**
 * Loyalty Redemptions - tracks when members redeem rewards
 */
export const loyaltyRedemptions = mysqlTable("loyalty_redemptions", {
  id: int("id").autoincrement().primaryKey(),
  /** Which member redeemed */
  memberId: int("memberId").notNull(),
  /** Which reward was redeemed */
  rewardId: int("rewardId").notNull(),
  /** Points spent */
  pointsSpent: int("pointsSpent").notNull(),
  /** Redemption status */
  status: mysqlEnum("redemption_status", ["pending", "fulfilled", "cancelled", "expired"]).notNull().default("pending"),
  /** Generated code (for discount codes) */
  code: varchar("code", { length: 50 }),
  /** Fulfillment notes */
  notes: text("notes"),
  /** When the redemption expires */
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LoyaltyRedemption = typeof loyaltyRedemptions.$inferSelect;
export type InsertLoyaltyRedemption = typeof loyaltyRedemptions.$inferInsert;


/**
 * Site settings - key/value store for admin-configurable settings
 * Used for: giveaway countdown timer, stream dates, feature flags, etc.
 */
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  label: varchar("label", { length: 255 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;


/**
 * Page content - editable text sections for each page
 * Allows admin to update page copy from the dashboard without code changes.
 * Each row = one editable section on a specific page.
 */
export const pageContent = mysqlTable("page_content", {
  id: int("id").autoincrement().primaryKey(),
  /** Which page this content belongs to (e.g., "giveaway", "home", "about") */
  page: varchar("page", { length: 100 }).notNull(),
  /** Section key within the page (e.g., "hero_headline", "prize_1_label") */
  sectionKey: varchar("sectionKey", { length: 150 }).notNull(),
  /** The editable content value */
  content: text("content").notNull(),
  /** Human-readable label for the admin UI */
  label: varchar("label", { length: 255 }),
  /** Group name for organizing sections in the admin UI */
  groupName: varchar("groupName", { length: 100 }),
  /** Sort order within the group */
  sortOrder: int("sortOrder").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PageContent = typeof pageContent.$inferSelect;
export type InsertPageContent = typeof pageContent.$inferInsert;


// ============================================================
// CARD SHOWS DIRECTORY - Database-driven show listings
// ============================================================

/**
 * Card Shows - comprehensive directory of sports/trading card shows across the US
 * Migrated from static data to enable weekly auto-updates and admin management
 */
export const cardShows = mysqlTable("card_shows", {
  id: int("id").autoincrement().primaryKey(),
  /** Show name */
  name: varchar("name", { length: 500 }).notNull(),
  /** SEO-friendly slug (city-state-name format) */
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  /** Display date string (e.g., "March 20-22, 2026") */
  dateDisplay: varchar("dateDisplay", { length: 100 }).notNull(),
  /** Start date (ISO format YYYY-MM-DD) */
  startDate: varchar("startDate", { length: 10 }).notNull(),
  /** End date (ISO format YYYY-MM-DD) */
  endDate: varchar("endDate", { length: 10 }).notNull(),
  /** Month number (1-12) for filtering */
  month: int("month").notNull(),
  /** Venue name */
  venue: varchar("venue", { length: 500 }),
  /** Full street address */
  address: varchar("address", { length: 500 }),
  /** City */
  city: varchar("city", { length: 255 }).notNull(),
  /** State abbreviation (e.g., "TX", "CA") */
  state: varchar("state", { length: 5 }).notNull(),
  /** Full state name (e.g., "Texas", "California") */
  stateName: varchar("stateName", { length: 100 }).notNull(),
  /** Show hours (e.g., "9am-4pm") */
  hours: varchar("hours", { length: 255 }),
  /** Number of dealer tables */
  tableCount: int("tableCount"),
  /** Admission info (e.g., "FREE", "$5", "$2 early bird / $1 general") */
  admission: varchar("admission", { length: 255 }),
  /** Whether admission is free */
  isFree: boolean("isFree").default(false),
  /** Contact email */
  email: varchar("email", { length: 320 }),
  /** Contact phone */
  phone: varchar("phone", { length: 50 }),
  /** Website URL */
  website: varchar("website", { length: 500 }),
  /** Whether this show is featured/highlighted */
  featured: boolean("featured").default(false),
  /** Show status */
  status: mysqlEnum("show_status", ["upcoming", "past", "cancelled"]).notNull().default("upcoming"),
  /** Source where this show was found */
  source: varchar("source", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CardShowEntry = typeof cardShows.$inferSelect;
export type InsertCardShowEntry = typeof cardShows.$inferInsert;


/**
 * Article fan votes — allows visitors to react to articles with emoji reactions.
 * Uses visitorId (fingerprint/cookie) to prevent duplicate votes per article.
 */
export const articleVotes = mysqlTable("article_votes", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull(),
  /** Reaction type: loved, fire, meh, thumbsdown */
  reaction: varchar("reaction", { length: 32 }).notNull(),
  /** Anonymous visitor identifier (cookie-based) */
  visitorId: varchar("visitorId", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ArticleVote = typeof articleVotes.$inferSelect;
export type InsertArticleVote = typeof articleVotes.$inferInsert;

/**
 * Affiliate links / product recommendations for Collector's Corner
 * These appear on articles matched by character tags or pinned to specific articles
 * When no affiliate links exist, the section shows card site rotation (COMC, MySlabs, etc.)
 */
export const affiliateLinks = mysqlTable("affiliate_links", {
  id: int("id").autoincrement().primaryKey(),
  /** Display name (e.g., "Spider-Man Action Figure") */
  name: varchar("name", { length: 255 }).notNull(),
  /** Affiliate URL (Amazon, eBay Partner, Entertainment Earth, etc.) */
  url: text("url").notNull(),
  /** Product image URL */
  imageUrl: text("imageUrl"),
  /** Product category for filtering */
  category: mysqlEnum("category", ["cards", "toys", "clothing", "collectibles", "comics", "other"]).notNull().default("cards"),
  /** Character tags for auto-matching to articles (JSON array of strings) */
  characterTags: json("characterTags").$type<string[]>(),
  /** Pin to specific article IDs (JSON array of numbers) — overrides tag matching */
  pinnedArticleIds: json("pinnedArticleIds").$type<number[]>(),
  /** Whether this link is active */
  active: boolean("active").notNull().default(true),
  /** Display position/priority (lower = higher priority) */
  position: int("position").notNull().default(0),
  /** Optional price display (e.g., "$29.99") */
  priceDisplay: varchar("priceDisplay", { length: 50 }),
  /** Optional retailer name (e.g., "Amazon", "eBay", "COMC") */
  retailer: varchar("retailer", { length: 100 }),
  /** FTC disclosure required (true for affiliate links, false for regular links) */
  isAffiliate: boolean("isAffiliate").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type InsertAffiliateLink = typeof affiliateLinks.$inferInsert;


/**
 * MCU Movies & Series - each entry represents a movie or Disney+ series
 * with box office/streaming stats, trailer embed, and card market data
 */
export const mcuMedia = mysqlTable("mcu_media", {
  id: int("id").autoincrement().primaryKey(),
  /** Movie or Series title */
  title: varchar("title", { length: 255 }).notNull(),
  /** URL-friendly slug */
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  /** Type: movie or series */
  mediaType: mysqlEnum("mediaType", ["movie", "series"]).notNull(),
  /** MCU Phase (1-6) */
  phase: int("phase"),
  /** Release order number in MCU */
  releaseOrder: int("releaseOrder"),
  /** Release date */
  releaseDate: varchar("releaseDate", { length: 50 }),
  /** Director(s) */
  director: varchar("director", { length: 255 }),
  /** Main cast (comma-separated) */
  cast: text("cast"),
  /** Short tagline/subtitle */
  tagline: varchar("tagline", { length: 500 }),
  /** Full description/overview */
  description: text("description"),
  /** Featured image URL */
  imageUrl: text("imageUrl"),
  /** YouTube trailer video ID */
  youtubeTrailerId: varchar("youtubeTrailerId", { length: 20 }),
  /** === MOVIE FIELDS === */
  /** Production budget in millions */
  budgetMillions: int("budgetMillions"),
  /** Worldwide box office gross in millions */
  worldwideGrossMillions: int("worldwideGrossMillions"),
  /** Domestic box office gross in millions */
  domesticGrossMillions: int("domesticGrossMillions"),
  /** Opening weekend domestic in millions */
  openingWeekendMillions: int("openingWeekendMillions"),
  /** === SERIES FIELDS === */
  /** Number of episodes */
  episodeCount: int("episodeCount"),
  /** Number of seasons */
  seasonCount: int("seasonCount"),
  /** Streaming platform */
  platform: varchar("platform", { length: 100 }),
  /** === SHARED FIELDS === */
  /** Rotten Tomatoes critics score (0-100) */
  rtCriticsScore: int("rtCriticsScore"),
  /** Rotten Tomatoes audience score (0-100) */
  rtAudienceScore: int("rtAudienceScore"),
  /** Verdict: hit, miss, mixed */
  verdict: mysqlEnum("verdict", ["hit", "miss", "mixed"]).default("hit"),
  /** Card market analysis content (markdown) */
  cardMarketContent: text("cardMarketContent"),
  /** Key cards to collect (markdown) */
  keyCards: text("keyCards"),
  /** Full article content (markdown) */
  content: text("content"),
  /** SEO meta description */
  metaDescription: varchar("metaDescription", { length: 320 }),
  /** SEO keywords */
  keywords: text("keywords"),
  /** Related character slugs (JSON array) */
  relatedCharacters: json("relatedCharacters").$type<string[]>(),
  /** Published status */
  status: mysqlEnum("status", ["draft", "published"]).notNull().default("draft"),
  /** Featured on listing page */
  isFeatured: boolean("isFeatured").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type McuMedia = typeof mcuMedia.$inferSelect;
export type InsertMcuMedia = typeof mcuMedia.$inferInsert;
