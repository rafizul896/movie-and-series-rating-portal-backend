import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../utils/validateRequest';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post('/refresh-token', AuthControllers.refreshToken);

export const AuthRoutes = router;
