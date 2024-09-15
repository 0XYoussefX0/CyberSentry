import type shrp from "sharp";
import * as v from "valibot";

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
    v.regex(/[a-z]/, "Your password must contain a lowercase letter."),
    v.regex(/[A-Z]/, "Your password must contain an uppercase letter."),
    v.regex(/[0-9]/, "Your password must contain a number."),
    v.regex(
      /(?=.[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/,
      "Your password must contain a special character.",
    ),
  ),
});

export const SignUpSchema = v.object({
  ...EmailSchema.entries,
  ...PasswordSchema.entries,
});

export const LoginSchema = v.object({
  ...SignUpSchema.entries,
  rememberMe: v.boolean(),
});

let sharp: typeof shrp;

if (typeof window === "undefined") {
  const { default: sharpModule } = await import("sharp");
  sharp = sharpModule;
}

const imageDimensionValidator = async (input: File): Promise<boolean> => {
  if (typeof window !== "undefined") {
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
  } else {
    const { default: sharp } = await import("sharp");

    const arrayBuffer = await input.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    try {
      const { width, height } = await sharp(imageBuffer).metadata();
      if (!width || !height) return false;
      if (width >= 256 && width <= 5000 && height >= 256 && height <= 5000) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
};

export const avatarImageSchema = v.objectAsync({
  avatarImage: v.pipeAsync(
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

export const OTPSchema = v.object({
  otp: v.pipe(v.string(), v.length(6, "OTP must be 6 characters long")),
});
