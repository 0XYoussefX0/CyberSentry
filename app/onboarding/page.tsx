import { redirect } from "next/navigation";

import { DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/appwrite/envConfig";
import OnBoardingWrapper from "@/components/onBoardingWrapper";
import { createSessionClient } from "@/lib/appwrite/serverConfig";
import auth from "@/lib/auth";
import { cookies } from "next/headers";
import { SessionCookie } from "@/lib/types";
import { AppwriteException } from "node-appwrite";

export default async function Onboarding() {
  let initialStep: number = 1;

  const session = cookies().get("session") as SessionCookie;
  auth.sessionCookie = session;

  const { account, databases } = await createSessionClient(
    auth.sessionCookie.value
  );

  let username;
  let userID;
  try {
    const user = await account.get();
    username = user.name;
    userID = user.$id;
  } catch (e) {
    const err = e as AppwriteException;
    return (
      <div>
        Something went wrong, Please try again! <br />{" "}
        <span>{err.message}</span>{" "}
      </div>
    );
  }

  try {
    const { avatar_image, phone_number } = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userID
    );

    if (!avatar_image || !username) {
      initialStep = 1;
    } else if (!phone_number) {
      initialStep = 2;
    } else {
      redirect("/");
    }
  } catch (e) {
    const err = e as AppwriteException;
    if (!(err.type === "document_not_found")) {
      return (
        <div>
          Something went wrong, Please try again! <br />{" "}
          <span>{JSON.stringify(e)}</span>{" "}
        </div>
      );
    }
  }

  return <OnBoardingWrapper initialStep={initialStep} />;
}
