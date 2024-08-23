"use server";
import * as v from "valibot";
import { LoginSchema } from "@/lib/types";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { encryptSymmetric, sign } from "@/lib/utils.server";

export default async function login(data: unknown) {
  const formData = v.safeParse(LoginSchema, data);

  if (formData.success) {
    const { email, password, rememberMe } = formData.output;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const cookieStore = cookies();

    const {
      data: { user },
      error: updateError,
    } = await supabase.auth.updateUser({
      data: { rememberMe },
    });

    /* handle this error */
    if (updateError) {

    }

    if (!rememberMe && user && user.id) {
      const encryptedUserId = await encryptSymmetric(user.id);
      const token = await sign({ userId: encryptedUserId });
      cookieStore.set("activeSession", token, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    }

    if (error) {
      return { status: "server_error", message: error.message };
    }

    return { status: "success" };
  } else {
    return { status: "validation_error", errors: formData.issues };
  }
}
