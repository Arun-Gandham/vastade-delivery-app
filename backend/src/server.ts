import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { ensureSuperAdmin } from "./modules/auth/auth.bootstrap";

const startServer = async () => {
  await ensureSuperAdmin();
  app.listen(env.PORT, () => {
    logger.info(`API running on port ${env.PORT}`);
  });
};

startServer().catch((error) => {
  logger.error(error, "Failed to start server");
  process.exit(1);
});
