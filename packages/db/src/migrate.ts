import { dirname, resolve } from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getDb } from "./drizzle.js";

const __dirname = dirname(new URL(import.meta.url).pathname);

export async function runMigrations(DATABASE_URL: string) {
  const db = await getDb(DATABASE_URL);
  await migrate(db, {
    migrationsFolder: resolve(__dirname, "../migrations/"),
  });
}
