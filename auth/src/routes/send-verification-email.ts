import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import crypto from 'crypto';

import {
  validateRequest,
  BadRequestError,
  NotFoundError,
} from '@greenhive/common';
import { Token } from '../models/token';
import { User } from '../models/user';
import { SendVerificationEmailPublisher } from '../events/publishers/send-verification-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 5 * 60;

router.post(
  '/api/users/send-verification-email',
  [body('email').isEmail().withMessage('Email must be valid')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    // Verificar si el correo pertenece a un usuario registrado
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError();
    }

    // Verificar si el usuario ya ha sido verificado
    if (user.verified) {
      throw new BadRequestError('User already verified');
    }

    // Generar el token de verificación
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

    // Publicar un evento de verificación, para que el servicio de
    // correos lo procese
    new SendVerificationEmailPublisher(natsWrapper.client).publish({
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

export { router as sendVerificationEmailRouter };
