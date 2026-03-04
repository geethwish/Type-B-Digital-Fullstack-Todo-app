import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: unknown[],
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message = "Created successfully",
): Response => sendSuccess(res, data, message, 201);

export const sendNotFound = (
  res: Response,
  message = "Resource not found",
): Response => sendError(res, message, 404);

export const sendBadRequest = (
  res: Response,
  message = "Bad request",
  errors?: unknown[],
): Response => sendError(res, message, 400, errors);
