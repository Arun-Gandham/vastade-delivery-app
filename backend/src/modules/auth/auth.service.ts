import { UserRole } from "@prisma/client";
import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { comparePassword, hashPassword } from "../../core/utils/password";
import { generateTokens, verifyRefreshToken } from "../../core/utils/jwt";
import { authRepository } from "./auth.repository";

const normalizeMobile = (mobile: string) => mobile.replace(/\D/g, "");

export const authService = {
  async registerCustomer(input: {
    name: string;
    mobile: string;
    email?: string;
    password: string;
  }) {
    const mobile = normalizeMobile(input.mobile);
    const existingUser = await authRepository.findUserByMobile(mobile);
    if (existingUser) {
      throw new AppError("Mobile already registered", StatusCodes.CONFLICT);
    }

    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.createUser({
      data: {
        name: input.name,
        mobile,
        email: input.email,
        passwordHash,
        role: UserRole.CUSTOMER
      }
    });

    return {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      role: user.role
    };
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
    const mobile = normalizeMobile(input.mobile);
    const user = await authRepository.findUserByMobile(mobile);
    if (!user?.passwordHash || !(await comparePassword(input.password, user.passwordHash))) {
      throw new AppError(
        "Invalid credentials",
        StatusCodes.UNAUTHORIZED,
        ERROR_CODES.AUTH_INVALID_CREDENTIALS
      );
    }

    if (!user.isActive) {
      throw new AppError("User inactive", StatusCodes.FORBIDDEN, ERROR_CODES.AUTH_FORBIDDEN);
    }

    const tokens = generateTokens({ userId: user.id, role: user.role });
    await authRepository.createSession({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        deviceId: input.deviceId,
        deviceType: input.deviceType,
        fcmToken: input.fcmToken,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        expiresAt: dayjs().add(30, "day").toDate()
      }
    });
    await authRepository.updateLastLogin(user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        role: user.role
      }
    };
  },

  async refreshToken(refreshToken: string) {
    verifyRefreshToken(refreshToken);
    const session = await authRepository.findSessionByRefreshToken(refreshToken);
    if (!session) {
      throw new AppError("Session not found", StatusCodes.UNAUTHORIZED, ERROR_CODES.AUTH_UNAUTHORIZED);
    }

    await authRepository.revokeSession(session.id);
    const tokens = generateTokens({ userId: session.user.id, role: session.user.role });
    await authRepository.createSession({
      data: {
        userId: session.user.id,
        refreshToken: tokens.refreshToken,
        deviceId: session.deviceId,
        deviceType: session.deviceType,
        fcmToken: session.fcmToken,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        expiresAt: dayjs().add(Number(env.JWT_REFRESH_EXPIRES_IN.replace("d", "")) || 30, "day").toDate()
      }
    });

    return tokens;
  },

  async logout(refreshToken: string) {
    const session = await authRepository.findSessionByRefreshToken(refreshToken);
    if (session) {
      await authRepository.revokeSession(session.id);
    }
  },

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await authRepository.findUserById(userId);
    if (!user?.passwordHash || !(await comparePassword(oldPassword, user.passwordHash))) {
      throw new AppError(
        "Old password is incorrect",
        StatusCodes.BAD_REQUEST,
        ERROR_CODES.AUTH_INVALID_CREDENTIALS
      );
    }

    const passwordHash = await hashPassword(newPassword);
    await authRepository.updatePassword(userId, passwordHash);
    await authRepository.revokeAllUserSessions(userId);
  }
};
