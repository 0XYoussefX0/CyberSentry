import { dirname, resolve } from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const __dirname = dirname(new URL(import.meta.url).pathname);

export const createDbConnection = (DATABASE_URL: string) => {
  const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 4000,
  });

  return drizzle({
    client: pool,
  });
};

let dbInstance: DB | undefined = undefined;

export const getDb = async (DATABASE_URL: string) => {
  if (!dbInstance) {
    dbInstance = createDbConnection(DATABASE_URL);
    await migrate(dbInstance, {
      migrationsFolder: resolve(__dirname, "../migrations/"),
    });
  }
  return dbInstance;
};

export type DB = ReturnType<typeof createDbConnection>;
