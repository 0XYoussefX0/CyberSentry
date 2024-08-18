"use server";

import { createClient } from "@/lib/supabase/server";
import * as v from "valibot";
import sharp from "sharp";

const profileDetailsFormSchemaServer = v.objectAsync({
  fullname: v.pipe(
    v.string("fullname must be a string"),
    v.nonEmpty("fullname is required")
  ),
  avatarImage: v.pipeAsync(
    v.file("Please select an image file."),
    v.mimeType(
      ["image/jpeg", "image/png", "image/jpg"],
      "Please select a JPEG or PNG file"
    ),
    v.maxSize(2000 * 1024, "Please select a file smaller than 2MB")
  ),
});

export default async function completeProfile(data: unknown) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return error;
  }

  if (!user) return;

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

  /* check if the data is valid  */
  const result = await v.safeParseAsync(
    profileDetailsFormSchemaServer,
    formData
  );
  if (result.success) {
    const { avatarImage, fullname } = result.output;

    const imageBuffer = await avatarImage.arrayBuffer();
    const sharpImage = sharp(Buffer.from(imageBuffer));
    const resizedAvatarImage = await sharpImage.resize(256, 256).toBuffer();

    const { error: storageError } = await supabase.storage
      .from("avatars")
      .upload("/avatarImage.jpeg", resizedAvatarImage);

    if (storageError) {
      return {
        m: storageError.message,
      };
    }

    // const {
    //   data: { publicUrl },
    // } = supabase.storage.from("avatars").getPublicUrl(avatarImage.name);

    // const { data, error } = await supabase.from("profiles").insert({
    //   avatarImage: publicUrl,
    //   fullname,
    //   verified: false,
    //   user_id: user.id,
    // });

    // if (error) {
    //   return { error: error.message };
    // }

    return { status: "success" };
  } else {
    return {
      status: "validation_error",
      errors: JSON.stringify(result.issues),
    };
    /* return the errors and show them in their corresponding place */
  }
}