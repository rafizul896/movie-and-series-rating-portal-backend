import express, { Application, Request, Response } from 'express';
import notFound from './app/middlewares/notFound';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import { globalErrorHandler } from './app/error/globalErrorHandler';

const app: Application = express();
app.use(cors());

// parder
app.use(cookieParser());
app.use(express.json());

// application routes
app.use("/api",router)

app.get('/', (req: Request, res: Response) => {
  res.send({
    status: true,
    message: 'Movie and Series Rating Portal server is running..!',
  });
});

// for global error
app.use(globalErrorHandler);

// for not found route
app.use(notFound);

export default app;
