import { and, eq } from "drizzle-orm";

import { db } from "../db/db.js";
import { promptTags } from "../db/schema/prompt-tags.js";

type DbExecutor = typeof db;

export class PromptTagRepository {
  constructor(private readonly database: DbExecutor = db) {}

  async findByPromptId(promptId: string) {
    return this.database
      .select()
      .from(promptTags)
      .where(eq(promptTags.promptId, promptId));
  }

  async attach(promptId: string, tagId: string) {
    const result = await this.database
      .insert(promptTags)
      .values({
        promptId,
        tagId,
      })
      .returning();

    return result[0];
  }

  async remove(promptId: string, tagId: string) {
    const result = await this.database
      .delete(promptTags)
      .where(
        and(
          eq(promptTags.promptId, promptId),
          eq(promptTags.tagId, tagId),
        ),
      )
      .returning();

    return result[0] ?? null;
  }
}

export const promptTagRepository =
  new PromptTagRepository();