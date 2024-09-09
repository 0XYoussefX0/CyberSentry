"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import auth from "@/lib/auth";
import { SessionCookie, LogOutResponse } from "@/lib/types";
import { createSessionClient } from "@/lib/appwrite/serverConfig";
import { AppwriteException } from "node-appwrite";

export default async function logout(): Promise<LogOutResponse> {
  const session = cookies().get("session");
  auth.sessionCookie = session ? (session as SessionCookie) : null;

  if (auth.sessionCookie) {
    try {
      const { account } = await createSessionClient(auth.sessionCookie.value);
      await account.deleteSession("current");
    } catch (e) {
      const err = e as AppwriteException;
      return { status: "error", error: err.message };
    }
  }

  cookies().delete("session");
  auth.user = null;
  auth.sessionCookie = null;
  redirect("/login");
}
