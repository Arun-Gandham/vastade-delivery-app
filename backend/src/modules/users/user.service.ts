import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { getResolvedS3ObjectUrl, normalizeS3ObjectKey } from "../../core/utils/s3-assets";
import { userRepository } from "./user.repository";
import { UpdateProfileInput } from "./user.types";

const mapUserResponse = async <T extends { profileImage?: string | null }>(user: T) => {
  const profileImageKey = normalizeS3ObjectKey(user.profileImage);
  return {
    ...user,
    profileImage: profileImageKey,
    profileImageUrl: await getResolvedS3ObjectUrl(profileImageKey)
  };
};

export const userService = {
  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND, ERROR_CODES.USER_NOT_FOUND);
    }
    return mapUserResponse(user);
  },

  async updateMe(userId: string, input: UpdateProfileInput) {
    const user = await userRepository.updateMe(userId, {
      ...input,
      ...(Object.prototype.hasOwnProperty.call(input, "profileImage")
        ? { profileImage: normalizeS3ObjectKey(input.profileImage) ?? undefined }
        : {})
    });
    return mapUserResponse(user);
  }
};
