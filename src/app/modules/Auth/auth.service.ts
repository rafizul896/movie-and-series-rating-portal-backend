import status from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../shared/prisma';
import bcrypt from 'bcrypt';
import config from '../../config';
import { generateToken, verifyToken } from './auth.utils';
import { UserStatus } from '@prisma/client';

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

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(token, config.JWT.JWT_REFRESH_SECRET as string);
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new AppError(status.UNAUTHORIZED, 'You are not autherized!');
  }

  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const jwtPayload = {
    email: isUserExists?.email,
    role: isUserExists?.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.JWT.JWT_ACCESS_SECRET as string,
    config.JWT.JWT_ACCESS_EXPIRES_IN,
  );

  return { accessToken };
};

export const AuthServices = {
  loginUser,
  refreshToken,
};
