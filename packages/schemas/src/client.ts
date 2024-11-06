import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnArPackage from "@zxcvbn-ts/language-ar";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import * as v from "valibot";

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

export const EmailSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Email is required"),
    v.email("Invalid email address"),
  ),
});

export const PasswordSchema = v.object({
  password: v.pipe(
    v.string(),
    v.nonEmpty("Password is required"),
    v.minLength(8, "Your password is too short."),
    v.maxLength(64, "Your password exceeds the maximum limit"),
    v.check((input) => {
      const passwordResult = zxcvbn(input);
      if (passwordResult.score >= 2) {
        return true;
      }

      return false;
    }, "This password would be too easy to guess. Please choose a different password."),
  ),
});

export const SignUpSchema = v.object({
  ...EmailSchema.entries,
  ...PasswordSchema.entries,
});

export const LoginSchema = v.object({
  ...EmailSchema.entries,
  password: v.pipe(
    v.string(),
    v.nonEmpty("Password is required"),
    v.minLength(8, "Your password is too short."),
    v.maxLength(64, "Your password exceeds the maximum limit"),
  ),
  remember_me: v.boolean(),
});

const imageDimensionValidator = async (input: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(input);
    const img = new Image();
    img.src = url;

    img.onload = () => {
      if (
        img.width >= 256 &&
        img.height >= 256 &&
        img.width <= 5000 &&
        img.height <= 5000
      ) {
        resolve(true);
      } else {
        resolve(false);
      }
    };

    img.onerror = () => {
      resolve(false);
    };
  });
};

export const avatarImageSchema = v.objectAsync({
  avatarImage: v.optionalAsync(
    v.pipeAsync(
      v.file("Please select an image file."),
      v.mimeType(
        ["image/jpeg", "image/png", "image/jpg"],
        "Please select a JPEG or PNG file",
      ),
      v.maxSize(2000 * 1024, "Please select a file smaller than 2MB"),
      v.checkAsync(
        imageDimensionValidator,
        "Image must be between 256x256px and 5000x5000px",
      ),
    ),
  ),
});

export const fullNameSchema = v.object({
  fullname: v.pipe(
    v.string("fullname must be a string"),
    v.nonEmpty("fullname is required"),
  ),
});

export const profileDetailsFormSchema = v.objectAsync({
  ...fullNameSchema.entries,
  ...avatarImageSchema.entries,
});

export const SelectedUsersIdsSchema = v.array(
  v.string(),
  "An array of user Ids is required.",
);
