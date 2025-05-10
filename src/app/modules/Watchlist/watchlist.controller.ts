import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { WatchlistServices } from './watchlist.service';
import { Request, Response } from 'express';
import { TUser } from '../../interface/user.type';

// const createWatchlist = catchAsync(async (req, res) => {
//   const result = await WatchlistServices.createWatchlist(req.body);

//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: 'Watchlist is created successfully',
//     data: result,
//   });
// });

// const deleteWatchlistItem = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await WatchlistServices.deleteWatchlistItem(id);

//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: 'Watchlist item is deleted successfully',
//     data: result,
//   });
// });

const getAllWatchlistByUser = catchAsync(async (req:Request, res:Response) => {
  const result = await WatchlistServices.getAllPurchasedMoviesByUser(req?.user?.email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Watchlist data fetched successfully',
    data: result,
  });
});

const getSingleWatchlistItem = catchAsync(async (req:Request, res:Response) => {
  const {email} = req.user as TUser;
  const result = await WatchlistServices.getSingleWatchlistItem(email,req?.params.id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Watchlist data fetched successfully',
    data: result,
  });
});


export const WatchlistControllers = {
  getAllWatchlistByUser,
  getSingleWatchlistItem
};
