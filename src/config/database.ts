import mongoose from "mongoose";
import { config } from "./env";
import { logger } from "./winston-logger";

export const connectDatabase = async () => {
  try {
    const mongoOptions = {
      minPoolSize: 5,
      maxPoolSize: 10,
    };

    await mongoose.connect(config.mongodbUri, mongoOptions);

    logger.info("Database connected successfully");

    mongoose.connection.on("disconnected", () => {
      logger.warn("Database disconnected");
    });

    mongoose.connection.on("error", (error) => {
      logger.error("Database connection error:", error);
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("Database reconnected");
    });
  } catch (error: any) {
    logger.error("Failed to connect to database:", error.message);
    // Retry logic
    const retryAttempts = 5;
    for (let i = 1; i <= retryAttempts; i++) {
      logger.info(`Retrying database connection (${i}/${retryAttempts})...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      try {
        await mongoose.connect(config.mongodbUri);
        logger.info("Database connected successfully on retry");
        return;
      } catch (retryError: any) {
        logger.error(`Retry attempt ${i} failed:`, retryError.message);
      }
    }
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    logger.info("Database disconnected");
  } catch (error: any) {
    logger.error("Error disconnecting database:", error.message);
    process.exit(1);
  }
};
