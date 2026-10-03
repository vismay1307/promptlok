import { asc } from "drizzle-orm";
import { db } from "../db/db.js";
import { promptCategories } from "../db/schema/categories.schema.js";

export class CategoryRepository {
  async getAllCategories() {
    return await db
      .select()
      .from(promptCategories)
      .orderBy(asc(promptCategories.name));
  }
}