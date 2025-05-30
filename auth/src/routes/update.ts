import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { NotFoundError, requireAuth, validateRequest } from '@greenhive/common';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/update',
  requireAuth,
  [
    body('firstName')
      .not()
      .isEmpty()
      .withMessage('First name must be provided'),
    body('lastName')
      .not()
      .isEmpty()
      .withMessage('At least one last name must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Obtener los datos de la petición
    const { firstName, lastName } = req.body;

    // Obtener el usuario actual
    const user = await User.findById(req.currentUser!.id);
    if (!user) {
      throw new NotFoundError();
    }

    // Actualizar el usuario
    user.firstName = firstName;
    user.lastName = lastName;
    await user.save();

    // Enviar la respuesta
    res.status(200).send(user);
  }
);

export { router as updateRouter };
