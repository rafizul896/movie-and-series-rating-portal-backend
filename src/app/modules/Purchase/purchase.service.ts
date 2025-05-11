import status from 'http-status';
import prisma from '../../shared/prisma';
import AppError from '../../error/AppError';
import { Prisma } from '@prisma/client';
import { createWatchlistFromPurchase } from './purchase.utils';
import { IPaginationOptions } from '../../interface/pagination';
import { paginationHelper } from '../../helpers/paginationHelpers';

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

  await createWatchlistFromPurchase(payload?.userId,payload.movieId )

  return result;
};

const createManyPurchase = async (payloads: any[]) => {
  if (!Array.isArray(payloads) || payloads.length === 0) {
    throw new AppError(status.BAD_REQUEST, 'No purchases provided.');
  }

  // Filter out already existing purchases
  const existingPurchases = await prisma.purchase.findMany({
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
    existingPurchases.map((p) => `${p.userId}-${p.movieId}`),
  );

  const filteredPayloads = payloads.filter(
    (p) => !existingMap.has(`${p.userId}-${p.movieId}`),
  );

  if (filteredPayloads.length === 0) {
    throw new AppError(
      status.CONFLICT,
      'All selected content has already been purchased.',
    );
  }

  //  Create remaining purchases
  const result = await prisma.purchase.createMany({
    data: filteredPayloads,
    skipDuplicates: true,
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

const getPurchasesHistory = async (params: any,
  options: IPaginationOptions) => {

    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { ...filterData } = params;
  
    const andConditions: Prisma.PurchaseWhereInput[] = [];
    // Filter by purchase_type and paymentStatus
    if (Object.keys(filterData).length > 0) {
      andConditions.push({
        AND: Object.keys(filterData).map((key) => {
          return {
            [key]: {
              equals: filterData[key]
            },
          };
        }),
      });
    }
  
    const whereConditions: Prisma.PurchaseWhereInput = { AND: andConditions };
  
    const result = await prisma.purchase.findMany({
      where: whereConditions,
      select: {
        id: true,
        purchase_type: true,
        transactionId: true,
        amount: true,
        paymentStatus: true,
        accessExpiryTime: true,
        movie: {
          select:{
            title: true,
          }
        },
        users: {
          select:{
            name: true,
          }
        },

      },
      skip,
      take: limit,
      orderBy: options.sortBy && options.sortOrder
      ? { [options.sortBy]: options.sortOrder }
      : { createdAt: 'desc' },
    });
  
    const total = await prisma.purchase.count({
      where: whereConditions,
    });
  
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
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


const getPurchaseAnalytics = async () => {
  const [totalPurchases, totalRevenueAgg, rentalCount, buyCount] =
    await Promise.all([
      prisma.purchase.count(),

      prisma.purchase.aggregate({
        _sum: { amount: true },
      }),

      prisma.purchase.count({
        where: {
          purchase_type: 'RENT',
        },
      }),

      prisma.purchase.count({
        where: {
          purchase_type: 'BUY',
        },
      }),
    ]);

  return {
    totalRevenue: totalRevenueAgg._sum.amount || 0,
    totalPurchases,
    rentalCount,
    buyCount};
};

const getMovieWiseSales = async (query: any) => {
  const { startDate, endDate, searchTerm } = query;
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

  const movieIds = groupedMovieSales.map((item) => item.movieId);

  const movieData = await prisma.movie.findMany({
    where: {
      id: { in: movieIds },
      ...(searchTerm && {
        title: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      }),
    },
    select: { id: true, title: true },
  });

  const filteredMovieIds = movieData.map((movie) => movie.id);
  const movieTitleMap = movieData.reduce(
    (acc, movie) => {
      acc[movie.id] = movie.title;
      return acc;
    },
    {} as Record<string, string>,
  );

  const filteredGroupedSales = groupedMovieSales.filter((item) =>
    filteredMovieIds.includes(item.movieId),
  );

  const detailedStats = await Promise.all(
    filteredGroupedSales.map(async (entry) => {
      const movieId = entry.movieId;

      const [rentalStats, buyStats, totalPurchases] = await Promise.all([
        prisma.purchase.aggregate({
          where: {
            ...dateFilter,
            movieId,
            purchase_type: 'RENT',
          },
          _sum: { amount: true },
          _count: { _all: true },
        }),
        prisma.purchase.aggregate({
          where: {
            ...dateFilter,
            movieId,
            purchase_type: 'BUY',
          },
          _sum: { amount: true },
          _count: { _all: true },
        }),
        prisma.purchase.count({
          where: {
            ...dateFilter,
            movieId,
          },
        }),
      ]);

      return {
        movieId,
        movieTitle: movieTitleMap[movieId] || 'Unknown',
        totalAmount: entry._sum.amount || 0,
        totalRevenue: entry._sum.amount || 0,
        rentalCount: rentalStats._count._all || 0,
        buyCount: buyStats._count._all || 0,
        totalBothPurchases: totalPurchases || 0,
        totalRevenueRental: rentalStats._sum.amount || 0,
        totalRevenueBuy: buyStats._sum.amount || 0,
      };
    }),
  );

  // Pagination
  const totalMovies = detailedStats.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMovieSales = detailedStats.slice(startIndex, endIndex);

  return {
    movieWiseSales: paginatedMovieSales,
    meta: {
      total: totalMovies,
      page,
      limit: pageSize,
      totalPage: Math.ceil(totalMovies / pageSize),
    },
  };
};

export const PurchaseServices = {
  createPurchase,
  createManyPurchase,
  getPurchasesByUser,
  updatePurchase,
  deletePurchase,
  getPurchaseAnalytics,
  getMovieWiseSales,
  getPurchasesHistory
};
