import { eq, desc, asc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  repackProducts, InsertRepackProduct, RepackProduct,
  checklistItems, InsertChecklistItem, ChecklistItem,
  pulls, InsertPull, Pull,
  shows, InsertShow, Show,
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

export async function getActiveProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(repackProducts)
    .where(eq(repackProducts.status, "active"))
    .orderBy(asc(repackProducts.sortOrder));
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(repackProducts).where(eq(repackProducts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
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
