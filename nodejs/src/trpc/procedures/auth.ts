import { t } from "@/trpc/router.js";
import { SignUpSchema } from "@/types/valibot-schemas.js";
import * as v from "valibot";
import { db } from "@/config/drizzle.js";
import { generateIdFromEntropySize } from "lucia";
import { lucia } from "@/config/auth.js";
import { hash } from "@node-rs/argon2";
import { userTable } from "@/models/user.js";
import { eq } from "drizzle-orm";

const isAdminMiddleware = t.middleware(({ ctx, next }) => {
  return next();
});

const adminProcedure = t.procedure.use(isAdminMiddleware);

export const signUserUp = adminProcedure
  .input(v.parserAsync(SignUpSchema))
  .mutation(async ({ input, ctx }) => {
    const { username, password, role, tag, email, user_image } = input;

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    const userId = generateIdFromEntropySize(10); // 16 characters long

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

    // upload the image to the storage bucket

    // get the url of the image

    // insert the url in the table along with all of the user data

    await db.insert(userTable).values({
      id: userId,
      username,
      tag,
      role,
      user_image: "put the url in here",
      email,
      password_hash: passwordHash,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    ctx.res.cookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // return a message on success or redirect the user to dashboard
  });
