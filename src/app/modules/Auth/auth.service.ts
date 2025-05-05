import status from 'http-status';
import prisma from '../../shared/prisma';
import bcrypt from 'bcrypt';
import config from '../../config';
import { generateToken, verifyToken } from './auth.utils';
import { UserStatus } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import sendEmail from '../../utils/sendEmail';
import AppError from '../../error/AppError';

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(status.UNAUTHORIZED, 'This user is not exist');
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
    id: userData.id,
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
    id: isUserExists?.id,
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

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('user data', userData);

  if (!userData) {
    throw new AppError(status.NOT_FOUND, 'Invalid email id');
  }

  const jwtPayload = {
    email: userData?.email,
    id: userData?.id,
    role: userData?.role,
  };

  const resetPasswordToken = generateToken(
    jwtPayload,
    config.JWT.JWT_RESET_PASSWORD_SECRET as string,
    config.JWT.JWT_RESET_PASSWORD_EXPIRES_IN,
  );

  const resetPasswordLink =
    config.RESET_PASSWORD_LINK +
    `?userId=${userData.id}&token=${resetPasswordToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #2E86C1;">Password Reset Request</h2>
      <p>Hi there,</p>
  
      <p>We received a request to reset your password for your <strong>Movie and Series Rating & Streaming Portal</strong> account.</p>
      <p>If you made this request, click the button below to reset your password:</p>
      <a href="${resetPasswordLink}" target="_blank" style="display: inline-block; margin: 20px 0; padding: 12px 20px; background-color: #2E86C1; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 15 minutes for your security.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>Thanks,<br>The Movie and Series Rating & Streaming Portal Team</p>
    </div>
  `;

  await sendEmail(userData.email, html);
};

const resetPassword = async (
  token: string,
  payload: { email: string; password: string },
) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email, //there i chaged 
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const isValidToken = verifyToken(
    token,
    config.JWT.JWT_RESET_PASSWORD_SECRET as string,
  );

  if (!isValidToken) {
    throw new AppError(status.FORBIDDEN, 'Invalid token');
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALt_ROUNDS),
  );

  await prisma.user.update({
    where: {
      email: userData.email, //there i chaged 
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
  forgotPassword,
  resetPassword,
};
