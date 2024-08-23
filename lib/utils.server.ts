import { jwtVerify, SignJWT, EncryptJWT, jwtDecrypt, JWTPayload } from "jose";
import { Buffer } from "buffer";

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex").toString(
  "base64"
);

const ALGORITHM = "AES-GCM";

const isNode = () =>
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

const getCrypto = async () => {
  if (isNode()) {
    const cryptoModule = await import("crypto");
    return cryptoModule.webcrypto;
  } else {
    return crypto;
  }
};

/* decrypt and encrypt the whole jwt in the future instead of encrypting just the payload */

export const encryptSymmetric = async (payload: string) => {
  const crypto = await getCrypto();

  // @ts-expect-error
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encodedPlaintext = new TextEncoder().encode(payload);

  const secretKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(ENCRYPTION_KEY, "base64"),
    {
      name: ALGORITHM,
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv,
    },
    secretKey,
    encodedPlaintext
  );

  return (
    Buffer.from(iv).toString("base64") +
    ":" +
    Buffer.from(ciphertext).toString("base64")
  );
};

export const decryptSymmetric = async (payload: string) => {
  const crypto = await getCrypto();
  const iv = payload.split(":")[0];
  const ciphertext = payload.split(":")[1];

  const secretKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(ENCRYPTION_KEY, "base64"),
    {
      name: ALGORITHM,
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const cleartext = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: Buffer.from(iv, "base64"),
    },
    secretKey,
    Buffer.from(ciphertext, "base64")
  );

  return new TextDecoder().decode(cleartext);
};

const signingKey = new TextEncoder().encode(process.env.SIGNING_KEY);

export async function sign(payload: Record<string, any>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(signingKey);
}

export async function verifyToken(input: string) {
  try {
    const { payload } = await jwtVerify(input, signingKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (e) {
    return null;
  }
}
