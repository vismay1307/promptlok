import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { users } from "../db/schema/users.schema.js";

export const findUserByClerkUserId = async (clerkUserId: string) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);
  return result[0] ?? null;
};
 
export const createUser = async (data: typeof users.$inferInsert) => {
  const result = await db.insert(users).values(data).returning();
  return result[0] ?? null;
};
