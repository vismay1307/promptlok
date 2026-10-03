import {
  pgTable,
  uuid,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", {
      length: 50,
    }).notNull(),
  },
  (table) => ({
    nameIdx: uniqueIndex("tags_name_idx").on(table.name),
  }),
);