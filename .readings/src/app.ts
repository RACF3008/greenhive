import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

// importar routers
import { newReadingRouter } from './routes/new';
import { indexReadingsRouter } from './routes/index';

import { errorHandler, NotFoundError, currentUser } from '@greenhive/common';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

// Conectar los routers
app.use(newReadingRouter);
app.use(indexReadingsRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
