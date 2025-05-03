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

const updatePurchase = async () => {};

const deletePurchase = async (id: string) => {
  console.log(id);
};

export const PurchaseServices = {
  createPurchase,
  getPurchasesByUser,
  updatePurchase,
  deletePurchase,
};
