import status from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../shared/prisma';

const createPurchase = async (payload: any) => {
  const exists = await prisma.purchase.findFirst({
    where: {
      userId: payload.userId,
      movieId: payload.movieId,
    },
  });

  if (exists) {
    throw new AppError(
      status.CONFLICT,
      'You have already purchased this content.',
    );
  }

  const result = await prisma.purchase.create({
    data: payload,
  });

  return result;
};

const getPurchasesByUser = async (email: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const result = await prisma.purchase.findMany({
    where: {
      userId: userData?.id,
    },
  });

  return result;
};

const updatePurchase = async (id: string, payload: any) => {
  const result = await prisma.purchase.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deletePurchase = async (id: string) => {
  const result = await prisma.purchase.delete({
    where: {
      id,
    },
  });

  return result;
};

export const PurchaseServices = {
  createPurchase,
  getPurchasesByUser,
  updatePurchase,
  deletePurchase,
};
