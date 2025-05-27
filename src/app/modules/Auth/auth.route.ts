import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';
import { validationRequest } from '../../middlewares/validationRequest';

const router = Router();

router.post(
  '/login',
  validationRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post('/refresh-token', AuthControllers.refreshToken);

router.post(
  '/change-password',
  auth(UserRole.ADMIN, UserRole.USER),
  validationRequest(AuthValidation.passwordChangeSchema),
  AuthControllers.changePassword,
);

router.post('/forgot-password', AuthControllers.forgotPassword);

router.post('/reset-password', AuthControllers.resetPassword);

export const AuthRoutes = router;
