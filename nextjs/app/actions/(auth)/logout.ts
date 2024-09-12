"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUser } from "@/lib/appwrite/utils";
import { SessionCookie, LogOutResponse } from "@/lib/types";
import { createSessionClient } from "@/lib/appwrite/server";
import { AppwriteException } from "node-appwrite";

export default async function logout(): Promise<LogOutResponse> {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
  } catch (e) {
    const err = e as AppwriteException;
    return { status: "error", error: err.message };
  }

  cookies().delete("session");
  redirect("/login");
}
