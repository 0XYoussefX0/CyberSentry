import sharp from "sharp";
import * as v from "valibot";

export const avatarImageSchemaServer = v.objectAsync({
  avatarImage: v.pipeAsync(
    v.file("Please select an image file."),
    v.mimeType(
      ["image/jpeg", "image/png", "image/jpg"],
      "Please select a JPEG or PNG file"
    ),
    v.maxSize(2000 * 1024, "Please select a file smaller than 2MB"),
    v.transformAsync(async (input) => {
      const arrayBuffer = await input.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      const metadata = await sharp(imageBuffer).metadata();
      return { image: input, metadata };
    }),
    v.checkAsync(async ({ metadata }) => {
      if (!metadata.width || !metadata.height) return false;
      try {
        if (metadata.width <= 5000 && metadata.height <= 5000) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }, "Image is too large, the maximum size is 5000x5000px"),
    v.checkAsync(({ metadata }) => {
      if (!metadata.width || !metadata.height) return false;
      try {
        if (metadata.width >= 256 && metadata.height >= 256) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }, "Image is too small, the minimum size is 256x256px"),
    v.transformAsync(async ({ image }) => image)
  ),
});
