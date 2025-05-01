import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: 'Api Not Found!',
    error: {
      path: req.originalUrl,
      message: 'Requested path is not found! ',
    },
  });

  next();
};

export default notFound;
