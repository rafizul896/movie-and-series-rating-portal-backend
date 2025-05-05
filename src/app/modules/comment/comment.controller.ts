import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { commentService } from './comment.service';
import status from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { User } from '@prisma/client';
import pick from '../../shared/pick';

const addAComment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
  const result = await commentService.addAComment(user, req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Comment added successfully',
    data: result,
  });
});

const getCommentsByReview = catchAsync(async (req: Request, res: Response) => {
  const result = await commentService.getCommentsByReview(req.params.reviewId);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Retrieve comments successfully',
    data: result,
  });
});

const getUnApprovedComments = catchAsync(
  async (req: Request, res: Response) => {
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await commentService.getUnApprovedComments(options);

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: `Retrieve unapproved comments successfully`,
      data: result,
    });
  },
);

const approvedUnapprovedComments = catchAsync(
  async (req: Request, res: Response) => {
    const commentIds = req.body.commentIds as string[];
    const result = await commentService.approvedUnApprovedComments(commentIds);

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: `Comments status changed successfully`, // ${result?.approved === true ? 'approved': 'unapproved'}
      data: result,
    });
  },
);

const deleteComments = catchAsync(async (req: Request, res: Response) => {
  const commentIds = req.body.commentIds as string[];
  const user = req.user as User;

  const result = await commentService.deleteComments(user,commentIds);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: `Comments deleted successfully`,
    data: result,
  });
});

const editComment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
const { commentId } = req.params;
  const result = await commentService.editComment(user,commentId, req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Comment updated successfully',
    data: result,
  });
});
export const commentsController = {
  addAComment,
  getCommentsByReview,
  getUnApprovedComments,
  approvedUnapprovedComments,
  deleteComments,
  editComment
};
