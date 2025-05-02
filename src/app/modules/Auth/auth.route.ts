import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../utils/validateRequest';
import { AuthValidation } from './auth.validation';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post('/refresh-token', AuthControllers.refreshToken);

router.post(
  '/change-password',
  validateRequest(AuthValidation.passwordChangeSchema),
  auth(UserRole.ADMIN, UserRole.USER),
  AuthControllers.changePassword,
);

export const AuthRoutes = router;
