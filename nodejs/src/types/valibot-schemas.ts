import * as v from "valibot";
import sharp from "sharp";

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
  user_image: v.pipeAsync(
    v.file("Please select an image file."),
    v.mimeType(
      ["image/jpeg", "image/png", "image/jpg"],
      "Please select a JPEG or PNG file"
    ),
    v.maxSize(2000 * 1024, "Please select a file smaller than 2MB"),
    v.checkAsync(
      imageDimensionValidator,
      "Image must be between 256x256px and 5000x5000px"
    )
  ),
});

export const SignUpSchema = v.objectAsync({
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
  role: v.pipe(v.string(), v.nonEmpty("Role is required")),
  username: v.pipe(v.string(), v.nonEmpty("Name is required")),
  tag: v.pipe(v.string(), v.nonEmpty("Tag is required")),
  ...UserImageShema.entries,
});
