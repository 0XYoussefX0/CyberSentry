import * as Minio from "minio";

let minioInstance: Minio.Client | undefined;

export const getMinio = (config: Minio.ClientOptions) => {
  if (!minioInstance) {
    minioInstance = new Minio.Client(config);
  }
  return minioInstance;
};

export const PROFILE_PICTURES_BUCKET_NAME = "profile-pictures";

export const getPublicUrl = (
  bucket_name: string,
  fileName: string,
  host: string,
  protocol: "https" | "http",
) => {
  return `${protocol}//${host}:9000/${bucket_name}/${fileName}`;
};
