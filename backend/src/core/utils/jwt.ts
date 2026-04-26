import { UserRole } from "@prisma/client";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../errors/app-error";

interface TokenPayload extends JwtPayload {
  userId: string;
  role: UserRole;
}

const sign = (
  payload: { userId: string; role: UserRole },
  secret: Secret,
  expiresIn: SignOptions["expiresIn"]
) => jwt.sign(payload, secret, { expiresIn });

export const generateTokens = (payload: { userId: string; role: UserRole }) => ({
  accessToken: sign(payload, env.JWT_ACCESS_SECRET, env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]),
  refreshToken: sign(
    payload,
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
  )
});

const verify = (token: string, secret: Secret) => {
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (_error) {
    throw new AppError(
      "Token expired or invalid",
      StatusCodes.UNAUTHORIZED,
      ERROR_CODES.AUTH_TOKEN_EXPIRED
    );
  }
};

export const verifyAccessToken = (token: string) => verify(token, env.JWT_ACCESS_SECRET);
export const verifyRefreshToken = (token: string) => verify(token, env.JWT_REFRESH_SECRET);
