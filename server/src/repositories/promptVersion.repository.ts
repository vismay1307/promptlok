import {
  and,
  desc,
  eq,
} from "drizzle-orm";

import { db } from "../db/db.js";
import { promptVersions } from "../db/schema/prompt-versions.js";

type DbExecutor = Pick<
  typeof db,
  "select" | "insert"
>;

export class PromptVersionRepository {
  constructor(
    private readonly database: DbExecutor = db,
  ) {}

  async findById(versionId: string) {
    const result = await this.database
      .select()
      .from(promptVersions)
      .where(eq(promptVersions.id, versionId))
      .limit(1);

    return result[0] ?? null;
  }

  // Lightweight history: content is fetched separately.
  async findByPromptId(promptId: string) {
    return this.database
      .select({
        id: promptVersions.id,
        promptId: promptVersions.promptId,
        versionNumber: promptVersions.versionNumber,
        changeNote: promptVersions.changeNote,
        editorId: promptVersions.editorId,
        createdAt: promptVersions.createdAt,
      })
      .from(promptVersions)
      .where(eq(promptVersions.promptId, promptId))
      .orderBy(desc(promptVersions.versionNumber));
  }

  async findByPromptAndVersion(
    promptId: string,
    versionId: string,
  ) {
    const result = await this.database
      .select()
      .from(promptVersions)
      .where(
        and(
          eq(promptVersions.promptId, promptId),
          eq(promptVersions.id, versionId),
        ),
      )
      .limit(1);

    return result[0] ?? null;
  }

  async findLatestByPromptId(promptId: string) {
    const result = await this.database
      .select()
      .from(promptVersions)
      .where(eq(promptVersions.promptId, promptId))
      .orderBy(desc(promptVersions.versionNumber))
      .limit(1);

    return result[0] ?? null;
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