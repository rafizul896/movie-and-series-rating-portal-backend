import { NextFunction, Request, Response, Router } from 'express';
import { movieController } from './movie.controller';
import { multerUpload } from '../../config/multer.config';

const movieRoutes = Router();

movieRoutes.post(
  '/',
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  movieController.addAMovie,
);
movieRoutes.get('/', movieController.getAllMovie);
movieRoutes.get('/:id', movieController.getAMovie);
movieRoutes.patch('/:id', movieController.updateAMovie);
movieRoutes.delete('/soft/:id', movieController.deleteAMovie);

export default movieRoutes;
