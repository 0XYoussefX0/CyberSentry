import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./schemas/*",
  dialect: "postgresql",
  dbCredentials: {
    // @ts-expect-error ( weird error that should be ignored )
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
