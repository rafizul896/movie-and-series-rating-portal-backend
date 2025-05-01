import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import movieRoutes from '../modules/movie/movie.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
