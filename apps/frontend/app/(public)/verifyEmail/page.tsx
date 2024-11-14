import EmailVerified from "@/app/(public)/verifyEmail/_components/EmailVerified";

import { trpcServerClient } from "@/lib/trpcServer";

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token;

  if (typeof token !== "string" || token.length < 0) return;

  const result = await trpcServerClient.verifyConfirmationEmailToken.mutate({
    token,
  });

  if (result.status === "valid") {
    return <EmailVerified />;
  }
}

export default Page;
