import { Router } from 'express';
import { WatchlistControllers } from './watchlist.controller';
import { validationRequest } from '../../middlewares/validationRequest';
import { WatchlistValidation } from './watchlist.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post(
  '/',
  validationRequest(WatchlistValidation.createWatchlistSchema),
  WatchlistControllers.createWatchlist,
);

router.get(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  WatchlistControllers.getAllWatchlistByUser,
);

router.delete(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  WatchlistControllers.deleteWatchlistItem,
);

export const WatchlistRoutes = router;
