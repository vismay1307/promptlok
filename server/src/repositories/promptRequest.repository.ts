
import {
  and,
  asc,
  count,
  desc,
  eq,
  inArray,
  isNull,
  sql,
} from "drizzle-orm";

import { db } from "../db/db.js";
import { promptRequests } from "../db/schema/prompt-requests.schema.js";
import { promptRequestResponses } from "../db/schema/prompt-request-responses.schema.js";
import { requestTags } from "../db/schema/request-tags.schema.js";
import { promptCategories } from "../db/schema/categories.schema.js";
import { users } from "../db/schema/users.schema.js";
import type { RequestListQuery } from "../validators/request.validators.js";

type DbExecutor = Pick<typeof db, "select" | "insert" | "update">;
type RequestFilters = RequestListQuery & { requesterId?: string };

export class PromptRequestRepository {
  constructor(private readonly executor: DbExecutor = db) {}

  async create(data: {
    requesterId: string;
    title: string;
    description: string;
    context?: string;
    categoryId: string;
  }) {
    const result = await this.executor
      .insert(promptRequests)
      .values(data)
      .returning();

    return result[0] ?? null;
  }
    async updateOpen(
    requestId: string,
    requesterId: string,
    data: {
      title?: string;
      description?: string;
      context?: string | null;
      categoryId?: string;
    },
  ) {
    const result = await this.executor
      .update(promptRequests)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(promptRequests.id, requestId),
          eq(promptRequests.requesterId, requesterId),
          eq(promptRequests.status, "open"),
          isNull(promptRequests.deletedAt),
        ),
      )
      .returning({ id: promptRequests.id });

    return result[0] ?? null;
  }

  async closeOpen(requestId: string, requesterId: string) {
    const result = await this.executor
      .update(promptRequests)
      .set({
        status: "closed",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(promptRequests.id, requestId),
          eq(promptRequests.requesterId, requesterId),
          eq(promptRequests.status, "open"),
          isNull(promptRequests.deletedAt),
        ),
      )
      .returning({ id: promptRequests.id });

    return result[0] ?? null;
  }

  async softDeleteOpen(requestId: string, requesterId: string) {
    const now = new Date();

    const result = await this.executor
      .update(promptRequests)
      .set({
        deletedAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(promptRequests.id, requestId),
          eq(promptRequests.requesterId, requesterId),
          eq(promptRequests.status, "open"),
          isNull(promptRequests.deletedAt),
        ),
      )
      .returning({ id: promptRequests.id });

    return result[0] ?? null;
  }
  private buildConditions(filters: RequestFilters) {
    const conditions = [
      isNull(promptRequests.deletedAt),
      eq(promptRequests.status, filters.status),
    ];

    if (filters.requesterId) {
      conditions.push(
        eq(promptRequests.requesterId, filters.requesterId),
      );
    }

    if (filters.categoryId) {
      conditions.push(
        eq(promptRequests.categoryId, filters.categoryId),
      );
    }

    if (filters.tagIds?.length) {
      const matchingRequests = this.executor
        .select({ requestId: requestTags.requestId })
        .from(requestTags)
        .where(inArray(requestTags.tagId, filters.tagIds));

      conditions.push(
        inArray(promptRequests.id, matchingRequests),
      );
    }

    if (filters.q) {
      conditions.push(
        sql`${promptRequests.searchVector} @@ websearch_to_tsquery('simple', ${filters.q})`,
      );
    }

    return and(...conditions);
  }

  async findByIdVisible(id: string) {
    const responseCount = sql<number>`(
      SELECT count(*)::int
      FROM ${promptRequestResponses}
      WHERE ${promptRequestResponses.requestId} = ${promptRequests.id}
      AND ${promptRequestResponses.deletedAt} IS NULL
    )`.as("response_count");

    const result = await this.executor
      .select({
        request: promptRequests,
        category: {
          id: promptCategories.id,
          name: promptCategories.name,
        },
        requester: {
          username: users.username,
          displayName: users.displayName,
          avatar: users.avatar,
        },
        responseCount,
      })
      .from(promptRequests)
      .leftJoin(
        promptCategories,
        eq(promptRequests.categoryId, promptCategories.id),
      )
      .innerJoin(
        users,
        eq(promptRequests.requesterId, users.id),
      )
      .where(
        and(
          eq(promptRequests.id, id),
          isNull(promptRequests.deletedAt),
        ),
      )
      .limit(1);

    return result[0] ?? null;
  }

  async list(filters: RequestFilters) {
    const conditions = this.buildConditions(filters);

    const responseCount = sql<number>`(
      SELECT count(*)::int
      FROM ${promptRequestResponses}
      WHERE ${promptRequestResponses.requestId} = ${promptRequests.id}
      AND ${promptRequestResponses.deletedAt} IS NULL
    )`.as("response_count");

    const orderBy =
      filters.sort === "oldest"
        ? asc(promptRequests.createdAt)
        : desc(promptRequests.createdAt);

    const [items, totalResult] = await Promise.all([
      this.executor
        .select({
          request: promptRequests,
          category: {
            id: promptCategories.id,
            name: promptCategories.name,
          },
          requester: {
            username: users.username,
            displayName: users.displayName,
            avatar: users.avatar,
          },
          responseCount,
        })
        .from(promptRequests)
        .leftJoin(
          promptCategories,
          eq(promptRequests.categoryId, promptCategories.id),
        )
        .innerJoin(
          users,
          eq(promptRequests.requesterId, users.id),
        )
        .where(conditions)
        .orderBy(orderBy, asc(promptRequests.id))
        .limit(filters.limit)
        .offset(filters.offset),

      this.executor
        .select({ total: count() })
        .from(promptRequests)
        .where(conditions),
    ]);

    return {
      items,
      total: totalResult[0]?.total ?? 0,
    };
  }
}
