import { cookies } from "next/headers";
import { createSessionClient } from "@/lib/appwrite/config";
import { Auth, SessionCookie } from "@/lib/types";

const auth: Auth = {
  user: null,
  sessionCookie: null,
  getUser: async () => {
    const session = cookies().get("session");
    auth.sessionCookie = session ? (session as SessionCookie) : null;

    if (auth.sessionCookie) {
      try {
        const { account } = await createSessionClient(auth.sessionCookie.value);
        auth.user = await account.get();
      } catch {
        auth.user = null;
        auth.sessionCookie = null;
      }
    }

    console.log("getUser has been called", auth);
    return auth.user;
  },
};

export default auth;
