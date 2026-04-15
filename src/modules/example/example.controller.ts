import { Request, Response } from "express";
import { ExampleService } from "./example.service";
import { ApiResponseHandler } from "../../utils/response";
import { asyncHandler } from "../../utils/asyncHandler";

const exampleService = new ExampleService();

export const getAllExamples = asyncHandler(
  async (req: Request, res: Response) => {
    const examples = await exampleService.findAll();
    ApiResponseHandler.success(
      res,
      examples,
      "Examples retrieved successfully",
    );
  },
);

export const getExampleById = asyncHandler(
  async (req: Request, res: Response) => {
    const example = await exampleService.findById(req.params.id);
    ApiResponseHandler.success(res, example, "Example retrieved successfully");
  },
);

export const createExample = asyncHandler(
  async (req: Request, res: Response) => {
    const example = await exampleService.create(req.body);
    ApiResponseHandler.created(res, example, "Example created successfully");
  },
);

export const updateExample = asyncHandler(
  async (req: Request, res: Response) => {
    const example = await exampleService.update(req.params.id, req.body);
    ApiResponseHandler.success(res, example, "Example updated successfully");
  },
);

export const deleteExample = asyncHandler(
  async (req: Request, res: Response) => {
    await exampleService.delete(req.params.id);
    ApiResponseHandler.noContent(res);
  },
);
