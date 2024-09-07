import path from "path";
import fs from "fs-extra";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env.local",
});

const env = process.env.BUILD_ENV;

const moveFolders = async (srcDir, destDir, foldersToMove) => {
  try {
    for (const folder of foldersToMove) {
      const srcPath = path.join(srcDir, folder);
      const destPath = path.join(destDir, folder);

      if (await fs.pathExists(srcPath)) {
        await fs.ensureDir(path.dirname(destPath));

        await fs.move(srcPath, destPath, { overwrite: true });
        console.log(`Moved ${folder} from ${srcPath} to ${destPath}`);
      } else {
        console.warn(`Source folder does not exist: ${srcPath}`);
      }
    }
    console.log("All specified folders have been processed.");
  } catch (err) {
    console.error("Error moving folders:", err);
    throw err;
  }
};

const sourceDirectory = env === "production" ? "./app/" : "./app/_ignore";
const destinationDirectory = env === "production" ? "./app/_ignore" : "./app/";

const folders = ["signup"];

const main = async () => {
  console.log("Environment:", env);
  console.log("Source Directory:", sourceDirectory);
  console.log("Destination Directory:", destinationDirectory);

  try {
    await moveFolders(sourceDirectory, destinationDirectory, folders);
    console.log("Directory movement completed successfully.");
  } catch (error) {
    console.error("Failed to complete directory movement:", error);
    process.exit(1);
  }
};

main();
