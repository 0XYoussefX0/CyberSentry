import { t } from "./index.js";
import { login, signUserUp } from "./procedures/auth.js";

export const appRouter = t.router({
  signUserUp,
  login,
});

export type AppRouter = typeof appRouter;
