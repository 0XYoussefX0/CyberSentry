import { EnvSchema } from "@pentest-app/schemas/server";
import type { Env } from "@pentest-app/types/server";
import * as v from "valibot";

if (!(process.env.NODE_ENV === "production")) {
  const dotenv = await import("dotenv");
  dotenv.config();
}

function validateEnv(): Env {
  try {
    const env = v.parse(EnvSchema, {
      NODE_ENV: process.env.NODE_ENV,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
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

export const isProduction = env.NODE_ENV === "production";

export const ENCRYPTION_KEY = Buffer.from(env.ENCRYPTION_KEY, "hex");

export const adminCredentials = {
  email: env.ADMIN_APP_EMAIL,
  password: env.ADMIN_APP_PASSWORD,
  role: env.ADMIN_APP_ROLE,
  username: env.ADMIN_APP_USERNAME,
  tag: env.ADMIN_APP_TAG,
};
