import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { wishlistServices } from './wishlist.service';
import { Request, Response } from 'express';
import { TUser } from '../../interface/user.type';

const createWishlist = catchAsync(async (req:Request, res:Response) => {
  const result = await wishlistServices.createWishlist(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Wishlist item is created successfully',
    data: result,
  });
});

const getAllWishlistByUser = catchAsync(async (req:Request, res:Response) => {
  const result = await wishlistServices.getAllWishlistByUser(req?.user?.email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Wishlist data fetched successfully',
    data: result,
  });
});

const deleteWishlistItem = catchAsync(async (req:Request, res:Response) => {
  const { id } = req.params;
  const result = await wishlistServices.deleteWishlistItem(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Wishlist item is deleted successfully',
    data: result,
  });
});

const deleteManyWishlistItem = catchAsync(async (req:Request, res:Response) => {
  const user = req.user as TUser;
  const result = await wishlistServices.deleteManyWishlistItem(user.id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Wishlist items is deleted successfully',
    data: result,
  });
});

export const wishlistControllers = {
  createWishlist,
  getAllWishlistByUser,
  deleteWishlistItem,
  deleteManyWishlistItem,
};
