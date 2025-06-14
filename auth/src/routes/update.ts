import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import {
  NotFoundError,
  BadRequestError,
  requireAuth,
  validateRequest,
  currentUser,
} from "@greenhive/common";
import { User } from "../models/user";
import { UserUpdatedPublisher } from "../events/publishers/user-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/users/update",
  requireAuth,
  [
    body("firstName")
      .not()
      .isEmpty()
      .withMessage("First name must be provided"),
    body("lastName")
      .not()
      .isEmpty()
      .withMessage("At least one last name must be provided"),
    body("username")
      .isLength({ min: 8, max: 20 })
      .withMessage("Username must have more than 8 characters"),
    body("email").isEmail().withMessage("Email must be valid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Obtener los datos de la petición
    const { firstName, lastName, username, email } = req.body;

    // Obtener el usuario actual
    const user = await User.findById(req.currentUser!.id);
    if (!user) {
      throw new NotFoundError();
    }

    // Obtener los datos viejos
    const oldUsername = req.currentUser!.username;
    const oldEmail = req.currentUser!.email;

    // Verificar si el usuario ya existe y si no, actualizarlo
    const existingUsername = await User.findOne({ username });
    if (existingUsername && username !== oldUsername) {
      throw new BadRequestError("Username alredy exists");
    }
    user.username = username;

    // Verificar si el email está en uso y si no, actualizarlo
    const existingEmail = await User.findOne({ email });
    if (existingEmail && email !== oldEmail) {
      throw new BadRequestError("Email in use");
    }
    user.email = email;

    // Actualizar nombres del usuario
    user.firstName = firstName;
    user.lastName = lastName;

    await user.save();

    // Anunciar actualización de usuario
    new UserUpdatedPublisher(natsWrapper.client).publish({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      verified: user.verified,
      updatedAt: user.updatedAt,
      version: user.version,
    });

    // Enviar la respuesta
    res.status(200).send(user);
  }
);

export { router as updateRouter };
