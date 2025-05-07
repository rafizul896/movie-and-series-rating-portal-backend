import status from 'http-status';
import prisma from '../../shared/prisma';
import AppError from '../../error/AppError';
import { PaymentStatus } from '@prisma/client';

// const createWatchlist = async (payload: {
//   userId: string;
//   movieId: string;
// }) => {
//   const exist = await prisma.watchlist.findFirst({
//     where: {
//       userId: payload.userId,
//       movieId: payload.movieId,
//     },
//   });

//   if (exist) {
//     throw new AppError(status.CONFLICT, 'Already in watchlist!');
//   }

//   const result = await prisma.watchlist.create({
//     data: payload,
//   });

//   return result;
// };

// const getAllWatchlistByUser = async (email: string) => {
//   const userData = await prisma.user.findUnique({
//     where: {
//       email,
//     },
//   });

//   const result = await prisma.watchlist.findMany({
//     where: {
//       userId: userData?.id,
//     },
//     select: {
//       id: true,
//       createdAt:  true,
//       updatedAt: true,
//       movies: {
//         select: {
//           id: true,
//           title: true,
//           releaseYear: true,
//           createdAt: true,
//           avgRating: true,
//           genres: true,
//           synopsis: true,
//           buyPrice: true,
//           rentPrice: true,
//           thumbnail: true,
//         },
//       },
//     },
//   });

//   return result;
// };

// const deleteWatchlistItem = async (id: string) => {
//   const result = await prisma.watchlist.delete({
//     where: {
//       id,
//     },
//   });

//   return result;
// };

const getAllPurchasedMoviesByUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const purchases = await prisma.purchase.findMany({
    where: {
      userId: user.id,
      paymentStatus: PaymentStatus.PAID,
    },
    select: {
      id: true,
      purchase_type: true,
      purchasedAt: true,
      accessExpiryTime: true,
      movie: {
        select: {
          id: true,
          title: true,
          releaseYear: true,
          createdAt: true,
          avgRating: true,
          genres: true,
          synopsis: true,
          buyPrice: true,
          rentPrice: true,
          thumbnail: true,
        },
      },
    },
  });

  return purchases;
};

const getSingleWatchlistItem = async (email: string, id: string) => {
  
  const user = await prisma.user.findUniqueOrThrow({
    where:{
      email
    }
  })

  const result = await prisma.watchlist.findFirst({
    where: {
      userId: user?.id,
      id
    },
    select: {
      id: true,
      createdAt: true,
      userId: true,
      movies: true
      // {
      //   select: {
      //     id: true,
      //     title: true,
      //     synopsis: true,
      //     genres: true,
      //     thumbnail: true,
      //     releaseYear: true,
      //   },
      // },
    },
  });

  if (!result) {
    throw new AppError(404, 'Watchlist item not found');
  }

  return result;
};


export const WatchlistServices = {
  getAllPurchasedMoviesByUser,
  getSingleWatchlistItem
};
