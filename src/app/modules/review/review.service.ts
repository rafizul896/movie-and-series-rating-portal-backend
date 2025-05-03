import { Review, User } from '@prisma/client';
import prisma from '../../shared/prisma';
import AppError from '../../error/AppError';

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
    },
  });
  return result;
};

const getReviewsByMovieId = async (movieId: string) => {
  const result = await prisma.review.findMany({
    where: {
      movieId,
    },
    include: {
      _count: {
        select: {
          likes: true,   
          comments: true 
        }
      },
      comments: {
        select: {
          id: true,
          content: true,
          userId: true
      }},
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return result;
};

const getAllReview = async () => {
  const result = await prisma.review.findMany();
  return result;
};

const editReview = async (
  user: Partial<User>,
  reviewId: string,
  payload: any,
) => {
  const result = await prisma.$transaction(async (tx) => {
    // 1. check if the user exists
    await tx.user.findUniqueOrThrow({
      where: { email: user?.email },
    });

    // 2. Find the review that belongs to the user and is not yet approved
    const review = await tx.review.findFirst({
      where: {
        id: reviewId,
        userId: user.id,
      },
    });

    if (!review) {
      throw new AppError(403, 'Review not found');
    }

    // 3. check if the review is published or not
    if (review?.approved === true) {
      throw new AppError(403, 'You cannot edit an approved review');
    }
    const { approved, ...existingReview } = payload;

    // 4. update the review
    const updatedReview = await tx.review.update({
      where: {
        id: review.id,
      },
      data: existingReview,
    });

    return updatedReview;
  });
  return result;
};

const approvedReview = async (user: Partial<User>, reviewId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    // 1. check if the user exists
    await tx.user.findUniqueOrThrow({
      where: { email: user?.email },
    });

    // 2. Find the review 
    const review = await tx.review.findFirst({
      where: {
        id: reviewId
      },
    });

    if (!review) {
      throw new AppError(403, 'Review not found');
    }

    // 3. check if the review is published or not
    if (review?.approved === true) {
      throw new AppError(403, 'The review is already approved');
    }

    // 3. update the review
    const updatedReview = await tx.review.update({
      where: {
        id: review.id,
      },
      data: {
        approved: true
      },
    });

    return updatedReview;
  });
  return result;
};

const deleteReview = async (user: Partial<User>, reviewId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    // 1. check if the user exists
    const checkUser = await tx.user.findUniqueOrThrow({
      where: { email: user?.email },
    });

    // 2. Find the review 
    const review = await tx.review.findFirst({
      where: {
        id: reviewId,
        userId: checkUser.id,
      },
    });

    if (!review) {
      throw new AppError(403, 'Review not found');
    }

    // 3. check if the review is published or not
    if (review?.approved === true) {
      throw new AppError(403, 'You cannot delete an approved review');
    }
    // 3. delete the review
    const deleteReview = await tx.review.delete({
      where: {
        id: review.id,
      }
    });

    return deleteReview;
  });
  return result;
};

export const reviewService = {
  createReview,
  getSingleReview,
  getAllReview,
  getReviewsByMovieId,
  editReview,
  approvedReview,
  deleteReview
  // updateAMovie,
  // deleteAMovie
};
