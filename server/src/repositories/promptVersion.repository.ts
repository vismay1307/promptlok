import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { promptVersions } from "../db/schema/prompt-versions.js";

type DbExecutor = Pick<
  typeof db,
  "select" | "insert"
>;
export class PromptVersionRepository {
  constructor(private readonly database: DbExecutor = db) {}

  async findById(versionId: string) {
    const result = await this.database
      .select()
      .from(promptVersions)
      .where(eq(promptVersions.id, versionId))
      .limit(1);

    return result[0] ?? null;
  }

  async findByPromptId(promptId: string) {
    return this.database
      .select()
      .from(promptVersions)
      .where(eq(promptVersions.promptId, promptId));
  }

  async create(data: typeof promptVersions.$inferInsert) {
    const result = await this.database
      .insert(promptVersions)
      .values(data)
      .returning();

    return result[0];
  }
}

export const promptVersionRepository =
  new PromptVersionRepository();