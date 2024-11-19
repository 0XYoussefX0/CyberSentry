import {
  isAdmin,
  isAuthenticated,
  isUnverifiedUser,
} from "@/actions/auth/middlewares";
import { createSafeActionClient } from "next-safe-action";
import { valibotAdapter } from "next-safe-action/adapters/valibot";

export const actionClient = createSafeActionClient({
  validationAdapter: valibotAdapter(),
  handleServerError: (e) => {
    return e.message;
  },
});

export const publicClient = actionClient;

export const privateClient = actionClient.use(isAuthenticated);

export const isAdminClient = actionClient.use(isAdmin);

export const isUnverifiedClient = actionClient.use(isUnverifiedUser);
