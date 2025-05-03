import { Router } from 'express';
import { PurchaseControllers } from './purchase.controller';
import { validationRequest } from '../../middlewares/validationRequest';
import { PurchaseValidation } from './purchase.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post(
  '/',
  validationRequest(PurchaseValidation.createPurchaseZodSchema),
  PurchaseControllers.createPurchase,
);

router.get(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  PurchaseControllers.getPurchasesByUser,
);

router.patch(
  '/:id',
  validationRequest(PurchaseValidation.updatePurchaseZodSchema),
  PurchaseControllers.updatePurchase,
);

router.delete(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  PurchaseControllers.deletePurchase,
);

export const PurchaseRoutes = router;
