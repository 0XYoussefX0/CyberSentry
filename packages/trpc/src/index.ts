import type { Context } from "@pentest-app/types/server";
import { initTRPC } from "@trpc/server";
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

export const isAdminMiddleware = t.middleware(({ ctx, next }) => {
  return next();
});

export const adminProcedure = t.procedure.use(isAdminMiddleware);
export const publicProcedure = t.procedure;
