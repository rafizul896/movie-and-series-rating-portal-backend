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
        approved: false,
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

// get all unapproved comment data based on filter (optional )
const getUnApprovedComments = async (options: IPaginationOptions) => {
  const whereCondition = {
    approved: false,
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

// Approve/Unpublish Comments
const approvedUnApprovedComments = async (commentsId: string[]) => {

  const result = await prisma.$transaction(async (tx) => {
    const comments = await tx.comment.findMany({
      where: {
        id: {
          in: commentsId,
        },
      },
    });

    if (!comments || comments.length === 0) {
      throw new AppError(403, 'Comments not found');
    }

    // Toggle each comment's approval
    const updatedComments = await Promise.all(
      comments.map(async (comment) => {
        return await tx.comment.update({
          where: { id: comment.id },
          data: {
            approved: !comment.approved, // toggle logic
          },
        });
      })
    );

    return updatedComments;
  });

  return result;
};


const deleteComments = async (commentIds: string[]) => {
  if (!commentIds || commentIds.length === 0) {
    throw new Error('No comment IDs provided.');
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.comment.deleteMany({
      where: {
        id: {
          in: commentIds,
        },
      },
    });

    return { message: 'Selected comments have been deleted.' };
  });

  return result;
};

export const commentService = {
  addAComment,
  getCommentsByReview,
  getUnApprovedComments,
  approvedUnApprovedComments,
};
