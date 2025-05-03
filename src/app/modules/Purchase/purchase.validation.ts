import { z } from 'zod';

const PurchaseTypeEnum = z.enum(['RENT', 'BUY']);
const PaymentStatusEnum = z.enum(['PENDING', 'PAID', 'FAILED']);

const createPurchaseZodSchema = z.object({
  body: z.object({
    purchase_type: PurchaseTypeEnum,
    userId: z.string().uuid({ message: 'Invalid user ID' }),
    movieId: z.string().uuid({ message: 'Invalid movie ID' }),
    amount: z.number().min(0, { message: 'Amount must be positive' }),
    currency: z.string().min(1, { message: 'Currency is required' }),
    paymentStatus: PaymentStatusEnum,
    transactionId: z.string().min(1, { message: 'Transaction ID is required' }),
    accessExpiryTime: z
      .string()
      .datetime({ message: 'Must be a valid datetime' })
      .optional(),
  }),
});

const updatePurchaseZodSchema = z.object({
  body: z.object({
    purchase_type: PurchaseTypeEnum.optional(),
    userId: z.string().uuid({ message: 'Invalid user ID' }).optional(),
    movieId: z.string().uuid({ message: 'Invalid movie ID' }).optional(),
    amount: z
      .number()
      .min(0, { message: 'Amount must be positive' })
      .optional(),
    currency: z.string().min(1).optional(),
    paymentStatus: PaymentStatusEnum.optional(),
    transactionId: z.string().min(1).optional(),
    accessExpiryTime: z
      .string()
      .datetime({ message: 'Must be a valid datetime' })
      .optional(),
  }),
});

export const PurchaseValidation = {
  createPurchaseZodSchema,
  updatePurchaseZodSchema,
};
