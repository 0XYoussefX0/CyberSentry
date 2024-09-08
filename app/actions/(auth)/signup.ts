"use server";

import * as v from "valibot";
import { SignUpResponse } from "@/lib/types";

import { cookies } from "next/headers";
import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite/serverConfig";
import { AppwriteException, ID } from "node-appwrite";
import { SignUpSchema } from "@/lib/validationSchemas";

import { SessionCookie } from "@/lib/types";

import auth from "@/lib/auth";

const REDIRECT_URL =
  process.env.NODE_ENV === "production"
    ? "https://cybersentry.tech/auth/confirm"
    : "http://localhost:3000/auth/confirm";

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
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });
  } catch (e) {
    const err = e as AppwriteException;
    return { status: "server_error", error: err.message };
  }

  const session = cookieStore.get("session") as SessionCookie;
  auth.sessionCookie = session;

  // the bellow code is for sending a confirmation email
  try {
    const { account } = await createSessionClient(auth.sessionCookie.value);
    await account.createVerification(REDIRECT_URL);
    return { status: "success" };
  } catch (e) {
    const err = e as AppwriteException;
    return { status: "server_error", error: err.message };
  }
}
