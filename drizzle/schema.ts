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
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
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
 * Show Submissions - promoters submit their card shows for the directory
 * Admin reviews and approves before they appear in the public directory
 */
export const showSubmissions = mysqlTable("show_submissions", {
  id: int("id").autoincrement().primaryKey(),
  /** Show/event name */
  showName: varchar("showName", { length: 255 }).notNull(),
  /** Promoter/organizer name */
  promoterName: varchar("promoterName", { length: 255 }).notNull(),
  /** Contact email */
  email: varchar("email", { length: 320 }).notNull(),
  /** Contact phone */
  phone: varchar("phone", { length: 50 }),
  /** Show website URL */
  website: varchar("website", { length: 500 }),
  /** Venue name */
  venue: varchar("venue", { length: 255 }),
  /** Full street address */
  address: varchar("address", { length: 500 }),
  /** City */
  city: varchar("city", { length: 100 }).notNull(),
  /** State (2-letter code) */
  state: varchar("state", { length: 2 }).notNull(),
  /** ZIP code */
  zipCode: varchar("zipCode", { length: 10 }),
  /** Start date (stored as UTC timestamp in ms) */
  startDate: bigint("startDate", { mode: "number" }).notNull(),
  /** End date (stored as UTC timestamp in ms, same as start for single-day) */
  endDate: bigint("endDate", { mode: "number" }).notNull(),
  /** Hours of operation (e.g., "Sat 9am-4pm; Sun 10am-3pm") */
  hours: varchar("hours", { length: 255 }),
  /** Number of dealer tables */
  tableCount: int("tableCount"),
  /** Admission price description (e.g., "FREE", "$5", "EA $15; GA $10") */
  admission: varchar("admission", { length: 100 }),
  /** Additional description/notes */
  description: text("description"),
  /** Whether this is a recurring show */
  isRecurring: boolean("isRecurring").notNull().default(false),
  /** Recurrence description (e.g., "First Sunday of every month") */
  recurrenceNote: varchar("recurrenceNote", { length: 255 }),
  /** Review status */
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).notNull().default("pending"),
  /** Admin notes */
  adminNotes: text("adminNotes"),
  /** User ID if submitted by logged-in user */
  submittedByUserId: int("submittedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ShowSubmission = typeof showSubmissions.$inferSelect;
export type InsertShowSubmission = typeof showSubmissions.$inferInsert;
