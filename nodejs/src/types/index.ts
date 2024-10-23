import { lucia } from "@/config/auth.js";
import { appRouter } from "@/trpc/router.js";

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
