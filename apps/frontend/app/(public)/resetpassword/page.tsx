import { redirect } from "next/navigation";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPassword({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userId = searchParams.userId;
  const secret = searchParams.secret;

  if (typeof userId !== "string" || typeof secret !== "string") {
    redirect("/forgotpassword");
  }

  return (
    <main className="px-4 pt-12 pb-6 lp:pb-16 flex flex-col gap-[132px] min-h-screen h-full justify-between relative lp:items-center">
      <ResetPasswordForm userId={userId} secret={secret} />
    </main>
  );
}
