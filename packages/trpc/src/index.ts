import type { Context } from "@pentest-app/types/server";
import { initTRPC } from "@trpc/server";

export const t = initTRPC.context<Context>().create();

export const isAdminMiddleware = t.middleware(({ ctx, next }) => {
  return next();
});

export const adminProcedure = t.procedure.use(isAdminMiddleware);
export const publicProcedure = t.procedure;
