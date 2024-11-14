import type { DB } from "@pentest-app/db/drizzle";
import type { CookieOptions } from "express";
import type { Resend } from "resend";
import type { Session, SessionValidationResult } from "./server.js";

type AdminCredentials = {
  email: string;
  password: string;
  role: string;
  username: string;
  tag: string;
};

export type AuthService = {
  generateSessionToken: () => string;
  createSession: (
    token: string,
    user_id: string,
    remember_me: boolean,
  ) => Promise<Session>;
  validateSessionToken: (cookies: Cookies) => Promise<SessionValidationResult>;
  invalidateSession: (sessionId: string, cookies: Cookies) => Promise<void>;
  setSessionTokenCookie: (
    token: string,
    expiresAt: Date,
    rememberMe: boolean,
    cookies: Cookies,
  ) => void;
  deleteSessionTokenCookie: (cookies: Cookies) => void;
  signTheAdminUp: (adminCredentials: AdminCredentials) => Promise<void>;
  sendConfirmationEmail: (
    resend: Resend,
    email: string,
    name: string,
    sessionID: string,
  ) => Promise<void>;
  verifyConfirmationEmailToken: (
    token: string,
    sessionID: string,
  ) => Promise<{ status: "valid" | "invalid" }>;
  sendResetEmail: (
    resend: Resend,
    email: string,
  ) => Promise<{
    status: "success";
  }>;
  verifyResetEmailToken: (
    token: string,
    userID: string,
  ) => Promise<{ status: "valid" | "invalid" }>;
  generateLink: ({
    path,
    queryParams,
  }: { path: string; queryParams: string }) => string;
  verifySession: (sessionID: string) => Promise<void>;
};

export type Cookies = {
  set: (name: string, value: string, options: CookieOptions) => void;
  get: (name: string) => string | undefined;
};

export type CreateAuthServiceArgs = {
  db: DB;
  isProduction: boolean;
  domainName: string;
};
