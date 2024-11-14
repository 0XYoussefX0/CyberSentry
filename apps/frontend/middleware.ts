import type { SessionValidationResult } from "@pentest-app/types/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/",
  "/error",
  "/forgot-password",
  "/login",
  "/check-email-reset",
  "/resetpassword",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const pathIsPublic = publicRoutes.includes(path);

  const cookie = request.cookies.get("session");

  let userData: SessionValidationResult = { user: null, session: null };

  let sessionCookie: undefined | string = undefined;

  if (cookie && typeof cookie.value === "string" && cookie.value.length > 0) {
    const token = cookie.value;

    const result = await fetch("http://localhost:4000/verifyAuth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const cookies = result.headers.getSetCookie();

    sessionCookie = cookies[0];

    userData = await result.json();
  }

  const { user, session } = userData;

  console.log(userData);

  let response = NextResponse.next();

  if (!user && !pathIsPublic) {
    response = NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && session && session.verified && pathIsPublic) {
    response = NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    user &&
    session &&
    !session.verified &&
    !path.startsWith("/check-email-confirmation") &&
    !path.startsWith("/verifyEmail")
  ) {
    response = NextResponse.redirect(
      new URL("/check-email-confirmation", request.url),
    );
  }

  if (sessionCookie) {
    response.headers.set("Set-Cookie", sessionCookie);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
