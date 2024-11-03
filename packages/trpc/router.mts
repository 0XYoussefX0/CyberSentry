import type { Context } from "@pentest-app/types/server";
import { initTRPC } from "@trpc/server";
import { login, signUserUp } from "./procedures/auth.mjs";

export const t = initTRPC.context<Context>().create();

export const isAdminMiddleware = t.middleware(({ ctx, next }) => {
  return next();
});

export const adminProcedure = t.procedure.use(isAdminMiddleware);
export const publicProcedure = t.procedure;

export const appRouter = t.router({
  signUserUp,
  login,
});

export type AppRouter = typeof appRouter;
