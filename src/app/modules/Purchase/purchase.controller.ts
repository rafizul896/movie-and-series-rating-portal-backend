import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PurchaseServices } from './purchase.service';

const createPurchase = catchAsync(async (req, res) => {
  const result = await PurchaseServices.createPurchase(req.body);

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

export const PurchaseControllers = {
  createPurchase,
  getPurchasesByUser,
  updatePurchase,
  deletePurchase,
};
