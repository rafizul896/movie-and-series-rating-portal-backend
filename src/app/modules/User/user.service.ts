import bcrypt from 'bcrypt';
import config from '../../config';
import prisma from '../../shared/prisma';
import { generateToken } from '../Auth/auth.utils';
import { User, UserStatus } from '@prisma/client';
import { IPaginationOptions } from '../../interface/pagination';
import { paginationHelper } from '../../helpers/paginationHelpers';
import { Request } from 'express';

const createUser = async (data: any) => {
  const hashPassword = await bcrypt.hash(
    data.password,
    Number(config.BCRYPT_SALt_ROUNDS),
  );

  const userData = {
    name: data.name,
    email: data.email,
    password: hashPassword,
  };

  const result = await prisma.user.create({
    data: userData,
  });

  const jwtPayload = {
    email: result.email,
    id: result.id,
    role: result.role,
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

const getAllUsersFromDB = async (options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const result = await prisma.user.findMany({
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.user.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getUserByIdFromDB = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
  });

  return result;
};

//  if (file) {
//     movieData.thumbnail = file.path;
//   }

//   const result = await prisma.movie.create({
//     data: movieData,
//   });
//   return result;

const updateIntoDB = async (req: Request): Promise<User> => {
  const file = req?.file;
  const payload = req.body;
  const { id } = req.params;

  if (file) {
    payload.profileImage = file.path;
  }

  await prisma.user.findUniqueOrThrow({
    where: {
      id,
      status: 'ACTIVE',
    },
  });

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });

  return result;
};

const deleteFromDB = async (id: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.user.delete({
    where: {
      id,
    },
  });

  return result;
};

const softDeleteFromDB = async (id: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: UserStatus.DELETED,
    },
  });

  return;
};

export const UserService = {
  createUser,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
