import { eq } from "drizzle-orm";

import { db } from "../db/db.js";
import { prompts } from "../db/schema/prompts.schema.js";

type DbExecutor = typeof db;

export class PromptRepository {
  constructor(private readonly database: DbExecutor = db) {}

  async findById(promptId: string) {
    const result = await this.database
      .select()
      .from(prompts)
      .where(eq(prompts.id, promptId))
      .limit(1);

    return result[0] ?? null;
  }

  async create(data: typeof prompts.$inferInsert) {
    const result = await this.database
      .insert(prompts)
      .values(data)
      .returning();

    return result[0];
  }

  async update(
    promptId: string,
    data: Partial<typeof prompts.$inferInsert>,
  ) {
    const result = await this.database
      .update(prompts)
      .set(data)
      .where(eq(prompts.id, promptId))
      .returning();

    return result[0] ?? null;
  }
}

export const promptRepository = new PromptRepository();