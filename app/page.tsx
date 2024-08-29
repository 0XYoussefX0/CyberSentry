import { createClient } from "@/lib/supabase/server";

import { redirect } from "next/navigation";

import LogOutButton from "@/components/LogOutButton";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (
    !user.user_metadata.avatar_image ||
    !user.user_metadata.full_name ||
    !user.user_metadata.phoneNumber
  ) {
    redirect("/onboarding");
  }

  return (
    <>
      <div>Dashboard</div>
      <LogOutButton />
    </>
  );
}
