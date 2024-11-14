import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { trpcServerClient } from "@/lib/trpcServer";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userID = searchParams.userID;
  const token = searchParams.token;

  if (typeof userID !== "string" || typeof token !== "string") return;

  try {
    const result = await trpcServerClient.verifyResetEmailToken.mutate({
      userID,
      token,
    });

    if (result.status === "success") {
      return (
        <main className="relative flex h-full min-h-screen flex-col lp:items-center justify-between gap-[132px] px-4 pt-12 lp:pb-16 pb-6">
          <ResetPasswordForm />
        </main>
      );
    }
  } catch (e) {
    return <div>Invalid Token or User ID</div>;
  }
}
