import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { wishlistServices } from './wishlist.service';

const createWishlist = catchAsync(async (req, res) => {
  const result = await wishlistServices.createWishlist(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Wishlist item is created successfully',
    data: result,
  });
});

const getAllWishlistByUser = catchAsync(async (req, res) => {
  const result = await wishlistServices.getAllWishlistByUser(req?.user?.email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Wishlist data fetched successfully',
    data: result,
  });
});

const deleteWishlistItem = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await wishlistServices.deleteWishlistItem(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Wishlist item is deleted successfully',
    data: result,
  });
});

export const wishlistControllers = {
  createWishlist,
  getAllWishlistByUser,
  deleteWishlistItem,
};
