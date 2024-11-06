import { adminProcedure, publicProcedure } from "../index.js";

import { LoginSchema, SignUpSchema } from "@pentest-app/schemas/server";
import * as v from "valibot";

import { createAuthService } from "@pentest-app/auth/index";
import { userTable } from "@pentest-app/db/user";

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
import { TRPCError } from "@trpc/server";
import { matcherPwnedFactory } from "@zxcvbn-ts/matcher-pwned";

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
    const { db, res } = ctx;

    const result = await db
      .select({
        id: userTable.id,
        password_hash: userTable.password_hash,
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

      const auth = createAuthService(db);

      const token = auth.generateSessionToken();
      const session = await auth.createSession(token, user.id, remember_me);
      auth.setSessionTokenCookie(res, token, session.expiresAt, remember_me);

      return {
        data: {
          access_token: token,
        },
      };
    } catch (e) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "An error occurred during login. Please try again.",
      });
    }
  });
