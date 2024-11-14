import type { Context } from "@pentest-app/types/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { ValiError } from "valibot";

export const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        valibotError:
          error.code === "BAD_REQUEST" && error.cause instanceof ValiError
            ? error.cause.issues
            : null,
      },
    };
  },
});

export const isAdminMiddleware = t.middleware(async ({ ctx, next }) => {
  const { auth, cookies } = ctx;
  const { session, user } = await auth.validateSessionToken(cookies);
  if (!user || !user.is_admin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      user,
      session,
    },
  });
});

export const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const { auth, cookies } = ctx;
  const { session, user } = await auth.validateSessionToken(cookies);
  if (!user || !session.verified) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      user,
      session,
    },
  });
});

export const isUnverifiedUser = t.middleware(async ({ ctx, next }) => {
  const { auth, cookies } = ctx;
  const { session, user } = await auth.validateSessionToken(cookies);
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      user,
      session,
    },
  });
});

export const adminProcedure = t.procedure.use(isAdminMiddleware);
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthenticated);
export const unverfiedProcedure = t.procedure.use(isUnverifiedUser);
