import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils/apiError";
import Example, { IExample } from "./example.model";

export class ExampleService {
  async findAll() {
    try {
      return await Example.find({ isActive: true })
        .sort({ createdAt: -1 })
        .lean();
    } catch (error: any) {
      throw ApiError.internal("Failed to retrieve examples");
    }
  }

  async findById(id: string): Promise<IExample> {
    try {
      const example = await Example.findById(id);
      if (!example) {
        throw ApiError.notFound("Example not found");
      }
      return example;
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      if (error.kind === "ObjectId") {
        throw ApiError.badRequest("Invalid ID format");
      }
      throw ApiError.internal("Failed to retrieve example");
    }
  }

  async create(data: Partial<IExample>): Promise<IExample> {
    try {
      const example = new Example(data);
      return await example.save();
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors)
          .map((err: any) => err.message)
          .join(", ");
        throw ApiError.unprocessable(messages);
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw ApiError.conflict(`${field} already exists`);
      }
      throw ApiError.internal("Failed to create example");
    }
  }

  async update(id: string, data: Partial<IExample>): Promise<IExample> {
    try {
      const example = await Example.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!example) {
        throw ApiError.notFound("Example not found");
      }

      return example;
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      if (error.kind === "ObjectId") {
        throw ApiError.badRequest("Invalid ID format");
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors)
          .map((err: any) => err.message)
          .join(", ");
        throw ApiError.unprocessable(messages);
      }
      throw ApiError.internal("Failed to update example");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Example.findByIdAndDelete(id);
      if (!result) {
        throw ApiError.notFound("Example not found");
      }
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      if (error.kind === "ObjectId") {
        throw ApiError.badRequest("Invalid ID format");
      }
      throw ApiError.internal("Failed to delete example");
    }
  }
}
