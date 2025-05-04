import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import movieRoutes from '../modules/movie/movie.route';
import reviewRoutes from '../modules/review/review.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { WatchlistRoutes } from '../modules/Watchlist/watchlist.route';
import { PurchaseRoutes } from '../modules/Purchase/purchase.route';
import commentRoutes from '../modules/comment/controller.route';
import likeRoutes from '../modules/Like/like.route';
import { PaymentRoutes } from '../modules/Payment/payment.route';
import { WishlistRoutes } from '../modules/Wishlist/wishlist.route';

const router = Router();

const moduleRoutes: { path: string; route: Router }[] = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/movie',
    route: movieRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/watchlist',
    route: WatchlistRoutes,
  },
  {
    path: '/wishlist',
    route: WishlistRoutes,
  },
  {
    path: '/purchase',
    route: PurchaseRoutes,
  },
  {
    path: '/comments',
    route: commentRoutes,
  },
  {
    path: '/likes',
    route: likeRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
