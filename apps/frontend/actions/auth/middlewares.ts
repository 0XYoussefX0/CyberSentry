import { auth } from "@/actions/config";
import { createMiddleware } from "next-safe-action";
import { cookies } from "next/headers";

export const isAdmin = createMiddleware().define(async ({ next }) => {
  const cookiesStore = cookies();

  const { session, user } = await auth.getUser(cookiesStore);

  if (!user || !user.is_admin) {
    throw new Error("Unauthorized");
  }

  return next({
    ctx: {
      user,
      session,
    },
  });
});

export const isAuthenticated = createMiddleware().define(async ({ next }) => {
  const cookiesStore = cookies();

  const { session, user } = await auth.getUser(cookiesStore);

  if (!user || !session.verified) {
    throw new Error("Unauthorized");
  }

  return next({
    ctx: {
      user,
      session,
    },
  });
});

export const isUnverifiedUser = createMiddleware().define(async ({ next }) => {
  const cookiesStore = cookies();

  const { session, user } = await auth.getUser(cookiesStore);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return next({
    ctx: {
      user,
      session,
    },
  });
});
