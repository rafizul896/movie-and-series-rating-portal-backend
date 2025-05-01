/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { handleZodError } from "./zodError";
import { handlePrismaError } from "./prismaErrorHandler";
import AppError from "./AppError";

const isDevelopment = process.env.NODE_ENV === "development";

export const globalErrorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorDetails: any = undefined;

  // Handle Zod Validation Error
  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = {
      details: simplifiedError.error,
    };
  }
  // Handle Prisma Errors
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = simplifiedError.error ? { details: simplifiedError.error } : undefined;
  }
  // Handle Custom AppError
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Handle Generic Error
  else if (error instanceof Error) {
    message = error.message || message;
    statusCode = (error as any).statusCode || statusCode;
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    ...(errorDetails && { errorDetails }),
    ...(isDevelopment && error instanceof Error && { stack: error.stack }),
  });
};