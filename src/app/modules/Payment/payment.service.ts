import Stripe from 'stripe';
import config from '../../config';

const stripe = new Stripe(config.STRIPE_SECRET_KEY!);

const createStripePaymentIntent = async (amount: number) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
  });

  return { clientSecret: paymentIntent.client_secret };
};

export const paymentServices = {
  createStripePaymentIntent,
};
