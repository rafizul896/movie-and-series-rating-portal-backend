import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { verifyToken } from '../modules/Auth/auth.utils';
import config from '../config';
import { Secret } from 'jsonwebtoken';
import prisma from '../shared/prisma';
import { UserStatus } from '@prisma/client';
import AppError from '../error/AppError';

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string = req.headers.authorization!;

      if (!token) {
        throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
      }

      const verifyUser = verifyToken(
        token,
        config.JWT.JWT_ACCESS_SECRET as Secret,
      );

      req.user = verifyUser;

      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
      }

      const userData = await prisma.user.findUnique({
        where: {
          email: verifyUser.email,
        },
      });

      if (userData?.status !== UserStatus.ACTIVE) {
        throw new AppError(status.UNAUTHORIZED, 'Action not allowed');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
