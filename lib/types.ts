import * as v from "valibot";

import { RecaptchaVerifier } from "firebase/auth";

import { ReactNode } from "react";

import { InferIssue } from "valibot";
import { Models } from "node-appwrite";

import { Dispatch, SetStateAction } from "react";

type Constraints = "length" | "symbol" | "uppercase" | "number";

export type PasswordConstraints = {
  id: Constraints;
  text: string;
}[];

export const EmailSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Email is required"),
    v.email("Invalid email address")
  ),
});

export const PasswordSchema = v.object({
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

export type EmailSchemaType = v.InferOutput<typeof EmailSchema>;

export type PasswordSchemaType = v.InferOutput<typeof PasswordSchema>;

export const SignUpSchema = v.object({
  ...EmailSchema.entries,
  ...PasswordSchema.entries,
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

export type SignUpResponse =
  | { status: "success" }
  | {
      status: "validation_error";
      errors: [
        InferIssue<typeof SignUpSchema>,
        ...InferIssue<typeof SignUpSchema>[]
      ];
    }
  | { status: "server_error"; error: string };

export type LogOutResponse =
  | {
      status: "error";
      error: string;
    }
  | undefined;

export type SessionCookie = { name: "session"; value: string };

export type Auth = {
  user: null | Models.User<Models.Preferences>;
  sessionCookie: SessionCookie | null;
  getUser: () => Promise<Auth["user"]>;
};

export type LoginResponse =
  | undefined
  | {
      status: "validation_error";
      errors: [
        InferIssue<typeof LoginSchema>,
        ...InferIssue<typeof LoginSchema>[]
      ];
    }
  | { status: "server_error"; error: string };

export type ForgotPasswordResponse =
  | { status: "success" }
  | {
      status: "validation_error";
      errors: [
        InferIssue<typeof EmailSchema>,
        ...InferIssue<typeof EmailSchema>[]
      ];
    }
  | { status: "server_error"; error: string };

export type ResetPasswordResponse =
  | undefined
  | { status: "success" }
  | {
      status: "validation_error";
      errors: [
        InferIssue<typeof PasswordSchema>,
        ...InferIssue<typeof PasswordSchema>[]
      ];
    }
  | { status: "server_error"; error: string };

export type CheckEmailModalProps = {
  open: boolean;
  setOpen: Dispatch<
    SetStateAction<{
      email: string;
      open: boolean;
    }>
  >;
  email: string;
  message: string;
};

export type ResetPasswordFormProps = {
  userId: string;
  secret: string;
};
