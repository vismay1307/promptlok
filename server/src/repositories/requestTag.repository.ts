
import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { requestTags } from "../db/schema/request-tags.schema.js";
import { tags } from "../db/schema/tags.schema.js";

type DbExecutor = Pick<typeof db, "select" | "insert" | "delete">;

export class RequestTagRepository {
  constructor(private readonly executor: DbExecutor = db) {}

  async replaceTags(requestId: string, tagIds: string[]) {
    await this.executor
      .delete(requestTags)
      .where(eq(requestTags.requestId, requestId));

    if (tagIds.length === 0) return;

    await this.executor.insert(requestTags).values(
      tagIds.map((tagId) => ({
        requestId,
        tagId,
      })),
    );
  }

  async findTagsByRequestId(requestId: string) {
    return this.executor
      .select({
        id: tags.id,
        name: tags.name,
      })
      .from(requestTags)
      .innerJoin(tags, eq(requestTags.tagId, tags.id))
      .where(eq(requestTags.requestId, requestId));
  }
}
