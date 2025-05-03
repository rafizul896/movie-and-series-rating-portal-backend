import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import {  reviewService } from './review.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { User } from '@prisma/client';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.createReview(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

const getAllReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getAllReview();

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Retrieve reviews data successfully',
    data: result,
  });
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getSingleReview(req.params.id);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Retrieve single review data successfully',
    data: result,
  });
});

const getReviewsByMovieId = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getReviewsByMovieId(req.params.movieId);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Retrieve reviews data by movieId successfully',
    data: result,
  });
});

const editReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
const { reviewId } = req.params;
  const result = await reviewService.editReview(user,reviewId, req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Retrieve reviews data by movieId successfully',
    data: result,
  });
});

const approvedReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
const { id } = req.params;
  const result = await reviewService.approvedReview(user,id);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Approved review successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as User;
const { id } = req.params;
  const result = await reviewService.deleteReview(user,id);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Review Deleted successfully',
    data: result,
  });
});

export const reviewController = {
  createReview,
  getSingleReview,
  getAllReview,
  getReviewsByMovieId,
  editReview,
  approvedReview,
  deleteReview
};
