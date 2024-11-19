"use server";

import { cookies } from "next/headers";

export async function testCookieAction() {
  const cookieStore = cookies();

  // Try setting a simple cookie
  cookieStore.set("test-cookie", "test-value", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600, // 1 hour
  });

  // Try getting the cookie we just set
  const testCookie = cookieStore.get("test-cookie");

  return testCookie ? testCookie.value : "Cookie not set";
}
