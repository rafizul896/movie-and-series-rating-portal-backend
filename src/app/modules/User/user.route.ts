import { Router } from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/', UserControllers.createUser);

router.get(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  UserControllers.getAllUsersFromDB,
);

export const UserRoutes = router;
