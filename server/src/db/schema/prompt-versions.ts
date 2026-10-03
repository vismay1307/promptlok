import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { prompts } from "./prompts.schema.js";
import { users } from "./users.schema.js";

export const promptVersions = pgTable(
  "prompt_versions",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    promptId: uuid("prompt_id")
      .notNull()
      .references(() => prompts.id),

    versionNumber: integer("version_number")
      .notNull(),

    content: text("content")
      .notNull(),

    changeNote: text("change_note"),

    editorId: uuid("editor_id")
      .notNull()
      .references(() => users.id),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => ({
    uniqueVersionPerPrompt: uniqueIndex(
      "prompt_versions_prompt_version_idx",
    ).on(
      table.promptId,
      table.versionNumber,
    ),

    promptIdx: index("prompt_versions_prompt_idx")
      .on(table.promptId),
  }),
);