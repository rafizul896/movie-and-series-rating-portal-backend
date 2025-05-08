import { Router } from 'express';
import { validationRequest } from '../../middlewares/validationRequest';
import { WatchlistValidation } from './wishlist.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { wishlistControllers } from './wishlist.controller';

const router = Router();

router.post(
  '/',
  validationRequest(WatchlistValidation.createWatchlistSchema),
  wishlistControllers.createWishlist,
);

router.get(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  wishlistControllers.getAllWishlistByUser,
);

router.delete('/:id', wishlistControllers.deleteWishlistItem);

router.delete(
  '/',
  auth(UserRole.ADMIN, UserRole.USER),
  wishlistControllers.deleteManyWishlistItem,
);

export const WishlistRoutes = router;
