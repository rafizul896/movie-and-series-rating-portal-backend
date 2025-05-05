import bcrypt from 'bcrypt';
import config from '../../config';
import prisma from '../../shared/prisma';

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
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};

export const UserService = {
  createUser,
  getAllUsersFromDB,
};
