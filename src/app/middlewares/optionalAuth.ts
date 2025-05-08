import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../modules/Auth/auth.utils';
import config from '../config';
import { Secret } from 'jsonwebtoken';

const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded = verifyToken(
        token,
        config.JWT.JWT_ACCESS_SECRET as Secret,
      );
      req.user = decoded;
    } catch {
      req.user = undefined;
    }
  }
  next();
};

export default optionalAuth;
