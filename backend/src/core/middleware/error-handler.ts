import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { logger } from "../../config/logger";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../errors/app-error";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode,
      errors: error.details ?? []
    });
  }

  if (error instanceof ZodError) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: "Validation failed",
      errorCode: ERROR_CODES.VALIDATION_ERROR,
      errors: error.flatten()
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Database request failed",
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      errors: [{ code: error.code, meta: error.meta }]
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal server error",
    errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    errors: []
  });
};
