import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  validateRequest,
  BadRequestError,
  NotFoundError,
} from '@greenhive/common';
import { User } from '../models/user';
import { UserVerifyPublisher } from '../events/publishers/user-verify-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

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

    // Publicar un evento de verificación, para que el servicio de
    // correos lo procese
    new UserVerifyPublisher(natsWrapper.client).publish({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email
    })

    res.status(201).send();
  }
);

export { router as sendVerificationEmailRouter };
