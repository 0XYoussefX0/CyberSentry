import { auth } from "@/actions/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const token = searchParams.get("token");
  const userID = searchParams.get("userID");

  if (!token || token.length !== 32 || !userID)
    throw new Error("Invalid Request");

  const result = await auth.verifyResetEmailToken(token, userID);

  if (result.status === "valid") {
    const cookiesStore = cookies();

    const authToken = auth.generateSessionToken();
    const session = await auth.createSession(authToken, userID, false);
    auth.setSessionTokenCookie(
      authToken,
      session.expiresAt,
      false,
      cookiesStore,
    );
    await auth.verifySession(session.id);

    redirect("/resetpassword");
  }

  throw new Error("Invalid Token or User ID");
}
