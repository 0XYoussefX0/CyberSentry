"use server";

import { createClient } from "@/lib/supabase/server";
import { PasswordSchema } from "@/lib/types";
import { redirect } from "next/navigation";
import * as v from "valibot";
export default async function resetPassword(data: unknown) {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return { status: "server_error", message: authError.message };
  }

  if (!user) {
    redirect("/login");
  }

  const result = v.safeParse(PasswordSchema, data);

  if (result.success) {
    const { password } = result.output;
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { status: "server_error", message: error.message };
    }
    redirect("/");
  }

  return { status: "validation_error", errors: result.issues };
}
