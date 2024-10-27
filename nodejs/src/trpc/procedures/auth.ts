import { adminProcedure, publicProcedure } from "@/trpc/router.js";
import { LoginSchema, SignUpSchema } from "@/types/valibot-schemas.js";
import * as v from "valibot";
import { db } from "@/config/drizzle.js";
import { generateIdFromEntropySize } from "lucia";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/config/auth.js";
import { hash, verify } from "@node-rs/argon2";
import { userTable } from "@/models/user.js";
import { eq } from "drizzle-orm";
import {
  getPublicUrl,
  minioClient,
  PROFILE_PICTURES_BUCKET_NAME,
} from "@/config/minio.js";

import { zxcvbnAsync, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnArPackage from "@zxcvbn-ts/language-ar";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";

import { matcherPwnedFactory } from "@zxcvbn-ts/matcher-pwned";
import { randomUUID } from "crypto";

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
          "This password would be too easy to guess. Please choose a different password."
      );
    }

    return result.output;
  })
  .mutation(async ({ input }) => {
    const { username, password, role, tag, email, user_image } = input;

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = randomUUID();

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

    let image_url = null;

    if (user_image) {
      const image_file_name = `${userId}.${user_image.type}`;
      const user_image_buffer = Buffer.from(await user_image.arrayBuffer());

      await minioClient.putObject(
        PROFILE_PICTURES_BUCKET_NAME,
        image_file_name,
        user_image_buffer
      );

      image_url = getPublicUrl(PROFILE_PICTURES_BUCKET_NAME, image_file_name);
    }

    await db.insert(userTable).values({
      id: userId,
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

export const logIn = publicProcedure
  .input(v.parser(LoginSchema))
  .mutation(async ({ input, ctx }) => {
    const { password, email, rememberMe } = input;

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
      const isValid = await verify(user.password_hash ?? dummyHash, password);

      if (!user || !isValid) {
        return {
          error: "Invalid email or password. Please try again.",
        };
      }

      const token = generateSessionToken();
      const session = await createSession(token, user.id, rememberMe);
      setSessionTokenCookie(ctx.res, token, session.expiresAt, rememberMe);

      return {
        success: true,
      };
    } catch (e) {
      return {
        error: "An error occurred during login. Please try again.",
      };
    }
  });
