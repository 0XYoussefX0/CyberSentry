import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create();

export const appRouter = t.router({});

export const createContext = ({ res }: CreateExpressContextOptions) => {
  return { res };
};

export const isAdminMiddleware = t.middleware(({ ctx, next }) => {
  return next();
});

export const adminProcedure = t.procedure.use(isAdminMiddleware);
export const publicProcedure = t.procedure;
