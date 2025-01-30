import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

// importar routers
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { verifyAccountRouter } from './routes/verify-account';
import { sendVerificationEmailRouter } from './routes/send-verification-email';
import { forgotPasswordRouter } from './routes/forgot-password';
import { resetPasswordRouter } from './routes/reset-password';

import { errorHandler, NotFoundError } from '@greenhive/common';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

// Conectar los routers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(verifyAccountRouter);
app.use(forgotPasswordRouter);
app.use(resetPasswordRouter);
app.use(sendVerificationEmailRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
