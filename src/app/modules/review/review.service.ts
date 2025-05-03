import { Review, User, UserRole } from '@prisma/client';
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

    // 2. Check if the review already exists
    const existingReview = await tx.review.findFirst({
      where: {
        movieId: payload.movieId,
        userId: payload.userId,
        approved: false, // Check for unapproved reviews
      },
    });
    if (existingReview) {
      throw new AppError(
        409,
        'You have already submitted a review for this movie.',
      );
    }

    // 3. Create the review
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
      approved: true,
    },
  });
  return result;
};

const getReviewsByMovieId = async (movieId: string) => {
  // Check if the movie exists
  const movieExists = await prisma.movie.findUnique({
    where: { id: movieId, isDeleted: false },
  });
  if (!movieExists) {
    throw new AppError(404, 'Movie not found');
  }
  const result = await prisma.review.findMany({
    where: {
      movieId,
    },
    include: {
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          userId: true,
        },
      },
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

// get all approved reviews
const getAllReview = async () => {
  const result = await prisma.review.findMany({
    where: {
      approved: true,
    },
  });
  return result;
};
// get all unapproved reviews

// edit review by user if the review is not approved
const editReview = async (
  user: Partial<User>,
  reviewId: string,
  payload: any,
) => {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Find the review that belongs to the user and is not yet approved
    const review = await tx.review.findFirst({
      where: {
        id: reviewId,
        userId: user.id,
      },
    });

    if (!review) {
      throw new AppError(403, 'Review not found');
    }

    // 2. check if the review is published or not
    if (review?.approved === true) {
      throw new AppError(403, 'You cannot edit an approved review');
    }
    const { approved, ...existingReview } = payload;

    // 3. update the review
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
    // 1. Find the review
    const review = await tx.review.findFirst({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      throw new AppError(403, 'Review not found');
    }

    // 2. check if the review is published or not
    if (review?.approved === true) {
      throw new AppError(403, 'The review is already approved');
    }

    // 3. update the review
    const updatedReview = await tx.review.update({
      where: {
        id: review.id,
      },
      data: {
        approved: true,
      },
    });

    return updatedReview;
  });
  return result;
};

const deleteReview = async (user: Partial<User>, reviewId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const checkUser = await tx.user.findUniqueOrThrow({
      where: { email: user?.email },
    });

    const isAdmin = checkUser.role === UserRole.ADMIN;

    const review = await tx.review.findFirst({
      where: {
        id: reviewId,
        ...(isAdmin ? {} : { userId: checkUser.id }), // if not admin then check userID!
      },
    });

    if (!review) {
      throw new AppError(404, 'Review not found');
    }

    if (!isAdmin && review.approved) {
      throw new AppError(403, 'You cannot delete an approved review');
    }

    // 3. delete the review
    return await tx.review.delete({
      where: { id: review.id },
    });
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
  deleteReview,
  // updateAMovie,
  // deleteAMovie
};
