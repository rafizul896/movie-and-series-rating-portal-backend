import { NextFunction, Request, Response, Router } from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { multerUpload } from '../../config/multer.config';

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
  multerUpload.single('file'),
  auth(UserRole.USER, UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if(req.body.data){
      req.body = JSON.parse(req.body.data);
    }
    UserControllers.updateIntoDB(req, res, next);
  },
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
