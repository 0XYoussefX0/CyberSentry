import { auth } from "@/actions/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const token = searchParams.get("token");

  if (!token || token.length !== 32) throw new Error("Invalid Token");

  const cookiesStore = cookies();

  const { session } = await auth.getUser(cookiesStore);

  if (!session) throw new Error("Unauthorized Access");

  const result = await auth.verifyConfirmationEmailToken(token, session.id);

  if (result.status === "valid") {
    redirect("/emailVerified");
  }

  throw new Error("Invalid Token");
}
