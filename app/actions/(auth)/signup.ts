"use server";

import * as v from "valibot";
import { SignUpSchema, SignUpResponse } from "@/lib/types";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/appwrite/config";
import { AppwriteException, ID } from "node-appwrite";

export default async function signup(data: unknown): Promise<SignUpResponse> {
  const formData = v.safeParse(SignUpSchema, data);
  if (!formData.success) {
    return { status: "validation_error", errors: formData.issues };
  }
  const { email, password } = formData.output;
  const { account } = await createAdminClient();
  try {
    await account.create(ID.unique(), email, password);
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });

    return { status: "success" };
  } catch (e) {
    const err = e as AppwriteException;
    return { status: "server_error", error: err.message };
  }
}
