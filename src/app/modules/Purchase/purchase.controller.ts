import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PurchaseServices } from './purchase.service';
import pick from '../../shared/pick';
import { createManyWatchlistFromPurchases } from './purchase.utils';

const createPurchase = catchAsync(async (req, res) => {
  const result = await PurchaseServices.createPurchase(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Purchase successful!',
    data: result,
  });
});
const createManyPurchase = catchAsync(async (req, res) => {
  const payloads = req.body;

   // Step 1: Create purchases
  const result = await PurchaseServices.createManyPurchase(payloads);

  // Step 2: Prepare payloads for watchlist
  const watchlistPayloads = payloads.map((p: any) => ({
    userId: p.userId,
    movieId: p.movieId,
  }));

  // Step 3: Create watchlists
  await createManyWatchlistFromPurchases(watchlistPayloads);
  
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Purchase successful!',
    data: result,
  });
});

const getPurchasesByUser = catchAsync(async (req, res) => {
  const email = req?.user?.email;
  const result = await PurchaseServices.getPurchasesByUser(email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Purchase history fetched successfully',
    data: result,
  });
});

const getPurchasesHistory = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const filters = pick(req.query, [
    'paymentStatus',
    'purchase_type',
  ]);
  const result = await PurchaseServices.getPurchasesHistory(filters,options);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Purchase history fetched successfully',
    data: result,
  });
});

const updatePurchase = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PurchaseServices.updatePurchase(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Purchase updated successfully.',
    data: result,
  });
});

const deletePurchase = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PurchaseServices.deletePurchase(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Purchase record deleted successfully.',
    data: result,
  });
});

const getPurchaseAnalytics = catchAsync(async (req, res) => {
  const result = await PurchaseServices.getPurchaseAnalytics();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Purchase analytics retrieved successfully',
    data: result,
  });
});

const getMovieWiseSales = catchAsync(async (req, res) => {
  const result = await PurchaseServices.getMovieWiseSales(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'MovieWise Sales retrieved successfully',
    data: result.movieWiseSales,
    meta: result.meta,
  });
});

export const PurchaseControllers = {
  createPurchase,
  createManyPurchase,
  getPurchasesByUser,
  updatePurchase,
  deletePurchase,
  getPurchaseAnalytics,
  getMovieWiseSales,
  getPurchasesHistory
};
