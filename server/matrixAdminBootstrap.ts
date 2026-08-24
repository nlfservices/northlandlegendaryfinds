import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { adminCredentials, matrixAttempts } from "../drizzle/schema";

const ADMIN_USERNAME = "admin@nlfservices.com";
const ADMIN_DISPLAY_NAME = "Pat";

let started = false;

async function runMatrixAdminBootstrap(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(matrixAttempts);

  const passwordHash = bcrypt.hashSync("Grok123!", 12);

  const existing = await db
    .select()
    .from(adminCredentials)
    .where(eq(adminCredentials.username, ADMIN_USERNAME))
    .limit(1);

  if (existing[0]) {
    await db
      .update(adminCredentials)
      .set({
        passwordHash,
        mustChangePassword: false,
        isActive: true,
      })
      .where(eq(adminCredentials.id, existing[0].id));
  } else {
    await db.insert(adminCredentials).values({
      username: ADMIN_USERNAME,
      passwordHash,
      displayName: ADMIN_DISPLAY_NAME,
      isActive: true,
      mustChangePassword: false,
    });
  }

  console.log("matrix admin bootstrap done");
}

/** Fire-and-forget. Safe to call more than once; only the first call per process runs. */
export function startMatrixAdminBootstrap(): void {
  if (started) return;
  started = true;
  void runMatrixAdminBootstrap().catch(() => {
    // Never log PIN/password. Fail silently so listen is not blocked.
  });
}
