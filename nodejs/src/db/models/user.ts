import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 60 }).notNull(),
  tag: varchar("tag", { length: 40 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  user_image: text("user_image").unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  is_admin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp().defaultNow().notNull(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  remember_me: boolean("remember_me").notNull().default(false),
});
