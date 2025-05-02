import { Review } from '@prisma/client';
import prisma from '../../shared/prisma';
import AppError from '../../errors/AppError';

const createReview = async (payload: Review) => {

  const result = await prisma.$transaction(async (tx) => {
    // 1. Check if the movie exists
    const movieExists = await tx.movie.findUnique({
      where: { id: payload.movieId },
    });
    if (!movieExists) {
      throw new AppError(404, 'Movie not found');
    }

    // 2. Check if the user exists
    const userExists = await tx.user.findUnique({
      where: { id: payload.userId },
    });
    if (!userExists) {
      throw new AppError(404, 'User not found');
    }

    // 3. Check if the review already exists
    const existingReview = await tx.review.findFirst({
      where: {
        movieId: payload.movieId,
        userId: payload.userId,
      },
    });
    if (existingReview) {
      throw new AppError(
        409,
        'You have already submitted a review for this movie.',
      );
    }

    // 4. Create the review
    const createdReview = await tx.review.create({
      data: payload,
    });

    return createdReview;
  });

  return result;
};

const getSingleReview = async (reviewId: string) => {
  const result = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
    }
  });
  return result;
};

const getReviewsByMovieId = async (movieId: string) => {
  const result = await prisma.review.findMany({
    where: {
      movieId,
    }
  });
  return result;
};

const getAllReview = async () => {
  const result = await prisma.review.findMany();
  return result;
};

// const updateAMovie = async (id: string, payload: any) => {
//   await prisma.movie.findUniqueOrThrow({
//     where: {
//       id,
//       isDeleted: false,
//     },
//   });
//   const result = await prisma.movie.update({
//     where: {
//       id,
//       isDeleted: false,
//     },
//     data: payload,
//   });
//   return result;
// };

// const deleteAMovie = async (id: string) => {
//   await prisma.movie.findUniqueOrThrow({
//     where: {
//       id,
//       isDeleted: false,
//     },
//   });
//   const result = await prisma.movie.update({
//     where: {
//       id,
//       isDeleted: false,
//     },
//     data: {
//       isDeleted: true,
//     },
//   });
//   return result;
// };

export const reviewService = {
  createReview,
  getSingleReview,
  getAllReview,
  getReviewsByMovieId,
  // updateAMovie,
  // deleteAMovie
};
