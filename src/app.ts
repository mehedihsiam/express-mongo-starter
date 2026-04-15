import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import "express-async-errors";
import { config } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { requestIdMiddleware } from "./middleware/request-id.middleware";
import { logger } from "./config/winston-logger";
import { ApiResponseHandler } from "./utils/response";

export const createApp = (): Express => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );

  // Request ID middleware
  app.use(requestIdMiddleware);

  // Body parser middleware
  app.use(express.json({ limit: config.requestBodyLimit }));
  app.use(
    express.urlencoded({ limit: config.requestBodyLimit, extended: true }),
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: "Too many requests from this IP, please try again later.",
  });
  app.use(limiter);

  // Logging middleware
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    }),
  );

  // Health check endpoints
  app.get("/health", (req: Request, res: Response) => {
    ApiResponseHandler.success(res, { status: "healthy" }, "Server is running");
  });

  app.get("/ready", (req: Request, res: Response) => {
    ApiResponseHandler.success(res, { ready: true }, "Server is ready");
  });

  // API routes
  app.use(config.apiPrefix, (req: Request, res: Response) => {
    ApiResponseHandler.info(res, "API is running", {
      version: "1.0.0",
      apiPrefix: config.apiPrefix,
    });
  });

  // 404 handler
  app.use("*", (req: Request, res: Response) => {
    ApiResponseHandler.error(res, "Route not found", 404);
  });

  // Error middleware (must be last)
  app.use(errorMiddleware);

  return app;
};
