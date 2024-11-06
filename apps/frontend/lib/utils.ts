import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import type { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

import type { getCroppedImgType } from "./types";

import * as v from "valibot";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createImage: (
  url: string,
) => Promise<HTMLImageElement | ErrorEvent> = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export const getCroppedImg: getCroppedImgType = async (
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx || !(image instanceof HTMLImageElement)) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation,
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");

  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // As Base64 string
  // return croppedCanvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((file) => {
      if (file) {
        resolve(file);
      }
    }, "image/jpeg");
  });
};

export function getImageMimeType(arrayBuffer: ArrayBuffer) {
  const byteArray = new Uint8Array(arrayBuffer);

  // Check for JPEG/JPG (magic number: FF D8)
  if (byteArray[0] === 0xff && byteArray[1] === 0xd8) {
    return "image/jpeg"; // Covers both image/jpeg and image/jpg
  }

  // Check for PNG (magic number: 89 50 4E 47)
  if (
    byteArray[0] === 0x89 &&
    byteArray[1] === 0x50 &&
    byteArray[2] === 0x4e &&
    byteArray[3] === 0x47
  ) {
    return "image/png";
  }
}

export const startCounter = (setTimer: Dispatch<SetStateAction<string>>) => {
  const startTime = Date.now();

  const counterId = setInterval(() => {
    const elapsedTimeInSeconds = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time

    // Convert elapsedTimeInSeconds to a Date object (epoch time + elapsed seconds)
    const date = new Date(0);
    const time = new Date(date.setSeconds(elapsedTimeInSeconds));

    // Format the time into mm:ss
    const formattedTime = format(time, "mm:ss");
    setTimer(formattedTime);
  }, 1000); // Update every second, but calculate real time passed

  return counterId;
};

export const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout | number;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function randomColor() {
  const coolColors = [
    "#475569",
    "#4b5563",
    "#52525b",
    "#525252",
    "#57534e",
    "#dc2626",
    "#2563eb",
    "#4f46e5",
    "#7c3aed",
    "#9333ea",
    "#c026d3",
    "#db2777",
    "#e11d48",
  ];
  return coolColors;
}

export const checkCameraAvailability = () => {
  return navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      const cameraAvailability = {
        hasFrontCamera: false,
        hasBackCamera: false,
      };

      devices.forEach((device) => {
        if (device.kind === "videoinput") {
          // Check for front camera
          if (
            device.label.toLowerCase().includes("front") ||
            device.label.toLowerCase().includes("user")
          ) {
            cameraAvailability.hasFrontCamera = true;
          }
          // Check for back camera
          if (
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("environment")
          ) {
            cameraAvailability.hasBackCamera = true;
          }
        }
      });

      return cameraAvailability;
    })
    .catch((err) => {
      console.error("Error accessing media devices:", err);
      return null; // Return null in case of an error
    });
};

export const getIssues = (schema, issues) => {
  const flattenedIssues = v.flatten<typeof schema>(issues);

  if (flattenedIssues.nested) {
    const properties = Object.keys(issues.nested);
    for (const property of properties) {
      const errMessage = properties[property as keyof typeof properties];
    }
  }

  return {
    fieldname: ["dsdsds"],
  };
};

// if (error) {
//   if (error.data?.valibotError) {
//     const issues = v.flatten<typeof LoginSchema>(error.data.valibotError);
//     if (issues.nested) {
//       const properties = Object.keys(issues.nested);
//       for (const property of properties) {
//         type t = typeof issues.nested;
//         type s = keyof t;
//         const nameOfInputThatHasError =
//           property as keyof typeof issues.nested;
//         const errMessage = issues.nested[nameOfInputThatHasError] as string[];
//         setError(nameOfInputThatHasError, {
//           type: "manual",
//           message: errMessage[0] as string,
//         });
//       }
//     }
//   }
// }
