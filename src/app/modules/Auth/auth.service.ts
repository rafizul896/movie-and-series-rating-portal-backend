import status from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../shared/prisma';
import bcrypt from 'bcrypt';
import config from '../../config';
import { generateToken, verifyToken } from './auth.utils';
import { UserStatus } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

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

const changePassword = async (user: JwtPayload, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCurrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password,
  );

  if (!isCurrectPassword) {
    throw new AppError(status.UNAUTHORIZED, 'Your Password is Wrong!');
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.BCRYPT_SALt_ROUNDS),
  );

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return;
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
};
