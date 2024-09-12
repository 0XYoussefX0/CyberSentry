// seperate your schemas from your types

import * as v from "valibot";

import {
  EmailSchema,
  SignUpSchema,
  LoginSchema,
  PasswordSchema,
  profileDetailsFormSchema,
  OTPSchema,
} from "@/lib/validationSchemas";

import { RecaptchaVerifier } from "firebase/auth";

import { ReactNode } from "react";

import { InferIssue } from "valibot";
import { Models } from "node-appwrite";

import { Dispatch, SetStateAction } from "react";
import { NextResponse } from "next/server";

type Constraints = "length" | "symbol" | "uppercase" | "number";

export type PasswordConstraints = {
  id: Constraints;
  text: string;
}[];

export type EmailSchemaType = v.InferOutput<typeof EmailSchema>;

export type PasswordSchemaType = v.InferOutput<typeof PasswordSchema>;

export type SignUpSchemaType = v.InferOutput<typeof SignUpSchema>;

export type LoginSchemaType = v.InferOutput<typeof LoginSchema>;

export type ProfileDetailsFormSchemaType = v.InferOutput<
  typeof profileDetailsFormSchema
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

export type OnBoardingWrapperProps = {
  initialStep: number;
};

export type CompleteProfileResponse =
  | undefined
  | { status: "success" }
  | { status: "server_error"; error: string }
  | {
      status: "validation_error";
      errors: [
        InferIssue<typeof profileDetailsFormSchema>,
        ...InferIssue<typeof profileDetailsFormSchema>[]
      ];
    };

export type SideBarProps = {
  avatar_image: string;
  username: string;
  userEmail: string;
};
