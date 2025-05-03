import { Comment, User, UserStatus } from '@prisma/client';
import prisma from '../../shared/prisma';
import AppError from '../../error/AppError';

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
export const commentService = {
  addAComment,
  getCommentsByReview,
};
