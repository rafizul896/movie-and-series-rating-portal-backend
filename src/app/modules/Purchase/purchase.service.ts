import status from 'http-status';
import prisma from '../../shared/prisma';
import AppError from '../../error/AppError';
import { Prisma } from '@prisma/client';

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

type AnalyticsFilter = {
  startDate?: string;
  endDate?: string;
};

const getPurchaseAnalytics = async (filter: AnalyticsFilter = {}) => {
  const { startDate, endDate } = filter;

  const dateFilter: Prisma.PurchaseWhereInput = {};
  if (startDate && endDate) {
    dateFilter.purchasedAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const [totalPurchases, totalRevenueAgg, rentalCount, buyCount, recentSales] =
    await Promise.all([
      prisma.purchase.count({ where: dateFilter }),

      prisma.purchase.aggregate({
        where: dateFilter,
        _sum: { amount: true },
      }),

      prisma.purchase.count({
        where: {
          ...dateFilter,
          purchase_type: 'RENT',
        },
      }),

      prisma.purchase.count({
        where: {
          ...dateFilter,
          purchase_type: 'BUY',
        },
      }),

      prisma.purchase.findMany({
        take: 5,
        orderBy: { purchasedAt: 'desc' },
        include: {
          users: {
            select: {
              name: true,
              email: true,
            },
          },
          movie: {
            select: {
              title: true,
            },
          },
        },
      }),
    ]);

  return {
    totalRevenue: totalRevenueAgg._sum.amount || 0,
    totalPurchases,
    rentalCount,
    buyCount,
    recentSales: recentSales.map((purchase) => ({
      name: purchase.users?.name || 'Anonymous',
      email: purchase.users?.email || '',
      amount: purchase.amount,
      movieTitle: purchase.movie?.title || 'Unknown',
    })),
  };
};

const getMovieWiseSales = async (query: any) => {
  const { startDate, endDate } = query;
  const page = Number(query?.page) || 1;
  const pageSize = Number(query?.pageSize) || 10;

  const dateFilter: Prisma.PurchaseWhereInput = {};
  if (startDate && endDate) {
    dateFilter.purchasedAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const groupedMovieSales = await prisma.purchase.groupBy({
    by: ['movieId'],
    where: dateFilter,
    _sum: { amount: true },
  });

  // Fetch movie titles for each grouped movieId
  const movieIds = groupedMovieSales.map((item) => item.movieId);

  const movieData = await prisma.movie.findMany({
    where: { id: { in: movieIds } },
    select: { id: true, title: true },
  });

  const movieTitleMap = movieData.reduce(
    (acc, movie) => {
      acc[movie.id] = movie.title;
      return acc;
    },
    {} as Record<string, string>,
  );

  // Paginate movieWiseSales
  const totalMovies = groupedMovieSales.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMovieSales = groupedMovieSales.slice(startIndex, endIndex);

  return {
    movieWiseSales: paginatedMovieSales.map((entry) => ({
      movieId: entry.movieId,
      movieTitle: movieTitleMap[entry.movieId] || 'Unknown',
      totalAmount: entry._sum.amount || 0,
    })),
    meta: {
      total:totalMovies,
      page,
      limit:pageSize,
      totalPage: Math.ceil(totalMovies / pageSize),
    },
  };
};

export const PurchaseServices = {
  createPurchase,
  getPurchasesByUser,
  updatePurchase,
  deletePurchase,
  getPurchaseAnalytics,
  getMovieWiseSales,
};
