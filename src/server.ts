import http from "http";
import { createApp } from "./app";
import { config } from "./config/env";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { logger } from "./config/winston-logger";

let server: http.Server;

export const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    server = http.createServer(app);
    server.listen(config.port, () => {
      logger.info(
        `Server running on port ${config.port} in ${config.nodeEnv} mode`,
      );
    });

    // Graceful shutdown handlers
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, starting graceful shutdown...`);

      const shutdownTimeout = setTimeout(() => {
        logger.error("Graceful shutdown timeout, forcing exit");
        process.exit(1);
      }, 10000);

      server.close(async () => {
        clearTimeout(shutdownTimeout);
        await disconnectDatabase();
        logger.info("Server closed gracefully");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    });

    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", error);
      process.exit(1);
    });
  } catch (error: any) {
    logger.error("Failed to start server:", error.message);
    process.exit(1);
  }
};
