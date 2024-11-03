import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const createDbConnection = (DATABASE_URL: string) => {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 4000,
  });

  return drizzle({
    client: pool,
  });
};

let dbInstance: DB | undefined = undefined;

export const getDb = (DATABASE_URL: string) => {
  if (!dbInstance) {
    dbInstance = createDbConnection(DATABASE_URL);
  }
  return dbInstance;
};

export type DB = ReturnType<typeof createDbConnection>;
