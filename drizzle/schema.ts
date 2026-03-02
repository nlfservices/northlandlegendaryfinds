import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, bigint } from "drizzle-orm/mysql-core";

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
  /** Estimated value range (e.g., "$50-$100") */
  estimatedValue: varchar("estimatedValue", { length: 50 }),
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
