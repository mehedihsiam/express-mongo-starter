import { Response } from "express";
import { StatusCodes } from "http-status-codes";

interface IApiResponse<T> {
  status: "success" | "error" | "info";
  data?: T;
  message?: string;
  errors?: Record<string, any>;
  statusCode?: number;
}

export class ApiResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = StatusCodes.OK,
  ): Response {
    return res.status(statusCode).json({
      status: "success",
      data,
      message,
    } as IApiResponse<T>);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = "Resource created successfully",
  ): Response {
    return res.status(StatusCodes.CREATED).json({
      status: "success",
      data,
      message,
    } as IApiResponse<T>);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = StatusCodes.BAD_REQUEST,
    errors?: Record<string, any> | string[],
  ): Response {
    return res.status(statusCode).json({
      status: "error",
      message,
      errors,
      statusCode,
    } as IApiResponse<null>);
  }

  static info<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = StatusCodes.OK,
  ): Response {
    return res.status(statusCode).json({
      status: "info",
      message,
      data,
    } as IApiResponse<T>);
  }

  static noContent(res: Response): Response {
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = "Retrieved successfully",
  ): Response {
    return res.status(StatusCodes.OK).json({
      status: "success",
      data,
      message,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  }

  static buildResponse<T>(
    data: T,
    message: string,
    statusCode: number = StatusCodes.OK,
  ): IApiResponse<T> {
    return {
      status: "success",
      data,
      message,
      statusCode,
    };
  }
}
