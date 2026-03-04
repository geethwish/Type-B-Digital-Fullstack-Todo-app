import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/apiResponse";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    sendError(res, err.message, 400);
    return;
  }

  console.error("Unhandled error:", err);
  sendError(res, "Internal server error", 500);
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  sendError(res, `Route not found`, 404);
};
