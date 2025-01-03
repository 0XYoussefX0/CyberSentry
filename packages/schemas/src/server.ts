import sharp from "sharp";
import * as v from "valibot";

const imageDimensionValidator = async (input: File): Promise<boolean> => {
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
};

export const UserImageShema = v.objectAsync({
  user_image: v.optionalAsync(
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

export const PasswordSchema = v.object({
  password: v.pipe(
    v.string(),
    v.nonEmpty("Password is required"),
    v.minLength(8, "Your password is too short."),
    v.maxLength(64, "Your password exceeds the maximum limit"),
  ),
});

const EmailPasswordSchemas = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Email is required"),
    v.email("Invalid email address"),
  ),
  ...PasswordSchema.entries,
});

export const SignUpSchema = v.pipeAsync(
  v.instance(FormData),
  v.transform((input) => {
    return Object.fromEntries(input.entries());
  }),
  v.objectAsync({
    ...EmailPasswordSchemas.entries,
    role: v.pipe(v.string(), v.nonEmpty("Role is required")),
    username: v.pipe(v.string(), v.nonEmpty("Name is required")),
    tag: v.pipe(v.string(), v.nonEmpty("Tag is required")),
    ...UserImageShema.entries,
  }),
);

export const LoginSchema = v.object({
  ...EmailPasswordSchemas.entries,
  remember_me: v.boolean(),
});

const domainNameRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.[A-Za-z]{2,}$/;
const DatabaseUrlRegex = /postgresql:\/\/(\w+):(\S+)@([\w\.-]+):(\d+)\/(\w+)/;

export const EnvSchema = v.object({
  NODE_ENV: v.picklist(["development", "production"]),
  ENCRYPTION_KEY: v.pipe(v.string(), v.nonEmpty()),
  DOMAIN_NAME: v.pipe(v.string(), v.nonEmpty(), v.regex(domainNameRegex)),
  ADMIN_APP_EMAIL: v.pipe(v.string(), v.nonEmpty(), v.email()),
  ADMIN_APP_PASSWORD: v.pipe(v.string(), v.nonEmpty()),
  ADMIN_APP_ROLE: v.pipe(v.string(), v.nonEmpty()),
  ADMIN_APP_USERNAME: v.pipe(v.string(), v.nonEmpty()),
  ADMIN_APP_TAG: v.pipe(v.string(), v.nonEmpty()),
  RESEND_API_KEY: v.pipe(v.string(), v.nonEmpty()),
  MINIO_HOST_URL: v.pipe(v.string(), v.nonEmpty(), v.regex(domainNameRegex)),
  MINIO_ACCESS_KEY: v.pipe(v.string(), v.nonEmpty()),
  MINIO_SECRET_KEY: v.pipe(v.string(), v.nonEmpty()),
  SERVER_PUBLIC_IP: v.pipe(v.string(), v.ip()),
  DATABASE_URL: v.pipe(v.string(), v.nonEmpty(), v.regex(DatabaseUrlRegex)),
});

export const EncryptedDataSchema = v.object({
  iv: v.pipe(v.string(), v.nonEmpty()),
  encryptedData: v.pipe(v.string(), v.nonEmpty()),
});

export const ResetURLParamsSchema = v.object({
  token: v.pipe(v.string(), v.nonEmpty()),
  userID: v.pipe(v.string(), v.nonEmpty()),
});

export const TokenSchema = v.object({
  token: v.pipe(v.string(), v.nonEmpty()),
});
