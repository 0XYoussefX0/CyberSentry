import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: varchar("username", { length: 60 }).notNull(),
  tag: varchar("tag", { length: 40 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  user_image: text("user_image").unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  isAdmin: boolean("isAdmin").default(false).notNull(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: varchar("id", { length: 36 })
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  rememberMe: boolean("rememberMe").default(false).notNull(),
});
