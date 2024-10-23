import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./models/*",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_EXTERNAL!,
  },
});
