"use server";

import { redirect } from "next/navigation";
import * as v from "valibot";
import { ResetPasswordResponse } from "@/lib/types";
import { createAdminClient } from "@/lib/appwrite/serverConfig";

import { AppwriteException } from "node-appwrite";
import { PasswordSchema } from "@/lib/validationSchemas";

export default async function resetPassword(
  data: unknown,
  userId: unknown,
  secret: unknown
): Promise<ResetPasswordResponse> {
  if (typeof userId !== "string" || typeof secret !== "string") {
    redirect("/forgotpassword");
  }

  const formData = v.safeParse(PasswordSchema, data);
  if (!formData.success) {
    return { status: "validation_error", errors: formData.issues };
  }

  const { password } = formData.output;
  const { account } = await createAdminClient();

  try {
    await account.updateRecovery(userId, secret, password);

    return { status: "success" };
  } catch (e) {
    const err = e as AppwriteException;
    return { status: "server_error", error: err.message };
  }
}
