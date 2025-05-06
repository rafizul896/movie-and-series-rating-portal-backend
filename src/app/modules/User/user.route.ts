import { Router } from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/', UserControllers.createUser);

router.get(
  '/',
  // auth(UserRole.USER, UserRole.ADMIN),
  UserControllers.getAllUsersFromDB,
);

router.get(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  UserControllers.getUserByIdFromDB,
);

router.patch(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  UserControllers.updateIntoDB,
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.USER),
  UserControllers.deleteFromDB,
);

router.delete(
  '/soft/:id',
  auth(UserRole.ADMIN, UserRole.USER),
  UserControllers.softDeleteFromDB,
);

export const UserRoutes = router;
