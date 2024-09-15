"use server";

import { cookies } from "next/headers";
import { AppwriteException, ID } from "node-appwrite";
import * as v from "valibot";

import { createAdminClient, createSessionClient } from "@/lib/appwrite/server";
import { SignUpResponse } from "@/lib/types";
import { SignUpSchema } from "@/lib/validationSchemas";

const REDIRECT_URL =
  process.env.NODE_ENV === "production"
    ? "https://cybersentry.tech/confirmEmail"
    : "http://localhost:3000/confirmEmail";

export default async function signup(data: unknown): Promise<SignUpResponse> {
  const formData = v.safeParse(SignUpSchema, data);
  if (!formData.success) {
    return { status: "validation_error", errors: formData.issues };
  }
  const { email, password } = formData.output;
  const { account } = await createAdminClient();

  const cookieStore = cookies();

  try {
    await account.create(ID.unique(), email, password);
    const session = await account.createEmailPasswordSession(email, password);
    cookieStore.set("session", session.secret, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });
  } catch (e) {
    const err = e as AppwriteException;
    return { status: "server_error", error: err.message };
  }

  // the bellow code is for sending a confirmation email
  try {
    const { account } = await createSessionClient();
    await account.createVerification(REDIRECT_URL);
    return { status: "success" };
  } catch (e) {
    const err = e as AppwriteException;
    return { status: "server_error", error: err.message };
  }
}
