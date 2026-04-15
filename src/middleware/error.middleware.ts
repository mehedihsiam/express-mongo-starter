import { Request, Response, NextFunction } from "express";
import { ApiResponseHandler } from "../utils/response";
import { ApiError } from "../utils/apiError";
import { logger } from "../config/winston-logger";
import { StatusCodes } from "http-status-codes";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = req.id || "unknown";

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const errors: Record<string, any> = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
    logger.error(`[${requestId}] Validation Error:`, errors);
    return ApiResponseHandler.error(
      res,
      "Validation failed",
      StatusCodes.UNPROCESSABLE_ENTITY,
      errors,
    );
  }

  // Handle Mongoose cast errors
  if (err.name === "CastError") {
    logger.error(`[${requestId}] Invalid ID format`);
    return ApiResponseHandler.error(
      res,
      "Invalid ID format",
      StatusCodes.BAD_REQUEST,
    );
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    logger.error(`[${requestId}] Duplicate key error on field: ${field}`);
    return ApiResponseHandler.error(
      res,
      `${field} already exists`,
      StatusCodes.CONFLICT,
    );
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    logger.error(`[${requestId}] JWT Error: ${err.message}`);
    return ApiResponseHandler.error(
      res,
      "Invalid token",
      StatusCodes.UNAUTHORIZED,
    );
  }

  if (err.name === "TokenExpiredError") {
    logger.error(`[${requestId}] Token Expired`);
    return ApiResponseHandler.error(
      res,
      "Token expired",
      StatusCodes.UNAUTHORIZED,
    );
  }

  // Handle custom ApiError
  if (err instanceof ApiError) {
    logger.error(`[${requestId}] ApiError: ${err.message}`, err.errors);
    return ApiResponseHandler.error(
      res,
      err.message,
      err.statusCode,
      err.errors,
    );
  }

  // Handle unexpected errors
  logger.error(`[${requestId}] Unexpected Error:`, err.message);
  return ApiResponseHandler.error(
    res,
    "Internal server error",
    StatusCodes.INTERNAL_SERVER_ERROR,
  );
};
