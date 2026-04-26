import { StatusCodes } from "http-status-codes";
import { ErrorCode, ERROR_CODES } from "../../constants/error-codes";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = StatusCodes.BAD_REQUEST,
    errorCode: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}
