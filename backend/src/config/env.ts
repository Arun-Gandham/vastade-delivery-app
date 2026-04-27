import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  USE_REDIS: z.coerce.boolean().default(false),
  REDIS_URL: z.string().optional(),
  SUPER_ADMIN_NAME: z.string().optional(),
  SUPER_ADMIN_MOBILE: z.string().optional(),
  SUPER_ADMIN_EMAIL: z.string().email().optional(),
  SUPER_ADMIN_PASSWORD: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).default(12),
  CORS_ORIGIN: z.string().default("*"),
  MAX_FILE_SIZE_MB: z.coerce.number().default(5),
  DELIVERY_FEE: z.coerce.number().default(25),
  PLATFORM_FEE: z.coerce.number().default(5),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ENDPOINT: z.string().url().optional().or(z.literal("")),
  S3_PUBLIC_BASE_URL: z.string().url().optional().or(z.literal("")),
  S3_KEY_PREFIX: z.string().optional(),
  S3_UPLOAD_URL_EXPIRES_IN: z.coerce.number().int().min(60).max(3600).default(300),
  S3_READ_URL_EXPIRES_IN: z.coerce.number().int().min(60).max(86400).default(3600),
  S3_BUCKET_PUBLIC: z.coerce.boolean().default(false),
  CAPTAIN_MATCH_RADIUS_KM: z.coerce.number().positive().default(5),
  CAPTAIN_MATCH_LIMIT: z.coerce.number().int().positive().default(10),
  CAPTAIN_TASK_OFFER_EXPIRES_IN_SECONDS: z.coerce.number().int().positive().default(45),
  SOCKET_ENABLED: z.coerce.boolean().default(true),
  FCM_ENABLED: z.coerce.boolean().default(false)
});

export const env = envSchema.parse(process.env);
