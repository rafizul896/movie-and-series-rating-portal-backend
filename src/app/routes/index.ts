import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import movieRoutes from '../modules/movie/movie.route';
import reviewRoutes from '../modules/review/review.route';
import { AuthRoutes } from '../modules/Auth/auth.route';

const router = Router();

const moduleRoutes = [
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
  },{
    path: '/auth',
    route: AuthRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
