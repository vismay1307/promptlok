import { asc, eq, ilike } from "drizzle-orm";
import { db } from "../db/db.js";
import { tags } from "../db/schema/tags.schema.js";

const TAG_RESULT_LIMIT = 50;

export class TagRepository {
  async searchTags(query?: string) {
    if (!query) {
      return await db
        .select()
        .from(tags)
        .orderBy(asc(tags.name))
        .limit(TAG_RESULT_LIMIT);
    }

    return await db
      .select()
      .from(tags)
      .where(ilike(tags.name, `%${query}%`))
      .orderBy(asc(tags.name))
      .limit(TAG_RESULT_LIMIT);
  }

  async findByName(name: string) {
    const result = await db
      .select()
      .from(tags)
      .where(eq(tags.name, name))
      .limit(1);

    return result[0] ?? null;
  }

  async create(name: string) {
    const result = await db
      .insert(tags)
      .values({
        name,
      })
      .returning();

    return result[0];
  }
}