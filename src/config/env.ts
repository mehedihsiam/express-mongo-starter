import dotenv from "dotenv";

dotenv.config();

export interface IConfig {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  apiPrefix: string;
  logLevel: string;
  corsOrigin: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  requestBodyLimit: string;
  enableFileLogging: boolean;
}

export const config: IConfig = {
  port: parseInt(process.env.PORT || "3000"),
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri:
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/express-mongo-starter",
  apiPrefix: process.env.API_PREFIX || "/api",
  logLevel: process.env.LOG_LEVEL || "info",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  requestBodyLimit: process.env.REQUEST_BODY_LIMIT || "10kb",
  enableFileLogging: process.env.ENABLE_FILE_LOGGING === "true",
};

// Validate required environment variables in production
if (config.nodeEnv === "production") {
  const requiredVars = ["MONGODB_URI"];
  const missingVars = requiredVars.filter((v) => !process.env[v]);
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }
}
