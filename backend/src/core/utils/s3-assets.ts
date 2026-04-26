import { randomUUID } from "node:crypto";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client, getS3StorageConfig } from "../../config/s3";

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

const sanitizeFolder = (value?: string) => {
  const sanitized = (value || "misc")
    .toLowerCase()
    .replace(/[^a-z0-9/-]+/g, "-")
    .replace(/\/{2,}/g, "/")
    .replace(/^-+|-+$/g, "");

  return trimSlashes(sanitized || "misc");
};

const sanitizeFilename = (value: string) => {
  const filenameWithoutExtension = value.replace(/\.[^.]+$/, "");
  const sanitized = filenameWithoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return sanitized || "image";
};

const removeBucketPrefix = (value: string, bucket: string) => {
  if (value === bucket) return "";
  if (value.startsWith(`${bucket}/`)) return value.slice(bucket.length + 1);
  return value;
};

const normalizeDuplicatePrefix = (value: string, keyPrefix?: string) => {
  if (!keyPrefix) {
    return value;
  }

  const duplicatedPrefix = `${keyPrefix}/${keyPrefix}/`;
  return value.startsWith(duplicatedPrefix)
    ? `${keyPrefix}/${value.slice(duplicatedPrefix.length)}`
    : value;
};

const stripConfiguredPrefix = (key: string) => {
  const config = getS3StorageConfig();
  if (!config.keyPrefix) {
    return key;
  }

  return key.startsWith(`${config.keyPrefix}/`) ? key.slice(config.keyPrefix.length + 1) : key;
};

const joinUrlPath = (baseUrl: string, suffix: string) =>
  `${baseUrl.replace(/\/+$/g, "")}/${suffix.replace(/^\/+/g, "")}`;

const getDefaultPublicBaseUrl = () => {
  const config = getS3StorageConfig();
  if (config.endpoint) {
    return `${config.endpoint}/${config.bucket}`;
  }

  return `https://${config.bucket}.s3.${config.region}.amazonaws.com`;
};

const publicBaseAlreadyIncludesPrefix = (publicBaseUrl: string, keyPrefix?: string) => {
  if (!keyPrefix) {
    return false;
  }

  const pathname = trimSlashes(new URL(publicBaseUrl).pathname);
  return pathname === keyPrefix || pathname.endsWith(`/${keyPrefix}`);
};

export const normalizeS3ObjectKey = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const config = getS3StorageConfig();
  const trimmed = trimSlashes(value.trim());
  if (!trimmed) {
    return null;
  }

  let key = trimmed;

  if (trimmed.startsWith("s3://")) {
    key = trimSlashes(trimmed.replace(/^s3:\/\//i, ""));
    key = removeBucketPrefix(key, config.bucket);
  } else if (/^https?:\/\//i.test(trimmed)) {
    const url = new URL(trimmed);
    key = trimSlashes(decodeURIComponent(url.pathname));
    key = removeBucketPrefix(key, config.bucket);
  }

  key = normalizeDuplicatePrefix(trimSlashes(key), config.keyPrefix);

  if (config.keyPrefix && !key.startsWith(`${config.keyPrefix}/`) && key !== config.keyPrefix) {
    key = `${config.keyPrefix}/${key}`;
  }

  return key;
};

export const buildS3ObjectKey = (input: { filename: string; contentType: string; folder?: string }) => {
  const config = getS3StorageConfig();
  const extensionByMimeType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
  };

  const extension = extensionByMimeType[input.contentType];
  const today = new Date().toISOString().slice(0, 10);
  const safeFilename = sanitizeFilename(input.filename);
  const folder = sanitizeFolder(input.folder);

  return [config.keyPrefix, folder, today, `${randomUUID()}-${safeFilename}.${extension}`]
    .filter(Boolean)
    .join("/");
};

export const getPresignedUploadUrl = async (input: { key: string; contentType: string }) => {
  const config = getS3StorageConfig();
  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: input.key,
    ContentType: input.contentType
  });

  return getSignedUrl(client, command, { expiresIn: config.uploadUrlExpiresIn });
};

export const getResolvedS3ObjectUrl = async (key?: string | null) => {
  const normalizedKey = normalizeS3ObjectKey(key);
  if (!normalizedKey) {
    return null;
  }

  const config = getS3StorageConfig();
  if (config.bucketPublic) {
    const publicBaseUrl = config.publicBaseUrl || getDefaultPublicBaseUrl();
    const suffix = publicBaseAlreadyIncludesPrefix(publicBaseUrl, config.keyPrefix)
      ? stripConfiguredPrefix(normalizedKey)
      : normalizedKey;

    return joinUrlPath(publicBaseUrl, suffix);
  }

  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: normalizedKey,
    ResponseContentDisposition: "inline"
  });

  return getSignedUrl(client, command, { expiresIn: config.readUrlExpiresIn });
};
