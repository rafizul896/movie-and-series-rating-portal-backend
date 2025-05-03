import { Router } from 'express';
import { paymentControllers } from './payment.controller';

const router = Router();

router.post(
  '/create-stripe-payment-intent',
  paymentControllers.createStripePaymentIntent,
);

export const PaymentRoutes = router;
