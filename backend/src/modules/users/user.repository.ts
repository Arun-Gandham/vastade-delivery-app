import { UpdateProfileInput } from "./user.types";
import { prisma } from "../../database/prisma";

export const userRepository = {
  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        mobile: true,
        email: true,
        role: true,
        profileImage: true,
        isActive: true,
        createdAt: true
      }
    }),
  updateMe: (userId: string, data: UpdateProfileInput) =>
    prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        mobile: true,
        email: true,
        role: true,
        profileImage: true
      }
    })
};
