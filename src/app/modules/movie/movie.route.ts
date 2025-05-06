import { NextFunction, Request, Response, Router } from 'express';
import { multerUpload } from '../../config/multer.config';
import { movieController } from './movie.controller';
import { MovieValidation } from './movie.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { validationRequest } from '../../middlewares/validationRequest';

const movieRoutes = Router();

movieRoutes.post(
  '/',
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(UserRole.ADMIN),
  validationRequest(MovieValidation.addMovieSchema),
  movieController.addAMovie,
);
movieRoutes.get('/', movieController.getAllMovie);
movieRoutes.get('/:id', movieController.getAMovie);
movieRoutes.patch('/:id',auth(UserRole.ADMIN),
validationRequest(MovieValidation.updateMovieSchema), movieController.updateAMovie);
movieRoutes.delete('/soft/:id',auth(UserRole.ADMIN), movieController.deleteAMovie);

export default movieRoutes;
