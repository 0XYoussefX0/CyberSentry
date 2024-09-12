import { createSessionClient } from "@/lib/appwrite/server";
import { AppwriteException } from "node-appwrite";
import EmailVerified from "@/components/EmailVerified";

export default async function confirmEmail({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userId = searchParams.userId;
  const secret = searchParams.secret;

  if (typeof userId === "string" && typeof secret === "string") {
    const { account } = await createSessionClient();
    try {
      await account.updateVerification(userId, secret);

      return <EmailVerified />;
    } catch (e) {
      const err = e as AppwriteException;
      return <div>Error: {err.message}, Please try again.</div>;
    }
  }

  // this component need to be tested
}
