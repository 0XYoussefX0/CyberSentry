import {
  adminProcedure,
  privateProcedure,
  publicProcedure,
  unverfiedProcedure,
} from "../index.js";

import { userTable } from "@pentest-app/db/user";
import {
  EncryptedDataSchema,
  LoginSchema,
  PasswordSchema,
  ResetURLParamsSchema,
  SignUpSchema,
  TokenSchema,
} from "@pentest-app/schemas/server";
import * as v from "valibot";

import { hash, verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";

import {
  PROFILE_PICTURES_BUCKET_NAME,
  getPublicUrl,
} from "@pentest-app/minio/index";

import { zxcvbnAsync, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnArPackage from "@zxcvbn-ts/language-ar";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";

import { randomUUID } from "node:crypto";
import { EmailSchema } from "@pentest-app/schemas/client";
import { TRPCError } from "@trpc/server";
import { matcherPwnedFactory } from "@zxcvbn-ts/matcher-pwned";

import crypto from "node:crypto";

const matcherPwned = matcherPwnedFactory(fetch, zxcvbnOptions);

zxcvbnOptions.setOptions({
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
    ...zxcvbnArPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  useLevenshteinDistance: true,
  translations: zxcvbnEnPackage.translations,
  maxLength: 64,
});

zxcvbnOptions.addMatcher("pwned", matcherPwned);

export const signUserUp = adminProcedure
  .input(async (formData) => {
    if (!(formData instanceof FormData)) {
      throw new Error("data is not a formData");
    }

    const data: { [key: string]: any } = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    const result = await v.safeParseAsync(SignUpSchema, data);

    if (!result.success) {
      // get the error message from the result
      throw new Error("Invalid data");
    }

    const { username, password, role, tag, email } = result.output;

    const passwordResult = await zxcvbnAsync(password, [
      username,
      role,
      tag,
      email,
    ]);

    if (passwordResult.score < 2) {
      // throw a trpc error
      throw new Error(
        passwordResult.feedback.warning ||
          "This password would be too easy to guess. Please choose a different password.",
      );
    }

    return result.output;
  })
  .mutation(async ({ input, ctx }) => {
    const { username, password, role, tag, email, user_image } = input;
    const { db, minio, minioHost, isProduction } = ctx;

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
      return {
        error: "An account with this email already exists.",
      };
    }

    let image_url: string | null = null;

    if (user_image) {
      const image_file_name = `${randomUUID()}.${user_image.type}`;
      const user_image_buffer = Buffer.from(await user_image.arrayBuffer());

      await minio.putObject(
        PROFILE_PICTURES_BUCKET_NAME,
        image_file_name,
        user_image_buffer,
      );

      image_url = getPublicUrl(
        PROFILE_PICTURES_BUCKET_NAME,
        image_file_name,
        minioHost,
        isProduction ? "https" : "http",
      );
    }

    await db.insert(userTable).values({
      username,
      tag,
      role,
      user_image: image_url,
      email,
      password_hash: passwordHash,
    });

    return {
      success: true,
    };
  });

export const login = publicProcedure
  .input(v.parser(LoginSchema))
  .mutation(async ({ input, ctx }) => {
    const { password, email, remember_me } = input;
    const { db, resend, auth, cookies } = ctx;

    const result = await db
      .select({
        id: userTable.id,
        password_hash: userTable.password_hash,
        name: userTable.username,
      })
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    const user = result[0];

    const dummyHash =
      "$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    try {
      const isValid = await verify(user?.password_hash ?? dummyHash, password);

      if (!user || !isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid email or password. Please try again.",
        });
      }

      const token = auth.generateSessionToken();
      const session = await auth.createSession(token, user.id, remember_me);
      auth.setSessionTokenCookie(
        token,
        session.expiresAt,
        remember_me,
        cookies,
      );
      auth.sendConfirmationEmail(resend, email, user.name, session.id);

      return {
        access_token: token,
      };
    } catch (e) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "An error occurred during login. Please try again.",
      });
    }
  });

export const resendConfirmationEmail = unverfiedProcedure.mutation(
  async ({ ctx }) => {
    const {
      auth,
      resend,
      user: { username, email },
      session: { id },
    } = ctx;

    await auth.sendConfirmationEmail(resend, email, username, id);

    return {
      status: "success",
    };
  },
);

export const sendResetEmail = publicProcedure
  .input(v.parser(EmailSchema))
  .mutation(async ({ input, ctx }) => {
    const { email } = input;
    const { auth, resend } = ctx;

    return await auth.sendResetEmail(resend, email);
  });

export const resendResetEmail = publicProcedure
  .input(v.parser(EmailSchema))
  .mutation(async ({ input, ctx }) => {
    const { email } = input;
    const { auth, resend } = ctx;

    return await auth.sendResetEmail(resend, email);
  });

export const resetPassword = privateProcedure
  .input(async (input) => {
    const result = v.safeParse(PasswordSchema, input);

    if (!result.success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        // get the error message from the result.issues
      });
    }

    return result.output;
  })
  .mutation(async ({ input, ctx }) => {
    const { user, db } = ctx;

    const { password } = input;

    const { username, role, tag, email } = user;

    const passwordResult = await zxcvbnAsync(password, [
      username,
      role,
      tag,
      email,
    ]);

    if (passwordResult.score < 2) {
      // throw a trpc error
      throw new Error(
        passwordResult.feedback.warning ||
          "This password would be too easy to guess. Please choose a different password.",
      );
    }

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const result = await db
      .update(userTable)
      .set({
        password_hash: passwordHash,
      })
      .where(eq(userTable.email, email));

    return {
      status: "success",
    };
  });

export const logout = privateProcedure.mutation(async ({ ctx }) => {
  const { auth, session, cookies } = ctx;
  await auth.invalidateSession(session.id, cookies);
  return {
    status: "success",
  };
});

const ALGORITHM = "aes-256-cbc";

export const encryptString = publicProcedure
  .input(v.parser(EmailSchema))
  .mutation(({ input, ctx }) => {
    const { ENCRYPTION_KEY } = ctx;
    const { email } = input;

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(email, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv}$${encrypted}`;
  });

export const decryptString = publicProcedure
  .input(v.parser(EncryptedDataSchema))
  .mutation(({ input, ctx }) => {
    const { ENCRYPTION_KEY } = ctx;
    const { iv, encryptedData } = input;

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      ENCRYPTION_KEY,
      Buffer.from(iv, "hex"),
    );

    let decryptedData = decipher.update(encryptedData, "hex", "utf8");

    decryptedData += decipher.final("utf8");

    return {
      decryptedData,
    };
  });

export const verifyResetEmailToken = publicProcedure
  .input(v.parser(ResetURLParamsSchema))
  .mutation(async ({ input, ctx }) => {
    const { token, userID } = input;
    const { auth, cookies } = ctx;

    const result = await auth.verifyResetEmailToken(token, userID);

    if (result.status === "valid") {
      const authToken = auth.generateSessionToken();
      const session = await auth.createSession(authToken, userID, false);
      auth.setSessionTokenCookie(authToken, session.expiresAt, false, cookies);
      await auth.verifySession(session.id);

      return {
        status: "sucess",
      };
    }

    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid Token",
    });
  });

export const verifyConfirmationEmailToken = unverfiedProcedure
  .input(v.parser(TokenSchema))
  .mutation(async ({ input, ctx }) => {
    const { token } = input;
    const { auth, session } = ctx;

    return await auth.verifyConfirmationEmailToken(token, session.id);
  });
