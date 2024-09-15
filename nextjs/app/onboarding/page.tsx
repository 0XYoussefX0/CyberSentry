import { redirect } from "next/navigation";
import { AppwriteException } from "node-appwrite";

import { createSessionClient } from "@/lib/appwrite/server";
import { getUser } from "@/lib/appwrite/utils";
import { DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/env";

import OnBoardingWrapper from "@/components/onBoardingWrapper";

export default async function Onboarding() {
  let initialStep: number | null = null;

  const { account, databases } = await createSessionClient();
  const user = await getUser(account);

  if (!user) redirect("/login");

  try {
    const { phone_number } = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      user.$id,
    );

    if (!user.name) {
      initialStep = 1;
    } else if (!phone_number) {
      initialStep = 2;
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
    initialStep = 1;
  }

  if (initialStep === null) {
    redirect("/");
  }

  return <OnBoardingWrapper initialStep={initialStep} />;
}
