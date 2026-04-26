import bcrypt from "bcryptjs";
import { env } from "../../config/env";

export const hashPassword = (password: string) =>
  bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

export const comparePassword = (password: string, hashedPassword: string) =>
  bcrypt.compare(password, hashedPassword);
