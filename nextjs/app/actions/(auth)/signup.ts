"use server";

import { cookies } from "next/headers";
import { AppwriteException, ID, Permission, Role } from "node-appwrite";
import * as v from "valibot";

import { createAdminClient, createSessionClient } from "@/lib/appwrite/server";
import { DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/env";
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
  const { account, databases } = await createAdminClient();

  const cookieStore = cookies();

  const userID = ID.unique();
  try {
    await account.create(userID, email, password);
    const session = await account.createEmailPasswordSession(email, password);
    cookieStore.set("session", session.secret, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });

    await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userID,
      {
        verified: true,
      },
      [
        Permission.read(Role.users()),
        Permission.read(Role.user(userID)),
        Permission.write(Role.user(userID)),
      ],
    );

    const { account: SessionAccount } = await createSessionClient();
    await SessionAccount.createVerification(REDIRECT_URL);
    return { status: "success" };
  } catch (e) {
    const err = e as AppwriteException;
    return { status: "server_error", error: err.message };
  }
}
