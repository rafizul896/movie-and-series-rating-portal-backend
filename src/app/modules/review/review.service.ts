/* eslint-disable @typescript-eslint/no-unused-vars */
import { Review, User, UserRole } from '@prisma/client';
import prisma from '../../shared/prisma';
import AppError from '../../error/AppError';
import { IPaginationOptions } from '../../interface/pagination';
import { paginationHelper } from '../../helpers/paginationHelpers';
import { updateMovieReviewRatingStats } from '../movie/movie.utils';

const createReview = async (user: Partial<User>, payload: Review) => {
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
        userId: user.id!,
      },
    });

    if (existingReview && existingReview.approved === false) {
      throw new AppError(
        409,
        'You have already submitted a review for this movie.',
      );
    } else if (existingReview && existingReview.approved === true) {
      throw new AppError(
        409,
        'You have to wait for the admin to approve your review.',
      );
    }

    // 3. Create the review
    const createdReview = await tx.review.create({
      data: {
        ...payload,
        approved: false,
        userId: user.id!,
      },
    });

    // // 4. Update the movie's average rating and review count
    // await updateMovieReviewRatingStats(movieExists?.id);
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

// get all reviews data based on filter
const getReviews = async (
  options: IPaginationOptions,
  filterReview?: string,
  filterComment?: string,
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  // Build review filter condition
  const whereCondition: any = {};

  if (filterReview === 'approved') {
    whereCondition.approved = true;
  } else if (filterReview === 'unapproved') {
    whereCondition.approved = false;
  }

  // Build comment filter condition (only if review is approved)
  let commentWhere: any = undefined;
  if (filterReview === 'approved') {
    if (filterComment === 'approved') {
      commentWhere = { approved: true };
    } else if (filterComment === 'unapproved') {
      commentWhere = { approved: false };
    }
  }

  const result = await prisma.review.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
    select: {
      id: true,
      content: true,
      approved: true,
      createdAt: true,
      comments: commentWhere
        ? {
            where: commentWhere,
          }
        : true,
    },
  });

  const total = await prisma.review.count({
    where: whereCondition,
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
      data: {...existingReview,approved: false},
    });

    return updatedReview;
  });
  return result;
};

const approvedUnApprovedReview = async (user: Partial<User>, reviewId: string) => {
  let movieId: string = '';

  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.findFirst({
      where: { id: reviewId },
    });

    if (!review) {
      throw new AppError(403, 'Review not found');
    }

    // if (review.approved === true) {
    //   throw new AppError(403, 'The review is already approved');
    // }

    movieId = review.movieId; // Save for later use

    const updatedReview = await tx.review.update({
      where: { id: review.id },
      data: {
        approved: review.approved === false ? true : false,
      },
    });

    return updatedReview;
  });

  // Update movie stats outside the transaction
  await updateMovieReviewRatingStats(movieId);

  return result;
};

const deleteReview = async (user: Partial<User>, reviewId: string) => {
  let movieId: string = '';

  const result = await prisma.$transaction(async (tx) => {
    const checkUser = await tx.user.findUniqueOrThrow({
      where: { email: user?.email },
    });

    const isAdmin = checkUser.role === UserRole.ADMIN;

    const review = await tx.review.findFirst({
      where: {
        id: reviewId,
        ...(isAdmin ? {} : { userId: checkUser.id }),
      },
    });

    if (!review) {
      throw new AppError(404, 'Review not found');
    }

    if (!isAdmin && review.approved) {
      throw new AppError(403, 'You cannot delete an approved review');
    }

    movieId = review.movieId;
    // Delete related comments first
    await tx.comment.deleteMany({
      where: { reviewId: review.id },
    });

    return await tx.review.delete({
      where: { id: review.id },
    });
  });

  await updateMovieReviewRatingStats(movieId);

  return result;
};

export const reviewService = {
  createReview,
  getSingleReview,
  getAllReview,
  getReviewsByMovieId,
  editReview,
  approvedUnApprovedReview,
  deleteReview,
  getReviews,
};
