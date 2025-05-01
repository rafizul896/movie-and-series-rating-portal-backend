import { Prisma } from "@prisma/client";
import httpStatus from "http-status";

interface SimplifiedPrismaError {
  statusCode: number;
  message: string;
  error?: any;
}

export const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError
): SimplifiedPrismaError => {
  if (err.code === "P2002") {
    // Duplicate field error
    const target = (err.meta as { target?: string[] })?.target;
    return {
      statusCode: httpStatus.CONFLICT,
      message: `Duplicate field error: ${
        Array.isArray(target) ? target.join(", ") : "unknown"
      }`,
    };
  } else if (err.code === "P2025") {
    // Record not found error
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: `${err?.meta?.modelName} not found`,
    };
  } else {
    // Other Prisma errors
    return {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Database error",
      error: err.message,
    };
  }
};
