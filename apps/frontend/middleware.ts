import type { SessionValidationResult } from "@pentest-app/types/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getProtectionLevel(
  currentPath: string,
): "public" | "partialPrivate" | "private" {
  const partialPrivateRoutes = ["/check-email-confirmation"];
  const publicRoutes = [
    "/home",
    "/login",
    "/forgotpassword",
    "/check-email-reset",
  ];

  if (partialPrivateRoutes.includes(currentPath)) return "partialPrivate";
  if (publicRoutes.includes(currentPath)) return "public";
  return "private";
}

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  const protectionLevel = getProtectionLevel(currentPath);

  const cookiesStore = cookies();

  const sessionCookie = cookiesStore.get("session");

  let user = null;
  let session = null;
  let apiResponse: Response | undefined = undefined;

  if (sessionCookie) {
    apiResponse = await fetch(new URL("/api/validateSession", request.url), {
      method: "POST",
      body: JSON.stringify({ token: sessionCookie.value }),
    });

    const result = (await apiResponse.json()) as SessionValidationResult;

    user = result.user;
    session = result.session;
  }

  let response = NextResponse.next();

  if (protectionLevel === "public") {
    if (user && session?.verified)
      response = NextResponse.redirect(new URL("/dashboard", request.url));
    else if (user && !session?.verified)
      response = NextResponse.redirect(
        new URL("/check-email-confirmation", request.url),
      );
  }

  if (protectionLevel === "partialPrivate") {
    if (!user) response = NextResponse.redirect(new URL("/login", request.url));
    else if (session?.verified)
      response = NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (protectionLevel === "private") {
    if (!user) response = NextResponse.redirect(new URL("/login", request.url));
    else if (!session?.verified)
      response = NextResponse.redirect(
        new URL("/check-email-confirmation", request.url),
      );
  }

  if (apiResponse) {
    const newCookies = apiResponse.headers.getSetCookie();

    const authCookie = newCookies[0];

    response.headers.append("Set-Cookie", authCookie);
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
