import { sessionTable, userTable } from "@/models/user.js";
import { appRouter } from "@/trpc/router.js";
import type { InferSelectModel } from "drizzle-orm";

export type AppRouter = typeof appRouter;

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;

export type SessionValidationResult =
  | { session: Session; user: User }
  | {
      session: null;
      user: null;
    };
