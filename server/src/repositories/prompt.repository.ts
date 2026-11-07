import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  isNull,
  or,
} from "drizzle-orm";

import { promptTags } from "../db/schema/prompt-tags.js";
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
    tagIds?: string[];
    lifecycleStatus?: "draft" | "active" | "archived";
    visibility?: "private" | "shared" | "team" | "organization" | "public";
    search?: string;
    sortBy?: "createdAt" | "updatedAt" | "title";
    sortOrder?: "asc" | "desc";
  },
) {
  const conditions = [
    eq(prompts.authorId, authorId),
    isNull(prompts.deletedAt),
  ];

  if (options.categoryId) {
    conditions.push(eq(prompts.categoryId, options.categoryId));
  }
  if (options.tagIds && options.tagIds.length > 0) {
  const matchingPromptIds = this.database
    .select({
      promptId: promptTags.promptId,
    })
    .from(promptTags)
    .where(inArray(promptTags.tagId, options.tagIds));

  conditions.push(
    inArray(prompts.id, matchingPromptIds),
  );
}

  if (options.lifecycleStatus) {
    conditions.push(
      eq(prompts.lifecycleStatus, options.lifecycleStatus),
    );
  }
  if (options.visibility) {
  conditions.push(
    eq(prompts.visibility, options.visibility),
  );
}

  if (options.search) {
    const searchTerm = `%${options.search}%`;

    conditions.push(
      or(
        ilike(prompts.title, searchTerm),
        ilike(prompts.description, searchTerm),
      )!,
    );
  }

  const sortBy = options.sortBy ?? "createdAt";
  const sortOrder = options.sortOrder ?? "desc";

  const orderBy = (() => {
    switch (sortBy) {
      case "title":
        return sortOrder === "asc"
          ? [asc(prompts.title), asc(prompts.id)]
          : [desc(prompts.title), desc(prompts.id)];

      case "updatedAt":
        return sortOrder === "asc"
          ? [asc(prompts.updatedAt), asc(prompts.id)]
          : [desc(prompts.updatedAt), desc(prompts.id)];

      case "createdAt":
      default:
        return sortOrder === "asc"
          ? [asc(prompts.createdAt), asc(prompts.id)]
          : [desc(prompts.createdAt), desc(prompts.id)];
    }
  })();

  return this.database
    .select()
    .from(prompts)
    .where(and(...conditions))
    .orderBy(...orderBy)
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