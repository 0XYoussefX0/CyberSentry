import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: "s3_storage",
  port: 9000,
  useSSL: process.env.ENV === "production" ? true : false,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const PROFILE_PICTURES_BUCKET_NAME = "profile-pictures";

export const getPublicUrl = (bucket_name: string, fileName: string) => {
  const protocol = process.env.ENV === "production" ? "https" : "http";
  const host = process.env.MINIO_HOST_URL;

  return protocol + "//" + host + ":9000/" + bucket_name + "/" + fileName;
};
