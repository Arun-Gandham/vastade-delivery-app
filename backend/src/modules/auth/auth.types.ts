import { UserRole } from "@prisma/client";

export interface TokenPayload {
  userId: string;
  role: UserRole;
}
