import {
  CaptainAvailabilityStatus,
  CaptainRegistrationStatus,
  UserRole
} from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { hashPassword } from "../../core/utils/password";
import { prisma } from "../../database/prisma";
import { socketGateway } from "../../realtime/socket-gateway";
import { authService } from "../auth/auth.service";
import { captainRepository } from "./captain.repository";
import type {
  CaptainAdminDecisionInput,
  CaptainDocumentUploadInput,
  CaptainLocationUpdateInput,
  CaptainProfileUpdateInput,
  CaptainRegistrationInput,
  CaptainStatusUpdateInput
} from "./captain.types";

const normalizeMobile = (mobile: string) => mobile.replace(/\D/g, "");

export const captainService = {
  async register(input: CaptainRegistrationInput) {
    const mobile = normalizeMobile(input.mobile);
    const existing = await captainRepository.findUserByMobile(mobile);
    if (existing) {
      throw new AppError("Mobile already registered", StatusCodes.CONFLICT);
    }

    const passwordHash = await hashPassword(input.password);
    const created = await captainRepository.createCaptainApplication({
      ...input,
      mobile,
      passwordHash
    });

    return created;
  },

  async login(input: {
    mobile: string;
    password: string;
    deviceType?: string;
    deviceId?: string;
    fcmToken?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const session = await authService.login(input);
    if (session.user.role !== UserRole.CAPTAIN) {
      throw new AppError("Forbidden", StatusCodes.FORBIDDEN, ERROR_CODES.AUTH_FORBIDDEN);
    }
    return session;
  },

  async me(userId: string) {
    const captain = await captainRepository.findProfileByUserId(userId);
    if (!captain) {
      throw new AppError("Captain not found", StatusCodes.NOT_FOUND, ERROR_CODES.CAPTAIN_NOT_FOUND);
    }
    return captain;
  },

  async updateProfile(userId: string, input: CaptainProfileUpdateInput) {
    return captainRepository.updateProfile(userId, input);
  },

  async updateStatus(userId: string, input: CaptainStatusUpdateInput) {
    const captain = await this.me(userId);
    if (captain.registrationStatus !== CaptainRegistrationStatus.APPROVED) {
      throw new AppError(
        "Captain not approved",
        StatusCodes.FORBIDDEN,
        ERROR_CODES.CAPTAIN_NOT_APPROVED
      );
    }

    const updated = await captainRepository.updateStatusByUserId(userId, input);
    socketGateway.emitEvent(
      input.availabilityStatus === CaptainAvailabilityStatus.OFFLINE
        ? "captain:go_offline"
        : "captain:go_online",
      {
        captainId: captain.id,
        userId,
        availabilityStatus: input.availabilityStatus
      }
    );
    return updated;
  },

  async updateLocation(userId: string, input: CaptainLocationUpdateInput) {
    const updated = await captainRepository.updateLocationByUserId(userId, input);
    if (updated?.id) {
      socketGateway.emitEvent("captain:location_update", {
        captainId: updated.id,
        latitude: input.latitude,
        longitude: input.longitude,
        heading: input.heading,
        speed: input.speed
      });
      socketGateway.emitEvent("captain_location_updated", {
        captainId: updated.id,
        latitude: input.latitude,
        longitude: input.longitude
      });
    }
    return updated;
  },

  async uploadDocument(userId: string, input: CaptainDocumentUploadInput) {
    const captain = await this.me(userId);
    return captainRepository.uploadDocument(captain.id, input);
  },

  async listDocuments(userId: string) {
    const captain = await this.me(userId);
    return captainRepository.listDocuments(captain.id);
  },

  async deleteDocument(userId: string, documentId: string) {
    const captain = await this.me(userId);
    await captainRepository.deleteDocument(captain.id, documentId);
    return { deleted: true };
  },

  async adminList() {
    return captainRepository.listApplications();
  },

  async adminDetails(captainId: string) {
    const captain = await captainRepository.findById(captainId);
    if (!captain) {
      throw new AppError(
        "Captain application not found",
        StatusCodes.NOT_FOUND,
        ERROR_CODES.CAPTAIN_APPLICATION_NOT_FOUND
      );
    }
    return captain;
  },

  async approve(captainId: string, adminId: string, input: CaptainAdminDecisionInput) {
    await this.adminDetails(captainId);
    return prisma.$transaction(async (tx) => {
      const updated = await captainRepository.approve(captainId, adminId, input.remarks, tx);
      await captainRepository.createVerificationLog(
        captainId,
        CaptainRegistrationStatus.APPROVED,
        input.remarks,
        adminId,
        tx
      );
      return updated;
    });
  },

  async reject(captainId: string, adminId: string, input: CaptainAdminDecisionInput) {
    await this.adminDetails(captainId);
    return prisma.$transaction(async (tx) => {
      const updated = await captainRepository.reject(captainId, input.reason, tx);
      await captainRepository.createVerificationLog(
        captainId,
        CaptainRegistrationStatus.REJECTED,
        input.reason,
        adminId,
        tx
      );
      return updated;
    });
  },

  async block(captainId: string, adminId: string, input: CaptainAdminDecisionInput) {
    await this.adminDetails(captainId);
    return prisma.$transaction(async (tx) => {
      const updated = await captainRepository.block(captainId, input.reason, tx);
      await captainRepository.createVerificationLog(
        captainId,
        CaptainRegistrationStatus.BLOCKED,
        input.reason,
        adminId,
        tx
      );
      return updated;
    });
  },

  async unblock(captainId: string, adminId: string, input: CaptainAdminDecisionInput) {
    await this.adminDetails(captainId);
    return prisma.$transaction(async (tx) => {
      const updated = await captainRepository.unblock(captainId, input.remarks, tx);
      await captainRepository.createVerificationLog(
        captainId,
        CaptainRegistrationStatus.APPROVED,
        input.remarks || "Captain unblocked",
        adminId,
        tx
      );
      return updated;
    });
  },

  async adminDocuments(captainId: string) {
    await this.adminDetails(captainId);
    return captainRepository.listDocuments(captainId);
  },

  async adminDeliveries(captainId: string) {
    await this.adminDetails(captainId);
    return captainRepository.listDeliveries(captainId);
  },

  async adminEarnings(captainId: string) {
    await this.adminDetails(captainId);
    return captainRepository.listEarnings(captainId);
  }
};
