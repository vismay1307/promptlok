import {
  pgTable,
  uuid,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const promptCategories = pgTable(
  "prompt_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", {
      length: 100,
    }).notNull(),

    slug: varchar("slug", {
      length: 100,
    }).notNull(),
  },
  (table) => ({
    nameIdx: uniqueIndex("prompt_categories_name_idx").on(table.name),

    slugIdx: uniqueIndex("prompt_categories_slug_idx").on(table.slug),
  }),
);