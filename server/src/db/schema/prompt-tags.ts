import {
  pgTable,
  uuid,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

import { prompts } from "./prompts.schema.js";
import { tags } from "./tags.schema.js";

export const promptTags = pgTable(
  "prompt_tags",
  {
    promptId: uuid("prompt_id")
      .notNull()
      .references(() => prompts.id),

    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id),
  },

  (table) => ({
    pk: primaryKey({
      columns: [
        table.promptId,
        table.tagId,
      ],
    }),

    tagIdx: index("prompt_tags_tag_idx")
      .on(table.tagId),
  }),
);