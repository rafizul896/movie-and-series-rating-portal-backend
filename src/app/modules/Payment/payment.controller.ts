import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { paymentServices } from './payment.service';

const createStripePaymentIntent = catchAsync(async (req, res) => {
  const { amount } = req.body;
  const result = await paymentServices.createStripePaymentIntent(
    Number(amount),
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Payment intent creation successfully.',
    data: result,
  });
});

export const paymentControllers = {
  createStripePaymentIntent,
};
