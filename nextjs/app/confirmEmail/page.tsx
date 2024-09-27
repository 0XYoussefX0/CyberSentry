import { AppwriteException, Permission, Query, Role } from "node-appwrite";

import { createSessionClient } from "@/lib/appwrite/server";
import { DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/env";

import EmailVerified from "@/components/EmailVerified";

export default async function confirmEmail({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userId = searchParams.userId;
  const secret = searchParams.secret;

  if (typeof userId === "string" && typeof secret === "string") {
    const { account, databases } = await createSessionClient();
    try {
      await account.updateVerification(userId, secret);

      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        {
          verified: true,
        },
        [
          Permission.read(Role.users()),
          Permission.read(Role.user(userId)),
          Permission.write(Role.user(userId)),
        ],
      );

      return <EmailVerified />;
    } catch (e) {
      const err = e as AppwriteException;
      return <div>Error: {err.message}, Please try again.</div>;
    }
  }
}
