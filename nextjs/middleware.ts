import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createSessionClient } from "./lib/appwrite/server";
import { getUser } from "@/lib/appwrite/utils";

import { DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/env";

const publicPaths = ["/signup", "/login", "/forgotpassword", "/resetpassword"];

export async function middleware(request: NextRequest) {
  const { account, databases } = await createSessionClient();
  const user = await getUser(account);

  const currentRoute = request.nextUrl.pathname;

  const currentRouteIsPublic = publicPaths.some(
    (route) => currentRoute === route
  );

  if (!user && !currentRouteIsPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && currentRouteIsPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (
    user &&
    !currentRouteIsPublic &&
    currentRoute !== "/onboarding" &&
    currentRoute !== "/confirmEmail"
  ) {
    try {
      const { completed_onboarding } = await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id
      );

      if (!completed_onboarding) {
        const url = request.nextUrl.clone();
        url.pathname = "/onboarding";
        return NextResponse.redirect(url);
      }
    } catch (e) {
      const url = request.nextUrl.clone();
      url.pathname = "/error";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
