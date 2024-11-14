import { adminCredentials, env, isProduction } from "@/src/utils/env.js";
import { getDb } from "@pentest-app/db/drizzle";

import { Resend } from "resend";

import { createAuthService } from "@pentest-app/auth/index";
import { getMinio } from "@pentest-app/minio/index";
import type { CookieOptions } from "express";

import type { Cookies } from "@pentest-app/types/global";
import type { Request, Response } from "express";

export const db = await getDb(env.DATABASE_URL);

export const resend = new Resend(env.RESEND_API_KEY);

export const minio = getMinio({
  endPoint: isProduction ? "s3_storage" : "localhost",
  port: 9000,
  useSSL: isProduction,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

if (!minio) {
  console.error("❌ Minio failed to initialize");
  process.exit(1);
}

export const auth = createAuthService({
  db,
  isProduction,
  domainName: env.DOMAIN_NAME,
});

await auth.signTheAdminUp(adminCredentials);

export const createCookiesObj = (req: Request, res: Response): Cookies => ({
  set(name: string, value: string, options: CookieOptions) {
    res.cookie(name, value, options);
  },
  get(name: string) {
    return req.cookies[name] as string | undefined;
  },
});
