import { Comment, User, UserStatus } from '@prisma/client';
import prisma from '../../shared/prisma';
import AppError from '../../error/AppError';
import { IPaginationOptions } from '../../interface/pagination';
import { paginationHelper } from '../../helpers/paginationHelpers';

const addAComment = async (user: Partial<User>, payload: Comment) => {
  const result = await prisma.$transaction(async (tx) => {
    // check if the user is logged in
    const userExists = await tx.user.findUnique({
      where: {
        email: user?.email,
        status: UserStatus.ACTIVE,
      },
    });

    if (!userExists) {
      throw new AppError(404, 'User not found');
    }
    // check if the review exists
    const reviewExists = await tx.review.findUnique({
      where: {
        id: payload.reviewId,
      },
    });
    if (!reviewExists) {
      throw new AppError(404, 'Review not found');
    }

    // comment on the review
    const comment = await tx.comment.create({
      data: {
        ...payload,
        userId: userExists.id,
      },
    });
    return comment;
  });
  return result;
};

const getCommentsByReview = async (reviewId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      reviewId,
    },
    select: {
      id: true,
      approved: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return comments;
};

// get all unapproved comment data based on filter
const getUnApprovedComments = async (
  options: IPaginationOptions,
) => {

  const whereCondition = {
    approved: false 
  };


  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.comment.findMany({
    where: whereCondition,
    include: {
      review: true,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  // Count total comments for pagination
  const total = await prisma.comment.count({
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

// const getApprovedComments = async (user: Partial<User>, co: string) => {

//   const result = await prisma.$transaction(async (tx) => {
//     const review = await tx.comment.findFirst({
//       where: { id: co },
//     });

//     if (!review) {
//       throw new AppError(403, 'Review not found');
//     }

//     const updatedReview = await tx.review.update({
//       where: { id: review.id },
//       data: { 
//         approved: review.approved === false ? true : false,},
//     });

//     return updatedReview;
//   });


//   return result;
// };


export const commentService = {
  addAComment,
  getCommentsByReview,
  getUnApprovedComments
};
