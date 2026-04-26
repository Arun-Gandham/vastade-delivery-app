import { S3Client } from "@aws-sdk/client-s3";
import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../constants/error-codes";
import { AppError } from "../core/errors/app-error";
import { env } from "./env";

type S3StorageConfig = {
  accessKey: string;
  secretKey: string;
  bucket: string;
  region: string;
  endpoint?: string;
  publicBaseUrl?: string;
  keyPrefix?: string;
  uploadUrlExpiresIn: number;
  readUrlExpiresIn: number;
  bucketPublic: boolean;
};

let s3Client: S3Client | null = null;

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

const normalizeUrl = (value: string) => {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/g, "");
};

export const getS3StorageConfig = (): S3StorageConfig => {
  if (!env.S3_ACCESS_KEY || !env.S3_SECRET_KEY || !env.S3_BUCKET || !env.S3_REGION) {
    throw new AppError(
      "S3 storage is not configured",
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_SERVER_ERROR
    );
  }

  return {
    accessKey: env.S3_ACCESS_KEY,
    secretKey: env.S3_SECRET_KEY,
    bucket: env.S3_BUCKET,
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT ? normalizeUrl(env.S3_ENDPOINT) : undefined,
    publicBaseUrl: env.S3_PUBLIC_BASE_URL ? normalizeUrl(env.S3_PUBLIC_BASE_URL) : undefined,
    keyPrefix: env.S3_KEY_PREFIX ? trimSlashes(env.S3_KEY_PREFIX) : undefined,
    uploadUrlExpiresIn: env.S3_UPLOAD_URL_EXPIRES_IN,
    readUrlExpiresIn: env.S3_READ_URL_EXPIRES_IN,
    bucketPublic: env.S3_BUCKET_PUBLIC
  };
};

export const getS3Client = () => {
  if (s3Client) {
    return s3Client;
  }

  const config = getS3StorageConfig();
  s3Client = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: Boolean(config.endpoint),
    credentials: {
      accessKeyId: config.accessKey,
      secretAccessKey: config.secretKey
    }
  });

  return s3Client;
};
