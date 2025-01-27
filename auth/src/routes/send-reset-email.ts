import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import crypto from 'crypto';

import { Token } from '../models/token';
import { User } from '../models/user';
import { ResetPasswordPublisher } from '../events/publishers/reset-password-publisher';
import { natsWrapper } from '../nats-wrapper';
import { validateRequest, BadRequestError } from '@greenhive/common';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 5 * 60;

router.post(
  '/api/users/send-reset-email',
  [body('email').isEmail().withMessage('Email must be valid')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('No user with that email');
    }

    // Crear atributos del token
    const tokenValue = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiration = new Date(now.getTime() + EXPIRATION_WINDOW_SECONDS * 1000)
    const token = Token.build({
      value: tokenValue,
      createdAt: now,
      expiresAt: expiration,
      userId: user.id,
      used: false,
    });
    await token.save();

    // Publicar el evento de creación deun token
    new ResetPasswordPublisher(natsWrapper.client).publish({
      value: tokenValue,
      createdAt: now,
      expiresAt: expiration,
      user: {
        firstName: user.firstName,
        email: user.email,
      },
    });

    res.status(201).send(token);
  }
);

export { router as sendResetEmailRouter };
