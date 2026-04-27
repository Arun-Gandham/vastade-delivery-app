import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../errors/app-error";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthUser {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError(
      "Unauthorized",
      StatusCodes.UNAUTHORIZED,
      ERROR_CODES.AUTH_UNAUTHORIZED
    );
  }

  const token = authHeader.replace("Bearer ", "");
  const payload = verifyAccessToken(token);
  req.authUser = { userId: payload.userId, role: payload.role };
  next();
};

export const roleMiddleware =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.authUser) {
      throw new AppError(
        "Unauthorized",
        StatusCodes.UNAUTHORIZED,
        ERROR_CODES.AUTH_UNAUTHORIZED
      );
    }

    const normalizedAllowedRoles = roles.map((role) => String(role).trim().toUpperCase());
    const normalizedUserRole = String(req.authUser.role).trim().toUpperCase();

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      throw new AppError("Forbidden", StatusCodes.FORBIDDEN, ERROR_CODES.AUTH_FORBIDDEN);
    }

    next();
  };
