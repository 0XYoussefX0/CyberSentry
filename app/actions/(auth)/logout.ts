"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function logout() {
  const supabase = createClient();

  // check if the user is logged in before trying to log him out

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { status: "error", message: error.message };
  }

  redirect("/login");
}
