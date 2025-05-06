import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { movieService } from './movie.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import pick from '../../shared/pick';

const addAMovie = catchAsync(async (req: Request, res: Response) => {
  const result = await movieService.addAMovie(req.body, req.file);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Movie added successfully',
    data: result,
  });
});

const getAllMovie = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const filters = pick(req.query, [
    'genres',
    'platforms',
    'searchTerm',
    'title',
    'rating',
  ]);
  const result = await movieService.getAllMovie(filters, options);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Retrieve all movie data successfully',
    data: result,
  });
});

const getAMovie = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req?.body?.userId;

  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await movieService.getAMovie(id, options, userId);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Retrieve movie data successfully',
    data: result,
  });
});
const updateAMovie = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await movieService.updateAMovie(id, req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Movie updated successfully',
    data: result,
  });
});

const deleteAMovie = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await movieService.deleteAMovie(id);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Movie deleted successfully',
    data: result,
  });
});
export const movieController = {
  addAMovie,
  getAllMovie,
  getAMovie,
  updateAMovie,
  deleteAMovie,
};
