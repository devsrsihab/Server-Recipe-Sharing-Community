import express, { Application } from 'express';
import cors from 'cors';
import globalErrHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/router';
import cookieParser from 'cookie-parser';
const app: Application = express();
import path from 'path';

// express parse
app.use(express.json());
app.use(cookieParser());

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(process.cwd(), 'views'));
// Serve static files from the public folder
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://client-recipe-community.vercel.app'],
    credentials: true,
  }),
);
// application routes
app.use('/api/v1', router);

// globa err handler
app.use(globalErrHandler);

// not found route
app.use(notFound);

export default app;
