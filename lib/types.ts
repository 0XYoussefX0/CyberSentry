import * as v from "valibot";
import type { Database as DB } from "@/lib/supabase/database.types.ts";

import { RecaptchaVerifier } from "firebase/auth";

import { ReactNode } from "react";

type Constraints = "length" | "symbol" | "uppercase" | "number";

export type PasswordConstraints = {
  id: Constraints;
  text: string;
}[];

export const SignUpSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Email is required"),
    v.email("Invalid email address")
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("Password is required"),
    v.minLength(8, "Your password is too short."),
    v.regex(/[a-z]/, "Your password must contain a lowercase letter."),
    v.regex(/[A-Z]/, "Your password must contain an uppercase letter."),
    v.regex(/[0-9]/, "Your password must contain a number."),
    v.regex(
      /(?=.[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/,
      "Your password must contain a special character."
    )
  ),
});

export type SignUpSchemaType = v.InferOutput<typeof SignUpSchema>;

export const LoginSchema = v.object({
  ...SignUpSchema.entries,
  rememberMe: v.boolean(),
});

export type LoginSchemaType = v.InferOutput<typeof LoginSchema>;

export const avatarImageSchemaClient = v.objectAsync({
  avatarImage: v.pipeAsync(
    v.file("Please select an image file."),
    v.mimeType(
      ["image/jpeg", "image/png", "image/jpg"],
      "Please select a JPEG or PNG file"
    ),
    v.maxSize(2000 * 1024, "Please select a file smaller than 2MB"),
    v.checkAsync((input) => {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(input);
        const img = new Image();

        img.src = url;

        img.onload = () => {
          if (img.width <= 5000 && img.height <= 5000) {
            resolve(true);
          } else {
            resolve(false);
          }
        };

        img.onerror = () => {
          resolve(false);
        };
      });
    }, "Image is too large, the maximum size is 5000x5000px"),
    v.checkAsync((input) => {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(input);
        const img = new Image();

        img.src = url;

        img.onload = () => {
          if (img.width >= 256 && img.height >= 256) {
            resolve(true);
          } else {
            resolve(false);
          }
        };

        img.onerror = () => {
          resolve(false);
        };
      });
    }, "Image is too small, the minimum size is 256x256px")
  ),
});

export const fullNameSchema = v.object({
  fullname: v.pipe(
    v.string("fullname must be a string"),
    v.nonEmpty("fullname is required")
  ),
});

export const profileDetailsFormSchemaClient = v.objectAsync({
  ...fullNameSchema.entries,
  ...avatarImageSchemaClient.entries,
});

export type ProfileDetailsFormSchemaClientType = v.InferOutput<
  typeof profileDetailsFormSchemaClient
>;

export type croppedArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type onCropCompleteType = (
  croppedArea: croppedArea,
  croppedAreaPixels: croppedArea
) => void;

export type getCroppedImgType = (
  imageSrc: string,
  pixelCrop: croppedArea,
  rotation: number,
  flip?: { horizontal: boolean; vertical: boolean }
) => Promise<Blob | null>;

declare global {
  type Database = DB;
}

export const OTPSchema = v.object({
  otp: v.pipe(v.string(), v.length(6, "OTP must be 6 characters long")),
});

export type OTPSchemaType = v.InferOutput<typeof OTPSchema>;

export type CaptchaDataType = {
  appVerifier: RecaptchaVerifier | undefined;
  widgetId: number | undefined;
};

export type OnboardingSteos = {
  title: string;
  description: string;
  concise_description: string;
  icon: any;
  component: null | ReactNode;
}[];
