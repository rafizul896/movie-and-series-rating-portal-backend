import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import {  reviewService } from './review.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { User } from '@prisma/client';
import pick from '../../shared/pick';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as User;
  const result = await reviewService.createReview(user,req.body);

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
    message: 'Review edited successfully',
    data: result,
  });
});

const approvedUnApprovedReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
const { id } = req.params;
  const result = await reviewService.approvedUnApprovedReview(user,id);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: `Review ${result?.approved === true ? 'approved': 'unapproved'} successfully`,
    data: result,
  });
});

const getReviews = catchAsync(async (req: Request, res: Response) => {
 
const filterReview = req.query.filterReview as string | undefined;
const filterComment = req.query.filterComment as string | undefined;

const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await reviewService.getReviews(options,filterReview,filterComment);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: `Retrieve  reviews successfully`,
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
  approvedUnApprovedReview,
  deleteReview,
  getReviews
};
