
import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

import { promptRequests } from "./prompt-requests.schema.js";
import { users } from "./users.schema.js";
import { prompts } from "./prompts.schema.js";

export const promptRequestResponses = pgTable(
  "prompt_request_responses",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    requestId: uuid("request_id")
      .notNull()
      .references(() => promptRequests.id, {
        onDelete: "cascade",
        onUpdate: "no action",
      }),

    responderId: uuid("responder_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "no action",
        onUpdate: "no action",
      }),

    promptId: uuid("prompt_id")
      .notNull()
      .references(() => prompts.id, {
        onDelete: "no action",
        onUpdate: "no action",
      }),
// Composite FK (prompt_id, prompt_version_id) is managed
// in the SQL migration to enforce prompt-version ownership.
    promptVersionId: uuid("prompt_version_id").notNull(),

    note: text("note"),

    isAccepted: boolean("is_accepted")
      .notNull()
      .default(false),

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
  (table) => [
    uniqueIndex("prompt_request_responses_request_id_id_idx").on(
      table.requestId,
      table.id,
    ),

    uniqueIndex("prompt_request_responses_active_responder_idx")
      .on(table.requestId, table.responderId)
      .where(sql`${table.deletedAt} IS NULL`),

    uniqueIndex("prompt_request_responses_one_accepted_idx")
      .on(table.requestId)
      .where(
        sql`${table.isAccepted} = true AND ${table.deletedAt} IS NULL`,
      ),

    index("prompt_request_responses_request_created_idx").on(
      table.requestId,
      table.createdAt,
    ),
  ],
);
