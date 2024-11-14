import "server-only";

import { createAuthService } from "@pentest-app/auth/index";
import { getDb } from "@pentest-app/db/drizzle";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const db = await getDb(process.env.DATABASE_URL!);

export const createAuthServerClient = () => {
  return createAuthService({
    db,
    isProduction: process.env.NODE_ENV === "production",
    domainName: process.env.DOMAIN_NAME!,
  });
};

const publicRoutes = [
  "/",
  "/error",
  "/forgot-password",
  "/login",
  "/check-email-reset",
  "/resetpassword",
];

export const createCookiesObj = () => {
  const cookiesStore = cookies();

  return {
    set(name: string, value: string, options: Partial<ResponseCookie>) {
      cookiesStore.set(name, value, options);
    },
    get(name: string) {
      return cookiesStore.get(name)?.value;
    },
  };
};
