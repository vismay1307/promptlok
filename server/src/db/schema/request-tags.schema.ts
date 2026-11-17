
import {
  pgTable,
  uuid,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

import { promptRequests } from "./prompt-requests.schema.js";
import { tags } from "./tags.schema.js";

export const requestTags = pgTable(
  "request_tags",
  {
    requestId: uuid("request_id")
      .notNull()
      .references(() => promptRequests.id, {
        onDelete: "cascade",
        onUpdate: "no action",
      }),

    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, {
        onDelete: "no action",
        onUpdate: "no action",
      }),
  },
  (table) => [
    primaryKey({
      name: "request_tags_request_id_tag_id_pk",
      columns: [table.requestId, table.tagId],
    }),

    index("request_tags_tag_idx").on(table.tagId),
  ],
);
