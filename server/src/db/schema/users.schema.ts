import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    clerkUserId: varchar("clerk_user_id", {
      length: 255,
    }).notNull(),

    email: varchar("email", {
      length: 320,
    }).notNull(),

    username: varchar("username", {
      length: 50,
    }).notNull(),

    displayName: varchar("display_name", {
      length: 100,
    }).notNull(),

    bio: text("bio"),

    avatar: text("avatar"),

    accountStatus: varchar("account_status", {
      length: 20,
    })
      .notNull()
      .default("active"),
    role: varchar("role", {
  length: 20,
})
  .notNull()
  .default("user"),

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
  },
  (table) => ({
    clerkUserIdIdx: uniqueIndex("users_clerk_user_id_idx").on(
      table.clerkUserId
    ),

    emailIdx: uniqueIndex("users_email_idx").on(table.email),

    usernameIdx: uniqueIndex("users_username_idx").on(
      table.username
    ),

    accountStatusIdx: index("users_account_status_idx").on(
      table.accountStatus
    ),
    
  })
);