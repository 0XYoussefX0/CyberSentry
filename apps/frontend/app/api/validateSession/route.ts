import { auth } from "@/actions/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const token = body.token;

  if (!token || token.length !== 32) return { user: null, session: null };

  const cookiesStore = cookies();

  cookiesStore.set("session", token);

  return NextResponse.json(await auth.validateSessionToken(cookies()));
}
