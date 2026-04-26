import { prisma } from "../../database/prisma";

export const authRepository = {
  createUser: prisma.user.create.bind(prisma.user),
  findUserByMobile: (mobile: string) =>
    prisma.user.findUnique({
      where: { mobile }
    }),
  updateUser: (id: string, data: Parameters<typeof prisma.user.update>[0]["data"]) =>
    prisma.user.update({
      where: { id },
      data
    }),
  findUserById: (id: string) =>
    prisma.user.findUnique({
      where: { id }
    }),
  createSession: prisma.userSession.create.bind(prisma.userSession),
  findSessionByRefreshToken: (refreshToken: string) =>
    prisma.userSession.findFirst({
      where: { refreshToken, revokedAt: null },
      include: { user: true }
    }),
  revokeSession: (id: string) =>
    prisma.userSession.update({
      where: { id },
      data: { revokedAt: new Date() }
    }),
  revokeAllUserSessions: (userId: string) =>
    prisma.userSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() }
    }),
  updatePassword: (userId: string, passwordHash: string) =>
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    }),
  updateLastLogin: (userId: string) =>
    prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() }
    })
};
