import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import crypto from 'crypto';

import { User } from '../models/user';
import { ForgotPasswordPublisher } from '../events/publishers/forgot-password-publisher';
import { natsWrapper } from '../nats-wrapper';
import { validateRequest, BadRequestError } from '@greenhive/common';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 5 * 60;

router.post(
  '/api/users/forgot-password',
  [body('email').isEmail().withMessage('Email must be valid')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      throw new BadRequestError('No user with that email');
    }

    // Publicar el evento de contraseña olvidada para crear el token y enviar el correo
    new ForgotPasswordPublisher(natsWrapper.client).publish({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });

    res.status(201).send();
  }
);

export { router as forgotPasswordRouter };
