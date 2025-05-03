import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

export const validationRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({ body: req.body });
    next();
  });
};
