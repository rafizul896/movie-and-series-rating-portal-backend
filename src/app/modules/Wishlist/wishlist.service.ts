import status from 'http-status';
import prisma from '../../shared/prisma';
import AppError from '../../error/AppError';

const createWishlist = async (payload: { userId: string; movieId: string }) => {
  const exist = await prisma.wishlist.findFirst({
    where: {
      userId: payload.userId,
      movieId: payload.movieId,
    },
  });

  if (exist) {
    throw new AppError(status.CONFLICT, 'Already in wishlist!');
  }

  const result = await prisma.wishlist.create({
    data: payload,
  });

  return result;
};

const getAllWishlistByUser = async (email: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const result = await prisma.wishlist.findMany({
    where: {
      userId: userData?.id,
    },
    include: {
      movies: true,
    },
  });

  // format
  const formatted = result.map((item) => ({
    id: item.id,
    movieId: item.movies.id,
    title: item.movies.title,
    image: item.movies.thumbnail,
    buyPrice: item.movies.buyPrice,
    rentPrice: item.movies.rentPrice,
    discountPercentage: item.movies.discountPercentage,
    purchaseType: 'BUY',
    type: item.movies.type,
  }));

  return formatted;
};

const deleteWishlistItem = async (id: string) => {
  const result = await prisma.wishlist.delete({
    where: {
      id,
    },
  });

  return result;
};
const deleteManyWishlistItem = async (userId: string) => {
  const result = await prisma.wishlist.deleteMany({
    where: {
      userId,
    },
  });

  return result;
};

export const wishlistServices = {
  createWishlist,
  getAllWishlistByUser,
  deleteWishlistItem,
  deleteManyWishlistItem,
};
