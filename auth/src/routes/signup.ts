import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import crypto from 'crypto';

import { validateRequest, BadRequestError } from '@greenhive/common';
import { User } from '../models/user';
import { Token } from '../models/token';
import { SendVerificationEmailPublisher } from '../events/publishers/send-verification-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('firstName')
      .not()
      .isEmpty()
      .withMessage('First name must be provided'),
    body('lastName').not().isEmpty().withMessage('Last name must be provided'),
    body('username')
      .isLength({ min: 8, max: 20 })
      .withMessage('Username must have more than 8 characters'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('Password must have more than 8 characters')
      .matches(/\d/)
      .withMessage('Password must contain a number')
      .matches(/[A-Z]/)
      .withMessage('Password must contain an uppercase letter'),
    body('repeatPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Extraer componentes del body
    const { firstName, lastName, username, email, password } = req.body;

    // Verificar si el email está en uso
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new BadRequestError('Email in use');
    }

    // Verificar si el usuario ya existe
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new BadRequestError('Username alredy exists');
    }

    // Construir y guardar el nuevo usuario
    const user = User.build({
      firstName,
      lastName,
      email,
      password,
      username,
      verified: false,
    });
    await user.save();

    // Generar el token de verificación
    const tokenValue = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiration = new Date(now.getTime() + 5 * 60 * 1000)
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

    res.status(201).send(user);
  }
);

export { router as signupRouter };
