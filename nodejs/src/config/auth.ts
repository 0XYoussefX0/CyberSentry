import { sessionTable, userTable } from "@/models/user.js";
import { db } from "@/config/drizzle.js";
import type { Session, SessionValidationResult } from "@/types/index.js";

import { Response } from "express";

import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { eq } from "drizzle-orm";
import { hash } from "@node-rs/argon2";
import { randomUUID } from "crypto";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: string,
  rememberMe: boolean
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const month = 1000 * 60 * 60 * 24 * 30;
  const session: Session = {
    id: sessionId,
    userId,
    rememberMe,
    expiresAt: new Date(Date.now() + month),
  };

  await db.insert(sessionTable).values(session);
  return session;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select()
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));

  if (result.length < 1) {
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
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export function setSessionTokenCookie(
  res: Response,
  token: string,
  expiresAt: Date,
  rememberMe: boolean
): void {
  res.cookie("session", token, {
    httpOnly: true,
    sameSite: "lax",
    expires: rememberMe ? expiresAt : undefined,
    path: "/",
    secure: process.env.ENV === "production",
  });
}

export function deleteSessionTokenCookie(res: Response): void {
  res.cookie("session", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
    secure: process.env.ENV === "production",
  });
}

export async function signTheAdminUp() {
  const email = process.env.ADMIN_APP_EMAIL!;
  const password = process.env.ADMIN_APP_PASSWORD!;
  const role = process.env.ADMIN_APP_ROLE!;
  const username = process.env.ADMIN_APP_USERNAME!;
  const tag = process.env.ADMIN_APP_TAG!;

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
      .where(eq(sessionTable.userId, result[0].userId));

    await db.delete(userTable).where(eq(userTable.id, result[0].userId));
  }

  await db.insert(userTable).values({
    username,
    tag,
    role,
    user_image: null,
    email,
    password_hash: passwordHash,
    isAdmin: true,
  });
}
