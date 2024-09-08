import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import auth from "@/lib/auth";

const publicPaths = ["/signup", "/login", "/forgotpassword", "/resetpassword"];

export async function middleware(request: NextRequest) {
  const { user } = await auth.getUser();

  const currentRoute = request.nextUrl.pathname;

  // if (!user && !publicPaths.some((route) => currentRoute.startsWith(route))) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

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
