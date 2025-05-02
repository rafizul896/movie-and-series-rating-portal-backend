import { ZodError } from "zod";
import httpStatus from "http-status";

interface SimplifiedZodError {
  statusCode: number;
  message: string;
  error: Array<{ path: string; message: string }>;
}

export const handleZodError = (err: ZodError): SimplifiedZodError => {
  const ZodError = err.issues.map((issue) => {
    return {
      path: issue.path.join(">>>"),
      message: issue.message,
    };
  });
  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Zod Validation error",
    error: ZodError,
  };
};
