import status from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../shared/prisma';

const createWatchlist = async (payload: {
  userId: string;
  movieId: string;
}) => {
  const exist = await prisma.watchlist.findFirst({
    where: {
      userId: payload.userId,
      movieId: payload.movieId,
    },
  });

  if (exist) {
    throw new AppError(status.CONFLICT, 'Already in watchlist!');
  }

  const result = await prisma.watchlist.create({
    data: payload,
  });

  return result;
};

const getAllWatchlistByUser = async (email: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const result = await prisma.watchlist.findMany({
    where: {
      userId: userData?.id,
    },
  });

  return result;
};

const deleteWatchlistItem = async (id: string) => {
  const result = await prisma.watchlist.delete({
    where: {
      id,
    },
  });

  return result;
};

export const WatchlistServices = {
  createWatchlist,
  getAllWatchlistByUser,
  deleteWatchlistItem,
};
