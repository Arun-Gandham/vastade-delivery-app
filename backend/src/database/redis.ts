import IORedis from "ioredis";
import { env } from "../config/env";

export const redis =
  env.USE_REDIS && env.REDIS_URL
    ? new IORedis(env.REDIS_URL, {
        maxRetriesPerRequest: null
      })
    : null;
