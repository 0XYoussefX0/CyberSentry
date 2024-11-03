import { EnvSchema } from "@pentest-app/schemas/server";
import type { Env } from "@pentest-app/types/server";
import * as v from "valibot";

function validateEnv(): Env {
  try {
    const env = v.parse(EnvSchema, {
      NODE_ENV: process.env.NODE_ENV,
      DOMAIN_NAME: process.env.DOMAIN_NAME,
      ADMIN_APP_EMAIL: process.env.ADMIN_APP_EMAIL,
      ADMIN_APP_PASSWORD: process.env.ADMIN_APP_PASSWORD,
      ADMIN_APP_ROLE: process.env.ADMIN_APP_ROLE,
      ADMIN_APP_USERNAME: process.env.ADMIN_APP_USERNAME,
      ADMIN_APP_TAG: process.env.ADMIN_APP_TAG,
      DATABASE_URL: process.env.DATABASE_URL,
      MINIO_HOST_URL: process.env.MINIO_HOST_URL,
      MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
      MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
      SERVER_PUBLIC_IP: process.env.SERVER_PUBLIC_IP,
    });

    return env;
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    process.exit(1);
  }
}

export const env = validateEnv();
