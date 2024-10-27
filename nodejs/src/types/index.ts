import { lucia } from "@/config/auth.js";
import { sessionTable, userTable } from "@/models/user.js";
import { appRouter } from "@/trpc/router.js";
import type { InferSelectModel } from "drizzle-orm";

export type AppRouter = typeof appRouter;

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
}

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;

export type SessionValidationResult =
  | { session: Session; user: User }
  | {
      session: null;
      user: null;
    };
