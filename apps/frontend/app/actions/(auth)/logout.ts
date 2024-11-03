"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppwriteException } from "node-appwrite";

import { createSessionClient } from "@/lib/appwrite/server";
import { LogOutResponse } from "@/lib/types";

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
