import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { hashPassword } from "../../core/utils/password";
import { captainRepository } from "./captain.repository";

export const captainService = {
  async register(input: {
    name: string;
    mobile: string;
    password: string;
    vehicleType: "BIKE" | "CYCLE" | "AUTO" | "WALKING";
    vehicleNumber?: string;
    licenseNumber?: string;
  }) {
    const existing = await captainRepository.findByMobile(input.mobile);
    if (existing) {
      throw new AppError("Mobile already registered", StatusCodes.CONFLICT);
    }
    const passwordHash = await hashPassword(input.password);
    return captainRepository.createCaptainUser({
      ...input,
      passwordHash
    });
  },
  async updateStatus(userId: string, input: {
    isOnline: boolean;
    latitude?: number;
    longitude?: number;
  }) {
    return captainRepository.updateStatus(userId, {
      isOnline: input.isOnline,
      currentLatitude: input.latitude,
      currentLongitude: input.longitude
    });
  },
  async updateLocation(userId: string, input: { latitude: number; longitude: number }) {
    return captainRepository.updateStatus(userId, {
      currentLatitude: input.latitude,
      currentLongitude: input.longitude
    });
  },
  async me(userId: string) {
    const captain = await captainRepository.findProfile(userId);
    if (!captain) {
      throw new AppError("Captain not found", StatusCodes.NOT_FOUND, ERROR_CODES.CAPTAIN_NOT_FOUND);
    }
    return captain;
  }
};
