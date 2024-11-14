import { t } from "./index.js";
import {
  decryptString,
  encryptString,
  login,
  logout,
  resendConfirmationEmail,
  resendResetEmail,
  resetPassword,
  sendResetEmail,
  signUserUp,
  verifyConfirmationEmailToken,
  verifyResetEmailToken,
} from "./procedures/auth.js";

export const appRouter = t.router({
  signUserUp,
  login,
  resendConfirmationEmail,
  resetPassword,
  sendResetEmail,
  logout,
  resendResetEmail,
  encryptString,
  decryptString,
  verifyResetEmailToken,
  verifyConfirmationEmailToken,
});

export type AppRouter = typeof appRouter;
