"use server";

import {
  isAdminClient,
  isUnverifiedClient,
  privateClient,
  publicClient,
} from "@/actions/auth/clients";

import { userTable } from "@pentest-app/db/user";

import {
  EncryptedDataSchema,
  LoginSchema,
  PasswordSchema,
  SignUpSchema,
} from "@pentest-app/schemas/server";

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

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
} from "crypto";

import { EmailSchema } from "@pentest-app/schemas/client";
import { matcherPwnedFactory } from "@zxcvbn-ts/matcher-pwned";

import {
  ALGORITHM,
  ENCRYPTION_KEY,
  auth,
  db,
  isProduction,
  minio,
  minioHost,
  resend,
} from "@/actions/config";
import type {
  PasswordSchemaType,
  SignUpSchemaType,
} from "@pentest-app/types/server";
import { cookies } from "next/headers";

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

export const signUserUp = isAdminClient
  .schema(SignUpSchema)
  .use(async ({ next, clientInput }) => {
    const { username, password, role, tag, email } =
      clientInput as SignUpSchemaType;

    const passwordResult = await zxcvbnAsync(password, [
      username,
      role,
      tag,
      email,
    ]);

    if (passwordResult.score < 2) {
      // should throw a validation error
      throw new Error(
        passwordResult.feedback.warning ||
          "This password would be too easy to guess. Please choose a different password.",
      );
    }

    return next();
  })
  .action(async ({ parsedInput }) => {
    const { username, password, role, tag, email, user_image } = parsedInput;

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

export const login = publicClient
  .schema(LoginSchema)
  .action(async ({ parsedInput }) => {
    const { password, email, remember_me } = parsedInput;

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
        throw new Error("Invalid email or password. Please try again.");
      }

      const cookiesStore = cookies();

      const token = auth.generateSessionToken();
      const session = await auth.createSession(token, user.id, remember_me);
      auth.setSessionTokenCookie(
        token,
        session.expiresAt,
        remember_me,
        cookiesStore,
      );
      auth.sendConfirmationEmail(resend, email, user.name, session.id);

      return {
        access_token: token,
      };
    } catch (e) {
      throw new Error("An error occurred during login. Please try again.");
    }
  });

export const logout = isUnverifiedClient.action(async ({ ctx }) => {
  const { session } = ctx;
  const cookiesStore = cookies();

  await auth.invalidateSession(session.id, cookiesStore);
  return {
    status: "success",
  };
});

export const sendConfirmationEmail = isUnverifiedClient.action(
  async ({ ctx }) => {
    const {
      user: { username, email },
      session: { id },
    } = ctx;

    await auth.sendConfirmationEmail(resend, email, username, id);

    return {
      status: "success",
    };
  },
);

export const sendResetEmail = publicClient
  .schema(EmailSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    const result = await auth.sendResetEmail(resend, email);

    if (result.status === "success") {
      const response = await encryptString({ email });

      return {
        email: response?.data,
      };
    }

    throw new Error("Something went wrong, Try again!");
  });

export const resetPassword = privateClient
  .schema(PasswordSchema)
  .use(async ({ next, ctx, clientInput }) => {
    const {
      user: { username, role, tag, email },
    } = ctx;

    const { password } = clientInput as PasswordSchemaType;

    const passwordResult = await zxcvbnAsync(password, [
      username,
      role,
      tag,
      email,
    ]);

    if (passwordResult.score < 2) {
      // should throw a validation error
      throw new Error(
        passwordResult.feedback.warning ||
          "This password would be too easy to guess. Please choose a different password.",
      );
    }

    return next({
      ctx: {
        input: { password },
      },
    });
  })
  .action(async ({ ctx }) => {
    const {
      user: { email },
      input: { password },
    } = ctx;

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

export const encryptString = publicClient
  .schema(EmailSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    const iv = randomBytes(16);
    const cipher = createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(email, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
  });

export const decryptString = publicClient
  .schema(EncryptedDataSchema)
  .action(async ({ parsedInput }) => {
    const { iv, encryptedData } = parsedInput;

    const decipher = createDecipheriv(
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
