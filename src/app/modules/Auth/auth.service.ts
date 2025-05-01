import status from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../shared/prisma';
import bcrypt from 'bcrypt';
import config from '../../config';
import { generateToken } from './auth.utils';

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new AppError(status.UNAUTHORIZED, 'this user is not exist');
  }

  const isCurrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password,
  );

  if (!isCurrectPassword) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid email or password');
  }

  const jwtPayload = {
    email: userData.email,
    role: userData.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.JWT.JWT_ACCESS_SECRET as string,
    config.JWT.JWT_ACCESS_EXPIRES_IN,
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.JWT.JWT_REFRESH_SECRET as string,
    config.JWT.JWT_REFRESH_EXPIRES_IN,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  loginUser,
};
