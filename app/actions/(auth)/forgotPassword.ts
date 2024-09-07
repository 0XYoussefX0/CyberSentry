"use server";

import * as v from "valibot";
import { EmailSchema, ForgotPasswordResponse } from "@/lib/types";
import { createAdminClient } from "@/lib/appwrite/config";
import { AppwriteException } from "node-appwrite";

export default async function forgotPassword(
  data: unknown
): Promise<ForgotPasswordResponse> {
  const formData = v.safeParse(EmailSchema, data);
  if (!formData.success) {
    return { status: "validation_error", errors: formData.issues };
  }
  const { email } = formData.output;
  const { account } = await createAdminClient();
  const REDIRECT_URL =
    process.env.NODE_ENV === "production"
      ? "https://cybersentry.tech/resetpassword"
      : "http://localhost:3000/resetpassword";
  try {
    await account.createRecovery(email, REDIRECT_URL);

    return { status: "success" };
  } catch (e) {
    const err = e as AppwriteException;
    return { status: "server_error", error: err.message };
  }
}
