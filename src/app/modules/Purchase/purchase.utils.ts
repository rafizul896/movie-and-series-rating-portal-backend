import prisma from '../../shared/prisma';

export const createWatchlistFromPurchase = async (
  userId: string,
  movieId: string,
) => {
  // Step 1: Check if already in watchlist
  const exist = await prisma.watchlist.findFirst({
    where: {
      userId,
      movieId,
    },
  });

  // Step 2: If exists, skip creation and return it
  if (exist) {
    return exist;
  }

  // Step 3: Otherwise, create new watchlist entry
  const result = await prisma.watchlist.create({
    data: {
      userId,
      movieId,
    },
  });

  return result;
};
