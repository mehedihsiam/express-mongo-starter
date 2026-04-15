import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { ApiError } from "./apiError";
import { StatusCodes } from "http-status-codes";

export const validateWithJoi = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors: Record<string, any> = {};
      error.details.forEach((detail) => {
        errors[detail.path.join(".")] = detail.message;
      });

      return next(
        new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          "Validation failed",
          true,
          errors,
        ),
      );
    }

    req.body = value;
    next();
  };
};
