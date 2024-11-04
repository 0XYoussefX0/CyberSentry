import { sessionTable, userTable } from "@pentest-app/db/user";

import type { Session } from "@pentest-app/types/server";

import { hash } from "@node-rs/argon2";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { eq } from "drizzle-orm";

import type {
  AuthService,
  CreateAuthServiceFunc,
} from "@pentest-app/types/global";

export const createAuthService: CreateAuthServiceFunc = (db) => {
  const generateSessionToken = () => {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
  };

  const createSession: AuthService["createSession"] = async (
    token,
    user_id,
    remember_me,
  ) => {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );
    const month = 1000 * 60 * 60 * 24 * 30;
    const session: Session = {
      id: sessionId,
      user_id,
      remember_me,
      expiresAt: new Date(Date.now() + month),
    };

    await db.insert(sessionTable).values(session);
    return session;
  };

  const validateSessionToken: AuthService["validateSessionToken"] = async (
    token,
  ) => {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );
    const result = await db
      .select()
      .from(sessionTable)
      .innerJoin(userTable, eq(sessionTable.user_id, userTable.id))
      .where(eq(sessionTable.id, sessionId));

    if (!result[0]) {
      return { session: null, user: null };
    }

    const { user, session } = result[0];

    const sessionExpiry = session.expiresAt.getTime();
    const month = 1000 * 60 * 60 * 24 * 30;

    if (Date.now() >= sessionExpiry) {
      await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
      return { session: null, user: null };
    }

    if (Date.now() > sessionExpiry - month / 2) {
      session.expiresAt = new Date(Date.now() + month);
      await db
        .update(sessionTable)
        .set({
          expiresAt: session.expiresAt,
        })
        .where(eq(sessionTable.id, session.id));
    }

    return { session, user };
  };

  const invalidateSession: AuthService["invalidateSession"] = async (
    sessionId,
  ) => {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
  };

  const setSessionTokenCookie: AuthService["setSessionTokenCookie"] = async (
    res,
    token,
    expiresAt,
    rememberMe,
  ) => {
    res.cookie("session", token, {
      httpOnly: true,
      sameSite: "lax",
      expires: rememberMe ? expiresAt : undefined,
      path: "/",
      secure: process.env.ENV === "production",
    });
  };

  const deleteSessionTokenCookie: AuthService["deleteSessionTokenCookie"] = (
    res,
  ) => {
    res.cookie("session", "", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 0,
      path: "/",
      secure: process.env.ENV === "production",
    });
  };

  const signTheAdminUp: AuthService["signTheAdminUp"] = async (
    adminCredentials,
  ) => {
    if (!adminCredentials) {
      throw new Error("Admin configuration not provided");
    }

    const { email, password, role, username, tag } = adminCredentials;

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const result = await db
      .select({
        userId: userTable.id,
      })
      .from(userTable)
      .where(eq(userTable.email, email));

    if (result[0]) {
      await db
        .delete(sessionTable)
        .where(eq(sessionTable.user_id, result[0].userId));

      await db.delete(userTable).where(eq(userTable.id, result[0].userId));
    }

    await db.insert(userTable).values({
      username,
      tag,
      role,
      user_image: null,
      email,
      password_hash: passwordHash,
      is_admin: true,
    });
  };

  const checkAuth: AuthService["checkAuth"] = async (req, res, next) => {
    const token = req.cookies.session;
    if (token === null) {
      return res.status(401).json("Unauthorized access");
    }

    const { session } = await validateSessionToken(token);
    if (session === null) {
      deleteSessionTokenCookie(res);
      return res.status(401).json("Unauthorized access");
    }

    setSessionTokenCookie(res, token, session.expiresAt, session.remember_me);
    next();
  };

  return {
    generateSessionToken,
    createSession,
    validateSessionToken,
    invalidateSession,
    setSessionTokenCookie,
    deleteSessionTokenCookie,
    signTheAdminUp,
    checkAuth,
  };
};
