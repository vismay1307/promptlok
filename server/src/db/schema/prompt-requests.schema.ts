
import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  timestamp,
  index,
  check,
  customType,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

import { users } from "./users.schema.js";
import { promptCategories } from "./categories.schema.js";

const tsvector = customType<{
  data: string;
  driverData: string;
}>({
  dataType: () => "tsvector",
});

export const requestStatusEnum = pgEnum("request_status", [
  "open",
  "accepted",
  "closed",
]);

export const promptRequests = pgTable(
  "prompt_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    requesterId: uuid("requester_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "no action",
        onUpdate: "no action",
      }),

    title: varchar("title", {
      length: 150,
    }).notNull(),

    description: text("description").notNull(),

    context: text("context"),

    categoryId: uuid("category_id").references(
      () => promptCategories.id,
      {
        onDelete: "no action",
        onUpdate: "no action",
      },
    ),

    status: requestStatusEnum("status")
      .notNull()
      .default("open"),

    // Circular composite FK to prompt_request_responses is managed
    // in the SQL migration.
    acceptedResponseId: uuid("accepted_response_id"),

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

    searchVector: tsvector("search_vector").generatedAlwaysAs(
  sql`to_tsvector('simple', title || ' ' || description)`,
),
  },
  (table) => [
    check(
      "prompt_requests_accepted_response_check",
      sql`(${table.status} = 'accepted') = (${table.acceptedResponseId} IS NOT NULL)`,
    ),

    index("prompt_requests_category_idx").on(table.categoryId),

    index("prompt_requests_active_status_created_idx")
      .on(table.status, table.createdAt)
      .where(sql`${table.deletedAt} IS NULL`),

    index("prompt_requests_active_requester_created_idx")
      .on(table.requesterId, table.createdAt)
      .where(sql`${table.deletedAt} IS NULL`),

    index("prompt_requests_search_vector_idx")
      .using("gin", table.searchVector),
  ],
);
