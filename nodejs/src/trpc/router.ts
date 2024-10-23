import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export const createContext = ({ res }: CreateExpressContextOptions) => {
  return { res };
};

export const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create();

export const appRouter = t.router({});
