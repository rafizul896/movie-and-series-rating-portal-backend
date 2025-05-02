import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import movieRoutes from '../modules/movie/movie.route';
import reviewRoutes from '../modules/review/review.route';

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
    path: '/review',
    route: reviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
