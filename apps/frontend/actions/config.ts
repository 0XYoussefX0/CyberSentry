import { createAuthService } from "@pentest-app/auth/index";
import { getDb } from "@pentest-app/db/drizzle";
import { getMinio } from "@pentest-app/minio/index";
import { Resend } from "resend";

export const db = await getDb(process.env.DATABASE_URL!);

export const auth = createAuthService({
  db,
  isProduction: process.env.NODE_ENV === "production",
  domainName: process.env.DOMAIN_NAME!,
});

// validate the env variables

export const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");
export const ALGORITHM = "aes-256-cbc";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export const isProduction = process.env.NODE_ENV! === "production";

export const minio = getMinio({
  endPoint: isProduction ? "s3_storage" : "localhost",
  port: 9000,
  useSSL: isProduction,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

if (!minio) {
  console.error("❌ Minio failed to initialize");
  process.exit(1);
}

export const minioHost = process.env.MINIO_HOST_URL!;
