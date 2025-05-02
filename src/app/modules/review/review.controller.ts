import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import {  reviewService } from './review.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';

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

// const getAllMovie = catchAsync(async (req: Request, res: Response) => {
//   const result = await movieService.getAllMovie();

//   sendResponse(res, {
//     statusCode: status.CREATED,
//     success: true,
//     message: 'Fetch all movie successfully',
//     data: result,
//   });
// });

// const updateAMovie = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await movieService.updateAMovie(id, req.body);

//   sendResponse(res, {
//     statusCode: status.CREATED,
//     success: true,
//     message: "updated movie successfully",
//     data: result,
//   });
// });

// const deleteAMovie = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await movieService.deleteAMovie(id);

//   sendResponse(res, {
//     statusCode: status.CREATED,
//     success: true,
//     message: "Movie deleted successfully",
//     data: result,
//   });
// });
export const reviewController = {
  createReview,
  getSingleReview,
  getAllReview,
  getReviewsByMovieId
  // updateAMovie,
  // deleteAMovie
};
