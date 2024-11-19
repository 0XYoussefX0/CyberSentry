import { env, isProduction } from "@/src/utils/env.js";
import { getDb } from "@pentest-app/db/drizzle";

import { Resend } from "resend";

import { createAuthService } from "@pentest-app/auth/index";
import { getMinio } from "@pentest-app/minio/index";

import { sessionTable, userTable } from "@pentest-app/db/user";
import type { AdminCredentials } from "@pentest-app/types/global";

import { hash } from "@node-rs/argon2";
import { eq } from "drizzle-orm";

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

export const signTheAdminUp = async (adminCredentials: AdminCredentials) => {
  if (!adminCredentials) {
    throw new Error("Admin configuration not provided");
  }

  const { email, password, role, username, tag } = adminCredentials;

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const result = await db
    .select({
      userId: userTable.id,
    })
    .from(userTable)
    .where(eq(userTable.email, email));

  if (result[0]) {
    await db
      .delete(sessionTable)
      .where(eq(sessionTable.user_id, result[0].userId));

    await db.delete(userTable).where(eq(userTable.id, result[0].userId));
  }

  await db.insert(userTable).values({
    username,
    tag,
    role,
    user_image: null,
    email,
    password_hash: passwordHash,
    is_admin: true,
  });
};
