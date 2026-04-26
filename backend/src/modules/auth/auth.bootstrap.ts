import { UserRole } from "@prisma/client";
import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { hashPassword } from "../../core/utils/password";
import { authRepository } from "./auth.repository";

const normalizeMobile = (mobile: string) => mobile.replace(/\D/g, "");

export const ensureSuperAdmin = async () => {
  if (!env.SUPER_ADMIN_MOBILE || !env.SUPER_ADMIN_PASSWORD) {
    logger.warn("Super admin bootstrap skipped: SUPER_ADMIN_MOBILE or SUPER_ADMIN_PASSWORD not set");
    return;
  }

  const mobile = normalizeMobile(env.SUPER_ADMIN_MOBILE);
  const existingUser = await authRepository.findUserByMobile(mobile);
  const passwordHash = await hashPassword(env.SUPER_ADMIN_PASSWORD);

  if (!existingUser) {
    await authRepository.createUser({
      data: {
        name: env.SUPER_ADMIN_NAME ?? "Super Admin",
        mobile,
        email: env.SUPER_ADMIN_EMAIL,
        passwordHash,
        role: UserRole.SUPER_ADMIN,
        isMobileVerified: true,
        isEmailVerified: Boolean(env.SUPER_ADMIN_EMAIL),
        isActive: true
      }
    });
    logger.info({ mobile }, "Bootstrapped super admin account");
    return;
  }

  if (existingUser.role !== UserRole.SUPER_ADMIN) {
    await authRepository.updateUser(existingUser.id, {
      role: UserRole.SUPER_ADMIN,
      name: env.SUPER_ADMIN_NAME ?? existingUser.name,
      email: env.SUPER_ADMIN_EMAIL ?? existingUser.email,
      passwordHash,
      isMobileVerified: true,
      isEmailVerified: existingUser.isEmailVerified || Boolean(env.SUPER_ADMIN_EMAIL),
      isActive: true
    });
    logger.info({ mobile }, "Upgraded existing user to super admin");
    return;
  }

  await authRepository.updateUser(existingUser.id, {
    name: env.SUPER_ADMIN_NAME ?? existingUser.name,
    email: env.SUPER_ADMIN_EMAIL ?? existingUser.email,
    passwordHash,
    isActive: true
  });
  logger.info({ mobile }, "Refreshed super admin account credentials");
};
