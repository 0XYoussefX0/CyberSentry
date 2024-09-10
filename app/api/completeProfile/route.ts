import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/appwrite/utils";
import * as v from "valibot";
import sharp from "sharp";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/appwrite/server";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import { AppwriteException, Permission, Role } from "node-appwrite";
import { profileDetailsFormSchema } from "@/lib/validationSchemas";

import {
  BUCKET_ID,
  APPWRITE_ENDPOINT,
  DATABASE_ID,
  USERS_COLLECTION_ID,
  PROJECT_ID,
} from "@/lib/env";

export async function POST(request: NextRequest) {
  const data = await request.formData();

  const { account, databases, storage } = await createSessionClient();

  const user = await getUser(account);

  if (!user) redirect("/login");

  const result = await v.safeParseAsync(profileDetailsFormSchema, {
    avatarImage: data.get("avatarImage"),
    fullname: data.get("fullname"),
  });

  if (!result.success) {
    return NextResponse.json({
      status: "validation_error",
      errors: result.issues,
    });
  }

  const { avatarImage, fullname } = result.output;

  const imageBuffer = await avatarImage.arrayBuffer();
  const sharpImage = sharp(Buffer.from(imageBuffer));
  const resizedAvatarImage = await sharpImage.resize(256, 256).toBuffer();

  const FILE_ID = ID.unique();

  console.log(user);

  try {
    await storage.createFile(
      BUCKET_ID,
      FILE_ID,
      InputFile.fromBuffer(resizedAvatarImage, `${user.$id}`),
      [Permission.read(Role.users()), Permission.write(Role.user(user.$id))]
    );
  } catch (e) {
    const err = e as AppwriteException;
    return NextResponse.json({ status: "server_error", error: err.message });
  }

  const fileUrl = `${APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${FILE_ID}/view?project=${PROJECT_ID}`;

  try {
    await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      user.$id,
      { avatar_image: fileUrl },
      [Permission.read(Role.users()), Permission.write(Role.user(user.$id))]
    );
  } catch (e) {
    const err = e as AppwriteException;
    return NextResponse.json({ status: "server_error", error: err.message });
  }

  try {
    await account.updateName(fullname);
  } catch (e) {
    const err = e as AppwriteException;
    return NextResponse.json({ status: "server_error", error: err.message });
  }

  return NextResponse.json({ status: "success" });
}
