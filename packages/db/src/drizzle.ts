import { drizzle } from "drizzle-orm/node-postgres";
// import pg from "pg";

export const createDbConnection = (DATABASE_URL: string) => {
  // const pool = new pg.Pool({
  //   connectionString: DATABASE_URL,
  //   idleTimeoutMillis: 30000,
  //   connectionTimeoutMillis: 4000,
  // });

  // return drizzle({
  //   client: pool,
  // });
  return drizzle(DATABASE_URL);
};

let dbInstance: DB | undefined = undefined;

export const getDb = async (DATABASE_URL: string) => {
  if (!dbInstance) {
    dbInstance = createDbConnection(DATABASE_URL);
  }
  return dbInstance;
};

export type DB = ReturnType<typeof createDbConnection>;
