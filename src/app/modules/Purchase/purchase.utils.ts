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
      userId:userId,
      movieId: movieId,
    },
  });

  return result;
};

export const createManyWatchlistFromPurchases = async (payloads: { userId: string, movieId: string }[]) => {
  if (!Array.isArray(payloads) || payloads.length === 0) return [];

  // Step 1: Check which already exist in watchlist
  const existingWatchlists = await prisma.watchlist.findMany({
    where: {
      OR: payloads.map((p) => ({
        userId: p.userId,
        movieId: p.movieId,
      })),
    },
    select: {
      userId: true,
      movieId: true,
    },
  });

  const existingMap = new Set(
    existingWatchlists.map((w) => `${w.userId}-${w.movieId}`)
  );

  // Step 2: Filter new entries
  const filteredPayloads = payloads.filter(
    (p) => !existingMap.has(`${p.userId}-${p.movieId}`)
  );

  // Step 3: Create watchlists for new entries
  if (filteredPayloads.length > 0) {
    await prisma.watchlist.createMany({
      data: filteredPayloads,
      skipDuplicates: true,
    });
  }

  return { created: filteredPayloads.length };
};
