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
  CreateAuthServiceArgs,
} from "@pentest-app/types/global";

import { ConfirmSession } from "@pentest-app/emailtemplates/ConfirmSession";
import { ResetPassword } from "@pentest-app/emailtemplates/ResetPassword";

export function createAuthService({
  db,
  isProduction,
  domainName,
}: CreateAuthServiceArgs): AuthService {
  return {
    generateSessionToken: () => {
      const bytes = new Uint8Array(20);
      crypto.getRandomValues(bytes);
      const token = encodeBase32LowerCaseNoPadding(bytes);
      return token;
    },
    createSession: async (token, user_id, remember_me) => {
      const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token)),
      );
      const month = 1000 * 60 * 60 * 24 * 30;
      const session: Session = {
        id: sessionId,
        user_id,
        remember_me,
        expiresAt: new Date(Date.now() + month),
        token: null,
        token_expiration: null,
        verified: false,
      };

      await db.insert(sessionTable).values(session);
      return session;
    },
    validateSessionToken: async function (cookies) {
      const token = cookies.get("session");

      if (!token || token.length !== 32) {
        this.deleteSessionTokenCookie(cookies);
        return { session: null, user: null };
      }

      const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token)),
      );

      const result = await db
        .select()
        .from(sessionTable)
        .innerJoin(userTable, eq(sessionTable.user_id, userTable.id))
        .where(eq(sessionTable.id, sessionId));

      if (!result[0]) {
        this.deleteSessionTokenCookie(cookies);
        return { session: null, user: null };
      }

      const { user, session } = result[0];

      const sessionExpiry = session.expiresAt.getTime();
      const month = 1000 * 60 * 60 * 24 * 30;

      if (Date.now() >= sessionExpiry) {
        this.invalidateSession(session.id, cookies);
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

      this.setSessionTokenCookie(
        token,
        session.expiresAt,
        session.remember_me,
        cookies,
      );
      return { session, user };
    },
    invalidateSession: async function (sessionId, cookies) {
      await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
      this.deleteSessionTokenCookie(cookies);
    },
    setSessionTokenCookie: async (token, expiresAt, rememberMe, cookies) => {
      cookies.set("session", token, {
        httpOnly: true,
        sameSite: isProduction ? "lax" : "none",
        expires: rememberMe ? expiresAt : undefined,
        path: "/",
        secure: true,
      });
    },
    deleteSessionTokenCookie: (cookies) => {
      cookies.set("session", "", {
        httpOnly: true,
        sameSite: isProduction ? "lax" : "none",
        maxAge: 0,
        path: "/",
        secure: true,
      });
    },
    signTheAdminUp: async (adminCredentials) => {
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
    },

    sendConfirmationEmail: async function (resend, email, name, sessionID) {
      const token = this.generateSessionToken();
      const verifyLink = this.generateLink({
        path: "/verifyEmail",
        queryParams: `token=${token}`,
      });
      const hour = 1 * 60 * 60 * 1000;

      await db
        .update(sessionTable)
        .set({
          token,
          token_expiration: new Date(Date.now() + hour / 2),
        })
        .where(eq(sessionTable.id, sessionID));

      await resend.emails.send({
        from: "CyberSentry <team@cybersentry.tech>",
        to: [email],
        subject: "Confirm Your Email",
        react: ConfirmSession({ name, verifyLink }),
      });
    },

    sendResetEmail: async function (resend, email) {
      const reset_token = this.generateSessionToken();
      const hour = 1 * 60 * 60 * 1000;

      const result = await db
        .update(userTable)
        .set({
          reset_token,
          reset_token_expires_at: new Date(Date.now() + hour / 2),
        })
        .where(eq(userTable.email, email))
        .returning({ name: userTable.username, userID: userTable.id });

      const name = result[0]?.name ?? "ogabonga";
      const userID = result[0]?.userID ?? "02dsds1d5zd1az4e5za";

      const reset_link = this.generateLink({
        path: "/resetpassword",
        queryParams: `userID=${userID}&token=${reset_token}`,
      });

      await resend.emails.send({
        from: "CyberSentry <team@cybersentry.tech>",
        to: [email],
        subject: "Reset Your Password",
        react: ResetPassword({ name, reset_link }),
      });

      return {
        status: "success",
      };
    },

    verifyConfirmationEmailToken: async (token, sessionID) => {
      const storedToken = await db
        .select({
          token: sessionTable.token,
          token_expiration: sessionTable.token_expiration,
        })
        .from(sessionTable)
        .where(eq(sessionTable.id, sessionID));

      const result = token === storedToken[0]?.token;
      const expiry =
        storedToken[0]?.token_expiration instanceof Date
          ? storedToken[0]?.token_expiration.getTime()
          : null;

      if (!result || (expiry && Date.now() >= expiry)) {
        return {
          status: "invalid",
        };
      }

      await db
        .update(sessionTable)
        .set({
          verified: true,
        })
        .where(eq(sessionTable.id, sessionID));

      return { status: "valid" };
    },

    verifyResetEmailToken: async (token, userID) => {
      const storedToken = await db
        .select({
          token: userTable.reset_token,
          token_expiration: userTable.reset_token_expires_at,
        })
        .from(userTable)
        .where(eq(userTable.id, userID));

      const result = token === storedToken[0]?.token;
      const expiry =
        storedToken[0]?.token_expiration instanceof Date
          ? storedToken[0]?.token_expiration.getTime()
          : null;

      if (!result || (expiry && Date.now() >= expiry)) {
        return {
          status: "invalid",
        };
      }

      return { status: "valid" };
    },

    generateLink: ({ path, queryParams }) =>
      `${isProduction ? `https://${domainName}` : "http://localhost:3000"}${path}?${queryParams}`,

    verifySession: async (sessionID) => {
      await db
        .update(sessionTable)
        .set({
          verified: true,
        })
        .where(eq(sessionTable.id, sessionID));
    },
  };
}
