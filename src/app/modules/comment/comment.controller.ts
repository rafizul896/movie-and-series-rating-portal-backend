import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { commentService } from './controller.service';
import status from 'http-status';
import sendResponse from '../../utils/sendResponse';

const addAComment = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
  const result = await commentService.addAComment(user,req.body);

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
export const commentsController = {
  addAComment,
  getCommentsByReview
};
