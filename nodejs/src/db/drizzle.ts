import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 4000,
});

export const db = drizzle({
  client: pool,
});
