"use server";

import auth from "@/lib/auth";
import * as v from "valibot";
import sharp from "sharp";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/appwrite/serverConfig";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import { AppwriteException } from "node-appwrite";
import { profileDetailsFormSchemaServer } from "@/lib/validationSchemas";

import {
  BUCKET_ID,
  APPWRITE_ENDPOINT,
  DATABASE_ID,
  USERS_COLLECTION_ID,
  PROJECT_ID,
} from "@/lib/appwrite/envConfig";

export default async function completeProfile(data: unknown) {
  const { user, sessionCookie } = await auth.getUser();

  if (!user || !sessionCookie) {
    redirect("/login");
  }

  let formData;

  if (data instanceof FormData) {
    const avatarImage = data.get("avatarImage");
    const fullname = data.get("fullname");

    if (!avatarImage || !fullname) {
      return { error: "Invalid data" };
    }

    formData = {
      avatarImage,
      fullname,
    };
  } else {
    return { error: "Invalid data type" };
  }

  const result = await v.safeParseAsync(
    profileDetailsFormSchemaServer,
    formData
  );

  if (result.success) {
    const { avatarImage, fullname } = result.output;

    const imageBuffer = await avatarImage.arrayBuffer();
    const sharpImage = sharp(Buffer.from(imageBuffer));
    const resizedAvatarImage = await sharpImage.resize(256, 256).toBuffer();

    const { storage, databases, account } = await createSessionClient(
      sessionCookie.value
    );

    const FILE_ID = ID.unique();

    try {
      await storage.createFile(
        BUCKET_ID,
        FILE_ID,
        InputFile.fromBuffer(resizedAvatarImage, `${user.$id}`),
        ["read('any')"]
      );
    } catch (e) {
      const err = e as AppwriteException;
      return { status: "server_error", error: err.message };
    }

    const fileUrl = `${APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${FILE_ID}/view?project=${PROJECT_ID}`;

    try {
      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id,
        { avatar_image: fileUrl },
        ["read('any')"]
      );
    } catch (e) {
      const err = e as AppwriteException;
      return { status: "server_error", error: err.message };
    }

    try {
      await account.updateName(fullname);
    } catch (e) {
      const err = e as AppwriteException;
      return { status: "server_error", error: err.message };
    }

    return { status: "success" };
  } else {
    return {
      status: "validation_error",
      errors: JSON.stringify(result.issues),
    };
  }
}
