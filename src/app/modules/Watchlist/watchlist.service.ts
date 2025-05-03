import prisma from '../../shared/prisma';

const createWatchlist = async (payload: {
  userId: string;
  movieId: string;
}) => {
  const result = await prisma.watchlist.create({
    data: payload,
  });

  return result;
};

const getAllWatchlist = async (email: string) => {
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

export const WatchlistServices = {
  createWatchlist,
  getAllWatchlist,
};
