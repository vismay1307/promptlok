import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { users } from "./users.schema.js";
import { promptCategories } from "./categories.schema.js";

export const promptTypeEnum = pgEnum("prompt_type", [
  "text",
  "image",
]);

export const visibilityEnum = pgEnum("prompt_visibility", [
  "private",
  "shared",
  "team",
  "organization",
  "public",
]);

export const lifecycleStatusEnum = pgEnum("prompt_lifecycle_status", [
  "draft",
  "active",
  "archived",
]);

export const prompts = pgTable(
  "prompts",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id),

    title: varchar("title", {
      length: 140,
    }).notNull(),

    description: text("description"),

    categoryId: uuid("category_id")
      .references(() => promptCategories.id),

    promptType: promptTypeEnum("prompt_type")
      .notNull()
      .default("text"),

    aiModelMetadata: varchar("ai_model_metadata", {
      length: 100,
    }),

    visibility: visibilityEnum("visibility")
      .notNull()
      .default("private"),

    lifecycleStatus: lifecycleStatusEnum("lifecycle_status")
      .notNull()
      .default("draft"),

    /*
     * Circular reference:
     *
     * prompts -> currentVersionId -> prompt_versions.id
     *
     * This remains nullable initially.
     * The FK will be added after prompt_versions exists.
     */
    currentVersionId: uuid("current_version_id"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    deletedAt: timestamp("deleted_at", {
      withTimezone: true,
    }),
  },

  (table) => ({
    authorIdx: index("prompts_author_idx")
      .on(table.authorId),

    vaultListingIdx: index("prompts_author_deleted_created_idx")
      .on(
        table.authorId,
        table.deletedAt,
        table.createdAt,
      ),
  }),
);