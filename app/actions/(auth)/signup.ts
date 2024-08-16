"use server";
import * as v from "valibot";
import { SignUpSchema } from "@/lib/types";

import { createClient } from "@/lib/supabase/server";

export default async function signup(data: unknown) {
  const formData = v.safeParse(SignUpSchema, data);

  if (formData.success) {
    const { email, password } = formData.output;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { status: "server_error", message: error.message };
    }

    return { status: "success" };
  } else {
    return { status: "validation_error", errors: formData.issues };
  }
}
