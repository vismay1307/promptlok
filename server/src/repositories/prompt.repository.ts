import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "../db/db.js";
import { prompts } from "../db/schema/prompts.schema.js";

type DbExecutor = Pick<
  typeof db,
  "select" | "insert" | "update" | "delete"
>;

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

  async findMine(
    authorId: string,
    options: {
      limit: number;
      offset: number;
      categoryId?: string;
      lifecycleStatus?: "draft" | "active" | "archived";
    },
  ) {
    const conditions = [
      eq(prompts.authorId, authorId),
      isNull(prompts.deletedAt),
    ];

    if (options.categoryId) {
      conditions.push(eq(prompts.categoryId, options.categoryId));
    }

    if (options.lifecycleStatus) {
      conditions.push(eq(prompts.lifecycleStatus, options.lifecycleStatus));
    }

    return this.database
      .select()
      .from(prompts)
      .where(and(...conditions))
      .orderBy(desc(prompts.createdAt), desc(prompts.id))
      .limit(options.limit)
      .offset(options.offset);
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

  async updateMetadata(
    promptId: string,
    data: {
      title?: string;
      description?: string | null;
      categoryId?: string;
      aiModelMetadata?: string | null;
      updatedAt: Date;
    },
  ) {
    const result = await this.database
      .update(prompts)
      .set(data)
      .where(eq(prompts.id, promptId))
      .returning();

    return result[0] ?? null;
  }

  async softDelete(promptId: string) {
    const result = await this.database
      .update(prompts)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(prompts.id, promptId))
      .returning();

    return result[0] ?? null;
  }
}

export const promptRepository = new PromptRepository();