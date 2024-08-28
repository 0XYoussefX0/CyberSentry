"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function logout() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return { status: "error", message: authError.message };
  }

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { status: "error", message: error.message };
  }

  redirect("/login");
}
