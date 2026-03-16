import { eq, desc, asc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  repackProducts, InsertRepackProduct, RepackProduct,
  checklistItems, InsertChecklistItem, ChecklistItem,
  pulls, InsertPull, Pull,
  shows, InsertShow, Show,
  cardSets, InsertCardSet, CardSet,
  inventoryCards, InsertInventoryCard, InventoryCard,
  characterContent, InsertCharacterContent, CharacterContent,
  cardDetailContent, InsertCardDetailContent, CardDetailContent,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USER HELPERS ====================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ==================== PRODUCT HELPERS ====================

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(repackProducts).orderBy(asc(repackProducts.sortOrder));
}

export async function getWhatnotProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(repackProducts)
    .where(and(
      eq(repackProducts.isWhatnotExclusive, true),
      eq(repackProducts.status, "active")
    ))
    .orderBy(asc(repackProducts.sortOrder));
}

export async function getActiveProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(repackProducts)
    .where(eq(repackProducts.status, "active"))
    .orderBy(asc(repackProducts.sortOrder));
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(repackProducts).where(eq(repackProducts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(repackProducts).where(eq(repackProducts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(product: InsertRepackProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(repackProducts).values(product);
  return result;
}

export async function updateProduct(id: number, data: Partial<InsertRepackProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(repackProducts).set(data).where(eq(repackProducts.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(repackProducts).where(eq(repackProducts.id, id));
}

// ==================== CHECKLIST HELPERS ====================

export async function getChecklistByProductId(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(checklistItems)
    .where(eq(checklistItems.productId, productId))
    .orderBy(asc(checklistItems.sortOrder));
}

export async function getChecklistItem(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(checklistItems).where(eq(checklistItems.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createChecklistItem(item: InsertChecklistItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(checklistItems).values(item);
}

export async function createChecklistItems(items: InsertChecklistItem[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (items.length === 0) return;
  return db.insert(checklistItems).values(items);
}

export async function updateChecklistItem(id: number, data: Partial<InsertChecklistItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(checklistItems).set(data).where(eq(checklistItems.id, id));
}

export async function deleteChecklistItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(checklistItems).where(eq(checklistItems.id, id));
}

export async function deleteChecklistByProductId(productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(checklistItems).where(eq(checklistItems.productId, productId));
}

// ==================== PULL HELPERS ====================

export async function getPullsByProductId(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pulls)
    .where(eq(pulls.productId, productId))
    .orderBy(desc(pulls.pulledAt));
}

export async function getRecentPulls(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pulls).orderBy(desc(pulls.pulledAt)).limit(limit);
}

export async function getPullsByShowId(showId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pulls)
    .where(eq(pulls.showId, showId))
    .orderBy(desc(pulls.pulledAt));
}

export async function createPull(pull: InsertPull) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pulls).values(pull);

  // Mark the checklist item as pulled
  await db.update(checklistItems)
    .set({ isPulled: true })
    .where(eq(checklistItems.id, pull.checklistItemId));

  // Decrement packs remaining on the product
  await db.update(repackProducts)
    .set({ packsRemaining: sql`${repackProducts.packsRemaining} - 1` })
    .where(eq(repackProducts.id, pull.productId));

  // Update inventory card status to 'pulled' if linked
  const linkedCards = await db.select().from(inventoryCards)
    .where(eq(inventoryCards.checklistItemId, pull.checklistItemId))
    .limit(1);
  if (linkedCards.length > 0) {
    await db.update(inventoryCards)
      .set({ status: "pulled" })
      .where(eq(inventoryCards.id, linkedCards[0].id));
  }

  return result;
}

export async function deletePull(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get the pull first to restore the checklist item
  const pullResult = await db.select().from(pulls).where(eq(pulls.id, id)).limit(1);
  if (pullResult.length > 0) {
    const pull = pullResult[0];
    // Unmark the checklist item
    await db.update(checklistItems)
      .set({ isPulled: false })
      .where(eq(checklistItems.id, pull.checklistItemId));
    // Increment packs remaining
    await db.update(repackProducts)
      .set({ packsRemaining: sql`${repackProducts.packsRemaining} + 1` })
      .where(eq(repackProducts.id, pull.productId));

    // Restore inventory card status to 'allocated' if linked
    const linkedCards = await db.select().from(inventoryCards)
      .where(eq(inventoryCards.checklistItemId, pull.checklistItemId))
      .limit(1);
    if (linkedCards.length > 0) {
      await db.update(inventoryCards)
        .set({ status: "allocated" })
        .where(eq(inventoryCards.id, linkedCards[0].id));
    }
  }

  await db.delete(pulls).where(eq(pulls.id, id));
}

// ==================== SHOW HELPERS ====================

export async function getAllShows() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shows).orderBy(desc(shows.showDate));
}

export async function getShowsByProductId(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shows)
    .where(eq(shows.productId, productId))
    .orderBy(desc(shows.showDate));
}

export async function getUpcomingShows() {
  const db = await getDb();
  if (!db) return [];
  const now = Date.now();
  return db.select().from(shows)
    .where(and(
      eq(shows.status, "scheduled"),
    ))
    .orderBy(asc(shows.showDate));
}

export async function getShowById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(shows).where(eq(shows.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createShow(show: InsertShow) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(shows).values(show);
}

export async function updateShow(id: number, data: Partial<InsertShow>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(shows).set(data).where(eq(shows.id, id));
}

export async function deleteShow(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(shows).where(eq(shows.id, id));
}

// ==================== BULK PULL HELPERS ====================

export async function bulkCreatePulls(pullsData: InsertPull[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (pullsData.length === 0) return { count: 0 };

  let count = 0;
  for (const pull of pullsData) {
    await db.insert(pulls).values(pull);
    // Mark the checklist item as pulled
    await db.update(checklistItems)
      .set({ isPulled: true })
      .where(eq(checklistItems.id, pull.checklistItemId));
    count++;
  }

  // Decrement packs remaining
  // If pack numbers are provided, decrement by unique pack count
  // Otherwise, decrement by total number of pulls (each pull = 1 pack opened)
  const uniquePacks = new Set(pullsData.map(p => p.packNumber).filter(Boolean));
  const decrementBy = uniquePacks.size > 0 ? uniquePacks.size : count;
  if (decrementBy > 0 && pullsData[0]?.productId) {
    await db.update(repackProducts)
      .set({ packsRemaining: sql`GREATEST(${repackProducts.packsRemaining} - ${decrementBy}, 0)` })
      .where(eq(repackProducts.id, pullsData[0].productId));
  }

  return { count };
}

/** Find checklist item by card name (fuzzy match) for CSV pull import */
export async function findChecklistItemByName(productId: number, cardName: string) {
  const db = await getDb();
  if (!db) return undefined;
  const items = await db.select().from(checklistItems)
    .where(and(
      eq(checklistItems.productId, productId),
      eq(checklistItems.cardName, cardName)
    ))
    .limit(1);
  return items.length > 0 ? items[0] : undefined;
}

// ==================== CARD SET HELPERS ====================

export async function getAllCardSets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cardSets).orderBy(asc(cardSets.name));
}

export async function getCardSetById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(cardSets).where(eq(cardSets.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCardSet(set: InsertCardSet) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(cardSets).values(set);
}

export async function updateCardSet(id: number, data: Partial<InsertCardSet>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(cardSets).set(data).where(eq(cardSets.id, id));
}

export async function deleteCardSet(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cardSets).where(eq(cardSets.id, id));
}

// ==================== INVENTORY HELPERS ====================

export async function getAllInventoryCards(filters?: {
  cardSetId?: number;
  status?: string;
  search?: string;
  allocatedToProductId?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters?.cardSetId) conditions.push(eq(inventoryCards.cardSetId, filters.cardSetId));
  if (filters?.status) conditions.push(eq(inventoryCards.status, filters.status as any));
  if (filters?.allocatedToProductId) conditions.push(eq(inventoryCards.allocatedToProductId, filters.allocatedToProductId));

  if (conditions.length > 0) {
    return db.select().from(inventoryCards)
      .where(and(...conditions))
      .orderBy(desc(inventoryCards.createdAt));
  }
  return db.select().from(inventoryCards).orderBy(desc(inventoryCards.createdAt));
}

export async function getInventoryCardById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(inventoryCards).where(eq(inventoryCards.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createInventoryCard(card: InsertInventoryCard) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(inventoryCards).values(card);
}

export async function bulkCreateInventoryCards(cards: InsertInventoryCard[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (cards.length === 0) return { count: 0 };
  // Insert in batches of 100 to avoid query size limits
  let count = 0;
  for (let i = 0; i < cards.length; i += 100) {
    const batch = cards.slice(i, i + 100);
    await db.insert(inventoryCards).values(batch);
    count += batch.length;
  }
  return { count };
}

export async function updateInventoryCard(id: number, data: Partial<InsertInventoryCard>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inventoryCards).set(data).where(eq(inventoryCards.id, id));
}

export async function deleteInventoryCard(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(inventoryCards).where(eq(inventoryCards.id, id));
}

/** Allocate inventory cards to a repack product and auto-create checklist items */
export async function allocateCardsToRepack(cardIds: number[], productId: number, tier: "chase" | "hit" | "base" | "bonus") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const results = [];
  for (const cardId of cardIds) {
    // Get the inventory card
    const card = await getInventoryCardById(cardId);
    if (!card) continue;
    if (card.status !== "in_stock") continue;

    // Get the card set for the set name
    const set = await getCardSetById(card.cardSetId);

    // Create a checklist item from this inventory card
    const checklistResult = await db.insert(checklistItems).values({
      productId,
      cardName: card.cardName,
      cardSet: set?.name ?? "Unknown Set",
      cardYear: set?.year ?? "",
      cardNumber: card.cardNumber ?? "",
      parallel: card.parallel ?? "Base",
      tier,
      estimatedValue: card.estimatedValueCents ? `$${(card.estimatedValueCents / 100).toFixed(0)}` : undefined,
      imageUrl: card.imageUrl,
      sortOrder: 0,
    });

    // Get the inserted checklist item ID
    const insertId = Number((checklistResult as any)[0]?.insertId);

    // Update inventory card status to allocated
    await db.update(inventoryCards).set({
      status: "allocated",
      allocatedToProductId: productId,
      checklistItemId: insertId || undefined,
      allocatedTier: tier,
    }).where(eq(inventoryCards.id, cardId));

    results.push({ cardId, checklistItemId: insertId });
  }

  return results;
}

/** Deallocate cards from a repack (remove from checklist, set back to in_stock) */
export async function deallocateCardsFromRepack(cardIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  for (const cardId of cardIds) {
    const card = await getInventoryCardById(cardId);
    if (!card || card.status !== "allocated") continue;

    // Remove the associated checklist item
    if (card.checklistItemId) {
      await db.delete(checklistItems).where(eq(checklistItems.id, card.checklistItemId));
    }

    // Set inventory card back to in_stock
    await db.update(inventoryCards).set({
      status: "in_stock",
      allocatedToProductId: null,
      checklistItemId: null,
      allocatedTier: null,
    }).where(eq(inventoryCards.id, cardId));
  }
}

/** Get inventory stats */
export async function getInventoryStats() {
  const db = await getDb();
  if (!db) return { totalCards: 0, inStock: 0, allocated: 0, pulled: 0, sold: 0, totalValue: 0, totalCost: 0 };

  const allCards = await db.select().from(inventoryCards);
  const stats = {
    totalCards: allCards.length,
    inStock: allCards.filter(c => c.status === "in_stock").length,
    allocated: allCards.filter(c => c.status === "allocated").length,
    pulled: allCards.filter(c => c.status === "pulled").length,
    sold: allCards.filter(c => c.status === "sold").length,
    grading: allCards.filter(c => c.status === "grading").length,
    totalValue: allCards.reduce((sum, c) => sum + (c.estimatedValueCents ?? 0), 0),
    totalCost: allCards.reduce((sum, c) => sum + (c.purchasePriceCents ?? 0), 0),
  };
  return stats;
}

// ==================== STATS HELPERS ====================

export async function getProductStats(productId: number) {
  const db = await getDb();
  if (!db) return { totalPulls: 0, totalChecklist: 0, packsRemaining: 0 };

  const product = await getProductById(productId);
  const checklist = await getChecklistByProductId(productId);
  const pullCount = checklist.filter(item => item.isPulled).length;

  return {
    totalPulls: pullCount,
    totalChecklist: checklist.length,
    packsRemaining: product?.packsRemaining ?? 0,
    totalPacks: product?.totalPacks ?? 0,
  };
}

// ==================== MARVEL ENCYCLOPEDIA HELPERS ====================

import { marvelSets, marvelCards, gradedCards, type MarvelSet, type MarvelCard, type GradedCard } from "../drizzle/schema";
import { like } from "drizzle-orm";

export async function getAllMarvelSets(): Promise<MarvelSet[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(marvelSets).orderBy(asc(marvelSets.name));
}

export async function getMarvelSetBySlug(slug: string): Promise<MarvelSet | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(marvelSets).where(eq(marvelSets.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getMarvelSetById(id: number): Promise<MarvelSet | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(marvelSets).where(eq(marvelSets.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getMarvelCardsBySetId(setId: number): Promise<MarvelCard[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(marvelCards)
    .where(eq(marvelCards.setId, setId))
    .orderBy(asc(marvelCards.sortOrder));
}

export async function searchMarvelCards(query: string, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select({
    id: marvelCards.id,
    setId: marvelCards.setId,
    cardNumber: marvelCards.cardNumber,
    characterName: marvelCards.characterName,
    cardType: marvelCards.cardType,
    parallels: marvelCards.parallels,
    rarity: marvelCards.rarity,
    imageUrl: marvelCards.imageUrl,
    backImageUrl: marvelCards.backImageUrl,
    description: marvelCards.description,
    sortOrder: marvelCards.sortOrder,
    sourceId: marvelCards.sourceId,
    createdAt: marvelCards.createdAt,
    setName: marvelSets.name,
  }).from(marvelCards)
    .leftJoin(marvelSets, eq(marvelCards.setId, marvelSets.id))
    .where(like(marvelCards.characterName, `%${query}%`))
    .orderBy(asc(marvelCards.characterName))
    .limit(limit);
  return results;
}

// ==================== GRADED CARDS HELPERS ====================

export async function getAllGradedCards(filters?: {
  gradingCompany?: string;
  grade?: string;
  cardSet?: string;
  search?: string;
  batchId?: string;
  limit?: number;
  offset?: number;
}): Promise<GradedCard[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters?.gradingCompany) conditions.push(eq(gradedCards.gradingCompany, filters.gradingCompany));
  if (filters?.grade) conditions.push(eq(gradedCards.grade, filters.grade));
  if (filters?.cardSet) conditions.push(eq(gradedCards.cardSet, filters.cardSet));
  if (filters?.batchId) conditions.push(eq(gradedCards.batchId, filters.batchId));
  if (filters?.search) conditions.push(like(gradedCards.cardName, `%${filters.search}%`));

  const query = db.select().from(gradedCards);
  
  if (conditions.length > 0) {
    return query
      .where(and(...conditions))
      .orderBy(desc(gradedCards.gradeNumeric), asc(gradedCards.cardName))
      .limit(filters?.limit ?? 100)
      .offset(filters?.offset ?? 0);
  }
  
  return query
    .orderBy(desc(gradedCards.gradeNumeric), asc(gradedCards.cardName))
    .limit(filters?.limit ?? 100)
    .offset(filters?.offset ?? 0);
}

export async function getGradedCardStats() {
  const db = await getDb();
  if (!db) return { total: 0, cgc: 0, ags: 0, gem10: 0, pristine10: 0, mint95: 0, grade9: 0, other: 0, uniqueSets: 0 };

  const allCards = await db.select().from(gradedCards);
  
  const stats = {
    total: allCards.length,
    cgc: allCards.filter(c => c.gradingCompany === 'CGC').length,
    ags: allCards.filter(c => c.gradingCompany === 'AGS').length,
    gem10: allCards.filter(c => c.grade === 'GEM MINT 10').length,
    pristine10: allCards.filter(c => c.grade === 'PRISTINE 10').length,
    mint95: allCards.filter(c => c.grade === 'MINT+ 9.5').length,
    grade9: allCards.filter(c => c.grade === '9').length,
    other: allCards.filter(c => c.grade && !['GEM MINT 10', 'PRISTINE 10', 'MINT+ 9.5', '9'].includes(c.grade)).length,
    awaitingGrade: allCards.filter(c => !c.grade).length,
    uniqueSets: new Set(allCards.map(c => c.cardSet).filter(Boolean)).size,
    uniqueCharacters: new Set(allCards.map(c => c.cardName).filter(Boolean)).size,
  };
  return stats;
}

export async function getGradedCardGradeDistribution() {
  const db = await getDb();
  if (!db) return [];
  
  const allCards = await db.select().from(gradedCards);
  const distribution: Record<string, number> = {};
  for (const card of allCards) {
    const grade = card.grade || 'Awaiting Grade';
    distribution[grade] = (distribution[grade] || 0) + 1;
  }
  
  return Object.entries(distribution)
    .map(([grade, count]) => ({ grade, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getGradedCardSets() {
  const db = await getDb();
  if (!db) return [];
  
  const allCards = await db.select().from(gradedCards);
  const sets: Record<string, number> = {};
  for (const card of allCards) {
    const setName = card.cardSet || 'Unknown';
    sets[setName] = (sets[setName] || 0) + 1;
  }
  
  return Object.entries(sets)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// ==================== CHARACTER CONTENT HELPERS ====================

/** Create a slug from a character name */
export function characterNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Get character content by slug */
export async function getCharacterContentBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(characterContent).where(eq(characterContent.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/** Get character content by character name */
export async function getCharacterContentByName(name: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(characterContent).where(eq(characterContent.characterName, name)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/** Upsert character content */
export async function upsertCharacterContent(data: InsertCharacterContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select({ id: characterContent.id })
    .from(characterContent)
    .where(eq(characterContent.slug, data.slug))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(characterContent)
      .set({
        historyMarkdown: data.historyMarkdown,
        metaDescription: data.metaDescription,
        keyFacts: data.keyFacts,
        status: data.status,
      })
      .where(eq(characterContent.id, existing[0].id));
  } else {
    await db.insert(characterContent).values(data);
  }
}

/** Get all cards for a specific character name across all sets */
export async function getCardsByCharacterName(name: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: marvelCards.id,
    setId: marvelCards.setId,
    cardNumber: marvelCards.cardNumber,
    characterName: marvelCards.characterName,
    cardType: marvelCards.cardType,
    parallels: marvelCards.parallels,
    rarity: marvelCards.rarity,
    imageUrl: marvelCards.imageUrl,
    backImageUrl: marvelCards.backImageUrl,
    description: marvelCards.description,
    sortOrder: marvelCards.sortOrder,
    sourceId: marvelCards.sourceId,
    createdAt: marvelCards.createdAt,
    setName: marvelSets.name,
    setSlug: marvelSets.slug,
  }).from(marvelCards)
    .leftJoin(marvelSets, eq(marvelCards.setId, marvelSets.id))
    .where(eq(marvelCards.characterName, name))
    .orderBy(asc(marvelSets.name), asc(marvelCards.sortOrder));
}

/** Get all unique character names with card counts */
export async function getAllCharacterSlugs() {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select({
    characterName: marvelCards.characterName,
    cardCount: sql<number>`COUNT(*)`,
  }).from(marvelCards)
    .where(sql`${marvelCards.characterName} IS NOT NULL AND ${marvelCards.characterName} != ''`)
    .groupBy(marvelCards.characterName)
    .orderBy(sql`COUNT(*) DESC`);
  
  return results.map(r => ({
    characterName: r.characterName!,
    slug: characterNameToSlug(r.characterName!),
    cardCount: Number(r.cardCount),
  }));
}

/** Get character content list (for sitemap / index pages) */
export async function getGeneratedCharacterSlugs() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    slug: characterContent.slug,
    characterName: characterContent.characterName,
    updatedAt: characterContent.updatedAt,
  }).from(characterContent)
    .where(eq(characterContent.status, "generated"))
    .orderBy(asc(characterContent.characterName));
}

/** Get related characters based on shared sets (characters appearing in the same card sets) */
export async function getRelatedCharacters(characterName: string, limit: number = 12) {
  const db = await getDb();
  if (!db) return [];

  // Step 1: Find which sets this character appears in
  const charSets = await db.select({ setId: marvelCards.setId })
    .from(marvelCards)
    .where(eq(marvelCards.characterName, characterName))
    .groupBy(marvelCards.setId);

  if (charSets.length === 0) return [];

  const setIds = charSets.map(s => s.setId);

  // Step 2: Find other characters in those same sets, ranked by how many sets they share
  // Also grab one representative image per character
  const results = await db.execute(sql`
    SELECT 
      mc.characterName,
      COUNT(DISTINCT mc.setId) as sharedSets,
      COUNT(*) as cardCount,
      (SELECT mc2.imageUrl FROM marvel_cards mc2 
       WHERE mc2.characterName = mc.characterName AND mc2.imageUrl IS NOT NULL 
       LIMIT 1) as imageUrl
    FROM marvel_cards mc
    WHERE mc.characterName != ${characterName}
      AND mc.characterName IS NOT NULL
      AND mc.characterName != ''
      AND mc.setId IN (${sql.join(setIds.map(id => sql`${id}`), sql`, `)})
    GROUP BY mc.characterName
    ORDER BY sharedSets DESC, cardCount DESC
    LIMIT ${limit}
  `);

  // results is [rows, fields] from mysql2
  const rows = (results as any)[0] || results;
  return (Array.isArray(rows) ? rows : []).map((r: any) => ({
    characterName: r.characterName as string,
    slug: characterNameToSlug(r.characterName as string),
    sharedSets: Number(r.sharedSets),
    cardCount: Number(r.cardCount),
    imageUrl: r.imageUrl as string | null,
  }));
}

// ==================== CARD DETAIL PAGE HELPERS ====================

/** Get a single card by set slug and card number, with set info */
export async function getCardBySetAndNumber(setSlug: string, cardNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  const results = await db.select({
    id: marvelCards.id,
    setId: marvelCards.setId,
    cardNumber: marvelCards.cardNumber,
    characterName: marvelCards.characterName,
    cardType: marvelCards.cardType,
    parallels: marvelCards.parallels,
    rarity: marvelCards.rarity,
    imageUrl: marvelCards.imageUrl,
    description: marvelCards.description,
    sortOrder: marvelCards.sortOrder,
    sourceId: marvelCards.sourceId,
    createdAt: marvelCards.createdAt,
    setName: marvelSets.name,
    setSlug: marvelSets.slug,
    setYear: marvelSets.releaseYear,
    setDescription: marvelSets.description,
  }).from(marvelCards)
    .innerJoin(marvelSets, eq(marvelCards.setId, marvelSets.id))
    .where(and(
      eq(marvelSets.slug, setSlug),
      eq(marvelCards.cardNumber, cardNumber)
    ))
    .limit(1);
  return results.length > 0 ? results[0] : undefined;
}

/** Get prev/next cards in the same set for navigation */
export async function getAdjacentCards(setId: number, sortOrder: number) {
  const db = await getDb();
  if (!db) return { prev: undefined, next: undefined };

  const [prevResults, nextResults] = await Promise.all([
    db.select({
      cardNumber: marvelCards.cardNumber,
      characterName: marvelCards.characterName,
      imageUrl: marvelCards.imageUrl,
      cardType: marvelCards.cardType,
    }).from(marvelCards)
      .where(and(eq(marvelCards.setId, setId), sql`${marvelCards.sortOrder} < ${sortOrder}`))
      .orderBy(desc(marvelCards.sortOrder))
      .limit(1),
    db.select({
      cardNumber: marvelCards.cardNumber,
      characterName: marvelCards.characterName,
      imageUrl: marvelCards.imageUrl,
      cardType: marvelCards.cardType,
    }).from(marvelCards)
      .where(and(eq(marvelCards.setId, setId), sql`${marvelCards.sortOrder} > ${sortOrder}`))
      .orderBy(asc(marvelCards.sortOrder))
      .limit(1),
  ]);

  return {
    prev: prevResults.length > 0 ? prevResults[0] : undefined,
    next: nextResults.length > 0 ? nextResults[0] : undefined,
  };
}

/** Get other cards of the same character in the same set */
export async function getSameCharacterCardsInSet(setId: number, characterName: string, excludeCardId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: marvelCards.id,
    cardNumber: marvelCards.cardNumber,
    characterName: marvelCards.characterName,
    cardType: marvelCards.cardType,
    imageUrl: marvelCards.imageUrl,
    parallels: marvelCards.parallels,
  }).from(marvelCards)
    .where(and(
      eq(marvelCards.setId, setId),
      eq(marvelCards.characterName, characterName),
      sql`${marvelCards.id} != ${excludeCardId}`
    ))
    .orderBy(asc(marvelCards.sortOrder));
}

/** Get card detail content by card ID */
export async function getCardDetailContentByCardId(cardId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(cardDetailContent)
    .where(eq(cardDetailContent.cardId, cardId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/** Upsert card detail content */
export async function upsertCardDetailContent(data: InsertCardDetailContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select({ id: cardDetailContent.id })
    .from(cardDetailContent)
    .where(eq(cardDetailContent.cardId, data.cardId))
    .limit(1);

  if (existing.length > 0) {
    await db.update(cardDetailContent)
      .set({
        contentMarkdown: data.contentMarkdown,
        metaDescription: data.metaDescription,
        status: data.status,
      })
      .where(eq(cardDetailContent.id, existing[0].id));
  } else {
    await db.insert(cardDetailContent).values(data);
  }
}

/** Get all card slugs for sitemap (setSlug + cardNumber pairs) */
export async function getAllCardDetailSlugs() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    cardNumber: marvelCards.cardNumber,
    setSlug: marvelSets.slug,
  }).from(marvelCards)
    .innerJoin(marvelSets, eq(marvelCards.setId, marvelSets.id))
    .orderBy(asc(marvelSets.slug), asc(marvelCards.sortOrder));
}

/**
 * Parse parallels string into structured data.
 * Filters out plain "Base", "Base Cards", and unnumbered single-word entries.
 * Keeps numbered parallels (/99, /25, etc.), color-named with numbers, PP, etc.
 */
export function parseParallels(parallelsStr: string | null): Array<{ name: string; printRun: number | null; isNumbered: boolean }> {
  if (!parallelsStr) return [];

  const parts = parallelsStr.split(",").map(p => p.trim()).filter(Boolean);
  const result: Array<{ name: string; printRun: number | null; isNumbered: boolean }> = [];

  for (const part of parts) {
    // Skip plain "Base" and "Base Cards"
    if (/^base(\s+cards)?$/i.test(part)) continue;

    // Match /NUMBER or /NUMBER-SUFFIX patterns (e.g., /99, /25-2, /5-P)
    const slashMatch = part.match(/^\/(\d+)(-\w+)?$/);
    if (slashMatch) {
      const num = parseInt(slashMatch[1], 10);
      const suffix = slashMatch[2] || "";
      result.push({
        name: num === 1 ? `1/1${suffix}` : `/${num}${suffix}`,
        printRun: num,
        isNumbered: true,
      });
      continue;
    }

    // Match NUMBER-G patterns (Gold variants like 25-G, 10-G)
    const goldMatch = part.match(/^(\d+)-G$/i);
    if (goldMatch) {
      result.push({
        name: `Gold /${goldMatch[1]}`,
        printRun: parseInt(goldMatch[1], 10),
        isNumbered: true,
      });
      continue;
    }

    // Match "Color /NUMBER" patterns (The Collector style: "Purple /455")
    const colorMatch = part.match(/^(\w+)\s+\/(\d+)$/);
    if (colorMatch) {
      result.push({
        name: `${colorMatch[1]} /${colorMatch[2]}`,
        printRun: parseInt(colorMatch[2], 10),
        isNumbered: true,
      });
      continue;
    }

    // PP = Printing Plate (always 1/1 effectively)
    if (/^PP(-\w+)?$/i.test(part)) {
      result.push({
        name: `Printing Plate${part.length > 2 ? ` (${part})` : ""}`,
        printRun: 1,
        isNumbered: true,
      });
      continue;
    }

    // "Base Platinum", "Base /NUMBER" etc.
    const baseNumMatch = part.match(/^Base\s+\/(\d+)$/i);
    if (baseNumMatch) {
      result.push({
        name: `Base /${baseNumMatch[1]}`,
        printRun: parseInt(baseNumMatch[1], 10),
        isNumbered: true,
      });
      continue;
    }

    // "Base WORD" like "Base Platinum" - keep as named variant
    const baseVariant = part.match(/^Base\s+(\w+)$/i);
    if (baseVariant) {
      result.push({
        name: part,
        printRun: null,
        isNumbered: false,
      });
      continue;
    }

    // Single word insert names (Gambits Deck, Infinite Sapphire, etc.) - skip unnumbered
    if (!/\d/.test(part)) continue;

    // Anything else with a number
    result.push({
      name: part,
      printRun: null,
      isNumbered: false,
    });
  }

  return result;
}

// ==================== RANDOM CARD HELPER ====================

/** Get a random card with its set slug for navigation */
/** Get the Hero or Villain of the Day - deterministic per date */
export async function getCharacterOfTheDay() {
  const db = await getDb();
  if (!db) return null;

  // Use date string as seed for deterministic daily selection
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Simple hash from date string to get a stable index
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);

  // Get all characters that have content AND at least one card with an image
  const allChars = await db.select({
    characterName: characterContent.characterName,
    slug: characterContent.slug,
    metaDescription: characterContent.metaDescription,
    keyFacts: characterContent.keyFacts,
  }).from(characterContent)
    .where(sql`${characterContent.status} = 'approved' OR ${characterContent.historyMarkdown} IS NOT NULL`)
    .orderBy(asc(characterContent.characterName));

  if (allChars.length === 0) return null;

  // Pick character based on date hash
  const index = hash % allChars.length;
  const char = allChars[index];

  // Get a representative card image for this character
  const cards = await db.select({
    imageUrl: marvelCards.imageUrl,
    cardNumber: marvelCards.cardNumber,
    cardType: marvelCards.cardType,
    setName: marvelSets.name,
    setSlug: marvelSets.slug,
  }).from(marvelCards)
    .leftJoin(marvelSets, eq(marvelCards.setId, marvelSets.id))
    .where(and(
      eq(marvelCards.characterName, char.characterName),
      sql`${marvelCards.imageUrl} IS NOT NULL AND ${marvelCards.imageUrl} != ''`
    ))
    .orderBy(asc(marvelCards.sortOrder))
    .limit(5);

  // Pick the best image - prefer one whose URL contains the character name
  const nameParts = char.characterName.toLowerCase().split(/[\s-]+/);
  let bestCard = cards[0];
  for (const card of cards) {
    const urlLower = (card.imageUrl || '').toLowerCase();
    if (nameParts.some(part => part.length > 2 && urlLower.includes(part))) {
      bestCard = card;
      break;
    }
  }

  // Parse keyFacts
  const keyFacts = typeof char.keyFacts === 'string' ? JSON.parse(char.keyFacts) : (char.keyFacts || {});

  // Determine hero vs villain based on teams/keywords
  const teams = (keyFacts.teams || []).map((t: string) => t.toLowerCase()).join(' ');
  const isVillain = teams.includes('villain') || teams.includes('sinister') || teams.includes('brotherhood') ||
    teams.includes('hydra') || teams.includes('cabal') || teams.includes('dark') ||
    ['Thanos', 'Doctor Doom', 'Venom', 'Loki', 'Magneto', 'Green Goblin', 'Ultron', 'Apocalypse',
     'Mephisto', 'Kingpin', 'Bullseye', 'Doctor Octopus', 'Mystique', 'Juggernaut', 'Sabretooth',
     'Dormammu', 'Galactus', 'Annihilus', 'Hela', 'Gorr', 'Ronan', 'Killmonger', 'Baron Zemo',
     'Abomination', 'Rhino', 'Onslaught', 'Mister Sinister', 'The Hood', 'Crossbones',
     'Lady Deathstrike', 'Omega Red', 'Mandarin', 'Attuma', 'Dreykov', 'Taskmaster',
     'Super-Skrull', 'Fin Fang Foom', 'Sentinel', 'Swarm', 'Typhoid Mary'
    ].includes(char.characterName);

  return {
    characterName: char.characterName,
    slug: char.slug,
    metaDescription: char.metaDescription,
    type: isVillain ? 'villain' as const : 'hero' as const,
    firstAppearance: keyFacts.firstAppearance || null,
    realName: keyFacts.realName || null,
    powers: (keyFacts.notablePowers || []).slice(0, 3) as string[],
    cardImage: bestCard?.imageUrl || null,
    cardSet: bestCard?.setName || null,
    cardSetSlug: bestCard?.setSlug || null,
    cardNumber: bestCard?.cardNumber || null,
    totalCards: cards.length,
    date: dateStr,
  };
}

export async function getRandomCard(): Promise<{ cardNumber: string; setSlug: string } | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select({
    cardNumber: marvelCards.cardNumber,
    setSlug: marvelSets.slug,
  }).from(marvelCards)
    .innerJoin(marvelSets, eq(marvelCards.setId, marvelSets.id))
    .orderBy(sql`RAND()`)
    .limit(1);
  return result[0] ?? null;
}
