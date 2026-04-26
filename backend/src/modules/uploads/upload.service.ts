import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env";
import { getS3StorageConfig } from "../../config/s3";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import {
  buildS3ObjectKey,
  getPresignedUploadUrl,
  getResolvedS3ObjectUrl
} from "../../core/utils/s3-assets";
import type { CreateImageUploadInput, DirectImageUploadResponse } from "./upload.types";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const uploadService = {
  async createImageUpload(input: CreateImageUploadInput): Promise<DirectImageUploadResponse> {
    if (!allowedMimeTypes.has(input.contentType)) {
      throw new AppError("Unsupported image type", StatusCodes.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR);
    }

    const maxFileSizeBytes = env.MAX_FILE_SIZE_MB * 1024 * 1024;
    if (input.fileSize > maxFileSizeBytes) {
      throw new AppError(
        `Image exceeds the ${env.MAX_FILE_SIZE_MB}MB upload limit`,
        StatusCodes.UNPROCESSABLE_ENTITY,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    const key = buildS3ObjectKey(input);
    const [uploadUrl, imageUrl] = await Promise.all([
      getPresignedUploadUrl({ key, contentType: input.contentType }),
      getResolvedS3ObjectUrl(key)
    ]);
    const config = getS3StorageConfig();

    return {
      key,
      imageUrl: imageUrl || "",
      uploadUrl,
      expiresIn: config.uploadUrlExpiresIn,
      method: "PUT",
      headers: {
        "Content-Type": input.contentType
      }
    };
  }
};
