import { createServer } from "node:http";
import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { ensureSuperAdmin } from "./modules/auth/auth.bootstrap";
import { socketGateway } from "./realtime/socket-gateway";

const startServer = async () => {
  await ensureSuperAdmin();
  const httpServer = createServer(app);
  socketGateway.attach(httpServer);
  httpServer.listen(env.PORT, () => {
    logger.info(`API running on port ${env.PORT}`);
  });
};

startServer().catch((error) => {
  logger.error(error, "Failed to start server");
  process.exit(1);
});
