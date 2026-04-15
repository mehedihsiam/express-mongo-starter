import { StatusCodes } from "http-status-codes";

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: Record<string, any> | string[];

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    errors?: Record<string, any> | string[],
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
  }

  static badRequest(
    message: string,
    errors?: Record<string, any> | string[],
  ): ApiError {
    return new ApiError(StatusCodes.BAD_REQUEST, message, true, errors);
  }

  static unauthorized(message: string = "Unauthorized"): ApiError {
    return new ApiError(StatusCodes.UNAUTHORIZED, message);
  }

  static forbidden(message: string = "Forbidden"): ApiError {
    return new ApiError(StatusCodes.FORBIDDEN, message);
  }

  static notFound(message: string = "Not found"): ApiError {
    return new ApiError(StatusCodes.NOT_FOUND, message);
  }

  static conflict(message: string = "Conflict"): ApiError {
    return new ApiError(StatusCodes.CONFLICT, message);
  }

  static unprocessable(
    message: string = "Unprocessable entity",
    errors?: Record<string, any>,
  ): ApiError {
    return new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      message,
      true,
      errors,
    );
  }

  static internal(message: string = "Internal server error"): ApiError {
    return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, message, false);
  }

  static serviceUnavailable(message: string = "Service unavailable"): ApiError {
    return new ApiError(StatusCodes.SERVICE_UNAVAILABLE, message, false);
  }
}
