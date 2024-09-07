"use server";

import * as v from "valibot";
import { LoginSchema, LoginResponse } from "@/lib/types";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/appwrite/config";
import { AppwriteException } from "node-appwrite";
import { redirect } from "next/navigation";

export default async function login(data: unknown): Promise<LoginResponse> {
  const formData = v.safeParse(LoginSchema, data);

  if (!formData.success) {
    return { status: "validation_error", errors: formData.issues };
  }

  const { email, password, rememberMe } = formData.output;
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
      ...(rememberMe ? { expires: new Date(session.expire) } : {}),
    });

    redirect("/");
  } catch (e) {
    const err = e as AppwriteException;
    return { status: "server_error", error: err.message };
  }
}
