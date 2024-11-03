import type { DB } from "@pentest-app/db/drizzle";
import type { NextFunction, Request, Response } from "express";
import type { Session, SessionValidationResult } from "./server.mjs";

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
  validateSessionToken: (token: string) => Promise<SessionValidationResult>;
  invalidateSession: (sessionId: string) => Promise<void>;
  setSessionTokenCookie: (
    res: Response,
    token: string,
    expiresAt: Date,
    rememberMe: boolean,
  ) => void;
  deleteSessionTokenCookie: (res: Response) => void;
  signTheAdminUp: (adminCredentials: AdminCredentials) => Promise<void>;
  checkAuth: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response<any, Record<string, any>> | undefined>;
};

export type CreateAuthServiceFunc = (db: DB) => AuthService;
