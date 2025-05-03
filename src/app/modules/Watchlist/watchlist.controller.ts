import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { WatchlistServices } from './watchlist.service';

const createWatchlist = catchAsync(async (req, res) => {
  const result = await WatchlistServices.createWatchlist(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Watchlist is created successfully',
    data: result,
  });
});

const getAllWatchlist = catchAsync(async (req, res) => {
  const result = await WatchlistServices.getAllWatchlist(req?.user?.email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Watchlist data fetched successfully',
    data: result,
  });
});

const deleteWatchlistItem = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await WatchlistServices.deleteWatchlistItem(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Watchlist item is deleted successfully',
    data: result,
  });
});

export const WatchlistControllers = {
  createWatchlist,
  getAllWatchlist,
  deleteWatchlistItem,
};
