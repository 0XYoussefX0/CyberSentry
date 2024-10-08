"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppwriteException } from "node-appwrite";
import * as v from "valibot";

import { createAdminClient } from "@/lib/appwrite/server";
import { LoginResponse } from "@/lib/types";
import { LoginSchema } from "@/lib/validationSchemas";

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
      sameSite: "lax",
      secure: true,
      path: "/",
      ...(rememberMe ? { expires: new Date(session.expire) } : {}),
    });
  } catch (e) {
    const err = e as AppwriteException;

    return { status: "server_error", error: err.message };
  }

  redirect("/");
}
