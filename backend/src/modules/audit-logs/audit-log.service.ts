import { prisma } from "../../database/prisma";

export const auditLogService = {
  create(input: {
    userId?: string | null;
    action: string;
    entityName: string;
    entityId?: string | null;
    oldValue?: unknown;
    newValue?: unknown;
    ipAddress?: string | null;
    userAgent?: string | null;
  }) {
    return prisma.auditLog.create({
      data: {
        userId: input.userId ?? undefined,
        action: input.action,
        entityName: input.entityName,
        entityId: input.entityId ?? undefined,
        oldValue: input.oldValue as never,
        newValue: input.newValue as never,
        ipAddress: input.ipAddress ?? undefined,
        userAgent: input.userAgent ?? undefined
      }
    });
  }
};
