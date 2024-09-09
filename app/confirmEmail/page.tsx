import { createSessionClient } from "@/lib/appwrite/serverConfig";
import { cookies } from "next/headers";
import auth from "@/lib/auth";
import { SessionCookie } from "@/lib/types";
import { redirect } from "next/navigation";
import { AppwriteException } from "node-appwrite";
import EmailVerified from "@/components/EmailVerified";

export default async function confirmEmail({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userId = searchParams.userId;
  const secret = searchParams.secret;
  const session = cookies().get("session");
  auth.sessionCookie = session ? (session as SessionCookie) : null;

  if (
    typeof userId === "string" &&
    typeof secret === "string" &&
    auth.sessionCookie
  ) {
    const { account } = await createSessionClient(auth.sessionCookie.value);
    try {
      await account.updateVerification(userId, secret);

      return <EmailVerified />;
    } catch (e) {
      const err = e as AppwriteException;
      return <div>Error: {err.message}, Please try again.</div>;
    }
  }
  return <div>k</div>;
}
