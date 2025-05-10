import { Router } from 'express';
import { WatchlistControllers } from './watchlist.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// router.post(
//   '/',
//   validationRequest(WatchlistValidation.createWatchlistSchema),
//   WatchlistControllers.createWatchlist,
// );

// router.get(
//   '/',
//   auth(UserRole.USER, UserRole.ADMIN),
//   WatchlistControllers.getAllWatchlistByUser,
// );

// router.delete(
//   '/:id',
//   auth(UserRole.USER, UserRole.ADMIN),
//   WatchlistControllers.deleteWatchlistItem,
// );

router.get(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  WatchlistControllers.getAllWatchlistByUser,
);

router.get(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  WatchlistControllers.getSingleWatchlistItem,
);

export const WatchlistRoutes = router;
