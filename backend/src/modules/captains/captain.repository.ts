import { UserRole } from "@prisma/client";
import { prisma } from "../../database/prisma";

export const captainRepository = {
  findByMobile: (mobile: string) =>
    prisma.user.findUnique({
      where: { mobile }
    }),
  createCaptainUser: (data: {
    name: string;
    mobile: string;
    passwordHash: string;
    vehicleType: "BIKE" | "CYCLE" | "AUTO" | "WALKING";
    vehicleNumber?: string;
    licenseNumber?: string;
  }) =>
    prisma.user.create({
      data: {
        name: data.name,
        mobile: data.mobile,
        passwordHash: data.passwordHash,
        role: UserRole.CAPTAIN,
        captainProfile: {
          create: {
            vehicleType: data.vehicleType,
            vehicleNumber: data.vehicleNumber,
            licenseNumber: data.licenseNumber
          }
        }
      },
      include: { captainProfile: true }
    }),
  updateStatus: (userId: string, data: Record<string, unknown>) =>
    prisma.captain.update({
      where: { userId },
      data
    }),
  findProfile: (userId: string) =>
    prisma.captain.findUnique({
      where: { userId },
      include: { user: true }
    })
};
